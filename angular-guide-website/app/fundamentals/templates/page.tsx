import { PageLayout } from "@/components/page-layout"
import { CodeExample } from "@/components/code-example"
import { InterviewQuestions } from "@/components/interview-questions"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Lightbulb, AlertCircle } from "lucide-react"

const templateQuestions = [
  {
    id: "data-binding-types",
    question: "What are the different types of data binding in Angular?",
    answer: `<p>Angular supports four types of data binding:</p>
    <ul>
      <li><strong>Interpolation ({{ }}):</strong> One-way binding from component to template</li>
      <li><strong>Property Binding ([property]):</strong> One-way binding to element properties</li>
      <li><strong>Event Binding ((event)):</strong> One-way binding from template to component</li>
      <li><strong>Two-way Binding ([(ngModel)]):</strong> Bidirectional data flow</li>
    </ul>
    <p>Each type serves different purposes in creating dynamic user interfaces.</p>`,
    difficulty: "Easy" as const,
    tags: ["data-binding", "templates"],
  },
  {
    id: "template-reference-variables",
    question: "What are template reference variables and how are they used?",
    answer: `<p>Template reference variables are references to DOM elements or Angular components in templates:</p>
    <ul>
      <li>Created using the # symbol: <code>#variableName</code></li>
      <li>Can reference DOM elements, components, or directives</li>
      <li>Accessible within the template scope</li>
      <li>Useful for accessing element properties or calling methods</li>
    </ul>
    <p>Example: <code>&lt;input #nameInput&gt;</code> creates a reference to the input element.</p>`,
    difficulty: "Medium" as const,
    tags: ["templates", "references"],
  },
  {
    id: "safe-navigation",
    question: "What is the safe navigation operator and when should you use it?",
    answer: `<p>The safe navigation operator (?.) prevents errors when accessing properties of null or undefined objects:</p>
    <ul>
      <li>Syntax: <code>object?.property</code></li>
      <li>Returns undefined if object is null/undefined</li>
      <li>Prevents runtime errors in templates</li>
      <li>Especially useful with async data</li>
    </ul>
    <p>Example: <code>{{ user?.profile?.name }}</code> safely accesses nested properties.</p>`,
    difficulty: "Medium" as const,
    tags: ["templates", "operators", "safety"],
  },
]

