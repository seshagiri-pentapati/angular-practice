import { PageLayout } from "@/components/page-layout"
import { CodeExample } from "@/components/code-example"
import { InterviewQuestions } from "@/components/interview-questions"

export default function DynamicComponentsPage() {
  const dynamicExamples = [
    {
      title: "Dynamic Component Creation with ViewContainerRef",
      code: `// Dynamic Component Host Directive
@Directive({
  selector: '[appDynamicHost]'
})
export class DynamicHostDirective {
  constructor(public viewContainerRef: ViewContainerRef) {}
}

// Dynamic Components
@Component({
  selector: 'app-alert',
  template: \`
    <div class="alert alert-{{ type }}">
      <h4>{{ title }}</h4>
      <p>{{ message }}</p>
      <button (click)="onClose()">Close</button>
    </div>
  \`
})
export class AlertComponent implements OnInit {
  @Input() title = '';
  @Input() message = '';
  @Input() type: 'success' | 'error' | 'warning' | 'info' = 'info';
  @Output() close = new EventEmitter<void>();

  ngOnInit() {
    console.log('Alert component initialized:', this.title);
  }

  onClose() {
    this.close.emit();
  }
}

@Component({
  selector: 'app-modal',
  template: \`
    <div class="modal-overlay" (click)="onOverlayClick()">
      <div class="modal-content" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h3>{{ title }}</h3>
          <button (click)="onClose()">&times;</button>
        </div>
        <div class="modal-body">
          <ng-content></ng-content>
          <p *ngIf="content">{{ content }}</p>
        </div>
        <div class="modal-footer">
          <button (click)="onClose()">Close</button>
          <button (click)="onConfirm()" *ngIf="showConfirm">Confirm</button>
        </div>
      </div>
    </div>
  \`
})
export class ModalComponent {
  @Input() title = '';
  @Input() content = '';
  @Input() showConfirm = false;
  @Output() close = new EventEmitter<void>();
  @Output() confirm = new EventEmitter<void>();

  onClose() {
    this.close.emit();
  }

  onConfirm() {
    this.confirm.emit();
  }

  onOverlayClick() {
    this.onClose();
  }
}

// Main Component with Dynamic Creation
@Component({
  selector: 'app-dynamic-demo',
  template: \`
    <div class="dynamic-demo">
      <h2>Dynamic Component Demo</h2>
      
      <div class="controls">
        <button (click)="createAlert('success')">Success Alert</button>
        <button (click)="createAlert('error')">Error Alert</button>
        <button (click)="createModal()">Create Modal</button>
        <button (click)="clearAll()">Clear All</button>
      </div>
      
      <!-- Dynamic component host -->
      <div class="dynamic-container">
        <ng-template appDynamicHost></ng-template>
      </div>
      
      <!-- Component list -->
      <div class="component-list">
        <h3>Active Components: {{ componentRefs.length }}</h3>
        <div *ngFor="let ref of componentRefs; let i = index">
          Component {{ i + 1 }}: {{ ref.componentType.name }}
          <button (click)="destroyComponent(i)">Destroy</button>
        </div>
      </div>
    </div>
  \`
})
export class DynamicDemoComponent implements AfterViewInit, OnDestroy {
  @ViewChild(DynamicHostDirective, { static: true }) 
  dynamicHost!: DynamicHostDirective;

  componentRefs: ComponentRef<any>[] = [];

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private injector: Injector
  ) {}

  ngAfterViewInit() {
    console.log('Dynamic host ready');
  }

  ngOnDestroy() {
    this.clearAll();
  }

  createAlert(type: 'success' | 'error' | 'warning' | 'info') {
    const viewContainerRef = this.dynamicHost.viewContainerRef;
    
    // Create component factory (Angular 12 and below)
    const componentFactory = this.componentFactoryResolver
      .resolveComponentFactory(AlertComponent);
    
    // Create component
    const componentRef = viewContainerRef.createComponent(componentFactory);
    
    // Set input properties
    componentRef.instance.title = \`\${type.charAt(0).toUpperCase() + type.slice(1)} Alert\`;
    componentRef.instance.message = \`This is a \${type} message created dynamically!\`;
    componentRef.instance.type = type;
    
    // Subscribe to output events
    componentRef.instance.close.subscribe(() => {
      this.destroyComponentRef(componentRef);
    });
    
    // Store reference
    this.componentRefs.push(componentRef);
    
    // Trigger change detection
    componentRef.changeDetectorRef.detectChanges();
  }

  createModal() {
    const viewContainerRef = this.dynamicHost.viewContainerRef;
    
    // Modern approach (Angular 13+)
    const componentRef = viewContainerRef.createComponent(ModalComponent, {
      injector: this.injector
    });
    
    // Configure component
    componentRef.instance.title = 'Dynamic Modal';
    componentRef.instance.content = 'This modal was created dynamically!';
    componentRef.instance.showConfirm = true;
    
    // Handle events
    componentRef.instance.close.subscribe(() => {
      this.destroyComponentRef(componentRef);
    });
    
    componentRef.instance.confirm.subscribe(() => {
      console.log('Modal confirmed!');
      this.destroyComponentRef(componentRef);
    });
    
    this.componentRefs.push(componentRef);
    componentRef.changeDetectorRef.detectChanges();
  }

  destroyComponent(index: number) {
    if (index >= 0 && index < this.componentRefs.length) {
      const componentRef = this.componentRefs[index];
      this.destroyComponentRef(componentRef);
    }
  }

  clearAll() {
    this.componentRefs.forEach(ref => ref.destroy());
    this.componentRefs = [];
    this.dynamicHost.viewContainerRef.clear();
  }

  private destroyComponentRef(componentRef: ComponentRef<any>) {
    const index = this.componentRefs.indexOf(componentRef);
    if (index > -1) {
      this.componentRefs.splice(index, 1);
    }
    componentRef.destroy();
  }
}`,
    },
    {
      title: "Dynamic Component Service",
      code: `// Dynamic Component Service
@Injectable({
  providedIn: 'root'
})
export class DynamicComponentService {
  private componentRefs: ComponentRef<any>[] = [];

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private applicationRef: ApplicationRef,
    private injector: Injector,
    @Inject(DOCUMENT) private document: Document
  ) {}

  // Create component and append to body
  createComponent<T>(
    component: Type<T>, 
    config?: DynamicComponentConfig<T>
  ): ComponentRef<T> {
    // Create component
    const componentRef = this.applicationRef.bootstrap(component);
    
    // Configure inputs
    if (config?.inputs) {
      Object.assign(componentRef.instance, config.inputs);
    }
    
    // Subscribe to outputs
    if (config?.outputs) {
      Object.keys(config.outputs).forEach(key => {
        const output = (componentRef.instance as any)[key];
        if (output && output.subscribe) {
          output.subscribe(config.outputs![key]);
        }
      });
    }
    
    // Append to DOM
    const domElement = (componentRef.hostView as EmbeddedViewRef<any>).rootNodes[0];
    const targetElement = config?.appendTo || this.document.body;
    targetElement.appendChild(domElement);
    
    // Store reference
    this.componentRefs.push(componentRef);
    
    return componentRef;
  }

  // Create component in specific container
  createComponentInContainer<T>(
    component: Type<T>,
    container: ViewContainerRef,
    config?: DynamicComponentConfig<T>
  ): ComponentRef<T> {
    const componentRef = container.createComponent(component, {
      injector: config?.injector || this.injector
    });
    
    // Configure component
    if (config?.inputs) {
      Object.assign(componentRef.instance, config.inputs);
    }
    
    if (config?.outputs) {
      Object.keys(config.outputs).forEach(key => {
        const output = (componentRef.instance as any)[key];
        if (output && output.subscribe) {
          output.subscribe(config.outputs![key]);
        }
      });
    }
    
    this.componentRefs.push(componentRef);
    componentRef.changeDetectorRef.detectChanges();
    
    return componentRef;
  }

  // Destroy specific component
  destroyComponent(componentRef: ComponentRef<any>) {
    const index = this.componentRefs.indexOf(componentRef);
    if (index > -1) {
      this.componentRefs.splice(index, 1);
    }
    componentRef.destroy();
  }

  // Destroy all components
  destroyAll() {
    this.componentRefs.forEach(ref => ref.destroy());
    this.componentRefs = [];
  }

  // Get all active components
  getActiveComponents(): ComponentRef<any>[] {
    return [...this.componentRefs];
  }
}

// Configuration interface
interface DynamicComponentConfig<T> {
  inputs?: Partial<T>;
  outputs?: { [key: string]: (value: any) => void };
  injector?: Injector;
  appendTo?: Element;
}

// Toast Service using Dynamic Components
@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private toastContainer: HTMLElement;

  constructor(
    private dynamicService: DynamicComponentService,
    @Inject(DOCUMENT) private document: Document
  ) {
    this.createToastContainer();
  }

  showToast(config: ToastConfig): ComponentRef<ToastComponent> {
    const componentRef = this.dynamicService.createComponent(ToastComponent, {
      inputs: {
        message: config.message,
        type: config.type || 'info',
        duration: config.duration || 3000
      },
      outputs: {
        close: () => this.dynamicService.destroyComponent(componentRef)
      },
      appendTo: this.toastContainer
    });

    // Auto-close after duration
    if (config.duration && config.duration > 0) {
      setTimeout(() => {
        this.dynamicService.destroyComponent(componentRef);
      }, config.duration);
    }

    return componentRef;
  }

  success(message: string, duration?: number) {
    return this.showToast({ message, type: 'success', duration });
  }

  error(message: string, duration?: number) {
    return this.showToast({ message, type: 'error', duration });
  }

  warning(message: string, duration?: number) {
    return this.showToast({ message, type: 'warning', duration });
  }

  info(message: string, duration?: number) {
    return this.showToast({ message, type: 'info', duration });
  }

  private createToastContainer() {
    this.toastContainer = this.document.createElement('div');
    this.toastContainer.className = 'toast-container';
    this.toastContainer.style.cssText = \`
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 9999;
      pointer-events: none;
    \`;
    this.document.body.appendChild(this.toastContainer);
  }
}

// Toast Component
@Component({
  selector: 'app-toast',
  template: \`
    <div class="toast toast-{{ type }}" [@slideIn]>
      <div class="toast-content">
        <span class="toast-message">{{ message }}</span>
        <button class="toast-close" (click)="onClose()">&times;</button>
      </div>
    </div>
  \`,
  animations: [
    trigger('slideIn', [
      transition(':enter', [
        style({ transform: 'translateX(100%)', opacity: 0 }),
        animate('300ms ease-in', style({ transform: 'translateX(0)', opacity: 1 }))
      ]),
      transition(':leave', [
        animate('300ms ease-out', style({ transform: 'translateX(100%)', opacity: 0 }))
      ])
    ])
  ]
})
export class ToastComponent {
  @Input() message = '';
  @Input() type: 'success' | 'error' | 'warning' | 'info' = 'info';
  @Input() duration = 3000;
  @Output() close = new EventEmitter<void>();

  onClose() {
    this.close.emit();
  }
}

// Interfaces
interface ToastConfig {
  message: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
}`,
    },
    {
      title: "Dynamic Form Builder",
      code: `// Dynamic Form Field Components
@Component({
  selector: 'app-text-field',
  template: \`
    <div class="form-field">
      <label [for]="field.key">{{ field.label }}</label>
      <input 
        [id]="field.key"
        [type]="field.type || 'text'"
        [formControlName]="field.key"
        [placeholder]="field.placeholder"
        [required]="field.required"
        class="form-control"
      >
      <div class="field-errors" *ngIf="control?.errors && control?.touched">
        <div *ngFor="let error of getErrorMessages()">{{ error }}</div>
      </div>
    </div>
  \`
})
export class TextFieldComponent implements OnInit {
  @Input() field!: FormFieldConfig;
  @Input() control!: AbstractControl;

  ngOnInit() {
    console.log('Text field initialized:', this.field.key);
  }

  getErrorMessages(): string[] {
    const errors = this.control?.errors;
    if (!errors) return [];

    const messages: string[] = [];
    if (errors['required']) messages.push(\`\${this.field.label} is required\`);
    if (errors['email']) messages.push('Please enter a valid email');
    if (errors['minlength']) messages.push(\`Minimum length is \${errors['minlength'].requiredLength}\`);
    
    return messages;
  }
}

@Component({
  selector: 'app-select-field',
  template: \`
    <div class="form-field">
      <label [for]="field.key">{{ field.label }}</label>
      <select 
        [id]="field.key"
        [formControlName]="field.key"
        [required]="field.required"
        class="form-control"
      >
        <option value="">Select {{ field.label }}</option>
        <option 
          *ngFor="let option of field.options" 
          [value]="option.value"
        >
          {{ option.label }}
        </option>
      </select>
    </div>
  \`
})
export class SelectFieldComponent {
  @Input() field!: FormFieldConfig;
  @Input() control!: AbstractControl;
}

// Dynamic Form Builder Service
@Injectable({
  providedIn: 'root'
})
export class DynamicFormService {
  private fieldComponents = new Map<string, Type<any>>([
    ['text', TextFieldComponent],
    ['email', TextFieldComponent],
    ['password', TextFieldComponent],
    ['number', TextFieldComponent],
    ['select', SelectFieldComponent],
    ['textarea', TextAreaFieldComponent],
    ['checkbox', CheckboxFieldComponent],
    ['radio', RadioFieldComponent]
  ]);

  constructor(private fb: FormBuilder) {}

  createFormGroup(fields: FormFieldConfig[]): FormGroup {
    const group: { [key: string]: FormControl } = {};

    fields.forEach(field => {
      const validators = this.getValidators(field);
      group[field.key] = new FormControl(field.value || '', validators);
    });

    return this.fb.group(group);
  }

  getFieldComponent(type: string): Type<any> | null {
    return this.fieldComponents.get(type) || null;
  }

  registerFieldComponent(type: string, component: Type<any>) {
    this.fieldComponents.set(type, component);
  }

  private getValidators(field: FormFieldConfig): ValidatorFn[] {
    const validators: ValidatorFn[] = [];

    if (field.required) validators.push(Validators.required);
    if (field.email) validators.push(Validators.email);
    if (field.minLength) validators.push(Validators.minLength(field.minLength));
    if (field.maxLength) validators.push(Validators.maxLength(field.maxLength));
    if (field.pattern) validators.push(Validators.pattern(field.pattern));
    if (field.min !== undefined) validators.push(Validators.min(field.min));
    if (field.max !== undefined) validators.push(Validators.max(field.max));

    return validators;
  }
}

// Dynamic Form Component
@Component({
  selector: 'app-dynamic-form',
  template: \`
    <form [formGroup]="form" (ngSubmit)="onSubmit()" class="dynamic-form">
      <h2>{{ config.title }}</h2>
      <p *ngIf="config.description">{{ config.description }}</p>

      <div class="form-fields">
        <div 
          *ngFor="let field of config.fields; trackBy: trackByFieldKey"
          class="field-container"
        >
          <ng-container 
            *ngComponentOutlet="getFieldComponent(field.type); 
                               injector: createFieldInjector(field)"
          ></ng-container>
        </div>
      </div>

      <div class="form-actions">
        <button 
          type="submit" 
          [disabled]="form.invalid || submitting"
          class="btn btn-primary"
        >
          {{ submitting ? 'Submitting...' : (config.submitText || 'Submit') }}
        </button>
        <button 
          type="button" 
          (click)="onReset()"
          class="btn btn-secondary"
        >
          Reset
        </button>
      </div>

      <div class="form-debug" *ngIf="showDebug">
        <h4>Form Debug</h4>
        <pre>{{ form.value | json }}</pre>
        <p>Valid: {{ form.valid }}</p>
        <p>Errors: {{ form.errors | json }}</p>
      </div>
    </form>
  \`
})
export class DynamicFormComponent implements OnInit {
  @Input() config!: DynamicFormConfig;
  @Input() showDebug = false;
  @Output() formSubmit = new EventEmitter<any>();
  @Output() formReset = new EventEmitter<void>();

  form!: FormGroup;
  submitting = false;

  constructor(
    private dynamicFormService: DynamicFormService,
    private injector: Injector
  ) {}

  ngOnInit() {
    this.form = this.dynamicFormService.createFormGroup(this.config.fields);
  }

  trackByFieldKey(index: number, field: FormFieldConfig): string {
    return field.key;
  }

  getFieldComponent(type: string): Type<any> | null {
    return this.dynamicFormService.getFieldComponent(type);
  }

  createFieldInjector(field: FormFieldConfig): Injector {
    return Injector.create({
      providers: [
        { provide: 'field', useValue: field },
        { provide: 'control', useValue: this.form.get(field.key) }
      ],
      parent: this.injector
    });
  }

  onSubmit() {
    if (this.form.valid) {
      this.submitting = true;
      this.formSubmit.emit(this.form.value);
      
      // Simulate async operation
      setTimeout(() => {
        this.submitting = false;
      }, 1000);
    } else {
      this.markAllFieldsAsTouched();
    }
  }

  onReset() {
    this.form.reset();
    this.formReset.emit();
  }

  private markAllFieldsAsTouched() {
    Object.keys(this.form.controls).forEach(key => {
      this.form.get(key)?.markAsTouched();
    });
  }
}

// Interfaces
interface FormFieldConfig {
  key: string;
  type: string;
  label: string;
  placeholder?: string;
  value?: any;
  required?: boolean;
  email?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  min?: number;
  max?: number;
  options?: { label: string; value: any }[];
}

interface DynamicFormConfig {
  title: string;
  description?: string;
  fields: FormFieldConfig[];
  submitText?: string;
}`,
    },
  ]

  const interviewQuestions = [
    {
      question: "What are dynamic components and when would you use them?",
      answer:
        "Dynamic components are components created programmatically at runtime rather than declared in templates. Use them for: modals, tooltips, notifications, dynamic forms, plugin systems, and content that changes based on user data or configuration. They provide flexibility for creating UI elements on demand.",
    },
    {
      question: "How do you create dynamic components in Angular?",
      answer:
        "Use ViewContainerRef.createComponent() method. Steps: 1) Get ViewContainerRef reference, 2) Create component using createComponent(), 3) Set input properties, 4) Subscribe to output events, 5) Trigger change detection, 6) Store component reference for cleanup. Modern Angular (13+) simplified the API.",
    },
    {
      question: "What's the difference between ComponentFactoryResolver and the new createComponent API?",
      answer:
        "ComponentFactoryResolver (deprecated in Angular 13) required creating a factory first. The new createComponent() API is simpler: directly creates components without factories. Old: resolver.resolveComponentFactory() then createComponent(). New: viewContainer.createComponent(Component) directly.",
    },
    {
      question: "How do you handle memory leaks with dynamic components?",
      answer:
        "Always destroy dynamic components: 1) Store ComponentRef references, 2) Call componentRef.destroy() when done, 3) Clear ViewContainerRef with clear(), 4) Unsubscribe from component outputs, 5) Implement cleanup in ngOnDestroy, 6) Use services to manage component lifecycle centrally.",
    },
    {
      question: "How can you pass data to and receive events from dynamic components?",
      answer:
        "Pass data by setting instance properties: componentRef.instance.property = value. Receive events by subscribing to outputs: componentRef.instance.eventEmitter.subscribe(). You can also use dependency injection to pass services or use a configuration object pattern for complex data.",
    },
  ]

  return (
    <PageLayout
      title="Dynamic Components & Component Factory"
      description="Master creating and managing components dynamically at runtime"
      previousPage={{ href: "/advanced/change-detection", title: "Change Detection" }}
      nextPage={{ href: "/advanced/custom-directives", title: "Custom Directives" }}
    >
      <div className="space-y-8">
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Theory Overview</h2>
          <div className="prose prose-gray max-w-none">
            <p>
              Dynamic components allow you to create and insert components into the DOM programmatically at runtime.
              This is useful for creating flexible, data-driven UIs where the component structure isn't known at compile
              time.
            </p>

            <h3>Use Cases for Dynamic Components:</h3>
            <ul>
              <li>
                <strong>Modal Dialogs:</strong> Create modals on demand with different content
              </li>
              <li>
                <strong>Notifications/Toasts:</strong> Show temporary messages dynamically
              </li>
              <li>
                <strong>Dynamic Forms:</strong> Build forms based on configuration data
              </li>
              <li>
                <strong>Plugin Systems:</strong> Load components based on user permissions or features
              </li>
              <li>
                <strong>Dashboard Widgets:</strong> Create customizable dashboard layouts
              </li>
              <li>
                <strong>Content Management:</strong> Render different component types based on data
              </li>
            </ul>

            <h3>Key Concepts:</h3>
            <ul>
              <li>
                <strong>ViewContainerRef:</strong> Reference to a container where components can be inserted
              </li>
              <li>
                <strong>ComponentRef:</strong> Reference to a dynamically created component instance
              </li>
              <li>
                <strong>ComponentFactoryResolver:</strong> (Deprecated) Service for creating component factories
              </li>
              <li>
                <strong>Injector:</strong> Provides dependencies for dynamically created components
              </li>
            </ul>

            <h3>Modern vs Legacy API:</h3>
            <ul>
              <li>
                <strong>Angular 13+:</strong> Direct createComponent() method on ViewContainerRef
              </li>
              <li>
                <strong>Angular 12-:</strong> ComponentFactoryResolver required for component creation
              </li>
            </ul>

            <h3>Best Practices:</h3>
            <ul>
              <li>Always destroy dynamic components to prevent memory leaks</li>
              <li>Store component references for proper cleanup</li>
              <li>Use services to manage dynamic component lifecycle</li>
              <li>Handle component inputs and outputs properly</li>
              <li>Consider using OnPush change detection for performance</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Code Examples</h2>
          <div className="space-y-6">
            {dynamicExamples.map((example, index) => (
              <CodeExample key={index} title={example.title} code={example.code} language="typescript" />
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Best Practices</h2>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <ul className="space-y-2 text-gray-700">
              <li>• Always destroy dynamic components to prevent memory leaks</li>
              <li>• Store ComponentRef references for proper lifecycle management</li>
              <li>• Use services to centralize dynamic component creation logic</li>
              <li>• Handle component inputs and outputs appropriately</li>
              <li>• Consider performance implications of frequent component creation</li>
              <li>• Use ViewContainerRef.clear() to remove all dynamic components</li>
              <li>• Implement proper error handling for component creation</li>
              <li>• Document dynamic component contracts and interfaces</li>
            </ul>
          </div>
        </section>

        <InterviewQuestions questions={interviewQuestions} />
      </div>
    </PageLayout>
  )
}
