import { PageLayout } from "@/components/page-layout"
import { CodeExample } from "@/components/code-example"
import { InterviewQuestions } from "@/components/interview-questions"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Lightbulb, AlertCircle } from "lucide-react"

const directiveQuestions = [
  {
    id: "directive-types",
    question: "What are the different types of directives in Angular?",
    answer: `<p>Angular has three types of directives:</p>
    <ul>
      <li><strong>Component Directives:</strong> Directives with templates (components)</li>
      <li><strong>Structural Directives:</strong> Change DOM layout by adding/removing elements (*ngIf, *ngFor, *ngSwitch)</li>
      <li><strong>Attribute Directives:</strong> Change appearance or behavior of elements (ngClass, ngStyle, custom directives)</li>
    </ul>
    <p>Each type serves different purposes in manipulating the DOM and component behavior.</p>`,
    difficulty: "Easy" as const,
    tags: ["directives", "types"],
  },
  {
    id: "structural-vs-attribute",
    question: "What is the difference between structural and attribute directives?",
    answer: `<p>Key differences between structural and attribute directives:</p>
    <ul>
      <li><strong>Structural Directives:</strong>
        <ul>
          <li>Modify DOM structure by adding/removing elements</li>
          <li>Use asterisk (*) prefix syntax</li>
          <li>Can only have one per element</li>
          <li>Examples: *ngIf, *ngFor, *ngSwitch</li>
        </ul>
      </li>
      <li><strong>Attribute Directives:</strong>
        <ul>
          <li>Modify element appearance or behavior</li>
          <li>Use square bracket [] syntax</li>
          <li>Multiple can be applied to same element</li>
          <li>Examples: ngClass, ngStyle, custom directives</li>
        </ul>
      </li>
    </ul>`,
    difficulty: "Medium" as const,
    tags: ["directives", "structural", "attribute"],
  },
  {
    id: "custom-directive",
    question: "How do you create a custom directive in Angular?",
    answer: `<p>To create a custom directive:</p>
    <ol>
      <li>Use <code>@Directive</code> decorator</li>
      <li>Define selector (usually attribute selector)</li>
      <li>Inject ElementRef and Renderer2 for DOM manipulation</li>
      <li>Implement desired functionality in constructor or lifecycle hooks</li>
      <li>Register in module declarations</li>
    </ol>
    <p>Example: <code>@Directive({ selector: '[appHighlight]' })</code></p>`,
    difficulty: "Medium" as const,
    tags: ["directives", "custom", "decorator"],
  },
]

