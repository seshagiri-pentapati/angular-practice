import PageLayout from "../../../components/page-layout"
import CodeExample from "../../../components/code-example"
import InterviewQuestions from "../../../components/interview-questions"

export default function RepositoryPage() {
  const repositoryExamples = [
    {
      title: "Generic Repository Pattern",
      code: `// Generic repository interface
export interface Repository<T, ID> {
  findAll(): Observable<T[]>;
  findById(id: ID): Observable<T | null>;
  create(entity: Omit<T, 'id'>): Observable<T>;
  update(id: ID, entity: Partial<T>): Observable<T>;
  delete(id: ID): Observable<boolean>;
  findBy(criteria: Partial<T>): Observable<T[]>;
}

// Base repository implementation
export abstract class BaseRepository<T, ID> implements Repository<T, ID> {
  constructor(
    protected http: HttpClient,
    protected baseUrl: string
  ) {}

  findAll(): Observable<T[]> {
    return this.http.get<T[]>(this.baseUrl).pipe(
      catchError(this.handleError<T[]>('findAll', []))
    );
  }

  findById(id: ID): Observable<T | null> {
    return this.http.get<T>(${"`${this.baseUrl}/${id}`"}).pipe(
      catchError(this.handleError<T>('findById', null))
    );
  }

  create(entity: Omit<T, 'id'>): Observable<T> {
    return this.http.post<T>(this.baseUrl, entity).pipe(
      catchError(this.handleError<T>('create'))
    );
  }

  update(id: ID, entity: Partial<T>): Observable<T> {
    return this.http.put<T>(${"`${this.baseUrl}/${id}`"}, entity).pipe(
      catchError(this.handleError<T>('update'))
    );
  }

  delete(id: ID): Observable<boolean> {
    return this.http.delete(${"`${this.baseUrl}/${id}`"}).pipe(
      map(() => true),
      catchError(this.handleError<boolean>('delete', false))
    );
  }

  findBy(criteria: Partial<T>): Observable<T[]> {
    const params = new HttpParams({ fromObject: criteria as any });
    return this.http.get<T[]>(${"`${this.baseUrl}/search`"}, { params }).pipe(
      catchError(this.handleError<T[]>('findBy', []))
    );
  }

  protected handleError<TResult>(operation = 'operation', result?: TResult) {
    return (error: any): Observable<TResult> => {
      console.error(${"`${operation} failed: ${error.message}`"});
      return of(result as TResult);
    };
  }
}

// User entity and repository
export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}

@Injectable({
  providedIn: 'root'
})
export class UserRepository extends BaseRepository<User, number> {
  constructor(http: HttpClient) {
    super(http, '/api/users');
  }

  findByEmail(email: string): Observable<User | null> {
    return this.http.get<User>(${"`${this.baseUrl}/email/${email}`"}).pipe(
      catchError(this.handleError<User>('findByEmail', null))
    );
  }

  findByRole(role: string): Observable<User[]> {
    return this.http.get<User[]>(${"`${this.baseUrl}/role/${role}`"}).pipe(
      catchError(this.handleError<User[]>('findByRole', []))
    );
  }

  updatePassword(id: number, newPassword: string): Observable<boolean> {
    return this.http.patch(${"`${this.baseUrl}/${id}/password`"}, { password: newPassword }).pipe(
      map(() => true),
      catchError(this.handleError<boolean>('updatePassword', false))
    );
  }

  getActiveUsers(): Observable<User[]> {
    return this.http.get<User[]>(${"`${this.baseUrl}/active`"}).pipe(
      catchError(this.handleError<User[]>('getActiveUsers', []))
    );
  }
}`,
    },
    {
      title: "Cached Repository Implementation",
      code: `// Cache service for repositories
@Injectable({
  providedIn: 'root'
})
export class CacheService {
  private cache = new Map<string, { data: any; timestamp: number; ttl: number }>();

  set(key: string, data: any, ttlMinutes: number = 5): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl: ttlMinutes * 60 * 1000
    });
  }

  get<T>(key: string): T | null {
    const cached = this.cache.get(key);
    
    if (!cached) {
      return null;
    }

    if (Date.now() - cached.timestamp > cached.ttl) {
      this.cache.delete(key);
      return null;
    }

    return cached.data;
  }

  delete(key: string): void {
    this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }
}

// Cached repository implementation
export abstract class CachedRepository<T, ID> extends BaseRepository<T, ID> {
  constructor(
    http: HttpClient,
    baseUrl: string,
    protected cacheService: CacheService,
    protected cacheTtl: number = 5 // minutes
  ) {
    super(http, baseUrl);
  }

  override findAll(): Observable<T[]> {
    const cacheKey = ${"`${this.baseUrl}:all`"};
    const cached = this.cacheService.get<T[]>(cacheKey);
    
    if (cached) {
      return of(cached);
    }

    return super.findAll().pipe(
      tap(data => this.cacheService.set(cacheKey, data, this.cacheTtl))
    );
  }

  override findById(id: ID): Observable<T | null> {
    const cacheKey = ${"`${this.baseUrl}:${id}`"};
    const cached = this.cacheService.get<T>(cacheKey);
    
    if (cached) {
      return of(cached);
    }

    return super.findById(id).pipe(
      tap(data => {
        if (data) {
          this.cacheService.set(cacheKey, data, this.cacheTtl);
        }
      })
    );
  }
}`,
    },
    {
      title: "Unit of Work Pattern",
      code: `// Unit of Work pattern with repositories
export interface UnitOfWork {
  userRepository: UserRepository;
  productRepository: ProductRepository;
  
  beginTransaction(): void;
  commit(): Observable<boolean>;
  rollback(): void;
  saveChanges(): Observable<boolean>;
}

@Injectable({
  providedIn: 'root'
})
export class UnitOfWorkService implements UnitOfWork {
  private changes: Array<{ 
    type: 'create' | 'update' | 'delete'; 
    entity: any; 
    repository: string 
  }> = [];
  private inTransaction = false;

  constructor(
    public userRepository: UserRepository,
    public productRepository: ProductRepository,
    private http: HttpClient
  ) {}

  beginTransaction(): void {
    this.inTransaction = true;
    this.changes = [];
  }

  commit(): Observable<boolean> {
    if (!this.inTransaction || this.changes.length === 0) {
      return of(true);
    }

    return this.http.post<boolean>('/api/batch', {
      operations: this.changes
    }).pipe(
      tap(success => {
        if (success) {
          this.changes = [];
          this.inTransaction = false;
        }
      }),
      catchError(() => {
        this.rollback();
        return of(false);
      })
    );
  }

  rollback(): void {
    this.changes = [];
    this.inTransaction = false;
  }

  saveChanges(): Observable<boolean> {
    return this.commit();
  }

  trackChange(type: 'create' | 'update' | 'delete', entity: any, repository: string): void {
    if (this.inTransaction) {
      this.changes.push({ type, entity, repository });
    }
  }
}`,
    },
  ]

  const interviewQuestions = [
    {
      question: "What is the Repository pattern and why is it useful in Angular?",
      answer:
        "The Repository pattern encapsulates data access logic and provides a uniform interface for accessing domain objects. In Angular, it separates business logic from data access, makes testing easier with mock repositories, centralizes data access logic, and provides a consistent API regardless of the data source (HTTP, local storage, etc.).",
    },
    {
      question: "How do you implement a generic repository in Angular?",
      answer:
        "Create a generic interface with common CRUD operations using TypeScript generics. Implement a base repository class that handles HTTP operations, error handling, and common functionality. Extend this base class for specific entities, adding custom methods as needed. Use dependency injection to provide repositories to components and services.",
    },
    {
      question: "What's the difference between Repository and DAO patterns?",
      answer:
        "Repository pattern focuses on domain objects and business logic, providing a collection-like interface. DAO (Data Access Object) pattern focuses on data persistence and provides a more direct mapping to database operations. Repository is more domain-driven, while DAO is more data-centric.",
    },
    {
      question: "How do you handle caching in repository implementations?",
      answer:
        "Implement a cache service with TTL support, extend repositories to check cache before making HTTP requests, invalidate cache on create/update/delete operations, use cache keys based on entity type and parameters, and provide cache management methods for manual cache control.",
    },
    {
      question: "What is the Unit of Work pattern and how does it work with repositories?",
      answer:
        "Unit of Work maintains a list of objects affected by business transactions and coordinates writing out changes. It works with repositories by tracking changes across multiple repositories, providing transaction boundaries, ensuring data consistency, and allowing batch operations for better performance.",
    },
    {
      question: "How do you test repository implementations in Angular?",
      answer:
        "Use HttpClientTestingModule to mock HTTP requests, create mock repository implementations for unit tests, test both success and error scenarios, verify HTTP calls with expected parameters, use spies to track method calls, and test caching behavior separately.",
    },
    {
      question: "When should you use Repository pattern vs direct HTTP service calls?",
      answer:
        "Use Repository pattern for: complex data access logic, multiple data sources, caching requirements, business domain focus, testing isolation. Use direct HTTP calls for: simple CRUD operations, single data source, minimal business logic, rapid prototyping, or when the overhead isn't justified.",
    },
    {
      question: "How do you handle relationships between entities in repositories?",
      answer:
        "Use separate methods for loading related data, implement lazy loading with observables, provide options for eager loading, use join queries when supported by the backend, maintain referential integrity in cache, and consider using specialized query objects for complex relationships.",
    },
  ]

  return (
    <PageLayout
      title="Repository Pattern"
      description="Master the Repository pattern in Angular for clean data access and domain-driven design"
    >
      <div className="space-y-8">
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-cyan-400">Overview</h2>
          <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700">
            <p className="text-slate-300 leading-relaxed mb-4">
              The Repository pattern encapsulates the logic needed to access data sources. It centralizes common data
              access functionality, providing better maintainability and decoupling the infrastructure or technology
              used to access databases from the domain model layer.
            </p>
            <div className="grid md:grid-cols-2 gap-4 mt-6">
              <div className="bg-slate-900/50 p-4 rounded border border-slate-600">
                <h3 className="font-semibold text-pink-400 mb-2">Key Benefits</h3>
                <ul className="text-sm text-slate-300 space-y-1">
                  <li>• Centralized data access logic</li>
                  <li>• Testability with mock implementations</li>
                  <li>• Consistent API across data sources</li>
                  <li>• Separation of concerns</li>
                  <li>• Caching and optimization</li>
                  <li>• Domain-driven design support</li>
                </ul>
              </div>
              <div className="bg-slate-900/50 p-4 rounded border border-slate-600">
                <h3 className="font-semibold text-pink-400 mb-2">Implementation Types</h3>
                <ul className="text-sm text-slate-300 space-y-1">
                  <li>• Generic Repository</li>
                  <li>• Specific Entity Repository</li>
                  <li>• Cached Repository</li>
                  <li>• Unit of Work Repository</li>
                  <li>• Query Object Repository</li>
                  <li>• Specification Repository</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-cyan-400">Code Examples</h2>
          <div className="space-y-6">
            {repositoryExamples.map((example, index) => (
              <CodeExample key={index} title={example.title} code={example.code} language="typescript" />
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-cyan-400">Interview Questions</h2>
          <InterviewQuestions questions={interviewQuestions} />
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-cyan-400">Best Practices</h2>
          <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-pink-400 mb-3">Do's</h3>
                <ul className="text-slate-300 space-y-2">
                  <li>• Use generic interfaces for common operations</li>
                  <li>• Implement proper error handling</li>
                  <li>• Add caching for frequently accessed data</li>
                  <li>• Use dependency injection for repositories</li>
                  <li>• Provide both sync and async methods</li>
                  <li>• Document repository contracts clearly</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-pink-400 mb-3">Don'ts</h3>
                <ul className="text-slate-300 space-y-2">
                  <li>• Don't expose implementation details</li>
                  <li>• Don't mix business logic with data access</li>
                  <li>• Don't ignore transaction boundaries</li>
                  <li>• Don't create overly complex query methods</li>
                  <li>• Don't forget to handle edge cases</li>
                  <li>• Don't skip validation in repositories</li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </div>
    </PageLayout>
  )
}
