import { PageLayout } from "@/components/page-layout"
import { CodeExample } from "@/components/code-example"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Lightbulb } from "lucide-react"
import InterviewQuestions from "@/components/interview-questions" // Added import for InterviewQuestions

const serviceQuestions = [
  {
    id: "what-is-service",
    question: "What is a service in Angular and why do we need it?",
    answer: `<p>A service is a class that provides specific functionality that can be shared across components. Services are needed for:</p>
    <ul>
      <li><strong>Code Reusability:</strong> Share common functionality across multiple components</li>
      <li><strong>Data Sharing:</strong> Share data between components that don't have parent-child relationship</li>
      <li><strong>Business Logic:</strong> Keep business logic separate from component logic</li>
      <li><strong>External Communication:</strong> Handle HTTP requests, API calls</li>
      <li><strong>Single Responsibility:</strong> Components focus on UI, services handle data and logic</li>
    </ul>
    <p>Services are typically decorated with @Injectable() and registered in providers.</p>`,
    difficulty: "Easy" as const,
    tags: ["services", "architecture"],
  },
  {
    id: "dependency-injection",
    question: "What is Dependency Injection in Angular?",
    answer: `<p>Dependency Injection (DI) is a design pattern where dependencies are provided to a class rather than the class creating them itself:</p>
    <ul>
      <li><strong>Injector:</strong> Creates and manages service instances</li>
      <li><strong>Provider:</strong> Tells injector how to create a service</li>
      <li><strong>Token:</strong> Key used to identify a dependency</li>
      <li><strong>Injectable:</strong> Decorator that marks a class as available for injection</li>
    </ul>
    <p>Benefits: Loose coupling, easier testing, better maintainability, and inversion of control.</p>`,
    difficulty: "Medium" as const,
    tags: ["dependency-injection", "design-pattern"],
  },
  {
    id: "service-scopes",
    question: "What are the different scopes for service providers in Angular?",
    answer: `<p>Angular services can be provided at different levels:</p>
    <ul>
      <li><strong>Root Level (providedIn: 'root'):</strong> Singleton across entire application</li>
      <li><strong>Module Level:</strong> Singleton within that module and its children</li>
      <li><strong>Component Level:</strong> New instance for each component instance</li>
      <li><strong>Lazy Module:</strong> Singleton within the lazy-loaded module</li>
    </ul>
    <p>Choose scope based on data sharing needs and performance requirements.</p>`,
    difficulty: "Medium" as const,
    tags: ["providers", "scopes", "singleton"],
  },
]

