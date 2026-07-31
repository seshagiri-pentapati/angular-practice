import PageLayout from "../../../components/page-layout"
import CodeExample from "../../../components/code-example"
import InterviewQuestions from "../../../components/interview-questions"

export default function LazyLoadingPage() {
  const lazyLoadingExamples = [
    {
      title: "Basic Lazy Loading Setup",
      code: `// app-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then(m => m.HomeModule)
  },
  {
    path: 'products',
    loadChildren: () => import('./products/products.module').then(m => m.ProductsModule)
  },
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule),
    canLoad: [AuthGuard] // Lazy load only if user is authenticated
  },
  {
    path: '**',
    loadChildren: () => import('./not-found/not-found.module').then(m => m.NotFoundModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    // Enable router preloading for better performance
    preloadingStrategy: PreloadAllModules,
    // Alternative: Custom preloading strategy
    // preloadingStrategy: CustomPreloadingStrategy
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }

// Feature Module (products.module.ts)
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductsRoutingModule } from './products-routing.module';
import { ProductListComponent } from './product-list/product-list.component';
import { ProductDetailComponent } from './product-detail/product-detail.component';

@NgModule({
  declarations: [
    ProductListComponent,
    ProductDetailComponent
  ],
  imports: [
    CommonModule,
    ProductsRoutingModule
  ]
})
export class ProductsModule { }

// Feature Module Routing (products-routing.module.ts)
const routes: Routes = [
  {
    path: '',
    component: ProductListComponent
  },
  {
    path: ':id',
    component: ProductDetailComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductsRoutingModule { }`,
    },
    {
      title: "Standalone Components Lazy Loading (Angular 14+)",
      code: `// app.routes.ts (Standalone Components)
import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadComponent: () => import('./home/home.component').then(c => c.HomeComponent)
  },
  {
    path: 'products',
    loadChildren: () => import('./products/products.routes').then(r => r.PRODUCT_ROUTES)
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./dashboard/dashboard.component').then(c => c.DashboardComponent),
    canMatch: [authGuard] // Guard for standalone components
  }
];

// products.routes.ts
import { Routes } from '@angular/router';

export const PRODUCT_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./product-list/product-list.component').then(c => c.ProductListComponent)
  },
  {
    path: ':id',
    loadComponent: () => import('./product-detail/product-detail.component').then(c => c.ProductDetailComponent)
  }
];

// Standalone Component Example
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: \`
    <div class="product-list">
      <h2>Products</h2>
      <div class="products-grid">
        <div *ngFor="let product of products" class="product-card">
          <h3>{{ product.name }}</h3>
          <p>{{ product.price | currency }}</p>
          <a [routerLink]="['/products', product.id]">View Details</a>
        </div>
      </div>
    </div>
  \`
})
export class ProductListComponent {
  products = [
    { id: 1, name: 'Product 1', price: 99.99 },
    { id: 2, name: 'Product 2', price: 149.99 }
  ];
}`,
    },
    {
      title: "Custom Preloading Strategy",
      code: `// custom-preloading.strategy.ts
import { Injectable } from '@angular/core';
import { PreloadingStrategy, Route } from '@angular/router';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CustomPreloadingStrategy implements PreloadingStrategy {
  preload(route: Route, load: () => Observable<any>): Observable<any> {
    // Preload based on route data
    if (route.data && route.data['preload']) {
      console.log('Preloading: ' + route.path);
      return load();
    }
    
    // Don't preload admin routes unless user is admin
    if (route.path?.includes('admin')) {
      const userRole = this.getUserRole();
      if (userRole !== 'admin') {
        return of(null);
      }
    }
    
    // Preload high-priority routes immediately
    if (route.data && route.data['priority'] === 'high') {
      return load();
    }
    
    // Preload low-priority routes after delay
    if (route.data && route.data['priority'] === 'low') {
      return new Observable(observer => {
        setTimeout(() => {
          load().subscribe(observer);
        }, 5000); // 5 second delay
      });
    }
    
    return of(null);
  }
  
  private getUserRole(): string {
    // Get user role from service/storage
    return localStorage.getItem('userRole') || 'user';
  }
}

// Usage in routing module
const routes: Routes = [
  {
    path: 'dashboard',
    loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule),
    data: { preload: true, priority: 'high' }
  },
  {
    path: 'reports',
    loadChildren: () => import('./reports/reports.module').then(m => m.ReportsModule),
    data: { preload: true, priority: 'low' }
  },
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule),
    data: { preload: false } // Never preload admin
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    preloadingStrategy: CustomPreloadingStrategy
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }`,
    },
    {
      title: "Lazy Loading with Guards and Resolvers",
      code: `// auth.guard.ts
import { Injectable } from '@angular/core';
import { CanLoad, CanMatch, Route, UrlSegment } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanLoad, CanMatch {
  constructor(private authService: AuthService) {}

  canLoad(route: Route, segments: UrlSegment[]): Observable<boolean> {
    console.log('CanLoad guard - checking if module should be loaded');
    return this.authService.isAuthenticated();
  }

  canMatch(route: Route, segments: UrlSegment[]): Observable<boolean> {
    console.log('CanMatch guard - checking if route should be matched');
    return this.authService.isAuthenticated();
  }
}

// data.resolver.ts
import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { DataService } from './data.service';

@Injectable({
  providedIn: 'root'
})
export class DataResolver implements Resolve<any> {
  constructor(private dataService: DataService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    const id = route.paramMap.get('id');
    console.log('Resolving data for:', id);
    return this.dataService.getData(id);
  }
}

// Advanced routing with guards and resolvers
const routes: Routes = [
  {
    path: 'user/:id',
    loadChildren: () => import('./user/user.module').then(m => m.UserModule),
    canLoad: [AuthGuard],
    canMatch: [AuthGuard],
    resolve: {
      userData: DataResolver
    },
    data: {
      preload: true,
      roles: ['user', 'admin']
    }
  },
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule),
    canLoad: [AuthGuard, AdminGuard],
    canMatch: [AuthGuard, AdminGuard],
    data: {
      preload: false,
      roles: ['admin']
    }
  }
];

// Using resolved data in component
@Component({
  selector: 'app-user-profile',
  template: \`
    <div class="user-profile">
      <h2>{{ userData.name }}</h2>
      <p>{{ userData.email }}</p>
      <div *ngIf="userData.isLoading">Loading additional data...</div>
    </div>
  \`
})
export class UserProfileComponent implements OnInit {
  userData: any;

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    // Access resolved data
    this.userData = this.route.snapshot.data['userData'];
    
    // Or subscribe to data changes
    this.route.data.subscribe(data => {
      this.userData = data['userData'];
    });
  }
}`,
    },
    {
      title: "Code Splitting and Dynamic Imports",
      code: `// Dynamic component loading
import { Component, ViewContainerRef, ComponentRef } from '@angular/core';

@Component({
  selector: 'app-dynamic-loader',
  template: \`
    <div class="dynamic-container">
      <button (click)="loadComponent('chart')">Load Chart</button>
      <button (click)="loadComponent('table')">Load Table</button>
      <button (click)="loadComponent('map')">Load Map</button>
      
      <div class="loading" *ngIf="isLoading">Loading component...</div>
      <div #dynamicContainer></div>
    </div>
  \`
})
export class DynamicLoaderComponent {
  isLoading = false;
  currentComponent: ComponentRef<any> | null = null;

  constructor(private viewContainer: ViewContainerRef) {}

  async loadComponent(type: string) {
    this.isLoading = true;
    
    // Clear previous component
    if (this.currentComponent) {
      this.currentComponent.destroy();
    }
    this.viewContainer.clear();

    try {
      let component;
      
      switch (type) {
        case 'chart':
          const chartModule = await import('./chart/chart.component');
          component = chartModule.ChartComponent;
          break;
        case 'table':
          const tableModule = await import('./table/table.component');
          component = tableModule.TableComponent;
          break;
        case 'map':
          const mapModule = await import('./map/map.component');
          component = mapModule.MapComponent;
          break;
        default:
          throw new Error('Unknown component type');
      }

      // Create component dynamically
      this.currentComponent = this.viewContainer.createComponent(component);
      
      // Pass data to component if needed
      if (this.currentComponent.instance.data) {
        this.currentComponent.instance.data = this.getData(type);
      }
      
    } catch (error) {
      console.error('Failed to load component:', error);
    } finally {
      this.isLoading = false;
    }
  }

  private getData(type: string): any {
    // Return appropriate data based on component type
    switch (type) {
      case 'chart':
        return { chartData: [1, 2, 3, 4, 5] };
      case 'table':
        return { tableData: [{ id: 1, name: 'Item 1' }] };
      case 'map':
        return { coordinates: { lat: 40.7128, lng: -74.0060 } };
      default:
        return {};
    }
  }
}

// Service for dynamic module loading
@Injectable({
  providedIn: 'root'
})
export class DynamicModuleService {
  private loadedModules = new Map<string, any>();

  async loadModule(moduleName: string): Promise<any> {
    // Check if module is already loaded
    if (this.loadedModules.has(moduleName)) {
      return this.loadedModules.get(moduleName);
    }

    try {
      let module;
      
      switch (moduleName) {
        case 'analytics':
          module = await import('./analytics/analytics.module');
          break;
        case 'reporting':
          module = await import('./reporting/reporting.module');
          break;
        case 'dashboard':
          module = await import('./dashboard/dashboard.module');
          break;
        default:
          throw new Error(\`Module \${moduleName} not found\`);
      }

      // Cache the loaded module
      this.loadedModules.set(moduleName, module);
      return module;
      
    } catch (error) {
      console.error(\`Failed to load module \${moduleName}:\`, error);
      throw error;
    }
  }

  isModuleLoaded(moduleName: string): boolean {
    return this.loadedModules.has(moduleName);
  }

  unloadModule(moduleName: string): void {
    this.loadedModules.delete(moduleName);
  }
}`,
    },
  ]

  const interviewQuestions = [
    {
      question: "What is lazy loading in Angular and why is it important?",
      answer:
        "Lazy loading is a technique where Angular modules are loaded on-demand rather than at application startup. It's important because it reduces initial bundle size, improves application startup time, allows for better code organization, and enables loading features only when users need them. This is especially crucial for large applications with many features.",
    },
    {
      question: "Explain the difference between CanLoad and CanMatch guards.",
      answer:
        "CanLoad prevents a lazy-loaded module from being downloaded if the guard returns false, while CanMatch determines if a route should be matched after the module is loaded. CanLoad is checked before module loading, CanMatch is checked after. Use CanLoad for authentication/authorization to prevent unnecessary downloads, and CanMatch for more complex routing logic.",
    },
    {
      question: "How do you implement lazy loading with standalone components?",
      answer:
        "With standalone components (Angular 14+), you use `loadComponent` instead of `loadChildren` in route configuration. You can also use `loadChildren` with route arrays for multiple standalone components. This eliminates the need for NgModules while still providing lazy loading benefits.",
    },
    {
      question: "What are preloading strategies and how do you create custom ones?",
      answer:
        "Preloading strategies determine which lazy-loaded modules to load in the background after the initial application load. Angular provides PreloadAllModules and NoPreloading. Custom strategies implement the PreloadingStrategy interface and can preload based on user roles, route priority, network conditions, or other criteria.",
    },
    {
      question: "How do you handle dynamic component loading and code splitting?",
      answer:
        "Dynamic component loading uses ViewContainerRef.createComponent() with dynamically imported components. Code splitting is achieved through dynamic imports (import()) which create separate chunks. This allows loading components/modules only when needed, reducing initial bundle size and improving performance.",
    },
    {
      question: "What are the performance implications of lazy loading?",
      answer:
        "Benefits include smaller initial bundles, faster startup times, and better resource utilization. Drawbacks include potential delays when navigating to lazy-loaded routes, complexity in managing dependencies, and the need for proper error handling. Preloading strategies can mitigate navigation delays.",
    },
    {
      question: "How do you test lazy-loaded modules?",
      answer:
        "Testing involves: 1) Unit testing individual components/services within modules, 2) Integration testing with RouterTestingModule to test lazy loading behavior, 3) Testing guards and resolvers, 4) E2E testing to verify actual lazy loading in the browser, 5) Testing preloading strategies and error scenarios.",
    },
    {
      question: "What are the best practices for organizing lazy-loaded modules?",
      answer:
        "Best practices include: organizing by feature domains, keeping modules focused and cohesive, using shared modules for common functionality, implementing proper barrel exports, following consistent naming conventions, and ensuring proper dependency management between lazy-loaded modules.",
    },
  ]

  return (
    <PageLayout
      title="Lazy Loading & Code Splitting"
      description="Master Angular's lazy loading techniques for optimal application performance and user experience"
    >
      <div className="space-y-8">
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-cyan-400">Overview</h2>
          <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700">
            <p className="text-slate-300 leading-relaxed mb-4">
              Lazy loading is a crucial optimization technique in Angular that allows you to load application modules
              on-demand rather than at startup. This significantly improves initial load times and provides better user
              experience, especially for large applications with multiple feature areas.
            </p>
            <div className="grid md:grid-cols-2 gap-4 mt-6">
              <div className="bg-slate-900/50 p-4 rounded border border-slate-600">
                <h3 className="font-semibold text-pink-400 mb-2">Benefits</h3>
                <ul className="text-sm text-slate-300 space-y-1">
                  <li>• Reduced initial bundle size</li>
                  <li>• Faster application startup</li>
                  <li>• Better resource utilization</li>
                  <li>• Improved user experience</li>
                  <li>• Better code organization</li>
                  <li>• Scalable architecture</li>
                </ul>
              </div>
              <div className="bg-slate-900/50 p-4 rounded border border-slate-600">
                <h3 className="font-semibold text-pink-400 mb-2">Key Concepts</h3>
                <ul className="text-sm text-slate-300 space-y-1">
                  <li>• Route-based code splitting</li>
                  <li>• Dynamic imports</li>
                  <li>• Preloading strategies</li>
                  <li>• Guards and resolvers</li>
                  <li>• Standalone components</li>
                  <li>• Bundle optimization</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-cyan-400">Code Examples</h2>
          <div className="space-y-6">
            {lazyLoadingExamples.map((example, index) => (
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
