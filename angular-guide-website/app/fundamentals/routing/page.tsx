import { PageLayout } from "@/components/page-layout"
import { CodeExample } from "@/components/code-example"
import { InterviewQuestions } from "@/components/interview-questions"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Route } from "lucide-react"

const routingQuestions = [
  {
    id: "what-is-routing",
    question: "What is routing in Angular and how does it work?",
    answer: `<p>Angular routing enables navigation from one view to another as users perform application tasks:</p>
    <ul>
      <li><strong>Router:</strong> Main service that handles navigation</li>
      <li><strong>Routes:</strong> Configuration that maps URL paths to components</li>
      <li><strong>Router Outlet:</strong> Placeholder where routed components are displayed</li>
      <li><strong>Router Link:</strong> Directive for creating navigation links</li>
      <li><strong>Activated Route:</strong> Service that provides information about active route</li>
    </ul>
    <p>The router uses the browser's history API to manage navigation and URL changes.</p>`,
    difficulty: "Easy" as const,
    tags: ["routing", "navigation"],
  },
  {
    id: "route-guards",
    question: "What are route guards and what types are available?",
    answer: `<p>Route guards are interfaces that control navigation to and from routes:</p>
    <ul>
      <li><strong>CanActivate:</strong> Controls if a route can be activated</li>
      <li><strong>CanActivateChild:</strong> Controls if child routes can be activated</li>
      <li><strong>CanDeactivate:</strong> Controls if user can leave a route</li>
      <li><strong>CanLoad:</strong> Controls if a module can be loaded</li>
      <li><strong>Resolve:</strong> Pre-fetches data before route activation</li>
    </ul>
    <p>Guards return boolean, Promise&lt;boolean&gt;, or Observable&lt;boolean&gt; to allow/deny navigation.</p>`,
    difficulty: "Medium" as const,
    tags: ["guards", "security", "navigation"],
  },
  {
    id: "lazy-loading",
    question: "How does lazy loading work in Angular routing?",
    answer: `<p>Lazy loading loads feature modules only when needed, improving initial load time:</p>
    <ul>
      <li><strong>loadChildren:</strong> Property that specifies module to load</li>
      <li><strong>Dynamic imports:</strong> Uses import() function for code splitting</li>
      <li><strong>Separate bundles:</strong> Creates separate JavaScript bundles for lazy modules</li>
      <li><strong>On-demand loading:</strong> Modules loaded when route is first accessed</li>
    </ul>
    <p>Example: { path: 'feature', loadChildren: () => import('./feature/feature.module').then(m => m.FeatureModule) }</p>`,
    difficulty: "Medium" as const,
    tags: ["lazy-loading", "performance", "modules"],
  },
]