export default function ServicesPage() {
  return (
    <PageLayout
      title="Services & Dependency Injection"
      description="Master Angular services and dependency injection for better code organization"
      badge="Fundamentals"
      previousPage={{ title: "Directives", href: "/fundamentals/directives" }}
      nextPage={{ title: "Routing", href: "/fundamentals/routing" }}
    >
      <div className="space-y-8">
        {/* Introduction */}
        <div>
          <h2>What are Services?</h2>
          <p>
            Services are a fundamental part of Angular applications. They provide a way to share data, functionality,
            and business logic across different parts of your application. Services help keep your components focused on
            presenting data and handling user interactions.
          </p>
        </div>
        {/* Service Basics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-primary" />
              Service Characteristics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li>
                • <strong>Singleton by default:</strong> One instance shared across the application
              </li>
              <li>
                • <strong>Injectable:</strong> Can be injected into components and other services
              </li>
              <li>
                • <strong>Reusable:</strong> Share common functionality across multiple components
              </li>
              <li>
                • <strong>Testable:</strong> Easy to mock and test in isolation
              </li>
              <li>
                • <strong>Separation of Concerns:</strong> Keep business logic separate from UI logic
              </li>
            </ul>
          </CardContent>
        </Card>
        {/* Basic Service */}
        <div>
          <h2>Creating a Basic Service</h2>
          <p>
            Services are TypeScript classes decorated with @Injectable(). They can be provided at different levels to
            control their scope and lifetime.
          </p>
        </div>
        <CodeExample
          title="Basic Service Example"
          description="A simple data service for managing user information"
          filename="user.service.ts"
          code={`import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

@Injectable({
  providedIn: 'root' // This makes it a singleton service
})
export class UserService {
  private users: User[] = [
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'admin' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'user' },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'user' }
  ];
  
  // BehaviorSubject to emit current users list
  private usersSubject = new BehaviorSubject<User[]>(this.users);
  public users$ = this.usersSubject.asObservable();
  
  constructor() {
    console.log('UserService created');
  }
  
  // Get all users
  getUsers(): Observable<User[]> {
    return this.users$;
  }
  
  // Get user by ID
  getUserById(id: number): User | undefined {
    return this.users.find(user => user.id === id);
  }
  
  // Add new user
  addUser(user: Omit<User, 'id'>): void {
    const newUser: User = {
      ...user,
      id: Math.max(...this.users.map(u => u.id)) + 1
    };
    this.users.push(newUser);
    this.usersSubject.next([...this.users]);
  }
  
  // Update user
  updateUser(id: number, updates: Partial<User>): boolean {
    const index = this.users.findIndex(user => user.id === id);
    if (index !== -1) {
      this.users[index] = { ...this.users[index], ...updates };
      this.usersSubject.next([...this.users]);
      return true;
    }
    return false;
  }
  
  // Delete user
  deleteUser(id: number): boolean {
    const index = this.users.findIndex(user => user.id === id);
    if (index !== -1) {
      this.users.splice(index, 1);
      this.usersSubject.next([...this.users]);
      return true;
    }
    return false;
  }
  
  // Search users
  searchUsers(query: string): User[] {
    return this.users.filter(user => 
      user.name.toLowerCase().includes(query.toLowerCase()) ||
      user.email.toLowerCase().includes(query.toLowerCase())
    );
  }
  
  // Get users by role
  getUsersByRole(role: string): User[] {
    return this.users.filter(user => user.role === role);
  }
}`}
        />
        {/* Using Services in Components */}
        <CodeExample
          title="Using Service in Component"
          description="Injecting and using the UserService in a component"
          filename="user-list.component.ts"
          code={`import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { UserService, User } from './user.service';

@Component({
  selector: 'app-user-list',
  template: \`
    <div class="user-list">
      <h2>User Management</h2>
      
      <!-- Add User Form -->
      <div class="add-user-form">
        <h3>Add New User</h3>
        <input [(ngModel)]="newUser.name" placeholder="Name">
        <input [(ngModel)]="newUser.email" placeholder="Email">
        <select [(ngModel)]="newUser.role">
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
        <button (click)="addUser()">Add User</button>
      </div>
      
      <!-- Search -->
      <div class="search">
        <input [(ngModel)]="searchQuery" 
               (input)="onSearch()" 
               placeholder="Search users...">
      </div>
      
      <!-- Filter by Role -->
      <div class="filter">
        <label>Filter by role:</label>
        <select [(ngModel)]="selectedRole" (change)="onRoleFilter()">
          <option value="">All Roles</option>
          <option value="admin">Admin</option>
          <option value="user">User</option>
        </select>
      </div>
      
      <!-- Users List -->
      <div class="users">
        <div *ngFor="let user of displayedUsers" class="user-card">
          <div class="user-info">
            <h4>{{ user.name }}</h4>
            <p>{{ user.email }}</p>
            <span class="role" [class.admin]="user.role === 'admin'">
              {{ user.role }}
            </span>
          </div>
          <div class="user-actions">
            <button (click)="editUser(user)">Edit</button>
            <button (click)="deleteUser(user.id)" class="delete">Delete</button>
          </div>
        </div>
      </div>
      
      <!-- Edit User Modal -->
      <div *ngIf="editingUser" class="modal">
        <div class="modal-content">
          <h3>Edit User</h3>
          <input [(ngModel)]="editingUser.name" placeholder="Name">
          <input [(ngModel)]="editingUser.email" placeholder="Email">
          <select [(ngModel)]="editingUser.role">
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
          <div class="modal-actions">
            <button (click)="saveUser()">Save</button>
            <button (click)="cancelEdit()">Cancel</button>
          </div>
        </div>
      </div>
    </div>
  \`,
  styles: [\`
    .user-list { padding: 20px; }
    .add-user-form, .search, .filter { margin-bottom: 20px; }
    .add-user-form input, .add-user-form select { margin-right: 10px; }
    .user-card { 
      display: flex; 
      justify-content: space-between; 
      align-items: center;
      padding: 15px; 
      border: 1px solid #ddd; 
      margin-bottom: 10px; 
      border-radius: 5px;
    }
    .role { 
      padding: 4px 8px; 
      border-radius: 3px; 
      background: #e0e0e0; 
      font-size: 12px;
    }
    .role.admin { background: #ffeb3b; }
    .delete { background: #f44336; color: white; }
    .modal { 
      position: fixed; 
      top: 0; 
      left: 0; 
      width: 100%; 
      height: 100%; 
      background: rgba(0,0,0,0.5);
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .modal-content { 
      background: white; 
      padding: 20px; 
      border-radius: 5px; 
      min-width: 300px;
    }
    .modal-content input, .modal-content select { 
      display: block; 
      width: 100%; 
      margin-bottom: 10px; 
      padding: 8px;
    }
  \`]
})
export class UserListComponent implements OnInit, OnDestroy {
  users: User[] = [];
  displayedUsers: User[] = [];
  searchQuery = '';
  selectedRole = '';
  
  newUser = { name: '', email: '', role: 'user' };
  editingUser: User | null = null;
  
  private subscription: Subscription = new Subscription();
  
  constructor(private userService: UserService) {}
  
  ngOnInit() {
    // Subscribe to users observable
    this.subscription.add(
      this.userService.getUsers().subscribe(users => {
        this.users = users;
        this.updateDisplayedUsers();
      })
    );
  }
  
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
  
  addUser() {
    if (this.newUser.name && this.newUser.email) {
      this.userService.addUser(this.newUser);
      this.newUser = { name: '', email: '', role: 'user' };
    }
  }
  
  editUser(user: User) {
    this.editingUser = { ...user };
  }
  
  saveUser() {
    if (this.editingUser) {
      this.userService.updateUser(this.editingUser.id, this.editingUser);
      this.editingUser = null;
    }
  }
  
  cancelEdit() {
    this.editingUser = null;
  }
  
  deleteUser(id: number) {
    if (confirm('Are you sure you want to delete this user?')) {
      this.userService.deleteUser(id);
    }
  }
  
  onSearch() {
    this.updateDisplayedUsers();
  }
  
  onRoleFilter() {
    this.updateDisplayedUsers();
  }
  
  private updateDisplayedUsers() {
    let filtered = this.users;
    
    // Apply search filter
    if (this.searchQuery) {
      filtered = this.userService.searchUsers(this.searchQuery);
    }
    
    // Apply role filter
    if (this.selectedRole) {
      filtered = filtered.filter(user => user.role === this.selectedRole);
    }
    
    this.displayedUsers = filtered;
  }
}`}
        />
        {/* HTTP Service */}
        <div>
          <h2>HTTP Service</h2>
          <p>
            Services are commonly used to handle HTTP requests and API communication. Here's an example of a service
            that interacts with a REST API.
          </p>
        </div>
        <CodeExample
          title="HTTP Service Example"
          description="A service that handles API communication"
          filename="api.service.ts"
          code={`import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

export interface Post {
  id: number;
  title: string;
  body: string;
  userId: number;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly baseUrl = 'https://jsonplaceholder.typicode.com';
  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingSubject.asObservable();
  
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };
  
  constructor(private http: HttpClient) {}
  
  // GET request
  getPosts(): Observable<Post[]> {
    this.setLoading(true);
    return this.http.get<Post[]>(\`\${this.baseUrl}/posts\`)
      .pipe(
        tap(() => this.setLoading(false)),
        catchError(this.handleError)
      );
  }
  
  // GET by ID
  getPost(id: number): Observable<Post> {
    this.setLoading(true);
    return this.http.get<Post>(\`\${this.baseUrl}/posts/\${id}\`)
      .pipe(
        tap(() => this.setLoading(false)),
        catchError(this.handleError)
      );
  }
  
  // POST request
  createPost(post: Omit<Post, 'id'>): Observable<Post> {
    this.setLoading(true);
    return this.http.post<Post>(\`\${this.baseUrl}/posts\`, post, this.httpOptions)
      .pipe(
        tap(() => this.setLoading(false)),
        catchError(this.handleError)
      );
  }
  
  // PUT request
  updatePost(id: number, post: Partial<Post>): Observable<Post> {
    this.setLoading(true);
    return this.http.put<Post>(\`\${this.baseUrl}/posts/\${id}\`, post, this.httpOptions)
      .pipe(
        tap(() => this.setLoading(false)),
        catchError(this.handleError)
      );
  }
  
  // DELETE request
  deletePost(id: number): Observable<void> {
    this.setLoading(true);
    return this.http.delete<void>(\`\${this.baseUrl}/posts/\${id}\`)
      .pipe(
        tap(() => this.setLoading(false)),
        catchError(this.handleError)
      );
  }
  
  // Search posts
  searchPosts(query: string): Observable<Post[]> {
    this.setLoading(true);
    return this.http.get<Post[]>(\`\${this.baseUrl}/posts\`)
      .pipe(
        map(posts => posts.filter(post => 
          post.title.toLowerCase().includes(query.toLowerCase()) ||
          post.body.toLowerCase().includes(query.toLowerCase())
        )),
        tap(() => this.setLoading(false)),
        catchError(this.handleError)
      );
  }
  
  // Get posts by user
  getPostsByUser(userId: number): Observable<Post[]> {
    this.setLoading(true);
    return this.http.get<Post[]>(\`\${this.baseUrl}/posts?userId=\${userId}\`)
      .pipe(
        tap(() => this.setLoading(false)),
        catchError(this.handleError)
      );
  }
  
  // Batch operations
  createMultiplePosts(posts: Omit<Post, 'id'>[]): Observable<Post[]> {
    this.setLoading(true);
    const requests = posts.map(post => this.http.post<Post>(\`\${this.baseUrl}/posts\`, post, this.httpOptions));
    
    return new Observable(observer => {
      Promise.all(requests.map(req => req.toPromise()))
        .then(results => {
          this.setLoading(false);
          observer.next(results as Post[]);
          observer.complete();
        })
        .catch(error => {
          this.setLoading(false);
          observer.error(error);
        });
    });
  }
  
  private setLoading(loading: boolean): void {
    this.loadingSubject.next(loading);
  }
  
  private handleError = (error: HttpErrorResponse): Observable<never> => {
    this.setLoading(false);
    
    let errorMessage = 'An unknown error occurred';
    
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = \`Client Error: \${error.error.message}\`;
    } else {
      // Server-side error
      errorMessage = \`Server Error: \${error.status} - \${error.message}\`;
    }
    
    console.error('API Error:', errorMessage);
    return throwError(() => new Error(errorMessage));
  };
}`}
        />
        {/* Dependency Injection */}
        <div>
          <h2>Dependency Injection</h2>
          <p>
            Dependency Injection is a design pattern that Angular uses to provide dependencies to classes. It helps
            create loosely coupled, testable, and maintainable code.
          </p>
        </div>
        <CodeExample
          title="Dependency Injection Examples"
          description="Different ways to provide and inject services"
          filename="di-examples.ts"
          code={`import { Injectable, Inject, InjectionToken, Optional } from '@angular/core';

// 1. Basic Service with Root Provider
@Injectable({
  providedIn: 'root'
})
export class LoggerService {
  log(message: string): void {
    console.log(\`[LOG]: \${new Date().toISOString()} - \${message}\`);
  }
  
  error(message: string): void {
    console.error(\`[ERROR]: \${new Date().toISOString()} - \${message}\`);
  }
}

// 2. Service with Module Provider
@Injectable()
export class DataService {
  private data: any[] = [];
  
  getData(): any[] {
    return this.data;
  }
  
  addData(item: any): void {
    this.data.push(item);
  }
}

// 3. Using Injection Tokens
export const API_URL = new InjectionToken<string>('api.url');
export const FEATURE_FLAGS = new InjectionToken<{[key: string]: boolean}>('feature.flags');

@Injectable()
export class ConfigService {
  constructor(
    @Inject(API_URL) private apiUrl: string,
    @Inject(FEATURE_FLAGS) private featureFlags: {[key: string]: boolean}
  ) {}
  
  getApiUrl(): string {
    return this.apiUrl;
  }
  
  isFeatureEnabled(feature: string): boolean {
    return this.featureFlags[feature] || false;
  }
}

// 4. Optional Dependencies
@Injectable()
export class NotificationService {
  constructor(
    private logger: LoggerService,
    @Optional() @Inject('NOTIFICATION_CONFIG') private config?: any
  ) {
    if (this.config) {
      this.logger.log('NotificationService initialized with config');
    } else {
      this.logger.log('NotificationService initialized without config');
    }
  }
  
  notify(message: string): void {
    if (this.config?.enabled) {
      // Show notification
      this.logger.log(\`Notification: \${message}\`);
    }
  }
}

// 5. Factory Provider
export function createApiService(http: HttpClient, config: ConfigService): ApiService {
  const apiService = new ApiService(http);
  apiService.setBaseUrl(config.getApiUrl());
  return apiService;
}

// In module providers:
/*
providers: [
  LoggerService,
  DataService,
  { provide: API_URL, useValue: 'https://api.example.com' },
  { provide: FEATURE_FLAGS, useValue: { newUI: true, betaFeatures: false } },
  { 
    provide: ApiService, 
    useFactory: createApiService, 
    deps: [HttpClient, ConfigService] 
  },
  { provide: 'NOTIFICATION_CONFIG', useValue: { enabled: true } }
]
*/`}
        />
        {/* Service Communication */}
        <div>
          <h2>Service Communication Patterns</h2>
          <p>
            Services can communicate with each other and with components using various patterns like Observables,
            Subjects, and event emitters.
          </p>
        </div>
        <CodeExample
          title="Service Communication"
          description="Communication between services and components"
          filename="communication.service.ts"
          code={`import { Injectable } from '@angular/core';
import { Subject, BehaviorSubject, ReplaySubject, Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';

export interface AppEvent {
  type: string;
  payload: any;
  timestamp: Date;
}

@Injectable({
  providedIn: 'root'
})
export class EventBusService {
  private eventSubject = new Subject<AppEvent>();
  
  // Emit an event
  emit(type: string, payload: any): void {
    this.eventSubject.next({
      type,
      payload,
      timestamp: new Date()
    });
  }
  
  // Listen to specific event types
  on(eventType: string): Observable<AppEvent> {
    return this.eventSubject.asObservable().pipe(
      filter(event => event.type === eventType)
    );
  }
  
  // Listen to all events
  onAll(): Observable<AppEvent> {
    return this.eventSubject.asObservable();
  }
}

@Injectable({
  providedIn: 'root'
})
export class StateService {
  // BehaviorSubject - holds current value
  private currentUserSubject = new BehaviorSubject<any>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  
  // ReplaySubject - replays last N values
  private activitySubject = new ReplaySubject<string>(5);
  public activity$ = this.activitySubject.asObservable();
  
  constructor(private eventBus: EventBusService) {
    // Listen to login events
    this.eventBus.on('USER_LOGIN').subscribe(event => {
      this.setCurrentUser(event.payload);
    });
    
    // Listen to logout events
    this.eventBus.on('USER_LOGOUT').subscribe(() => {
      this.setCurrentUser(null);
    });
  }
  
  setCurrentUser(user: any): void {
    this.currentUserSubject.next(user);
    this.addActivity(\`User \${user ? 'logged in' : 'logged out'}\`);
  }
  
  getCurrentUser(): any {
    return this.currentUserSubject.value;
  }
  
  addActivity(activity: string): void {
    this.activitySubject.next(\`\${new Date().toLocaleTimeString()}: \${activity}\`);
  }
}

// Usage in component:
/*
export class MyComponent implements OnInit, OnDestroy {
  private subscription = new Subscription();
  
  constructor(
    private stateService: StateService,
    private eventBus: EventBusService
  ) {}
  
  ngOnInit() {
    // Subscribe to current user changes
    this.subscription.add(
      this.stateService.currentUser$.subscribe(user => {
        console.log('Current user changed:', user);
      })
    );
    
    // Subscribe to activity feed
    this.subscription.add(
      this.stateService.activity$.subscribe(activities => {
        console.log('Recent activities:', activities);
      })
    );
    
    // Listen to custom events
    this.subscription.add(
      this.eventBus.on('NOTIFICATION').subscribe(event => {
        console.log('Notification received:', event.payload);
      })
    );
  }
  
  login() {
    const user = { id: 1, name: 'John Doe' };
    this.eventBus.emit('USER_LOGIN', user);
  }
  
  logout() {
    this.eventBus.emit('USER_LOGOUT', null);
  }
  
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
*/`}
        />
        {/* Interview Questions */}
        <InterviewQuestions questions={serviceQuestions} /> {/* Fixed undeclared variable */}
      </div>
    </PageLayout>
  )
}
