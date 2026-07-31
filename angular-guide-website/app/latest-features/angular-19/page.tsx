import PageLayout from "../../../components/page-layout"
import CodeExample from "../../../components/code-example"
import InterviewQuestions from "../../../components/interview-questions"

export default function Angular19Page() {
  const angular19Examples = [
    {
      title: "Standalone Components as Default",
      code: `// Angular 19 - Standalone components are now the default
// When generating new components, they're standalone by default

// Old way (Angular 18 and below)
@Component({
  selector: 'app-user-profile',
  standalone: false, // Had to explicitly set to false
  templateUrl: './user-profile.component.html'
})
export class UserProfileComponent {}

// New way (Angular 19+) - Default behavior
@Component({
  selector: 'app-user-profile',
  // standalone: true is now the default, no need to specify
  imports: [CommonModule, FormsModule], // Direct imports
  template: \`
    <div class="user-profile">
      <h2>{{ user.name }}</h2>
      <p>{{ user.email }}</p>
      
      @if (user.isActive) {
        <span class="status active">Active</span>
      } @else {
        <span class="status inactive">Inactive</span>
      }
      
      <form #userForm="ngForm">
        <input [(ngModel)]="user.name" name="name" required>
        <button type="submit" [disabled]="userForm.invalid">
          Update Profile
        </button>
      </form>
    </div>
  \`
})
export class UserProfileComponent {
  user = signal({
    name: 'John Doe',
    email: 'john@example.com',
    isActive: true
  });
}

// Angular CLI now generates standalone components by default
// ng generate component my-component
// Creates a standalone component automatically

// Migration schematic to convert existing components
// ng generate @angular/core:standalone
// Converts your entire app to standalone components`,
    },
    {
      title: "Stabilized Signal APIs",
      code: `// Angular 19 - Signal APIs are now stable
import { Component, input, output, model, computed, effect } from '@angular/core';

@Component({
  selector: 'app-counter',
  template: \`
    <div class="counter">
      <h3>{{ title() }}</h3>
      <p>Count: {{ count() }}</p>
      <p>Double: {{ doubleCount() }}</p>
      <p>Is Even: {{ isEven() ? 'Yes' : 'No' }}</p>
      
      <div class="controls">
        <button (click)="decrement()" [disabled]="count() <= min()">-</button>
        <button (click)="increment()" [disabled]="count() >= max()">+</button>
        <button (click)="reset()">Reset</button>
      </div>
      
      <input 
        [value]="inputValue()" 
        (input)="inputValue.set($event.target.value)"
        placeholder="Enter value"
      >
    </div>
  \`
})
export class CounterComponent {
  // Stable input() signal - replaces @Input()
  title = input<string>('Counter'); // Optional with default
  min = input.required<number>(); // Required input
  max = input<number>(100); // Optional with default
  
  // Stable output() signal - replaces @Output()
  countChanged = output<number>();
  resetClicked = output<void>();
  
  // Stable model() signal - two-way binding
  inputValue = model<string>('');
  
  // Regular signals
  count = signal(0);
  
  // Computed signals - automatically update when dependencies change
  doubleCount = computed(() => this.count() * 2);
  isEven = computed(() => this.count() % 2 === 0);
  
  constructor() {
    // Effects run when signal dependencies change
    effect(() => {
      console.log(\`Count changed to: \${this.count()}\`);
      this.countChanged.emit(this.count());
    });
    
    // Effect with cleanup
    effect((onCleanup) => {
      const timer = setInterval(() => {
        console.log(\`Current count: \${this.count()}\`);
      }, 5000);
      
      onCleanup(() => {
        clearInterval(timer);
      });
    });
  }
  
  increment() {
    if (this.count() < this.max()) {
      this.count.update(current => current + 1);
    }
  }
  
  decrement() {
    if (this.count() > this.min()) {
      this.count.update(current => current - 1);
    }
  }
  
  reset() {
    this.count.set(0);
    this.resetClicked.emit();
  }
}

// Usage in parent component
@Component({
  selector: 'app-parent',
  template: \`
    <app-counter 
      title="My Counter"
      [min]="0"
      [max]="50"
      [(inputValue)]="counterInput"
      (countChanged)="onCountChanged($event)"
      (resetClicked)="onReset()"
    />
    
    <p>Input value: {{ counterInput() }}</p>
  \`
})
export class ParentComponent {
  counterInput = signal('Initial value');
  
  onCountChanged(count: number) {
    console.log('Count changed in parent:', count);
  }
  
  onReset() {
    console.log('Counter was reset');
  }
}

// Advanced signal patterns
@Component({
  selector: 'app-user-list',
  template: \`
    <div class="user-list">
      <input 
        [value]="searchTerm()" 
        (input)="searchTerm.set($event.target.value)"
        placeholder="Search users..."
      >
      
      <div class="filters">
        <label>
          <input 
            type="checkbox" 
            [checked]="showActiveOnly()"
            (change)="showActiveOnly.set($event.target.checked)"
          >
          Show active only
        </label>
      </div>
      
      <div class="results">
        <p>Found {{ filteredUsers().length }} users</p>
        
        @for (user of filteredUsers(); track user.id) {
          <div class="user-card">
            <h4>{{ user.name }}</h4>
            <p>{{ user.email }}</p>
            <span class="status" [class.active]="user.isActive">
              {{ user.isActive ? 'Active' : 'Inactive' }}
            </span>
          </div>
        }
      </div>
    </div>
  \`
})
export class UserListComponent {
  // Base data
  users = signal<User[]>([
    { id: 1, name: 'John Doe', email: 'john@example.com', isActive: true },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', isActive: false },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', isActive: true }
  ]);
  
  // Filter signals
  searchTerm = signal('');
  showActiveOnly = signal(false);
  
  // Computed signal that automatically updates when dependencies change
  filteredUsers = computed(() => {
    const users = this.users();
    const search = this.searchTerm().toLowerCase();
    const activeOnly = this.showActiveOnly();
    
    return users.filter(user => {
      const matchesSearch = user.name.toLowerCase().includes(search) ||
                           user.email.toLowerCase().includes(search);
      const matchesActive = !activeOnly || user.isActive;
      
      return matchesSearch && matchesActive;
    });
  });
  
  constructor() {
    // Effect to log filter changes
    effect(() => {
      console.log(\`Filtered \${this.filteredUsers().length} users\`);
    });
  }
}

interface User {
  id: number;
  name: string;
  email: string;
  isActive: boolean;
}`,
    },
    {
      title: "Resource API and Async Data Loading",
      code: `// Angular 19 - New resource() and rxResource() APIs for async data
import { Component, resource, rxResource, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';

interface User {
  id: number;
  name: string;
  email: string;
}

interface Post {
  id: number;
  title: string;
  body: string;
  userId: number;
}

@Component({
  selector: 'app-user-posts',
  template: \`
    <div class="user-posts">
      <h2>User Posts</h2>
      
      <!-- User selection -->
      <select [value]="selectedUserId()" (change)="selectedUserId.set(+$event.target.value)">
        <option value="0">Select a user</option>
        @for (user of usersResource.value(); track user.id) {
          <option [value]="user.id">{{ user.name }}</option>
        }
      </select>
      
      <!-- Users loading state -->
      @if (usersResource.isLoading()) {
        <p>Loading users...</p>
      }
      
      @if (usersResource.hasError()) {
        <p class="error">Error loading users: {{ usersResource.error() }}</p>
        <button (click)="usersResource.reload()">Retry</button>
      }
      
      <!-- Posts section -->
      @if (selectedUserId() > 0) {
        <div class="posts-section">
          <h3>Posts by {{ selectedUser()?.name }}</h3>
          
          @if (postsResource.isLoading()) {
            <p>Loading posts...</p>
          }
          
          @if (postsResource.hasError()) {
            <p class="error">Error loading posts: {{ postsResource.error() }}</p>
            <button (click)="postsResource.reload()">Retry</button>
          }
          
          @if (postsResource.value(); as posts) {
            <div class="posts-list">
              @for (post of posts; track post.id) {
                <article class="post">
                  <h4>{{ post.title }}</h4>
                  <p>{{ post.body }}</p>
                </article>
              } @empty {
                <p>No posts found for this user.</p>
              }
            </div>
          }
        </div>
      }
      
      <!-- Resource status -->
      <div class="debug-info">
        <h4>Resource Status:</h4>
        <p>Users: {{ usersResource.status() }}</p>
        <p>Posts: {{ postsResource.status() }}</p>
      </div>
    </div>
  \`
})
export class UserPostsComponent {
  selectedUserId = signal(0);
  
  constructor(private http: HttpClient) {}
  
  // resource() API - Promise-based
  usersResource = resource({
    loader: () => {
      console.log('Loading users...');
      return fetch('https://jsonplaceholder.typicode.com/users')
        .then(response => response.json()) as Promise<User[]>;
    }
  });
  
  // rxResource() API - Observable-based with reactive dependencies
  postsResource = rxResource({
    request: () => ({ userId: this.selectedUserId() }),
    loader: ({ request }) => {
      if (request.userId === 0) {
        return [];
      }
      
      console.log(\`Loading posts for user \${request.userId}\`);
      return this.http.get<Post[]>(
        \`https://jsonplaceholder.typicode.com/posts?userId=\${request.userId}\`
      );
    }
  });
  
  // Computed to get selected user details
  selectedUser = computed(() => {
    const users = this.usersResource.value();
    const userId = this.selectedUserId();
    return users?.find(user => user.id === userId);
  });
}

// Advanced resource patterns
@Component({
  selector: 'app-advanced-resources',
  template: \`
    <div class="advanced-resources">
      <h2>Advanced Resource Patterns</h2>
      
      <!-- Search with debouncing -->
      <input 
        [value]="searchTerm()" 
        (input)="searchTerm.set($event.target.value)"
        placeholder="Search posts..."
      >
      
      <!-- Paginated results -->
      <div class="pagination">
        <button 
          (click)="currentPage.update(p => Math.max(1, p - 1))"
          [disabled]="currentPage() === 1"
        >
          Previous
        </button>
        <span>Page {{ currentPage() }}</span>
        <button 
          (click)="currentPage.update(p => p + 1)"
          [disabled]="!hasNextPage()"
        >
          Next
        </button>
      </div>
      
      @if (searchResource.isLoading()) {
        <p>Searching...</p>
      }
      
      @if (searchResource.value(); as results) {
        <div class="results">
          @for (post of results.posts; track post.id) {
            <article class="post">
              <h4>{{ post.title }}</h4>
              <p>{{ post.body }}</p>
            </article>
          }
        </div>
      }
    </div>
  \`
})
export class AdvancedResourcesComponent {
  searchTerm = signal('');
  currentPage = signal(1);
  pageSize = signal(10);
  
  constructor(private http: HttpClient) {}
  
  // Resource with complex dependencies and caching
  searchResource = rxResource({
    request: () => ({
      search: this.searchTerm(),
      page: this.currentPage(),
      pageSize: this.pageSize()
    }),
    loader: ({ request }) => {
      // Debounce search requests
      return timer(request.search ? 300 : 0).pipe(
        switchMap(() => {
          if (!request.search.trim()) {
            return of({ posts: [], total: 0, hasNext: false });
          }
          
          const params = new HttpParams()
            .set('q', request.search)
            .set('_page', request.page.toString())
            .set('_limit', request.pageSize.toString());
          
          return this.http.get<Post[]>('https://jsonplaceholder.typicode.com/posts', { 
            params,
            observe: 'response'
          }).pipe(
            map(response => ({
              posts: response.body || [],
              total: parseInt(response.headers.get('x-total-count') || '0'),
              hasNext: (response.body?.length || 0) === request.pageSize
            }))
          );
        })
      );
    }
  });
  
  hasNextPage = computed(() => {
    const result = this.searchResource.value();
    return result?.hasNext || false;
  });
  
  // Resource with manual refresh and error recovery
  manualResource = resource({
    loader: async () => {
      const response = await fetch('https://jsonplaceholder.typicode.com/posts/1');
      if (!response.ok) {
        throw new Error(\`HTTP \${response.status}: \${response.statusText}\`);
      }
      return response.json() as Promise<Post>;
    }
  });
  
  refreshManualResource() {
    this.manualResource.reload();
  }
}

// Resource with local state management
@Component({
  selector: 'app-resource-state',
  template: \`
    <div class="resource-state">
      <h2>Resource with Local State</h2>
      
      @if (todosResource.value(); as todos) {
        <div class="todos">
          @for (todo of todos; track todo.id) {
            <div class="todo" [class.completed]="todo.completed">
              <input 
                type="checkbox" 
                [checked]="todo.completed"
                (change)="toggleTodo(todo.id, $event.target.checked)"
              >
              <span>{{ todo.title }}</span>
              <button (click)="deleteTodo(todo.id)">Delete</button>
            </div>
          }
        </div>
      }
      
      <form (submit)="addTodo($event)">
        <input 
          #newTodo 
          type="text" 
          placeholder="Add new todo..."
          required
        >
        <button type="submit">Add</button>
      </form>
    </div>
  \`
})
export class ResourceStateComponent {
  private localTodos = signal<Todo[]>([]);
  
  constructor(private http: HttpClient) {}
  
  todosResource = rxResource({
    request: () => ({}),
    loader: () => {
      return this.http.get<Todo[]>('https://jsonplaceholder.typicode.com/todos?_limit=5').pipe(
        tap(todos => this.localTodos.set(todos))
      );
    }
  });
  
  toggleTodo(id: number, completed: boolean) {
    this.localTodos.update(todos =>
      todos.map(todo =>
        todo.id === id ? { ...todo, completed } : todo
      )
    );
    
    // Optimistically update, then sync with server
    this.http.patch(\`https://jsonplaceholder.typicode.com/todos/\${id}\`, { completed })
      .subscribe({
        error: () => {
          // Revert on error
          this.localTodos.update(todos =>
            todos.map(todo =>
              todo.id === id ? { ...todo, completed: !completed } : todo
            )
          );
        }
      });
  }
  
  deleteTodo(id: number) {
    const originalTodos = this.localTodos();
    this.localTodos.update(todos => todos.filter(todo => todo.id !== id));
    
    this.http.delete(\`https://jsonplaceholder.typicode.com/todos/\${id}\`)
      .subscribe({
        error: () => {
          // Revert on error
          this.localTodos.set(originalTodos);
        }
      });
  }
  
  addTodo(event: Event) {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const input = form.querySelector('input') as HTMLInputElement;
    const title = input.value.trim();
    
    if (!title) return;
    
    const newTodo: Todo = {
      id: Date.now(), // Temporary ID
      title,
      completed: false,
      userId: 1
    };
    
    this.localTodos.update(todos => [...todos, newTodo]);
    input.value = '';
    
    this.http.post<Todo>('https://jsonplaceholder.typicode.com/todos', newTodo)
      .subscribe({
        next: (serverTodo) => {
          // Update with server-generated ID
          this.localTodos.update(todos =>
            todos.map(todo =>
              todo.id === newTodo.id ? serverTodo : todo
            )
          );
        },
        error: () => {
          // Remove on error
          this.localTodos.update(todos =>
            todos.filter(todo => todo.id !== newTodo.id)
          );
        }
      });
  }
}

interface Todo {
  id: number;
  title: string;
  completed: boolean;
  userId: number;
}`,
    },
    {
      title: "Enhanced SSR and Hydration",
      code: `// Angular 19 - Enhanced SSR with Event Replay and Incremental Hydration

// app.config.ts - SSR configuration
import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideClientHydration, withEventReplay, withIncrementalHydration } from '@angular/platform-browser';
import { provideHttpClient, withFetch } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    // Enhanced hydration with event replay
    provideClientHydration(
      withEventReplay(), // Replays user events that occurred before hydration
      withIncrementalHydration() // Hydrates components incrementally for better performance
    ),
    provideHttpClient(withFetch()), // Use fetch API for better SSR performance
  ]
};

// Component with SSR optimizations
@Component({
  selector: 'app-product-list',
  template: \`
    <div class="product-list">
      <h2>Products</h2>
      
      <!-- Search input - will replay events after hydration -->
      <input 
        [value]="searchTerm()" 
        (input)="searchTerm.set($event.target.value)"
        placeholder="Search products..."
        class="search-input"
      >
      
      <!-- Filter buttons - events will be replayed -->
      <div class="filters">
        @for (category of categories; track category) {
          <button 
            (click)="selectedCategory.set(category)"
            [class.active]="selectedCategory() === category"
          >
            {{ category }}
          </button>
        }
      </div>
      
      <!-- Product grid with incremental hydration -->
      <div class="products-grid">
        @for (product of filteredProducts(); track product.id) {
          <app-product-card 
            [product]="product"
            (addToCart)="addToCart($event)"
            [hydrate]="shouldHydrateProduct(product)"
          />
        }
      </div>
      
      <!-- Load more button -->
      @if (hasMoreProducts()) {
        <button 
          (click)="loadMoreProducts()"
          [disabled]="isLoading()"
          class="load-more"
        >
          {{ isLoading() ? 'Loading...' : 'Load More' }}
        </button>
      }
    </div>
  \`
})
export class ProductListComponent {
  searchTerm = signal('');
  selectedCategory = signal('all');
  isLoading = signal(false);
  currentPage = signal(1);
  
  categories = ['all', 'electronics', 'clothing', 'books', 'home'];
  
  // Products loaded from server
  products = signal<Product[]>([]);
  
  constructor(private productService: ProductService) {
    // Load initial products on server and client
    this.loadProducts();
  }
  
  filteredProducts = computed(() => {
    const products = this.products();
    const search = this.searchTerm().toLowerCase();
    const category = this.selectedCategory();
    
    return products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(search) ||
                           product.description.toLowerCase().includes(search);
      const matchesCategory = category === 'all' || product.category === category;
      
      return matchesSearch && matchesCategory;
    });
  });
  
  hasMoreProducts = computed(() => {
    return this.products().length < 100; // Assume max 100 products
  });
  
  // Determine which products should be hydrated immediately
  shouldHydrateProduct(product: Product): boolean {
    // Hydrate products in viewport or high priority items
    return product.featured || product.id <= 10;
  }
  
  async loadProducts() {
    this.isLoading.set(true);
    
    try {
      const newProducts = await this.productService.getProducts(this.currentPage());
      this.products.update(existing => [...existing, ...newProducts]);
    } catch (error) {
      console.error('Failed to load products:', error);
    } finally {
      this.isLoading.set(false);
    }
  }
  
  loadMoreProducts() {
    this.currentPage.update(page => page + 1);
    this.loadProducts();
  }
  
  addToCart(product: Product) {
    // This event will be replayed if it occurs before hydration
    console.log('Adding to cart:', product);
    // Cart service logic here
  }
}

// Product card component with hydration control
@Component({
  selector: 'app-product-card',
  template: \`
    <div class="product-card" [attr.data-hydrate]="hydrate">
      <img 
        [src]="product().image" 
        [alt]="product().name"
        loading="lazy"
      >
      
      <div class="product-info">
        <h3>{{ product().name }}</h3>
        <p class="description">{{ product().description }}</p>
        <p class="price">\${{ product().price }}</p>
        
        @if (product().inStock) {
          <button 
            (click)="onAddToCart()"
            class="add-to-cart"
            [disabled]="isAdding()"
          >
            {{ isAdding() ? 'Adding...' : 'Add to Cart' }}
          </button>
        } @else {
          <button disabled class="out-of-stock">
            Out of Stock
          </button>
        }
      </div>
      
      <!-- Reviews section - lazy loaded -->
      @if (showReviews()) {
        <app-product-reviews 
          [productId]="product().id"
          [hydrate]="false"
        />
      }
    </div>
  \`,
  // Control hydration at component level
  hydration: {
    // Only hydrate if explicitly requested
    strategy: 'manual'
  }
})
export class ProductCardComponent {
  product = input.required<Product>();
  hydrate = input<boolean>(true);
  addToCart = output<Product>();
  
  isAdding = signal(false);
  showReviews = signal(false);
  
  async onAddToCart() {
    this.isAdding.set(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      this.addToCart.emit(this.product());
    } finally {
      this.isAdding.set(false);
    }
  }
  
  toggleReviews() {
    this.showReviews.update(show => !show);
  }
}

// Service with SSR-friendly data loading
@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private cache = new Map<number, Product[]>();
  
  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}
  
  async getProducts(page: number = 1): Promise<Product[]> {
    // Check cache first
    if (this.cache.has(page)) {
      return this.cache.get(page)!;
    }
    
    try {
      const products = await firstValueFrom(
        this.http.get<Product[]>(\`/api/products?page=\${page}\`)
      );
      
      // Cache the results
      this.cache.set(page, products);
      
      return products;
    } catch (error) {
      console.error('Failed to fetch products:', error);
      return [];
    }
  }
  
  // SSR-safe method to check if running in browser
  private isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }
  
  // Preload critical data for SSR
  async preloadCriticalData(): Promise<void> {
    if (!this.isBrowser()) {
      // Preload first page of products on server
      await this.getProducts(1);
    }
  }
}

// Route-level rendering control (Angular 19 feature)
// app-routing.module.ts
const routes: Routes = [
  {
    path: 'products',
    component: ProductListComponent,
    data: {
      // Control SSR behavior per route
      ssr: true,
      prerender: true,
      hydration: 'incremental'
    }
  },
  {
    path: 'admin',
    loadComponent: () => import('./admin/admin.component'),
    data: {
      // Admin pages might not need SSR
      ssr: false,
      hydration: 'full'
    }
  }
];

// Custom hydration strategy
export function createCustomHydrationStrategy() {
  return {
    shouldHydrate: (element: Element) => {
      // Custom logic to determine if element should be hydrated
      return element.hasAttribute('data-hydrate') ||
             element.classList.contains('interactive') ||
             element.querySelector('button, input, select');
    },
    priority: (element: Element) => {
      // Higher priority for interactive elements
      if (element.querySelector('button')) return 10;
      if (element.querySelector('input')) return 8;
      return 1;
    }
  };
}

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  inStock: boolean;
  featured: boolean;
}`,
    },
  ]

  const interviewQuestions = [
    {
      question: "What are the key new features introduced in Angular 19?",
      answer:
        "Angular 19 introduced standalone components as default, stabilized Signal APIs (input(), output(), model()), enhanced SSR with Event Replay and Incremental Hydration, new resource() and rxResource() APIs for async data loading, unused imports detection, Component and Root Effects, and improved Hot Module Replacement (HMR) for styles and templates.",
    },
    {
      question: "How do the new Signal APIs (input, output, model) improve Angular development?",
      answer:
        "Signal APIs provide better type safety, automatic change detection optimization, cleaner syntax without decorators, improved tree-shaking, better performance with fine-grained reactivity, and seamless integration with computed signals and effects. They replace @Input(), @Output(), and enable true two-way binding with model().",
    },
    {
      question: "What is Event Replay in Angular 19 SSR and why is it important?",
      answer:
        "Event Replay captures user interactions that occur before hydration completes and replays them after the application is fully interactive. This prevents lost user interactions during the hydration process, improving user experience by ensuring no clicks, form inputs, or other events are missed during the SSR-to-client transition.",
    },
    {
      question: "How do the new resource() and rxResource() APIs work?",
      answer:
        "resource() handles Promise-based async operations with built-in loading states, error handling, and caching. rxResource() works with Observables and supports reactive dependencies that automatically trigger reloads when inputs change. Both provide isLoading(), hasError(), value(), and status() signals for declarative async state management.",
    },
    {
      question: "What is Incremental Hydration and how does it improve performance?",
      answer:
        "Incremental Hydration allows components to be hydrated progressively based on priority, viewport visibility, or user interaction rather than hydrating the entire application at once. This reduces initial JavaScript execution time, improves Time to Interactive (TTI), and provides better perceived performance by prioritizing critical components first.",
    },
    {
      question: "How do standalone components as default change Angular development?",
      answer:
        "Standalone components eliminate the need for NgModules in many cases, simplify component creation with direct imports, reduce boilerplate code, improve tree-shaking, enable better lazy loading, and make components more self-contained and reusable. The CLI now generates standalone components by default.",
    },
    {
      question: "What are Component and Root Effects in Angular 19?",
      answer:
        "Component Effects run within component lifecycle and are automatically cleaned up when components are destroyed. Root Effects run at application level and persist throughout the app lifecycle. They provide better organization of side effects, automatic cleanup, and clearer separation between component-specific and global effects.",
    },
    {
      question: "How does the unused imports detection feature work?",
      answer:
        "Angular 19 includes a schematic that analyzes your codebase to identify and remove unused imports from components, services, and modules. It helps reduce bundle size, improves build performance, and keeps code clean by automatically removing dead imports that accumulate over time during development.",
    },
  ]

  return (
    <PageLayout
      title="Angular 19 Features"
      description="Explore the latest features and improvements in Angular 19, including stabilized Signals, enhanced SSR, and new APIs"
    >
      <div className="space-y-8">
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-cyan-400">Overview</h2>
          <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700">
            <p className="text-slate-300 leading-relaxed mb-4">
              Angular 19, released in November 2024, brings significant improvements to developer experience and
              application performance. Key highlights include standalone components as default, stabilized Signal APIs,
              enhanced Server-Side Rendering with Event Replay, and new resource APIs for better async data management.
            </p>
            <div className="grid md:grid-cols-2 gap-4 mt-6">
              <div className="bg-slate-900/50 p-4 rounded border border-slate-600">
                <h3 className="font-semibold text-pink-400 mb-2">Major Features</h3>
                <ul className="text-sm text-slate-300 space-y-1">
                  <li>• Standalone components as default</li>
                  <li>• Stabilized Signal APIs</li>
                  <li>• Enhanced SSR with Event Replay</li>
                  <li>• Incremental Hydration</li>
                  <li>• Resource APIs (resource, rxResource)</li>
                  <li>• Unused imports detection</li>
                </ul>
              </div>
              <div className="bg-slate-900/50 p-4 rounded border border-slate-600">
                <h3 className="font-semibold text-pink-400 mb-2">Developer Experience</h3>
                <ul className="text-sm text-slate-300 space-y-1">
                  <li>• Improved Hot Module Replacement</li>
                  <li>• Better TypeScript support (5.6+)</li>
                  <li>• Enhanced schematics</li>
                  <li>• Component and Root Effects</li>
                  <li>• Route-level rendering control</li>
                  <li>• Modern API migrations</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-cyan-400">Code Examples</h2>
          <div className="space-y-6">
            {angular19Examples.map((example, index) => (
              <CodeExample key={index} title={example.title} code={example.code} language="typescript" />
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-cyan-400">Interview Questions</h2>
          <InterviewQuestions questions={interviewQuestions} />
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-cyan-400">Migration Guide</h2>
          <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700">
            <h3 className="font-semibold text-pink-400 mb-3">Upgrading to Angular 19</h3>
            <div className="space-y-4">
              <div className="bg-slate-900/50 p-4 rounded border border-slate-600">
                <h4 className="font-medium text-cyan-300 mb-2">1. Update Angular CLI and Core</h4>
                <code className="text-sm text-slate-300">ng update @angular/cli @angular/core</code>
              </div>
              <div className="bg-slate-900/50 p-4 rounded border border-slate-600">
                <h4 className="font-medium text-cyan-300 mb-2">2. Migrate to Standalone Components</h4>
                <code className="text-sm text-slate-300">ng generate @angular/core:standalone</code>
              </div>
              <div className="bg-slate-900/50 p-4 rounded border border-slate-600">
                <h4 className="font-medium text-cyan-300 mb-2">3. Remove Unused Imports</h4>
                <code className="text-sm text-slate-300">ng generate @angular/core:remove-unused-imports</code>
              </div>
              <div className="bg-slate-900/50 p-4 rounded border border-slate-600">
                <h4 className="font-medium text-cyan-300 mb-2">4. Update to Signal APIs</h4>
                <code className="text-sm text-slate-300">ng generate @angular/core:signal-migration</code>
              </div>
            </div>
          </div>
        </section>
      </div>
    </PageLayout>
  )
}
