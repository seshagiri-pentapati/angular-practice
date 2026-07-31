import { PageLayout } from "@/components/page-layout"
import { CodeExample } from "@/components/code-example"
import { InterviewQuestions } from "@/components/interview-questions"

export default function HttpClientPage() {
  const httpExamples = [
    {
      title: "Basic HTTP Service",
      code: `import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

export interface User {
  id: number;
  name: string;
  email: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'https://api.example.com/users';

  constructor(private http: HttpClient) {}

  // GET request
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl)
      .pipe(
        retry(3),
        catchError(this.handleError)
      );
  }

  // GET with parameters
  getUserById(id: number): Observable<User> {
    const params = new HttpParams().set('include', 'profile');
    return this.http.get<User>(\`\${this.apiUrl}/\${id}\`, { params });
  }

  // POST request
  createUser(user: Partial<User>): Observable<User> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.getToken()
    });

    return this.http.post<User>(this.apiUrl, user, { headers })
      .pipe(catchError(this.handleError));
  }

  // PUT request
  updateUser(id: number, user: Partial<User>): Observable<User> {
    return this.http.put<User>(\`\${this.apiUrl}/\${id}\`, user)
      .pipe(catchError(this.handleError));
  }

  // DELETE request
  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(\`\${this.apiUrl}/\${id}\`)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: any) {
    console.error('API Error:', error);
    return throwError(() => new Error('Something went wrong'));
  }

  private getToken(): string {
    return localStorage.getItem('token') || '';
  }
}`,
    },
    {
      title: "HTTP Interceptor",
      code: `import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { LoadingService } from './loading.service';
import { AuthService } from './auth.service';

@Injectable()
export class HttpInterceptorService implements HttpInterceptor {
  
  constructor(
    private loadingService: LoadingService,
    private authService: AuthService
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Show loading spinner
    this.loadingService.show();

    // Add authentication token
    const token = this.authService.getToken();
    let authReq = req;
    
    if (token) {
      authReq = req.clone({
        setHeaders: {
          Authorization: \`Bearer \${token}\`,
          'Content-Type': 'application/json'
        }
      });
    }

    // Add base URL if not present
    if (!authReq.url.startsWith('http')) {
      authReq = authReq.clone({
        url: \`https://api.example.com/\${authReq.url}\`
      });
    }

    return next.handle(authReq).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          this.authService.logout();
        }
        return throwError(() => error);
      }),
      finalize(() => {
        this.loadingService.hide();
      })
    );
  }
}

// Register in app.module.ts
import { HTTP_INTERCEPTORS } from '@angular/common/http';

@NgModule({
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpInterceptorService,
      multi: true
    }
  ]
})
export class AppModule {}`,
    },
    {
      title: "Component Using HTTP Service",
      code: `import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { UserService, User } from './user.service';

@Component({
  selector: 'app-user-list',
  template: \`
    <div class="user-list">
      <h2>Users</h2>
      
      <div *ngIf="loading" class="loading">Loading...</div>
      
      <div *ngIf="error" class="error">
        {{ error }}
        <button (click)="loadUsers()">Retry</button>
      </div>
      
      <div *ngFor="let user of users" class="user-card">
        <h3>{{ user.name }}</h3>
        <p>{{ user.email }}</p>
        <button (click)="editUser(user)">Edit</button>
        <button (click)="deleteUser(user.id)">Delete</button>
      </div>
      
      <button (click)="addUser()" class="add-btn">Add User</button>
    </div>
  \`,
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit, OnDestroy {
  users: User[] = [];
  loading = false;
  error: string | null = null;
  private destroy$ = new Subject<void>();

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.loadUsers();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadUsers() {
    this.loading = true;
    this.error = null;

    this.userService.getUsers()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (users) => {
          this.users = users;
          this.loading = false;
        },
        error: (error) => {
          this.error = 'Failed to load users';
          this.loading = false;
          console.error('Error loading users:', error);
        }
      });
  }

  deleteUser(id: number) {
    if (confirm('Are you sure?')) {
      this.userService.deleteUser(id)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.users = this.users.filter(u => u.id !== id);
          },
          error: (error) => {
            this.error = 'Failed to delete user';
            console.error('Error deleting user:', error);
          }
        });
    }
  }

  editUser(user: User) {
    // Navigate to edit form or open modal
  }

  addUser() {
    // Navigate to add form or open modal
  }
}`,
    },
  ]

  const interviewQuestions = [
    {
      question: "What is HttpClient and how do you use it in Angular?",
      answer:
        "HttpClient is Angular's mechanism for communicating with remote servers over HTTP. It's imported from @angular/common/http and provides methods like get(), post(), put(), delete(). It returns Observables and supports features like request/response interception, error handling, and request cancellation.",
    },
    {
      question: "How do HTTP Interceptors work in Angular?",
      answer:
        "HTTP Interceptors allow you to intercept and modify HTTP requests and responses globally. They implement the HttpInterceptor interface with an intercept() method. Common use cases include adding authentication tokens, logging, error handling, and loading indicators. Multiple interceptors can be chained together.",
    },
    {
      question: "What's the difference between HttpClient and HttpClientModule?",
      answer:
        "HttpClientModule is the module you import in your app.module.ts to make HttpClient available for dependency injection. HttpClient is the actual service you inject into components/services to make HTTP requests. You need to import HttpClientModule once, then inject HttpClient wherever needed.",
    },
    {
      question: "How do you handle HTTP errors in Angular?",
      answer:
        "HTTP errors can be handled using the catchError operator from RxJS. You can handle errors at the service level (global error handling) or component level (specific error handling). Common patterns include retry logic, user-friendly error messages, and fallback responses.",
    },
    {
      question: "What are HTTP Headers and how do you set them?",
      answer:
        "HTTP Headers provide additional information about the request or response. In Angular, you can set headers using HttpHeaders class or directly in the request options. Common headers include Content-Type, Authorization, Accept, and custom headers for API keys or tracking.",
    },
  ]

  return (
    <PageLayout
      title="HTTP Client & Interceptors"
      description="Master HTTP communication in Angular with HttpClient, interceptors, and error handling"
      previousPage={{ href: "/fundamentals/forms", title: "Forms" }}
      nextPage={{ href: "/intermediate/rxjs", title: "RxJS & Observables" }}
    >
      <div className="space-y-8">
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Theory Overview</h2>
          <div className="prose prose-gray max-w-none">
            <p>
              Angular's HttpClient is a powerful service for making HTTP requests to backend APIs. It provides a
              simplified API for HTTP functionality, built on top of the XMLHttpRequest interface exposed by browsers.
            </p>

            <h3>Key Features:</h3>
            <ul>
              <li>
                <strong>Observable-based:</strong> All methods return RxJS Observables
              </li>
              <li>
                <strong>Request/Response Interception:</strong> Modify requests and responses globally
              </li>
              <li>
                <strong>Typed Responses:</strong> Strong typing support with TypeScript
              </li>
              <li>
                <strong>Error Handling:</strong> Built-in error handling mechanisms
              </li>
              <li>
                <strong>Request Cancellation:</strong> Cancel requests using unsubscribe
              </li>
              <li>
                <strong>Progress Events:</strong> Track upload/download progress
              </li>
            </ul>

            <h3>HTTP Methods:</h3>
            <ul>
              <li>
                <strong>GET:</strong> Retrieve data from server
              </li>
              <li>
                <strong>POST:</strong> Send data to server to create resource
              </li>
              <li>
                <strong>PUT:</strong> Update existing resource completely
              </li>
              <li>
                <strong>PATCH:</strong> Partially update existing resource
              </li>
              <li>
                <strong>DELETE:</strong> Remove resource from server
              </li>
              <li>
                <strong>HEAD:</strong> Get headers without response body
              </li>
              <li>
                <strong>OPTIONS:</strong> Get allowed methods for resource
              </li>
            </ul>

            <h3>HTTP Interceptors:</h3>
            <p>
              Interceptors provide a way to intercept HTTP requests and responses to transform or handle them before
              they are passed to the application. They're perfect for cross-cutting concerns like authentication,
              logging, caching, and error handling.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Code Examples</h2>
          <div className="space-y-6">
            {httpExamples.map((example, index) => (
              <CodeExample key={index} title={example.title} code={example.code} language="typescript" />
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Best Practices</h2>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <ul className="space-y-2 text-gray-700">
              <li>• Always unsubscribe from HTTP requests to prevent memory leaks</li>
              <li>• Use typed interfaces for request/response objects</li>
              <li>• Implement proper error handling with user-friendly messages</li>
              <li>• Use interceptors for cross-cutting concerns like authentication</li>
              <li>• Implement retry logic for failed requests when appropriate</li>
              <li>• Use loading indicators for better user experience</li>
              <li>• Cache responses when data doesn't change frequently</li>
              <li>• Validate data on both client and server side</li>
            </ul>
          </div>
        </section>

        <InterviewQuestions questions={interviewQuestions} />
      </div>
    </PageLayout>
  )
}
