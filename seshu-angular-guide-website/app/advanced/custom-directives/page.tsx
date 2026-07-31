import { PageLayout } from "@/components/page-layout"
import { CodeExample } from "@/components/code-example"
import { InterviewQuestions } from "@/components/interview-questions"

export default function CustomDirectivesPage() {
  const directiveExamples = [
    {
      title: "Attribute Directives",
      code: `// Highlight Directive
@Directive({
  selector: '[appHighlight]'
})
export class HighlightDirective implements OnInit, OnDestroy {
  @Input() appHighlight: string = 'yellow';
  @Input() highlightColor: string = '';
  
  @HostBinding('style.backgroundColor') backgroundColor: string = '';
  @HostBinding('style.transition') transition = 'background-color 0.3s ease';
  
  @HostListener('mouseenter') onMouseEnter() {
    this.highlight(this.highlightColor || this.appHighlight || 'yellow');
  }
  
  @HostListener('mouseleave') onMouseLeave() {
    this.highlight('');
  }
  
  @HostListener('click', ['$event']) onClick(event: Event) {
    console.log('Highlighted element clicked:', event.target);
  }

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngOnInit() {
    // Initial setup
    this.renderer.addClass(this.el.nativeElement, 'highlightable');
  }

  ngOnDestroy() {
    // Cleanup if needed
  }

  private highlight(color: string) {
    this.backgroundColor = color;
  }
}

// Usage: <p appHighlight="lightblue">Hover over me!</p>

// Tooltip Directive
@Directive({
  selector: '[appTooltip]'
})
export class TooltipDirective implements OnInit, OnDestroy {
  @Input() appTooltip: string = '';
  @Input() tooltipPosition: 'top' | 'bottom' | 'left' | 'right' = 'top';
  @Input() tooltipDelay: number = 500;
  
  private tooltipElement: HTMLElement | null = null;
  private showTimeout: any;
  private hideTimeout: any;

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    @Inject(DOCUMENT) private document: Document
  ) {}

  ngOnInit() {
    this.renderer.addClass(this.el.nativeElement, 'tooltip-host');
  }

  ngOnDestroy() {
    this.hideTooltip();
    if (this.showTimeout) clearTimeout(this.showTimeout);
    if (this.hideTimeout) clearTimeout(this.hideTimeout);
  }

  @HostListener('mouseenter') onMouseEnter() {
    if (this.hideTimeout) {
      clearTimeout(this.hideTimeout);
      this.hideTimeout = null;
    }
    
    this.showTimeout = setTimeout(() => {
      this.showTooltip();
    }, this.tooltipDelay);
  }

  @HostListener('mouseleave') onMouseLeave() {
    if (this.showTimeout) {
      clearTimeout(this.showTimeout);
      this.showTimeout = null;
    }
    
    this.hideTimeout = setTimeout(() => {
      this.hideTooltip();
    }, 100);
  }

  private showTooltip() {
    if (this.tooltipElement || !this.appTooltip) return;

    // Create tooltip element
    this.tooltipElement = this.renderer.createElement('div');
    this.renderer.addClass(this.tooltipElement, 'tooltip');
    this.renderer.addClass(this.tooltipElement, \`tooltip-\${this.tooltipPosition}\`);
    this.renderer.setProperty(this.tooltipElement, 'textContent', this.appTooltip);

    // Position tooltip
    this.positionTooltip();

    // Add to DOM
    this.renderer.appendChild(this.document.body, this.tooltipElement);

    // Animate in
    setTimeout(() => {
      this.renderer.addClass(this.tooltipElement, 'tooltip-visible');
    }, 10);
  }

  private hideTooltip() {
    if (!this.tooltipElement) return;

    this.renderer.removeClass(this.tooltipElement, 'tooltip-visible');
    
    setTimeout(() => {
      if (this.tooltipElement) {
        this.renderer.removeChild(this.document.body, this.tooltipElement);
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

    switch (this.tooltipPosition) {
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

    this.renderer.setStyle(this.tooltipElement, 'position', 'fixed');
    this.renderer.setStyle(this.tooltipElement, 'top', \`\${top}px\`);
    this.renderer.setStyle(this.tooltipElement, 'left', \`\${left}px\`);
    this.renderer.setStyle(this.tooltipElement, 'z-index', '9999');
  }
}

// Click Outside Directive
@Directive({
  selector: '[appClickOutside]'
})
export class ClickOutsideDirective implements OnInit, OnDestroy {
  @Output() appClickOutside = new EventEmitter<Event>();

  private documentClickListener?: () => void;

  constructor(private elementRef: ElementRef) {}

  ngOnInit() {
    this.documentClickListener = this.onDocumentClick.bind(this);
    document.addEventListener('click', this.documentClickListener);
  }

  ngOnDestroy() {
    if (this.documentClickListener) {
      document.removeEventListener('click', this.documentClickListener);
    }
  }

  private onDocumentClick(event: Event) {
    const target = event.target as HTMLElement;
    const clickedInside = this.elementRef.nativeElement.contains(target);
    
    if (!clickedInside) {
      this.appClickOutside.emit(event);
    }
  }
}`,
    },
    {
      title: "Structural Directives",
      code: `// Custom If Directive
@Directive({
  selector: '[appCustomIf]'
})
export class CustomIfDirective {
  private hasView = false;

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef
  ) {}

  @Input() set appCustomIf(condition: boolean) {
    if (condition && !this.hasView) {
      this.viewContainer.createEmbeddedView(this.templateRef);
      this.hasView = true;
    } else if (!condition && this.hasView) {
      this.viewContainer.clear();
      this.hasView = false;
    }
  }
}

// Usage: <div *appCustomIf="showContent">Content to show/hide</div>

// Repeat Directive (like ngFor but simpler)
@Directive({
  selector: '[appRepeat]'
})
export class RepeatDirective<T> implements OnChanges {
  @Input() appRepeatOf!: T[];
  @Input() appRepeatTrackBy?: TrackByFunction<T>;

  constructor(
    private templateRef: TemplateRef<RepeatContext<T>>,
    private viewContainer: ViewContainerRef
  ) {}

  ngOnChanges() {
    this.viewContainer.clear();

    if (this.appRepeatOf) {
      this.appRepeatOf.forEach((item, index) => {
        const context: RepeatContext<T> = {
          $implicit: item,
          index,
          count: this.appRepeatOf.length,
          first: index === 0,
          last: index === this.appRepeatOf.length - 1,
          even: index % 2 === 0,
          odd: index % 2 === 1
        };

        this.viewContainer.createEmbeddedView(this.templateRef, context);
      });
    }
  }
}

interface RepeatContext<T> {
  $implicit: T;
  index: number;
  count: number;
  first: boolean;
  last: boolean;
  even: boolean;
  odd: boolean;
}

// Usage: <div *appRepeat="let item of items; let i = index">{{ i }}: {{ item }}</div>

// Permission Directive
@Directive({
  selector: '[appPermission]'
})
export class PermissionDirective implements OnInit, OnDestroy {
  @Input() appPermission!: string | string[];
  @Input() appPermissionElse?: TemplateRef<any>;

  private hasView = false;
  private elseView = false;
  private subscription?: Subscription;

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.subscription = this.authService.permissions$.subscribe(permissions => {
      this.updateView(permissions);
    });
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }

  private updateView(userPermissions: string[]) {
    const requiredPermissions = Array.isArray(this.appPermission) 
      ? this.appPermission 
      : [this.appPermission];

    const hasPermission = requiredPermissions.some(permission => 
      userPermissions.includes(permission)
    );

    if (hasPermission && !this.hasView) {
      this.viewContainer.clear();
      this.viewContainer.createEmbeddedView(this.templateRef);
      this.hasView = true;
      this.elseView = false;
    } else if (!hasPermission && !this.elseView) {
      this.viewContainer.clear();
      if (this.appPermissionElse) {
        this.viewContainer.createEmbeddedView(this.appPermissionElse);
        this.elseView = true;
      }
      this.hasView = false;
    }
  }
}

// Usage: 
// <div *appPermission="'admin'; else noPermission">Admin content</div>
// <ng-template #noPermission>No permission</ng-template>

// Loading Directive
@Directive({
  selector: '[appLoading]'
})
export class LoadingDirective implements OnInit, OnDestroy {
  @Input() set appLoading(loading: boolean) {
    this.updateView(loading);
  }

  @Input() appLoadingTemplate?: TemplateRef<any>;
  @Input() appLoadingMessage = 'Loading...';

  private originalView = false;
  private loadingView = false;
  private subscription?: Subscription;

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private renderer: Renderer2
  ) {}

  ngOnInit() {
    // Show original content initially
    if (!this.originalView) {
      this.viewContainer.createEmbeddedView(this.templateRef);
      this.originalView = true;
    }
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }

  private updateView(loading: boolean) {
    if (loading && !this.loadingView) {
      this.viewContainer.clear();
      this.createLoadingView();
      this.loadingView = true;
      this.originalView = false;
    } else if (!loading && !this.originalView) {
      this.viewContainer.clear();
      this.viewContainer.createEmbeddedView(this.templateRef);
      this.originalView = true;
      this.loadingView = false;
    }
  }

  private createLoadingView() {
    if (this.appLoadingTemplate) {
      this.viewContainer.createEmbeddedView(this.appLoadingTemplate);
    } else {
      // Create default loading view
      const loadingElement = this.renderer.createElement('div');
      this.renderer.addClass(loadingElement, 'loading-spinner');
      this.renderer.setProperty(loadingElement, 'textContent', this.appLoadingMessage);
      
      const embeddedView = this.viewContainer.createEmbeddedView(
        this.createTemplate(loadingElement)
      );
    }
  }

  private createTemplate(element: HTMLElement): TemplateRef<any> {
    // This is a simplified approach - in real implementation,
    // you might want to use a more sophisticated template creation
    return {
      createEmbeddedView: () => ({
        rootNodes: [element]
      })
    } as any;
  }
}

// Intersection Observer Directive
@Directive({
  selector: '[appIntersection]'
})
export class IntersectionDirective implements OnInit, OnDestroy {
  @Input() appIntersectionThreshold = 0.1;
  @Input() appIntersectionRoot: Element | null = null;
  @Input() appIntersectionRootMargin = '0px';

  @Output() appIntersectionEnter = new EventEmitter<IntersectionObserverEntry>();
  @Output() appIntersectionLeave = new EventEmitter<IntersectionObserverEntry>();
  @Output() appIntersectionChange = new EventEmitter<IntersectionObserverEntry>();

  private observer?: IntersectionObserver;

  constructor(private element: ElementRef) {}

  ngOnInit() {
    if (typeof IntersectionObserver !== 'undefined') {
      this.observer = new IntersectionObserver(
        (entries) => this.handleIntersection(entries),
        {
          threshold: this.appIntersectionThreshold,
          root: this.appIntersectionRoot,
          rootMargin: this.appIntersectionRootMargin
        }
      );

      this.observer.observe(this.element.nativeElement);
    }
  }

  ngOnDestroy() {
    if (this.observer) {
      this.observer.disconnect();
    }
  }

  private handleIntersection(entries: IntersectionObserverEntry[]) {
    entries.forEach(entry => {
      this.appIntersectionChange.emit(entry);

      if (entry.isIntersecting) {
        this.appIntersectionEnter.emit(entry);
      } else {
        this.appIntersectionLeave.emit(entry);
      }
    });
  }
}`,
    },
    {
      title: "Advanced Directive Patterns",
      code: `// Directive Composition
@Directive({
  selector: '[appDraggable]'
})
export class DraggableDirective implements OnInit, OnDestroy {
  @Input() appDraggableData: any;
  @Input() appDraggableDisabled = false;
  
  @Output() appDragStart = new EventEmitter<DragEvent>();
  @Output() appDragEnd = new EventEmitter<DragEvent>();

  @HostBinding('draggable') get draggable() {
    return !this.appDraggableDisabled;
  }

  @HostBinding('class.draggable') draggableClass = true;
  @HostBinding('class.dragging') dragging = false;

  constructor(private element: ElementRef) {}

  ngOnInit() {
    this.element.nativeElement.addEventListener('dragstart', this.onDragStart.bind(this));
    this.element.nativeElement.addEventListener('dragend', this.onDragEnd.bind(this));
  }

  ngOnDestroy() {
    this.element.nativeElement.removeEventListener('dragstart', this.onDragStart);
    this.element.nativeElement.removeEventListener('dragend', this.onDragEnd);
  }

  private onDragStart(event: DragEvent) {
    if (this.appDraggableDisabled) {
      event.preventDefault();
      return;
    }

    this.dragging = true;
    
    if (this.appDraggableData) {
      event.dataTransfer?.setData('application/json', JSON.stringify(this.appDraggableData));
    }

    this.appDragStart.emit(event);
  }

  private onDragEnd(event: DragEvent) {
    this.dragging = false;
    this.appDragEnd.emit(event);
  }
}

@Directive({
  selector: '[appDropZone]'
})
export class DropZoneDirective {
  @Input() appDropZoneAccept: string[] = [];
  
  @Output() appDrop = new EventEmitter<any>();
  @Output() appDragOver = new EventEmitter<DragEvent>();
  @Output() appDragLeave = new EventEmitter<DragEvent>();

  @HostBinding('class.drop-zone') dropZoneClass = true;
  @HostBinding('class.drag-over') dragOver = false;

  @HostListener('dragover', ['$event']) onDragOver(event: DragEvent) {
    event.preventDefault();
    this.dragOver = true;
    this.appDragOver.emit(event);
  }

  @HostListener('dragleave', ['$event']) onDragLeave(event: DragEvent) {
    this.dragOver = false;
    this.appDragLeave.emit(event);
  }

  @HostListener('drop', ['$event']) onDrop(event: DragEvent) {
    event.preventDefault();
    this.dragOver = false;

    const data = event.dataTransfer?.getData('application/json');
    if (data) {
      try {
        const parsedData = JSON.parse(data);
        this.appDrop.emit(parsedData);
      } catch (error) {
        console.error('Error parsing drop data:', error);
      }
    }
  }
}

// Form Validation Directive
@Directive({
  selector: '[appValidation]'
})
export class ValidationDirective implements OnInit, OnDestroy {
  @Input() appValidation: ValidationConfig = {};
  
  private subscription?: Subscription;

  constructor(
    private element: ElementRef,
    private renderer: Renderer2,
    @Optional() private control: NgControl
  ) {}

  ngOnInit() {
    if (this.control && this.control.control) {
      this.subscription = this.control.control.statusChanges.subscribe(() => {
        this.updateValidationState();
      });

      // Initial validation state
      setTimeout(() => this.updateValidationState());
    }
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }

  private updateValidationState() {
    if (!this.control?.control) return;

    const control = this.control.control;
    const element = this.element.nativeElement;

    // Remove existing validation classes
    this.renderer.removeClass(element, 'valid');
    this.renderer.removeClass(element, 'invalid');
    this.renderer.removeClass(element, 'pending');

    // Add current state class
    if (control.pending) {
      this.renderer.addClass(element, 'pending');
    } else if (control.valid && control.touched) {
      this.renderer.addClass(element, 'valid');
    } else if (control.invalid && control.touched) {
      this.renderer.addClass(element, 'invalid');
    }

    // Handle error messages
    this.updateErrorMessages(control);
  }

  private updateErrorMessages(control: AbstractControl) {
    // Remove existing error elements
    const existingErrors = this.element.nativeElement.parentNode
      ?.querySelectorAll('.validation-error');
    existingErrors?.forEach((error: Element) => error.remove());

    if (control.invalid && control.touched && control.errors) {
      const errorContainer = this.renderer.createElement('div');
      this.renderer.addClass(errorContainer, 'validation-error');

      Object.keys(control.errors).forEach(errorKey => {
        const errorMessage = this.getErrorMessage(errorKey, control.errors![errorKey]);
        const errorElement = this.renderer.createElement('div');
        this.renderer.addClass(errorElement, 'error-message');
        this.renderer.setProperty(errorElement, 'textContent', errorMessage);
        this.renderer.appendChild(errorContainer, errorElement);
      });

      this.renderer.insertAfter(
        errorContainer,
        this.element.nativeElement
      );
    }
  }

  private getErrorMessage(errorKey: string, errorValue: any): string {
    const customMessages = this.appValidation.messages || {};
    
    if (customMessages[errorKey]) {
      return customMessages[errorKey];
    }

    // Default error messages
    switch (errorKey) {
      case 'required':
        return 'This field is required';
      case 'email':
        return 'Please enter a valid email address';
      case 'minlength':
        return \`Minimum length is \${errorValue.requiredLength}\`;
      case 'maxlength':
        return \`Maximum length is \${errorValue.requiredLength}\`;
      case 'pattern':
        return 'Please enter a valid format';
      default:
        return 'Invalid input';
    }
  }
}

// Resize Observer Directive
@Directive({
  selector: '[appResize]'
})
export class ResizeDirective implements OnInit, OnDestroy {
  @Output() appResize = new EventEmitter<ResizeObserverEntry>();

  private resizeObserver?: ResizeObserver;

  constructor(private element: ElementRef) {}

  ngOnInit() {
    if (typeof ResizeObserver !== 'undefined') {
      this.resizeObserver = new ResizeObserver((entries) => {
        entries.forEach(entry => this.appResize.emit(entry));
      });

      this.resizeObserver.observe(this.element.nativeElement);
    }
  }

  ngOnDestroy() {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
  }
}

// Interfaces
interface ValidationConfig {
  messages?: { [key: string]: string };
}

interface DragData {
  type: string;
  data: any;
}`,
    },
  ]

  const interviewQuestions = [
    {
      question: "What are the different types of directives in Angular?",
      answer:
        "Angular has three types of directives: 1) Component directives (components with templates), 2) Attribute directives (change appearance/behavior of elements, like ngClass), 3) Structural directives (change DOM structure, like ngIf, ngFor). Each serves different purposes for manipulating the DOM and element behavior.",
    },
    {
      question: "How do you create a custom attribute directive?",
      answer:
        "Create a class with @Directive decorator, use ElementRef to access the host element, Renderer2 for DOM manipulation, @HostBinding for property binding, @HostListener for event handling, and @Input for configuration. Example: @Directive({selector: '[appHighlight']}) with constructor(private el: ElementRef, private renderer: Renderer2).",
    },
    {
      question: "What's the difference between ElementRef and Renderer2?",
      answer:
        "ElementRef provides direct access to DOM elements but breaks server-side rendering and security. Renderer2 is the recommended approach - it's platform-agnostic, works with SSR, provides security, and offers methods like addClass, removeClass, setStyle, listen for safe DOM manipulation.",
    },
    {
      question: "How do structural directives work internally?",
      answer:
        "Structural directives use TemplateRef (template content) and ViewContainerRef (insertion point). Angular transforms *directive syntax into <ng-template> with the directive. The directive controls when to create/destroy embedded views using viewContainer.createEmbeddedView() and viewContainer.clear().",
    },
    {
      question: "What are @HostBinding and @HostListener used for?",
      answer:
        "@HostBinding binds directive properties to host element properties/attributes/classes. @HostListener listens to host element events. They provide declarative ways to interact with the host element without direct DOM manipulation. Example: @HostBinding('class.active') isActive; @HostListener('click') onClick().",
    },
  ]

  return (
    <PageLayout
      title="Custom Directives"
      description="Master creating custom attribute and structural directives in Angular"
      previousPage={{ href: "/advanced/dynamic-components", title: "Dynamic Components" }}
      nextPage={{ href: "/advanced/animations", title: "Angular Animations" }}
    >
      <div className="space-y-8">
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Theory Overview</h2>
          <div className="prose prose-gray max-w-none">
            <p>
              Custom directives allow you to extend HTML with your own custom behavior. They are a powerful way to
              encapsulate DOM manipulation logic and create reusable functionality across your Angular application.
            </p>

            <h3>Types of Custom Directives:</h3>
            <ul>
              <li>
                <strong>Attribute Directives:</strong> Change the appearance or behavior of an element, component, or
                another directive
              </li>
              <li>
                <strong>Structural Directives:</strong> Change the DOM layout by adding and removing DOM elements
              </li>
            </ul>

            <h3>Key Concepts:</h3>
            <ul>
              <li>
                <strong>ElementRef:</strong> Provides direct access to the host DOM element
              </li>
              <li>
                <strong>Renderer2:</strong> Platform-safe way to manipulate DOM elements
              </li>
              <li>
                <strong>TemplateRef:</strong> Reference to the template content (structural directives)
              </li>
              <li>
                <strong>ViewContainerRef:</strong> Container where views can be attached (structural directives)
              </li>
              <li>
                <strong>@HostBinding:</strong> Bind directive properties to host element properties
              </li>
              <li>
                <strong>@HostListener:</strong> Listen to host element events
              </li>
            </ul>

            <h3>Common Use Cases:</h3>
            <ul>
              <li>DOM manipulation and styling</li>
              <li>Event handling and user interactions</li>
              <li>Form validation and input formatting</li>
              <li>Accessibility enhancements</li>
              <li>Third-party library integration</li>
              <li>Conditional rendering and content projection</li>
            </ul>

            <h3>Best Practices:</h3>
            <ul>
              <li>Use Renderer2 instead of direct DOM manipulation</li>
              <li>Handle cleanup in ngOnDestroy</li>
              <li>Make directives configurable with @Input properties</li>
              <li>Use meaningful selector names</li>
              <li>Consider accessibility implications</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Code Examples</h2>
          <div className="space-y-6">
            {directiveExamples.map((example, index) => (
              <CodeExample key={index} title={example.title} code={example.code} language="typescript" />
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Best Practices</h2>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <ul className="space-y-2 text-gray-700">
              <li>• Use Renderer2 for DOM manipulation instead of direct element access</li>
              <li>• Always clean up event listeners and subscriptions in ngOnDestroy</li>
              <li>• Make directives configurable with @Input properties</li>
              <li>• Use meaningful and descriptive selector names</li>
              <li>• Consider accessibility when manipulating DOM elements</li>
              <li>• Test directives thoroughly, including edge cases</li>
              <li>• Document directive behavior and configuration options</li>
              <li>• Use @HostBinding and @HostListener for cleaner code</li>
            </ul>
          </div>
        </section>

        <InterviewQuestions questions={interviewQuestions} />
      </div>
    </PageLayout>
  )
}
