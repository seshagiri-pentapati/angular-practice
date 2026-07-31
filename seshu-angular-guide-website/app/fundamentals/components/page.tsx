import { PageLayout } from "@/components/page-layout"
import { CodeExample } from "@/components/code-example"
import { InterviewQuestions } from "@/components/interview-questions"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Lightbulb, AlertCircle } from "lucide-react"

const componentQuestions = [
  {
    id: "what-is-component",
    question: "What is an Angular component?",
    answer: `<p>An Angular component is a TypeScript class that controls a part of the user interface. It consists of:</p>
    <ul>
      <li><strong>Component Class:</strong> Contains the logic and data</li>
      <li><strong>HTML Template:</strong> Defines the view</li>
      <li><strong>CSS Styles:</strong> Defines the appearance</li>
      <li><strong>Metadata:</strong> Tells Angular how to process the class</li>
    </ul>
    <p>Components are the building blocks of Angular applications and follow a hierarchical structure.</p>`,
    difficulty: "Easy" as const,
    tags: ["basics", "architecture"],
  },
  {
    id: "component-lifecycle",
    question: "What are the main lifecycle hooks in Angular components?",
    answer: `<p>Angular components have several lifecycle hooks:</p>
    <ul>
      <li><strong>ngOnInit:</strong> Called after component initialization</li>
      <li><strong>ngOnChanges:</strong> Called when input properties change</li>
      <li><strong>ngDoCheck:</strong> Called during every change detection run</li>
      <li><strong>ngAfterContentInit:</strong> Called after content projection</li>
      <li><strong>ngAfterViewInit:</strong> Called after view initialization</li>
      <li><strong>ngOnDestroy:</strong> Called before component destruction</li>
    </ul>
    <p>These hooks allow you to tap into key moments in the component's lifecycle.</p>`,
    difficulty: "Medium" as const,
    tags: ["lifecycle", "hooks"],
  },
  {
    id: "component-communication",
    question: "How do components communicate with each other?",
    answer: `<p>Components can communicate through several methods:</p>
    <ul>
      <li><strong>@Input():</strong> Parent to child communication</li>
      <li><strong>@Output() & EventEmitter:</strong> Child to parent communication</li>
      <li><strong>Services:</strong> Shared data between unrelated components</li>
      <li><strong>ViewChild/ViewChildren:</strong> Direct access to child components</li>
      <li><strong>Template Reference Variables:</strong> Access components in templates</li>
    </ul>
    <p>Choose the method based on the relationship between components.</p>`,
    difficulty: "Medium" as const,
    tags: ["communication", "input", "output"],
  },
]

