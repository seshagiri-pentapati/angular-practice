import PageLayout from "../../../components/page-layout"
import CodeExample from "../../../components/code-example"
import InterviewQuestions from "../../../components/interview-questions"

export default function Angular20Page() {
  const angular20Examples = [
    {
      title: "Zoneless Change Detection (Developer Preview)",
      code: `// Angular 20 - Zoneless Change Detection
// app.config.ts - Enable zoneless change detection
import { ApplicationConfig } from '@angular/core';
import { provideExperimentalZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    // Enable zoneless change detection (experimental)
    provideExperimentalZonelessChangeDetection(),
    // Other providers...
  ]
};

// Component optimized for zoneless change detection
@Component({
  selector: 'app-counter',
  template: \`
    <div class="counter">
      <h2>Zoneless Counter</h2>
      <p>Count: {{ count() }}</p>
      <p>Double: {{ doubleCount() }}</p>
      
      <div class="controls">
        <button (click)="increment()">+</button>
        <button (click)="decrement()">-</button>
        <button (click)="reset()">Reset</button>
      </div>
      
      <!-- Async operations work seamlessly -->
      <div class="async-section">
        <button (click)="incrementAsync()" [disabled]="isLoading()">
          {{ isLoading() ? 'Loading...' : 'Async +1' }}
        </button>
        
        @if (lastUpdate()) {
          <p>Last updated: {{ lastUpdate() | date:'medium' }}</p>
        }
      </div>
      
      <!-- Timer that updates automatically -->
      <div class="timer">
        <p>Timer: {{ timer() }}s</p>
        <button (click)="startTimer()" [disabled]="timerRunning()">Start</button>
        <button (click)="stopTimer()" [disabled]="!timerRunning()">Stop</button>
      </div>
    </div>
  \`
})
export class ZonelessCounterComponent implements OnInit, OnDestroy {
  // Signals work perfectly with zoneless change detection
  count = signal(0);
  isLoading = signal(false);
  lastUpdate = signal<Date | null>(null);
  timer = signal(0);
  timerRunning = signal(false);
  
  private timerInterval?: number;
  
  // Computed signals automatically trigger updates
  doubleCount = computed(() => this.count() * 2);
  
  constructor() {
    // Effects work seamlessly in zoneless mode
    effect(() => {
      console.log(\`Count changed to: \${this.count()}\`);
    });
  }
  
  ngOnInit() {
    // Manual change detection is not needed with signals
    // The framework automatically tracks signal dependencies
  }
  
  ngOnDestroy() {
    this.stopTimer();
  }
  
  increment() {
    this.count.update(c => c + 1);
    this.lastUpdate.set(new Date());
  }
  
  decrement() {
    this.count.update(c => c - 1);
    this.lastUpdate.set(new Date());
  }
  
  reset() {
    this.count.set(0);
    this.lastUpdate.set(new Date());
  }
  
  async incrementAsync() {
    this.isLoading.set(true);
    
    try {
      // Simulate async operation
      await new Promise(resolve => setTimeout(resolve, 1000));
      this.increment();
    } finally {
      this.isLoading.set(false);
    }
  }
  
  startTimer() {
    if (this.timerRunning()) return;
    
    this.timerRunning.set(true);
    this.timer.set(0);
    
    this.timerInterval = window.setInterval(() => {
      this.timer.update(t => t + 1);
    }, 1000);
  }
  
  stopTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = undefined;
    }
    this.timerRunning.set(false);
  }
}

// Service that works with zoneless change detection
@Injectable({
  providedIn: 'root'
})
export class ZonelessDataService {
  private data = signal<any[]>([]);
  private loading = signal(false);
  private error = signal<string | null>(null);
  
  // Expose read-only signals
  readonly data$ = this.data.asReadonly();
  readonly loading$ = this.loading.asReadonly();
  readonly error$ = this.error.asReadonly();
  
  constructor(private http: HttpClient) {}
  
  async loadData(): Promise<void> {
    this.loading.set(true);
    this.error.set(null);
    
    try {
      // HTTP calls work normally in zoneless mode
      const result = await firstValueFrom(
        this.http.get<any[]>('/api/data')
      );
      
      this.data.set(result);
    } catch (err) {
      this.error.set(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      this.loading.set(false);
    }
  }
  
  addItem(item: any): void {
    this.data.update(items => [...items, item]);
  }
  
  removeItem(id: string): void {
    this.data.update(items => items.filter(item => item.id !== id));
  }
  
  updateItem(id: string, updates: Partial<any>): void {
    this.data.update(items =>
      items.map(item =>
        item.id === id ? { ...item, ...updates } : item
      )
    );
  }
}

// Component using the zoneless service
@Component({
  selector: 'app-data-list',
  template: \`
    <div class="data-list">
      <h2>Data Management (Zoneless)</h2>
      
      <div class="controls">
        <button (click)="loadData()" [disabled]="dataService.loading$()">
          {{ dataService.loading$() ? 'Loading...' : 'Load Data' }}
        </button>
        
        <button (click)="addRandomItem()">Add Item</button>
      </div>
      
      @if (dataService.error$()) {
        <div class="error">
          Error: {{ dataService.error$() }}
        </div>
      }
      
      <div class="items">
        @for (item of dataService.data$(); track item.id) {
          <div class="item">
            <span>{{ item.name }}</span>
            <button (click)="removeItem(item.id)">Remove</button>
          </div>
        } @empty {
          <p>No items available</p>
        }
      </div>
      
      <div class="stats">
        <p>Total items: {{ dataService.data$().length }}</p>
        <p>Loading: {{ dataService.loading$() ? 'Yes' : 'No' }}</p>
      </div>
    </div>
  \`
})
export class ZonelessDataListComponent {
  constructor(public dataService: ZonelessDataService) {}
  
  loadData() {
    this.dataService.loadData();
  }
  
  addRandomItem() {
    const item = {
      id: Date.now().toString(),
      name: \`Item \${Date.now()}\`,
      value: Math.floor(Math.random() * 100)
    };
    
    this.dataService.addItem(item);
  }
  
  removeItem(id: string) {
    this.dataService.removeItem(id);
  }
}

// Migration helper for zoneless change detection
export class ZonelessMigrationHelper {
  // Helper to convert observables to signals for zoneless compatibility
  static observableToSignal<T>(
    observable: Observable<T>, 
    initialValue: T
  ): Signal<T> {
    const signal = signal(initialValue);
    
    observable.subscribe(value => {
      signal.set(value);
    });
    
    return signal.asReadonly();
  }
  
  // Helper to create reactive forms with signals
  static createReactiveForm<T extends Record<string, any>>(
    initialValue: T
  ): { 
    form: FormGroup; 
    values: Signal<T>; 
    errors: Signal<ValidationErrors | null> 
  } {
    const form = new FormGroup({});
    const values = signal(initialValue);
    const errors = signal<ValidationErrors | null>(null);
    
    // Create form controls for each property
    Object.keys(initialValue).forEach(key => {
      form.addControl(key, new FormControl(initialValue[key]));
    });
    
    // Update signal when form changes
    form.valueChanges.subscribe(value => {
      values.set(value as T);
      errors.set(form.errors);
    });
    
    return { form, values, errors };
  }
}`,
    },
    {
      title: "Stable Control Flow Syntax",
      code: `// Angular 20 - Stable Control Flow Syntax with Enhanced Features

@Component({
  selector: 'app-enhanced-control-flow',
  template: \`
    <div class="control-flow-demo">
      <h2>Enhanced Control Flow Syntax</h2>
      
      <!-- Enhanced @if with multiple conditions -->
      @if (user(); as currentUser) {
        <div class="user-info">
          <h3>Welcome, {{ currentUser.name }}!</h3>
          
          @if (currentUser.role === 'admin') {
            <div class="admin-panel">
              <h4>Admin Panel</h4>
              <button (click)="openAdminSettings()">Settings</button>
            </div>
          } @else if (currentUser.role === 'moderator') {
            <div class="moderator-panel">
              <h4>Moderator Tools</h4>
              <button (click)="openModerationTools()">Tools</button>
            </div>
          } @else {
            <div class="user-panel">
              <h4>User Dashboard</h4>
              <button (click)="openUserProfile()">Profile</button>
            </div>
          }
          
          <!-- Nested conditions with complex logic -->
          @if (currentUser.subscription; as sub) {
            @if (sub.status === 'active' && sub.daysRemaining > 0) {
              <div class="subscription-active">
                <p>Subscription active: {{ sub.daysRemaining }} days remaining</p>
                
                @if (sub.daysRemaining <= 7) {
                  <div class="renewal-warning">
                    <p>⚠️ Your subscription expires soon!</p>
                    <button (click)="renewSubscription()">Renew Now</button>
                  </div>
                }
              </div>
            } @else if (sub.status === 'expired') {
              <div class="subscription-expired">
                <p>Your subscription has expired</p>
                <button (click)="reactivateSubscription()">Reactivate</button>
              </div>
            } @else {
              <div class="subscription-pending">
                <p>Subscription status: {{ sub.status }}</p>
              </div>
            }
          } @else {
            <div class="no-subscription">
              <p>No active subscription</p>
              <button (click)="startTrial()">Start Free Trial</button>
            </div>
          }
        </div>
      } @else {
        <div class="login-prompt">
          <h3>Please log in</h3>
          <button (click)="login()">Login</button>
        </div>
      }
      
      <!-- Enhanced @for with advanced features -->
      <div class="products-section">
        <h3>Products</h3>
        
        <!-- Filter controls -->
        <div class="filters">
          <select [value]="selectedCategory()" (change)="selectedCategory.set($event.target.value)">
            <option value="">All Categories</option>
            @for (category of categories; track category) {
              <option [value]="category">{{ category | titlecase }}</option>
            }
          </select>
          
          <input 
            [value]="searchTerm()" 
            (input)="searchTerm.set($event.target.value)"
            placeholder="Search products..."
          >
        </div>
        
        <!-- Products list with enhanced @for -->
        @for (product of filteredProducts(); track product.id; let i = $index, first = $first, last = $last, even = $even, odd = $odd, count = $count) {
          <div 
            class="product-item"
            [class.first]="first"
            [class.last]="last"
            [class.even]="even"
            [class.odd]="odd"
          >
            <div class="product-header">
              <h4>{{ product.name }}</h4>
              <span class="product-number">{{ i + 1 }} of {{ count }}</span>
            </div>
            
            <div class="product-details">
              <p>{{ product.description }}</p>
              <p class="price">\${{ product.price }}</p>
              <p class="category">Category: {{ product.category }}</p>
            </div>
            
            <!-- Nested @if within @for -->
            @if (product.inStock) {
              <div class="stock-info">
                <span class="in-stock">✅ In Stock</span>
                
                @if (product.quantity <= 5) {
                  <span class="low-stock">⚠️ Only {{ product.quantity }} left!</span>
                }
                
                <button (click)="addToCart(product)">Add to Cart</button>
              </div>
            } @else {
              <div class="out-of-stock">
                <span>❌ Out of Stock</span>
                <button (click)="notifyWhenAvailable(product)" class="notify-btn">
                  Notify When Available
                </button>
              </div>
            }
            
            <!-- Product reviews with nested @for -->
            @if (product.reviews && product.reviews.length > 0) {
              <div class="reviews">
                <h5>Recent Reviews:</h5>
                @for (review of product.reviews.slice(0, 3); track review.id) {
                  <div class="review">
                    <div class="review-header">
                      <span class="reviewer">{{ review.author }}</span>
                      <span class="rating">
                        @for (star of getStars(review.rating); track $index) {
                          ⭐
                        }
                      </span>
                    </div>
                    <p class="review-text">{{ review.comment }}</p>
                  </div>
                } @empty {
                  <p>No reviews yet</p>
                }
              </div>
            }
          </div>
        } @empty {
          <div class="no-products">
            @if (searchTerm() || selectedCategory()) {
              <p>No products match your filters</p>
              <button (click)="clearFilters()">Clear Filters</button>
            } @else {
              <p>No products available</p>
            }
          </div>
        }
      </div>
      
      <!-- Enhanced @switch with complex matching -->
      <div class="theme-selector">
        <h3>Theme Settings</h3>
        
        <select [value]="selectedTheme()" (change)="selectedTheme.set($event.target.value)">
          <option value="light">Light</option>
          <option value="dark">Dark</option>
          <option value="auto">Auto</option>
          <option value="custom">Custom</option>
        </select>
        
        @switch (selectedTheme()) {
          @case ('light') {
            <div class="theme-preview light-theme">
              <h4>Light Theme</h4>
              <p>Clean and bright interface</p>
              <div class="color-palette">
                <div class="color-swatch" style="background: #ffffff"></div>
                <div class="color-swatch" style="background: #f8f9fa"></div>
                <div class="color-swatch" style="background: #007bff"></div>
              </div>
            </div>
          }
          
          @case ('dark') {
            <div class="theme-preview dark-theme">
              <h4>Dark Theme</h4>
              <p>Easy on the eyes for night usage</p>
              <div class="color-palette">
                <div class="color-swatch" style="background: #1a1a1a"></div>
                <div class="color-swatch" style="background: #2d2d2d"></div>
                <div class="color-swatch" style="background: #0d6efd"></div>
              </div>
            </div>
          }
          
          @case ('auto') {
            <div class="theme-preview auto-theme">
              <h4>Auto Theme</h4>
              <p>Follows system preference</p>
              <div class="system-info">
                <p>Current system theme: {{ getSystemTheme() }}</p>
                <p>Will switch automatically at sunset/sunrise</p>
              </div>
            </div>
          }
          
          @case ('custom') {
            <div class="theme-preview custom-theme">
              <h4>Custom Theme</h4>
              <p>Create your own color scheme</p>
              
              <div class="custom-controls">
                <div class="color-picker">
                  <label>Primary Color:</label>
                  <input 
                    type="color" 
                    [value]="customTheme().primary"
                    (input)="updateCustomTheme('primary', $event.target.value)"
                  >
                </div>
                
                <div class="color-picker">
                  <label>Background Color:</label>
                  <input 
                    type="color" 
                    [value]="customTheme().background"
                    (input)="updateCustomTheme('background', $event.target.value)"
                  >
                </div>
                
                <div class="color-picker">
                  <label>Text Color:</label>
                  <input 
                    type="color" 
                    [value]="customTheme().text"
                    (input)="updateCustomTheme('text', $event.target.value)"
                  >
                </div>
              </div>
              
              <button (click)="saveCustomTheme()">Save Theme</button>
            </div>
          }
          
          @default {
            <div class="theme-preview default-theme">
              <h4>Default Theme</h4>
              <p>Standard application theme</p>
            </div>
          }
        }
      </div>
      
      <!-- Complex nested control flow -->
      <div class="dashboard-widgets">
        <h3>Dashboard Widgets</h3>
        
        @for (widget of widgets(); track widget.id) {
          <div class="widget" [class]="widget.type">
            <div class="widget-header">
              <h4>{{ widget.title }}</h4>
              
              @if (widget.loading) {
                <span class="loading">Loading...</span>
              } @else if (widget.error) {
                <span class="error">Error</span>
              } @else {
                <span class="success">Ready</span>
              }
            </div>
            
            <div class="widget-content">
              @switch (widget.type) {
                @case ('chart') {
                  @if (widget.data && widget.data.length > 0) {
                    <div class="chart-container">
                      @for (dataPoint of widget.data; track dataPoint.id) {
                        <div 
                          class="chart-bar" 
                          [style.height.%]="(dataPoint.value / getMaxValue(widget.data)) * 100"
                        >
                          <span class="value">{{ dataPoint.value }}</span>
                        </div>
                      }
                    </div>
                  } @else {
                    <p>No chart data available</p>
                  }
                }
                
                @case ('list') {
                  @if (widget.items && widget.items.length > 0) {
                    <ul class="widget-list">
                      @for (item of widget.items; track item.id; let i = $index) {
                        <li [class.priority]="item.priority === 'high'">
                          <span class="item-number">{{ i + 1 }}.</span>
                          <span class="item-text">{{ item.text }}</span>
                          
                          @if (item.priority === 'high') {
                            <span class="priority-badge">High Priority</span>
                          }
                        </li>
                      }
                    </ul>
                  } @else {
                    <p>No items in list</p>
                  }
                }
                
                @case ('metric') {
                  <div class="metric-display">
                    <div class="metric-value">{{ widget.value }}</div>
                    <div class="metric-label">{{ widget.label }}</div>
                    
                    @if (widget.trend) {
                      <div class="metric-trend" [class]="widget.trend.direction">
                        @if (widget.trend.direction === 'up') {
                          ↗️ +{{ widget.trend.percentage }}%
                        } @else if (widget.trend.direction === 'down') {
                          ↘️ -{{ widget.trend.percentage }}%
                        } @else {
                          ➡️ No change
                        }
                      </div>
                    }
                  </div>
                }
                
                @default {
                  <p>Unknown widget type: {{ widget.type }}</p>
                }
              }
            </div>
          </div>
        } @empty {
          <div class="no-widgets">
            <p>No widgets configured</p>
            <button (click)="addDefaultWidgets()">Add Default Widgets</button>
          </div>
        }
      </div>
    </div>
  \`
})
export class EnhancedControlFlowComponent {
  // User and authentication
  user = signal<User | null>(null);
  
  // Product filtering
  products = signal<Product[]>([]);
  categories = signal<string[]>(['electronics', 'clothing', 'books', 'home']);
  selectedCategory = signal('');
  searchTerm = signal('');
  
  // Theme management
  selectedTheme = signal<'light' | 'dark' | 'auto' | 'custom'>('light');
  customTheme = signal({
    primary: '#007bff',
    background: '#ffffff',
    text: '#000000'
  });
  
  // Dashboard widgets
  widgets = signal<Widget[]>([]);
  
  // Computed properties
  filteredProducts = computed(() => {
    const products = this.products();
    const category = this.selectedCategory();
    const search = this.searchTerm().toLowerCase();
    
    return products.filter(product => {
      const matchesCategory = !category || product.category === category;
      const matchesSearch = !search || 
        product.name.toLowerCase().includes(search) ||
        product.description.toLowerCase().includes(search);
      
      return matchesCategory && matchesSearch;
    });
  });
  
  constructor() {
    // Initialize with sample data
    this.loadSampleData();
  }
  
  // User actions
  login() {
    // Simulate login
    this.user.set({
      id: 1,
      name: 'John Doe',
      role: 'admin',
      subscription: {
        status: 'active',
        daysRemaining: 15
      }
    });
  }
  
  openAdminSettings() {
    console.log('Opening admin settings');
  }
  
  openModerationTools() {
    console.log('Opening moderation tools');
  }
  
  openUserProfile() {
    console.log('Opening user profile');
  }
  
  renewSubscription() {
    console.log('Renewing subscription');
  }
  
  reactivateSubscription() {
    console.log('Reactivating subscription');
  }
  
  startTrial() {
    console.log('Starting free trial');
  }
  
  // Product actions
  addToCart(product: Product) {
    console.log('Adding to cart:', product);
  }
  
  notifyWhenAvailable(product: Product) {
    console.log('Setting notification for:', product);
  }
  
  clearFilters() {
    this.selectedCategory.set('');
    this.searchTerm.set('');
  }
  
  // Theme actions
  getSystemTheme(): string {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  
  updateCustomTheme(property: string, value: string) {
    this.customTheme.update(theme => ({
      ...theme,
      [property]: value
    }));
  }
  
  saveCustomTheme() {
    console.log('Saving custom theme:', this.customTheme());
  }
  
  // Widget actions
  addDefaultWidgets() {
    this.widgets.set([
      {
        id: 1,
        type: 'metric',
        title: 'Total Sales',
        value: '$12,345',
        label: 'This Month',
        trend: { direction: 'up', percentage: 15 },
        loading: false,
        error: false
      },
      {
        id: 2,
        type: 'chart',
        title: 'Monthly Revenue',
        data: [
          { id: 1, value: 100 },
          { id: 2, value: 150 },
          { id: 3, value: 120 },
          { id: 4, value: 180 }
        ],
        loading: false,
        error: false
      }
    ]);
  }
  
  // Helper methods
  getStars(rating: number): number[] {
    return Array(rating).fill(0);
  }
  
  getMaxValue(data: any[]): number {
    return Math.max(...data.map(d => d.value));
  }
  
  private loadSampleData() {
    this.products.set([
      {
        id: 1,
        name: 'Laptop',
        description: 'High-performance laptop',
        price: 999,
        category: 'electronics',
        inStock: true,
        quantity: 3,
        reviews: [
          { id: 1, author: 'Alice', rating: 5, comment: 'Excellent laptop!' },
          { id: 2, author: 'Bob', rating: 4, comment: 'Good value for money' }
        ]
      },
      {
        id: 2,
        name: 'T-Shirt',
        description: 'Comfortable cotton t-shirt',
        price: 25,
        category: 'clothing',
        inStock: false,
        quantity: 0,
        reviews: []
      }
    ]);
  }
}

// Type definitions
interface User {
  id: number;
  name: string;
  role: 'admin' | 'moderator' | 'user';
  subscription?: {
    status: 'active' | 'expired' | 'pending';
    daysRemaining: number;
  };
}

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  inStock: boolean;
  quantity: number;
  reviews: Review[];
}

interface Review {
  id: number;
  author: string;
  rating: number;
  comment: string;
}

interface Widget {
  id: number;
  type: 'chart' | 'list' | 'metric';
  title: string;
  loading: boolean;
  error: boolean;
  value?: string;
  label?: string;
  trend?: {
    direction: 'up' | 'down' | 'stable';
    percentage: number;
  };
  data?: any[];
  items?: any[];
}`,
    },
    {
      title: "Material 3 Components and Enhanced CDK",
      code: `// Angular 20 - Material 3 Components and Enhanced CDK

// Material 3 Tonal Button (New Component)
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-material3-buttons',
  imports: [MatButtonModule, MatIconModule],
  template: \`
    <div class="button-showcase">
      <h2>Material 3 Button Variants</h2>
      
      <!-- Tonal Buttons (New in Angular 20) -->
      <section class="button-section">
        <h3>Tonal Buttons</h3>
        <div class="button-group">
          <button mat-tonal-button>Default Tonal</button>
          <button mat-tonal-button color="primary">Primary Tonal</button>
          <button mat-tonal-button color="accent">Accent Tonal</button>
          <button mat-tonal-button color="warn">Warn Tonal</button>
          <button mat-tonal-button disabled>Disabled Tonal</button>
        </div>
        
        <div class="button-group">
          <button mat-tonal-button>
            <mat-icon>favorite</mat-icon>
            With Icon
          </button>
          
          <button mat-tonal-button>
            <mat-icon>download</mat-icon>
            Download
          </button>
          
          <button mat-tonal-button [disabled]="isLoading()">
            @if (isLoading()) {
              <mat-icon class="spinning">refresh</mat-icon>
              Loading...
            } @else {
              <mat-icon>send</mat-icon>
              Send
            }
          </button>
        </div>
      </section>
      
      <!-- Enhanced Button Variants -->
      <section class="button-section">
        <h3>Enhanced Button Collection</h3>
        
        <div class="button-grid">
          <!-- Filled Buttons -->
          <div class="button-category">
            <h4>Filled</h4>
            <button mat-flat-button color="primary">Primary</button>
            <button mat-flat-button color="accent">Accent</button>
            <button mat-flat-button color="warn">Warn</button>
          </div>
          
          <!-- Tonal Buttons -->
          <div class="button-category">
            <h4>Tonal</h4>
            <button mat-tonal-button color="primary">Primary</button>
            <button mat-tonal-button color="accent">Accent</button>
            <button mat-tonal-button color="warn">Warn</button>
          </div>
          
          <!-- Outlined Buttons -->
          <div class="button-category">
            <h4>Outlined</h4>
            <button mat-stroked-button color="primary">Primary</button>
            <button mat-stroked-button color="accent">Accent</button>
            <button mat-stroked-button color="warn">Warn</button>
          </div>
          
          <!-- Text Buttons -->
          <div class="button-category">
            <h4>Text</h4>
            <button mat-button color="primary">Primary</button>
            <button mat-button color="accent">Accent</button>
            <button mat-button color="warn">Warn</button>
          </div>
        </div>
      </section>
      
      <!-- Interactive Button States -->
      <section class="button-section">
        <h3>Interactive States</h3>
        
        <div class="interactive-buttons">
          <button 
            mat-tonal-button 
            color="primary"
            (click)="toggleFavorite()"
            [class.active]="isFavorite()"
          >
            <mat-icon>{{ isFavorite() ? 'favorite' : 'favorite_border' }}</mat-icon>
            {{ isFavorite() ? 'Favorited' : 'Add to Favorites' }}
          </button>
          
          <button 
            mat-tonal-button 
            color="accent"
            (click)="incrementCounter()"
          >
            <mat-icon>add</mat-icon>
            Count: {{ counter() }}
          </button>
          
          <button 
            mat-tonal-button 
            [color]="getThemeColor()"
            (click)="cycleTheme()"
          >
            <mat-icon>{{ getThemeIcon() }}</mat-icon>
            {{ currentTheme() | titlecase }} Theme
          </button>
        </div>
      </section>
    </div>
  \`,
  styles: [\`
    .button-showcase {
      padding: 24px;
      max-width: 1200px;
      margin: 0 auto;
    }
    
    .button-section {
      margin-bottom: 32px;
    }
    
    .button-group {
      display: flex;
      gap: 12px;
      margin-bottom: 16px;
      flex-wrap: wrap;
    }
    
    .button-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 24px;
    }
    
    .button-category {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    
    .button-category h4 {
      margin: 0 0 8px 0;
      font-weight: 500;
    }
    
    .interactive-buttons {
      display: flex;
      gap: 16px;
      flex-wrap: wrap;
    }
    
    .spinning {
      animation: spin 1s linear infinite;
    }
    
    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
    
    button.active {
      background-color: var(--mat-sys-primary-container);
      color: var(--mat-sys-on-primary-container);
    }
  \`]
})
export class Material3ButtonsComponent {
  isLoading = signal(false);
  isFavorite = signal(false);
  counter = signal(0);
  currentTheme = signal<'light' | 'dark' | 'auto'>('light');
  
  toggleFavorite() {
    this.isFavorite.update(fav => !fav);
  }
  
  incrementCounter() {
    this.counter.update(count => count + 1);
  }
  
  cycleTheme() {
    this.currentTheme.update(theme => {
      switch (theme) {
        case 'light': return 'dark';
        case 'dark': return 'auto';
        case 'auto': return 'light';
        default: return 'light';
      }
    });
  }
  
  getThemeColor(): 'primary' | 'accent' | 'warn' {
    switch (this.currentTheme()) {
      case 'light': return 'primary';
      case 'dark': return 'accent';
      case 'auto': return 'warn';
      default: return 'primary';
    }
  }
  
  getThemeIcon(): string {
    switch (this.currentTheme()) {
      case 'light': return 'light_mode';
      case 'dark': return 'dark_mode';
      case 'auto': return 'brightness_auto';
      default: return 'light_mode';
    }
  }
}

// Enhanced CDK Accordion (Experimental)
import { CdkAccordionModule } from '@angular/cdk/accordion';

@Component({
  selector: 'app-enhanced-accordion',
  imports: [CdkAccordionModule, MatIconModule],
  template: \`
    <div class="accordion-demo">
      <h2>Enhanced CDK Accordion</h2>
      
      <cdk-accordion class="example-accordion" multi>
        @for (item of accordionItems(); track item.id) {
          <cdk-accordion-item 
            #accordionItem="cdkAccordionItem"
            class="example-accordion-item"
            [expanded]="item.expanded"
            [disabled]="item.disabled"
          >
            <div class="example-accordion-item-header" (click)="accordionItem.toggle()">
              <span class="accordion-title">{{ item.title }}</span>
              
              @if (item.badge) {
                <span class="accordion-badge" [class]="item.badge.type">
                  {{ item.badge.text }}
                </span>
              }
              
              <mat-icon class="accordion-icon" [class.expanded]="accordionItem.expanded">
                expand_more
              </mat-icon>
            </div>
            
            <div class="example-accordion-item-body" [class.expanded]="accordionItem.expanded">
              <div class="accordion-content">
                @switch (item.type) {
                  @case ('text') {
                    <p>{{ item.content }}</p>
                  }
                  
                  @case ('list') {
                    <ul>
                      @for (listItem of item.items; track listItem) {
                        <li>{{ listItem }}</li>
                      }
                    </ul>
                  }
                  
                  @case ('form') {
                    <form class="accordion-form">
                      <div class="form-field">
                        <label>Name:</label>
                        <input type="text" [value]="item.formData?.name || ''" />
                      </div>
                      <div class="form-field">
                        <label>Email:</label>
                        <input type="email" [value]="item.formData?.email || ''" />
                      </div>
                      <button type="submit" mat-tonal-button>Submit</button>
                    </form>
                  }
                  
                  @case ('chart') {
                    <div class="chart-container">
                      <h4>{{ item.chartTitle }}</h4>
                      <div class="simple-chart">
                        @for (dataPoint of item.chartData; track dataPoint.label) {
                          <div class="chart-bar">
                            <div 
                              class="bar-fill" 
                              [style.height.%]="(dataPoint.value / getMaxValue(item.chartData)) * 100"
                            ></div>
                            <span class="bar-label">{{ dataPoint.label }}</span>
                          </div>
                        }
                      </div>
                    </div>
                  }
                  
                  @default {
                    <p>Unknown content type</p>
                  }
                }
                
                <!-- Action buttons -->
                @if (item.actions && item.actions.length > 0) {
                  <div class="accordion-actions">
                    @for (action of item.actions; track action.label) {
                      <button 
                        mat-tonal-button 
                        [color]="action.color || 'primary'"
                        (click)="handleAction(action, item)"
                      >
                        @if (action.icon) {
                          <mat-icon>{{ action.icon }}</mat-icon>
                        }
                        {{ action.label }}
                      </button>
                    }
                  </div>
                }
              </div>
            </div>
          </cdk-accordion-item>
        }
      </cdk-accordion>
      
      <!-- Accordion Controls -->
      <div class="accordion-controls">
        <button mat-tonal-button (click)="expandAll()">
          <mat-icon>unfold_more</mat-icon>
          Expand All
        </button>
        
        <button mat-tonal-button (click)="collapseAll()">
          <mat-icon>unfold_less</mat-icon>
          Collapse All
        </button>
        
        <button mat-tonal-button (click)="addAccordionItem()">
          <mat-icon>add</mat-icon>
          Add Item
        </button>
        
        <button mat-tonal-button (click)="shuffleItems()">
          <mat-icon>shuffle</mat-icon>
          Shuffle
        </button>
      </div>
    </div>
  \`,
  styles: [\`
    .accordion-demo {
      max-width: 800px;
      margin: 0 auto;
      padding: 24px;
    }
    
    .example-accordion {
      display: block;
      max-width: 100%;
    }
    
    .example-accordion-item {
      display: block;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      margin-bottom: 8px;
      overflow: hidden;
      transition: all 0.2s ease;
    }
    
    .example-accordion-item:hover {
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    
    .example-accordion-item-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 16px 20px;
      cursor: pointer;
      background: #f5f5f5;
      transition: background-color 0.2s ease;
    }
    
    .example-accordion-item-header:hover {
      background: #eeeeee;
    }
    
    .accordion-title {
      font-weight: 500;
      font-size: 16px;
    }
    
    .accordion-badge {
      padding: 4px 8px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 500;
    }
    
    .accordion-badge.success {
      background: #e8f5e8;
      color: #2e7d32;
    }
    
    .accordion-badge.warning {
      background: #fff3e0;
      color: #f57c00;
    }
    
    .accordion-badge.error {
      background: #ffebee;
      color: #d32f2f;
    }
    
    .accordion-icon {
      transition: transform 0.2s ease;
    }
    
    .accordion-icon.expanded {
      transform: rotate(180deg);
    }
    
    .example-accordion-item-body {
      max-height: 0;
      overflow: hidden;
      transition: max-height 0.3s ease;
    }
    
    .example-accordion-item-body.expanded {
      max-height: 1000px;
    }
    
    .accordion-content {
      padding: 20px;
    }
    
    .accordion-form {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    
    .form-field {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    
    .form-field label {
      font-weight: 500;
      font-size: 14px;
    }
    
    .form-field input {
      padding: 8px 12px;
      border: 1px solid #ddd;
      border-radius: 4px;
    }
    
    .chart-container h4 {
      margin: 0 0 16px 0;
    }
    
    .simple-chart {
      display: flex;
      gap: 8px;
      align-items: end;
      height: 120px;
    }
    
    .chart-bar {
      display: flex;
      flex-direction: column;
      align-items: center;
      flex: 1;
    }
    
    .bar-fill {
      width: 100%;
      background: linear-gradient(to top, #1976d2, #42a5f5);
      border-radius: 4px 4px 0 0;
      min-height: 4px;
    }
    
    .bar-label {
      margin-top: 8px;
      font-size: 12px;
      text-align: center;
    }
    
    .accordion-actions {
      display: flex;
      gap: 8px;
      margin-top: 16px;
      flex-wrap: wrap;
    }
    
    .accordion-controls {
      display: flex;
      gap: 12px;
      margin-top: 24px;
      flex-wrap: wrap;
    }
  \`]
})
export class EnhancedAccordionComponent {
  accordionItems = signal<AccordionItem[]>([
    {
      id: 1,
      title: 'Getting Started',
      type: 'text',
      content: 'Welcome to our enhanced accordion component. This section contains basic information about getting started with the application.',
      expanded: true,
      disabled: false,
      badge: { text: 'New', type: 'success' }
    },
    {
      id: 2,
      title: 'Features List',
      type: 'list',
      items: [
        'Enhanced CDK Accordion',
        'Material 3 Design System',
        'Responsive Layout',
        'Accessibility Support',
        'Custom Animations'
      ],
      expanded: false,
      disabled: false,
      badge: { text: 'Updated', type: 'warning' }
    },
    {
      id: 3,
      title: 'Contact Form',
      type: 'form',
      formData: { name: '', email: '' },
      expanded: false,
      disabled: false,
      actions: [
        { label: 'Save', icon: 'save', color: 'primary' },
        { label: 'Reset', icon: 'refresh', color: 'accent' }
      ]
    },
    {
      id: 4,
      title: 'Performance Metrics',
      type: 'chart',
      chartTitle: 'Monthly Performance',
      chartData: [
        { label: 'Jan', value: 65 },
        { label: 'Feb', value: 78 },
        { label: 'Mar', value: 90 },
        { label: 'Apr', value: 85 }
      ],
      expanded: false,
      disabled: false,
      actions: [
        { label: 'Export', icon: 'download', color: 'primary' },
        { label: 'Refresh', icon: 'refresh', color: 'accent' }
      ]
    }
  ]);
  
  expandAll() {
    this.accordionItems.update(items =>
      items.map(item => ({ ...item, expanded: true }))
    );
  }
  
  collapseAll() {
    this.accordionItems.update(items =>
      items.map(item => ({ ...item, expanded: false }))
    );
  }
  
  addAccordionItem() {
    const newItem: AccordionItem = {
      id: Date.now(),
      title: \`New Item \${this.accordionItems().length + 1}\`,
      type: 'text',
      content: 'This is a dynamically added accordion item.',
      expanded: true,
      disabled: false,
      badge: { text: 'New', type: 'success' }
    };
    
    this.accordionItems.update(items => [...items, newItem]);
  }
  
  shuffleItems() {
    this.accordionItems.update(items => {
      const shuffled = [...items];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      return shuffled;
    });
  }
  
  handleAction(action: AccordionAction, item: AccordionItem) {
    console.log(\`Action '\${action.label}' clicked for item '\${item.title}'\`);
    
    switch (action.label) {
      case 'Save':
        console.log('Saving form data:', item.formData);
        break;
      case 'Reset':
        this.accordionItems.update(items =>
          items.map(i => 
            i.id === item.id 
              ? { ...i, formData: { name: '', email: '' } }
              : i
          )
        );
        break;
      case 'Export':
        console.log('Exporting chart data:', item.chartData);
        break;
      case 'Refresh':
        console.log('Refreshing data for:', item.title);
        break;
    }
  }
  
  getMaxValue(data: ChartDataPoint[]): number {
    return Math.max(...data.map(d => d.value));
  }
}

// Type definitions
interface AccordionItem {
  id: number;
  title: string;
  type: 'text' | 'list' | 'form' | 'chart';
  content?: string;
  items?: string[];
  formData?: { name: string; email: string };
  chartTitle?: string;
  chartData?: ChartDataPoint[];
  expanded: boolean;
  disabled: boolean;
  badge?: {
    text: string;
    type: 'success' | 'warning' | 'error';
  };
  actions?: AccordionAction[];
}

interface AccordionAction {
  label: string;
  icon?: string;
  color?: 'primary' | 'accent' | 'warn';
}

interface ChartDataPoint {
  label: string;
  value: number;
}`,
    },
  ]

  const interviewQuestions = [
    {
      question: "What is zoneless change detection in Angular 20 and how does it work?",
      answer:
        "Zoneless change detection removes the dependency on Zone.js by using Angular's signal-based reactivity system. Instead of patching browser APIs to detect changes, it relies on signals to automatically trigger updates when data changes. This results in better performance, smaller bundle sizes, and more predictable change detection behavior.",
    },
    {
      question: "How do the stable control flow blocks (@if, @for, @switch) improve Angular templates?",
      answer:
        "Stable control flow blocks provide better performance through optimized rendering, improved type safety with better TypeScript inference, cleaner syntax without structural directives, better tree-shaking, and enhanced debugging experience. They replace *ngIf, *ngFor, and *ngSwitch with more efficient built-in syntax.",
    },
    {
      question: "What are the benefits of Material 3 components in Angular 20?",
      answer:
        "Material 3 components provide updated design tokens following Google's Material You design system, improved accessibility features, better theming support with dynamic color schemes, enhanced component variants like tonal buttons, and better integration with modern design patterns and user expectations.",
    },
    {
      question: "How does the enhanced CDK Accordion differ from previous versions?",
      answer:
        "The enhanced CDK Accordion offers better accessibility support, improved keyboard navigation, more flexible content projection, better animation performance, enhanced customization options, and better integration with Angular's reactive forms and signal-based state management.",
    },
    {
      question: "What are the key differences between Angular 19 and Angular 20?",
      answer:
        "Angular 20 builds on Angular 19 with stable control flow syntax (vs developer preview), zoneless change detection in developer preview, enhanced Ivy compiler improvements, Material 3 component additions, stable Signals and Effects APIs, improved SSR with stable incremental hydration, and better developer tooling integration.",
    },
    {
      question: "How do you migrate from Zone.js to zoneless change detection?",
      answer:
        "Migration involves: enabling provideExperimentalZonelessChangeDetection(), converting components to use signals instead of traditional change detection, updating services to use signal-based state, removing Zone.js dependencies, testing thoroughly for change detection issues, and updating third-party libraries that depend on Zone.js.",
    },
    {
      question: "What are the performance benefits of Angular 20's improvements?",
      answer:
        "Performance benefits include: smaller bundle sizes without Zone.js, faster change detection with signals, improved SSR performance with stable incremental hydration, better tree-shaking with control flow blocks, reduced memory usage, faster initial load times, and more efficient rendering cycles.",
    },
    {
      question: "How do you implement custom themes with Material 3 in Angular 20?",
      answer:
        "Custom Material 3 themes use design tokens, CSS custom properties for dynamic theming, the new theming API for programmatic theme changes, support for light/dark/auto modes, integration with system preferences, and the ability to create custom color palettes that follow Material 3 guidelines.",
    },
  ]

  return (
    <PageLayout
      title="Angular 20 Features"
      description="Discover the cutting-edge features in Angular 20, including zoneless change detection, stable control flow, and Material 3 components"
    >
      <div className="space-y-8">
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-cyan-400">Overview</h2>
          <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700">
            <p className="text-slate-300 leading-relaxed mb-4">
              Angular 20, released in May 2025, represents a major leap forward in Angular's evolution. It introduces
              zoneless change detection in developer preview, stabilizes control flow syntax, enhances the Ivy compiler,
              and brings Material 3 design system components with improved developer experience and performance
              optimizations.
            </p>
            <div className="grid md:grid-cols-2 gap-4 mt-6">
              <div className="bg-slate-900/50 p-4 rounded border border-slate-600">
                <h3 className="font-semibold text-pink-400 mb-2">Revolutionary Features</h3>
                <ul className="text-sm text-slate-300 space-y-1">
                  <li>• Zoneless change detection (preview)</li>
                  <li>• Stable control flow syntax</li>
                  <li>• Enhanced Ivy compiler</li>
                  <li>• Material 3 components</li>
                  <li>• Stable Signals and Effects</li>
                  <li>• Improved SSR performance</li>
                </ul>
              </div>
              <div className="bg-slate-900/50 p-4 rounded border border-slate-600">
                <h3 className="font-semibold text-pink-400 mb-2">Developer Experience</h3>
                <ul className="text-sm text-slate-300 space-y-1">
                  <li>• Enhanced schematics and migrations</li>
                  <li>• Better TypeScript integration</li>
                  <li>• Improved debugging tools</li>
                  <li>• Advanced CDK components</li>
                  <li>• Better PaaS integration</li>
                  <li>• Enhanced security features</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-cyan-400">Code Examples</h2>
          <div className="space-y-6">
            {angular20Examples.map((example, index) => (
              <CodeExample key={index} title={example.title} code={example.code} language="typescript" />
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-cyan-400">Interview Questions</h2>
          <InterviewQuestions questions={interviewQuestions} />
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-cyan-400">Migration Roadmap</h2>
          <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700">
            <h3 className="font-semibold text-pink-400 mb-3">Upgrading to Angular 20</h3>
            <div className="space-y-4">
              <div className="bg-slate-900/50 p-4 rounded border border-slate-600">
                <h4 className="font-medium text-cyan-300 mb-2">1. Prerequisites</h4>
                <p className="text-sm text-slate-300 mb-2">Ensure you're on Angular 19 first:</p>
                <code className="text-sm text-slate-300">ng update @angular/cli @angular/core</code>
              </div>
              <div className="bg-slate-900/50 p-4 rounded border border-slate-600">
                <h4 className="font-medium text-cyan-300 mb-2">2. Update to Angular 20</h4>
                <code className="text-sm text-slate-300">ng update @angular/cli@20 @angular/core@20</code>
              </div>
              <div className="bg-slate-900/50 p-4 rounded border border-slate-600">
                <h4 className="font-medium text-cyan-300 mb-2">3. Migrate Control Flow (Optional)</h4>
                <code className="text-sm text-slate-300">ng generate @angular/core:control-flow</code>
              </div>
              <div className="bg-slate-900/50 p-4 rounded border border-slate-600">
                <h4 className="font-medium text-cyan-300 mb-2">4. Enable Zoneless (Experimental)</h4>
                <code className="text-sm text-slate-300">
                  // Add to app.config.ts
                  <br />
                  provideExperimentalZonelessChangeDetection()
                </code>
              </div>
              <div className="bg-slate-900/50 p-4 rounded border border-slate-600">
                <h4 className="font-medium text-cyan-300 mb-2">5. Update Material Components</h4>
                <code className="text-sm text-slate-300">ng update @angular/material</code>
              </div>
            </div>
          </div>
        </section>
      </div>
    </PageLayout>
  )
}
