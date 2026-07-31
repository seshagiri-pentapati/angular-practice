'use client'

import { PageLayout } from '@/components/page-layout'
import { CodeExample } from '@/components/code-example'
import { InterviewQuestions } from '@/components/interview-questions'

export default function Angular22Page() {
  const codeExamples = [
    {
      title: "TypeScript 6.0 Requirement",
      description: "Angular 22 requires TypeScript 6.0+, dropping support for older versions",
      code: `{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "lib": ["ES2022", "dom"]
  },
  "angularCompilerOptions": {
    "enableIvy": true,
    "fullTemplateTypeCheck": true,
    "strictTemplates": true
  }
}

// package.json
{
  "dependencies": {
    "@angular/core": "^22.0.0",
    "typescript": "^6.0.0"
  }
}`,
      language: 'json'
    },
    {
      title: "Removal of ComponentFactoryResolver",
      description: "ComponentFactoryResolver and ComponentFactory have been completely removed",
      code: `// OLD WAY (No longer works)
// constructor(private resolver: ComponentFactoryResolver) {}
// const factory = this.resolver.resolveComponentFactory(MyComponent);

// NEW WAY - Use createComponent directly
import { Component, ViewContainerRef, Type } from '@angular/core';

@Component({
  selector: 'app-dynamic-loader',
  template: '<ng-container #container></ng-container>',
  standalone: true
})
export class DynamicLoaderComponent {
  constructor(private viewContainer: ViewContainerRef) {}

  loadComponent(component: Type<any>) {
    this.viewContainer.clear();
    this.viewContainer.createComponent(component);
  }
}

// Alternative: Use ng-container with ngComponentOutlet
@Component({
  selector: 'app-outlet',
  template: '<ng-container *ngComponentOutlet="component"></ng-container>',
  standalone: true,
  imports: [NgComponentOutlet]
})
export class OutletComponent {
  component = MyComponent;
}`,
      language: 'typescript'
    },
    {
      title: "Enhanced Router Interfaces",
      description: "Router interfaces have been refined for better type safety",
      code: `import { Router, Routes, RouteReuseStrategy } from '@angular/router';
import { Component, inject } from '@angular/core';

const routes: Routes = [
  {
    path: 'dashboard',
    component: DashboardComponent,
    data: { title: 'Dashboard' },
    canActivate: [authGuard],
    canDeactivate: [confirmExitGuard]
  },
  {
    path: 'users/:id',
    component: UserDetailComponent,
    resolve: { user: userResolver }
  }
];

@Component({
  selector: 'app-navigation',
  template: '<a routerLink="/dashboard">Dashboard</a>',
  standalone: true,
  imports: [RouterLink]
})
export class NavComponent {
  router = inject(Router);
  
  navigate() {
    this.router.navigate(['/dashboard'], {
      queryParams: { tab: 'overview' },
      replaceUrl: true
    });
  }
}`,
      language: 'typescript'
    },
    {
      title: "@Service Decorator Improvements",
      description: "The @Service decorator is now more powerful with enhanced configuration options",
      code: `import { Service, inject, Optional } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Service({
  providedIn: 'root',
  // Optional: specify the injection token
  // token: MY_SERVICE_TOKEN
})
export class DataService {
  private http = inject(HttpClient);
  private apiUrl = 'https://api.example.com';

  getUsers() {
    return this.http.get<User[]>(this.apiUrl + '/users');
  }

  getUser(id: string) {
    return this.http.get<User>(this.apiUrl + '/users/' + id);
  }
}

@Component({
  selector: 'app-users',
  template: '<div>{{ (users$ | async) | json }}</div>',
  standalone: true
})
export class UsersComponent {
  private dataService = inject(DataService);
  users$ = this.dataService.getUsers();
}`,
      language: 'typescript'
    },
    {
      title: "Built-in SVG Namespace Handling",
      description: "Angular 22 now has better built-in SVG and namespace element handling",
      code: `import { Component } from '@angular/core';

@Component({
  selector: 'app-svg-demo',
  template: \`
    <svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="40" fill="blue" />
      <text x="50" y="50" text-anchor="middle" fill="white">
        {{ title }}
      </text>
    </svg>
  \`,
  standalone: true,
  styles: [\`
    svg {
      border: 1px solid #ccc;
      border-radius: 4px;
    }
  \`]
})
export class SvgDemoComponent {
  title = 'Circle';
}`,
      language: 'typescript'
    },
    {
      title: "Case-Insensitive Resource URL Sanitizer",
      description: "Resource URL sanitizer lookups are now case-insensitive for better compatibility",
      code: `import { Component, SecurityContext } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-media',
  template: \`
    <img [src]="imageUrl" />
    <video [src]="videoUrl"></video>
  \`,
  standalone: true
})
export class MediaComponent {
  constructor(private sanitizer: DomSanitizer) {}
  
  imageUrl = this.sanitizer.sanitize(
    SecurityContext.URL, 
    'HTTPS://EXAMPLE.COM/IMAGE.PNG' // Works with uppercase
  );
  
  videoUrl = this.sanitizer.sanitize(
    SecurityContext.URL,
    'https://example.com/video.mp4'
  );
}`,
      language: 'typescript'
    }
  ]

  const interviewQuestions = [
    {
      question: "What is the minimum TypeScript version required for Angular 22?",
      answer: "Angular 22 requires TypeScript 6.0 or higher. Support for older TypeScript versions has been dropped."
    },
    {
      question: "How do I migrate from ComponentFactoryResolver in Angular 22?",
      answer: "Use ViewContainerRef.createComponent() directly with the component type, or use ngComponentOutlet directive for template-based dynamic components."
    },
    {
      question: "What are the enhanced router interface improvements in Angular 22?",
      answer: "Angular 22 provides refined router interfaces with better type safety, improved TypeScript support, and more consistent API design for route configuration."
    },
    {
      question: "What improvements were made to the @Service decorator in Angular 22?",
      answer: "The @Service decorator now has enhanced configuration options, better type inference, and more consistent behavior with the standard @Injectable() decorator."
    },
    {
      question: "How does Angular 22 handle SVG namespace elements?",
      answer: "Angular 22 has built-in support for SVG and namespaced elements, automatically handling XML namespace declarations and properly rendering SVG content."
    },
    {
      question: "What is the case-insensitive resource URL sanitizer in Angular 22?",
      answer: "The resource URL sanitizer in Angular 22 treats URLs case-insensitively during lookups, improving compatibility with different URL formats and protocols."
    },
    {
      question: "Are there any breaking changes between Angular 21 and 22?",
      answer: "Yes, Angular 22 requires TypeScript 6.0+, completely removes ComponentFactoryResolver, and has enhanced router interfaces that may require minor code adjustments."
    },
    {
      question: "How should I prepare my Angular 21 application for Angular 22?",
      answer: "Update TypeScript to 6.0+, replace ComponentFactoryResolver usage with createComponent(), ensure all router configurations use the new enhanced interfaces, and test thoroughly."
    },
    {
      question: "What performance improvements does Angular 22 bring?",
      answer: "Angular 22 includes optimizations in the Ivy compiler, improved SVG rendering, better namespace handling, and more efficient change detection mechanisms."
    },
    {
      question: "How does Angular 22 handle Ahead-of-Time (AOT) compilation?",
      answer: "Angular 22 supports AOT compilation by default with enhanced compiler features, improved type checking, and better integration with standalone components."
    }
  ]

  return (
    <PageLayout
      title="Angular 22 Features"
      description="Explore the major updates and improvements in Angular 22, including TypeScript 6.0 requirement, removal of ComponentFactoryResolver, and enhanced APIs for modern Angular development."
      lastUpdated="May 2026"
    >
      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6 text-foreground">Angular 22: Modern APIs & Enhanced Features</h2>
        
        <div className="bg-accent/20 border border-accent rounded-lg p-6 mb-8">
          <h3 className="text-lg font-semibold mb-3">📋 Release Overview</h3>
          <p className="text-muted-foreground mb-4">
            Angular 22, released in May 2026, continues the evolution of Angular with significant modernization efforts. This version requires TypeScript 6.0+, removes legacy ComponentFactoryResolver APIs, and introduces enhanced APIs for better developer experience.
          </p>
          <ul className="space-y-2 text-sm">
            <li>✅ TypeScript 6.0+ requirement for stronger type safety</li>
            <li>✅ Complete removal of ComponentFactoryResolver</li>
            <li>✅ Enhanced router interfaces with improved type checking</li>
            <li>✅ Improved @Service decorator capabilities</li>
            <li>✅ Better SVG and namespace element handling</li>
            <li>✅ Case-insensitive resource URL sanitizer</li>
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
        <h2 className="text-2xl font-bold mb-6">Breaking Changes & Migration</h2>
        
        <div className="space-y-6">
          <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-3">🚨 Critical Breaking Changes</h3>
            
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">1. TypeScript 6.0+ Requirement</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  Angular 22 now requires TypeScript 6.0 or higher. Projects using older TypeScript versions will not compile.
                </p>
                <code className="text-xs bg-background p-2 rounded block">
                  npm install typescript@^6.0.0
                </code>
              </div>

              <div>
                <h4 className="font-semibold mb-2">2. ComponentFactoryResolver Complete Removal</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  ComponentFactoryResolver and ComponentFactory are completely removed. No polyfill available.
                </p>
                <code className="text-xs bg-background p-2 rounded block">
                  Use: ViewContainerRef.createComponent() or NgComponentOutlet
                </code>
              </div>

              <div>
                <h4 className="font-semibold mb-2">3. Router Interface Changes</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  Router interfaces have been refined with stricter typing, which may cause compilation errors in existing code.
                </p>
              </div>

              <div>
                <h4 className="font-semibold mb-2">4. SVG Namespace Handling</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  SVG and namespaced elements are now handled differently. Ensure your templates are compliant with XML namespace standards.
                </p>
              </div>

              <div>
                <h4 className="font-semibold mb-2">5. Zoneless Change Detection Preview</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  Zoneless change detection is in developer preview. Zone.js is still required but you can opt-out with configuration.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-primary/10 border border-primary/30 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-3">✨ Migration Checklist</h3>
            <ul className="space-y-2 text-sm">
              <li>✓ Update TypeScript to 6.0+</li>
              <li>✓ Replace all ComponentFactoryResolver usage</li>
              <li>✓ Update Router configurations to use new interfaces</li>
              <li>✓ Validate SVG templates for namespace compliance</li>
              <li>✓ Test resource URL sanitization with various URL formats</li>
              <li>✓ Review @Service decorator usage and configurations</li>
              <li>✓ Run full test suite and update any failing tests</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Feature Comparison Table</h2>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left p-3 font-semibold">Feature</th>
                <th className="text-left p-3 font-semibold">Angular 20</th>
                <th className="text-left p-3 font-semibold">Angular 21</th>
                <th className="text-left p-3 font-semibold">Angular 22</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-border hover:bg-accent/50">
                <td className="p-3">Min TypeScript Version</td>
                <td className="p-3">5.5</td>
                <td className="p-3">5.5</td>
                <td className="p-3">6.0</td>
              </tr>
              <tr className="border-b border-border hover:bg-accent/50">
                <td className="p-3">ComponentFactoryResolver</td>
                <td className="p-3">✅ Available</td>
                <td className="p-3">❌ Removed</td>
                <td className="p-3">❌ Removed</td>
              </tr>
              <tr className="border-b border-border hover:bg-accent/50">
                <td className="p-3">Router Type Safety</td>
                <td className="p-3">Good</td>
                <td className="p-3">Good</td>
                <td className="p-3">✅ Enhanced</td>
              </tr>
              <tr className="border-b border-border hover:bg-accent/50">
                <td className="p-3">@Service Decorator</td>
                <td className="p-3">❌ Not available</td>
                <td className="p-3">✅ New</td>
                <td className="p-3">✅ Enhanced</td>
              </tr>
              <tr className="border-b border-border hover:bg-accent/50">
                <td className="p-3">SVG Namespace Support</td>
                <td className="p-3">Basic</td>
                <td className="p-3">Basic</td>
                <td className="p-3">✅ Enhanced</td>
              </tr>
              <tr className="border-b border-border hover:bg-accent/50">
                <td className="p-3">Resource URL Sanitizer</td>
                <td className="p-3">Case-sensitive</td>
                <td className="p-3">Case-sensitive</td>
                <td className="p-3">✅ Case-insensitive</td>
              </tr>
              <tr className="hover:bg-accent/50">
                <td className="p-3">Zoneless Change Detection</td>
                <td className="p-3">❌ Not available</td>
                <td className="p-3">❌ Not available</td>
                <td className="p-3">⚠️ Preview</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Performance & Future Roadmap</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-6">
            <h3 className="font-semibold mb-3">Performance Improvements</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Enhanced Ivy compiler optimizations</li>
              <li>• Faster template compilation</li>
              <li>• Improved change detection efficiency</li>
              <li>• Better tree-shaking capabilities</li>
              <li>• Reduced bundle sizes</li>
            </ul>
          </div>

          <div className="bg-accent/5 border border-accent/20 rounded-lg p-6">
            <h3 className="font-semibold mb-3">Upcoming Features (Angular 23+)</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Stable zoneless change detection</li>
              <li>• Enhanced signals API</li>
              <li>• More powerful effect APIs</li>
              <li>• Improved SSR capabilities</li>
              <li>• Better DX with CLI improvements</li>
            </ul>
          </div>
        </div>
      </section>

      <InterviewQuestions questions={interviewQuestions} />
    </PageLayout>
  )
}