export default function TemplatesPage() {
  return (
    <PageLayout
      title="Templates & Data Binding"
      description="Master Angular templates and data binding techniques"
      badge="Fundamentals"
      previousPage={{ title: "Components", href: "/fundamentals/components" }}
      nextPage={{ title: "Directives", href: "/fundamentals/directives" }}
    >
      <div className="space-y-8">
        {/* Introduction */}
        <div>
          <h2>Angular Templates</h2>
          <p>
            Angular templates are HTML files with Angular-specific elements and attributes. They combine regular HTML
            with Angular markup to create dynamic, data-driven user interfaces.
          </p>
        </div>

        {/* Data Binding Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-primary" />
              Data Binding Types
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Badge variant="outline">One-way (Component → Template)</Badge>
                <ul className="text-sm space-y-1">
                  <li>
                    • Interpolation:{" "}
                    <code>
                      {"{{"} value {"}}"}
                    </code>
                  </li>
                  <li>
                    • Property Binding: <code>[property]="value"</code>
                  </li>
                </ul>
              </div>
              <div className="space-y-2">
                <Badge variant="outline">One-way (Template → Component)</Badge>
                <ul className="text-sm space-y-1">
                  <li>
                    • Event Binding: <code>(event)="handler()"</code>
                  </li>
                </ul>
              </div>
              <div className="space-y-2">
                <Badge variant="outline">Two-way</Badge>
                <ul className="text-sm space-y-1">
                  <li>
                    • Two-way Binding: <code>[(ngModel)]="property"</code>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Interpolation */}
        <div>
          <h2>Interpolation</h2>
          <p>
            Interpolation allows you to embed expressions in your HTML templates. Angular evaluates the expressions and
            converts them to strings.
          </p>
        </div>

        <CodeExample
          title="Interpolation Examples"
          description="Various ways to use interpolation in templates"
          filename="interpolation.component.ts"
          code={`import { Component } from '@angular/core';

@Component({
  selector: 'app-interpolation',
  template: \`
    <div class="interpolation-demo">
      <!-- Basic interpolation -->
      <h1>{{ title }}</h1>
      <p>Welcome, {{ user.name }}!</p>
      
      <!-- Expressions -->
      <p>Total: {{ price * quantity }}</p>
      <p>Message: {{ isLoggedIn ? 'Welcome back!' : 'Please log in' }}</p>
      
      <!-- Method calls -->
      <p>Current time: {{ getCurrentTime() }}</p>
      
      <!-- String concatenation -->
      <p>Full name: {{ user.firstName + ' ' + user.lastName }}</p>
      
      <!-- Template expressions -->
      <p>Items count: {{ items.length }}</p>
      <p>First item: {{ items[0]?.name || 'No items' }}</p>
    </div>
  \`
})
export class InterpolationComponent {
  title = 'Angular Interpolation Demo';
  price = 29.99;
  quantity = 2;
  isLoggedIn = true;
  
  user = {
    name: 'John Doe',
    firstName: 'John',
    lastName: 'Doe'
  };
  
  items = [
    { name: 'Item 1', price: 10 },
    { name: 'Item 2', price: 20 }
  ];
  
  getCurrentTime(): string {
    return new Date().toLocaleTimeString();
  }
}`}
        />

        {/* Property Binding */}
        <div>
          <h2>Property Binding</h2>
          <p>
            Property binding allows you to set properties of HTML elements or Angular components dynamically. Use square
            brackets to bind to element properties.
          </p>
        </div>

        <CodeExample
          title="Property Binding Examples"
          description="Binding to various element and component properties"
          filename="property-binding.component.ts"
          code={`import { Component } from '@angular/core';

@Component({
  selector: 'app-property-binding',
  template: \`
    <div class="property-binding-demo">
      <!-- Element property binding -->
      <img [src]="imageUrl" [alt]="imageAlt" [width]="imageWidth">
      
      <!-- Boolean properties -->
      <button [disabled]="isButtonDisabled">{{ buttonText }}</button>
      <input [readonly]="isReadonly" [value]="inputValue">
      
      <!-- CSS class binding -->
      <div [class]="cssClass">Dynamic CSS class</div>
      <div [class.active]="isActive">Conditional class</div>
      <div [ngClass]="getClasses()">Multiple classes</div>
      
      <!-- Style binding -->
      <div [style.color]="textColor">Colored text</div>
      <div [style.font-size.px]="fontSize">Sized text</div>
      <div [ngStyle]="getStyles()">Multiple styles</div>
      
      <!-- Attribute binding -->
      <div [attr.data-id]="userId">User data</div>
      <button [attr.aria-label]="buttonLabel">Accessible button</button>
      
      <!-- Component property binding -->
      <app-child [childData]="parentData" [isVisible]="showChild"></app-child>
    </div>
  \`
})
export class PropertyBindingComponent {
  imageUrl = 'assets/images/angular-logo.png';
  imageAlt = 'Angular Logo';
  imageWidth = 200;
  
  isButtonDisabled = false;
  buttonText = 'Click me';
  isReadonly = false;
  inputValue = 'Sample text';
  
  cssClass = 'highlight';
  isActive = true;
  
  textColor = '#007acc';
  fontSize = 18;
  
  userId = 'user-123';
  buttonLabel = 'Submit form';
  
  parentData = 'Data from parent';
  showChild = true;
  
  getClasses() {
    return {
      'primary': this.isActive,
      'secondary': !this.isActive,
      'large': this.fontSize > 16
    };
  }
  
  getStyles() {
    return {
      'color': this.textColor,
      'font-size': this.fontSize + 'px',
      'font-weight': this.isActive ? 'bold' : 'normal'
    };
  }
}`}
        />

        {/* Event Binding */}
        <div>
          <h2>Event Binding</h2>
          <p>
            Event binding allows you to listen to and respond to user actions such as clicks, key presses, mouse
            movements, and more.
          </p>
        </div>

        <CodeExample
          title="Event Binding Examples"
          description="Handling various user events in templates"
          filename="event-binding.component.ts"
          code={`import { Component } from '@angular/core';

@Component({
  selector: 'app-event-binding',
  template: \`
    <div class="event-binding-demo">
      <!-- Click events -->
      <button (click)="onClick()">Simple Click</button>
      <button (click)="onClickWithData('Hello')">Click with Data</button>
      
      <!-- Mouse events -->
      <div (mouseenter)="onMouseEnter()" 
           (mouseleave)="onMouseLeave()"
           [class.hovered]="isHovered">
        Hover over me
      </div>
      
      <!-- Keyboard events -->
      <input (keyup)="onKeyUp($event)" 
             (keyup.enter)="onEnterKey()"
             placeholder="Type something">
      
      <!-- Form events -->
      <form (submit)="onSubmit($event)">
        <input [(ngModel)]="formData.name" name="name" placeholder="Name">
        <button type="submit">Submit</button>
      </form>
      
      <!-- Custom events -->
      <app-child (customEvent)="onCustomEvent($event)"></app-child>
      
      <!-- Event object access -->
      <button (click)="onClickWithEvent($event)">Click for Event Info</button>
      
      <!-- Multiple event handlers -->
      <input (focus)="onFocus()" 
             (blur)="onBlur()" 
             (input)="onInput($event)"
             placeholder="Multiple events">
      
      <!-- Display results -->
      <div class="results">
        <p>Last action: {{ lastAction }}</p>
        <p>Key pressed: {{ lastKey }}</p>
        <p>Mouse status: {{ mouseStatus }}</p>
      </div>
    </div>
  \`
})
export class EventBindingComponent {
  lastAction = '';
  lastKey = '';
  mouseStatus = '';
  isHovered = false;
  
  formData = {
    name: ''
  };
  
  onClick() {
    this.lastAction = 'Button clicked';
    console.log('Button clicked');
  }
  
  onClickWithData(data: string) {
    this.lastAction = \`Button clicked with data: \${data}\`;
  }
  
  onMouseEnter() {
    this.mouseStatus = 'Mouse entered';
    this.isHovered = true;
  }
  
  onMouseLeave() {
    this.mouseStatus = 'Mouse left';
    this.isHovered = false;
  }
  
  onKeyUp(event: KeyboardEvent) {
    this.lastKey = event.key;
    this.lastAction = \`Key pressed: \${event.key}\`;
  }
  
  onEnterKey() {
    this.lastAction = 'Enter key pressed';
  }
  
  onSubmit(event: Event) {
    event.preventDefault();
    this.lastAction = \`Form submitted with name: \${this.formData.name}\`;
  }
  
  onCustomEvent(data: any) {
    this.lastAction = \`Custom event received: \${data}\`;
  }
  
  onClickWithEvent(event: MouseEvent) {
    this.lastAction = \`Clicked at coordinates: (\${event.clientX}, \${event.clientY})\`;
  }
  
  onFocus() {
    this.lastAction = 'Input focused';
  }
  
  onBlur() {
    this.lastAction = 'Input blurred';
  }
  
  onInput(event: Event) {
    const target = event.target as HTMLInputElement;
    this.lastAction = \`Input value: \${target.value}\`;
  }
}`}
        />

        {/* Two-way Binding */}
        <div>
          <h2>Two-way Data Binding</h2>
          <p>
            Two-way data binding combines property binding and event binding to create a bidirectional data flow between
            the component and template.
          </p>
        </div>

        <CodeExample
          title="Two-way Binding Examples"
          description="Implementing two-way data binding with ngModel and custom components"
          filename="two-way-binding.component.ts"
          code={`import { Component } from '@angular/core';

@Component({
  selector: 'app-two-way-binding',
  template: \`
    <div class="two-way-binding-demo">
      <!-- Basic ngModel -->
      <div class="form-group">
        <label>Name:</label>
        <input [(ngModel)]="user.name" placeholder="Enter name">
        <p>Hello, {{ user.name }}!</p>
      </div>
      
      <!-- Different input types -->
      <div class="form-group">
        <label>Email:</label>
        <input type="email" [(ngModel)]="user.email" placeholder="Enter email">
      </div>
      
      <div class="form-group">
        <label>Age:</label>
        <input type="number" [(ngModel)]="user.age" min="0" max="120">
      </div>
      
      <!-- Textarea -->
      <div class="form-group">
        <label>Bio:</label>
        <textarea [(ngModel)]="user.bio" rows="3" placeholder="Tell us about yourself"></textarea>
      </div>
      
      <!-- Select dropdown -->
      <div class="form-group">
        <label>Country:</label>
        <select [(ngModel)]="user.country">
          <option value="">Select a country</option>
          <option value="us">United States</option>
          <option value="uk">United Kingdom</option>
          <option value="ca">Canada</option>
          <option value="au">Australia</option>
        </select>
      </div>
      
      <!-- Checkboxes -->
      <div class="form-group">
        <label>
          <input type="checkbox" [(ngModel)]="user.isSubscribed">
          Subscribe to newsletter
        </label>
      </div>
      
      <!-- Radio buttons -->
      <div class="form-group">
        <label>Gender:</label>
        <label><input type="radio" [(ngModel)]="user.gender" value="male"> Male</label>
        <label><input type="radio" [(ngModel)]="user.gender" value="female"> Female</label>
        <label><input type="radio" [(ngModel)]="user.gender" value="other"> Other</label>
      </div>
      
      <!-- Custom two-way binding component -->
      <div class="form-group">
        <label>Rating:</label>
        <app-rating [(rating)]="user.rating"></app-rating>
      </div>
      
      <!-- Display current values -->
      <div class="user-preview">
        <h3>User Data:</h3>
        <pre>{{ getUserData() }}</pre>
      </div>
    </div>
  \`
})
export class TwoWayBindingComponent {
  user = {
    name: '',
    email: '',
    age: null,
    bio: '',
    country: '',
    isSubscribed: false,
    gender: '',
    rating: 0
  };
  
  getUserData(): string {
    return JSON.stringify(this.user, null, 2);
  }
}`}
        />

        {/* Template Reference Variables */}
        <div>
          <h2>Template Reference Variables</h2>
          <p>
            Template reference variables provide a way to access DOM elements, components, or directives directly in
            your templates.
          </p>
        </div>

        <CodeExample
          title="Template Reference Variables"
          description="Using template reference variables to access elements and components"
          filename="template-references.component.ts"
          code={`import { Component } from '@angular/core';

@Component({
  selector: 'app-template-references',
  template: \`
    <div class="template-references-demo">
      <!-- Element reference -->
      <input #nameInput type="text" placeholder="Enter your name">
      <button (click)="focusInput(nameInput)">Focus Input</button>
      <button (click)="clearInput(nameInput)">Clear Input</button>
      <p>Input value: {{ nameInput.value }}</p>
      
      <!-- Form reference -->
      <form #userForm="ngForm" (ngSubmit)="onSubmit(userForm)">
        <input name="username" ngModel required #username="ngModel">
        <div *ngIf="username.invalid && username.touched">
          Username is required
        </div>
        <button type="submit" [disabled]="userForm.invalid">Submit</button>
      </form>
      
      <!-- Component reference -->
      <app-counter #counterRef></app-counter>
      <button (click)="resetCounter(counterRef)">Reset Counter</button>
      <button (click)="incrementCounter(counterRef)">Increment</button>
      
      <!-- Multiple references -->
      <div class="calculator">
        <input #num1 type="number" placeholder="First number">
        <input #num2 type="number" placeholder="Second number">
        <button (click)="calculate(num1, num2, result)">Calculate</button>
        <div #result class="result"></div>
      </div>
      
      <!-- Conditional reference -->
      <div *ngIf="showAdvanced">
        <input #advancedInput type="text" placeholder="Advanced input">
        <button (click)="processAdvanced(advancedInput)">Process</button>
      </div>
      <button (click)="showAdvanced = !showAdvanced">
        {{ showAdvanced ? 'Hide' : 'Show' }} Advanced
      </button>
    </div>
  \`
})
export class TemplateReferencesComponent {
  showAdvanced = false;
  
  focusInput(input: HTMLInputElement) {
    input.focus();
  }
  
  clearInput(input: HTMLInputElement) {
    input.value = '';
  }
  
  onSubmit(form: any) {
    if (form.valid) {
      console.log('Form submitted:', form.value);
    }
  }
  
  resetCounter(counter: any) {
    counter.reset();
  }
  
  incrementCounter(counter: any) {
    counter.increment();
  }
  
  calculate(num1: HTMLInputElement, num2: HTMLInputElement, result: HTMLElement) {
    const sum = (+num1.value) + (+num2.value);
    result.textContent = \`Result: \${sum}\`;
  }
  
  processAdvanced(input: HTMLInputElement) {
    console.log('Advanced processing:', input.value);
  }
}`}
        />

        {/* Safe Navigation */}
        <div>
          <h2>Safe Navigation Operator</h2>
          <p>
            The safe navigation operator (?.) helps prevent errors when accessing properties of objects that might be
            null or undefined.
          </p>
        </div>

        <CodeExample
          title="Safe Navigation Examples"
          description="Using the safe navigation operator to prevent runtime errors"
          filename="safe-navigation.component.ts"
          code={`import { Component, OnInit } from '@angular/core';

interface User {
  id: number;
  name: string;
  profile?: {
    avatar?: string;
    bio?: string;
    address?: {
      street: string;
      city: string;
      country: string;
    };
  };
  preferences?: {
    theme: string;
    notifications: boolean;
  };
}

@Component({
  selector: 'app-safe-navigation',
  template: \`
    <div class="safe-navigation-demo">
      <h2>User Information</h2>
      
      <!-- Without safe navigation (could cause errors) -->
      <!-- <p>Avatar: {{ user.profile.avatar }}</p> -->
      
      <!-- With safe navigation -->
      <div *ngIf="user">
        <h3>{{ user.name }}</h3>
        <p>Avatar: {{ user.profile?.avatar || 'No avatar' }}</p>
        <p>Bio: {{ user.profile?.bio || 'No bio available' }}</p>
        
        <!-- Nested safe navigation -->
        <div class="address">
          <h4>Address:</h4>
          <p>Street: {{ user.profile?.address?.street || 'Not provided' }}</p>
          <p>City: {{ user.profile?.address?.city || 'Not provided' }}</p>
          <p>Country: {{ user.profile?.address?.country || 'Not provided' }}</p>
        </div>
        
        <!-- Safe navigation with method calls -->
        <p>Theme: {{ user.preferences?.theme?.toUpperCase() || 'Default' }}</p>
        <p>Notifications: {{ user.preferences?.notifications ? 'Enabled' : 'Disabled' }}</p>
      </div>
      
      <!-- Loading state -->
      <div *ngIf="!user && isLoading">
        <p>Loading user data...</p>
      </div>
      
      <!-- Error state -->
      <div *ngIf="!user && !isLoading">
        <p>No user data available</p>
      </div>
      
      <!-- Array safe navigation -->
      <div class="user-posts">
        <h4>Recent Posts ({{ posts?.length || 0 }}):</h4>
        <div *ngFor="let post of posts">
          <h5>{{ post?.title }}</h5>
          <p>{{ post?.content?.substring(0, 100) }}...</p>
          <small>By: {{ post?.author?.name || 'Unknown' }}</small>
        </div>
      </div>
      
      <!-- Buttons to simulate data loading -->
      <div class="controls">
        <button (click)="loadUser()">Load User</button>
        <button (click)="loadUserWithProfile()">Load User with Profile</button>
        <button (click)="clearUser()">Clear User</button>
      </div>
    </div>
  \`
})
export class SafeNavigationComponent implements OnInit {
  user: User | null = null;
  isLoading = false;
  posts: any[] | null = null;
  
  ngOnInit() {
    this.loadUser();
  }
  
  loadUser() {
    this.isLoading = true;
    
    // Simulate API call
    setTimeout(() => {
      this.user = {
        id: 1,
        name: 'John Doe'
        // Note: profile is undefined
      };
      
      this.posts = [
        {
          title: 'First Post',
          content: 'This is the content of the first post...',
          author: { name: 'John Doe' }
        },
        {
          title: 'Second Post',
          // Note: content is undefined
          author: null // Note: author is null
        }
      ];
      
      this.isLoading = false;
    }, 1000);
  }
  
  loadUserWithProfile() {
    this.isLoading = true;
    
    setTimeout(() => {
      this.user = {
        id: 1,
        name: 'John Doe',
        profile: {
          avatar: 'assets/images/john-avatar.jpg',
          bio: 'Software developer passionate about Angular',
          address: {
            street: '123 Main St',
            city: 'New York',
            country: 'USA'
          }
        },
        preferences: {
          theme: 'dark',
          notifications: true
        }
      };
      
      this.isLoading = false;
    }, 1000);
  }
  
  clearUser() {
    this.user = null;
    this.posts = null;
    this.isLoading = false;
  }
}`}
        />

        {/* Best Practices */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-primary" />
              Template Best Practices
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              <li>
                <strong>Use Safe Navigation:</strong> Always use ?. when accessing nested properties that might be
                undefined
              </li>
              <li>
                <strong>Avoid Complex Logic:</strong> Keep template expressions simple; move complex logic to component
                methods
              </li>
              <li>
                <strong>Use TrackBy:</strong> Implement trackBy functions for *ngFor to improve performance
              </li>
              <li>
                <strong>Meaningful Names:</strong> Use descriptive names for template reference variables
              </li>
              <li>
                <strong>Async Pipe:</strong> Use the async pipe for observables to handle subscriptions automatically
              </li>
              <li>
                <strong>OnPush Strategy:</strong> Consider using OnPush change detection for better performance
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Interview Questions */}
        <InterviewQuestions title="Templates & Data Binding Interview Questions" questions={templateQuestions} />
      </div>
    </PageLayout>
  )
}
