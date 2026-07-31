import PageLayout from "../../../components/page-layout"
import CodeExample from "../../../components/code-example"
import InterviewQuestions from "../../../components/interview-questions"

export default function DependencyInjectionPage() {
  const diExamples = [
    {
      title: "Basic Dependency Injection",
      code: `// Service to be injected
@Injectable({
  providedIn: 'root'
})
export class LoggerService {
  log(message: string): void {
    console.log(\`[LOG]: \${message}\`);
  }

  error(message: string): void {
    console.error(\`[ERROR]: \${message}\`);
  }
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  constructor(private http: HttpClient) {}

  getData(): Observable<any[]> {
    return this.http.get<any[]>('/api/data');
  }

  postData(data: any): Observable<any> {
    return this.http.post<any>('/api/data', data);
  }
}

// Service with dependencies
@Injectable({
  providedIn: 'root'
})
export class DataService {
  constructor(
    private apiService: ApiService,
    private logger: LoggerService
  ) {
    this.logger.log('DataService initialized');
  }

  async loadData(): Promise<any[]> {
    try {
      this.logger.log('Loading data...');
      const data = await this.apiService.getData().toPromise();
      this.logger.log(\`Loaded \${data.length} items\`);
      return data;
    } catch (error) {
      this.logger.error(\`Failed to load data: \${error.message}\`);
      throw error;
    }
  }

  async saveData(item: any): Promise<any> {
    try {
      this.logger.log('Saving data...');
      const result = await this.apiService.postData(item).toPromise();
      this.logger.log('Data saved successfully');
      return result;
    } catch (error) {
      this.logger.error(\`Failed to save data: \${error.message}\`);
      throw error;
    }
  }
}

// Component with dependency injection
@Component({
  selector: 'app-data-list',
  template: \`
    <div class="data-list">
      <h3>Data List</h3>
      <div *ngIf="loading" class="loading">Loading...</div>
      <div *ngIf="error" class="error">{{ error }}</div>
      
      <div class="items">
        <div *ngFor="let item of items" class="item">
          {{ item.name }} - {{ item.value }}
        </div>
      </div>
      
      <button (click)="loadData()" [disabled]="loading">Refresh</button>
      <button (click)="addItem()" [disabled]="loading">Add Item</button>
    </div>
  \`
})
export class DataListComponent implements OnInit {
  items: any[] = [];
  loading = false;
  error: string | null = null;

  constructor(
    private dataService: DataService,
    private logger: LoggerService
  ) {
    this.logger.log('DataListComponent created');
  }

  ngOnInit() {
    this.loadData();
  }

  async loadData() {
    this.loading = true;
    this.error = null;
    
    try {
      this.items = await this.dataService.loadData();
    } catch (error) {
      this.error = error.message;
    } finally {
      this.loading = false;
    }
  }

  async addItem() {
    const newItem = {
      name: \`Item \${Date.now()}\`,
      value: Math.floor(Math.random() * 100)
    };

    try {
      await this.dataService.saveData(newItem);
      await this.loadData(); // Refresh list
    } catch (error) {
      this.error = error.message;
    }
  }
}`,
    },
    {
      title: "Advanced DI Patterns - Injection Tokens and Factories",
      code: `// Injection Tokens for configuration
export const API_CONFIG = new InjectionToken<ApiConfig>('api.config');
export const FEATURE_FLAGS = new InjectionToken<FeatureFlags>('feature.flags');

// Configuration interfaces
interface ApiConfig {
  baseUrl: string;
  timeout: number;
  retries: number;
}

interface FeatureFlags {
  enableNewFeature: boolean;
  enableBetaFeatures: boolean;
}

// Factory function for creating services
export function createApiService(
  http: HttpClient,
  config: ApiConfig,
  logger: LoggerService
): ApiService {
  logger.log(\`Creating ApiService with baseUrl: \${config.baseUrl}\`);
  return new ApiService(http, config);
}

// Enhanced ApiService with configuration
@Injectable()
export class ApiService {
  constructor(
    private http: HttpClient,
    @Inject(API_CONFIG) private config: ApiConfig,
    private logger: LoggerService
  ) {
    this.logger.log('ApiService initialized with config');
  }

  getData(): Observable<any[]> {
    const url = \`\${this.config.baseUrl}/data\`;
    return this.http.get<any[]>(url, {
      timeout: this.config.timeout
    }).pipe(
      retry(this.config.retries),
      catchError(error => {
        this.logger.error(\`API call failed: \${error.message}\`);
        return throwError(error);
      })
    );
  }
}

// Service with optional dependencies
@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  constructor(
    @Optional() @Inject(FEATURE_FLAGS) private featureFlags: FeatureFlags,
    private logger: LoggerService
  ) {
    if (this.featureFlags) {
      this.logger.log('NotificationService initialized with feature flags');
    } else {
      this.logger.log('NotificationService initialized without feature flags');
    }
  }

  showNotification(message: string): void {
    if (this.featureFlags?.enableNewFeature) {
      // Use new notification system
      this.showEnhancedNotification(message);
    } else {
      // Use basic notification
      this.showBasicNotification(message);
    }
  }

  private showEnhancedNotification(message: string): void {
    this.logger.log(\`Enhanced notification: \${message}\`);
    // Enhanced notification logic
  }

  private showBasicNotification(message: string): void {
    this.logger.log(\`Basic notification: \${message}\`);
    // Basic notification logic
  }
}

// Multi-provider pattern
export const VALIDATORS = new InjectionToken<Validator[]>('validators');

interface Validator {
  validate(value: any): boolean;
  errorMessage: string;
}

@Injectable()
export class EmailValidator implements Validator {
  errorMessage = 'Invalid email format';

  validate(value: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  }
}

@Injectable()
export class RequiredValidator implements Validator {
  errorMessage = 'This field is required';

  validate(value: any): boolean {
    return value != null && value !== '';
  }
}

// Validation service using multi-providers
@Injectable({
  providedIn: 'root'
})
export class ValidationService {
  constructor(
    @Inject(VALIDATORS) private validators: Validator[]
  ) {}

  validateField(value: any): ValidationResult {
    const errors: string[] = [];

    for (const validator of this.validators) {
      if (!validator.validate(value)) {
        errors.push(validator.errorMessage);
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

// Module configuration with providers
@NgModule({
  declarations: [
    DataListComponent,
    ValidationFormComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule
  ],
  providers: [
    // Basic provider
    LoggerService,
    
    // Factory provider
    {
      provide: ApiService,
      useFactory: createApiService,
      deps: [HttpClient, API_CONFIG, LoggerService]
    },
    
    // Value providers
    {
      provide: API_CONFIG,
      useValue: {
        baseUrl: 'https://api.example.com',
        timeout: 5000,
        retries: 3
      }
    },
    {
      provide: FEATURE_FLAGS,
      useValue: {
        enableNewFeature: true,
        enableBetaFeatures: false
      }
    },
    
    // Multi-providers
    {
      provide: VALIDATORS,
      useClass: EmailValidator,
      multi: true
    },
    {
      provide: VALIDATORS,
      useClass: RequiredValidator,
      multi: true
    },
    
    // Class provider with different implementation
    {
      provide: NotificationService,
      useClass: EnhancedNotificationService
    },
    
    // Existing provider
    {
      provide: DataService,
      useExisting: CachedDataService
    }
  ]
})
export class DataModule { }

// Alternative implementations
@Injectable()
export class EnhancedNotificationService extends NotificationService {
  constructor(
    @Optional() @Inject(FEATURE_FLAGS) featureFlags: FeatureFlags,
    logger: LoggerService
  ) {
    super(featureFlags, logger);
  }

  showNotification(message: string): void {
    // Enhanced implementation
    super.showNotification(message);
    this.addToNotificationHistory(message);
  }

  private addToNotificationHistory(message: string): void {
    // Add to history
  }
}

@Injectable()
export class CachedDataService extends DataService {
  private cache = new Map<string, any>();

  constructor(
    apiService: ApiService,
    logger: LoggerService
  ) {
    super(apiService, logger);
  }

  async loadData(): Promise<any[]> {
    const cacheKey = 'data-list';
    
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    const data = await super.loadData();
    this.cache.set(cacheKey, data);
    return data;
  }
}

interface ValidationResult {
  isValid: boolean;
  errors: string[];
}`,
    },
    {
      title: "Hierarchical Dependency Injection",
      code: `// Parent component with providers
@Component({
  selector: 'app-parent',
  template: \`
    <div class="parent">
      <h2>Parent Component</h2>
      <p>Parent ID: {{ parentId }}</p>
      
      <app-child></app-child>
      <app-child></app-child>
    </div>
  \`,
  providers: [
    // Component-level provider - new instance for this component and children
    {
      provide: 'COMPONENT_ID',
      useValue: 'parent-123'
    },
    {
      provide: ComponentScopedService,
      useClass: ComponentScopedService
    }
  ]
})
export class ParentComponent implements OnInit {
  parentId: string;

  constructor(
    @Inject('COMPONENT_ID') componentId: string,
    private scopedService: ComponentScopedService,
    private globalService: GlobalService // From root injector
  ) {
    this.parentId = componentId;
  }

  ngOnInit() {
    this.scopedService.log('Parent component initialized');
    this.globalService.log('Parent using global service');
  }
}

// Child component - inherits parent providers
@Component({
  selector: 'app-child',
  template: \`
    <div class="child">
      <h3>Child Component</h3>
      <p>Component ID: {{ componentId }}</p>
      <p>Service Instance ID: {{ serviceInstanceId }}</p>
      <button (click)="incrementCounter()">Increment: {{ counter }}</button>
    </div>
  \`
})
export class ChildComponent implements OnInit {
  componentId: string;
  serviceInstanceId: string;
  counter = 0;

  constructor(
    @Inject('COMPONENT_ID') componentId: string,
    private scopedService: ComponentScopedService,
    private globalService: GlobalService
  ) {
    this.componentId = componentId;
    this.serviceInstanceId = this.scopedService.instanceId;
  }

  ngOnInit() {
    this.scopedService.log('Child component initialized');
    this.counter = this.scopedService.getCounter();
  }

  incrementCounter() {
    this.counter = this.scopedService.incrementCounter();
  }
}

// Component-scoped service
@Injectable()
export class ComponentScopedService {
  public readonly instanceId: string;
  private counter = 0;

  constructor() {
    this.instanceId = Math.random().toString(36).substr(2, 9);
    console.log(\`ComponentScopedService instance created: \${this.instanceId}\`);
  }

  log(message: string): void {
    console.log(\`[\${this.instanceId}] \${message}\`);
  }

  incrementCounter(): number {
    return ++this.counter;
  }

  getCounter(): number {
    return this.counter;
  }
}

// Global service (singleton)
@Injectable({
  providedIn: 'root'
})
export class GlobalService {
  private static instanceCount = 0;
  public readonly instanceId: string;

  constructor() {
    GlobalService.instanceCount++;
    this.instanceId = \`global-\${GlobalService.instanceCount}\`;
    console.log(\`GlobalService instance created: \${this.instanceId}\`);
  }

  log(message: string): void {
    console.log(\`[GLOBAL-\${this.instanceId}] \${message}\`);
  }
}

// Service with self-injection (circular dependency resolution)
@Injectable({
  providedIn: 'root'
})
export class SelfInjectingService {
  constructor(
    @Optional() @SkipSelf() private parentInstance: SelfInjectingService
  ) {
    if (this.parentInstance) {
      console.log('Child instance created with parent reference');
    } else {
      console.log('Root instance created');
    }
  }

  getDepth(): number {
    return this.parentInstance ? this.parentInstance.getDepth() + 1 : 0;
  }
}

// Host directive injection
@Directive({
  selector: '[appHighlight]',
  providers: [
    {
      provide: 'HIGHLIGHT_COLOR',
      useValue: 'yellow'
    }
  ]
})
export class HighlightDirective implements OnInit {
  constructor(
    private el: ElementRef,
    @Inject('HIGHLIGHT_COLOR') private color: string
  ) {}

  ngOnInit() {
    this.el.nativeElement.style.backgroundColor = this.color;
  }
}

// Component using host directive
@Component({
  selector: 'app-highlighted-text',
  template: \`
    <div appHighlight>
      <p>This text is highlighted</p>
      <p>Color: {{ highlightColor }}</p>
    </div>
  \`
})
export class HighlightedTextComponent {
  highlightColor: string;

  constructor(
    @Optional() @Host() @Inject('HIGHLIGHT_COLOR') color: string
  ) {
    this.highlightColor = color || 'default';
  }
}

// ViewProviders vs Providers
@Component({
  selector: 'app-view-provider-demo',
  template: \`
    <div class="demo">
      <h3>View Provider Demo</h3>
      <ng-content></ng-content>
    </div>
  \`,
  providers: [
    // Available to component and projected content
    {
      provide: 'PROVIDER_SERVICE',
      useValue: 'Available to all'
    }
  ],
  viewProviders: [
    // Only available to component's view (not projected content)
    {
      provide: 'VIEW_PROVIDER_SERVICE',
      useValue: 'Only in view'
    }
  ]
})
export class ViewProviderDemoComponent {
  constructor(
    @Inject('PROVIDER_SERVICE') private providerService: string,
    @Inject('VIEW_PROVIDER_SERVICE') private viewProviderService: string
  ) {
    console.log('Provider service:', this.providerService);
    console.log('View provider service:', this.viewProviderService);
  }
}

// Projected content component
@Component({
  selector: 'app-projected-content',
  template: \`
    <p>Projected content</p>
    <p>Provider service: {{ providerService }}</p>
    <p>View provider service: {{ viewProviderService || 'Not available' }}</p>
  \`
})
export class ProjectedContentComponent {
  providerService: string;
  viewProviderService: string;

  constructor(
    @Inject('PROVIDER_SERVICE') providerService: string,
    @Optional() @Inject('VIEW_PROVIDER_SERVICE') viewProviderService: string
  ) {
    this.providerService = providerService;
    this.viewProviderService = viewProviderService;
  }
}`,
    },
  ]

  const interviewQuestions = [
    {
      question: "What is Dependency Injection and how does Angular implement it?",
      answer:
        "Dependency Injection is a design pattern where dependencies are provided to a class rather than the class creating them itself. Angular implements DI through its injector system, using decorators like @Injectable, constructor injection, and a hierarchical injector tree. This promotes loose coupling, testability, and maintainability.",
    },
    {
      question: "Explain the difference between providedIn: 'root' and module providers.",
      answer:
        "'providedIn: root' creates tree-shakable singletons available app-wide and are only included in the bundle if used. Module providers create instances scoped to that module and its children, always included in the bundle. Root providers are preferred for global services, module providers for feature-specific services.",
    },
    {
      question: "What are Injection Tokens and when would you use them?",
      answer:
        "Injection Tokens are unique identifiers for dependencies that aren't classes (primitives, objects, functions). Use them for configuration objects, feature flags, or when you need multiple implementations of the same interface. They prevent naming conflicts and provide type safety for non-class dependencies.",
    },
    {
      question: "How does Angular's hierarchical dependency injection work?",
      answer:
        "Angular creates a tree of injectors mirroring the component tree. When a dependency is requested, Angular searches up the injector tree until it finds a provider. This enables component-scoped services, service isolation, and different implementations at different levels of the application.",
    },
    {
      question: "What's the difference between @Optional, @Self, @SkipSelf, and @Host decorators?",
      answer:
        "@Optional: Makes dependency optional, returns null if not found. @Self: Only looks in current injector. @SkipSelf: Skips current injector, looks in parent. @Host: Stops search at host component. These decorators control where Angular searches for dependencies in the injector hierarchy.",
    },
    {
      question: "How do you create and use factory providers in Angular?",
      answer:
        "Factory providers use useFactory with a function that returns the service instance. Specify dependencies in deps array. Useful for conditional service creation, complex initialization, or when you need to call a function to create the service. Example: { provide: Service, useFactory: createService, deps: [Dependency] }.",
    },
    {
      question: "What are multi-providers and when would you use them?",
      answer:
        "Multi-providers allow multiple values for the same token, returned as an array. Set multi: true in provider config. Use for plugin systems, validators, interceptors, or when you need to collect multiple implementations. Angular's HTTP_INTERCEPTORS is a common example of multi-providers.",
    },
    {
      question: "How do you test components with dependency injection?",
      answer:
        "Use TestBed.configureTestingModule() to configure test module with mock providers, use spyOn() for method mocking, provide test doubles using useValue or useClass, use TestBed.inject() to get service instances, and override providers with TestBed.overrideProvider() for specific test scenarios.",
    },
  ]

  return (
    <PageLayout
      title="Dependency Injection Pattern"
      description="Master Angular's dependency injection system for building loosely coupled, testable applications"
    >
      <div className="space-y-8">
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-cyan-400">Overview</h2>
          <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700">
            <p className="text-slate-300 leading-relaxed mb-4">
              Dependency Injection is a core design pattern in Angular that promotes loose coupling by providing
              dependencies to classes rather than having them create dependencies themselves. Angular's DI system is
              hierarchical, type-safe, and supports various provider configurations for different use cases.
            </p>
            <div className="grid md:grid-cols-2 gap-4 mt-6">
              <div className="bg-slate-900/50 p-4 rounded border border-slate-600">
                <h3 className="font-semibold text-pink-400 mb-2">DI Benefits</h3>
                <ul className="text-sm text-slate-300 space-y-1">
                  <li>• Loose coupling</li>
                  <li>• Testability</li>
                  <li>• Maintainability</li>
                  <li>• Flexibility</li>
                  <li>• Reusability</li>
                  <li>• Configuration management</li>
                </ul>
              </div>
              <div className="bg-slate-900/50 p-4 rounded border border-slate-600">
                <h3 className="font-semibold text-pink-400 mb-2">Provider Types</h3>
                <ul className="text-sm text-slate-300 space-y-1">
                  <li>• Class providers</li>
                  <li>• Value providers</li>
                  <li>• Factory providers</li>
                  <li>• Existing providers</li>
                  <li>• Multi-providers</li>
                  <li>• Injection tokens</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-cyan-400">Code Examples</h2>
          <div className="space-y-6">
            {diExamples.map((example, index) => (
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
