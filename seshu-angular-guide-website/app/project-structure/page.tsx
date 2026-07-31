import PageLayout from "@/components/page-layout"
import CodeExample from "@/components/code-example"
import InterviewQuestions from "@/components/interview-questions"

const structureExamples = [
  {
    title: "Angular Project Structure",
    code: `my-angular-app/
├── src/
│   ├── app/
│   │   ├── components/
│   │   ├── services/
│   │   ├── models/
│   │   ├── guards/
│   │   ├── interceptors/
│   │   ├── app.component.ts
│   │   ├── app.component.html
│   │   ├── app.component.scss
│   │   ├── app.module.ts
│   │   └── app-routing.module.ts
│   ├── assets/
│   ├── environments/
│   ├── index.html
│   ├── main.ts
│   ├── polyfills.ts
│   └── styles.scss
├── angular.json
├── package.json
├── tsconfig.json
├── tsconfig.app.json
└── tsconfig.spec.json`,
    language: "text" as const,
  },
  {
    title: "App Module Structure",
    code: `import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }`,
    language: "typescript" as const,
  },
  {
    title: "Environment Configuration",
    code: `// src/environments/environment.ts (Development)
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api',
  appName: 'My Angular App (Dev)',
  enableLogging: true
};

// src/environments/environment.prod.ts (Production)
export const environment = {
  production: true,
  apiUrl: 'https://api.myapp.com',
  appName: 'My Angular App',
  enableLogging: false
};`,
    language: "typescript" as const,
  },
]

const interviewQuestions = [
  {
    question: "What is the purpose of the src/app folder in Angular?",
    answer:
      "The src/app folder contains the main application code including components, services, modules, and routing configuration. It's where you write most of your Angular application logic.",
    difficulty: "Beginner" as const,
  },
  {
    question: "What is the difference between angular.json and package.json?",
    answer:
      "package.json manages npm dependencies and scripts, while angular.json is Angular CLI's configuration file that defines build settings, project structure, and CLI command configurations.",
    difficulty: "Beginner" as const,
  },
  {
    question: "What is the purpose of the main.ts file?",
    answer:
      "main.ts is the entry point of the Angular application. It bootstraps the root module (AppModule) and starts the Angular application by calling platformBrowserDynamic().bootstrapModule().",
    difficulty: "Intermediate" as const,
  },
  {
    question: "How do environment files work in Angular?",
    answer:
      "Environment files allow you to define different configurations for different environments (dev, prod, staging). Angular CLI automatically replaces environment.ts with the appropriate environment file during build based on the --configuration flag.",
    difficulty: "Intermediate" as const,
  },
  {
    question: "What is the purpose of the assets folder?",
    answer:
      "The assets folder contains static files like images, fonts, and other resources that need to be copied as-is to the output directory during build. Files in assets are publicly accessible via URL.",
    difficulty: "Beginner" as const,
  },
]