export default function ComponentsPage() {
  return (
    <PageLayout
      title="Angular Components"
      description="Learn about Angular components - the building blocks of Angular applications"
      badge="Fundamentals"
      nextPage={{ title: "Templates & Data Binding", href: "/fundamentals/templates" }}
    >
      <div className="space-y-8">
        {/* Introduction */}
        <div>
          <h2>What are Components?</h2>
          <p>
            Components are the fundamental building blocks of Angular applications. They control a patch of screen
            called a view and are defined by a TypeScript class that handles data and functionality, an HTML template
            that defines the view, and CSS styles that define the appearance.
          </p>
        </div>

        {/* Component Structure */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-primary" />
              Component Structure
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>Every Angular component consists of four main parts:</p>
            <ul className="list-disc list-inside space-y-2 mt-4">
              <li>
                <strong>Component Decorator (@Component):</strong> Metadata that tells Angular how to process the class
              </li>
              <li>
                <strong>TypeScript Class:</strong> Contains the component logic, properties, and methods
              </li>
              <li>
                <strong>HTML Template:</strong> Defines the component's view
              </li>
              <li>
                <strong>CSS Styles:</strong> Defines the component's appearance
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Basic Component Example */}
        <CodeExample
          title="Basic Component Example"
          description="A simple Angular component with all essential parts"
          filename="hello-world.component.ts"
          code={`import { Component } from '@angular/core';

@Component({
  selector: 'app-hello-world',
  template: \`
    <div class="greeting">
      <h1>{{ title }}</h1>
      <p>Welcome, {{ name }}!</p>
      <button (click)="greet()">Say Hello</button>
    </div>
  \`,
  styles: [\`
    .greeting {
      text-align: center;
      padding: 20px;
      border: 2px solid #007acc;
      border-radius: 8px;
    }
    
    h1 {
      color: #007acc;
      margin-bottom: 10px;
    }
    
    button {
      background-color: #007acc;
      color: white;
      padding: 10px 20px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }
  \`]
})
export class HelloWorldComponent {
  title = 'Hello Angular!';
  name = 'Developer';
  
  greet() {
    alert(\`Hello, \${this.name}! Welcome to Angular!\`);
  }
}`}
        />

        {/* Component with External Files */}
        <CodeExample
          title="Component with External Template and Styles"
          description="Using separate files for template and styles (recommended for larger components)"
          filename="user-profile.component.ts"
          code={`import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  user = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    avatar: 'assets/images/default-avatar.png',
    isActive: true
  };
  
  constructor() { }
  
  ngOnInit(): void {
    console.log('UserProfileComponent initialized');
  }
  
  toggleStatus() {
    this.user.isActive = !this.user.isActive;
  }
  
  updateProfile() {
    // Logic to update user profile
    console.log('Updating profile for:', this.user.name);
  }
}`}
        />

        {/* Template File */}
        <CodeExample
          title="External Template File"
          description="The HTML template for the UserProfile component"
          filename="user-profile.component.html"
          language="html"
          code={`<div class="user-profile">
  <div class="profile-header">
    <img [src]="user.avatar" [alt]="user.name + ' avatar'" class="avatar">
    <div class="user-info">
      <h2>{{ user.name }}</h2>
      <p class="email">{{ user.email }}</p>
      <span class="status" [class.active]="user.isActive">
        {{ user.isActive ? 'Active' : 'Inactive' }}
      </span>
    </div>
  </div>
  
  <div class="profile-actions">
    <button (click)="toggleStatus()" class="btn btn-secondary">
      {{ user.isActive ? 'Deactivate' : 'Activate' }}
    </button>
    <button (click)="updateProfile()" class="btn btn-primary">
      Update Profile
    </button>
  </div>
</div>`}
        />

        {/* Component Lifecycle */}
        <div>
          <h2>Component Lifecycle</h2>
          <p>
            Angular components have a well-defined lifecycle managed by Angular. Understanding these lifecycle hooks is
            crucial for building robust applications.
          </p>
        </div>

        <CodeExample
          title="Component Lifecycle Hooks"
          description="Implementing common lifecycle hooks in a component"
          filename="lifecycle-demo.component.ts"
          code={`import { 
  Component, 
  OnInit, 
  OnChanges, 
  OnDestroy, 
  AfterViewInit,
  Input,
  SimpleChanges 
} from '@angular/core';

@Component({
  selector: 'app-lifecycle-demo',
  template: \`
    <div>
      <h3>Lifecycle Demo Component</h3>
      <p>Data: {{ data }}</p>
      <p>Counter: {{ counter }}</p>
    </div>
  \`
})
export class LifecycleDemoComponent implements OnInit, OnChanges, OnDestroy, AfterViewInit {
  @Input() data: string = '';
  counter = 0;
  private intervalId: any;
  
  constructor() {
    console.log('Constructor: Component instance created');
  }
  
  ngOnChanges(changes: SimpleChanges): void {
    console.log('ngOnChanges: Input properties changed', changes);
  }
  
  ngOnInit(): void {
    console.log('ngOnInit: Component initialized');
    // Start a counter
    this.intervalId = setInterval(() => {
      this.counter++;
    }, 1000);
  }
  
  ngAfterViewInit(): void {
    console.log('ngAfterViewInit: View initialized');
  }
  
  ngOnDestroy(): void {
    console.log('ngOnDestroy: Component destroyed');
    // Clean up resources
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }
}`}
        />

        {/* Component Communication */}
        <div>
          <h2>Component Communication</h2>
          <p>
            Components often need to communicate with each other. Angular provides several mechanisms for parent-child
            and sibling component communication.
          </p>
        </div>

        <CodeExample
          title="Parent Component"
          description="Parent component passing data to child and receiving events"
          filename="parent.component.ts"
          code={`import { Component } from '@angular/core';

@Component({
  selector: 'app-parent',
  template: \`
    <div class="parent">
      <h2>Parent Component</h2>
      <p>Message from child: {{ messageFromChild }}</p>
      
      <app-child 
        [parentData]="dataForChild"
        (childEvent)="onChildEvent($event)">
      </app-child>
      
      <button (click)="sendDataToChild()">Send New Data</button>
    </div>
  \`
})
export class ParentComponent {
  dataForChild = 'Hello from Parent!';
  messageFromChild = '';
  
  onChildEvent(message: string) {
    this.messageFromChild = message;
    console.log('Received from child:', message);
  }
  
  sendDataToChild() {
    this.dataForChild = \`Updated data at \${new Date().toLocaleTimeString()}\`;
  }
}`}
        />

        <CodeExample
          title="Child Component"
          description="Child component receiving input and emitting events"
          filename="child.component.ts"
          code={`import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-child',
  template: \`
    <div class="child">
      <h3>Child Component</h3>
      <p>Data from parent: {{ parentData }}</p>
      <input [(ngModel)]="childMessage" placeholder="Type a message">
      <button (click)="sendToParent()">Send to Parent</button>
    </div>
  \`
})
export class ChildComponent {
  @Input() parentData: string = '';
  @Output() childEvent = new EventEmitter<string>();
  
  childMessage = '';
  
  sendToParent() {
    if (this.childMessage.trim()) {
      this.childEvent.emit(this.childMessage);
      this.childMessage = '';
    }
  }
}`}
        />

        {/* Best Practices */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-primary" />
              Best Practices
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              <li>
                <strong>Single Responsibility:</strong> Each component should have a single, well-defined purpose
              </li>
              <li>
                <strong>Small Components:</strong> Keep components small and focused for better maintainability
              </li>
              <li>
                <strong>Meaningful Names:</strong> Use descriptive names that clearly indicate the component's purpose
              </li>
              <li>
                <strong>External Templates:</strong> Use external template files for components with complex HTML
              </li>
              <li>
                <strong>Lifecycle Cleanup:</strong> Always clean up subscriptions and resources in ngOnDestroy
              </li>
              <li>
                <strong>Input Validation:</strong> Validate input properties to ensure component stability
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Interview Questions */}
        <InterviewQuestions title="Component Interview Questions" questions={componentQuestions} />
      </div>
    </PageLayout>
  )
}