export default function RoutingPage() {
  return (
    <PageLayout
      title="Routing & Navigation"
      description="Master Angular routing for single-page application navigation"
      badge="Fundamentals"
      previousPage={{ title: "Services", href: "/fundamentals/services" }}
      nextPage={{ title: "Forms", href: "/fundamentals/forms" }}
    >
      <div className="space-y-8">
        {/* Introduction */}
        <div>
          <h2>Angular Routing</h2>
          <p>
            Angular's router enables navigation from one view to another as users perform application tasks. It
            interprets browser URL as an instruction to navigate to a client-generated view and can pass optional
            parameters to the supporting view component.
          </p>
        </div>

        {/* Router Concepts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Route className="w-5 h-5 text-primary" />
              Core Routing Concepts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li>
                • <strong>Router:</strong> Main service that handles navigation between views
              </li>
              <li>
                • <strong>Route Configuration:</strong> Maps URL paths to components
              </li>
              <li>
                • <strong>Router Outlet:</strong> Placeholder where routed components are displayed
              </li>
              <li>
                • <strong>Router Link:</strong> Directive for creating navigation links
              </li>
              <li>
                • <strong>Activated Route:</strong> Provides information about the active route
              </li>
              <li>
                • <strong>Route Parameters:</strong> Data passed through the URL
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Basic Routing Setup */}
        <div>
          <h2>Basic Routing Setup</h2>
          <p>Setting up routing involves configuring routes, adding router outlet, and creating navigation links.</p>
        </div>

        <CodeExample
          title="Basic Routing Configuration"
          description="Setting up routes and navigation in an Angular application"
          filename="app-routing.module.ts"
          code={`import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { ContactComponent } from './contact/contact.component';
import { ProductsComponent } from './products/products.component';
import { ProductDetailComponent } from './products/product-detail/product-detail.component';
import { NotFoundComponent } from './not-found/not-found.component';

const routes: Routes = [
  // Default route
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  
  // Basic routes
  { path: 'home', component: HomeComponent },
  { path: 'about', component: AboutComponent },
  { path: 'contact', component: ContactComponent },
  
  // Route with parameters
  { path: 'products', component: ProductsComponent },
  { path: 'products/:id', component: ProductDetailComponent },
  
  // Route with multiple parameters
  { path: 'products/:category/:id', component: ProductDetailComponent },
  
  // Route with query parameters and fragments
  { path: 'search', component: SearchComponent },
  
  // Wildcard route - must be last
  { path: '**', component: NotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    // Router configuration options
    enableTracing: false, // Set to true for debugging
    scrollPositionRestoration: 'top',
    anchorScrolling: 'enabled',
    scrollOffset: [0, 64] // Offset for fixed headers
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }`}
        />

        <CodeExample
          title="App Component with Router Outlet"
          description="Main app component template with navigation and router outlet"
          filename="app.component.html"
          code={`<div class="app-container">
  <!-- Navigation Header -->
  <header class="navbar">
    <div class="nav-brand">
      <a routerLink="/" class="brand-link">MyApp</a>
    </div>
    
    <nav class="nav-menu">
      <a routerLink="/home" 
         routerLinkActive="active" 
         class="nav-link">Home</a>
      
      <a routerLink="/about" 
         routerLinkActive="active" 
         class="nav-link">About</a>
      
      <a routerLink="/products" 
         routerLinkActive="active" 
         [routerLinkActiveOptions]="{exact: false}"
         class="nav-link">Products</a>
      
      <a routerLink="/contact" 
         routerLinkActive="active" 
         class="nav-link">Contact</a>
      
      <!-- Programmatic navigation -->
      <button (click)="navigateToSearch()" class="nav-button">
        Search
      </button>
    </nav>
  </header>
  
  <!-- Main Content Area -->
  <main class="main-content">
    <!-- This is where routed components will be displayed -->
    <router-outlet></router-outlet>
  </main>
  
  <!-- Footer -->
  <footer class="footer">
    <p>&copy; 2024 MyApp. All rights reserved.</p>
  </footer>
</div>

<!-- Loading indicator -->
<div *ngIf="isLoading" class="loading-overlay">
  <div class="spinner"></div>
</div>`}
        />

        <CodeExample
          title="App Component with Navigation Logic"
          description="Component logic for handling navigation and route events"
          filename="app.component.ts"
          code={`import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, NavigationStart, NavigationError } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'MyApp';
  isLoading = false;
  
  constructor(private router: Router) {}
  
  ngOnInit() {
    // Listen to router events
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.isLoading = true;
      } else if (event instanceof NavigationEnd) {
        this.isLoading = false;
        // Track page views, update breadcrumbs, etc.
        console.log('Navigation completed:', event.url);
      } else if (event instanceof NavigationError) {
        this.isLoading = false;
        console.error('Navigation error:', event.error);
      }
    });
    
    // Listen only to NavigationEnd events
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      // Handle successful navigation
      this.updatePageTitle(event.url);
    });
  }
  
  // Programmatic navigation
  navigateToSearch() {
    this.router.navigate(['/search'], {
      queryParams: { q: 'angular', category: 'tutorials' },
      fragment: 'results'
    });
  }
  
  // Navigate with parameters
  navigateToProduct(productId: number) {
    this.router.navigate(['/products', productId]);
  }
  
  // Navigate with complex parameters
  navigateToProductInCategory(category: string, productId: number) {
    this.router.navigate(['/products', category, productId], {
      queryParams: { view: 'detailed' },
      fragment: 'specifications'
    });
  }
  
  // Navigate relative to current route
  navigateRelative() {
    this.router.navigate(['../sibling'], { relativeTo: this.route });
  }
  
  // Go back in history
  goBack() {
    window.history.back();
  }
  
  private updatePageTitle(url: string) {
    const titles: { [key: string]: string } = {
      '/home': 'Home - MyApp',
      '/about': 'About Us - MyApp',
      '/products': 'Products - MyApp',
      '/contact': 'Contact - MyApp'
    };
    
    const title = titles[url] || 'MyApp';
    document.title = title;
  }
}`}
        />

        {/* Route Parameters */}
        <div>
          <h2>Working with Route Parameters</h2>
          <p>
            Angular routing supports various types of parameters: route parameters, query parameters, and fragments.
            Here's how to work with them.
          </p>
        </div>

        <CodeExample
          title="Route Parameters Example"
          description="Component that handles route parameters, query params, and fragments"
          filename="product-detail.component.ts"
          code={`import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  description: string;
}

@Component({
  selector: 'app-product-detail',
  template: \`
    <div class="product-detail" *ngIf="product">
      <nav class="breadcrumb">
        <a routerLink="/products">Products</a> > 
        <a [routerLink]="['/products']" [queryParams]="{category: product.category}">
          {{ product.category }}
        </a> > 
        <span>{{ product.name }}</span>
      </nav>
      
      <div class="product-info">
        <h1>{{ product.name }}</h1>
        <p class="category">Category: {{ product.category }}</p>
        <p class="price>\${{ product.price }}</p>
        <p class="description">{{ product.description }}</p>
        
        <!-- Fragment navigation -->
        <div class="product-sections">
          <a [routerLink]="[]" fragment="details" class="section-link">Details</a>
          <a [routerLink]="[]" fragment="reviews" class="section-link">Reviews</a>
          <a [routerLink]="[]" fragment="specifications" class="section-link">Specifications</a>
        </div>
        
        <div id="details" class="section">
          <h2>Product Details</h2>
          <p>Detailed information about {{ product.name }}</p>
        </div>
        
        <div id="reviews" class="section">
          <h2>Customer Reviews</h2>
          <p>Reviews for {{ product.name }}</p>
        </div>
        
        <div id="specifications" class="section">
          <h2>Specifications</h2>
          <p>Technical specifications for {{ product.name }}</p>
        </div>
      </div>
      
      <div class="actions">
        <button (click)="editProduct()" class="btn-primary">Edit</button>
        <button (click)="goBack()" class="btn-secondary">Back to Products</button>
        <button (click)="navigateToRelated()" class="btn-secondary">Related Products</button>
      </div>
    </div>
    
    <div *ngIf="!product" class="loading">
      Loading product...
    </div>
  \`,
  styles: [\`
    .product-detail { padding: 20px; }
    .breadcrumb { margin-bottom: 20px; color: #666; }
    .breadcrumb a { color: #007bff; text-decoration: none; }
    .product-info h1 { color: #333; margin-bottom: 10px; }
    .category { color: #666; font-style: italic; }
    .price { font-size: 24px; font-weight: bold; color: #28a745; }
    .section-link { 
      display: inline-block; 
      margin-right: 15px; 
      padding: 5px 10px; 
      background: #f8f9fa; 
      text-decoration: none; 
      border-radius: 3px;
    }
    .section { margin: 20px 0; padding: 20px; border: 1px solid #ddd; }
    .actions { margin-top: 30px; }
    .btn-primary, .btn-secondary { 
      margin-right: 10px; 
      padding: 10px 20px; 
      border: none; 
      border-radius: 4px; 
      cursor: pointer;
    }
    .btn-primary { background: #007bff; color: white; }
    .btn-secondary { background: #6c757d; color: white; }
  \`]
})
export class ProductDetailComponent implements OnInit, OnDestroy {
  product: Product | null = null;
  productId: number = 0;
  category: string = '';
  view: string = 'summary';
  
  private subscription = new Subscription();
  
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService
  ) {}
  
  ngOnInit() {
    // Method 1: Using snapshot (for one-time read)
    // this.productId = +this.route.snapshot.paramMap.get('id')!;
    
    // Method 2: Using observable (reactive to parameter changes)
    this.subscription.add(
      this.route.paramMap.subscribe((params: ParamMap) => {
        this.productId = +params.get('id')!;
        this.category = params.get('category') || '';
        this.loadProduct();
      })
    );
    
    // Listen to query parameters
    this.subscription.add(
      this.route.queryParamMap.subscribe(queryParams => {
        this.view = queryParams.get('view') || 'summary';
        console.log('View mode:', this.view);
      })
    );
    
    // Listen to fragments
    this.subscription.add(
      this.route.fragment.subscribe(fragment => {
        if (fragment) {
          // Scroll to element with the fragment id
          setTimeout(() => {
            const element = document.getElementById(fragment);
            if (element) {
              element.scrollIntoView({ behavior: 'smooth' });
            }
          }, 100);
        }
      })
    );
    
    // Method 3: Using switchMap for complex parameter handling
    this.subscription.add(
      this.route.paramMap.pipe(
        switchMap((params: ParamMap) => {
          const id = +params.get('id')!;
          return this.productService.getProduct(id);
        })
      ).subscribe(product => {
        this.product = product;
      })
    );
  }
  
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
  
  private loadProduct() {
    if (this.productId) {
      this.productService.getProduct(this.productId).subscribe(
        product => this.product = product,
        error => console.error('Error loading product:', error)
      );
    }
  }
  
  editProduct() {
    if (this.product) {
      this.router.navigate(['/products', this.product.id, 'edit'], {
        queryParams: { returnUrl: this.router.url }
      });
    }
  }
  
  goBack() {
    this.router.navigate(['/products'], {
      queryParams: this.category ? { category: this.category } : {}
    });
  }
  
  navigateToRelated() {
    if (this.product) {
      this.router.navigate(['/products'], {
        queryParams: { 
          category: this.product.category,
          exclude: this.product.id 
        }
      });
    }
  }
}`}
        />

        {/* Route Guards */}
        <div>
          <h2>Route Guards</h2>
          <p>
            Route guards control navigation to and from routes. They're useful for authentication, authorization, data
            validation, and preventing users from leaving unsaved changes.
          </p>
        </div>

        <CodeExample
          title="Route Guards Examples"
          description="Different types of route guards for controlling navigation"
          filename="guards.ts"
          code={`import { Injectable } from '@angular/core';
import { 
  CanActivate, 
  CanActivateChild, 
  CanDeactivate, 
  CanLoad,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Route,
  UrlSegment
} from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

// Interface for components that can be deactivated
export interface CanComponentDeactivate {
  canDeactivate: () => Observable<boolean> | Promise<boolean> | boolean;
}

// 1. CanActivate Guard - Controls route activation
@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}
  
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    
    return this.authService.isAuthenticated().pipe(
      map(isAuthenticated => {
        if (isAuthenticated) {
          return true;
        } else {
          // Redirect to login with return URL
          this.router.navigate(['/login'], {
            queryParams: { returnUrl: state.url }
          });
          return false;
        }
      })
    );
  }
}

// 2. Role-based Guard
@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}
  
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    
    const requiredRoles = route.data['roles'] as string[];
    
    return this.authService.getCurrentUser().pipe(
      map(user => {
        if (user && requiredRoles.some(role => user.roles.includes(role))) {
          return true;
        } else {
          this.router.navigate(['/unauthorized']);
          return false;
        }
      })
    );
  }
}

// 3. CanActivateChild Guard - Controls child route activation
@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivateChild {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}
  
  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    
    return this.authService.hasRole('admin').pipe(
      map(hasAdminRole => {
        if (hasAdminRole) {
          return true;
        } else {
          this.router.navigate(['/access-denied']);
          return false;
        }
      })
    );
  }
}

// 4. CanDeactivate Guard - Controls leaving a route
@Injectable({
  providedIn: 'root'
})
export class UnsavedChangesGuard implements CanDeactivate<CanComponentDeactivate> {
  canDeactivate(
    component: CanComponentDeactivate,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState?: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    
    // If component has canDeactivate method, call it
    if (component.canDeactivate) {
      return component.canDeactivate();
    }
    
    return true;
  }
}

// 5. CanLoad Guard - Controls module loading
@Injectable({
  providedIn: 'root'
})
export class FeatureGuard implements CanLoad {
  constructor(
    private featureService: FeatureService,
    private router: Router
  ) {}
  
  canLoad(
    route: Route,
    segments: UrlSegment[]
  ): Observable<boolean> | Promise<boolean> | boolean {
    
    const featureName = route.data?.['feature'];
    
    return this.featureService.isFeatureEnabled(featureName).pipe(
      map(isEnabled => {
        if (isEnabled) {
          return true;
        } else {
          this.router.navigate(['/feature-not-available']);
          return false;
        }
      })
    );
  }
}

// Usage in routing configuration:
/*
const routes: Routes = [
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [AuthGuard, RoleGuard],
    canActivateChild: [AdminGuard],
    data: { roles: ['admin', 'super-admin'] },
    children: [
      { path: 'users', component: UsersComponent },
      { path: 'settings', component: SettingsComponent }
    ]
  },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [AuthGuard],
    canDeactivate: [UnsavedChangesGuard]
  },
  {
    path: 'feature',
    loadChildren: () => import('./feature/feature.module').then(m => m.FeatureModule),
    canLoad: [FeatureGuard],
    data: { feature: 'new-ui' }
  }
];
*/

// Example component implementing CanComponentDeactivate
/*
@Component({...})
export class ProfileEditComponent implements CanComponentDeactivate {
  hasUnsavedChanges = false;
  
  canDeactivate(): Observable<boolean> | Promise<boolean> | boolean {
    if (this.hasUnsavedChanges) {
      return confirm('You have unsaved changes. Do you want to leave?');
    }
    return true;
  }
  
  onFormChange() {
    this.hasUnsavedChanges = true;
  }
  
  onSave() {
    this.hasUnsavedChanges = false;
    // Save logic
  }
}
*/`}
        />

        {/* Interview Questions */}
        <InterviewQuestions questions={routingQuestions} />
      </div>
    </PageLayout>
  )
}
