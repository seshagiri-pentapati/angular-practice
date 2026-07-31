'use client'

import { PageLayout } from '@/components/page-layout'
import { CodeExample } from '@/components/code-example'
import { InterviewQuestions } from '@/components/interview-questions'

export default function Angular21Page() {
  const codeExamples = [
    {
      title: "@Service Decorator",
      description: "New @Service decorator for automatic dependency injection with automatic injection token generation",
      code: `import { Service, inject } from '@angular/core';

@Service()
export class UserService {
  private apiUrl = 'https://api.example.com';

  getUsers() {
    return fetch(this.apiUrl + '/users').then(r => r.json());
  }
}

// Usage in component
@Component({
  selector: 'app-users',
  template: \`<div>{{ users | json }}</div>\`
})
export class UsersComponent {
  userService = inject(UserService);
  users = this.userService.getUsers();
}`,
      language: 'typescript'
    },
    {
      title: "Removal of NgModuleFactory",
      description: "NgModuleFactory has been removed - use standalone components or new APIs",
      code: `// OLD WAY (Deprecated)
// this.moduleRef = this.moduleFactoryResolver.resolveComponentFactory(MyComponent);

// NEW WAY - Use standalone components
@Component({
  selector: 'app-dynamic',
  template: '<ng-container #container></ng-container>',
  standalone: true,
  imports: [CommonModule]
})
export class DynamicComponent {
  @ViewChild('container', { read: ViewContainerRef }) container!: ViewContainerRef;

  loadComponent(comp: Type<any>) {
    this.container.clear();
    this.container.createComponent(comp);
  }
}`,
      language: 'typescript'
    },
    {
      title: "Enhanced NgComponentOutlet",
      description: "NgComponentOutlet now supports injectors and input binding",
      code: `import { NgComponentOutlet } from '@angular/common';
import { Component, Type } from '@angular/core';

@Component({
  selector: 'app-outlet-demo',
  template: \`
    <ng-container 
      *ngComponentOutlet="component; 
        injector: customInjector; 
        inputs: componentInputs">
    </ng-container>
  \`,
  standalone: true,
  imports: [NgComponentOutlet]
})
export class OutletDemoComponent {
  component: Type<any> = SomeComponent;
  customInjector = inject(Injector);
  componentInputs = { title: 'Dynamic Title', data: [1, 2, 3] };
}`,
      language: 'typescript'
    },
    {
      title: "Server-Side Bootstrapping Changes",
      description: "Updated server-side rendering bootstrapping process for better SSR support",
      code: `// New SSR bootstrapping pattern
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { config } from './app/app.config.server';

export default function render(html: string, context: any) {
  return bootstrapApplication(AppComponent, config).then(() => html);
}

// In app.config.server.ts
export const config: ApplicationConfig = {
  providers: [
    provideServerRendering(),
    provideHttpClient(withInterceptors([...])),
    provideRouter(ROUTES)
  ]
};`,
      language: 'typescript'
    },
    {
      title: "Enhanced TestBed PlatformLocation",
      description: "TestBed now uses a proper mock implementation of PlatformLocation for better testing",
      code: `import { TestBed } from '@angular/core/testing';
import { PlatformLocation } from '@angular/common';

describe('Router Tests', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        provideRouter(ROUTES)
      ]
    });
  });

  it('should handle navigation', () => {
    const platformLocation = TestBed.inject(PlatformLocation);
    const router = TestBed.inject(Router);
    
    // platformLocation is now properly mocked for testing
    router.navigate(['/users']);
    expect(platformLocation.pathname).toBe('/users');
  });
});`,
      language: 'typescript'
    }
  ]

  const interviewQuestions = [
    {
      question: "What is the new @Service decorator in Angular 21?",
      answer: "The @Service decorator is a new way to declare services with automatic dependency injection token generation, simplifying the service definition process."
    },
    {
      question: "Why was NgModuleFactory removed in Angular 21?",
      answer: "NgModuleFactory was removed to encourage migration to standalone components and modern APIs. This aligns Angular with a more component-focused architecture."
    },
    {
      question: "What are the benefits of the new NgComponentOutlet enhancements?",
      answer: "The enhanced NgComponentOutlet now supports custom injectors and input binding, making it easier to dynamically load and configure components at runtime."
    },
    {
      question: "What changed in TestBed's PlatformLocation implementation?",
      answer: "TestBed now uses a proper mock implementation of PlatformLocation instead of returning null, providing better testing capabilities for router and navigation tests."
    },
    {
      question: "How should I migrate from NgModuleFactory in my existing Angular application?",
      answer: "Convert NgModuleFactory usage to standalone components or use the new ViewContainerRef.createComponent() method with the component directly instead of through a factory."
    },
    {
      question: "What is the impact of the removal of ComponentFactoryResolver?",
      answer: "ComponentFactoryResolver has been removed as part of the deprecation of NgModuleFactory. Use standalone components or dependency injection directly instead."
    },
    {
      question: "How do I use the @Service decorator in Angular 21?",
      answer: "Simply decorate your service class with @Service() - Angular automatically handles the injection token generation. No need for @Injectable() with providedIn configuration."
    },
    {
      question: "What are the server-side rendering improvements in Angular 21?",
      answer: "Angular 21 improved the SSR bootstrapping process with better integration of platform-server utilities and more reliable server-side rendering initialization."
    }
  ]

  return (
    <PageLayout
      title="Angular 21 Features"
      description="Explore the breaking changes and new features introduced in Angular 21, including the new @Service decorator, removal of NgModuleFactory, and enhanced testing capabilities."
      lastUpdated="May 2025"
    >
      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6 text-foreground">Angular 21: Breaking Changes & New APIs</h2>
        
        <div className="bg-accent/20 border border-accent rounded-lg p-6 mb-8">
          <h3 className="text-lg font-semibold mb-3">📋 Release Overview</h3>
          <p className="text-muted-foreground mb-4">
            Angular 21, released in November 2025, introduced significant breaking changes focused on modernizing the framework's APIs and removing legacy patterns. This version deprecates NgModuleFactory in favor of standalone components and introduces new decorators like @Service.
          </p>
          <ul className="space-y-2 text-sm">
            <li>✅ New @Service decorator for simplified service definition</li>
            <li>✅ Enhanced NgComponentOutlet with injector and input support</li>
            <li>✅ Removal of NgModuleFactory - migrate to standalone components</li>
            <li>✅ Improved TestBed PlatformLocation mocking</li>
            <li>✅ Enhanced server-side rendering capabilities</li>
          </ul>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Key Features & Code Examples</h2>
        <div className="space-y-8">
          {codeExamples.map((example, index) => (
            <CodeExample
              key={index}
              title={example.title}
              description={example.description}
              code={example.code}
              language={example.language}
            />
          ))}
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Breaking Changes & Migration Guide</h2>
        
        <div className="space-y-6">
          <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-3">🚨 Critical Breaking Changes</h3>
            
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">1. NgModuleFactory Removal</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  The entire NgModuleFactory system has been removed. All dynamic component loading must now use standalone components.
                </p>
                <code className="text-xs bg-background p-2 rounded block">
                  Use: ViewContainerRef.createComponent() or new NgComponentOutlet APIs
                </code>
              </div>

              <div>
                <h4 className="font-semibold mb-2">2. ComponentFactoryResolver Deprecation</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  ComponentFactoryResolver is no longer available. Use dependency injection or standalone component patterns instead.
                </p>
              </div>

              <div>
                <h4 className="font-semibold mb-2">3. TestBed PlatformLocation Changes</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  TestBed now provides a mock implementation of PlatformLocation instead of null, which may affect existing tests.
                </p>
              </div>

              <div>
                <h4 className="font-semibold mb-2">4. Host Binding Type Checking</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  Enhanced type checking for host bindings may reveal previously hidden type errors in existing code.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-primary/10 border border-primary/30 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-3">✨ Migration Best Practices</h3>
            <ul className="space-y-2 text-sm">
              <li>✓ Convert services to use @Service decorator where applicable</li>
              <li>✓ Migrate dynamic components to standalone components</li>
              <li>✓ Update tests to work with new TestBed PlatformLocation mock</li>
              <li>✓ Use new NgComponentOutlet capabilities for dynamic component loading</li>
              <li>✓ Update SSR bootstrapping patterns to match new requirements</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Angular 21 vs Previous Versions</h2>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left p-3 font-semibold">Feature</th>
                <th className="text-left p-3 font-semibold">Angular 20</th>
                <th className="text-left p-3 font-semibold">Angular 21</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-border hover:bg-accent/50">
                <td className="p-3">@Service Decorator</td>
                <td className="p-3">❌ Not available</td>
                <td className="p-3">✅ New in 21</td>
              </tr>
              <tr className="border-b border-border hover:bg-accent/50">
                <td className="p-3">NgModuleFactory</td>
                <td className="p-3">✅ Available</td>
                <td className="p-3">❌ Removed</td>
              </tr>
              <tr className="border-b border-border hover:bg-accent/50">
                <td className="p-3">ComponentFactoryResolver</td>
                <td className="p-3">✅ Available</td>
                <td className="p-3">❌ Deprecated</td>
              </tr>
              <tr className="border-b border-border hover:bg-accent/50">
                <td className="p-3">NgComponentOutlet Injector</td>
                <td className="p-3">❌ Limited</td>
                <td className="p-3">✅ Enhanced</td>
              </tr>
              <tr className="border-b border-border hover:bg-accent/50">
                <td className="p-3">TestBed PlatformLocation</td>
                <td className="p-3">null mock</td>
                <td className="p-3">✅ Proper mock</td>
              </tr>
              <tr className="hover:bg-accent/50">
                <td className="p-3">SSR Bootstrapping</td>
                <td className="p-3">Legacy pattern</td>
                <td className="p-3">✅ Enhanced</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <InterviewQuestions questions={interviewQuestions} />
    </PageLayout>
  )
}
