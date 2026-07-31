import { PageLayout } from "@/components/page-layout"
import { CodeExample } from "@/components/code-example"
import { InterviewQuestions } from "@/components/interview-questions"

export default function ChangeDetectionPage() {
  const changeDetectionExamples = [
    {
      title: "Default vs OnPush Change Detection",
      code: `// Default Change Detection Strategy
@Component({
  selector: 'app-default-component',
  template: \`
    <div class="component">
      <h3>Default Component ({{ counter }})</h3>
      <p>User: {{ user.name }} - {{ user.email }}</p>
      <p>Items count: {{ items.length }}</p>
      <button (click)="updateUser()">Update User</button>
      <button (click)="addItem()">Add Item</button>
    </div>
  \`,
  // changeDetection: ChangeDetectionStrategy.Default (default)
})
export class DefaultComponent {
  counter = 0;
  user = { name: 'John', email: 'john@example.com' };
  items: string[] = ['item1', 'item2'];

  constructor() {
    // This will trigger change detection every second
    setInterval(() => {
      this.counter++;
      console.log('Default component - counter updated:', this.counter);
    }, 1000);
  }

  updateUser() {
    // Mutating object - will trigger change detection
    this.user.name = 'Jane';
    this.user.email = 'jane@example.com';
  }

  addItem() {
    // Mutating array - will trigger change detection
    this.items.push(\`item\${this.items.length + 1}\`);
  }
}

// OnPush Change Detection Strategy
@Component({
  selector: 'app-onpush-component',
  template: \`
    <div class="component">
      <h3>OnPush Component ({{ counter }})</h3>
      <p>User: {{ user.name }} - {{ user.email }}</p>
      <p>Items count: {{ items.length }}</p>
      <p>Data: {{ data$ | async | json }}</p>
      
      <button (click)="updateUserCorrect()">Update User (Correct)</button>
      <button (click)="updateUserIncorrect()">Update User (Incorrect)</button>
      <button (click)="addItemCorrect()">Add Item (Correct)</button>
      <button (click)="triggerManualDetection()">Manual Detection</button>
    </div>
  \`,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OnPushComponent implements OnInit {
  @Input() user: User = { name: 'John', email: 'john@example.com' };
  @Input() items: string[] = ['item1', 'item2'];
  
  counter = 0;
  data$ = interval(1000).pipe(map(i => ({ value: i, timestamp: Date.now() })));

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    // This won't trigger change detection in OnPush
    setInterval(() => {
      this.counter++;
      console.log('OnPush component - counter updated:', this.counter);
    }, 1000);
  }

  updateUserCorrect() {
    // Immutable update - will trigger change detection
    this.user = { 
      ...this.user, 
      name: 'Jane', 
      email: 'jane@example.com' 
    };
  }

  updateUserIncorrect() {
    // Mutation - won't trigger change detection in OnPush
    this.user.name = 'Bob';
    this.user.email = 'bob@example.com';
    console.log('User mutated, but change detection not triggered');
  }

  addItemCorrect() {
    // Immutable update - will trigger change detection
    this.items = [...this.items, \`item\${this.items.length + 1}\`];
  }

  triggerManualDetection() {
    // Manually trigger change detection
    this.cdr.detectChanges();
    // or this.cdr.markForCheck(); to mark for next cycle
  }
}`,
    },
    {
      title: "Change Detection Optimization Techniques",
      code: `// Optimized Component with OnPush
@Component({
  selector: 'app-optimized-list',
  template: \`
    <div class="optimized-list">
      <h3>Optimized List Component</h3>
      
      <!-- Use trackBy for better performance -->
      <div class="items">
        <div 
          *ngFor="let item of items; trackBy: trackByItemId; index as i"
          class="item"
          [class.selected]="selectedIds.has(item.id)"
          (click)="toggleSelection(item.id)"
        >
          <span>{{ i + 1 }}. {{ item.name }}</span>
          <span class="price">{{ item.price | currency }}</span>
          
          <!-- Avoid function calls in templates -->
          <span class="status" [class]="getStatusClass(item.status)">
            {{ item.status }}
          </span>
          
          <!-- Better: use computed properties -->
          <span class="computed" [class]="item.statusClass">
            {{ item.displayStatus }}
          </span>
        </div>
      </div>
      
      <!-- Use OnPush with observables -->
      <div class="summary" *ngIf="summary$ | async as summary">
        <p>Total Items: {{ summary.totalItems }}</p>
        <p>Total Value: {{ summary.totalValue | currency }}</p>
        <p>Selected: {{ summary.selectedCount }}</p>
      </div>
      
      <button (click)="addRandomItem()">Add Random Item</button>
      <button (click)="removeSelected()">Remove Selected</button>
    </div>
  \`,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OptimizedListComponent implements OnInit, OnDestroy {
  @Input() set rawItems(items: RawItem[]) {
    // Transform data when input changes
    this._items = items.map(item => ({
      ...item,
      statusClass: this.getStatusClass(item.status),
      displayStatus: this.getDisplayStatus(item.status)
    }));
    this.updateSummary();
  }
  
  get items(): ProcessedItem[] {
    return this._items;
  }

  private _items: ProcessedItem[] = [];
  selectedIds = new Set<number>();
  
  // Use BehaviorSubject for reactive summary
  private summarySubject = new BehaviorSubject<Summary>({
    totalItems: 0,
    totalValue: 0,
    selectedCount: 0
  });
  
  summary$ = this.summarySubject.asObservable();
  
  private destroy$ = new Subject<void>();

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    // React to external data changes
    this.dataService.items$
      .pipe(takeUntil(this.destroy$))
      .subscribe(items => {
        this.rawItems = items;
        this.cdr.markForCheck(); // Mark for next change detection cycle
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // TrackBy function for ngFor optimization
  trackByItemId(index: number, item: ProcessedItem): number {
    return item.id;
  }

  toggleSelection(id: number) {
    if (this.selectedIds.has(id)) {
      this.selectedIds.delete(id);
    } else {
      this.selectedIds.add(id);
    }
    this.updateSummary();
  }

  addRandomItem() {
    const newItem: RawItem = {
      id: Date.now(),
      name: \`Item \${this.items.length + 1}\`,
      price: Math.random() * 100,
      status: Math.random() > 0.5 ? 'active' : 'inactive'
    };
    
    // Immutable update
    this.rawItems = [...this.items, newItem];
  }

  removeSelected() {
    // Immutable removal
    this.rawItems = this.items.filter(item => !this.selectedIds.has(item.id));
    this.selectedIds.clear();
  }

  // Pure functions for status handling
  private getStatusClass(status: string): string {
    switch (status) {
      case 'active': return 'status-active';
      case 'inactive': return 'status-inactive';
      case 'pending': return 'status-pending';
      default: return 'status-unknown';
    }
  }

  private getDisplayStatus(status: string): string {
    return status.charAt(0).toUpperCase() + status.slice(1);
  }

  private updateSummary() {
    const summary: Summary = {
      totalItems: this.items.length,
      totalValue: this.items.reduce((sum, item) => sum + item.price, 0),
      selectedCount: this.selectedIds.size
    };
    
    this.summarySubject.next(summary);
  }
}

// Custom Change Detection Strategy
@Component({
  selector: 'app-manual-detection',
  template: \`
    <div class="manual-detection">
      <h3>Manual Change Detection</h3>
      <p>Counter: {{ counter }}</p>
      <p>Last Update: {{ lastUpdate | date:'medium' }}</p>
      
      <button (click)="incrementWithDetection()">Increment + Detect</button>
      <button (click)="incrementWithoutDetection()">Increment Only</button>
      <button (click)="runDetection()">Run Detection</button>
      <button (click)="detachDetection()">Detach</button>
      <button (click)="reattachDetection()">Reattach</button>
    </div>
  \`,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ManualDetectionComponent {
  counter = 0;
  lastUpdate = new Date();

  constructor(private cdr: ChangeDetectorRef) {}

  incrementWithDetection() {
    this.counter++;
    this.lastUpdate = new Date();
    this.cdr.detectChanges(); // Immediate detection
  }

  incrementWithoutDetection() {
    this.counter++;
    this.lastUpdate = new Date();
    // No change detection - UI won't update
  }

  runDetection() {
    this.cdr.detectChanges();
  }

  detachDetection() {
    this.cdr.detach(); // Detach from change detection tree
    console.log('Change detection detached');
  }

  reattachDetection() {
    this.cdr.reattach(); // Reattach to change detection tree
    this.cdr.detectChanges(); // Update UI
    console.log('Change detection reattached');
  }
}

// Interfaces
interface RawItem {
  id: number;
  name: string;
  price: number;
  status: string;
}

interface ProcessedItem extends RawItem {
  statusClass: string;
  displayStatus: string;
}

interface Summary {
  totalItems: number;
  totalValue: number;
  selectedCount: number;
}`,
    },
    {
      title: "Zone.js and Async Operations",
      code: `// Understanding Zone.js behavior
@Component({
  selector: 'app-zone-demo',
  template: \`
    <div class="zone-demo">
      <h3>Zone.js Demo</h3>
      <p>Counter: {{ counter }}</p>
      <p>Async Counter: {{ asyncCounter }}</p>
      <p>Manual Counter: {{ manualCounter }}</p>
      
      <button (click)="syncIncrement()">Sync Increment</button>
      <button (click)="asyncIncrement()">Async Increment</button>
      <button (click)="outsideZoneIncrement()">Outside Zone</button>
      <button (click)="runInZone()">Run in Zone</button>
    </div>
  \`
})
export class ZoneDemoComponent implements OnInit {
  counter = 0;
  asyncCounter = 0;
  manualCounter = 0;

  constructor(private ngZone: NgZone) {}

  ngOnInit() {
    // This will trigger change detection
    setTimeout(() => {
      this.asyncCounter++;
      console.log('Async counter updated via setTimeout');
    }, 2000);

    // This won't trigger change detection
    this.ngZone.runOutsideAngular(() => {
      setInterval(() => {
        this.manualCounter++;
        console.log('Manual counter updated outside zone:', this.manualCounter);
      }, 1000);
    });
  }

  syncIncrement() {
    this.counter++;
    // Change detection triggered automatically
  }

  asyncIncrement() {
    // Zone.js patches setTimeout, so this triggers change detection
    setTimeout(() => {
      this.asyncCounter++;
    }, 100);
  }

  outsideZoneIncrement() {
    // Run outside Angular zone - no change detection
    this.ngZone.runOutsideAngular(() => {
      setTimeout(() => {
        this.manualCounter++;
        console.log('Updated outside zone - no change detection');
      }, 100);
    });
  }

  runInZone() {
    // Manually run inside zone to trigger change detection
    this.ngZone.run(() => {
      this.manualCounter++;
      console.log('Manually triggered change detection');
    });
  }
}

// Performance monitoring with Zone.js
@Component({
  selector: 'app-performance-monitor',
  template: \`
    <div class="performance-monitor">
      <h3>Performance Monitor</h3>
      <p>Change Detection Cycles: {{ cdCycles }}</p>
      <p>Average CD Time: {{ averageCdTime }}ms</p>
      
      <div class="heavy-list">
        <div *ngFor="let item of heavyList; trackBy: trackById">
          {{ item.name }} - {{ item.value }}
        </div>
      </div>
      
      <button (click)="addHeavyItems()">Add Heavy Items</button>
      <button (click)="clearList()">Clear List</button>
    </div>
  \`,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PerformanceMonitorComponent implements OnInit, OnDestroy {
  heavyList: HeavyItem[] = [];
  cdCycles = 0;
  cdTimes: number[] = [];
  
  get averageCdTime(): number {
    if (this.cdTimes.length === 0) return 0;
    return Math.round(this.cdTimes.reduce((a, b) => a + b, 0) / this.cdTimes.length);
  }

  constructor(
    private ngZone: NgZone,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    // Monitor change detection performance
    this.ngZone.onStable.subscribe(() => {
      console.log('Zone stable - change detection complete');
    });

    // Custom change detection monitoring
    this.monitorChangeDetection();
  }

  ngOnDestroy() {
    // Cleanup monitoring
  }

  trackById(index: number, item: HeavyItem): number {
    return item.id;
  }

  addHeavyItems() {
    const newItems: HeavyItem[] = [];
    for (let i = 0; i < 1000; i++) {
      newItems.push({
        id: Date.now() + i,
        name: \`Heavy Item \${this.heavyList.length + i + 1}\`,
        value: Math.random() * 1000,
        data: this.generateHeavyData()
      });
    }
    
    // Immutable update
    this.heavyList = [...this.heavyList, ...newItems];
    this.cdr.markForCheck();
  }

  clearList() {
    this.heavyList = [];
    this.cdr.markForCheck();
  }

  private generateHeavyData(): any {
    // Simulate heavy data processing
    const data: any = {};
    for (let i = 0; i < 100; i++) {
      data[\`prop\${i}\`] = Math.random();
    }
    return data;
  }

  private monitorChangeDetection() {
    const originalDetectChanges = this.cdr.detectChanges.bind(this.cdr);
    
    this.cdr.detectChanges = () => {
      const start = performance.now();
      originalDetectChanges();
      const end = performance.now();
      
      this.cdCycles++;
      this.cdTimes.push(end - start);
      
      // Keep only last 100 measurements
      if (this.cdTimes.length > 100) {
        this.cdTimes = this.cdTimes.slice(-100);
      }
      
      console.log(\`Change detection cycle \${this.cdCycles} took \${end - start}ms\`);
    };
  }
}

interface HeavyItem {
  id: number;
  name: string;
  value: number;
  data: any;
}`,
    },
  ]

  const interviewQuestions = [
    {
      question: "How does Angular's change detection work?",
      answer:
        "Angular uses Zone.js to patch async operations and trigger change detection. It runs a change detection cycle that checks all components from root to leaves, comparing current values with previous values. When changes are detected, the DOM is updated. The process runs after events, promises, timers, and HTTP requests.",
    },
    {
      question: "What's the difference between Default and OnPush change detection strategies?",
      answer:
        "Default strategy checks all components on every change detection cycle. OnPush strategy only checks when: 1) Input properties change (reference), 2) Event is triggered, 3) Observable emits (with async pipe), 4) Manual detection is triggered. OnPush provides better performance but requires immutable data patterns.",
    },
    {
      question: "When and how would you manually trigger change detection?",
      answer:
        "Manual change detection is needed when: 1) Using OnPush with mutations, 2) Running code outside Angular zone, 3) Working with third-party libraries. Use ChangeDetectorRef methods: detectChanges() for immediate detection, markForCheck() to mark for next cycle, detach()/reattach() to control detection.",
    },
    {
      question: "What is Zone.js and how does it relate to change detection?",
      answer:
        "Zone.js is a library that patches async operations (setTimeout, Promise, events) to notify Angular when async operations complete. It creates an execution context that persists across async operations. Angular uses Zone.js to automatically trigger change detection after async operations finish.",
    },
    {
      question: "How can you optimize change detection performance?",
      answer:
        "Optimize by: 1) Using OnPush strategy, 2) Implementing trackBy functions in ngFor, 3) Using immutable data structures, 4) Avoiding function calls in templates, 5) Using async pipe, 6) Running expensive operations outside Angular zone, 7) Using pure pipes, 8) Minimizing DOM manipulations.",
    },
  ]

  return (
    <PageLayout
      title="Change Detection & OnPush Strategy"
      description="Master Angular's change detection mechanism and optimization techniques"
      previousPage={{ href: "/intermediate/component-communication", title: "Component Communication" }}
      nextPage={{ href: "/advanced/dynamic-components", title: "Dynamic Components" }}
    >
      <div className="space-y-8">
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Theory Overview</h2>
          <div className="prose prose-gray max-w-none">
            <p>
              Change detection is Angular's mechanism for keeping the UI in sync with application state. Understanding
              how it works and how to optimize it is crucial for building performant Angular applications.
            </p>

            <h3>Change Detection Strategies:</h3>
            <ul>
              <li>
                <strong>Default:</strong> Checks all components on every change detection cycle
              </li>
              <li>
                <strong>OnPush:</strong> Only checks when inputs change, events occur, or observables emit
              </li>
            </ul>

            <h3>Change Detection Triggers:</h3>
            <ul>
              <li>DOM events (click, keyup, etc.)</li>
              <li>HTTP requests</li>
              <li>Timers (setTimeout, setInterval)</li>
              <li>Promises and Observables</li>
              <li>Manual triggers</li>
            </ul>

            <h3>Zone.js Role:</h3>
            <ul>
              <li>Patches async operations to notify Angular</li>
              <li>Creates execution contexts for change detection</li>
              <li>Automatically triggers change detection after async operations</li>
              <li>Can be bypassed for performance optimization</li>
            </ul>

            <h3>Performance Optimization Techniques:</h3>
            <ul>
              <li>Use OnPush change detection strategy</li>
              <li>Implement trackBy functions for ngFor</li>
              <li>Use immutable data structures</li>
              <li>Avoid function calls in templates</li>
              <li>Use async pipe for observables</li>
              <li>Run expensive operations outside Angular zone</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Code Examples</h2>
          <div className="space-y-6">
            {changeDetectionExamples.map((example, index) => (
              <CodeExample key={index} title={example.title} code={example.code} language="typescript" />
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Best Practices</h2>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <ul className="space-y-2 text-gray-700">
              <li>• Use OnPush strategy for better performance</li>
              <li>• Always use trackBy functions with ngFor</li>
              <li>• Prefer immutable data updates over mutations</li>
              <li>• Avoid heavy computations in templates</li>
              <li>• Use async pipe for automatic subscription management</li>
              <li>• Run non-UI operations outside Angular zone</li>
              <li>• Monitor change detection performance in development</li>
              <li>• Use pure pipes for expensive transformations</li>
            </ul>
          </div>
        </section>

        <InterviewQuestions questions={interviewQuestions} />
      </div>
    </PageLayout>
  )
}
