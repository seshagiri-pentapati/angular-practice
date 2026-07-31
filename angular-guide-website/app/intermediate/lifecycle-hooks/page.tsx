import { PageLayout } from "@/components/page-layout"
import { CodeExample } from "@/components/code-example"
import { InterviewQuestions } from "@/components/interview-questions"

export default function LifecycleHooksPage() {
  const lifecycleExamples = [
    {
      title: "Complete Lifecycle Hook Implementation",
      code: `import { 
  Component, OnInit, OnDestroy, OnChanges, DoCheck, 
  AfterContentInit, AfterContentChecked, AfterViewInit, 
  AfterViewChecked, SimpleChanges, Input, ViewChild, 
  ContentChild, ElementRef 
} from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-lifecycle-demo',
  template: \`
    <div class="lifecycle-demo">
      <h3>Lifecycle Demo Component</h3>
      <p>Name: {{ name }}</p>
      <p>Count: {{ count }}</p>
      
      <ng-content></ng-content>
      
      <div #viewChild>View Child Element</div>
      
      <button (click)="increment()">Increment</button>
    </div>
  \`
})
export class LifecycleDemoComponent implements 
  OnInit, OnDestroy, OnChanges, DoCheck, 
  AfterContentInit, AfterContentChecked, 
  AfterViewInit, AfterViewChecked {

  @Input() name: string = '';
  @Input() data: any;
  
  @ViewChild('viewChild', { static: true }) viewChild!: ElementRef;
  @ContentChild('contentChild') contentChild!: ElementRef;
  
  count = 0;
  private destroy$ = new Subject<void>();
  private previousData: any;

  constructor() {
    console.log('1. Constructor called');
  }

  // Called once after first ngOnChanges
  ngOnInit(): void {
    console.log('2. ngOnInit called');
    
    // Initialize component
    this.setupSubscriptions();
    this.loadInitialData();
  }

  // Called when input properties change
  ngOnChanges(changes: SimpleChanges): void {
    console.log('3. ngOnChanges called', changes);
    
    for (const propName in changes) {
      const change = changes[propName];
      const current = JSON.stringify(change.currentValue);
      const previous = JSON.stringify(change.previousValue);
      
      console.log(\`\${propName}: currentValue = \${current}, previousValue = \${previous}\`);
      
      // React to specific input changes
      if (propName === 'name' && !change.firstChange) {
        this.onNameChange(change.currentValue, change.previousValue);
      }
      
      if (propName === 'data' && !change.firstChange) {
        this.onDataChange(change.currentValue, change.previousValue);
      }
    }
  }

  // Called during every change detection run
  ngDoCheck(): void {
    console.log('4. ngDoCheck called');
    
    // Custom change detection for complex objects
    if (this.data && JSON.stringify(this.data) !== JSON.stringify(this.previousData)) {
      console.log('Data changed detected in ngDoCheck');
      this.onDataChangeDetected();
      this.previousData = { ...this.data };
    }
  }

  // Called once after content projection
  ngAfterContentInit(): void {
    console.log('5. ngAfterContentInit called');
    
    if (this.contentChild) {
      console.log('Content child initialized:', this.contentChild.nativeElement);
    }
  }

  // Called after every content check
  ngAfterContentChecked(): void {
    console.log('6. ngAfterContentChecked called');
  }

  // Called once after view initialization
  ngAfterViewInit(): void {
    console.log('7. ngAfterViewInit called');
    
    // Safe to access view children
    if (this.viewChild) {
      console.log('View child initialized:', this.viewChild.nativeElement);
      this.setupViewChildInteractions();
    }
  }

  // Called after every view check
  ngAfterViewChecked(): void {
    console.log('8. ngAfterViewChecked called');
  }

  // Called once before component destruction
  ngOnDestroy(): void {
    console.log('9. ngOnDestroy called');
    
    // Cleanup subscriptions
    this.destroy$.next();
    this.destroy$.complete();
    
    // Cleanup DOM event listeners
    this.cleanupEventListeners();
    
    // Clear timers/intervals
    this.clearTimers();
  }

  // Private methods
  private setupSubscriptions(): void {
    // Example subscription with cleanup
    this.someService.getData()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        console.log('Data received:', data);
      });
  }

  private loadInitialData(): void {
    // Load initial component data
  }

  private onNameChange(current: string, previous: string): void {
    console.log(\`Name changed from \${previous} to \${current}\`);
  }

  private onDataChange(current: any, previous: any): void {
    console.log('Data input changed:', { current, previous });
  }

  private onDataChangeDetected(): void {
    console.log('Complex data change detected');
  }

  private setupViewChildInteractions(): void {
    // Setup interactions with view children
  }

  private cleanupEventListeners(): void {
    // Remove DOM event listeners
  }

  private clearTimers(): void {
    // Clear any running timers
  }

  increment(): void {
    this.count++;
  }
}`,
    },
    {
      title: "Lifecycle Hook Use Cases",
      code: `// Data Loading Component
@Component({
  selector: 'app-user-profile',
  template: \`
    <div *ngIf="loading">Loading...</div>
    <div *ngIf="user && !loading">
      <h2>{{ user.name }}</h2>
      <p>{{ user.email }}</p>
    </div>
  \`
})
export class UserProfileComponent implements OnInit, OnChanges, OnDestroy {
  @Input() userId!: number;
  
  user: User | null = null;
  loading = false;
  private destroy$ = new Subject<void>();

  ngOnInit() {
    // Initial load if userId is available
    if (this.userId) {
      this.loadUser();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    // Reload when userId changes
    if (changes['userId'] && !changes['userId'].firstChange) {
      this.loadUser();
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadUser() {
    this.loading = true;
    this.userService.getUser(this.userId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: user => {
          this.user = user;
          this.loading = false;
        },
        error: error => {
          console.error('Error loading user:', error);
          this.loading = false;
        }
      });
  }
}

// Form Component with Validation
@Component({
  selector: 'app-dynamic-form',
  template: \`
    <form [formGroup]="form" (ngSubmit)="onSubmit()">
      <div *ngFor="let field of fields">
        <input 
          [formControlName]="field.name"
          [placeholder]="field.placeholder"
          [type]="field.type"
        >
      </div>
      <button type="submit" [disabled]="form.invalid">Submit</button>
    </form>
  \`
})
export class DynamicFormComponent implements OnInit, OnChanges {
  @Input() fields: FormField[] = [];
  @Input() initialData: any = {};
  
  form!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.buildForm();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['fields'] && !changes['fields'].firstChange) {
      this.buildForm();
    }
    
    if (changes['initialData'] && !changes['initialData'].firstChange) {
      this.updateFormValues();
    }
  }

  private buildForm() {
    const group: any = {};
    
    this.fields.forEach(field => {
      const validators = this.getValidators(field);
      const initialValue = this.initialData[field.name] || field.defaultValue || '';
      group[field.name] = [initialValue, validators];
    });
    
    this.form = this.fb.group(group);
  }

  private updateFormValues() {
    if (this.form) {
      this.form.patchValue(this.initialData);
    }
  }

  private getValidators(field: FormField): ValidatorFn[] {
    const validators: ValidatorFn[] = [];
    
    if (field.required) validators.push(Validators.required);
    if (field.minLength) validators.push(Validators.minLength(field.minLength));
    if (field.pattern) validators.push(Validators.pattern(field.pattern));
    
    return validators;
  }

  onSubmit() {
    if (this.form.valid) {
      console.log('Form submitted:', this.form.value);
    }
  }
}

// Chart Component with Resize Handling
@Component({
  selector: 'app-chart',
  template: '<canvas #chartCanvas></canvas>'
})
export class ChartComponent implements OnInit, OnChanges, AfterViewInit, OnDestroy {
  @Input() data: ChartData[] = [];
  @Input() options: ChartOptions = {};
  
  @ViewChild('chartCanvas', { static: true }) canvas!: ElementRef<HTMLCanvasElement>;
  
  private chart: Chart | null = null;
  private resizeObserver: ResizeObserver | null = null;

  ngOnInit() {
    // Initialize chart configuration
  }

  ngAfterViewInit() {
    // Create chart after view is ready
    this.createChart();
    this.setupResizeObserver();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.chart) {
      if (changes['data']) {
        this.updateChartData();
      }
      
      if (changes['options']) {
        this.updateChartOptions();
      }
    }
  }

  ngOnDestroy() {
    if (this.chart) {
      this.chart.destroy();
    }
    
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
  }

  private createChart() {
    const ctx = this.canvas.nativeElement.getContext('2d');
    if (ctx) {
      this.chart = new Chart(ctx, {
        type: 'line',
        data: this.data,
        options: this.options
      });
    }
  }

  private updateChartData() {
    if (this.chart) {
      this.chart.data = this.data;
      this.chart.update();
    }
  }

  private updateChartOptions() {
    if (this.chart) {
      this.chart.options = this.options;
      this.chart.update();
    }
  }

  private setupResizeObserver() {
    if (typeof ResizeObserver !== 'undefined') {
      this.resizeObserver = new ResizeObserver(() => {
        if (this.chart) {
          this.chart.resize();
        }
      });
      
      this.resizeObserver.observe(this.canvas.nativeElement);
    }
  }
}`,
    },
    {
      title: "Advanced Lifecycle Patterns",
      code: `// Base Component with Common Lifecycle Logic
export abstract class BaseComponent implements OnInit, OnDestroy {
  protected destroy$ = new Subject<void>();
  protected loading = false;
  protected error: string | null = null;

  ngOnInit() {
    this.onInit();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    this.onDestroy();
  }

  protected abstract onInit(): void;
  protected onDestroy(): void {}

  protected handleError(error: any, message: string = 'An error occurred') {
    console.error(message, error);
    this.error = message;
    this.loading = false;
  }

  protected startLoading() {
    this.loading = true;
    this.error = null;
  }

  protected stopLoading() {
    this.loading = false;
  }
}

// Component extending base
@Component({
  selector: 'app-product-list',
  template: \`
    <div *ngIf="loading">Loading products...</div>
    <div *ngIf="error" class="error">{{ error }}</div>
    <div *ngFor="let product of products">
      {{ product.name }} - {{ product.price | currency }}
    </div>
  \`
})
export class ProductListComponent extends BaseComponent {
  products: Product[] = [];

  constructor(private productService: ProductService) {
    super();
  }

  protected onInit() {
    this.loadProducts();
  }

  private loadProducts() {
    this.startLoading();
    
    this.productService.getProducts()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: products => {
          this.products = products;
          this.stopLoading();
        },
        error: error => this.handleError(error, 'Failed to load products')
      });
  }
}

// Mixin for Lifecycle Hooks
export function WithLifecycleLogging<T extends Constructor>(Base: T) {
  return class extends Base implements OnInit, OnDestroy {
    ngOnInit() {
      console.log(\`\${this.constructor.name} initialized\`);
      if (super.ngOnInit) {
        super.ngOnInit();
      }
    }

    ngOnDestroy() {
      console.log(\`\${this.constructor.name} destroyed\`);
      if (super.ngOnDestroy) {
        super.ngOnDestroy();
      }
    }
  };
}

// Usage of mixin
@Component({
  selector: 'app-logged-component',
  template: '<p>This component logs its lifecycle</p>'
})
export class LoggedComponent extends WithLifecycleLogging(class {}) {
  // Component logic here
}

// Lifecycle Hook Decorator
export function LogLifecycle(target: any) {
  const originalOnInit = target.prototype.ngOnInit;
  const originalOnDestroy = target.prototype.ngOnDestroy;

  target.prototype.ngOnInit = function() {
    console.log(\`\${target.name} ngOnInit called\`);
    if (originalOnInit) {
      originalOnInit.call(this);
    }
  };

  target.prototype.ngOnDestroy = function() {
    console.log(\`\${target.name} ngOnDestroy called\`);
    if (originalOnDestroy) {
      originalOnDestroy.call(this);
    }
  };

  return target;
}

// Usage of decorator
@LogLifecycle
@Component({
  selector: 'app-decorated-component',
  template: '<p>This component uses lifecycle decorator</p>'
})
export class DecoratedComponent implements OnInit, OnDestroy {
  ngOnInit() {
    console.log('Component specific initialization');
  }

  ngOnDestroy() {
    console.log('Component specific cleanup');
  }
}`,
    },
  ]

  const interviewQuestions = [
    {
      question: "What are Angular lifecycle hooks and in what order do they execute?",
      answer:
        "Lifecycle hooks are methods that Angular calls at specific moments in a component's lifecycle. Order: 1) ngOnChanges, 2) ngOnInit, 3) ngDoCheck, 4) ngAfterContentInit, 5) ngAfterContentChecked, 6) ngAfterViewInit, 7) ngAfterViewChecked, 8) ngOnDestroy. Constructor runs before all hooks.",
    },
    {
      question: "What's the difference between ngOnInit and constructor?",
      answer:
        "Constructor is for dependency injection and basic initialization. ngOnInit is for component initialization after Angular sets input properties. Use constructor for DI, ngOnInit for component logic, API calls, and accessing @Input properties.",
    },
    {
      question: "When would you use ngOnChanges vs ngDoCheck?",
      answer:
        "ngOnChanges detects changes to @Input properties automatically and provides SimpleChanges object. ngDoCheck runs on every change detection cycle and is used for custom change detection logic, especially for complex objects or arrays that Angular can't detect changes in.",
    },
    {
      question: "What's the difference between AfterContentInit and AfterViewInit?",
      answer:
        "AfterContentInit is called after content projection (ng-content) is initialized. AfterViewInit is called after the component's view and child views are initialized. Use AfterContentInit for projected content, AfterViewInit for @ViewChild access.",
    },
    {
      question: "Why is ngOnDestroy important and what should you do in it?",
      answer:
        "ngOnDestroy prevents memory leaks by cleaning up resources before component destruction. You should: unsubscribe from observables, clear timers/intervals, remove DOM event listeners, cleanup third-party libraries, and complete subjects.",
    },
  ]

  return (
    <PageLayout
      title="Lifecycle Hooks"
      description="Master Angular component lifecycle hooks and their proper usage patterns"
      previousPage={{ href: "/intermediate/pipes", title: "Pipes & Custom Pipes" }}
      nextPage={{ href: "/intermediate/component-communication", title: "Component Communication" }}
    >
      <div className="space-y-8">
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Theory Overview</h2>
          <div className="prose prose-gray max-w-none">
            <p>
              Angular lifecycle hooks are methods that Angular calls at specific moments in the lifecycle of a component
              or directive. They provide visibility into key moments and the ability to act when they occur.
            </p>

            <h3>Lifecycle Hook Sequence:</h3>
            <ol>
              <li>
                <strong>Constructor:</strong> Called when Angular creates the component (not a hook)
              </li>
              <li>
                <strong>ngOnChanges:</strong> Called when input properties change
              </li>
              <li>
                <strong>ngOnInit:</strong> Called once after first ngOnChanges
              </li>
              <li>
                <strong>ngDoCheck:</strong> Called during every change detection run
              </li>
              <li>
                <strong>ngAfterContentInit:</strong> Called once after content projection
              </li>
              <li>
                <strong>ngAfterContentChecked:</strong> Called after every content check
              </li>
              <li>
                <strong>ngAfterViewInit:</strong> Called once after view initialization
              </li>
              <li>
                <strong>ngAfterViewChecked:</strong> Called after every view check
              </li>
              <li>
                <strong>ngOnDestroy:</strong> Called once before component destruction
              </li>
            </ol>

            <h3>Common Use Cases:</h3>
            <ul>
              <li>
                <strong>ngOnInit:</strong> Component initialization, API calls, setup subscriptions
              </li>
              <li>
                <strong>ngOnChanges:</strong> React to input property changes
              </li>
              <li>
                <strong>ngAfterViewInit:</strong> Access ViewChild elements, setup third-party libraries
              </li>
              <li>
                <strong>ngOnDestroy:</strong> Cleanup subscriptions, timers, event listeners
              </li>
              <li>
                <strong>ngDoCheck:</strong> Custom change detection for complex objects
              </li>
            </ul>

            <h3>Best Practices:</h3>
            <ul>
              <li>Always implement OnDestroy for cleanup</li>
              <li>Use OnInit for component initialization, not constructor</li>
              <li>Be careful with performance in ngDoCheck</li>
              <li>Access ViewChild only in AfterViewInit or later</li>
              <li>Handle input changes properly in ngOnChanges</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Code Examples</h2>
          <div className="space-y-6">
            {lifecycleExamples.map((example, index) => (
              <CodeExample key={index} title={example.title} code={example.code} language="typescript" />
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Best Practices</h2>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <ul className="space-y-2 text-gray-700">
              <li>• Always implement OnDestroy and cleanup resources</li>
              <li>• Use OnInit for component initialization, not constructor</li>
              <li>• Access ViewChild/ContentChild only after appropriate init hooks</li>
              <li>• Be cautious with performance in ngDoCheck - it runs frequently</li>
              <li>• Handle input changes properly in ngOnChanges with firstChange check</li>
              <li>• Use takeUntil pattern for subscription cleanup</li>
              <li>• Avoid heavy operations in frequently called hooks</li>
              <li>• Consider using OnPush change detection for better performance</li>
            </ul>
          </div>
        </section>

        <InterviewQuestions questions={interviewQuestions} />
      </div>
    </PageLayout>
  )
}
