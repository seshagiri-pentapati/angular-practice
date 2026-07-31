import PageLayout from "../../../components/page-layout"
import CodeExample from "../../../components/code-example"
import InterviewQuestions from "../../../components/interview-questions"

export default function ObserverPage() {
  const observerExamples = [
    {
      title: "Observer Pattern with RxJS Subjects",
      code: `// Event Bus Service using Observer Pattern
import { Injectable } from '@angular/core';
import { Subject, BehaviorSubject, ReplaySubject, Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';

// Event interface
interface AppEvent {
  type: string;
  payload?: any;
  timestamp: Date;
}

@Injectable({
  providedIn: 'root'
})
export class EventBusService {
  // Subject for general events
  private eventSubject = new Subject<AppEvent>();
  
  // BehaviorSubject for state that needs initial value
  private userStateSubject = new BehaviorSubject<User | null>(null);
  
  // ReplaySubject for events that should be replayed to new subscribers
  private notificationSubject = new ReplaySubject<Notification>(5);

  constructor() {
    console.log('EventBusService initialized');
  }

  // Emit events
  emit(type: string, payload?: any): void {
    const event: AppEvent = {
      type,
      payload,
      timestamp: new Date()
    };
    this.eventSubject.next(event);
  }

  // Subscribe to specific event types
  on(eventType: string): Observable<AppEvent> {
    return this.eventSubject.pipe(
      filter(event => event.type === eventType)
    );
  }

  // Subscribe to all events
  onAll(): Observable<AppEvent> {
    return this.eventSubject.asObservable();
  }

  // User state management
  setUser(user: User | null): void {
    this.userStateSubject.next(user);
  }

  getUser(): Observable<User | null> {
    return this.userStateSubject.asObservable();
  }

  getCurrentUser(): User | null {
    return this.userStateSubject.value;
  }

  // Notification management
  addNotification(notification: Notification): void {
    this.notificationSubject.next(notification);
  }

  getNotifications(): Observable<Notification> {
    return this.notificationSubject.asObservable();
  }
}

// Custom Observable Service
@Injectable({
  providedIn: 'root'
})
export class DataService {
  private dataSubject = new BehaviorSubject<any[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private errorSubject = new BehaviorSubject<string | null>(null);

  // Public observables
  public data$ = this.dataSubject.asObservable();
  public loading$ = this.loadingSubject.asObservable();
  public error$ = this.errorSubject.asObservable();

  constructor(private http: HttpClient) {}

  loadData(): void {
    this.loadingSubject.next(true);
    this.errorSubject.next(null);

    this.http.get<any[]>('/api/data').subscribe({
      next: (data) => {
        this.dataSubject.next(data);
        this.loadingSubject.next(false);
      },
      error: (error) => {
        this.errorSubject.next(error.message);
        this.loadingSubject.next(false);
      }
    });
  }

  addItem(item: any): void {
    const currentData = this.dataSubject.value;
    this.dataSubject.next([...currentData, item]);
  }

  updateItem(id: number, updates: Partial<any>): void {
    const currentData = this.dataSubject.value;
    const updatedData = currentData.map(item => 
      item.id === id ? { ...item, ...updates } : item
    );
    this.dataSubject.next(updatedData);
  }

  removeItem(id: number): void {
    const currentData = this.dataSubject.value;
    const filteredData = currentData.filter(item => item.id !== id);
    this.dataSubject.next(filteredData);
  }
}

// Component using Observer Pattern
@Component({
  selector: 'app-dashboard',
  template: \`
    <div class="dashboard">
      <h2>Dashboard</h2>
      
      <!-- User Info -->
      <div class="user-info" *ngIf="user$ | async as user">
        <h3>Welcome, {{ user.name }}!</h3>
        <p>{{ user.email }}</p>
      </div>
      
      <!-- Data Display -->
      <div class="data-section">
        <div *ngIf="loading$ | async" class="loading">Loading...</div>
        <div *ngIf="error$ | async as error" class="error">Error: {{ error }}</div>
        
        <div class="data-list">
          <div *ngFor="let item of data$ | async" class="data-item">
            {{ item.name }} - {{ item.value }}
            <button (click)="updateItem(item.id)">Update</button>
            <button (click)="removeItem(item.id)">Remove</button>
          </div>
        </div>
        
        <button (click)="loadData()">Refresh Data</button>
        <button (click)="addNewItem()">Add Item</button>
      </div>
      
      <!-- Notifications -->
      <div class="notifications">
        <h3>Notifications</h3>
        <div *ngFor="let notification of notifications" class="notification">
          {{ notification.message }}
        </div>
      </div>
      
      <!-- Event Log -->
      <div class="event-log">
        <h3>Recent Events</h3>
        <div *ngFor="let event of recentEvents" class="event">
          {{ event.type }}: {{ event.payload | json }} at {{ event.timestamp | date:'short' }}
        </div>
      </div>
    </div>
  \`
})
export class DashboardComponent implements OnInit, OnDestroy {
  user$: Observable<User | null>;
  data$: Observable<any[]>;
  loading$: Observable<boolean>;
  error$: Observable<string | null>;
  
  notifications: Notification[] = [];
  recentEvents: AppEvent[] = [];
  
  private destroy$ = new Subject<void>();

  constructor(
    private eventBus: EventBusService,
    private dataService: DataService
  ) {
    this.user$ = this.eventBus.getUser();
    this.data$ = this.dataService.data$;
    this.loading$ = this.dataService.loading$;
    this.error$ = this.dataService.error$;
  }

  ngOnInit() {
    // Subscribe to user login events
    this.eventBus.on('USER_LOGIN')
      .pipe(takeUntil(this.destroy$))
      .subscribe(event => {
        console.log('User logged in:', event.payload);
        this.eventBus.addNotification({
          id: Date.now(),
          message: \`Welcome back, \${event.payload.name}!\`,
          type: 'success'
        });
      });

    // Subscribe to data changes
    this.eventBus.on('DATA_UPDATED')
      .pipe(takeUntil(this.destroy$))
      .subscribe(event => {
        console.log('Data updated:', event.payload);
      });

    // Subscribe to all events for logging
    this.eventBus.onAll()
      .pipe(takeUntil(this.destroy$))
      .subscribe(event => {
        this.recentEvents.unshift(event);
        if (this.recentEvents.length > 10) {
          this.recentEvents = this.recentEvents.slice(0, 10);
        }
      });

    // Subscribe to notifications
    this.eventBus.getNotifications()
      .pipe(takeUntil(this.destroy$))
      .subscribe(notification => {
        this.notifications.unshift(notification);
        if (this.notifications.length > 5) {
          this.notifications = this.notifications.slice(0, 5);
        }
      });

    // Load initial data
    this.dataService.loadData();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadData() {
    this.dataService.loadData();
    this.eventBus.emit('DATA_REFRESH_REQUESTED');
  }

  addNewItem() {
    const newItem = {
      id: Date.now(),
      name: \`Item \${Date.now()}\`,
      value: Math.floor(Math.random() * 100)
    };
    this.dataService.addItem(newItem);
    this.eventBus.emit('ITEM_ADDED', newItem);
  }

  updateItem(id: number) {
    const updates = { value: Math.floor(Math.random() * 100) };
    this.dataService.updateItem(id, updates);
    this.eventBus.emit('ITEM_UPDATED', { id, updates });
  }

  removeItem(id: number) {
    this.dataService.removeItem(id);
    this.eventBus.emit('ITEM_REMOVED', { id });
  }
}

// Another component observing the same services
@Component({
  selector: 'app-sidebar',
  template: \`
    <div class="sidebar">
      <div *ngIf="user$ | async as user" class="user-widget">
        <img [src]="user.avatar" [alt]="user.name">
        <span>{{ user.name }}</span>
        <button (click)="logout()">Logout</button>
      </div>
      
      <div class="stats">
        <p>Total Items: {{ (data$ | async)?.length || 0 }}</p>
        <p>Loading: {{ (loading$ | async) ? 'Yes' : 'No' }}</p>
      </div>
      
      <div class="quick-actions">
        <button (click)="triggerRefresh()">Refresh All</button>
        <button (click)="clearNotifications()">Clear Notifications</button>
      </div>
    </div>
  \`
})
export class SidebarComponent implements OnInit, OnDestroy {
  user$: Observable<User | null>;
  data$: Observable<any[]>;
  loading$: Observable<boolean>;
  
  private destroy$ = new Subject<void>();

  constructor(
    private eventBus: EventBusService,
    private dataService: DataService
  ) {
    this.user$ = this.eventBus.getUser();
    this.data$ = this.dataService.data$;
    this.loading$ = this.dataService.loading$;
  }

  ngOnInit() {
    // Listen for logout events
    this.eventBus.on('USER_LOGOUT')
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        console.log('User logged out from sidebar');
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  logout() {
    this.eventBus.setUser(null);
    this.eventBus.emit('USER_LOGOUT');
  }

  triggerRefresh() {
    this.eventBus.emit('GLOBAL_REFRESH_REQUESTED');
  }

  clearNotifications() {
    this.eventBus.emit('CLEAR_NOTIFICATIONS');
  }
}

// Types
interface User {
  id: number;
  name: string;
  email: string;
  avatar: string;
}

interface Notification {
  id: number;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
}`,
    },
    {
      title: "Custom Observable and Observer Implementation",
      code: `// Custom Observable Implementation
class CustomObservable<T> {
  private observers: Observer<T>[] = [];

  constructor(private producer: (observer: Observer<T>) => void) {}

  subscribe(observer: Observer<T>): Subscription {
    this.observers.push(observer);
    this.producer(observer);

    // Return subscription with unsubscribe method
    return {
      unsubscribe: () => {
        const index = this.observers.indexOf(observer);
        if (index > -1) {
          this.observers.splice(index, 1);
        }
      }
    };
  }

  // Static creation methods
  static create<T>(producer: (observer: Observer<T>) => void): CustomObservable<T> {
    return new CustomObservable(producer);
  }

  static of<T>(...values: T[]): CustomObservable<T> {
    return new CustomObservable(observer => {
      values.forEach(value => observer.next(value));
      observer.complete();
    });
  }

  static fromEvent<T>(element: EventTarget, eventName: string): CustomObservable<T> {
    return new CustomObservable(observer => {
      const handler = (event: Event) => observer.next(event as T);
      element.addEventListener(eventName, handler);
      
      // Return cleanup function
      return () => element.removeEventListener(eventName, handler);
    });
  }

  // Operators
  map<U>(transform: (value: T) => U): CustomObservable<U> {
    return new CustomObservable(observer => {
      return this.subscribe({
        next: value => observer.next(transform(value)),
        error: error => observer.error(error),
        complete: () => observer.complete()
      });
    });
  }

  filter(predicate: (value: T) => boolean): CustomObservable<T> {
    return new CustomObservable(observer => {
      return this.subscribe({
        next: value => {
          if (predicate(value)) {
            observer.next(value);
          }
        },
        error: error => observer.error(error),
        complete: () => observer.complete()
      });
    });
  }
}

// Observer interface
interface Observer<T> {
  next: (value: T) => void;
  error: (error: any) => void;
  complete: () => void;
}

// Subscription interface
interface Subscription {
  unsubscribe: () => void;
}

// Custom Subject Implementation
class CustomSubject<T> extends CustomObservable<T> implements Observer<T> {
  private observers: Observer<T>[] = [];
  private isStopped = false;
  private hasError = false;
  private thrownError: any = null;

  constructor() {
    super(observer => {
      if (this.hasError) {
        observer.error(this.thrownError);
        return;
      }
      if (this.isStopped) {
        observer.complete();
        return;
      }
      this.observers.push(observer);
      return {
        unsubscribe: () => {
          const index = this.observers.indexOf(observer);
          if (index > -1) {
            this.observers.splice(index, 1);
          }
        }
      };
    });
  }

  next(value: T): void {
    if (this.isStopped) return;
    
    this.observers.forEach(observer => {
      try {
        observer.next(value);
      } catch (error) {
        observer.error(error);
      }
    });
  }

  error(error: any): void {
    if (this.isStopped) return;
    
    this.hasError = true;
    this.thrownError = error;
    this.isStopped = true;
    
    this.observers.forEach(observer => observer.error(error));
    this.observers = [];
  }

  complete(): void {
    if (this.isStopped) return;
    
    this.isStopped = true;
    this.observers.forEach(observer => observer.complete());
    this.observers = [];
  }

  asObservable(): CustomObservable<T> {
    return new CustomObservable(observer => this.subscribe(observer));
  }
}

// Usage Example Service
@Injectable({
  providedIn: 'root'
})
export class CustomObserverService {
  private messageSubject = new CustomSubject<string>();
  private clickSubject = new CustomSubject<MouseEvent>();

  constructor() {
    this.setupClickListener();
  }

  // Message methods
  sendMessage(message: string): void {
    this.messageSubject.next(message);
  }

  getMessages(): CustomObservable<string> {
    return this.messageSubject.asObservable();
  }

  // Click tracking
  private setupClickListener(): void {
    if (typeof document !== 'undefined') {
      document.addEventListener('click', (event: MouseEvent) => {
        this.clickSubject.next(event);
      });
    }
  }

  getClicks(): CustomObservable<MouseEvent> {
    return this.clickSubject.asObservable();
  }

  // Custom observable creation
  createTimer(interval: number): CustomObservable<number> {
    return CustomObservable.create(observer => {
      let count = 0;
      const timer = setInterval(() => {
        observer.next(count++);
      }, interval);

      // Return cleanup function
      return () => clearInterval(timer);
    });
  }

  createMousePosition(): CustomObservable<{x: number, y: number}> {
    return CustomObservable.create(observer => {
      const handler = (event: MouseEvent) => {
        observer.next({ x: event.clientX, y: event.clientY });
      };

      if (typeof document !== 'undefined') {
        document.addEventListener('mousemove', handler);
        return () => document.removeEventListener('mousemove', handler);
      }
    });
  }
}

// Component using custom observables
@Component({
  selector: 'app-custom-observer-demo',
  template: \`
    <div class="demo">
      <h3>Custom Observer Pattern Demo</h3>
      
      <div class="message-section">
        <input #messageInput type="text" placeholder="Enter message">
        <button (click)="sendMessage(messageInput.value); messageInput.value = ''">
          Send Message
        </button>
        
        <div class="messages">
          <div *ngFor="let message of messages" class="message">
            {{ message }}
          </div>
        </div>
      </div>
      
      <div class="timer-section">
        <p>Timer: {{ timerValue }}</p>
        <button (click)="startTimer()" [disabled]="timerRunning">Start Timer</button>
        <button (click)="stopTimer()" [disabled]="!timerRunning">Stop Timer</button>
      </div>
      
      <div class="mouse-section">
        <p>Mouse Position: {{ mousePosition.x }}, {{ mousePosition.y }}</p>
        <p>Click Count: {{ clickCount }}</p>
      </div>
    </div>
  \`
})
export class CustomObserverDemoComponent implements OnInit, OnDestroy {
  messages: string[] = [];
  timerValue = 0;
  timerRunning = false;
  mousePosition = { x: 0, y: 0 };
  clickCount = 0;

  private subscriptions: Subscription[] = [];

  constructor(private customObserverService: CustomObserverService) {}

  ngOnInit() {
    // Subscribe to messages
    const messagesSub = this.customObserverService.getMessages()
      .subscribe({
        next: message => {
          this.messages.push(message);
          if (this.messages.length > 10) {
            this.messages = this.messages.slice(-10);
          }
        },
        error: error => console.error('Message error:', error),
        complete: () => console.log('Messages completed')
      });
    this.subscriptions.push(messagesSub);

    // Subscribe to clicks
    const clicksSub = this.customObserverService.getClicks()
      .subscribe({
        next: () => this.clickCount++,
        error: error => console.error('Click error:', error),
        complete: () => console.log('Clicks completed')
      });
    this.subscriptions.push(clicksSub);

    // Subscribe to mouse position
    const mouseSub = this.customObserverService.createMousePosition()
      .subscribe({
        next: position => this.mousePosition = position,
        error: error => console.error('Mouse error:', error),
        complete: () => console.log('Mouse completed')
      });
    this.subscriptions.push(mouseSub);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  sendMessage(message: string) {
    if (message.trim()) {
      this.customObserverService.sendMessage(message);
    }
  }

  startTimer() {
    if (!this.timerRunning) {
      this.timerRunning = true;
      const timerSub = this.customObserverService.createTimer(1000)
        .subscribe({
          next: value => this.timerValue = value,
          error: error => {
            console.error('Timer error:', error);
            this.timerRunning = false;
          },
          complete: () => this.timerRunning = false
        });
      this.subscriptions.push(timerSub);
    }
  }

  stopTimer() {
    this.timerRunning = false;
    // Find and unsubscribe timer subscription
    // In a real implementation, you'd track this more carefully
  }
}`,
    },
  ]

  const interviewQuestions = [
    {
      question: "What is the Observer pattern and how is it implemented in Angular?",
      answer:
        "The Observer pattern defines a one-to-many dependency between objects where when one object changes state, all dependents are notified automatically. In Angular, it's implemented through RxJS Observables and Subjects, allowing components to subscribe to data changes and react accordingly. Services emit events, and components observe these changes.",
    },
    {
      question: "What's the difference between Subject, BehaviorSubject, and ReplaySubject?",
      answer:
        "Subject: Basic observable that multicasts to observers, no initial value. BehaviorSubject: Stores current value, emits it to new subscribers immediately, requires initial value. ReplaySubject: Stores specified number of previous values, replays them to new subscribers. Use BehaviorSubject for state, ReplaySubject for event history, Subject for simple notifications.",
    },
    {
      question: "How do you prevent memory leaks when using Observables in Angular?",
      answer:
        "Use takeUntil operator with a destroy subject, unsubscribe in ngOnDestroy, use async pipe in templates (auto-unsubscribes), avoid subscribing in constructors, use finite observables when possible, and implement OnDestroy interface. The async pipe is preferred as it handles subscription lifecycle automatically.",
    },
    {
      question: "When would you use hot vs cold observables in Angular?",
      answer:
        "Cold observables: Each subscription creates a new execution (HTTP requests, timers). Hot observables: Share execution among subscribers (DOM events, Subjects). Use cold for data fetching, hot for shared state management. Convert cold to hot using share() operator when multiple subscribers need the same data source.",
    },
    {
      question: "How do you implement a custom Observable in Angular?",
      answer:
        "Create Observable using new Observable(observer => {...}), implement next(), error(), and complete() methods, return unsubscribe function for cleanup, use operators like map() and filter() for transformation. Custom observables are useful for wrapping non-Observable APIs or creating specialized data streams.",
    },
    {
      question: "What are the benefits of using the Observer pattern in Angular applications?",
      answer:
        "Benefits include: loose coupling between components, reactive programming model, automatic UI updates, efficient change detection, composable data streams, error handling, and asynchronous data handling. It enables building responsive applications that react to data changes automatically.",
    },
    {
      question: "How do you handle errors in Observable streams?",
      answer:
        "Use catchError operator to handle errors gracefully, implement error callbacks in subscribe(), use retry/retryWhen for automatic retries, provide fallback values with catchError(() => of(defaultValue)), log errors for debugging, and use finalize for cleanup. Always handle errors to prevent stream termination.",
    },
    {
      question: "What's the role of operators in the Observer pattern implementation?",
      answer:
        "Operators transform, filter, combine, and manipulate observable streams. They enable functional programming patterns, create pipelines for data transformation, handle asynchronous operations, and compose complex data flows. Common operators include map, filter, mergeMap, switchMap, combineLatest, and debounceTime for various use cases.",
    },
  ]

  return (
    <PageLayout
      title="Observer Pattern"
      description="Master the Observer pattern in Angular using RxJS for reactive programming and event handling"
    >
      <div className="space-y-8">
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-cyan-400">Overview</h2>
          <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700">
            <p className="text-slate-300 leading-relaxed mb-4">
              The Observer pattern is fundamental to Angular's reactive programming model. It defines a subscription
              mechanism to notify multiple objects about events that happen to the object they're observing. Angular
              leverages RxJS extensively to implement this pattern, enabling reactive data flow and event handling
              throughout applications.
            </p>
            <div className="grid md:grid-cols-2 gap-4 mt-6">
              <div className="bg-slate-900/50 p-4 rounded border border-slate-600">
                <h3 className="font-semibold text-pink-400 mb-2">Key Components</h3>
                <ul className="text-sm text-slate-300 space-y-1">
                  <li>• Observable (Subject)</li>
                  <li>• Observer (Subscriber)</li>
                  <li>• Subscription</li>
                  <li>• Operators</li>
                  <li>• Subjects</li>
                  <li>• Event Emitters</li>
                </ul>
              </div>
              <div className="bg-slate-900/50 p-4 rounded border border-slate-600">
                <h3 className="font-semibold text-pink-400 mb-2">Angular Use Cases</h3>
                <ul className="text-sm text-slate-300 space-y-1">
                  <li>• HTTP requests</li>
                  <li>• Form value changes</li>
                  <li>• Route parameter changes</li>
                  <li>• Component communication</li>
                  <li>• State management</li>
                  <li>• Event handling</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-cyan-400">Code Examples</h2>
          <div className="space-y-6">
            {observerExamples.map((example, index) => (
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
