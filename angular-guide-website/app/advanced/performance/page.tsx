import PageLayout from "../../../components/page-layout"
import CodeExample from "../../../components/code-example"
import InterviewQuestions from "../../../components/interview-questions"

export default function PerformancePage() {
  const performanceExamples = [
    {
      title: "OnPush Change Detection Strategy",
      code: `// OnPush Strategy Component
import { Component, ChangeDetectionStrategy, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-optimized-component',
  template: \`
    <div class="optimized-component">
      <h3>{{ title }}</h3>
      <p>Count: {{ count }}</p>
      <p>User: {{ user?.name }}</p>
      
      <!-- Using async pipe for observables -->
      <div *ngIf="data$ | async as data">
        <p>Data: {{ data.value }}</p>
      </div>
      
      <!-- Trackby function for ngFor -->
      <ul>
        <li *ngFor="let item of items; trackBy: trackByFn">
          {{ item.name }} - {{ item.value }}
        </li>
      </ul>
      
      <button (click)="updateCount()">Update Count</button>
    </div>
  \`,
  changeDetection: ChangeDetectionStrategy.OnPush // Enable OnPush
})
export class OptimizedComponent implements OnInit {
  @Input() title: string = '';
  @Input() user: { name: string; id: number } | null = null;
  @Input() items: { id: number; name: string; value: number }[] = [];
  
  count = 0;
  data$: Observable<any>;

  constructor(private cdr: ChangeDetectorRef, private dataService: DataService) {}

  ngOnInit() {
    this.data$ = this.dataService.getData();
  }

  // TrackBy function for performance
  trackByFn(index: number, item: any): number {
    return item.id; // Use unique identifier
  }

  updateCount() {
    this.count++;
    // Manually trigger change detection when needed
    this.cdr.markForCheck();
  }

  // Method to update data immutably
  updateItems(newItem: any) {
    // Create new array reference for OnPush to detect changes
    this.items = [...this.items, newItem];
    this.cdr.markForCheck();
  }
}

// Parent component using OnPush child
@Component({
  selector: 'app-parent',
  template: \`
    <app-optimized-component
      [title]="componentTitle"
      [user]="currentUser"
      [items]="itemList"
    ></app-optimized-component>
  \`
})
export class ParentComponent {
  componentTitle = 'Optimized Component';
  currentUser = { name: 'John Doe', id: 1 };
  itemList = [
    { id: 1, name: 'Item 1', value: 100 },
    { id: 2, name: 'Item 2', value: 200 }
  ];

  // Immutable update pattern
  updateUser(newName: string) {
    // Create new object reference
    this.currentUser = { ...this.currentUser, name: newName };
  }
}`,
    },
    {
      title: "Lazy Loading and Code Splitting",
      code: `// Lazy Loading Module Setup
// app-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule)
  },
  {
    path: 'users',
    loadChildren: () => import('./users/users.module').then(m => m.UsersModule)
  },
  {
    path: 'products',
    loadChildren: () => import('./products/products.module').then(m => m.ProductsModule)
  },
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule),
    canLoad: [AdminGuard] // Guard for lazy-loaded modules
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    // Enable router preloading strategies
    preloadingStrategy: PreloadAllModules,
    // Or custom preloading
    // preloadingStrategy: CustomPreloadingStrategy
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }

// Custom Preloading Strategy
import { Injectable } from '@angular/core';
import { PreloadingStrategy, Route } from '@angular/router';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CustomPreloadingStrategy implements PreloadingStrategy {
  preload(route: Route, fn: () => Observable<any>): Observable<any> {
    // Only preload routes marked with preload: true
    if (route.data && route.data['preload']) {
      console.log('Preloading: ' + route.path);
      return fn();
    } else {
      return of(null);
    }
  }
}

// Feature Module with Lazy Loading
// users/users.module.ts
@NgModule({
  declarations: [
    UsersComponent,
    UserListComponent,
    UserDetailComponent
  ],
  imports: [
    CommonModule,
    UsersRoutingModule,
    SharedModule // Import shared components/pipes
  ]
})
export class UsersModule { }

// users/users-routing.module.ts
const routes: Routes = [
  {
    path: '',
    component: UsersComponent,
    children: [
      { path: '', component: UserListComponent },
      { path: ':id', component: UserDetailComponent }
    ]
  }
];

// Dynamic Component Loading
@Component({
  selector: 'app-dynamic-loader',
  template: \`
    <div class="dynamic-container">
      <button (click)="loadComponent('chart')">Load Chart</button>
      <button (click)="loadComponent('table')">Load Table</button>
      
      <div #dynamicContainer></div>
    </div>
  \`
})
export class DynamicLoaderComponent {
  @ViewChild('dynamicContainer', { read: ViewContainerRef }) 
  container!: ViewContainerRef;

  async loadComponent(type: string) {
    this.container.clear();

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
    }

    if (component) {
      this.container.createComponent(component);
    }
  }
}`,
    },
    {
      title: "Bundle Optimization and Tree Shaking",
      code: `// Bundle Analysis and Optimization

// 1. Analyze Bundle Size
// Run: ng build --stats-json
// Then: npx webpack-bundle-analyzer dist/stats.json

// 2. Optimize Imports - Use Specific Imports
// ❌ Bad - Imports entire library
import * as _ from 'lodash';
import { Observable } from 'rxjs';

// ✅ Good - Import only what you need
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { map } from 'rxjs/operators';

// 3. Tree-shakable Service Providers
@Injectable({
  providedIn: 'root' // Tree-shakable
})
export class OptimizedService {
  // Service implementation
}

// 4. Lazy Load Third-party Libraries
@Component({
  selector: 'app-chart',
  template: '<div #chartContainer></div>'
})
export class ChartComponent implements OnInit {
  @ViewChild('chartContainer') container!: ElementRef;

  async ngOnInit() {
    // Dynamically import heavy library
    const { Chart } = await import('chart.js');
    
    new Chart(this.container.nativeElement, {
      type: 'bar',
      data: this.chartData,
      options: this.chartOptions
    });
  }
}

// 5. Optimize Angular Material Imports
// ❌ Bad - Imports entire Material module
import { MatModule } from '@angular/material';

// ✅ Good - Import specific modules
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';

@NgModule({
  imports: [
    MatButtonModule,
    MatCardModule,
    MatInputModule
  ]
})
export class FeatureModule { }

// 6. Use OnPush and Immutable Data Patterns
@Component({
  selector: 'app-list',
  template: \`
    <div *ngFor="let item of items; trackBy: trackByFn">
      {{ item.name }}
    </div>
  \`,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListComponent {
  @Input() items: Item[] = [];

  trackByFn(index: number, item: Item): number {
    return item.id;
  }
}

// 7. Implement Virtual Scrolling for Large Lists
@Component({
  selector: 'app-virtual-list',
  template: \`
    <cdk-virtual-scroll-viewport itemSize="50" class="viewport">
      <div *cdkVirtualFor="let item of items">
        {{ item.name }}
      </div>
    </cdk-virtual-scroll-viewport>
  \`,
  styles: [\`
    .viewport {
      height: 400px;
      width: 100%;
    }
  \`]
})
export class VirtualListComponent {
  items = Array.from({length: 10000}, (_, i) => ({
    id: i,
    name: \`Item \${i}\`
  }));
}`,
    },
    {
      title: "Memory Management and Leak Prevention",
      code: `// Memory Management Best Practices
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, Subscription, interval } from 'rxjs';
import { takeUntil, takeWhile } from 'rxjs/operators';

@Component({
  selector: 'app-memory-optimized',
  template: \`
    <div class="component">
      <h3>Memory Optimized Component</h3>
      <p>Timer: {{ timer }}</p>
      <p>Data: {{ data | json }}</p>
    </div>
  \`
})
export class MemoryOptimizedComponent implements OnInit, OnDestroy {
  // Method 1: Using takeUntil pattern
  private destroy$ = new Subject<void>();
  
  // Method 2: Manual subscription management
  private subscriptions = new Subscription();
  
  timer = 0;
  data: any = {};

  constructor(
    private dataService: DataService,
    private websocketService: WebSocketService
  ) {}

  ngOnInit() {
    // ✅ Good - Using takeUntil for automatic cleanup
    interval(1000)
      .pipe(takeUntil(this.destroy$))
      .subscribe(val => this.timer = val);

    // ✅ Good - Using takeUntil for HTTP requests
    this.dataService.getData()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => this.data = data);

    // ✅ Good - Manual subscription management
    const websocketSub = this.websocketService.connect()
      .pipe(takeUntil(this.destroy$))
      .subscribe(message => this.handleMessage(message));
    
    this.subscriptions.add(websocketSub);

    // ✅ Good - Event listener cleanup
    this.setupEventListeners();
  }

  ngOnDestroy() {
    // Method 1: Complete the destroy subject
    this.destroy$.next();
    this.destroy$.complete();
    
    // Method 2: Unsubscribe from manual subscriptions
    this.subscriptions.unsubscribe();
    
    // Clean up event listeners
    this.cleanupEventListeners();
  }

  private setupEventListeners() {
    // Store reference for cleanup
    this.handleResize = this.handleResize.bind(this);
    window.addEventListener('resize', this.handleResize);
  }

  private cleanupEventListeners() {
    window.removeEventListener('resize', this.handleResize);
  }

  private handleResize() {
    // Handle window resize
  }

  private handleMessage(message: any) {
    // Handle websocket message
  }
}

// Service with Proper Cleanup
@Injectable({
  providedIn: 'root'
})
export class DataService implements OnDestroy {
  private cache = new Map<string, any>();
  private destroy$ = new Subject<void>();

  constructor(private http: HttpClient) {
    // Setup periodic cache cleanup
    interval(300000) // 5 minutes
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.cleanupCache());
  }

  getData(id: string): Observable<any> {
    // Check cache first
    if (this.cache.has(id)) {
      return of(this.cache.get(id));
    }

    return this.http.get(\`/api/data/\${id}\`)
      .pipe(
        tap(data => this.cache.set(id, data)),
        takeUntil(this.destroy$)
      );
  }

  private cleanupCache() {
    // Implement cache cleanup logic
    if (this.cache.size > 100) {
      const keysToDelete = Array.from(this.cache.keys()).slice(0, 50);
      keysToDelete.forEach(key => this.cache.delete(key));
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    this.cache.clear();
  }
}

// Optimized Pipe for Heavy Computations
@Pipe({
  name: 'expensiveCalculation',
  pure: true // Ensure pure pipe for better performance
})
export class ExpensiveCalculationPipe implements PipeTransform {
  private cache = new Map<string, any>();

  transform(value: any, ...args: any[]): any {
    const cacheKey = JSON.stringify({ value, args });
    
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    const result = this.performExpensiveCalculation(value, ...args);
    this.cache.set(cacheKey, result);
    
    return result;
  }

  private performExpensiveCalculation(value: any, ...args: any[]): any {
    // Expensive computation here
    return value;
  }
}`,
    },
  ]

  const interviewQuestions = [
    {
      question: "What is OnPush change detection strategy and when should you use it?",
      answer:
        "OnPush change detection strategy tells Angular to only check a component for changes when: 1) An input property reference changes, 2) An event is triggered, 3) markForCheck() is called manually. Use it for components with immutable inputs or when you want to optimize performance by reducing change detection cycles.",
    },
    {
      question: "How do you implement lazy loading in Angular and what are its benefits?",
      answer:
        "Lazy loading is implemented using loadChildren in route configuration with dynamic imports. Benefits include: reduced initial bundle size, faster app startup, better user experience, and loading modules only when needed. You can also implement custom preloading strategies to optimize the loading experience.",
    },
    {
      question: "What are the common causes of memory leaks in Angular applications?",
      answer:
        "Common causes include: unsubscribed Observables, event listeners not removed in ngOnDestroy, setInterval/setTimeout not cleared, DOM references held after component destruction, and circular references. Use takeUntil pattern, implement OnDestroy, and use Angular DevTools to detect leaks.",
    },
    {
      question: "How do you optimize bundle size in Angular applications?",
      answer:
        "Bundle optimization techniques include: tree shaking with specific imports, lazy loading modules, using OnPush change detection, implementing virtual scrolling for large lists, analyzing bundles with webpack-bundle-analyzer, and using dynamic imports for heavy libraries.",
    },
    {
      question: "What is tree shaking and how does it work in Angular?",
      answer:
        "Tree shaking is a dead code elimination technique that removes unused code from the final bundle. Angular's build process uses webpack to analyze import/export statements and eliminate unused modules, functions, and classes. Use specific imports and providedIn: 'root' for services to enable tree shaking.",
    },
    {
      question: "How do you handle performance issues with large lists in Angular?",
      answer:
        "Handle large lists using: 1) Virtual scrolling with CDK, 2) OnPush change detection, 3) TrackBy functions in ngFor, 4) Pagination or infinite scrolling, 5) Debouncing search/filter operations, 6) Using pure pipes for transformations, 7) Implementing lazy loading for list items.",
    },
    {
      question: "What are the best practices for optimizing Angular application performance?",
      answer:
        "Best practices include: using OnPush change detection, implementing lazy loading, optimizing bundle size, using trackBy functions, avoiding memory leaks, implementing virtual scrolling, using pure pipes, optimizing images, enabling service workers, and monitoring performance with Angular DevTools.",
    },
    {
      question: "How do you measure and monitor Angular application performance?",
      answer:
        "Performance monitoring involves: using Angular DevTools for change detection profiling, Chrome DevTools for runtime performance, Lighthouse for web vitals, webpack-bundle-analyzer for bundle analysis, and implementing custom performance metrics with Performance API and RxJS operators.",
    },
  ]

  return (
    <PageLayout
      title="Performance Optimization"
      description="Master Angular performance optimization techniques for building fast, efficient applications"
    >
      <div className="space-y-8">
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-cyan-400">Overview</h2>
          <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700">
            <p className="text-slate-300 leading-relaxed mb-4">
              Performance optimization in Angular involves implementing strategies to reduce bundle size, optimize
              change detection, manage memory efficiently, and ensure smooth user experiences. Understanding these
              techniques is crucial for building scalable, production-ready applications.
            </p>
            <div className="grid md:grid-cols-2 gap-4 mt-6">
              <div className="bg-slate-900/50 p-4 rounded border border-slate-600">
                <h3 className="font-semibold text-pink-400 mb-2">Key Optimization Areas</h3>
                <ul className="text-sm text-slate-300 space-y-1">
                  <li>• Change Detection Strategy</li>
                  <li>• Bundle Size Optimization</li>
                  <li>• Memory Management</li>
                  <li>• Lazy Loading</li>
                  <li>• Virtual Scrolling</li>
                  <li>• Tree Shaking</li>
                </ul>
              </div>
              <div className="bg-slate-900/50 p-4 rounded border border-slate-600">
                <h3 className="font-semibold text-pink-400 mb-2">Performance Tools</h3>
                <ul className="text-sm text-slate-300 space-y-1">
                  <li>• Angular DevTools</li>
                  <li>• Chrome DevTools</li>
                  <li>• Webpack Bundle Analyzer</li>
                  <li>• Lighthouse</li>
                  <li>• Performance API</li>
                  <li>• Source Map Explorer</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-cyan-400">Code Examples</h2>
          <div className="space-y-6">
            {performanceExamples.map((example, index) => (
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