export default function DirectivesPage() {
  return (
    <PageLayout
      title="Angular Directives"
      description="Master Angular directives - structural, attribute, and custom directives"
      badge="Fundamentals"
      previousPage={{ title: "Templates & Data Binding", href: "/fundamentals/templates" }}
      nextPage={{ title: "Services & DI", href: "/fundamentals/services" }}
    >
      <div className="space-y-8">
        {/* Introduction */}
        <div>
          <h2>What are Directives?</h2>
          <p>
            Directives are classes that add additional behavior to elements in your Angular applications. They are
            markers in the DOM that tell Angular to attach particular behavior to those elements.
          </p>
        </div>

        {/* Directive Types */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-primary" />
              Types of Directives
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Badge variant="default">Component</Badge>
                <p className="text-sm">Directives with templates. These are essentially components.</p>
              </div>
              <div className="space-y-2">
                <Badge variant="secondary">Structural</Badge>
                <p className="text-sm">Add or remove DOM elements (*ngIf, *ngFor)</p>
              </div>
              <div className="space-y-2">
                <Badge variant="outline">Attribute</Badge>
                <p className="text-sm">Change element appearance or behavior (ngClass, ngStyle)</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Structural Directives */}
        <div>
          <h2>Structural Directives</h2>
          <p>
            Structural directives are responsible for HTML layout. They shape or reshape the DOM's structure, typically
            by adding, removing, or manipulating elements.
          </p>
        </div>

        <CodeExample
          title="*ngIf - Conditional Rendering"
          description="Show or hide elements based on conditions"
          filename="ngif-examples.component.ts"
          code={`import { Component } from '@angular/core';

@Component({
  selector: 'app-ngif-examples',
  template: \`
    <div class="ngif-demo">
      <!-- Basic *ngIf -->
      <div *ngIf="isVisible">
        <p>This content is conditionally visible!</p>
      </div>
      
      <!-- *ngIf with else -->
      <div *ngIf="user; else noUser">
        <h3>Welcome, {{ user.name }}!</h3>
        <p>Email: {{ user.email }}</p>
      </div>
      <ng-template #noUser>
        <p>Please log in to see user information.</p>
      </ng-template>
      
      <!-- *ngIf with then and else -->
      <div *ngIf="isLoading; then loading; else content"></div>
      <ng-template #loading>
        <div class="spinner">Loading...</div>
      </ng-template>
      <ng-template #content>
        <div class="content">Content loaded successfully!</div>
      </ng-template>
      
      <!-- *ngIf with async pipe -->
      <div *ngIf="userData$ | async as userData">
        <h4>{{ userData.name }}</h4>
        <p>{{ userData.description }}</p>
      </div>
      
      <!-- Complex conditions -->
      <div *ngIf="user && user.isActive && user.permissions.includes('admin')">
        <button class="admin-button">Admin Panel</button>
      </div>
      
      <!-- Controls -->
      <div class="controls">
        <button (click)="toggleVisibility()">Toggle Visibility</button>
        <button (click)="toggleUser()">Toggle User</button>
        <button (click)="toggleLoading()">Toggle Loading</button>
      </div>
    </div>
  \`
})
export class NgIfExamplesComponent {
  isVisible = true;
  isLoading = false;
  
  user: any = {
    name: 'John Doe',
    email: 'john@example.com',
    isActive: true,
    permissions: ['user', 'admin']
  };
  
  userData$ = new Promise(resolve => {
    setTimeout(() => {
      resolve({
        name: 'Async User',
        description: 'This data was loaded asynchronously'
      });
    }, 2000);
  });
  
  toggleVisibility() {
    this.isVisible = !this.isVisible;
  }
  
  toggleUser() {
    this.user = this.user ? null : {
      name: 'John Doe',
      email: 'john@example.com',
      isActive: true,
      permissions: ['user', 'admin']
    };
  }
  
  toggleLoading() {
    this.isLoading = !this.isLoading;
  }
}`}
        />

        <CodeExample
          title="*ngFor - List Rendering"
          description="Iterate over collections to render lists"
          filename="ngfor-examples.component.ts"
          code={`import { Component } from '@angular/core';

interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  inStock: boolean;
}

@Component({
  selector: 'app-ngfor-examples',
  template: \`
    <div class="ngfor-demo">
      <!-- Basic *ngFor -->
      <h3>Simple List</h3>
      <ul>
        <li *ngFor="let item of items">{{ item }}</li>
      </ul>
      
      <!-- *ngFor with index -->
      <h3>List with Index</h3>
      <div *ngFor="let item of items; let i = index">
        {{ i + 1 }}. {{ item }}
      </div>
      
      <!-- *ngFor with multiple variables -->
      <h3>Products with Tracking</h3>
      <div class="product-grid">
        <div *ngFor="let product of products; let i = index; let first = first; let last = last; let even = even; let odd = odd; trackBy: trackByProduct"
             [class.first]="first"
             [class.last]="last"
             [class.even]="even"
             [class.odd]="odd"
             class="product-card">
          <h4>{{ product.name }}</h4>
          <p>Price: \${{ product.price }}</p>
          <p>Category: {{ product.category }}</p>
          <span [class.in-stock]="product.inStock" [class.out-of-stock]="!product.inStock">
            {{ product.inStock ? 'In Stock' : 'Out of Stock' }}
          </span>
          <small>Index: {{ i }}</small>
        </div>
      </div>
      
      <!-- Nested *ngFor -->
      <h3>Nested Lists</h3>
      <div *ngFor="let category of categories">
        <h4>{{ category.name }}</h4>
        <ul>
          <li *ngFor="let item of category.items">
            {{ item.name }} - \${{ item.price }}
          </li>
        </ul>
      </div>
      
      <!-- *ngFor with pipe -->
      <h3>Filtered and Sorted Products</h3>
      <input [(ngModel)]="searchTerm" placeholder="Search products...">
      <div *ngFor="let product of products | filter:searchTerm | orderBy:'price'">
        {{ product.name }} - \${{ product.price }}
      </div>
      
      <!-- Empty state -->
      <div *ngIf="products.length === 0; else productList">
        <p>No products available.</p>
      </div>
      <ng-template #productList>
        <p>Showing {{ products.length }} products</p>
      </ng-template>
      
      <!-- Controls -->
      <div class="controls">
        <button (click)="addProduct()">Add Product</button>
        <button (click)="removeProduct()">Remove Product</button>
        <button (click)="shuffleProducts()">Shuffle Products</button>
      </div>
    </div>
  \`
})
export class NgForExamplesComponent {
  items = ['Apple', 'Banana', 'Cherry', 'Date', 'Elderberry'];
  searchTerm = '';
  
  products: Product[] = [
    { id: 1, name: 'Laptop', price: 999, category: 'Electronics', inStock: true },
    { id: 2, name: 'Phone', price: 699, category: 'Electronics', inStock: false },
    { id: 3, name: 'Book', price: 29, category: 'Education', inStock: true },
    { id: 4, name: 'Headphones', price: 199, category: 'Electronics', inStock: true }
  ];
  
  categories = [
    {
      name: 'Electronics',
      items: [
        { name: 'Laptop', price: 999 },
        { name: 'Phone', price: 699 }
      ]
    },
    {
      name: 'Books',
      items: [
        { name: 'Angular Guide', price: 49 },
        { name: 'TypeScript Handbook', price: 39 }
      ]
    }
  ];
  
  trackByProduct(index: number, product: Product): number {
    return product.id;
  }
  
  addProduct() {
    const newProduct: Product = {
      id: this.products.length + 1,
      name: \`Product \${this.products.length + 1}\`,
      price: Math.floor(Math.random() * 500) + 50,
      category: 'New',
      inStock: Math.random() > 0.5
    };
    this.products.push(newProduct);
  }
  
  removeProduct() {
    if (this.products.length > 0) {
      this.products.pop();
    }
  }
  
  shuffleProducts() {
    this.products = [...this.products].sort(() => Math.random() - 0.5);
  }
}`}
        />

        <CodeExample
          title="*ngSwitch - Multiple Conditions"
          description="Handle multiple conditional cases"
          filename="ngswitch-examples.component.ts"
          code={`import { Component } from '@angular/core';

@Component({
  selector: 'app-ngswitch-examples',
  template: \`
    <div class="ngswitch-demo">
      <!-- Basic ngSwitch -->
      <div class="user-status" [ngSwitch]="userStatus">
        <div *ngSwitchCase="'online'" class="status online">
          🟢 User is online
        </div>
        <div *ngSwitchCase="'offline'" class="status offline">
          🔴 User is offline
        </div>
        <div *ngSwitchCase="'away'" class="status away">
          🟡 User is away
        </div>
        <div *ngSwitchCase="'busy'" class="status busy">
          🔴 User is busy
        </div>
        <div *ngSwitchDefault class="status unknown">
          ❓ Status unknown
        </div>
      </div>
      
      <!-- ngSwitch with different content types -->
      <div class="content-type" [ngSwitch]="contentType">
        <div *ngSwitchCase="'text'">
          <h3>Text Content</h3>
          <p>{{ textContent }}</p>
        </div>
        
        <div *ngSwitchCase="'image'">
          <h3>Image Content</h3>
          <img [src]="imageContent" alt="Sample image" style="max-width: 300px;">
        </div>
        
        <div *ngSwitchCase="'video'">
          <h3>Video Content</h3>
          <video controls style="max-width: 400px;">
            <source [src]="videoContent" type="video/mp4">
            Your browser does not support the video tag.
          </video>
        </div>
        
        <div *ngSwitchCase="'list'">
          <h3>List Content</h3>
          <ul>
            <li *ngFor="let item of listContent">{{ item }}</li>
          </ul>
        </div>
        
        <div *ngSwitchDefault>
          <h3>No Content</h3>
          <p>Please select a content type.</p>
        </div>
      </div>
      
      <!-- User role based content -->
      <div class="user-role" [ngSwitch]="userRole">
        <div *ngSwitchCase="'admin'">
          <h3>Admin Dashboard</h3>
          <button>Manage Users</button>
          <button>System Settings</button>
          <button>View Reports</button>
        </div>
        
        <div *ngSwitchCase="'moderator'">
          <h3>Moderator Panel</h3>
          <button>Review Posts</button>
          <button>Manage Comments</button>
        </div>
        
        <div *ngSwitchCase="'user'">
          <h3>User Profile</h3>
          <button>Edit Profile</button>
          <button>View History</button>
        </div>
        
        <div *ngSwitchDefault>
          <h3>Guest Access</h3>
          <p>Please log in to access more features.</p>
          <button>Login</button>
          <button>Register</button>
        </div>
      </div>
      
      <!-- Controls -->
      <div class="controls">
        <div class="control-group">
          <label>User Status:</label>
          <select [(ngModel)]="userStatus">
            <option value="online">Online</option>
            <option value="offline">Offline</option>
            <option value="away">Away</option>
            <option value="busy">Busy</option>
            <option value="unknown">Unknown</option>
          </select>
        </div>
        
        <div class="control-group">
          <label>Content Type:</label>
          <select [(ngModel)]="contentType">
            <option value="text">Text</option>
            <option value="image">Image</option>
            <option value="video">Video</option>
            <option value="list">List</option>
            <option value="none">None</option>
          </select>
        </div>
        
        <div class="control-group">
          <label>User Role:</label>
          <select [(ngModel)]="userRole">
            <option value="admin">Admin</option>
            <option value="moderator">Moderator</option>
            <option value="user">User</option>
            <option value="guest">Guest</option>
          </select>
        </div>
      </div>
    </div>
  \`
})
export class NgSwitchExamplesComponent {
  userStatus = 'online';
  contentType = 'text';
  userRole = 'user';
  
  textContent = 'This is some sample text content that demonstrates the text content type.';
  imageContent = '/abstract-geometric-shapes.png';
  videoContent = 'assets/videos/sample-video.mp4';
  listContent = ['Item 1', 'Item 2', 'Item 3', 'Item 4'];
}`}
        />

        {/* Attribute Directives */}
        <div>
          <h2>Attribute Directives</h2>
          <p>Attribute directives change the appearance or behavior of an element, component, or another directive.</p>
        </div>

        <CodeExample
          title="Built-in Attribute Directives"
          description="Using ngClass, ngStyle, and other built-in attribute directives"
          filename="attribute-directives.component.ts"
          code={`import { Component } from '@angular/core';

@Component({
  selector: 'app-attribute-directives',
  template: \`
    <div class="attribute-directives-demo">
      <!-- ngClass examples -->
      <h3>ngClass Examples</h3>
      
      <!-- String class -->
      <div [ngClass]="'highlight'">String class</div>
      
      <!-- Array of classes -->
      <div [ngClass]="['primary', 'large']">Array classes</div>
      
      <!-- Object with conditions -->
      <div [ngClass]="{
        'active': isActive,
        'disabled': isDisabled,
        'primary': isPrimary,
        'large': size === 'large'
      }">Conditional classes</div>
      
      <!-- Method returning classes -->
      <div [ngClass]="getClasses()">Method-based classes</div>
      
      <!-- ngStyle examples -->
      <h3>ngStyle Examples</h3>
      
      <!-- Object styles -->
      <div [ngStyle]="{
        'color': textColor,
        'font-size': fontSize + 'px',
        'background-color': backgroundColor,
        'padding': '10px',
        'border-radius': '5px'
      }">Dynamic styles</div>
      
      <!-- Method returning styles -->
      <div [ngStyle]="getStyles()">Method-based styles</div>
      
      <!-- Conditional styles -->
      <div [ngStyle]="{
        'display': isVisible ? 'block' : 'none',
        'opacity': isEnabled ? 1 : 0.5,
        'cursor': isClickable ? 'pointer' : 'default'
      }">Conditional styles</div>
      
      <!-- Individual style binding -->
      <div [style.color]="textColor"
           [style.font-size.px]="fontSize"
           [style.background-color]="backgroundColor">
        Individual style bindings
      </div>
      
      <!-- ngModel for form controls -->
      <h3>ngModel Examples</h3>
      <div class="form-controls">
        <input [(ngModel)]="inputValue" placeholder="Two-way binding">
        <p>Input value: {{ inputValue }}</p>
        
        <select [(ngModel)]="selectedOption">
          <option value="option1">Option 1</option>
          <option value="option2">Option 2</option>
          <option value="option3">Option 3</option>
        </select>
        <p>Selected: {{ selectedOption }}</p>
        
        <label>
          <input type="checkbox" [(ngModel)]="isChecked">
          Checkbox value: {{ isChecked }}
        </label>
      </div>
      
      <!-- Controls -->
      <div class="controls">
        <button (click)="toggleActive()">Toggle Active</button>
        <button (click)="toggleDisabled()">Toggle Disabled</button>
        <button (click)="togglePrimary()">Toggle Primary</button>
        <button (click)="changeSize()">Change Size</button>
        <button (click)="randomizeColors()">Random Colors</button>
        <button (click)="increaseFontSize()">Increase Font</button>
        <button (click)="decreaseFontSize()">Decrease Font</button>
      </div>
    </div>
  \`,
  styles: [\`
    .highlight { background-color: yellow; }
    .primary { color: #007acc; font-weight: bold; }
    .large { font-size: 1.2em; }
    .active { border: 2px solid green; }
    .disabled { opacity: 0.5; pointer-events: none; }
    .controls button { margin: 5px; }
    .form-controls { margin: 20px 0; }
    .form-controls > * { margin: 10px 0; display: block; }
  \`]
})
export class AttributeDirectivesComponent {
  isActive = false;
  isDisabled = false;
  isPrimary = true;
  size = 'normal';
  
  textColor = '#333';
  fontSize = 16;
  backgroundColor = '#f0f0f0';
  
  isVisible = true;
  isEnabled = true;
  isClickable = true;
  
  inputValue = '';
  selectedOption = 'option1';
  isChecked = false;
  
  getClasses() {
    return {
      'highlight': this.isActive,
      'primary': this.isPrimary,
      'large': this.size === 'large'
    };
  }
  
  getStyles() {
    return {
      'border': this.isActive ? '2px solid blue' : '1px solid gray',
      'padding': '15px',
      'margin': '10px 0',
      'transition': 'all 0.3s ease'
    };
  }
  
  toggleActive() {
    this.isActive = !this.isActive;
  }
  
  toggleDisabled() {
    this.isDisabled = !this.isDisabled;
  }
  
  togglePrimary() {
    this.isPrimary = !this.isPrimary;
  }
  
  changeSize() {
    this.size = this.size === 'large' ? 'normal' : 'large';
  }
  
  randomizeColors() {
    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7'];
    this.textColor = colors[Math.floor(Math.random() * colors.length)];
    this.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
  }
  
  increaseFontSize() {
    this.fontSize = Math.min(this.fontSize + 2, 24);
  }
  
  decreaseFontSize() {
    this.fontSize = Math.max(this.fontSize - 2, 12);
  }
}`}
        />

        {/* Custom Directives */}
        <div>
          <h2>Custom Directives</h2>
          <p>
            You can create your own directives to encapsulate DOM manipulation logic and reuse it across your
            application.
          </p>
        </div>

        <CodeExample
          title="Custom Attribute Directive"
          description="Creating a custom highlight directive"
          filename="highlight.directive.ts"
          code={`import { Directive, ElementRef, HostListener, Input, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appHighlight]'
})
export class HighlightDirective {
  @Input() appHighlight = '';
  @Input() defaultColor = 'yellow';
  
  constructor(
    private el: ElementRef,
    private renderer: Renderer2
  ) {}
  
  @HostListener('mouseenter') onMouseEnter() {
    this.highlight(this.appHighlight || this.defaultColor);
  }
  
  @HostListener('mouseleave') onMouseLeave() {
    this.highlight('');
  }
  
  private highlight(color: string) {
    this.renderer.setStyle(this.el.nativeElement, 'backgroundColor', color);
  }
}

// Usage in component template:
// <p appHighlight="lightblue">Hover over this text</p>
// <p appHighlight>This uses default yellow</p>
// <p [appHighlight]="dynamicColor">Dynamic color</p>`}
        />

        <CodeExample
          title="Advanced Custom Directive"
          description="A more complex directive with multiple features"
          filename="tooltip.directive.ts"
          code={`import { 
  Directive, 
  ElementRef, 
  HostListener, 
  Input, 
  Renderer2,
  OnDestroy 
} from '@angular/core';

@Directive({
  selector: '[appTooltip]'
})
export class TooltipDirective implements OnDestroy {
  @Input('appTooltip') tooltipText = '';
  @Input() placement: 'top' | 'bottom' | 'left' | 'right' = 'top';
  @Input() delay = 500;
  
  private tooltipElement: HTMLElement | null = null;
  private showTimeout: any;
  private hideTimeout: any;
  
  constructor(
    private el: ElementRef,
    private renderer: Renderer2
  ) {}
  
  @HostListener('mouseenter') onMouseEnter() {
    this.clearTimeouts();
    this.showTimeout = setTimeout(() => {
      this.showTooltip();
    }, this.delay);
  }
  
  @HostListener('mouseleave') onMouseLeave() {
    this.clearTimeouts();
    this.hideTimeout = setTimeout(() => {
      this.hideTooltip();
    }, 100);
  }
  
  private showTooltip() {
    if (this.tooltipElement || !this.tooltipText) return;
    
    // Create tooltip element
    this.tooltipElement = this.renderer.createElement('div');
    this.renderer.addClass(this.tooltipElement, 'tooltip');
    this.renderer.addClass(this.tooltipElement, \`tooltip-\${this.placement}\`);
    
    // Set tooltip text
    const textNode = this.renderer.createText(this.tooltipText);
    this.renderer.appendChild(this.tooltipElement, textNode);
    
    // Add styles
    this.renderer.setStyle(this.tooltipElement, 'position', 'absolute');
    this.renderer.setStyle(this.tooltipElement, 'background', '#333');
    this.renderer.setStyle(this.tooltipElement, 'color', 'white');
    this.renderer.setStyle(this.tooltipElement, 'padding', '8px 12px');
    this.renderer.setStyle(this.tooltipElement, 'border-radius', '4px');
    this.renderer.setStyle(this.tooltipElement, 'font-size', '14px');
    this.renderer.setStyle(this.tooltipElement, 'z-index', '1000');
    this.renderer.setStyle(this.tooltipElement, 'pointer-events', 'none');
    
    // Position tooltip
    this.positionTooltip();
    
    // Add to DOM
    this.renderer.appendChild(document.body, this.tooltipElement);
    
    // Fade in animation
    this.renderer.setStyle(this.tooltipElement, 'opacity', '0');
    this.renderer.setStyle(this.tooltipElement, 'transition', 'opacity 0.2s');
    setTimeout(() => {
      if (this.tooltipElement) {
        this.renderer.setStyle(this.tooltipElement, 'opacity', '1');
      }
    }, 10);
  }
  
  private hideTooltip() {
    if (!this.tooltipElement) return;
    
    this.renderer.setStyle(this.tooltipElement, 'opacity', '0');
    setTimeout(() => {
      if (this.tooltipElement) {
        this.renderer.removeChild(document.body, this.tooltipElement);
        this.tooltipElement = null;
      }
    }, 200);
  }
  
  private positionTooltip() {
    if (!this.tooltipElement) return;
    
    const hostRect = this.el.nativeElement.getBoundingClientRect();
    const tooltipRect = this.tooltipElement.getBoundingClientRect();
    
    let top = 0;
    let left = 0;
    
    switch (this.placement) {
      case 'top':
        top = hostRect.top - tooltipRect.height - 8;
        left = hostRect.left + (hostRect.width - tooltipRect.width) / 2;
        break;
      case 'bottom':
        top = hostRect.bottom + 8;
        left = hostRect.left + (hostRect.width - tooltipRect.width) / 2;
        break;
      case 'left':
        top = hostRect.top + (hostRect.height - tooltipRect.height) / 2;
        left = hostRect.left - tooltipRect.width - 8;
        break;
      case 'right':
        top = hostRect.top + (hostRect.height - tooltipRect.height) / 2;
        left = hostRect.right + 8;
        break;
    }
    
    this.renderer.setStyle(this.tooltipElement, 'top', \`\${top + window.scrollY}px\`);
    this.renderer.setStyle(this.tooltipElement, 'left', \`\${left + window.scrollX}px\`);
  }
  
  private clearTimeouts() {
    if (this.showTimeout) {
      clearTimeout(this.showTimeout);
      this.showTimeout = null;
    }
    if (this.hideTimeout) {
      clearTimeout(this.hideTimeout);
      this.hideTimeout = null;
    }
  }
  
  ngOnDestroy() {
    this.clearTimeouts();
    this.hideTooltip();
  }
}

// Usage examples:
// <button appTooltip="This is a tooltip">Hover me</button>
// <span appTooltip="Bottom tooltip" placement="bottom">Bottom</span>
// <div [appTooltip]="dynamicTooltipText" [delay]="1000">Custom delay</div>`}
        />

        {/* Best Practices */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-primary" />
              Directive Best Practices
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              <li>
                <strong>Use TrackBy with *ngFor:</strong> Implement trackBy functions to improve performance with large
                lists
              </li>
              <li>
                <strong>Avoid DOM Manipulation:</strong> Use Renderer2 instead of direct DOM manipulation for better
                security
              </li>
              <li>
                <strong>Clean Up Resources:</strong> Implement OnDestroy to clean up event listeners and subscriptions
              </li>
              <li>
                <strong>Use HostListener:</strong> Prefer @HostListener over manual event binding for better performance
              </li>
              <li>
                <strong>Meaningful Selectors:</strong> Use descriptive selector names that clearly indicate the
                directive's purpose
              </li>
              <li>
                <strong>Input Validation:</strong> Always validate inputs and provide sensible defaults
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Interview Questions */}
        <InterviewQuestions title="Directives Interview Questions" questions={directiveQuestions} />
      </div>
    </PageLayout>
  )
}
