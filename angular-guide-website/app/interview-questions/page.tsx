"use client"

import PageLayout from "../../components/page-layout"
import CodeExample from "../../components/code-example"
import { useState } from "react"

export default function InterviewQuestionsPage() {
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedLevel, setSelectedLevel] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")

  const categories = [
    "all",
    "fundamentals",
    "components",
    "services",
    "routing",
    "forms",
    "rxjs",
    "testing",
    "performance",
    "security",
    "latest-features",
    "design-patterns",
    "advanced",
  ]

  const levels = ["all", "beginner", "intermediate", "advanced", "expert"]

  const interviewQuestions = [
    // Fundamentals - Beginner
    {
      id: 1,
      category: "fundamentals",
      level: "beginner",
      question: "What is Angular and what are its key features?",
      answer:
        "Angular is a TypeScript-based open-source web application framework developed by Google. Key features include: Component-based architecture, Two-way data binding, Dependency injection, Directives, Services, Routing, TypeScript support, CLI tooling, and Cross-platform development capabilities.",
      code: `// Basic Angular component structure
@Component({
  selector: 'app-example',
  template: \`
    <h1>{{ title }}</h1>
    <p>{{ description }}</p>
  \`
})
export class ExampleComponent {
  title = 'Angular Application';
  description = 'A powerful web framework';
}`,
    },
    {
      id: 2,
      category: "fundamentals",
      level: "beginner",
      question: "What is the difference between AngularJS and Angular?",
      answer:
        "AngularJS (1.x) is JavaScript-based with MVC architecture, while Angular (2+) is TypeScript-based with component architecture. Angular offers better performance, mobile support, and modern development practices.",
      code: `// AngularJS (1.x) - JavaScript
angular.module('myApp', [])
  .controller('MyController', function($scope) {
    $scope.title = 'Hello World';
  });

// Angular (2+) - TypeScript
@Component({
  selector: 'app-my',
  template: '<h1>{{title}}</h1>'
})
export class MyComponent {
  title = 'Hello World';
}`,
    },
    {
      id: 3,
      category: "fundamentals",
      level: "beginner",
      question: "What are Angular components and how do you create them?",
      answer:
        "Components are the basic building blocks of Angular applications. They control a patch of screen called a view and are created using the @Component decorator.",
      code: `@Component({
  selector: 'app-user-card',
  template: \`
    <div class="user-card">
      <h3>{{ user.name }}</h3>
      <p>{{ user.email }}</p>
      <button (click)="onEdit()">Edit</button>
    </div>
  \`,
  styleUrls: ['./user-card.component.css']
})
export class UserCardComponent {
  @Input() user: User;
  @Output() edit = new EventEmitter<User>();
  
  onEdit() {
    this.edit.emit(this.user);
  }
}`,
    },
    {
      id: 4,
      category: "fundamentals",
      level: "beginner",
      question: "Explain Angular data binding types.",
      answer:
        "Angular supports four types of data binding: Interpolation ({{}}), Property binding ([property]), Event binding ((event)), and Two-way binding ([(ngModel)]).",
      code: `<div>
  <!-- Interpolation -->
  <h1>{{ title }}</h1>
  
  <!-- Property binding -->
  <img [src]="imageUrl" [alt]="imageAlt">
  
  <!-- Event binding -->
  <button (click)="onClick()">Click me</button>
  
  <!-- Two-way binding -->
  <input [(ngModel)]="name" placeholder="Enter name">
  
  <!-- Attribute binding -->
  <div [attr.data-id]="userId">User Info</div>
  
  <!-- Class binding -->
  <div [class.active]="isActive">Status</div>
  
  <!-- Style binding -->
  <div [style.color]="textColor">Colored text</div>
</div>`,
    },
    {
      id: 5,
      category: "fundamentals",
      level: "beginner",
      question: "What are Angular directives and their types?",
      answer:
        "Directives are classes that add additional behavior to elements. Types: Structural (*ngIf, *ngFor), Attribute (ngClass, ngStyle), and Component directives.",
      code: `<!-- Structural Directives -->
<div *ngIf="isVisible">Conditional content</div>
<ul>
  <li *ngFor="let item of items; index as i">
    {{ i }}: {{ item.name }}
  </li>
</ul>

<!-- Attribute Directives -->
<div [ngClass]="{ 'active': isActive, 'disabled': !isEnabled }">
  Dynamic classes
</div>
<div [ngStyle]="{ 'color': textColor, 'font-size': fontSize + 'px' }">
  Dynamic styles
</div>

<!-- Custom Attribute Directive -->
@Directive({
  selector: '[appHighlight]'
})
export class HighlightDirective {
  @HostListener('mouseenter') onMouseEnter() {
    this.highlight('yellow');
  }
  
  @HostListener('mouseleave') onMouseLeave() {
    this.highlight(null);
  }
  
  private highlight(color: string) {
    this.el.nativeElement.style.backgroundColor = color;
  }
  
  constructor(private el: ElementRef) {}
}`,
    },
    {
      id: 6,
      category: "fundamentals",
      level: "intermediate",
      question: "What is dependency injection in Angular?",
      answer:
        "Dependency Injection is a design pattern where dependencies are provided to a class rather than created by the class itself. Angular's DI system manages service instances and their dependencies.",
      code: `// Service
@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private http: HttpClient) {}
  
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>('/api/users');
  }
}

// Component using DI
@Component({
  selector: 'app-user-list',
  template: '<div *ngFor="let user of users">{{ user.name }}</div>'
})
export class UserListComponent implements OnInit {
  users: User[] = [];
  
  constructor(private userService: UserService) {}
  
  ngOnInit() {
    this.userService.getUsers().subscribe(users => {
      this.users = users;
    });
  }
}`,
    },
    {
      id: 7,
      category: "fundamentals",
      level: "intermediate",
      question: "Explain Angular lifecycle hooks.",
      answer:
        "Lifecycle hooks are methods that Angular calls at specific moments in a component's lifecycle: ngOnInit, ngOnChanges, ngDoCheck, ngAfterContentInit, ngAfterContentChecked, ngAfterViewInit, ngAfterViewChecked, ngOnDestroy.",
      code: `@Component({
  selector: 'app-lifecycle-demo',
  template: '<p>{{ message }}</p>'
})
export class LifecycleDemoComponent implements OnInit, OnChanges, OnDestroy {
  @Input() data: any;
  message = '';
  private subscription: Subscription;
  
  ngOnChanges(changes: SimpleChanges) {
    console.log('ngOnChanges:', changes);
    if (changes['data']) {
      this.processData();
    }
  }
  
  ngOnInit() {
    console.log('ngOnInit: Component initialized');
    this.subscription = this.dataService.getData()
      .subscribe(data => this.message = data);
  }
  
  ngOnDestroy() {
    console.log('ngOnDestroy: Cleanup');
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
  
  private processData() {
    this.message = \`Processing: \${this.data}\`;
  }
}`,
    },
    {
      id: 8,
      category: "intermediate",
      level: "intermediate",
      question: "What are Angular Observables and how do they work?",
      answer:
        "Observables are a way to handle asynchronous data streams. They're lazy, can emit multiple values over time, and support operators for data transformation.",
      code: `import { Observable, of, from, interval } from 'rxjs';
import { map, filter, catchError, switchMap } from 'rxjs/operators';

@Injectable()
export class DataService {
  // Creating observables
  getData(): Observable<any[]> {
    return this.http.get<any[]>('/api/data');
  }
  
  // Observable with operators
  getFilteredData(): Observable<any[]> {
    return this.getData().pipe(
      map(data => data.filter(item => item.active)),
      catchError(error => {
        console.error('Error:', error);
        return of([]);
      })
    );
  }
  
  // Combining observables
  getUserWithPosts(userId: number): Observable<UserWithPosts> {
    return this.getUser(userId).pipe(
      switchMap(user => 
        this.getPosts(userId).pipe(
          map(posts => ({ ...user, posts }))
        )
      )
    );
  }
}

// Component usage
@Component({
  template: \`
    <div *ngFor="let item of data$ | async">
      {{ item.name }}
    </div>
  \`
})
export class DataComponent implements OnInit, OnDestroy {
  data$ = new BehaviorSubject<any[]>([]);
  private destroy$ = new Subject<void>();
  
  ngOnInit() {
    this.dataService.getFilteredData()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => this.data$.next(data));
  }
  
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}`,
    },
    {
      id: 9,
      category: "intermediate",
      level: "intermediate",
      question: "How does Angular routing work?",
      answer:
        "Angular Router enables navigation between views/components. It uses URL patterns to determine which component to display and supports features like guards, resolvers, and lazy loading.",
      code: `// App routing module
const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'users/:id', component: UserDetailComponent },
  { 
    path: 'admin', 
    loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule),
    canActivate: [AuthGuard]
  },
  { path: '**', component: NotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}

// Navigation in component
@Component({
  template: \`
    <nav>
      <a routerLink="/dashboard" routerLinkActive="active">Dashboard</a>
      <a [routerLink]="['/users', userId]">User Profile</a>
    </nav>
    <router-outlet></router-outlet>
  \`
})
export class AppComponent {
  userId = 123;
  
  constructor(private router: Router, private route: ActivatedRoute) {}
  
  navigateToUser(id: number) {
    this.router.navigate(['/users', id]);
  }
  
  ngOnInit() {
    // Reading route parameters
    this.route.params.subscribe(params => {
      const id = params['id'];
      console.log('User ID:', id);
    });
  }
}`,
    },
    {
      id: 10,
      category: "intermediate",
      level: "intermediate",
      question: "What are Angular Forms and their types?",
      answer:
        "Angular provides two approaches for handling forms: Template-driven forms (using ngModel) and Reactive forms (using FormControl, FormGroup). Reactive forms offer more control and are better for complex scenarios.",
      code: `// Reactive Forms
@Component({
  template: \`
    <form [formGroup]="userForm" (ngSubmit)="onSubmit()">
      <input formControlName="name" placeholder="Name">
      <div *ngIf="userForm.get('name')?.errors?.['required']">
        Name is required
      </div>
      
      <input formControlName="email" placeholder="Email">
      <div *ngIf="userForm.get('email')?.errors?.['email']">
        Invalid email
      </div>
      
      <div formGroupName="address">
        <input formControlName="street" placeholder="Street">
        <input formControlName="city" placeholder="City">
      </div>
      
      <button type="submit" [disabled]="userForm.invalid">
        Submit
      </button>
    </form>
  \`
})
export class UserFormComponent {
  userForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    address: this.fb.group({
      street: [''],
      city: ['', Validators.required]
    })
  });
  
  constructor(private fb: FormBuilder) {}
  
  onSubmit() {
    if (this.userForm.valid) {
      console.log(this.userForm.value);
    }
  }
}

// Template-driven Forms
@Component({
  template: \`
    <form #userForm="ngForm" (ngSubmit)="onSubmit(userForm)">
      <input name="name" [(ngModel)]="user.name" required #name="ngModel">
      <div *ngIf="name.invalid && name.touched">Name is required</div>
      
      <input name="email" [(ngModel)]="user.email" required email #email="ngModel">
      <div *ngIf="email.invalid && email.touched">Valid email required</div>
      
      <button type="submit" [disabled]="userForm.invalid">Submit</button>
    </form>
  \`
})
export class TemplateFormComponent {
  user = { name: '', email: '' };
  
  onSubmit(form: NgForm) {
    if (form.valid) {
      console.log(this.user);
    }
  }
}`,
    },
    // Advanced Questions
    {
      id: 11,
      category: "advanced",
      level: "advanced",
      question: "Explain Angular Change Detection mechanism.",
      answer:
        "Angular's change detection runs after every asynchronous operation to check if any data-bound properties have changed. It uses Zone.js to patch async operations and trigger change detection cycles.",
      code: `// OnPush Change Detection Strategy
@Component({
  selector: 'app-optimized',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: \`
    <div>{{ data.name }}</div>
    <button (click)="updateData()">Update</button>
  \`
})
export class OptimizedComponent {
  @Input() data: any;
  
  constructor(private cdr: ChangeDetectorRef) {}
  
  updateData() {
    // This won't trigger change detection with OnPush
    this.data.name = 'Updated';
    
    // Manually trigger change detection
    this.cdr.detectChanges();
    
    // Or mark for check
    this.cdr.markForCheck();
  }
}

// Immutable data pattern with OnPush
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: \`
    <div *ngFor="let item of items$ | async">
      {{ item.name }}
    </div>
  \`
})
export class ImmutableComponent {
  items$ = this.store.select(selectItems);
  
  constructor(private store: Store) {}
  
  addItem(item: Item) {
    // Immutable update triggers change detection
    this.store.dispatch(addItem({ item }));
  }
}`,
    },
    {
      id: 12,
      category: "advanced",
      level: "advanced",
      question: "What are Angular Guards and their types?",
      answer:
        "Guards control navigation to and from routes. Types: CanActivate, CanActivateChild, CanDeactivate, CanLoad, and Resolve. They return boolean, Promise<boolean>, or Observable<boolean>.",
      code: `// Auth Guard
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}
  
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    return this.auth.isAuthenticated().pipe(
      map(isAuth => {
        if (!isAuth) {
          this.router.navigate(['/login']);
          return false;
        }
        return true;
      })
    );
  }
}

// Role Guard
@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private auth: AuthService) {}
  
  canActivate(route: ActivatedRouteSnapshot): boolean {
    const requiredRole = route.data['role'];
    const userRole = this.auth.getUserRole();
    
    return userRole === requiredRole;
  }
}

// Can Deactivate Guard
@Injectable()
export class UnsavedChangesGuard implements CanDeactivate<FormComponent> {
  canDeactivate(component: FormComponent): boolean {
    if (component.hasUnsavedChanges()) {
      return confirm('You have unsaved changes. Do you want to leave?');
    }
    return true;
  }
}

// Resolver
@Injectable()
export class UserResolver implements Resolve<User> {
  constructor(private userService: UserService) {}
  
  resolve(route: ActivatedRouteSnapshot): Observable<User> {
    const id = route.params['id'];
    return this.userService.getUser(id);
  }
}

// Route configuration
const routes: Routes = [
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { role: 'admin' }
  },
  {
    path: 'form',
    component: FormComponent,
    canDeactivate: [UnsavedChangesGuard]
  },
  {
    path: 'user/:id',
    component: UserComponent,
    resolve: { user: UserResolver }
  }
];`,
    },
    {
      id: 13,
      category: "advanced",
      level: "advanced",
      question: "How do you implement lazy loading in Angular?",
      answer:
        "Lazy loading loads feature modules only when needed, reducing initial bundle size. It's implemented using loadChildren in route configuration and dynamic imports.",
      code: `// App routing with lazy loading
const routes: Routes = [
  {
    path: 'feature',
    loadChildren: () => import('./feature/feature.module').then(m => m.FeatureModule)
  },
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule),
    canLoad: [AuthGuard]
  }
];

// Feature module
@NgModule({
  declarations: [FeatureComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      { path: '', component: FeatureComponent },
      { path: 'detail/:id', component: FeatureDetailComponent }
    ])
  ]
})
export class FeatureModule {}

// Lazy loading with standalone components (Angular 14+)
const routes: Routes = [
  {
    path: 'profile',
    loadComponent: () => import('./profile/profile.component').then(c => c.ProfileComponent)
  },
  {
    path: 'settings',
    loadChildren: () => import('./settings/settings.routes').then(r => r.SETTINGS_ROUTES)
  }
];

// Preloading strategies
@NgModule({
  imports: [RouterModule.forRoot(routes, {
    preloadingStrategy: PreloadAllModules // or custom strategy
  })],
  exports: [RouterModule]
})
export class AppRoutingModule {}

// Custom preloading strategy
@Injectable()
export class CustomPreloadingStrategy implements PreloadingStrategy {
  preload(route: Route, load: () => Observable<any>): Observable<any> {
    if (route.data && route.data['preload']) {
      return load();
    }
    return of(null);
  }
}`,
    },
    {
      id: 14,
      category: "advanced",
      level: "expert",
      question: "What are Angular Interceptors and how do you use them?",
      answer:
        "Interceptors intercept HTTP requests and responses, allowing you to modify them, add headers, handle errors, or implement caching. They implement the HttpInterceptor interface.",
      code: `// Auth Interceptor
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private auth: AuthService) {}
  
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.auth.getToken();
    
    if (token) {
      const authReq = req.clone({
        headers: req.headers.set('Authorization', \`Bearer \${token}\`)
      });
      return next.handle(authReq);
    }
    
    return next.handle(req);
  }
}

// Error Interceptor
@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private notification: NotificationService) {}
  
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          // Handle unauthorized
          this.auth.logout();
        } else if (error.status === 500) {
          this.notification.showError('Server error occurred');
        }
        
        return throwError(error);
      })
    );
  }
}

// Loading Interceptor
@Injectable()
export class LoadingInterceptor implements HttpInterceptor {
  constructor(private loading: LoadingService) {}
  
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.loading.show();
    
    return next.handle(req).pipe(
      finalize(() => this.loading.hide())
    );
  }
}

// Caching Interceptor
@Injectable()
export class CacheInterceptor implements HttpInterceptor {
  private cache = new Map<string, HttpResponse<any>>();
  
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (req.method === 'GET') {
      const cachedResponse = this.cache.get(req.url);
      if (cachedResponse) {
        return of(cachedResponse);
      }
    }
    
    return next.handle(req).pipe(
      tap(event => {
        if (event instanceof HttpResponse && req.method === 'GET') {
          this.cache.set(req.url, event);
        }
      })
    );
  }
}

// Register interceptors
@NgModule({
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoadingInterceptor,
      multi: true
    }
  ]
})
export class AppModule {}`,
    },
    {
      id: 15,
      category: "advanced",
      level: "expert",
      question: "How do you optimize Angular application performance?",
      answer:
        "Performance optimization includes: OnPush change detection, lazy loading, tree shaking, AOT compilation, service workers, virtual scrolling, and proper bundle analysis.",
      code: `// OnPush optimization
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: \`
    <div *ngFor="let item of items; trackBy: trackByFn">
      {{ item.name }}
    </div>
  \`
})
export class OptimizedListComponent {
  @Input() items: Item[];
  
  trackByFn(index: number, item: Item): any {
    return item.id; // Use unique identifier
  }
}

// Virtual scrolling for large lists
@Component({
  template: \`
    <cdk-virtual-scroll-viewport itemSize="50" class="viewport">
      <div *cdkVirtualFor="let item of items">{{ item.name }}</div>
    </cdk-virtual-scroll-viewport>
  \`
})
export class VirtualScrollComponent {
  items = Array.from({length: 100000}, (_, i) => ({ id: i, name: \`Item \${i}\` }));
}

// Lazy loading images
@Directive({
  selector: '[appLazyLoad]'
})
export class LazyLoadDirective implements OnInit {
  @Input() appLazyLoad: string;
  
  constructor(private el: ElementRef) {}
  
  ngOnInit() {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.loadImage();
          observer.unobserve(entry.target);
        }
      });
    });
    
    observer.observe(this.el.nativeElement);
  }
  
  private loadImage() {
    this.el.nativeElement.src = this.appLazyLoad;
  }
}

// Service Worker for caching
@Injectable()
export class CacheService {
  constructor(private swUpdate: SwUpdate) {
    if (swUpdate.isEnabled) {
      swUpdate.available.subscribe(() => {
        if (confirm('New version available. Load?')) {
          window.location.reload();
        }
      });
    }
  }
}

// Bundle analysis and optimization
// angular.json
{
  "budgets": [
    {
      "type": "initial",
      "maximumWarning": "2mb",
      "maximumError": "5mb"
    }
  ]
}

// Preloading strategy
@Injectable()
export class SelectivePreloadingStrategy implements PreloadingStrategy {
  preloadedModules: string[] = [];
  
  preload(route: Route, load: () => Observable<any>): Observable<any> {
    if (route.data && route.data['preload']) {
      this.preloadedModules.push(route.path);
      return load();
    }
    return of(null);
  }
}`,
    },
    // Design Patterns Questions
    {
      id: 16,
      category: "design-patterns",
      level: "expert",
      question: "Explain the Singleton pattern in Angular services.",
      answer:
        "Angular services are singletons by default when provided in root. The same instance is shared across the application, making them perfect for shared state and utilities.",
      code: `// Singleton service
@Injectable({
  providedIn: 'root' // Creates singleton instance
})
export class ConfigService {
  private config: AppConfig;
  
  constructor() {
    this.loadConfig();
  }
  
  getConfig(): AppConfig {
    return this.config;
  }
  
  private loadConfig() {
    // Load configuration once
    this.config = { apiUrl: '/api', theme: 'light' };
  }
}

// Multiple instances (not singleton)
@Injectable()
export class LoggerService {
  private logs: string[] = [];
  
  log(message: string) {
    this.logs.push(\`\${new Date().toISOString()}: \${message}\`);
  }
}

// Provided at component level - new instance per component
@Component({
  providers: [LoggerService] // New instance for this component
})
export class ComponentWithLogger {
  constructor(private logger: LoggerService) {}
}`,
    },
    {
      id: 17,
      category: "design-patterns",
      level: "expert",
      question: "How does the Observer pattern work in Angular?",
      answer:
        "Angular extensively uses the Observer pattern through RxJS Observables. Components observe data changes, and services notify observers when data updates occur.",
      code: `// Subject as Observable source
@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notificationSubject = new Subject<Notification>();
  
  // Observable for components to subscribe
  notifications$ = this.notificationSubject.asObservable();
  
  // Method to emit notifications
  notify(message: string, type: 'info' | 'error' | 'success') {
    this.notificationSubject.next({ message, type, timestamp: Date.now() });
  }
}

// Component observing notifications
@Component({
  template: \`
    <div *ngFor="let notification of notifications" 
         [class]="'alert alert-' + notification.type">
      {{ notification.message }}
    </div>
  \`
})
export class NotificationComponent implements OnInit, OnDestroy {
  notifications: Notification[] = [];
  private destroy$ = new Subject<void>();
  
  constructor(private notificationService: NotificationService) {}
  
  ngOnInit() {
    this.notificationService.notifications$
      .pipe(takeUntil(this.destroy$))
      .subscribe(notification => {
        this.notifications.push(notification);
        // Auto remove after 5 seconds
        setTimeout(() => {
          this.removeNotification(notification);
        }, 5000);
      });
  }
  
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
  
  private removeNotification(notification: Notification) {
    const index = this.notifications.indexOf(notification);
    if (index > -1) {
      this.notifications.splice(index, 1);
    }
  }
}`,
    },
    {
      id: 18,
      category: "design-patterns",
      level: "expert",
      question: "Implement the Repository pattern in Angular.",
      answer:
        "The Repository pattern abstracts data access logic, providing a uniform interface for accessing data regardless of the source (HTTP, localStorage, etc.).",
      code: `// Generic repository interface
export interface Repository<T> {
  getAll(): Observable<T[]>;
  getById(id: string): Observable<T>;
  create(entity: T): Observable<T>;
  update(id: string, entity: Partial<T>): Observable<T>;
  delete(id: string): Observable<void>;
}

// HTTP Repository implementation
@Injectable()
export class HttpUserRepository implements Repository<User> {
  private apiUrl = '/api/users';
  
  constructor(private http: HttpClient) {}
  
  getAll(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }
  
  getById(id: string): Observable<User> {
    return this.http.get<User>(\`\${this.apiUrl}/\${id}\`);
  }
  
  create(user: User): Observable<User> {
    return this.http.post<User>(this.apiUrl, user);
  }
  
  update(id: string, user: Partial<User>): Observable<User> {
    return this.http.put<User>(\`\${this.apiUrl}/\${id}\`, user);
  }
  
  delete(id: string): Observable<void> {
    return this.http.delete<void>(\`\${this.apiUrl}/\${id}\`);
  }
}

// Local storage repository implementation
@Injectable()
export class LocalStorageUserRepository implements Repository<User> {
  private storageKey = 'users';
  
  getAll(): Observable<User[]> {
    const users = JSON.parse(localStorage.getItem(this.storageKey) || '[]');
    return of(users);
  }
  
  getById(id: string): Observable<User> {
    return this.getAll().pipe(
      map(users => users.find(user => user.id === id)),
      map(user => {
        if (!user) throw new Error('User not found');
        return user;
      })
    );
  }
  
  create(user: User): Observable<User> {
    return this.getAll().pipe(
      map(users => {
        const newUser = { ...user, id: this.generateId() };
        users.push(newUser);
        localStorage.setItem(this.storageKey, JSON.stringify(users));
        return newUser;
      })
    );
  }
  
  update(id: string, userData: Partial<User>): Observable<User> {
    return this.getAll().pipe(
      map(users => {
        const index = users.findIndex(user => user.id === id);
        if (index === -1) throw new Error('User not found');
        
        users[index] = { ...users[index], ...userData };
        localStorage.setItem(this.storageKey, JSON.stringify(users));
        return users[index];
      })
    );
  }
  
  delete(id: string): Observable<void> {
    return this.getAll().pipe(
      map(users => {
        const filteredUsers = users.filter(user => user.id !== id);
        localStorage.setItem(this.storageKey, JSON.stringify(filteredUsers));
      })
    );
  }
  
  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }
}

// Service using repository
@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(
    @Inject('UserRepository') private userRepository: Repository<User>
  ) {}
  
  getUsers(): Observable<User[]> {
    return this.userRepository.getAll();
  }
  
  getUserById(id: string): Observable<User> {
    return this.userRepository.getById(id);
  }
  
  createUser(user: User): Observable<User> {
    return this.userRepository.create(user);
  }
  
  updateUser(id: string, user: Partial<User>): Observable<User> {
    return this.userRepository.update(id, user);
  }
  
  deleteUser(id: string): Observable<void> {
    return this.userRepository.delete(id);
  }
}

// Module configuration
@NgModule({
  providers: [
    {
      provide: 'UserRepository',
      useClass: environment.production ? HttpUserRepository : LocalStorageUserRepository
    }
  ]
})
export class AppModule {}`,
    },
    // Latest Features Questions
    {
      id: 19,
      category: "latest-features",
      level: "expert",
      question: "What are Angular Signals and how do they work?",
      answer:
        "Signals are Angular's new reactivity system that provides a more efficient way to handle state changes. They're synchronous, always have a value, and automatically track dependencies.",
      code: `// Basic signals
@Component({
  template: \`
    <div>
      <p>Count: {{ count() }}</p>
      <p>Double: {{ doubleCount() }}</p>
      <p>Message: {{ message() }}</p>
      <button (click)="increment()">+</button>
      <button (click)="decrement()">-</button>
      <input [value]="message()" (input)="updateMessage($event)">
    </div>
  \`
})
export class SignalsComponent {
  // Writable signal
  count = signal(0);
  message = signal('Hello');
  
  // Computed signal
  doubleCount = computed(() => this.count() * 2);
  
  // Effect
  constructor() {
    effect(() => {
      console.log('Count changed:', this.count());
      if (this.count() > 10) {
        console.log('Count is getting high!');
      }
    });
  }
  
  increment() {
    this.count.update(value => value + 1);
  }
  
  decrement() {
    this.count.set(this.count() - 1);
  }
  
  updateMessage(event: Event) {
    const target = event.target as HTMLInputElement;
    this.message.set(target.value);
  }
}

// Signal inputs and outputs (Angular 17+)
@Component({
  selector: 'app-user-card',
  template: \`
    <div class="user-card">
      <h3>{{ user().name }}</h3>
      <p>{{ user().email }}</p>
      <p>Clicks: {{ clickCount() }}</p>
      <button (click)="handleClick()">Click me</button>
    </div>
  \`
})
export class UserCardComponent {
  // Signal input
  user = input.required<User>();
  
  // Signal output
  userClick = output<User>();
  
  // Internal signal
  clickCount = signal(0);
  
  handleClick() {
    this.clickCount.update(count => count + 1);
    this.userClick.emit(this.user());
  }
}

// Advanced signal patterns
@Injectable({
  providedIn: 'root'
})
export class UserStore {
  // Private writable signal
  private _users = signal<User[]>([]);
  private _loading = signal(false);
  private _error = signal<string | null>(null);
  
  // Public readonly signals
  users = this._users.asReadonly();
  loading = this._loading.asReadonly();
  error = this._error.asReadonly();
  
  // Computed signals
  userCount = computed(() => this._users().length);
  activeUsers = computed(() => this._users().filter(user => user.active));
  
  constructor(private http: HttpClient) {
    // Effect for logging
    effect(() => {
      console.log(\`Users loaded: \${this.userCount()}\`);
    });
  }
  
  loadUsers() {
    this._loading.set(true);
    this._error.set(null);
    
    this.http.get<User[]>('/api/users').subscribe({
      next: users => {
        this._users.set(users);
        this._loading.set(false);
      },
      error: error => {
        this._error.set(error.message);
        this._loading.set(false);
      }
    });
  }
  
  addUser(user: User) {
    this._users.update(users => [...users, user]);
  }
  
  updateUser(id: string, updates: Partial<User>) {
    this._users.update(users =>
      users.map(user => user.id === id ? { ...user, ...updates } : user)
    );
  }
  
  removeUser(id: string) {
    this._users.update(users => users.filter(user => user.id !== id));
  }
}`,
    },
    {
      id: 20,
      category: "latest-features",
      level: "expert",
      question: "What are standalone components and how do they change Angular architecture?",
      answer:
        "Standalone components don't need NgModules, can import dependencies directly, simplify architecture, improve tree-shaking, enable better lazy loading, and reduce boilerplate. They're the default in Angular 19+ and represent the future of Angular development.",
      code: `// Standalone component (Angular 14+)
@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatInputModule
  ],
  template: \`
    <mat-card>
      <mat-card-header>
        <mat-card-title>{{ user().name }}</mat-card-title>
      </mat-card-header>
      
      <mat-card-content>
        <form [formGroup]="profileForm" (ngSubmit)="onSubmit()">
          <mat-form-field>
            <input matInput formControlName="name" placeholder="Name">
          </mat-form-field>
          
          <mat-form-field>
            <input matInput formControlName="email" placeholder="Email">
          </mat-form-field>
          
          <button mat-raised-button color="primary" type="submit">
            Save
          </button>
        </form>
      </mat-card-content>
    </mat-card>
  \`
})
export class UserProfileComponent {
  user = signal({ name: 'John Doe', email: 'john@example.com' });
  
  profileForm = this.fb.group({
    name: [this.user().name, Validators.required],
    email: [this.user().email, [Validators.required, Validators.email]]
  });
  
  constructor(private fb: FormBuilder) {}
  
  onSubmit() {
    if (this.profileForm.valid) {
      console.log('Profile updated:', this.profileForm.value);
    }
  }
}

// Bootstrapping standalone component
// main.ts
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    provideAnimations(),
    // Other providers...
  ]
});

// Standalone app component
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    HeaderComponent,
    FooterComponent
  ],
  template: \`
    <app-header></app-header>
    <main>
      <router-outlet></router-outlet>
    </main>
    <app-footer></app-footer>
  \`
})
export class AppComponent {}

// Lazy loading standalone components
const routes: Routes = [
  {
    path: 'profile',
    loadComponent: () => import('./user-profile/user-profile.component')
      .then(c => c.UserProfileComponent)
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./dashboard/dashboard.routes')
      .then(r => r.DASHBOARD_ROUTES)
  }
];

// Dashboard routes (standalone)
export const DASHBOARD_ROUTES: Routes = [
  {
    path: '',
    component: DashboardComponent,
    children: [
      {
        path: 'analytics',
        loadComponent: () => import('./analytics/analytics.component')
          .then(c => c.AnalyticsComponent)
      },
      {
        path: 'reports',
        loadComponent: () => import('./reports/reports.component')
          .then(c => c.ReportsComponent)
      }
    ]
  }
];`,
    },
    // Additional questions to reach 50+
    {
      id: 21,
      category: "fundamentals",
      level: "beginner",
      question: "What is Angular CLI and what are its main commands?",
      answer:
        "Angular CLI is a command-line interface tool for Angular development. Main commands include ng new, ng serve, ng build, ng test, ng generate, and ng add.",
      code: `// Create new project
ng new my-app --routing --style=scss

// Generate components, services, etc.
ng generate component user-list
ng generate service user
ng generate module feature --routing
ng generate guard auth
ng generate pipe custom-date

// Serve application
ng serve --port 4200 --open

// Build for production
ng build --prod

// Run tests
ng test
ng e2e

// Add packages
ng add @angular/material
ng add @ngrx/store`,
    },
    {
      id: 22,
      category: "fundamentals",
      level: "intermediate",
      question: "What are Angular Pipes and how do you create custom ones?",
      answer:
        "Pipes transform data in templates. Angular provides built-in pipes (date, currency, etc.) and allows creating custom pipes using the @Pipe decorator.",
      code: `// Built-in pipes usage
@Component({
  template: \`
    <p>{{ today | date:'fullDate' }}</p>
    <p>{{ price | currency:'USD':'symbol':'1.2-2' }}</p>
    <p>{{ name | uppercase }}</p>
    <p>{{ items | slice:0:5 }}</p>
    <p>{{ data | json }}</p>
    <p>{{ text | titlecase }}</p>
  \`
})
export class PipeExampleComponent {
  today = new Date();
  price = 123.45;
  name = 'john doe';
  items = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  data = { name: 'John', age: 30 };
  text = 'hello world';
}

// Custom pipe
@Pipe({
  name: 'truncate',
  pure: true
})
export class TruncatePipe implements PipeTransform {
  transform(value: string, limit: number = 50, trail: string = '...'): string {
    if (!value) return '';
    
    return value.length > limit 
      ? value.substring(0, limit) + trail 
      : value;
  }
}

// Usage of custom pipe
@Component({
  template: \`
    <p>{{ longText | truncate:100:'...' }}</p>
  \`
})
export class ComponentUsingPipe {
  longText = 'This is a very long text that needs to be truncated...';
}

// Async pipe with observables
@Component({
  template: \`
    <div *ngIf="user$ | async as user">
      <h2>{{ user.name }}</h2>
      <p>{{ user.email }}</p>
    </div>
    
    <ul>
      <li *ngFor="let item of items$ | async">
        {{ item.name }}
      </li>
    </ul>
  \`
})
export class AsyncPipeComponent {
  user$ = this.userService.getCurrentUser();
  items$ = this.dataService.getItems();
  
  constructor(
    private userService: UserService,
    private dataService: DataService
  ) {}
}`,
    },
    {
      id: 23,
      category: "intermediate",
      level: "intermediate",
      question: "How do you handle HTTP errors in Angular?",
      answer:
        "HTTP errors can be handled using RxJS operators like catchError, retry, and retryWhen. Global error handling can be implemented using interceptors.",
      code: `// Service with error handling
@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = '/api/users';
  
  constructor(private http: HttpClient) {}
  
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl).pipe(
      retry(3), // Retry 3 times
      catchError(this.handleError<User[]>('getUsers', []))
    );
  }
  
  getUserById(id: string): Observable<User> {
    return this.http.get<User>(\`\${this.apiUrl}/\${id}\`).pipe(
      catchError(error => {
        if (error.status === 404) {
          throw new Error('User not found');
        }
        return throwError(error);
      })
    );
  }
  
  createUser(user: User): Observable<User> {
    return this.http.post<User>(this.apiUrl, user).pipe(
      catchError(error => {
        if (error.status === 400) {
          throw new Error('Invalid user data');
        }
        return throwError(error);
      })
    );
  }
  
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(\`\${operation} failed: \${error.message}\`);
      return of(result as T);
    };
  }
}

// Component handling errors
@Component({
  template: \`
    <div *ngIf="loading">Loading...</div>
    <div *ngIf="error" class="error">{{ error }}</div>
    <div *ngFor="let user of users">{{ user.name }}</div>
  \`
})
export class UserListComponent implements OnInit {
  users: User[] = [];
  loading = false;
  error: string | null = null;
  
  constructor(private userService: UserService) {}
  
  ngOnInit() {
    this.loadUsers();
  }
  
  loadUsers() {
    this.loading = true;
    this.error = null;
    
    this.userService.getUsers().subscribe({
      next: users => {
        this.users = users;
        this.loading = false;
      },
      error: error => {
        this.error = 'Failed to load users';
        this.loading = false;
        console.error('Error loading users:', error);
      }
    });
  }
}

// Global error handler
@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  constructor(private notification: NotificationService) {}
  
  handleError(error: any): void {
    console.error('Global error:', error);
    
    if (error instanceof HttpErrorResponse) {
      // HTTP error
      this.handleHttpError(error);
    } else {
      // Client-side error
      this.notification.showError('An unexpected error occurred');
    }
  }
  
  private handleHttpError(error: HttpErrorResponse) {
    switch (error.status) {
      case 401:
        this.notification.showError('Unauthorized access');
        break;
      case 403:
        this.notification.showError('Access forbidden');
        break;
      case 404:
        this.notification.showError('Resource not found');
        break;
      case 500:
        this.notification.showError('Server error');
        break;
      default:
        this.notification.showError('Network error occurred');
    }
  }
}`,
    },
    // Continue with more questions to reach 50+...
    {
      id: 24,
      category: "advanced",
      level: "advanced",
      question: "What is Angular Universal and Server-Side Rendering (SSR)?",
      answer:
        "Angular Universal enables server-side rendering, improving SEO, initial load time, and performance. It renders Angular applications on the server before sending to the client.",
      code: `// Install Angular Universal
ng add @nguniversal/express-engine

// Build and serve SSR
npm run build:ssr
npm run serve:ssr

// SSR-compatible service
@Injectable({
  providedIn: 'root'
})
export class DataService {
  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}
  
  getData(): Observable<any[]> {
    if (isPlatformBrowser(this.platformId)) {
      // Browser-specific code
      return this.http.get<any[]>('/api/data');
    } else {
      // Server-specific code
      return of([]); // Return empty array on server
    }
  }
}

// Component with SSR considerations
@Component({
  template: \`
    <div *ngIf="isBrowser">
      <canvas #canvas></canvas>
    </div>
    <div>{{ data | json }}</div>
  \`
})
export class SSRComponent implements OnInit {
  isBrowser: boolean;
  data: any[] = [];
  
  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private dataService: DataService
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }
  
  ngOnInit() {
    this.dataService.getData().subscribe(data => {
      this.data = data;
    });
    
    if (this.isBrowser) {
      // Browser-only code
      this.initializeCanvas();
    }
  }
  
  private initializeCanvas() {
    // Canvas manipulation code
  }
}`,
    },
    {
      id: 25,
      category: "testing",
      level: "advanced",
      question: "How do you write unit tests in Angular?",
      answer:
        "Angular uses Jasmine and Karma for unit testing. Tests should cover components, services, pipes, and directives using TestBed for configuration and mocking dependencies.",
      code: `// Component testing
describe('UserComponent', () => {
  let component: UserComponent;
  let fixture: ComponentFixture<UserComponent>;
  let userService: jasmine.SpyObj<UserService>;
  
  beforeEach(async () => {
    const spy = jasmine.createSpyObj('UserService', ['getUser', 'updateUser']);
    
    await TestBed.configureTestingModule({
      declarations: [UserComponent],
      providers: [
        { provide: UserService, useValue: spy }
      ]
    }).compileComponents();
    
    fixture = TestBed.createComponent(UserComponent);
    component = fixture.componentInstance;
    userService = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;
  });
  
  it('should create', () => {
    expect(component).toBeTruthy();
  });
  
  it('should load user on init', () => {
    const mockUser = { id: '1', name: 'John', email: 'john@example.com' };
    userService.getUser.and.returnValue(of(mockUser));
    
    component.ngOnInit();
    
    expect(userService.getUser).toHaveBeenCalledWith('1');
    expect(component.user).toEqual(mockUser);
  });
  
  it('should update user name', () => {
    const updatedUser = { id: '1', name: 'Jane', email: 'john@example.com' };
    userService.updateUser.and.returnValue(of(updatedUser));
    
    component.updateUserName('Jane');
    
    expect(userService.updateUser).toHaveBeenCalled();
    expect(component.user.name).toBe('Jane');
  });
});

// Service testing
describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;
  
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UserService]
    });
    
    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });
  
  afterEach(() => {
    httpMock.verify();
  });
  
  it('should fetch users', () => {
    const mockUsers = [
      { id: '1', name: 'John' },
      { id: '2', name: 'Jane' }
    ];
    
    service.getUsers().subscribe(users => {
      expect(users).toEqual(mockUsers);
    });
    
    const req = httpMock.expectOne('/api/users');
    expect(req.request.method).toBe('GET');
    req.flush(mockUsers);
  });
  
  it('should handle error', () => {
    service.getUsers().subscribe({
      next: () => fail('should have failed'),
      error: error => expect(error.status).toBe(500)
    });
    
    const req = httpMock.expectOne('/api/users');
    req.flush('Server error', { status: 500, statusText: 'Server Error' });
  });
});

// Pipe testing
describe('TruncatePipe', () => {
  let pipe: TruncatePipe;
  
  beforeEach(() => {
    pipe = new TruncatePipe();
  });
  
  it('should truncate long text', () => {
    const result = pipe.transform('This is a long text', 10);
    expect(result).toBe('This is a ...');
  });
  
  it('should not truncate short text', () => {
    const result = pipe.transform('Short', 10);
    expect(result).toBe('Short');
  });
});`,
    },
    // Continue adding more questions to reach 50+ total...
    {
      id: 26,
      category: "security",
      level: "advanced",
      question: "What are common security vulnerabilities in Angular applications and how to prevent them?",
      answer:
        "Common vulnerabilities include XSS, CSRF, injection attacks, and insecure authentication. Prevention involves sanitization, CSRF tokens, input validation, and secure HTTP communication.",
      code: `// XSS prevention
@Component({
  template: \`
    <div>{{ userInput }}</div>
    <div [innerHTML]="trustedHtml"></div>
  \`
})
export class SecurityComponent {
  userInput = '<script>alert("XSS")</script>';
  trustedHtml: SafeHtml;
  
  constructor(private sanitizer: DomSanitizer) {
    this.trustedHtml = this.sanitizer.bypassSecurityTrustHtml('<p>Safe content</p>');
  }
}

// CSRF protection
@NgModule({
  imports: [
    HttpClientModule,
    HttpClientXsrfModule.withOptions({
      cookieName: 'XSRF-TOKEN',
      headerName: 'X-XSRF-TOKEN',
    }),
  ],
})
export class AppModule {}

// Input validation
@Component({
  template: \`
    <form [formGroup]="userForm" (ngSubmit)="onSubmit()">
      <input formControlName="email">
      <div *ngIf="userForm.get('email')?.errors?.['email']">
        Invalid email
      </div>
      <button type="submit" [disabled]="userForm.invalid">Submit</button>
    </form>
  \`
})
export class UserFormComponent {
  userForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]]
  });
  
  constructor(private fb: FormBuilder) {}
  
  onSubmit() {}
}

// Secure HTTP
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const secureReq = req.clone({
      url: req.url.replace('http://', 'https://')
    });
    return next.handle(secureReq);
  }
}`,
    },
    {
      id: 27,
      category: "advanced",
      level: "expert",
      question: "Explain the concept of Zone.js in Angular.",
      answer:
        "Zone.js is a library that monkey-patches asynchronous APIs to automatically trigger change detection in Angular. It creates an execution context that tracks async operations.",
      code: `// Zone.js example
import 'zone.js/dist/zone';

const zone = Zone.current;

zone.run(() => {
  console.log('Inside zone');
  
  setTimeout(() => {
    console.log('Async task completed');
  }, 1000);
});

console.log('Outside zone');

// Custom zone
const customZone = zone.fork({
  name: 'custom',
  onInvokeTask: (delegate, current, target, task, applyThis, applyArgs) => {
    console.log('Before task');
    const result = delegate.invokeTask(target, task, applyThis, applyArgs);
    console.log('After task');
    return result;
  }
});

customZone.run(() => {
  console.log('Inside custom zone');
  setTimeout(() => {
    console.log('Custom async task');
  }, 500);
});`,
    },
    {
      id: 28,
      category: "advanced",
      level: "expert",
      question: "How do you implement state management in Angular using NgRx?",
      answer:
        "NgRx is a Redux-inspired state management library for Angular. It uses actions, reducers, and effects to manage application state in a predictable way.",
      code: `// Actions
export const loadUsers = createAction('[User] Load Users');
export const loadUsersSuccess = createAction(
  '[User] Load Users Success',
  props<{ users: User[] }>()
);
export const loadUsersFailure = createAction(
  '[User] Load Users Failure',
  props<{ error: string }>()
);

// Reducer
export const userReducer = createReducer(
  initialState,
  on(loadUsersSuccess, (state, { users }) => ({ ...state, users })),
  on(loadUsersFailure, (state, { error }) => ({ ...state, error }))
);

// Effects
@Injectable()
export class UserEffects {
  loadUsers$ = createEffect(() => this.actions$.pipe(
    ofType(loadUsers),
    mergeMap(() => this.userService.getUsers().pipe(
      map(users => loadUsersSuccess({ users })),
      catchError(error => of(loadUsersFailure({ error: error.message })))
    ))
  ));
  
  constructor(
    private actions$: Actions,
    private userService: UserService
  ) {}
}

// Selectors
export const selectUsers = createSelector(
  selectUserState,
  state => state.users
);

// Component
@Component({
  template: \`
    <div *ngFor="let user of users$ | async">{{ user.name }}</div>
  \`
})
export class UserListComponent implements OnInit {
  users$ = this.store.select(selectUsers);
  
  constructor(private store: Store) {}
  
  ngOnInit() {
    this.store.dispatch(loadUsers());
  }
}`,
    },
    {
      id: 29,
      category: "advanced",
      level: "expert",
      question: "What are Web Workers and how can they improve Angular application performance?",
      answer:
        "Web Workers run JavaScript code in the background, off the main thread, preventing UI blocking. They're useful for CPU-intensive tasks like image processing or complex calculations.",
      code: `// Create web worker
const worker = new Worker('./app.worker', { type: 'module' });

// Send message to worker
worker.postMessage({ data: 'Hello from main thread' });

// Receive message from worker
worker.onmessage = ({ data }) => {
  console.log('Message from worker:', data);
};

// Error handling
worker.onerror = (error) => {
  console.error('Worker error:', error);
};

// Terminate worker
worker.terminate();

// app.worker.ts
addEventListener('message', ({ data }) => {
  console.log('Message from main thread:', data);
  
  // Perform complex calculation
  const result = complexCalculation(data);
  
  // Send result back to main thread
  postMessage(result);
});

function complexCalculation(data: any): any {
  // Complex logic here
  return data;
}`,
    },
    {
      id: 30,
      category: "advanced",
      level: "expert",
      question: "Explain the concept of Ahead-of-Time (AOT) compilation in Angular.",
      answer:
        "AOT compilation compiles Angular templates and components during the build process, resulting in smaller bundle sizes, faster rendering, and improved security.",
      code: `// Enable AOT compilation
ng build --prod --aot

// angular.json
{
  "build": {
    "configurations": {
      "production": {
        "aot": true,
        "optimization": true,
        "budgets": [
          {
            "type": "initial",
            "maximumWarning": "2mb",
            "maximumError": "5mb"
          }
        ]
      }
    }
  }
}`,
    },
    {
      id: 31,
      category: "advanced",
      level: "expert",
      question: "How do you implement custom schematics in Angular CLI?",
      answer:
        "Schematics automate repetitive tasks like generating code or modifying project structure. They use a set of instructions to transform the file system.",
      code: `// Create schematic
ng generate schematic my-schematic

// my-schematic/index.ts
import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';

export function mySchematic(_options: any): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    tree.create('hello.txt', 'Hello, world!');
    return tree;
  };
}

// collection.json
{
  "schematics": {
    "my-schematic": {
      "factory": "./my-schematic/index#mySchematic",
      "description": "Creates a hello.txt file"
    }
  }
}

// Run schematic
ng generate my-app:my-schematic`,
    },
    {
      id: 32,
      category: "advanced",
      level: "expert",
      question: "What are micro frontends and how can they be implemented in Angular?",
      answer:
        "Micro frontends break down a large frontend application into smaller, independently deployable parts. They can be implemented using web components, iframes, or build-time integration.",
      code: `// Web component approach
@Component({
  selector: 'app-user-profile',
  template: \`
    <h2>User Profile</h2>
    <p>Name: {{ user.name }}</p>
  \`
})
export class UserProfileComponent extends HTMLElement {
  user = { name: 'John Doe' };
  
  connectedCallback() {
    this.innerHTML = \`
      <h2>User Profile</h2>
      <p>Name: \${this.user.name}</p>
    \`;
  }
}

customElements.define('user-profile', UserProfileComponent);

// Iframe approach
<iframe src="http://localhost:4201/user-profile"></iframe>

// Build-time integration
// Import and use components from different projects`,
    },
    {
      id: 33,
      category: "advanced",
      level: "expert",
      question: "How do you implement custom decorators in Angular?",
      answer:
        "Decorators add metadata to classes, methods, or properties. They're defined using functions that return a decorator function.",
      code: `// Class decorator
function LogClass(constructor: Function) {
  console.log('Class decorator called');
}

@LogClass
class MyClass {}

// Method decorator
function LogMethod(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  console.log('Method decorator called');
  const originalMethod = descriptor.value;
  
  descriptor.value = function(...args: any[]) {
    console.log(\`Calling method \${propertyKey} with arguments \${args}\`);
    const result = originalMethod.apply(this, args);
    console.log(\`Method \${propertyKey} returned \${result}\`);
    return result;
  };
}

class MyComponent {
  @LogMethod
  myMethod(arg: string): string {
    return \`Hello, \${arg}!\`;
  }
}

// Property decorator
function LogProperty(target: any, propertyKey: string) {
  console.log('Property decorator called');
  
  let value: any;
  
  const getter = function() {
    console.log(\`Getting value of \${propertyKey}\`);
    return value;
  };
  
  const setter = function(newValue: any) {
    console.log(\`Setting value of \${propertyKey} to \${newValue}\`);
    value = newValue;
  };
  
  Object.defineProperty(target, propertyKey, {
    get: getter,
    set: setter
  });
}

class MyService {
  @LogProperty
  myProperty: string;
}`,
    },
    {
      id: 34,
      category: "advanced",
      level: "expert",
      question: "What are the benefits of using a monorepo for Angular projects?",
      answer:
        "Monorepos store multiple projects in a single repository, enabling code sharing, dependency management, and consistent tooling across projects.",
      code: `// Monorepo structure
/my-monorepo
  /apps
    /my-app
      /src
    /my-other-app
      /src
  /libs
    /my-shared-lib
      /src
  angular.json
  package.json
  tsconfig.json

// Benefits
- Code sharing
- Dependency management
- Consistent tooling
- Atomic changes
- Collaboration

// Tools
- Nx
- Lerna
- Bazel`,
    },
    {
      id: 35,
      category: "advanced",
      level: "expert",
      question: "How do you implement dynamic forms in Angular?",
      answer:
        "Dynamic forms are created based on metadata, allowing the form structure to be determined at runtime. They use Reactive Forms and JSON configuration.",
      code: `// Metadata
const formConfig = [
  {
    type: 'input',
    label: 'Name',
    name: 'name',
    validators: [Validators.required]
  },
  {
    type: 'select',
    label: 'Country',
    name: 'country',
    options: ['USA', 'Canada', 'UK']
  }
];

// Component
@Component({
  template: \`
    <form [formGroup]="form">
      <div *ngFor="let field of config">
        <label>{{ field.label }}</label>
        <input *ngIf="field.type === 'input'" [formControlName]="field.name">
        <select *ngIf="field.type === 'select'" [formControlName]="field.name">
          <option *ngFor="let option of field.options" [value]="option">{{ option }}</option>
        </select>
      </div>
      <button type="submit">Submit</button>
    </form>
  \`
})
export class DynamicFormComponent implements OnInit {
  form: FormGroup;
  config = formConfig;
  
  constructor(private fb: FormBuilder) {}
  
  ngOnInit() {
    this.form = this.createForm();
  }
  
  createForm(): FormGroup {
    const group = this.fb.group({});
    this.config.forEach(field => {
      group.addControl(field.name, this.fb.control('', field.validators));
    });
    return group;
  }
}`,
    },
    {
      id: 36,
      category: "advanced",
      level: "expert",
      question: "What are the key differences between Angular and React?",
      answer:
        "Angular is a framework with opinionated structure, TypeScript, and built-in features. React is a library focused on the view layer, JavaScript, and requires additional libraries for routing and state management.",
      code: `// Angular
- Framework
- TypeScript
- Components
- Modules
- Dependency Injection
- RxJS
- CLI

// React
- Library
- JavaScript
- Components
- JSX
- Virtual DOM
- Hooks
- Redux/Context`,
    },
    {
      id: 37,
      category: "advanced",
      level: "expert",
      question: "How do you implement internationalization (i18n) in Angular?",
      answer:
        "Internationalization involves adapting an application to different languages and regions. Angular provides tools for translating text, formatting dates and numbers, and handling locale-specific data.",
      code: `// Install i18n
ng add @angular/localize

// Mark text for translation
<p i18n>Hello, world!</p>

// Extract translation messages
ng xi18n

// Create locale files
messages.xlf

// Translate messages
messages.fr.xlf

// Build with locale
ng build --configuration=fr

// Runtime locale switching
import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';

registerLocaleData(localeFr, 'fr');

// Use in component
import { LOCALE_ID } from '@angular/core';

@Component({
  providers: [
    { provide: LOCALE_ID, useValue: 'fr' }
  ]
})
export class MyComponent {}`,
    },
    {
      id: 38,
      category: "advanced",
      level: "expert",
      question: "What are the best practices for writing scalable and maintainable Angular applications?",
      answer:
        "Best practices include: using a modular architecture, following a consistent coding style, writing unit tests, documenting code, and using a state management library.",
      code: `// Modular architecture
/src
  /app
    /core
    /shared
    /features
      /user
      /product

// Coding style
- TypeScript
- Consistent indentation
- Meaningful names
- Comments

// Testing
- Unit tests
- Integration tests
- End-to-end tests

// Documentation
- JSDoc
- README
- Style guide`,
    },
    {
      id: 39,
      category: "advanced",
      level: "expert",
      question: "How do you implement custom form controls in Angular?",
      answer:
        "Custom form controls implement the ControlValueAccessor interface, allowing them to integrate seamlessly with Angular Forms.",
      code: `// Custom input component
@Component({
  selector: 'app-custom-input',
  template: \`
    <input [value]="value" (input)="onChange($event.target.value)">
  \`,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CustomInputComponent),
      multi: true
    }
  ]
})
export class CustomInputComponent implements ControlValueAccessor {
  value: string;
  onChange: any = () => {};
  onTouched: any = () => {};
  
  writeValue(value: any): void {
    this.value = value;
  }
  
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
  
  setDisabledState?(isDisabled: boolean): void {}
}`,
    },
    {
      id: 40,
      category: "advanced",
      level: "expert",
      question: "What are the different types of Observables in RxJS and when should you use them?",
      answer:
        "Common Observable types include: Observable, Subject, BehaviorSubject, ReplaySubject, and AsyncSubject. Each has different characteristics and use cases.",
      code: `// Observable
- Emits values over time
- Lazy
- Unicast

// Subject
- Multicast
- Can emit values to multiple subscribers

// BehaviorSubject
- Emits the current value to new subscribers
- Requires initial value

// ReplaySubject
- Replays a specified number of past emissions to new subscribers

// AsyncSubject
- Emits only the last value when the Observable completes`,
    },
    {
      id: 41,
      category: "advanced",
      level: "expert",
      question: "How do you implement drag and drop functionality in Angular?",
      answer:
        "Drag and drop can be implemented using the Angular CDK DragDrop module or by using native drag and drop APIs.",
      code: `// Angular CDK DragDrop
import { DragDropModule } from '@angular/cdk/drag-drop';

@Component({
  template: \`
    <div cdkDropList (cdkDropListDropped)="drop($event)">
      <div cdkDrag *ngFor="let item of items">{{ item }}</div>
    </div>
  \`
})
export class DragDropComponent {
  items = ['Item 1', 'Item 2', 'Item 3'];
  
  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.items, event.previousIndex, event.currentIndex);
  }
}`,
    },
    {
      id: 42,
      category: "advanced",
      level: "expert",
      question: "What are the different ways to handle authentication in Angular?",
      answer:
        "Authentication can be handled using: JWT, OAuth2, or traditional session-based authentication. Each has different security implications and implementation details.",
      code: `// JWT
- JSON Web Token
- Stateless
- Stored on client

// OAuth2
- Delegated authorization
- Third-party authentication

// Session-based
- Traditional approach
- Server-side sessions`,
    },
    {
      id: 43,
      category: "advanced",
      level: "expert",
      question: "How do you implement real-time communication in Angular using WebSockets?",
      answer:
        "WebSockets provide bidirectional communication between the client and server, enabling real-time updates. They can be used with libraries like Socket.IO or native WebSocket API.",
      code: `// Native WebSocket API
const socket = new WebSocket('ws://localhost:8080');

socket.onopen = () => {
  console.log('Connected');
  socket.send('Hello from client');
};

socket.onmessage = (event) => {
  console.log('Message from server:', event.data);
};

socket.onclose = () => {
  console.log('Disconnected');
};

// Socket.IO
import { io } from 'socket.io-client';

const socket = io('http://localhost:8080');

socket.on('connect', () => {
  console.log('Connected');
  socket.emit('message', 'Hello from client');
});

socket.on('message', (data) => {
  console.log('Message from server:', data);
});`,
    },
    {
      id: 44,
      category: "advanced",
      level: "expert",
      question: "How do you implement serverless functions with Angular?",
      answer:
        "Serverless functions are event-driven, stateless compute services. They can be used with Angular to handle backend logic without managing servers.",
      code: `// Firebase Functions
exports.helloWorld = functions.https.onRequest((request, response) => {
  functions.logger.info("Hello logs!", {structuredData: true});
  response.send("Hello from Firebase!");
});

// AWS Lambda
exports.handler = async (event) => {
  const response = {
    statusCode: 200,
    body: JSON.stringify('Hello from Lambda!'),
  };
  return response;
};`,
    },
    {
      id: 45,
      category: "advanced",
      level: "expert",
      question: "What are the different types of testing in Angular and when should you use them?",
      answer:
        "Different types of testing include: unit testing, integration testing, end-to-end testing, and performance testing. Each tests different aspects of the application.",
      code: `// Unit testing
- Tests individual components
- Fast
- Isolated

// Integration testing
- Tests interactions between components
- More realistic

// End-to-end testing
- Tests the entire application
- Slow
- Simulates user behavior

// Performance testing
- Measures performance metrics
- Identifies bottlenecks`,
    },
    {
      id: 46,
      category: "advanced",
      level: "expert",
      question: "How do you implement progressive web app (PWA) features in Angular?",
      answer:
        "PWA features include: service workers, manifest file, and HTTPS. They enable offline access, push notifications, and installability.",
      code: `// Install PWA
ng add @angular/pwa

// Service worker
- Caches assets
- Enables offline access

// Manifest file
- Provides metadata about the app
- Enables installability

// HTTPS
- Required for service workers`,
    },
    {
      id: 47,
      category: "advanced",
      level: "expert",
      question: "What are the different ways to deploy Angular applications?",
      answer:
        "Angular applications can be deployed to: static hosting, server-side rendering, or containerized environments. Each has different infrastructure requirements.",
      code: `// Static hosting
- Firebase Hosting
- Netlify
- AWS S3

// Server-side rendering
- Angular Universal
- Node.js server

// Containerized environments
- Docker
- Kubernetes`,
    },
    {
      id: 48,
      category: "advanced",
      level: "expert",
      question: "How do you implement accessibility (a11y) in Angular applications?",
      answer:
        "Accessibility involves making applications usable by people with disabilities. Angular provides tools for semantic HTML, ARIA attributes, and keyboard navigation.",
      code: `// Semantic HTML
- Use appropriate HTML elements
- <header>, <nav>, <main>, <article>, <aside>, <footer>

// ARIA attributes
- Add ARIA attributes to enhance accessibility
- aria-label, aria-describedby, aria-hidden

// Keyboard navigation
- Ensure keyboard navigation is possible
- tabindex attribute`,
    },
    {
      id: 49,
      category: "advanced",
      level: "expert",
      question: "What are the different ways to handle state management in Angular without using NgRx?",
      answer:
        "Alternative state management approaches include: services with RxJS, component interaction, or simple state management libraries.",
      code: `// Services with RxJS
- Use BehaviorSubject to store state
- Provide methods to update state

// Component interaction
- @Input and @Output
- EventEmitters

// Simple state management libraries
- Akita
- Elf`,
    },
    {
      id: 50,
      category: "advanced",
      level: "expert",
      question: "How do you implement custom validators in Angular forms?",
      answer:
        "Custom validators are functions that validate form control values. They can be synchronous or asynchronous.",
      code: `// Synchronous validator
function forbiddenNameValidator(nameRe: RegExp): ValidatorFn {
  return (control: AbstractControl): {[key: string]: any} | null => {
    const forbidden = nameRe.test(control.value);
    return forbidden ? {'forbiddenName': {value: control.value}} : null;
  };
}

// Asynchronous validator
function emailExistsValidator(userService: UserService): AsyncValidatorFn {
  return (control: AbstractControl): Promise<ValidationErrors | null> => {
    return userService.checkEmailExists(control.value).pipe(
      map(exists => (exists ? { emailExists: true } : null))
    ).toPromise();
  };
}

// Usage
this.form = this.fb.group({
  name: ['', [Validators.required, forbiddenNameValidator(/admin/)]],
  email: ['', [Validators.required, Validators.email], emailExistsValidator(this.userService)]
});`,
    },
    {
      id: 51,
      category: "latest-features",
      level: "expert",
      question: "What is the new @Service decorator in Angular 21?",
      answer:
        "The @Service decorator is a new way to declare services with automatic dependency injection token generation, simplifying the service definition process and providing a cleaner API.",
      code: `// Angular 21 @Service decorator
import { Service, inject } from '@angular/core';

@Service()
export class UserService {
  private apiUrl = 'https://api.example.com';

  getUsers() {
    return fetch(this.apiUrl + '/users').then(r => r.json());
  }
}

// Usage in component
@Component({
  selector: 'app-users',
  template: '<div>{{ (users$ | async) | json }}</div>',
  standalone: true
})
export class UsersComponent {
  userService = inject(UserService);
  users$ = this.userService.getUsers();
}`,
    },
    {
      id: 52,
      category: "latest-features",
      level: "expert",
      question: "What are the breaking changes in Angular 21 regarding NgModuleFactory?",
      answer:
        "NgModuleFactory has been completely removed in Angular 21. All dynamic component loading must now use standalone components or the new NgComponentOutlet APIs with ViewContainerRef.createComponent().",
      code: `// OLD WAY (No longer works in Angular 21)
// constructor(private resolver: ComponentFactoryResolver) {}
// const factory = this.resolver.resolveComponentFactory(MyComponent);

// NEW WAY - Angular 21
import { Component, ViewContainerRef, Type } from '@angular/core';

@Component({
  selector: 'app-dynamic',
  template: '<ng-container #container></ng-container>',
  standalone: true
})
export class DynamicComponent {
  constructor(private viewContainer: ViewContainerRef) {}

  loadComponent(component: Type<any>) {
    this.viewContainer.clear();
    this.viewContainer.createComponent(component);
  }
}`,
    },
    {
      id: 53,
      category: "latest-features",
      level: "expert",
      question: "What TypeScript version is required for Angular 22?",
      answer:
        "Angular 22 requires TypeScript 6.0 or higher. Support for older TypeScript versions has been completely dropped. This ensures developers have access to the latest TypeScript features.",
      code: `// package.json for Angular 22
{
  "dependencies": {
    "@angular/core": "^22.0.0",
    "typescript": "^6.0.0"
  },
  "devDependencies": {
    "ts-node": "^10.9.0"
  }
}

// Update TypeScript
npm install typescript@^6.0.0

// Verify installation
ng version
tsc --version`,
    },
    {
      id: 54,
      category: "latest-features",
      level: "expert",
      question: "How does the case-insensitive resource URL sanitizer work in Angular 22?",
      answer:
        "The resource URL sanitizer in Angular 22 treats URLs case-insensitively during lookups, improving compatibility with different URL formats and protocols. This provides better handling of resource URLs.",
      code: `// Angular 22 case-insensitive URL sanitizer
import { Component, SecurityContext } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-media',
  template: '<img [src]="imageUrl" />',
  standalone: true
})
export class MediaComponent {
  constructor(private sanitizer: DomSanitizer) {}
  
  // Now works with uppercase, mixed case, or lowercase URLs
  imageUrl = this.sanitizer.sanitize(
    SecurityContext.URL, 
    'HTTPS://EXAMPLE.COM/IMAGE.PNG'
  );
}`,
    },
    {
      id: 55,
      category: "latest-features",
      level: "expert",
      question: "What improvements were made to SVG namespace handling in Angular 22?",
      answer:
        "Angular 22 includes built-in support for SVG and namespaced elements, automatically handling XML namespace declarations and properly rendering SVG content without requiring additional workarounds.",
      code: `// Angular 22 SVG namespace handling
@Component({
  selector: 'app-svg-demo',
  template: \`
    <svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
      <circle cx="100" cy="100" r="80" fill="blue" />
      <text x="100" y="105" text-anchor="middle" fill="white" font-size="20">
        Angular 22
      </text>
    </svg>
  \`,
  standalone: true,
  styles: [\`
    svg {
      border: 2px solid #ccc;
      border-radius: 8px;
    }
  \`]
})
export class SvgDemoComponent {}`,
    },
    {
      id: 56,
      category: "latest-features",
      level: "expert",
      question: "How do enhanced router interfaces in Angular 22 improve type safety?",
      answer:
        "Angular 22 provides refined router interfaces with stricter typing and better TypeScript support, preventing runtime errors by catching routing configuration issues at compile time.",
      code: `// Angular 22 enhanced router interfaces
import { Routes, RouteReuseStrategy } from '@angular/router';
import { Component, inject } from '@angular/core';

const routes: Routes = [
  {
    path: 'dashboard',
    component: DashboardComponent,
    data: { title: 'Dashboard' },
    canActivate: [authGuard],
    canDeactivate: [confirmExitGuard]
  },
  {
    path: 'users/:id',
    component: UserDetailComponent,
    resolve: { user: userResolver }
  }
];

@Component({
  selector: 'app-navigation',
  template: '<a routerLink="/dashboard">Dashboard</a>',
  standalone: true,
  imports: [RouterLink]
})
export class NavComponent {
  router = inject(Router);
  
  navigate() {
    // Type-safe navigation with improved interface checking
    this.router.navigate(['/dashboard'], {
      queryParams: { tab: 'overview' },
      replaceUrl: true
    });
  }
}`,
    },
    {
      id: 57,
      category: "latest-features",
      level: "expert",
      question: "What is zoneless change detection in Angular 22 and how does it work?",
      answer:
        "Zoneless change detection is in developer preview in Angular 22. It eliminates the need for Zone.js by using a different approach to detect and trigger change detection, potentially improving performance.",
      code: `// Angular 22 zoneless change detection (preview)
// Enable in bootstrap

import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { ApplicationConfig } from '@angular/core';

const config: ApplicationConfig = {
  providers: [
    // Note: zoneless change detection is experimental in Angular 22
    // Full release expected in future versions
  ]
};

bootstrapApplication(AppComponent, config);

// Benefits
// - Smaller bundle size (Zone.js not needed)
// - Better performance
// - Simpler mental model`,
    },
    {
      id: 58,
      category: "latest-features",
      level: "expert",
      question: "What are the migration steps from Angular 21 to Angular 22?",
      answer:
        "Migration involves: updating TypeScript to 6.0+, replacing ComponentFactoryResolver usage, updating router configurations, and ensuring all templates use the new enhanced interfaces.",
      code: `// Angular migration checklist
// 1. Update Node and npm
node --version  // Should be 18+
npm --version   // Should be 10+

// 2. Update Angular and TypeScript
ng update @angular/cli @angular/core
npm install typescript@^6.0.0

// 3. Replace ComponentFactoryResolver
// OLD: this.resolver.resolveComponentFactory(MyComponent)
// NEW: this.viewContainer.createComponent(MyComponent)

// 4. Update router configurations
// Ensure all Routes use new interface format

// 5. Run tests and verify
npm test
ng serve`,
    },
    {
      id: 59,
      category: "latest-features",
      level: "expert",
      question: "How does the @Service decorator in Angular 21 compare to @Injectable?",
      answer:
        "@Service is a new convenience decorator that simplifies service declaration with automatic injection token generation. @Injectable with providedIn config still works but @Service provides a cleaner API for common use cases.",
      code: `// Old way with @Injectable
@Injectable({
  providedIn: 'root'
})
export class UserService {
  // service implementation
}

// New way with @Service in Angular 21+
@Service()
export class UserService {
  // service implementation
}

// Both approaches work, @Service is simpler for standard services`,
    },
    {
      id: 60,
      category: "latest-features",
      level: "expert",
      question: "What are the performance improvements in Angular 22 compared to Angular 21?",
      answer:
        "Angular 22 includes optimized Ivy compiler, improved SVG rendering, better namespace handling, enhanced change detection mechanisms, and overall performance improvements through refined APIs and reduced overhead.",
      code: `// Performance monitoring in Angular 22
import { Component, performance } from '@angular/core';

@Component({
  selector: 'app-performance',
  template: '<p>{{ metrics }}</p>',
  standalone: true
})
export class PerformanceComponent {
  metrics: any;

  ngOnInit() {
    // Performance API
    const startMark = performance.now();
    
    // Your code here
    
    const endMark = performance.now();
    this.metrics = {
      renderTime: endMark - startMark
    };
  }
}`,
    },
  ]

  // Filter questions based on selected criteria
  const filteredQuestions = interviewQuestions.filter((q) => {
    const matchesCategory = selectedCategory === "all" || q.category === selectedCategory
    const matchesLevel = selectedLevel === "all" || q.level === selectedLevel
    const matchesSearch =
      searchTerm === "" ||
      q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.answer.toLowerCase().includes(searchTerm.toLowerCase())

    return matchesCategory && matchesLevel && matchesSearch
  })

  return (
    <PageLayout
      title="Angular Interview Questions Hub"
      description="Comprehensive collection of 50+ Angular interview questions from beginner to expert level with detailed answers and code examples"
    >
      <div className="space-y-8">
        {/* Filters */}
        <section className="bg-slate-800/50 rounded-lg p-6 border border-slate-700">
          <h2 className="text-xl font-semibold mb-4 text-cyan-400">Filter Questions</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full p-2 bg-slate-700 border border-slate-600 rounded text-slate-300"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat.charAt(0).toUpperCase() + cat.slice(1).replace("-", " ")}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Level</label>
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="w-full p-2 bg-slate-700 border border-slate-600 rounded text-slate-300"
              >
                {levels.map((level) => (
                  <option key={level} value={level}>
                    {level.charAt(0).toUpperCase() + level.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Search</label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search questions..."
                className="w-full p-2 bg-slate-700 border border-slate-600 rounded text-slate-300 placeholder-slate-400"
              />
            </div>
          </div>

          <div className="mt-4 text-sm text-slate-400">
            Showing {filteredQuestions.length} of {interviewQuestions.length} questions
          </div>
        </section>

        {/* Questions */}
        <section>
          <div className="space-y-6">
            {filteredQuestions.map((q, index) => (
              <div key={q.id} className="bg-slate-800/50 rounded-lg p-6 border border-slate-700">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="bg-cyan-500/20 text-cyan-400 px-2 py-1 rounded text-sm font-medium">
                      #{index + 1}
                    </span>
                    <span className="bg-pink-500/20 text-pink-400 px-2 py-1 rounded text-sm font-medium">
                      {q.category.replace("-", " ")}
                    </span>
                    <span
                      className={`px-2 py-1 rounded text-sm font-medium ${
                        q.level === "beginner"
                          ? "bg-green-500/20 text-green-400"
                          : q.level === "intermediate"
                            ? "bg-yellow-500/20 text-yellow-400"
                            : q.level === "advanced"
                              ? "bg-orange-500/20 text-orange-400"
                              : "bg-red-500/20 text-red-400"
                      }`}
                    >
                      {q.level}
                    </span>
                  </div>
                </div>

                <h3 className="text-lg font-semibold text-slate-200 mb-3">{q.question}</h3>

                <div className="text-slate-300 leading-relaxed mb-4">{q.answer}</div>

                {q.code && <CodeExample title="Code Example" code={q.code} language="typescript" />}
              </div>
            ))}
          </div>
        </section>

        {/* Summary */}
        <section className="bg-slate-800/50 rounded-lg p-6 border border-slate-700">
          <h2 className="text-xl font-semibold mb-4 text-cyan-400">Question Categories Summary</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-pink-400 mb-3">By Category</h3>
              <div className="space-y-2">
                {categories.slice(1).map((cat) => {
                  const count = interviewQuestions.filter((q) => q.category === cat).length
                  return (
                    <div key={cat} className="flex justify-between text-sm">
                      <span className="text-slate-300 capitalize">{cat.replace("-", " ")}</span>
                      <span className="text-slate-400">{count} questions</span>
                    </div>
                  )
                })}
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-pink-400 mb-3">By Level</h3>
              <div className="space-y-2">
                {levels.slice(1).map((level) => {
                  const count = interviewQuestions.filter((q) => q.level === level).length
                  return (
                    <div key={level} className="flex justify-between text-sm">
                      <span className="text-slate-300 capitalize">{level}</span>
                      <span className="text-slate-400">{count} questions</span>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Study Tips */}
        <section className="bg-slate-800/50 rounded-lg p-6 border border-slate-700">
          <h2 className="text-xl font-semibold mb-4 text-cyan-400">Interview Preparation Tips</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-pink-400 mb-3">Technical Preparation</h3>
              <ul className="text-slate-300 space-y-2 text-sm">
                <li>• Practice coding questions hands-on</li>
                <li>• Understand concepts, don't just memorize</li>
                <li>• Build sample projects demonstrating skills</li>
                <li>• Review latest Angular features and updates</li>
                <li>• Practice explaining complex topics simply</li>
                <li>• Prepare for live coding sessions</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-pink-400 mb-3">Interview Strategy</h3>
              <ul className="text-slate-300 space-y-2 text-sm">
                <li>• Start with fundamentals, build complexity</li>
                <li>• Ask clarifying questions before answering</li>
                <li>• Explain your thought process out loud</li>
                <li>• Discuss trade-offs and alternatives</li>
                <li>• Share real-world experience examples</li>
                <li>• Be honest about knowledge gaps</li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </PageLayout>
  )
}
