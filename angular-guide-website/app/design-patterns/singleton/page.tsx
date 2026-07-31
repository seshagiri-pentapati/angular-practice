import PageLayout from "../../../components/page-layout"
import CodeExample from "../../../components/code-example"
import InterviewQuestions from "../../../components/interview-questions"

export default function SingletonPage() {
  const singletonExamples = [
    {
      title: "Singleton Service Pattern",
      code: `// Singleton Service using providedIn: 'root'
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root' // Creates singleton instance
})
export class UserService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  
  private users: User[] = [];
  private static instance: UserService;

  constructor() {
    // Ensure only one instance exists
    if (UserService.instance) {
      return UserService.instance;
    }
    UserService.instance = this;
    this.loadUsers();
  }

  private loadUsers() {
    // Load users from API or storage
    console.log('Loading users - this should only happen once');
  }

  getCurrentUser(): Observable<User | null> {
    return this.currentUser$;
  }

  setCurrentUser(user: User | null): void {
    this.currentUserSubject.next(user);
  }

  getAllUsers(): User[] {
    return this.users;
  }

  addUser(user: User): void {
    this.users.push(user);
  }
}

// Configuration Service Singleton
@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  private config: AppConfig | null = null;
  private configLoaded = false;

  constructor(private http: HttpClient) {}

  async loadConfig(): Promise<AppConfig> {
    if (this.configLoaded && this.config) {
      return this.config;
    }

    try {
      this.config = await this.http.get<AppConfig>('/api/config').toPromise();
      this.configLoaded = true;
      return this.config;
    } catch (error) {
      console.error('Failed to load configuration:', error);
      throw error;
    }
  }

  getConfig(): AppConfig | null {
    return this.config;
  }

  getSetting(key: string): any {
    return this.config?.[key];
  }
}

// Logger Service Singleton
@Injectable({
  providedIn: 'root'
})
export class LoggerService {
  private logs: LogEntry[] = [];
  private maxLogs = 1000;

  constructor() {
    console.log('LoggerService instance created');
  }

  log(level: LogLevel, message: string, data?: any): void {
    const entry: LogEntry = {
      timestamp: new Date(),
      level,
      message,
      data
    };

    this.logs.push(entry);
    
    // Keep only recent logs
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs);
    }

    // Output to console based on level
    switch (level) {
      case LogLevel.ERROR:
        console.error(message, data);
        break;
      case LogLevel.WARN:
        console.warn(message, data);
        break;
      case LogLevel.INFO:
        console.info(message, data);
        break;
      case LogLevel.DEBUG:
        console.debug(message, data);
        break;
    }
  }

  error(message: string, data?: any): void {
    this.log(LogLevel.ERROR, message, data);
  }

  warn(message: string, data?: any): void {
    this.log(LogLevel.WARN, message, data);
  }

  info(message: string, data?: any): void {
    this.log(LogLevel.INFO, message, data);
  }

  debug(message: string, data?: any): void {
    this.log(LogLevel.DEBUG, message, data);
  }

  getLogs(): LogEntry[] {
    return [...this.logs];
  }

  clearLogs(): void {
    this.logs = [];
  }
}

// Usage in Components
@Component({
  selector: 'app-user-profile',
  template: \`
    <div class="user-profile">
      <h3>User Profile</h3>
      <div *ngIf="currentUser$ | async as user">
        <p>Name: {{ user.name }}</p>
        <p>Email: {{ user.email }}</p>
      </div>
      <button (click)="updateUser()">Update User</button>
    </div>
  \`
})
export class UserProfileComponent implements OnInit {
  currentUser$: Observable<User | null>;

  constructor(
    private userService: UserService,
    private logger: LoggerService
  ) {
    this.currentUser$ = this.userService.getCurrentUser();
  }

  ngOnInit() {
    this.logger.info('UserProfileComponent initialized');
  }

  updateUser() {
    const updatedUser = { id: 1, name: 'Updated User', email: 'updated@example.com' };
    this.userService.setCurrentUser(updatedUser);
    this.logger.info('User updated', updatedUser);
  }
}

// Multiple components using the same singleton service
@Component({
  selector: 'app-user-list',
  template: \`
    <div class="user-list">
      <h3>User List</h3>
      <div *ngFor="let user of users">
        {{ user.name }} - {{ user.email }}
      </div>
      <div *ngIf="currentUser$ | async as currentUser" class="current-user">
        Current User: {{ currentUser.name }}
      </div>
    </div>
  \`
})
export class UserListComponent implements OnInit {
  users: User[] = [];
  currentUser$: Observable<User | null>;

  constructor(
    private userService: UserService, // Same singleton instance
    private logger: LoggerService     // Same singleton instance
  ) {
    this.currentUser$ = this.userService.getCurrentUser();
  }

  ngOnInit() {
    this.users = this.userService.getAllUsers();
    this.logger.info('UserListComponent initialized');
  }
}

// Types
interface User {
  id: number;
  name: string;
  email: string;
}

interface AppConfig {
  apiUrl: string;
  version: string;
  features: string[];
}

interface LogEntry {
  timestamp: Date;
  level: LogLevel;
  message: string;
  data?: any;
}

enum LogLevel {
  ERROR = 'ERROR',
  WARN = 'WARN',
  INFO = 'INFO',
  DEBUG = 'DEBUG'
}`,
    },
    {
      title: "Module-level Singleton Pattern",
      code: `// Feature Module with Singleton Services
import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';

// Service that should be singleton at module level
@Injectable()
export class FeatureService {
  private data: any[] = [];
  
  constructor() {
    console.log('FeatureService instance created');
  }

  addData(item: any): void {
    this.data.push(item);
  }

  getData(): any[] {
    return this.data;
  }
}

// Feature module with forRoot pattern for singleton
@NgModule({
  declarations: [
    FeatureComponent,
    FeatureListComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    FeatureComponent,
    FeatureListComponent
  ]
})
export class FeatureModule {
  // forRoot ensures singleton instance across the app
  static forRoot(): ModuleWithProviders<FeatureModule> {
    return {
      ngModule: FeatureModule,
      providers: [
        FeatureService, // Singleton at root level
        {
          provide: 'FEATURE_CONFIG',
          useValue: { version: '1.0.0' }
        }
      ]
    };
  }

  // forChild for lazy-loaded modules (no providers)
  static forChild(): ModuleWithProviders<FeatureModule> {
    return {
      ngModule: FeatureModule,
      providers: [] // No providers to avoid multiple instances
    };
  }
}

// App Module - imports with forRoot
@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    FeatureModule.forRoot() // Creates singleton instance
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

// Lazy-loaded module - imports with forChild
@NgModule({
  imports: [
    CommonModule,
    FeatureModule.forChild() // Uses existing singleton
  ]
})
export class LazyModule { }

// Custom Singleton Factory
export function createSingletonService(): SingletonService {
  return SingletonService.getInstance();
}

@Injectable()
export class SingletonService {
  private static instance: SingletonService;
  private data: Map<string, any> = new Map();

  private constructor() {
    // Private constructor prevents direct instantiation
  }

  static getInstance(): SingletonService {
    if (!SingletonService.instance) {
      SingletonService.instance = new SingletonService();
    }
    return SingletonService.instance;
  }

  set(key: string, value: any): void {
    this.data.set(key, value);
  }

  get(key: string): any {
    return this.data.get(key);
  }

  has(key: string): boolean {
    return this.data.has(key);
  }

  clear(): void {
    this.data.clear();
  }
}

// Provider configuration for custom singleton
@NgModule({
  providers: [
    {
      provide: SingletonService,
      useFactory: createSingletonService
    }
  ]
})
export class AppModule { }

// Singleton with Initialization
@Injectable({
  providedIn: 'root'
})
export class InitializableService {
  private initialized = false;
  private initPromise: Promise<void> | null = null;

  constructor(private http: HttpClient) {}

  async initialize(): Promise<void> {
    if (this.initialized) {
      return Promise.resolve();
    }

    if (this.initPromise) {
      return this.initPromise;
    }

    this.initPromise = this.performInitialization();
    await this.initPromise;
    this.initialized = true;
  }

  private async performInitialization(): Promise<void> {
    try {
      // Perform initialization tasks
      await this.loadConfiguration();
      await this.setupConnections();
      console.log('Service initialized successfully');
    } catch (error) {
      console.error('Service initialization failed:', error);
      throw error;
    }
  }

  private async loadConfiguration(): Promise<void> {
    // Load configuration
    return new Promise(resolve => setTimeout(resolve, 1000));
  }

  private async setupConnections(): Promise<void> {
    // Setup connections
    return new Promise(resolve => setTimeout(resolve, 500));
  }

  isInitialized(): boolean {
    return this.initialized;
  }
}

// App Initializer for Singleton Service
export function initializeApp(service: InitializableService): () => Promise<void> {
  return () => service.initialize();
}

@NgModule({
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: initializeApp,
      deps: [InitializableService],
      multi: true
    }
  ]
})
export class AppModule { }`,
    },
  ]

  const interviewQuestions = [
    {
      question: "What is the Singleton pattern and how is it implemented in Angular?",
      answer:
        "The Singleton pattern ensures a class has only one instance and provides global access to it. In Angular, it's implemented using 'providedIn: root' in the @Injectable decorator, which creates a single instance shared across the entire application. Angular's dependency injection system manages the singleton lifecycle automatically.",
    },
    {
      question: "What's the difference between providedIn: 'root' and providing a service in a module?",
      answer:
        "'providedIn: root' creates a tree-shakable singleton available app-wide, while module-provided services create instances scoped to that module and its children. Root-provided services are preferred for global state and utilities, while module-scoped services are useful for feature-specific functionality.",
    },
    {
      question: "How do you ensure a service remains singleton when using lazy-loaded modules?",
      answer:
        "Use the forRoot/forChild pattern: forRoot() provides the service instance in the root module, while forChild() in lazy modules doesn't provide the service, ensuring they use the existing singleton. Alternatively, use 'providedIn: root' which automatically handles this scenario.",
    },
    {
      question: "What are the benefits and drawbacks of the Singleton pattern in Angular?",
      answer:
        "Benefits: shared state management, memory efficiency, consistent configuration, global access. Drawbacks: tight coupling, difficult testing, potential memory leaks, hidden dependencies. Use singletons for services that truly need global state like authentication, logging, or configuration.",
    },
    {
      question: "How do you test Angular singleton services?",
      answer:
        "Use TestBed.configureTestingModule() to provide mock services, use spyOn() for method testing, reset service state between tests, use dependency injection to provide test doubles, and consider using TestBed.overrideProvider() for replacing singleton instances in tests.",
    },
    {
      question: "Can you create multiple instances of a singleton service in Angular?",
      answer:
        "Yes, by providing the service at component level or using factory functions. However, this breaks the singleton pattern. To maintain singleton behavior, always use 'providedIn: root' or provide only at the root module level, and avoid providing the same service at multiple levels.",
    },
    {
      question: "How do you handle initialization of singleton services in Angular?",
      answer:
        "Use APP_INITIALIZER to initialize services before app startup, implement initialization methods that return promises, use constructor for simple initialization, or lazy initialize on first use. For complex initialization, consider using factory functions or async initialization patterns.",
    },
    {
      question: "What's the relationship between Angular's dependency injection and the Singleton pattern?",
      answer:
        "Angular's DI container manages singleton instances automatically. When you inject a service, DI provides the same instance throughout the application (if configured as singleton). The DI system handles creation, lifecycle, and disposal of singleton services, making the pattern transparent to developers.",
    },
  ]

  return (
    <PageLayout
      title="Singleton Pattern"
      description="Master the Singleton pattern in Angular for managing shared state and global services"
    >
      <div className="space-y-8">
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-cyan-400">Overview</h2>
          <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700">
            <p className="text-slate-300 leading-relaxed mb-4">
              The Singleton pattern ensures that a class has only one instance throughout the application lifecycle and
              provides a global point of access to that instance. In Angular, this pattern is commonly used for services
              that manage shared state, configuration, or provide utility functions across the entire application.
            </p>
            <div className="grid md:grid-cols-2 gap-4 mt-6">
              <div className="bg-slate-900/50 p-4 rounded border border-slate-600">
                <h3 className="font-semibold text-pink-400 mb-2">When to Use Singleton</h3>
                <ul className="text-sm text-slate-300 space-y-1">
                  <li>• Global state management</li>
                  <li>• Configuration services</li>
                  <li>• Logging services</li>
                  <li>• Authentication services</li>
                  <li>• HTTP client wrappers</li>
                  <li>• Cache management</li>
                </ul>
              </div>
              <div className="bg-slate-900/50 p-4 rounded border border-slate-600">
                <h3 className="font-semibold text-pink-400 mb-2">Angular Implementation</h3>
                <ul className="text-sm text-slate-300 space-y-1">
                  <li>
                    • <code>providedIn: 'root'</code>
                  </li>
                  <li>• Module providers</li>
                  <li>• forRoot/forChild pattern</li>
                  <li>• Factory functions</li>
                  <li>• APP_INITIALIZER</li>
                  <li>• Dependency injection</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-cyan-400">Code Examples</h2>
          <div className="space-y-6">
            {singletonExamples.map((example, index) => (
              <CodeExample key={index} title={example.title} code={example.code} language="typescript" />
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-cyan-400">Interview Questions</h2>
          <InterviewQuestions questions={interviewQuestions} />
        </section>
      </div>
    </PageLayout>
  )
}
