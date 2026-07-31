import { PageLayout } from "@/components/page-layout"
import { CodeExample } from "@/components/code-example"
import { InterviewQuestions } from "@/components/interview-questions"

export default function ComponentCommunicationPage() {
  const communicationExamples = [
    {
      title: "Parent to Child Communication (@Input)",
      code: `// Parent Component
@Component({
  selector: 'app-parent',
  template: \`
    <div class="parent">
      <h2>Parent Component</h2>
      <input [(ngModel)]="parentMessage" placeholder="Enter message">
      <input type="number" [(ngModel)]="parentCount" placeholder="Enter count">
      
      <app-child 
        [message]="parentMessage"
        [count]="parentCount"
        [user]="currentUser"
        [config]="appConfig">
      </app-child>
    </div>
  \`
})
export class ParentComponent {
  parentMessage = 'Hello from parent!';
  parentCount = 10;
  currentUser: User = { id: 1, name: 'John Doe', email: 'john@example.com' };
  appConfig = { theme: 'dark', language: 'en' };
}

// Child Component
@Component({
  selector: 'app-child',
  template: \`
    <div class="child">
      <h3>Child Component</h3>
      <p>Message: {{ message }}</p>
      <p>Count: {{ count }}</p>
      <p>User: {{ user?.name }} ({{ user?.email }})</p>
      <p>Theme: {{ config?.theme }}</p>
      
      <!-- Using getters for computed properties -->
      <p>Double Count: {{ doubleCount }}</p>
      <p>Message Length: {{ messageLength }}</p>
    </div>
  \`
})
export class ChildComponent implements OnChanges {
  @Input() message: string = '';
  @Input() count: number = 0;
  @Input() user: User | null = null;
  @Input() config: AppConfig | null = null;

  // Computed properties
  get doubleCount(): number {
    return this.count * 2;
  }

  get messageLength(): number {
    return this.message.length;
  }

  ngOnChanges(changes: SimpleChanges) {
    // React to input changes
    if (changes['message']) {
      console.log('Message changed:', changes['message'].currentValue);
    }
    
    if (changes['count'] && !changes['count'].firstChange) {
      console.log('Count updated:', changes['count'].currentValue);
      this.onCountChange(changes['count'].currentValue);
    }
    
    if (changes['user']) {
      this.onUserChange(changes['user'].currentValue);
    }
  }

  private onCountChange(newCount: number) {
    if (newCount > 100) {
      console.warn('Count is getting high!');
    }
  }

  private onUserChange(newUser: User | null) {
    if (newUser) {
      console.log('User loaded:', newUser.name);
    }
  }
}`,
    },
    {
      title: "Child to Parent Communication (@Output)",
      code: `// Child Component
@Component({
  selector: 'app-child',
  template: \`
    <div class="child">
      <h3>Child Component</h3>
      <input [(ngModel)]="inputValue" placeholder="Enter value">
      
      <button (click)="sendMessage()">Send Message</button>
      <button (click)="sendData()">Send Data</button>
      <button (click)="sendComplexEvent()">Send Complex Event</button>
      
      <div class="counter">
        <button (click)="decrement()">-</button>
        <span>{{ counter }}</span>
        <button (click)="increment()">+</button>
      </div>
    </div>
  \`
})
export class ChildComponent {
  @Output() messageEvent = new EventEmitter<string>();
  @Output() dataEvent = new EventEmitter<any>();
  @Output() complexEvent = new EventEmitter<CustomEvent>();
  @Output() counterChange = new EventEmitter<number>();

  inputValue = '';
  counter = 0;

  sendMessage() {
    this.messageEvent.emit(\`Message from child: \${this.inputValue}\`);
  }

  sendData() {
    const data = {
      timestamp: new Date(),
      value: this.inputValue,
      counter: this.counter
    };
    this.dataEvent.emit(data);
  }

  sendComplexEvent() {
    const event: CustomEvent = {
      type: 'COMPLEX_ACTION',
      payload: {
        action: 'user_interaction',
        data: this.inputValue,
        metadata: {
          timestamp: Date.now(),
          source: 'child-component'
        }
      }
    };
    this.complexEvent.emit(event);
  }

  increment() {
    this.counter++;
    this.counterChange.emit(this.counter);
  }

  decrement() {
    this.counter--;
    this.counterChange.emit(this.counter);
  }
}

// Parent Component
@Component({
  selector: 'app-parent',
  template: \`
    <div class="parent">
      <h2>Parent Component</h2>
      
      <div class="received-data">
        <p>Last Message: {{ lastMessage }}</p>
        <p>Last Data: {{ lastData | json }}</p>
        <p>Counter Value: {{ counterValue }}</p>
      </div>
      
      <app-child 
        (messageEvent)="onMessageReceived($event)"
        (dataEvent)="onDataReceived($event)"
        (complexEvent)="onComplexEvent($event)"
        (counterChange)="onCounterChange($event)">
      </app-child>
    </div>
  \`
})
export class ParentComponent {
  lastMessage = '';
  lastData: any = null;
  counterValue = 0;

  onMessageReceived(message: string) {
    console.log('Received message:', message);
    this.lastMessage = message;
    
    // Additional logic based on message
    if (message.includes('important')) {
      this.handleImportantMessage(message);
    }
  }

  onDataReceived(data: any) {
    console.log('Received data:', data);
    this.lastData = data;
    
    // Process the received data
    this.processReceivedData(data);
  }

  onComplexEvent(event: CustomEvent) {
    console.log('Received complex event:', event);
    
    switch (event.type) {
      case 'COMPLEX_ACTION':
        this.handleComplexAction(event.payload);
        break;
      default:
        console.log('Unknown event type:', event.type);
    }
  }

  onCounterChange(value: number) {
    this.counterValue = value;
    
    if (value > 10) {
      console.log('Counter is getting high!');
    }
  }

  private handleImportantMessage(message: string) {
    // Handle important messages
    alert(\`Important: \${message}\`);
  }

  private processReceivedData(data: any) {
    // Process and validate received data
    if (data.value && data.value.length > 0) {
      console.log('Valid data received');
    }
  }

  private handleComplexAction(payload: any) {
    console.log('Handling complex action:', payload);
    // Implement complex business logic
  }
}

// Custom Event Interface
interface CustomEvent {
  type: string;
  payload: any;
}`,
    },
    {
      title: "Service-Based Communication",
      code: `// Shared Communication Service
@Injectable({
  providedIn: 'root'
})
export class CommunicationService {
  // Simple message broadcasting
  private messageSubject = new BehaviorSubject<string>('');
  public message$ = this.messageSubject.asObservable();

  // Complex data sharing
  private dataSubject = new BehaviorSubject<any>(null);
  public data$ = this.dataSubject.asObservable();

  // Event-based communication
  private eventSubject = new Subject<AppEvent>();
  public events$ = this.eventSubject.asObservable();

  // User state management
  private userSubject = new BehaviorSubject<User | null>(null);
  public user$ = this.userSubject.asObservable();

  // Notification system
  private notificationSubject = new Subject<Notification>();
  public notifications$ = this.notificationSubject.asObservable();

  // Methods for updating state
  sendMessage(message: string) {
    this.messageSubject.next(message);
  }

  updateData(data: any) {
    this.dataSubject.next(data);
  }

  emitEvent(event: AppEvent) {
    this.eventSubject.next(event);
  }

  setUser(user: User | null) {
    this.userSubject.next(user);
  }

  showNotification(notification: Notification) {
    this.notificationSubject.next(notification);
  }

  // Getters for current values
  get currentMessage(): string {
    return this.messageSubject.value;
  }

  get currentData(): any {
    return this.dataSubject.value;
  }

  get currentUser(): User | null {
    return this.userSubject.value;
  }
}

// Component A - Sender
@Component({
  selector: 'app-sender',
  template: \`
    <div class="sender">
      <h3>Sender Component</h3>
      <input [(ngModel)]="messageInput" placeholder="Enter message">
      <button (click)="sendMessage()">Send Message</button>
      
      <button (click)="sendData()">Send Data</button>
      <button (click)="sendEvent()">Send Event</button>
      <button (click)="showNotification()">Show Notification</button>
    </div>
  \`
})
export class SenderComponent {
  messageInput = '';

  constructor(private communicationService: CommunicationService) {}

  sendMessage() {
    this.communicationService.sendMessage(this.messageInput);
    this.messageInput = '';
  }

  sendData() {
    const data = {
      timestamp: new Date(),
      randomValue: Math.random(),
      source: 'sender-component'
    };
    this.communicationService.updateData(data);
  }

  sendEvent() {
    const event: AppEvent = {
      type: 'USER_ACTION',
      payload: {
        action: 'button_click',
        component: 'sender',
        timestamp: Date.now()
      }
    };
    this.communicationService.emitEvent(event);
  }

  showNotification() {
    const notification: Notification = {
      type: 'success',
      message: 'Message sent successfully!',
      duration: 3000
    };
    this.communicationService.showNotification(notification);
  }
}

// Component B - Receiver
@Component({
  selector: 'app-receiver',
  template: \`
    <div class="receiver">
      <h3>Receiver Component</h3>
      <p>Last Message: {{ lastMessage }}</p>
      <p>Last Data: {{ lastData | json }}</p>
      <p>Current User: {{ (user$ | async)?.name }}</p>
      
      <div class="events">
        <h4>Recent Events:</h4>
        <div *ngFor="let event of recentEvents">
          {{ event.type }} - {{ event.payload | json }}
        </div>
      </div>
    </div>
  \`
})
export class ReceiverComponent implements OnInit, OnDestroy {
  lastMessage = '';
  lastData: any = null;
  recentEvents: AppEvent[] = [];
  user$ = this.communicationService.user$;
  
  private destroy$ = new Subject<void>();

  constructor(private communicationService: CommunicationService) {}

  ngOnInit() {
    // Subscribe to messages
    this.communicationService.message$
      .pipe(takeUntil(this.destroy$))
      .subscribe(message => {
        if (message) {
          this.lastMessage = message;
          console.log('Received message:', message);
        }
      });

    // Subscribe to data updates
    this.communicationService.data$
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        if (data) {
          this.lastData = data;
          console.log('Received data:', data);
        }
      });

    // Subscribe to events
    this.communicationService.events$
      .pipe(takeUntil(this.destroy$))
      .subscribe(event => {
        this.recentEvents.unshift(event);
        // Keep only last 5 events
        if (this.recentEvents.length > 5) {
          this.recentEvents = this.recentEvents.slice(0, 5);
        }
        console.log('Received event:', event);
      });

    // Subscribe to notifications
    this.communicationService.notifications$
      .pipe(takeUntil(this.destroy$))
      .subscribe(notification => {
        this.handleNotification(notification);
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private handleNotification(notification: Notification) {
    console.log('Notification:', notification);
    // Show toast, modal, or other UI feedback
  }
}

// Interfaces
interface AppEvent {
  type: string;
  payload: any;
}

interface Notification {
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
}`,
    },
    {
      title: "ViewChild and Template Reference Variables",
      code: `// Parent Component
@Component({
  selector: 'app-parent',
  template: \`
    <div class="parent">
      <h2>Parent Component</h2>
      
      <!-- Template reference variables -->
      <input #messageInput placeholder="Enter message">
      <button (click)="sendToChild(messageInput.value)">Send to Child</button>
      
      <!-- ViewChild reference -->
      <app-child #childComponent 
        [initialMessage]="parentMessage"
        (responseEvent)="onChildResponse($event)">
      </app-child>
      
      <!-- Multiple children -->
      <app-child #child1></app-child>
      <app-child #child2></app-child>
      <app-child #child3></app-child>
      
      <button (click)="callChildMethod()">Call Child Method</button>
      <button (click)="getChildData()">Get Child Data</button>
      <button (click)="updateAllChildren()">Update All Children</button>
    </div>
  \`
})
export class ParentComponent implements AfterViewInit {
  // Single child reference
  @ViewChild('childComponent') childComponent!: ChildComponent;
  
  // Multiple children references
  @ViewChildren('child1,child2,child3') children!: QueryList<ChildComponent>;
  
  // Element reference
  @ViewChild('messageInput') messageInput!: ElementRef<HTMLInputElement>;

  parentMessage = 'Hello from parent!';

  ngAfterViewInit() {
    // Access child component after view initialization
    console.log('Child component:', this.childComponent);
    
    // Access multiple children
    console.log('Number of children:', this.children.length);
    
    // Listen to changes in children
    this.children.changes.subscribe(children => {
      console.log('Children changed:', children.length);
    });
  }

  sendToChild(message: string) {
    if (this.childComponent) {
      this.childComponent.receiveMessage(message);
    }
    
    // Clear input
    if (this.messageInput) {
      this.messageInput.nativeElement.value = '';
    }
  }

  callChildMethod() {
    if (this.childComponent) {
      const result = this.childComponent.performAction('test');
      console.log('Child method result:', result);
    }
  }

  getChildData() {
    if (this.childComponent) {
      const data = this.childComponent.getData();
      console.log('Child data:', data);
    }
  }

  updateAllChildren() {
    this.children.forEach((child, index) => {
      child.updateMessage(\`Updated message \${index + 1}\`);
    });
  }

  onChildResponse(response: string) {
    console.log('Child response:', response);
  }
}

// Child Component
@Component({
  selector: 'app-child',
  template: \`
    <div class="child">
      <h3>Child Component</h3>
      <p>Message: {{ message }}</p>
      <p>Internal Data: {{ internalData | json }}</p>
      
      <input #childInput [(ngModel)]="inputValue">
      <button (click)="sendResponse()">Send Response</button>
    </div>
  \`
})
export class ChildComponent {
  @Input() initialMessage = '';
  @Output() responseEvent = new EventEmitter<string>();
  
  @ViewChild('childInput') childInput!: ElementRef<HTMLInputElement>;

  message = '';
  inputValue = '';
  internalData = {
    counter: 0,
    timestamp: new Date(),
    active: true
  };

  ngOnInit() {
    this.message = this.initialMessage;
  }

  // Public methods that parent can call
  receiveMessage(message: string) {
    this.message = message;
    this.internalData.counter++;
    this.internalData.timestamp = new Date();
  }

  performAction(param: string): string {
    console.log('Child performing action with:', param);
    this.internalData.counter++;
    return \`Action completed with \${param}\`;
  }

  getData() {
    return {
      message: this.message,
      inputValue: this.inputValue,
      internalData: this.internalData
    };
  }

  updateMessage(newMessage: string) {
    this.message = newMessage;
  }

  sendResponse() {
    this.responseEvent.emit(\`Response: \${this.inputValue}\`);
    this.inputValue = '';
  }

  // Method to focus input (can be called by parent)
  focusInput() {
    if (this.childInput) {
      this.childInput.nativeElement.focus();
    }
  }
}`,
    },
  ]

  const interviewQuestions = [
    {
      question: "What are the different ways components can communicate in Angular?",
      answer:
        "Components can communicate through: 1) @Input/@Output for parent-child, 2) Services with observables for any components, 3) ViewChild/ViewChildren for parent accessing child, 4) Template reference variables, 5) Content projection with @ContentChild, 6) State management libraries like NgRx.",
    },
    {
      question: "When should you use @Input/@Output vs services for component communication?",
      answer:
        "Use @Input/@Output for direct parent-child relationships and simple data passing. Use services for: distant components, complex state sharing, multiple components needing same data, business logic coordination, and when you need to maintain state across component lifecycle.",
    },
    {
      question: "What's the difference between @ViewChild and @ContentChild?",
      answer:
        "@ViewChild queries elements in the component's template (view). @ContentChild queries elements projected into the component via ng-content. ViewChild is for internal template elements, ContentChild is for projected content from parent.",
    },
    {
      question: "How do you prevent memory leaks in service-based communication?",
      answer:
        "Use takeUntil pattern with destroy subject, unsubscribe in ngOnDestroy, use async pipe for automatic unsubscription, avoid storing subscriptions in component properties, use operators like switchMap to cancel previous subscriptions, and complete subjects properly.",
    },
    {
      question: "What are the advantages and disadvantages of different communication patterns?",
      answer:
        "@Input/@Output: Simple but limited to parent-child. Services: Flexible but can create tight coupling. ViewChild: Direct access but breaks encapsulation. State management: Predictable but adds complexity. Choose based on relationship, complexity, and maintainability needs.",
    },
  ]

  return (
    <PageLayout
      title="Component Communication"
      description="Master all patterns of component communication in Angular applications"
      previousPage={{ href: "/intermediate/lifecycle-hooks", title: "Lifecycle Hooks" }}
      nextPage={{ href: "/advanced", title: "Advanced Topics" }}
    >
      <div className="space-y-8">
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Theory Overview</h2>
          <div className="prose prose-gray max-w-none">
            <p>
              Component communication is essential for building complex Angular applications. Different patterns serve
              different use cases, from simple parent-child relationships to complex state sharing across the entire
              application.
            </p>

            <h3>Communication Patterns:</h3>
            <ul>
              <li>
                <strong>@Input/@Output:</strong> Parent-child communication with property binding and event emission
              </li>
              <li>
                <strong>Services with Observables:</strong> Any-to-any communication using shared services
              </li>
              <li>
                <strong>ViewChild/ViewChildren:</strong> Parent accessing child component methods and properties
              </li>
              <li>
                <strong>ContentChild/ContentChildren:</strong> Accessing projected content
              </li>
              <li>
                <strong>Template Reference Variables:</strong> Direct template-based communication
              </li>
              <li>
                <strong>State Management:</strong> Centralized state with NgRx, Akita, or NGXS
              </li>
            </ul>

            <h3>When to Use Each Pattern:</h3>
            <ul>
              <li>
                <strong>@Input/@Output:</strong> Direct parent-child relationships, simple data flow
              </li>
              <li>
                <strong>Services:</strong> Sibling components, distant components, shared state
              </li>
              <li>
                <strong>ViewChild:</strong> Parent needs to call child methods or access properties
              </li>
              <li>
                <strong>State Management:</strong> Complex applications with multiple data sources
              </li>
            </ul>

            <h3>Best Practices:</h3>
            <ul>
              <li>Keep communication patterns simple and predictable</li>
              <li>Use appropriate pattern for the relationship type</li>
              <li>Avoid circular dependencies</li>
              <li>Handle unsubscription properly to prevent memory leaks</li>
              <li>Consider using OnPush change detection with observables</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Code Examples</h2>
          <div className="space-y-6">
            {communicationExamples.map((example, index) => (
              <CodeExample key={index} title={example.title} code={example.code} language="typescript" />
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Best Practices</h2>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <ul className="space-y-2 text-gray-700">
              <li>• Choose the right communication pattern for the relationship</li>
              <li>• Always unsubscribe from observables to prevent memory leaks</li>
              <li>• Use TypeScript interfaces for type safety in communication</li>
              <li>• Keep event payloads simple and focused</li>
              <li>• Avoid deep component hierarchies with prop drilling</li>
              <li>• Use services for business logic, not just communication</li>
              <li>• Consider using OnPush change detection with observables</li>
              <li>• Document communication contracts between components</li>
            </ul>
          </div>
        </section>

        <InterviewQuestions questions={interviewQuestions} />
      </div>
    </PageLayout>
  )
}
