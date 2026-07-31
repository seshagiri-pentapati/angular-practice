import { PageLayout } from "@/components/page-layout"
import { CodeExample } from "@/components/code-example"
import { InterviewQuestions } from "@/components/interview-questions"

export default function PipesPage() {
  const pipeExamples = [
    {
      title: "Built-in Pipes Usage",
      code: `<!-- Template examples of built-in pipes -->
<div class="pipe-examples">
  <!-- Date pipes -->
  <p>Current date: {{ currentDate | date }}</p>
  <p>Custom format: {{ currentDate | date:'dd/MM/yyyy' }}</p>
  <p>Full date: {{ currentDate | date:'fullDate' }}</p>
  <p>Time: {{ currentDate | date:'shortTime' }}</p>
  
  <!-- Currency pipes -->
  <p>Price: {{ price | currency }}</p>
  <p>Euro: {{ price | currency:'EUR':'symbol':'1.2-2' }}</p>
  <p>Custom: {{ price | currency:'USD':'symbol-narrow':'1.0-0' }}</p>
  
  <!-- Number pipes -->
  <p>Decimal: {{ 3.14159 | number:'1.2-4' }}</p>
  <p>Percent: {{ 0.85 | percent:'1.1-2' }}</p>
  
  <!-- String pipes -->
  <p>Uppercase: {{ 'hello world' | uppercase }}</p>
  <p>Lowercase: {{ 'HELLO WORLD' | lowercase }}</p>
  <p>Title case: {{ 'hello world' | titlecase }}</p>
  
  <!-- JSON pipe for debugging -->
  <pre>{{ user | json }}</pre>
  
  <!-- Slice pipe -->
  <p>First 3 items: {{ items | slice:0:3 | json }}</p>
  <p>Characters: {{ 'Hello World' | slice:0:5 }}</p>
  
  <!-- KeyValue pipe for objects -->
  <div *ngFor="let item of user | keyvalue">
    {{ item.key }}: {{ item.value }}
  </div>
  
  <!-- Async pipe -->
  <div *ngIf="users$ | async as users">
    <div *ngFor="let user of users">{{ user.name }}</div>
  </div>
  
  <!-- Chaining pipes -->
  <p>{{ user.name | uppercase | slice:0:10 }}</p>
  <p>{{ price | currency:'USD' | uppercase }}</p>
</div>`,
    },
    {
      title: "Custom Pipe - Truncate Text",
      code: `import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncate',
  pure: true // Default, pipe is pure
})
export class TruncatePipe implements PipeTransform {
  transform(value: string, limit: number = 50, trail: string = '...'): string {
    if (!value) return '';
    
    if (value.length <= limit) {
      return value;
    }
    
    return value.substring(0, limit) + trail;
  }
}

// Usage in template
// {{ longText | truncate:100:'...' }}
// {{ description | truncate:50 }}

// Register in module
@NgModule({
  declarations: [TruncatePipe],
  exports: [TruncatePipe] // Export if used in other modules
})
export class SharedModule {}`,
    },
    {
      title: "Custom Pipe - Filter Array",
      code: `import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter',
  pure: false // Impure pipe - will run on every change detection
})
export class FilterPipe implements PipeTransform {
  transform<T>(items: T[], searchTerm: string, property?: keyof T): T[] {
    if (!items || !searchTerm) {
      return items;
    }

    searchTerm = searchTerm.toLowerCase();

    return items.filter(item => {
      if (property) {
        const value = item[property];
        return String(value).toLowerCase().includes(searchTerm);
      } else {
        return JSON.stringify(item).toLowerCase().includes(searchTerm);
      }
    });
  }
}

// Better approach: Pure pipe with trackBy
@Pipe({
  name: 'pureFilter',
  pure: true
})
export class PureFilterPipe implements PipeTransform {
  transform<T>(items: T[], searchTerm: string, property?: keyof T): T[] {
    if (!items || !searchTerm) {
      return items;
    }

    searchTerm = searchTerm.toLowerCase();

    return items.filter(item => {
      if (property) {
        const value = item[property];
        return String(value).toLowerCase().includes(searchTerm);
      } else {
        return JSON.stringify(item).toLowerCase().includes(searchTerm);
      }
    });
  }
}

// Component usage
@Component({
  template: \`
    <input [(ngModel)]="searchTerm" placeholder="Search...">
    
    <!-- Impure pipe - not recommended for performance -->
    <div *ngFor="let user of users | filter:searchTerm:'name'">
      {{ user.name }}
    </div>
    
    <!-- Better approach - handle filtering in component -->
    <div *ngFor="let user of filteredUsers; trackBy: trackByUserId">
      {{ user.name }}
    </div>
  \`
})
export class UserListComponent {
  users: User[] = [];
  searchTerm = '';
  
  get filteredUsers() {
    return this.pureFilterPipe.transform(this.users, this.searchTerm, 'name');
  }
  
  trackByUserId(index: number, user: User): number {
    return user.id;
  }
  
  constructor(private pureFilterPipe: PureFilterPipe) {}
}`,
    },
    {
      title: "Advanced Custom Pipes",
      code: `// Safe HTML pipe
import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({
  name: 'safeHtml'
})
export class SafeHtmlPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}

  transform(value: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(value);
  }
}

// Time ago pipe
@Pipe({
  name: 'timeAgo'
})
export class TimeAgoPipe implements PipeTransform {
  transform(value: Date | string | number): string {
    if (!value) return '';
    
    const date = new Date(value);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    const intervals = [
      { label: 'year', seconds: 31536000 },
      { label: 'month', seconds: 2592000 },
      { label: 'day', seconds: 86400 },
      { label: 'hour', seconds: 3600 },
      { label: 'minute', seconds: 60 },
      { label: 'second', seconds: 1 }
    ];
    
    for (const interval of intervals) {
      const count = Math.floor(diffInSeconds / interval.seconds);
      if (count >= 1) {
        return count === 1 
          ? \`1 \${interval.label} ago\`
          : \`\${count} \${interval.label}s ago\`;
      }
    }
    
    return 'just now';
  }
}

// File size pipe
@Pipe({
  name: 'fileSize'
})
export class FileSizePipe implements PipeTransform {
  transform(bytes: number, decimals: number = 2): string {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }
}

// Highlight search pipe
@Pipe({
  name: 'highlight'
})
export class HighlightPipe implements PipeTransform {
  transform(text: string, search: string): SafeHtml {
    if (!search || !text) {
      return text;
    }
    
    const regex = new RegExp(\`(\${search})\`, 'gi');
    const highlighted = text.replace(regex, '<mark>$1</mark>');
    
    return this.sanitizer.bypassSecurityTrustHtml(highlighted);
  }
  
  constructor(private sanitizer: DomSanitizer) {}
}

// Usage examples
@Component({
  template: \`
    <div [innerHTML]="htmlContent | safeHtml"></div>
    <p>Posted {{ post.createdAt | timeAgo }}</p>
    <p>File size: {{ file.size | fileSize }}</p>
    <p [innerHTML]="text | highlight:searchTerm"></p>
  \`
})
export class ExampleComponent {
  htmlContent = '<p>This is <strong>safe</strong> HTML</p>';
  post = { createdAt: new Date(Date.now() - 3600000) }; // 1 hour ago
  file = { size: 1048576 }; // 1MB
  text = 'This is a sample text for highlighting';
  searchTerm = 'sample';
}`,
    },
    {
      title: "Async Pipe with Error Handling",
      code: `import { Component } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map, startWith } from 'rxjs/operators';

interface AsyncState<T> {
  loading: boolean;
  data: T | null;
  error: string | null;
}

@Component({
  selector: 'app-async-example',
  template: \`
    <div class="async-container">
      <!-- Basic async pipe -->
      <div *ngIf="users$ | async as users; else loading">
        <div *ngFor="let user of users">{{ user.name }}</div>
      </div>
      
      <!-- Async pipe with error handling -->
      <div *ngIf="usersWithError$ | async as state">
        <div *ngIf="state.loading" class="loading">Loading...</div>
        <div *ngIf="state.error" class="error">{{ state.error }}</div>
        <div *ngIf="state.data" class="data">
          <div *ngFor="let user of state.data">{{ user.name }}</div>
        </div>
      </div>
      
      <!-- Multiple async pipes (avoid) -->
      <div class="bad-example">
        <p>Loading: {{ (users$ | async) === null }}</p>
        <p>Count: {{ (users$ | async)?.length }}</p>
      </div>
      
      <!-- Single async pipe (better) -->
      <div *ngIf="users$ | async as users" class="good-example">
        <p>Loading: {{ users === null }}</p>
        <p>Count: {{ users?.length }}</p>
      </div>
      
      <ng-template #loading>
        <div class="loading">Loading users...</div>
      </ng-template>
    </div>
  \`
})
export class AsyncExampleComponent {
  users$ = this.userService.getUsers();
  
  // Enhanced observable with loading and error states
  usersWithError$ = this.userService.getUsers().pipe(
    map(data => ({ loading: false, data, error: null } as AsyncState<User[]>)),
    startWith({ loading: true, data: null, error: null } as AsyncState<User[]>),
    catchError(error => of({ 
      loading: false, 
      data: null, 
      error: error.message 
    } as AsyncState<User[]>))
  );
  
  constructor(private userService: UserService) {}
}

// Custom async pipe with loading state
@Pipe({
  name: 'asyncWithLoading'
})
export class AsyncWithLoadingPipe implements PipeTransform {
  transform(observable: Observable<any>): Observable<AsyncState<any>> {
    return observable.pipe(
      map(data => ({ loading: false, data, error: null })),
      startWith({ loading: true, data: null, error: null }),
      catchError(error => of({ 
        loading: false, 
        data: null, 
        error: error.message 
      }))
    );
  }
}`,
    },
  ]

  const interviewQuestions = [
    {
      question: "What are pipes in Angular and what types exist?",
      answer:
        "Pipes transform data in templates. Types: 1) Built-in pipes (date, currency, uppercase, etc.), 2) Custom pipes (implement PipeTransform), 3) Pure pipes (default, only run when input changes), 4) Impure pipes (run on every change detection cycle). They provide a clean way to format data without changing the component logic.",
    },
    {
      question: "What's the difference between pure and impure pipes?",
      answer:
        "Pure pipes (pure: true) only execute when input values change, providing better performance. Impure pipes (pure: false) execute on every change detection cycle, which can impact performance but is necessary for pipes that depend on external state or mutable objects.",
    },
    {
      question: "How do you create a custom pipe in Angular?",
      answer:
        "Create a class implementing PipeTransform interface, decorate with @Pipe, implement transform() method, and register in module declarations. The transform method receives the value and optional parameters, returning the transformed result.",
    },
    {
      question: "When should you avoid using pipes for filtering/sorting?",
      answer:
        "Avoid pipes for filtering/sorting large datasets as they can cause performance issues. Instead, handle filtering/sorting in the component using getters, methods, or reactive patterns. Pipes are better for simple transformations and formatting.",
    },
    {
      question: "How does the async pipe work and what are its benefits?",
      answer:
        "Async pipe subscribes to Observable/Promise, returns latest value, and automatically unsubscribes on component destruction. Benefits: prevents memory leaks, triggers change detection, simplifies template code, handles subscription lifecycle automatically.",
    },
  ]

  return (
    <PageLayout
      title="Pipes & Custom Pipes"
      description="Master data transformation in Angular templates with built-in and custom pipes"
      previousPage={{ href: "/intermediate/state-management", title: "State Management" }}
      nextPage={{ href: "/intermediate/lifecycle-hooks", title: "Lifecycle Hooks" }}
    >
      <div className="space-y-8">
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Theory Overview</h2>
          <div className="prose prose-gray max-w-none">
            <p>
              Pipes in Angular are a way to transform data in templates. They take data as input and transform it to a
              desired output format. Pipes are pure functions that don't change the original data but return a new
              transformed version.
            </p>

            <h3>Built-in Pipes:</h3>
            <ul>
              <li>
                <strong>DatePipe:</strong> Formats dates according to locale rules
              </li>
              <li>
                <strong>CurrencyPipe:</strong> Transforms numbers to currency strings
              </li>
              <li>
                <strong>DecimalPipe:</strong> Transforms numbers to decimal strings
              </li>
              <li>
                <strong>PercentPipe:</strong> Transforms numbers to percentage strings
              </li>
              <li>
                <strong>UpperCasePipe/LowerCasePipe:</strong> Transforms text case
              </li>
              <li>
                <strong>JsonPipe:</strong> Converts objects to JSON strings
              </li>
              <li>
                <strong>SlicePipe:</strong> Creates a subset of arrays or strings
              </li>
              <li>
                <strong>AsyncPipe:</strong> Subscribes to observables/promises
              </li>
            </ul>

            <h3>Pipe Categories:</h3>
            <ul>
              <li>
                <strong>Pure Pipes:</strong> Only execute when input changes (default, better performance)
              </li>
              <li>
                <strong>Impure Pipes:</strong> Execute on every change detection cycle
              </li>
            </ul>

            <h3>When to Use Custom Pipes:</h3>
            <ul>
              <li>Data formatting that's used across multiple components</li>
              <li>Complex transformations that would clutter templates</li>
              <li>Reusable business logic for data presentation</li>
              <li>Performance optimization for expensive operations</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Code Examples</h2>
          <div className="space-y-6">
            {pipeExamples.map((example, index) => (
              <CodeExample key={index} title={example.title} code={example.code} language="typescript" />
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Best Practices</h2>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <ul className="space-y-2 text-gray-700">
              <li>• Prefer pure pipes for better performance</li>
              <li>• Avoid using pipes for filtering/sorting large datasets</li>
              <li>• Use async pipe to prevent memory leaks</li>
              <li>• Keep pipe logic simple and focused</li>
              <li>• Handle null/undefined values gracefully</li>
              <li>• Use pipes for presentation logic, not business logic</li>
              <li>• Consider memoization for expensive transformations</li>
              <li>• Test custom pipes thoroughly</li>
            </ul>
          </div>
        </section>

        <InterviewQuestions questions={interviewQuestions} />
      </div>
    </PageLayout>
  )
}