export default function ProjectStructurePage() {
  return (
    <PageLayout
      title="Project Structure"
      description="Understanding Angular project structure, file organization, and configuration files for efficient development."
    >
      <div className="space-y-12">
        {/* Overview */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Angular Project Overview</h2>
          <div className="space-y-4">
            <p className="text-muted-foreground">
              Angular projects follow a well-defined structure that promotes organization, maintainability, and
              scalability. Understanding this structure is crucial for efficient Angular development.
            </p>
            <CodeExample {...structureExamples[0]} />
          </div>
        </section>

        {/* Key Directories */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Key Directories and Files</h2>
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-6 bg-muted rounded-lg">
                <h3 className="text-lg font-semibold mb-3">Root Level Files</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>
                    • <strong>angular.json:</strong> Angular CLI configuration
                  </li>
                  <li>
                    • <strong>package.json:</strong> npm dependencies and scripts
                  </li>
                  <li>
                    • <strong>tsconfig.json:</strong> TypeScript configuration
                  </li>
                  <li>
                    • <strong>karma.conf.js:</strong> Testing configuration
                  </li>
                  <li>
                    • <strong>.gitignore:</strong> Git ignore rules
                  </li>
                </ul>
              </div>
              <div className="p-6 bg-muted rounded-lg">
                <h3 className="text-lg font-semibold mb-3">Source Directory (src/)</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>
                    • <strong>app/:</strong> Main application code
                  </li>
                  <li>
                    • <strong>assets/:</strong> Static files (images, fonts)
                  </li>
                  <li>
                    • <strong>environments/:</strong> Environment configurations
                  </li>
                  <li>
                    • <strong>index.html:</strong> Main HTML file
                  </li>
                  <li>
                    • <strong>main.ts:</strong> Application entry point
                  </li>
                  <li>
                    • <strong>styles.scss:</strong> Global styles
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* App Directory Structure */}
        <section>
          <h2 className="text-2xl font-bold mb-6">App Directory Structure</h2>
          <div className="space-y-6">
            <p className="text-muted-foreground">
              The app directory contains your application's main logic. Here's how to organize it effectively:
            </p>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="p-6 bg-muted rounded-lg">
                <h3 className="text-lg font-semibold mb-3">Components</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Feature components</li>
                  <li>• Shared/reusable components</li>
                  <li>• Layout components</li>
                  <li>• UI components</li>
                </ul>
              </div>
              <div className="p-6 bg-muted rounded-lg">
                <h3 className="text-lg font-semibold mb-3">Services</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Data services</li>
                  <li>• HTTP services</li>
                  <li>• Utility services</li>
                  <li>• State management</li>
                </ul>
              </div>
              <div className="p-6 bg-muted rounded-lg">
                <h3 className="text-lg font-semibold mb-3">Other Folders</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• models/ - TypeScript interfaces</li>
                  <li>• guards/ - Route guards</li>
                  <li>• interceptors/ - HTTP interceptors</li>
                  <li>• pipes/ - Custom pipes</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* App Module */}
        <section>
          <h2 className="text-2xl font-bold mb-6">App Module Configuration</h2>
          <div className="space-y-6">
            <p className="text-muted-foreground">
              The AppModule is the root module that bootstraps your Angular application. It defines the components,
              services, and other modules your app needs.
            </p>
            <CodeExample {...structureExamples[1]} />

            <div className="p-6 bg-muted rounded-lg">
              <h3 className="text-lg font-semibold mb-3">Module Properties</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  • <strong>declarations:</strong> Components, directives, and pipes that belong to this module
                </li>
                <li>
                  • <strong>imports:</strong> Other modules whose exported classes are needed by component templates
                </li>
                <li>
                  • <strong>providers:</strong> Services that this module contributes to the global collection
                </li>
                <li>
                  • <strong>bootstrap:</strong> The main application view (root component)
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Environment Configuration */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Environment Configuration</h2>
          <div className="space-y-6">
            <p className="text-muted-foreground">
              Environment files allow you to define different configurations for different deployment environments.
            </p>
            <CodeExample {...structureExamples[2]} />

            <div className="p-6 bg-muted rounded-lg">
              <h3 className="text-lg font-semibold mb-3">Using Environment Variables</h3>
              <CodeExample
                title="Using Environment in Components"
                code={`import { Component } from '@angular/core';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  template: \`
    <h1>\{\{appName\}\}</h1>
    <p *ngIf="!isProduction">Development Mode</p>
  \`
})
export class AppComponent {
  appName = environment.appName;
  isProduction = environment.production;
  
  constructor() {
    if (environment.enableLogging) {
      console.log('App started in development mode');
    }
  }
}`}
                language="typescript"
              />
            </div>
          </div>
        </section>

        {/* Best Practices */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Project Organization Best Practices</h2>
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-6 bg-muted rounded-lg">
                <h3 className="text-lg font-semibold mb-3">Feature-Based Structure</h3>
                <CodeExample
                  title="Feature Module Organization"
                  code={`src/app/
├── core/
│   ├── services/
│   ├── guards/
│   └── interceptors/
├── shared/
│   ├── components/
│   ├── pipes/
│   └── directives/
├── features/
│   ├── user/
│   │   ├── components/
│   │   ├── services/
│   │   └── user.module.ts
│   └── product/
│       ├── components/
│       ├── services/
│       └── product.module.ts`}
                  language="text"
                />
              </div>
              <div className="p-6 bg-muted rounded-lg">
                <h3 className="text-lg font-semibold mb-3">Naming Conventions</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>
                    • <strong>Components:</strong> user-profile.component.ts
                  </li>
                  <li>
                    • <strong>Services:</strong> user.service.ts
                  </li>
                  <li>
                    • <strong>Modules:</strong> user.module.ts
                  </li>
                  <li>
                    • <strong>Guards:</strong> auth.guard.ts
                  </li>
                  <li>
                    • <strong>Pipes:</strong> currency.pipe.ts
                  </li>
                  <li>
                    • <strong>Interfaces:</strong> user.interface.ts
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Configuration Files */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Important Configuration Files</h2>
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-6 bg-muted rounded-lg">
                <h3 className="text-lg font-semibold mb-3">angular.json</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  Defines build configurations, asset paths, and CLI settings.
                </p>
                <ul className="space-y-1 text-xs text-muted-foreground">
                  <li>• Build configurations</li>
                  <li>• Asset and style paths</li>
                  <li>• Development server settings</li>
                  <li>• Testing configurations</li>
                </ul>
              </div>
              <div className="p-6 bg-muted rounded-lg">
                <h3 className="text-lg font-semibold mb-3">tsconfig.json</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  TypeScript compiler configuration for the entire project.
                </p>
                <ul className="space-y-1 text-xs text-muted-foreground">
                  <li>• Compiler options</li>
                  <li>• Path mappings</li>
                  <li>• Include/exclude patterns</li>
                  <li>• Strict type checking</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Interview Questions */}
        <InterviewQuestions questions={interviewQuestions} />
      </div>
    </PageLayout>
  )
}
