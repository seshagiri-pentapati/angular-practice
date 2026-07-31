import PageLayout from "../../../components/page-layout"
import CodeExample from "../../../components/code-example"
import InterviewQuestions from "../../../components/interview-questions"

export default function FactoryPage() {
  const factoryExamples = [
    {
      title: "Component Factory Pattern",
      code: `// Dynamic Component Creation using Factory
import { 
  ComponentFactory, 
  ComponentFactoryResolver, 
  ComponentRef, 
  ViewContainerRef,
  Type
} from '@angular/core';

// Base component interface
export interface DynamicComponent {
  data: any;
}

// Different component implementations
@Component({
  selector: 'app-chart-widget',
  template: \`
    <div class="chart-widget">
      <h3>{{ data.title }}</h3>
      <div class="chart">Chart: {{ data.chartType }}</div>
    </div>
  \`
})
export class ChartWidgetComponent implements DynamicComponent {
  @Input() data: any;
}

@Component({
  selector: 'app-table-widget',
  template: \`
    <div class="table-widget">
      <h3>{{ data.title }}</h3>
      <table>
        <tr *ngFor="let row of data.rows">
          <td *ngFor="let cell of row">{{ cell }}</td>
        </tr>
      </table>
    </div>
  \`
})
export class TableWidgetComponent implements DynamicComponent {
  @Input() data: any;
}

@Component({
  selector: 'app-text-widget',
  template: \`
    <div class="text-widget">
      <h3>{{ data.title }}</h3>
      <p>{{ data.content }}</p>
    </div>
  \`
})
export class TextWidgetComponent implements DynamicComponent {
  @Input() data: any;
}

// Widget factory service
@Injectable({
  providedIn: 'root'
})
export class WidgetFactory {
  private componentMap = new Map<string, Type<DynamicComponent>>([
    ['chart', ChartWidgetComponent],
    ['table', TableWidgetComponent],
    ['text', TextWidgetComponent]
  ]);

  constructor(private componentFactoryResolver: ComponentFactoryResolver) {}

  createWidget(
    type: string, 
    viewContainer: ViewContainerRef, 
    data: any
  ): ComponentRef<DynamicComponent> | null {
    const componentType = this.componentMap.get(type);
    
    if (!componentType) {
      console.error(\`Unknown widget type: \${type}\`);
      return null;
    }

    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(componentType);
    const componentRef = viewContainer.createComponent(componentFactory);
    
    // Set input data
    componentRef.instance.data = data;
    
    return componentRef;
  }

  getAvailableTypes(): string[] {
    return Array.from(this.componentMap.keys());
  }

  registerWidget(type: string, component: Type<DynamicComponent>): void {
    this.componentMap.set(type, component);
  }
}

// Dashboard component using the factory
@Component({
  selector: 'app-dashboard',
  template: \`
    <div class="dashboard">
      <h2>Dynamic Dashboard</h2>
      
      <div class="controls">
        <select [(ngModel)]="selectedType">
          <option *ngFor="let type of availableTypes" [value]="type">
            {{ type | titlecase }}
          </option>
        </select>
        <button (click)="addWidget()">Add Widget</button>
        <button (click)="clearWidgets()">Clear All</button>
      </div>
      
      <div class="widgets" #widgetContainer></div>
    </div>
  \`
})
export class DashboardComponent implements OnInit {
  @ViewChild('widgetContainer', { read: ViewContainerRef }) 
  widgetContainer!: ViewContainerRef;

  selectedType = 'chart';
  availableTypes: string[] = [];
  widgetRefs: ComponentRef<DynamicComponent>[] = [];

  constructor(private widgetFactory: WidgetFactory) {}

  ngOnInit() {
    this.availableTypes = this.widgetFactory.getAvailableTypes();
  }

  addWidget() {
    const data = this.generateSampleData(this.selectedType);
    const widgetRef = this.widgetFactory.createWidget(
      this.selectedType, 
      this.widgetContainer, 
      data
    );

    if (widgetRef) {
      this.widgetRefs.push(widgetRef);
    }
  }

  clearWidgets() {
    this.widgetRefs.forEach(ref => ref.destroy());
    this.widgetRefs = [];
    this.widgetContainer.clear();
  }

  private generateSampleData(type: string): any {
    switch (type) {
      case 'chart':
        return {
          title: 'Sales Chart',
          chartType: 'bar',
          data: [10, 20, 30, 40]
        };
      case 'table':
        return {
          title: 'User Data',
          rows: [
            ['John', 'Doe', 'john@example.com'],
            ['Jane', 'Smith', 'jane@example.com']
          ]
        };
      case 'text':
        return {
          title: 'Welcome Message',
          content: 'Welcome to our dynamic dashboard!'
        };
      default:
        return {};
    }
  }
}`,
    },
    {
      title: "Service Factory Pattern",
      code: `// Abstract service interface
export interface PaymentProcessor {
  processPayment(amount: number, currency: string): Observable<PaymentResult>;
  validatePayment(paymentData: any): boolean;
  getProcessorName(): string;
}

// Concrete implementations
@Injectable()
export class StripePaymentProcessor implements PaymentProcessor {
  constructor(private http: HttpClient) {}

  processPayment(amount: number, currency: string): Observable<PaymentResult> {
    return this.http.post<PaymentResult>('/api/stripe/charge', {
      amount,
      currency
    });
  }

  validatePayment(paymentData: any): boolean {
    return paymentData.stripeToken && paymentData.amount > 0;
  }

  getProcessorName(): string {
    return 'Stripe';
  }
}

@Injectable()
export class PayPalPaymentProcessor implements PaymentProcessor {
  constructor(private http: HttpClient) {}

  processPayment(amount: number, currency: string): Observable<PaymentResult> {
    return this.http.post<PaymentResult>('/api/paypal/payment', {
      amount,
      currency
    });
  }

  validatePayment(paymentData: any): boolean {
    return paymentData.paypalToken && paymentData.amount > 0;
  }

  getProcessorName(): string {
    return 'PayPal';
  }
}

@Injectable()
export class CryptoPaymentProcessor implements PaymentProcessor {
  constructor(private http: HttpClient) {}

  processPayment(amount: number, currency: string): Observable<PaymentResult> {
    return this.http.post<PaymentResult>('/api/crypto/payment', {
      amount,
      currency
    });
  }

  validatePayment(paymentData: any): boolean {
    return paymentData.walletAddress && paymentData.amount > 0;
  }

  getProcessorName(): string {
    return 'Cryptocurrency';
  }
}

// Payment processor factory
@Injectable({
  providedIn: 'root'
})
export class PaymentProcessorFactory {
  private processors = new Map<string, () => PaymentProcessor>();

  constructor(
    private injector: Injector,
    private http: HttpClient
  ) {
    this.registerProcessors();
  }

  private registerProcessors(): void {
    this.processors.set('stripe', () => 
      new StripePaymentProcessor(this.http)
    );
    this.processors.set('paypal', () => 
      new PayPalPaymentProcessor(this.http)
    );
    this.processors.set('crypto', () => 
      new CryptoPaymentProcessor(this.http)
    );
  }

  createProcessor(type: string): PaymentProcessor {
    const processorFactory = this.processors.get(type.toLowerCase());
    
    if (!processorFactory) {
      throw new Error(\`Unknown payment processor type: \${type}\`);
    }

    return processorFactory();
  }

  getAvailableProcessors(): string[] {
    return Array.from(this.processors.keys());
  }

  registerProcessor(type: string, factory: () => PaymentProcessor): void {
    this.processors.set(type.toLowerCase(), factory);
  }
}

// Payment service using the factory
@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  constructor(
    private paymentFactory: PaymentProcessorFactory,
    private logger: LoggerService
  ) {}

  async processPayment(
    type: string, 
    amount: number, 
    currency: string, 
    paymentData: any
  ): Promise<PaymentResult> {
    try {
      const processor = this.paymentFactory.createProcessor(type);
      
      this.logger.log(\`Processing payment with \${processor.getProcessorName()}\`);
      
      if (!processor.validatePayment(paymentData)) {
        throw new Error('Invalid payment data');
      }

      const result = await processor.processPayment(amount, currency).toPromise();
      
      this.logger.log(\`Payment processed successfully: \${result.transactionId}\`);
      
      return result;
    } catch (error) {
      this.logger.error(\`Payment processing failed: \${error.message}\`);
      throw error;
    }
  }

  getAvailablePaymentMethods(): string[] {
    return this.paymentFactory.getAvailableProcessors();
  }
}

// HTTP Client Factory
export interface HttpClientConfig {
  baseUrl: string;
  timeout: number;
  retries: number;
  headers?: { [key: string]: string };
}

@Injectable({
  providedIn: 'root'
})
export class HttpClientFactory {
  constructor(private http: HttpClient) {}

  createClient(config: HttpClientConfig): HttpClient {
    // Create interceptor for base URL
    const baseUrlInterceptor: HttpInterceptor = {
      intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const apiReq = req.clone({
          url: \`\${config.baseUrl}\${req.url}\`,
          setHeaders: config.headers || {}
        });
        return next.handle(apiReq).pipe(
          timeout(config.timeout),
          retry(config.retries)
        );
      }
    };

    // Return configured HTTP client
    return this.http; // In real implementation, you'd create a new client with interceptors
  }

  createApiClient(apiName: string): HttpClient {
    const configs: { [key: string]: HttpClientConfig } = {
      users: {
        baseUrl: 'https://api.users.com',
        timeout: 5000,
        retries: 3,
        headers: { 'API-Version': 'v1' }
      },
      payments: {
        baseUrl: 'https://api.payments.com',
        timeout: 10000,
        retries: 2,
        headers: { 'API-Version': 'v2' }
      },
      analytics: {
        baseUrl: 'https://api.analytics.com',
        timeout: 15000,
        retries: 1,
        headers: { 'API-Version': 'v3' }
      }
    };

    const config = configs[apiName];
    if (!config) {
      throw new Error(\`Unknown API configuration: \${apiName}\`);
    }

    return this.createClient(config);
  }
}

// Usage in component
@Component({
  selector: 'app-payment',
  template: \`
    <div class="payment">
      <h3>Payment Processing</h3>
      
      <form [formGroup]="paymentForm" (ngSubmit)="processPayment()">
        <div class="form-group">
          <label>Payment Method:</label>
          <select formControlName="paymentMethod">
            <option *ngFor="let method of paymentMethods" [value]="method">
              {{ method | titlecase }}
            </option>
          </select>
        </div>
        
        <div class="form-group">
          <label>Amount:</label>
          <input type="number" formControlName="amount" min="1">
        </div>
        
        <div class="form-group">
          <label>Currency:</label>
          <select formControlName="currency">
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
            <option value="GBP">GBP</option>
          </select>
        </div>
        
        <button type="submit" [disabled]="paymentForm.invalid || processing">
          {{ processing ? 'Processing...' : 'Pay Now' }}
        </button>
      </form>
      
      <div *ngIf="result" class="result">
        <h4>Payment Result:</h4>
        <p>Status: {{ result.status }}</p>
        <p>Transaction ID: {{ result.transactionId }}</p>
      </div>
    </div>
  \`
})
export class PaymentComponent implements OnInit {
  paymentForm: FormGroup;
  paymentMethods: string[] = [];
  processing = false;
  result: PaymentResult | null = null;

  constructor(
    private fb: FormBuilder,
    private paymentService: PaymentService
  ) {
    this.paymentForm = this.fb.group({
      paymentMethod: ['stripe', Validators.required],
      amount: [100, [Validators.required, Validators.min(1)]],
      currency: ['USD', Validators.required]
    });
  }

  ngOnInit() {
    this.paymentMethods = this.paymentService.getAvailablePaymentMethods();
  }

  async processPayment() {
    if (this.paymentForm.valid) {
      this.processing = true;
      
      try {
        const formValue = this.paymentForm.value;
        const paymentData = this.generatePaymentData(formValue.paymentMethod);
        
        this.result = await this.paymentService.processPayment(
          formValue.paymentMethod,
          formValue.amount,
          formValue.currency,
          paymentData
        );
      } catch (error) {
        console.error('Payment failed:', error);
        this.result = {
          status: 'failed',
          transactionId: '',
          error: error.message
        };
      } finally {
        this.processing = false;
      }
    }
  }

  private generatePaymentData(method: string): any {
    // Generate mock payment data based on method
    switch (method) {
      case 'stripe':
        return { stripeToken: 'tok_123456', amount: this.paymentForm.value.amount };
      case 'paypal':
        return { paypalToken: 'pp_123456', amount: this.paymentForm.value.amount };
      case 'crypto':
        return { walletAddress: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa', amount: this.paymentForm.value.amount };
      default:
        return {};
    }
  }
}

// Types
interface PaymentResult {
  status: string;
  transactionId: string;
  error?: string;
}`,
    },
  ]

  const interviewQuestions = [
    {
      question: "What is the Factory pattern and how is it used in Angular?",
      answer:
        "The Factory pattern creates objects without specifying their exact classes. In Angular, it's used for dynamic component creation with ComponentFactoryResolver, service factories with useFactory providers, and creating different implementations based on runtime conditions. It promotes loose coupling and flexibility in object creation.",
    },
    {
      question: "How do you create dynamic components using Angular's factory pattern?",
      answer:
        "Use ComponentFactoryResolver to get a ComponentFactory, then call createComponent() on a ViewContainerRef. The factory resolves the component type and creates instances dynamically. This is useful for dynamic content, plugin systems, or runtime component selection based on data or user preferences.",
    },
    {
      question: "What's the difference between Abstract Factory and Factory Method patterns in Angular?",
      answer:
        "Factory Method creates objects of a single type through a method, while Abstract Factory creates families of related objects. In Angular, Factory Method might create different HTTP clients, while Abstract Factory could create entire sets of related services (payment processor, validator, logger) for different environments.",
    },
    {
      question: "How do you implement a service factory with dependency injection?",
      answer:
        "Use useFactory provider with a factory function that returns the service instance. Specify dependencies in the deps array. The factory function receives injected dependencies as parameters and can create different service implementations based on configuration, environment, or runtime conditions.",
    },
    {
      question: "When should you use the Factory pattern in Angular applications?",
      answer:
        "Use Factory pattern when: you need to create objects dynamically based on runtime data, you have multiple implementations of an interface, you need to encapsulate complex object creation logic, you want to decouple object creation from usage, or you're building plugin systems or configurable components.",
    },
    {
      question: "How do you register and manage multiple factory implementations?",
      answer:
        "Use a Map or registry to store factory functions keyed by type/name. Provide registration methods to add new factories dynamically. Use dependency injection to provide the registry as a service. This allows runtime registration of new implementations and easy extension of functionality.",
    },
    {
      question: "What are the benefits and drawbacks of using Factory pattern in Angular?",
      answer:
        "Benefits: flexibility in object creation, loose coupling, easy testing with mocks, support for different implementations, encapsulated creation logic. Drawbacks: increased complexity, potential performance overhead, harder to track object creation, may lead to over-engineering for simple cases.",
    },
    {
      question: "How do you test components that use factory-created objects?",
      answer:
        "Mock the factory service to return test doubles, use spyOn to control factory behavior, provide mock implementations in TestBed configuration, test both the factory logic and the components that use it separately, and use dependency injection to replace factories with test versions.",
    },
  ]

  return (
    <PageLayout
      title="Factory Pattern"
      description="Master the Factory pattern in Angular for flexible object creation and dynamic component instantiation"
    >
      <div className="space-y-8">
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-cyan-400">Overview</h2>
          <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700">
            <p className="text-slate-300 leading-relaxed mb-4">
              The Factory pattern provides an interface for creating objects without specifying their exact classes. In
              Angular, this pattern is extensively used for dynamic component creation, service instantiation, and
              building flexible, configurable systems that can adapt to different runtime conditions.
            </p>
            <div className="grid md:grid-cols-2 gap-4 mt-6">
              <div className="bg-slate-900/50 p-4 rounded border border-slate-600">
                <h3 className="font-semibold text-pink-400 mb-2">Factory Types</h3>
                <ul className="text-sm text-slate-300 space-y-1">
                  <li>• Component Factory</li>
                  <li>• Service Factory</li>
                  <li>• Abstract Factory</li>
                  <li>• Factory Method</li>
                  <li>• Builder Factory</li>
                  <li>• Registry Factory</li>
                </ul>
              </div>
              <div className="bg-slate-900/50 p-4 rounded border border-slate-600">
                <h3 className="font-semibold text-pink-400 mb-2">Angular Use Cases</h3>
                <ul className="text-sm text-slate-300 space-y-1">
                  <li>• Dynamic components</li>
                  <li>• Plugin systems</li>
                  <li>• Service selection</li>
                  <li>• Configuration-based creation</li>
                  <li>• Runtime implementations</li>
                  <li>• Testing with mocks</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-cyan-400">Code Examples</h2>
          <div className="space-y-6">
            {factoryExamples.map((example, index) => (
              <CodeExample key={index} title={example.title} code={example.code} language="typescript" />
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-cyan-400">Interview Questions</h2>
          <InterviewQuestions questions={interviewQuestions} />
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-cyan-400">Best Practices</h2>
          <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-pink-400 mb-3">Do's</h3>
                <ul className="text-slate-300 space-y-2">
                  <li>• Use factories for complex object creation</li>
                  <li>• Register factories in dependency injection</li>
                  <li>• Implement proper error handling</li>
                  <li>• Use TypeScript interfaces for type safety</li>
                  <li>• Cache factory instances when appropriate</li>
                  <li>• Document factory registration process</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-pink-400 mb-3">Don'ts</h3>
                <ul className="text-slate-300 space-y-2">
                  <li>• Don't overuse factories for simple objects</li>
                  <li>• Don't create circular dependencies</li>
                  <li>• Don't ignore memory management</li>
                  <li>• Don't hardcode factory implementations</li>
                  <li>• Don't skip validation in factories</li>
                  <li>• Don't forget to handle edge cases</li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </div>
    </PageLayout>
  )
}
