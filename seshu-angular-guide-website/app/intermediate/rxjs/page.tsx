import { PageLayout } from "@/components/page-layout"
import { CodeExample } from "@/components/code-example"
import { InterviewQuestions } from "@/components/interview-questions"

export default function RxJSPage() {
  const rxjsExamples = [
    {
      title: "Observable Creation and Subscription",
      code: `import { Observable, of, from, interval, fromEvent } from 'rxjs';
import { map, filter, take } from 'rxjs/operators';

// Creating Observables
const simpleObservable = new Observable(observer => {
  observer.next('Hello');
  observer.next('World');
  observer.complete();
});

// From array
const fromArray = from([1, 2, 3, 4, 5]);

// From promise
const fromPromise = from(fetch('/api/data'));

// From event
const clickObservable = fromEvent(document, 'click');

// Timer observable
const timerObservable = interval(1000);

// Subscribing to observables
simpleObservable.subscribe({
  next: value => console.log('Next:', value),
  error: error => console.error('Error:', error),
  complete: () => console.log('Complete!')
});

// Using operators
fromArray.pipe(
  filter(x => x % 2 === 0),
  map(x => x * 2),
  take(2)
).subscribe(value => console.log('Filtered and mapped:', value));`,
    },
    {
      title: "Common RxJS Operators",
      code: `import { of, from, interval, combineLatest, merge } from 'rxjs';
import { 
  map, filter, tap, switchMap, mergeMap, concatMap, 
  debounceTime, distinctUntilChanged, catchError, 
  retry, takeUntil, startWith, combineLatestWith 
} from 'rxjs/operators';

// Transformation Operators
const numbers = of(1, 2, 3, 4, 5);

// map - transform each value
numbers.pipe(
  map(x => x * 2)
).subscribe(console.log); // 2, 4, 6, 8, 10

// switchMap - switch to new observable, cancel previous
const searchTerm = of('angular', 'rxjs', 'typescript');
searchTerm.pipe(
  switchMap(term => this.searchService.search(term))
).subscribe(results => console.log(results));

// mergeMap - merge multiple observables
numbers.pipe(
  mergeMap(x => of(x).pipe(delay(x * 100)))
).subscribe(console.log);

// Filtering Operators
numbers.pipe(
  filter(x => x > 2),
  take(2)
).subscribe(console.log); // 3, 4

// Utility Operators
numbers.pipe(
  tap(x => console.log('Before:', x)),
  map(x => x * 2),
  tap(x => console.log('After:', x))
).subscribe();

// Error Handling
const failingObservable = of(1, 2, 3).pipe(
  map(x => {
    if (x === 2) throw new Error('Error at 2');
    return x;
  }),
  catchError(error => {
    console.error('Caught error:', error);
    return of('Error handled');
  }),
  retry(2)
);

// Combination Operators
const obs1 = interval(1000).pipe(map(x => \`A\${x}\`));
const obs2 = interval(1500).pipe(map(x => \`B\${x}\`));

combineLatest([obs1, obs2]).subscribe(([a, b]) => {
  console.log('Combined:', a, b);
});

merge(obs1, obs2).subscribe(value => {
  console.log('Merged:', value);
});`,
    },
    {
      title: "Subject Types and Usage",
      code: `import { Subject, BehaviorSubject, ReplaySubject, AsyncSubject } from 'rxjs';

// Regular Subject
const subject = new Subject<string>();

// Multiple subscribers
subject.subscribe(value => console.log('Subscriber 1:', value));
subject.subscribe(value => console.log('Subscriber 2:', value));

subject.next('Hello');
subject.next('World');

// BehaviorSubject - holds current value
const behaviorSubject = new BehaviorSubject<number>(0);

behaviorSubject.subscribe(value => console.log('Initial:', value)); // 0
behaviorSubject.next(1);
behaviorSubject.next(2);

// Late subscriber gets current value
behaviorSubject.subscribe(value => console.log('Late subscriber:', value)); // 2

// ReplaySubject - replays last N values
const replaySubject = new ReplaySubject<string>(2);

replaySubject.next('First');
replaySubject.next('Second');
replaySubject.next('Third');

// New subscriber gets last 2 values
replaySubject.subscribe(value => console.log('Replay:', value)); // Second, Third

// AsyncSubject - emits only last value on complete
const asyncSubject = new AsyncSubject<string>();

asyncSubject.next('First');
asyncSubject.next('Second');
asyncSubject.next('Last');
asyncSubject.complete(); // Only 'Last' is emitted

asyncSubject.subscribe(value => console.log('Async:', value)); // Last

// Service using BehaviorSubject
@Injectable({
  providedIn: 'root'
})
export class StateService {
  private userSubject = new BehaviorSubject<User | null>(null);
  public user$ = this.userSubject.asObservable();

  setUser(user: User) {
    this.userSubject.next(user);
  }

  getCurrentUser(): User | null {
    return this.userSubject.value;
  }

  clearUser() {
    this.userSubject.next(null);
  }
}`,
    },
    {
      title: "Async Pipe and Observables in Templates",
      code: `// Component
import { Component } from '@angular/core';
import { Observable, interval } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-async-demo',
  template: \`
    <div class="async-demo">
      <!-- Basic async pipe -->
      <h3>Current Time</h3>
      <p>{{ currentTime$ | async | date:'medium' }}</p>
      
      <!-- Async pipe with loading state -->
      <h3>Users</h3>
      <div *ngIf="users$ | async as users; else loading">
        <div *ngFor="let user of users" class="user">
          {{ user.name }} - {{ user.email }}
        </div>
      </div>
      
      <ng-template #loading>
        <div class="loading">Loading users...</div>
      </ng-template>
      
      <!-- Multiple async pipes (avoid this) -->
      <div class="bad-example">
        <p>Count: {{ counter$ | async }}</p>
        <p>Double: {{ (counter$ | async)! * 2 }}</p> <!-- Multiple subscriptions! -->
      </div>
      
      <!-- Better approach - single subscription -->
      <div class="good-example" *ngIf="counter$ | async as count">
        <p>Count: {{ count }}</p>
        <p>Double: {{ count * 2 }}</p>
      </div>
      
      <!-- Form with async validation -->
      <form [formGroup]="userForm">
        <input 
          formControlName="username" 
          placeholder="Username"
          [class.invalid]="usernameErrors$ | async"
        >
        <div *ngIf="usernameErrors$ | async as errors" class="errors">
          <div *ngFor="let error of errors">{{ error }}</div>
        </div>
      </form>
    </div>
  \`
})
export class AsyncDemoComponent {
  // Timer observable
  currentTime$ = interval(1000).pipe(
    map(() => new Date()),
    startWith(new Date())
  );
  
  // Data observable
  users$ = this.userService.getUsers();
  
  // Counter observable
  counter$ = interval(1000).pipe(
    map(i => i + 1),
    startWith(0)
  );
  
  // Form with async validation
  userForm = this.fb.group({
    username: ['', [], [this.asyncUsernameValidator.bind(this)]]
  });
  
  usernameErrors$ = this.userForm.get('username')!.statusChanges.pipe(
    map(() => {
      const control = this.userForm.get('username')!;
      return control.errors ? Object.keys(control.errors) : null;
    })
  );

  constructor(
    private userService: UserService,
    private fb: FormBuilder
  ) {}

  asyncUsernameValidator(control: AbstractControl): Observable<ValidationErrors | null> {
    if (!control.value) {
      return of(null);
    }
    
    return this.userService.checkUsernameAvailability(control.value).pipe(
      map(available => available ? null : { usernameTaken: true }),
      catchError(() => of(null))
    );
  }
}`,
    },
  ]

  const interviewQuestions = [
    {
      question: "What is RxJS and why is it important in Angular?",
      answer:
        "RxJS (Reactive Extensions for JavaScript) is a library for reactive programming using Observables. It's crucial in Angular because Angular's HTTP client, forms, routing, and many other features are built on RxJS. It provides powerful operators for handling asynchronous data streams, event handling, and complex data transformations.",
    },
    {
      question: "What's the difference between Observable and Promise?",
      answer:
        "Observables are lazy (don't execute until subscribed), can emit multiple values over time, are cancellable, and provide rich operators for transformation. Promises are eager (execute immediately), emit only one value, are not cancellable, and have limited transformation methods (then, catch).",
    },
    {
      question: "Explain the different types of Subjects in RxJS.",
      answer:
        "Subject: Basic multicast observable. BehaviorSubject: Stores current value, emits it to new subscribers. ReplaySubject: Replays last N values to new subscribers. AsyncSubject: Emits only the last value when completed. Each serves different use cases for state management and data sharing.",
    },
    {
      question: "What is the async pipe and how does it work?",
      answer:
        "The async pipe subscribes to an Observable/Promise and returns the latest value. It automatically subscribes when the component initializes and unsubscribes when the component is destroyed, preventing memory leaks. It also triggers change detection when new values are emitted.",
    },
    {
      question: "What's the difference between switchMap, mergeMap, and concatMap?",
      answer:
        "switchMap cancels previous inner observables when a new value arrives (good for search). mergeMap runs inner observables concurrently without cancellation (good for independent operations). concatMap queues inner observables and runs them sequentially (good for ordered operations).",
    },
  ]

  return (
    <PageLayout
      title="RxJS & Observables"
      description="Master reactive programming in Angular with RxJS Observables, operators, and async patterns"
      previousPage={{ href: "/intermediate/http-client", title: "HTTP Client" }}
      nextPage={{ href: "/intermediate/state-management", title: "State Management" }}
    >
      <div className="space-y-8">
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Theory Overview</h2>
          <div className="prose prose-gray max-w-none">
            <p>
              RxJS (Reactive Extensions for JavaScript) is a library for reactive programming using Observables, to make
              it easier to compose asynchronous or callback-based code. Angular heavily relies on RxJS for handling
              asynchronous operations.
            </p>

            <h3>Core Concepts:</h3>
            <ul>
              <li>
                <strong>Observable:</strong> A collection of future values or events
              </li>
              <li>
                <strong>Observer:</strong> A collection of callbacks that knows how to listen to values delivered by the
                Observable
              </li>
              <li>
                <strong>Subscription:</strong> Represents the execution of an Observable
              </li>
              <li>
                <strong>Operators:</strong> Pure functions that enable functional programming style
              </li>
              <li>
                <strong>Subject:</strong> A special type of Observable that allows values to be multicasted
              </li>
              <li>
                <strong>Schedulers:</strong> Centralized dispatchers to control concurrency
              </li>
            </ul>

            <h3>Observable Lifecycle:</h3>
            <ol>
              <li>
                <strong>Creation:</strong> Observable is created but not executed
              </li>
              <li>
                <strong>Subscription:</strong> Observer subscribes to Observable
              </li>
              <li>
                <strong>Execution:</strong> Observable starts emitting values
              </li>
              <li>
                <strong>Disposal:</strong> Observer unsubscribes or Observable completes
              </li>
            </ol>

            <h3>Operator Categories:</h3>
            <ul>
              <li>
                <strong>Creation:</strong> of, from, interval, timer
              </li>
              <li>
                <strong>Transformation:</strong> map, switchMap, mergeMap, concatMap
              </li>
              <li>
                <strong>Filtering:</strong> filter, take, skip, distinctUntilChanged
              </li>
              <li>
                <strong>Combination:</strong> combineLatest, merge, zip, forkJoin
              </li>
              <li>
                <strong>Error Handling:</strong> catchError, retry, retryWhen
              </li>
              <li>
                <strong>Utility:</strong> tap, delay, timeout, finalize
              </li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Code Examples</h2>
          <div className="space-y-6">
            {rxjsExamples.map((example, index) => (
              <CodeExample key={index} title={example.title} code={example.code} language="typescript" />
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Best Practices</h2>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <ul className="space-y-2 text-gray-700">
              <li>• Always unsubscribe from Observables to prevent memory leaks</li>
              <li>• Use async pipe in templates when possible for automatic subscription management</li>
              <li>• Prefer switchMap for search operations to cancel previous requests</li>
              <li>• Use BehaviorSubject for state management when you need current value</li>
              <li>• Avoid nested subscriptions - use operators like switchMap instead</li>
              <li>• Use takeUntil pattern for component destruction</li>
              <li>• Handle errors appropriately with catchError operator</li>
              <li>• Use marble testing for complex Observable logic</li>
            </ul>
          </div>
        </section>

        <InterviewQuestions questions={interviewQuestions} />
      </div>
    </PageLayout>
  )
}
