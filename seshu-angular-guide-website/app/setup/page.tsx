import PageLayout from "@/components/page-layout"
import CodeExample from "@/components/code-example"
import InterviewQuestions from "@/components/interview-questions"

const setupExamples = [
  {
    title: "Install Angular CLI",
    code: `# Install Angular CLI globally
npm install -g @angular/cli

# Verify installation
ng version

# Create new Angular project
ng new my-angular-app

# Navigate to project directory
cd my-angular-app

# Start development server
ng serve`,
    language: "bash" as const,
  },
  {
    title: "Angular CLI Commands",
    code: `# Generate components
ng generate component my-component
ng g c my-component

# Generate services
ng generate service my-service
ng g s my-service

# Generate modules
ng generate module my-module
ng g m my-module

# Generate pipes
ng generate pipe my-pipe
ng g p my-pipe

# Build for production
ng build --prod`,
    language: "bash" as const,
  },
  {
    title: "Package.json Dependencies",
    code: `{
  "dependencies": {
    "@angular/animations": "^20.0.0",
    "@angular/common": "^20.0.0",
    "@angular/compiler": "^20.0.0",
    "@angular/core": "^20.0.0",
    "@angular/forms": "^20.0.0",
    "@angular/platform-browser": "^20.0.0",
    "@angular/platform-browser-dynamic": "^20.0.0",
    "@angular/router": "^20.0.0",
    "rxjs": "~7.8.0",
    "tslib": "^2.3.0",
    "zone.js": "~0.14.0"
  },
  "devDependencies": {
    "@angular-devkit/build-angular": "^20.0.0",
    "@angular/cli": "^20.0.0",
    "@angular/compiler-cli": "^20.0.0",
    "typescript": "~5.6.0"
  }
}`,
    language: "json" as const,
  },
]

const interviewQuestions = [
  {
    question: "What are the system requirements for Angular development?",
    answer:
      "Angular requires Node.js (version 18.19 or later), npm (comes with Node.js), and Angular CLI. You also need a code editor like VS Code and a modern web browser for testing.",
    difficulty: "Beginner" as const,
  },
  {
    question: "What is Angular CLI and why is it important?",
    answer:
      "Angular CLI (Command Line Interface) is a powerful tool that helps create, build, test, and deploy Angular applications. It provides commands for generating components, services, modules, and other Angular artifacts, making development faster and more consistent.",
    difficulty: "Beginner" as const,
  },
  {
    question: "How do you create a new Angular project?",
    answer:
      "Use the command 'ng new project-name' after installing Angular CLI globally with 'npm install -g @angular/cli'. The CLI will prompt you to choose routing and styling options.",
    difficulty: "Beginner" as const,
  },
  {
    question: "What is the difference between 'ng serve' and 'ng build'?",
    answer:
      "'ng serve' starts a development server with live reload for development, while 'ng build' compiles the application into output files for deployment. 'ng build --prod' creates optimized production builds.",
    difficulty: "Beginner" as const,
  },
  {
    question: "How do you update Angular to the latest version?",
    answer:
      "Use 'ng update @angular/cli @angular/core' to update Angular CLI and core packages. For major version updates, use 'ng update @angular/cli@latest @angular/core@latest'. Always check the Angular Update Guide for breaking changes.",
    difficulty: "Intermediate" as const,
  },
]

export default function SetupPage() {
  return (
    <PageLayout
      title="Setup & Installation"
      description="Complete guide to setting up Angular development environment and creating your first Angular application."
    >
      <div className="space-y-12">
        {/* Prerequisites */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Prerequisites</h2>
          <div className="space-y-4">
            <div className="p-6 bg-muted rounded-lg">
              <h3 className="text-lg font-semibold mb-3">System Requirements</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  • <strong>Node.js:</strong> Version 18.19 or later
                </li>
                <li>
                  • <strong>npm:</strong> Version 9 or later (comes with Node.js)
                </li>
                <li>
                  • <strong>Operating System:</strong> Windows, macOS, or Linux
                </li>
                <li>
                  • <strong>Code Editor:</strong> VS Code (recommended), WebStorm, or Sublime Text
                </li>
                <li>
                  • <strong>Browser:</strong> Chrome, Firefox, Safari, or Edge (latest versions)
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Installation Steps */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Installation Steps</h2>
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">1. Install Node.js</h3>
              <p className="text-muted-foreground">
                Download and install Node.js from{" "}
                <a href="https://nodejs.org" className="text-primary hover:underline">
                  nodejs.org
                </a>
                . This will also install npm (Node Package Manager).
              </p>
              <CodeExample
                title="Verify Node.js Installation"
                code={`# Check Node.js version
node --version

# Check npm version
npm --version`}
                language="bash"
              />
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-semibold">2. Install Angular CLI</h3>
              <p className="text-muted-foreground">
                Angular CLI is a command-line tool that helps you create, build, and maintain Angular applications.
              </p>
              <CodeExample {...setupExamples[0]} />
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-semibold">3. Create Your First Project</h3>
              <p className="text-muted-foreground">
                Once Angular CLI is installed, you can create a new Angular project with routing and styling options.
              </p>
              <CodeExample
                title="Create New Angular Project"
                code={`# Create new project with routing and SCSS
ng new my-angular-app --routing --style=scss

# Or create with prompts
ng new my-angular-app

# Navigate to project
cd my-angular-app

# Start development server
ng serve --open`}
                language="bash"
              />
            </div>
          </div>
        </section>

        {/* Angular CLI Commands */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Essential Angular CLI Commands</h2>
          <div className="space-y-6">
            <p className="text-muted-foreground">
              Angular CLI provides many commands to help you develop Angular applications efficiently.
            </p>
            <CodeExample {...setupExamples[1]} />
          </div>
        </section>

        {/* Project Dependencies */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Understanding Dependencies</h2>
          <div className="space-y-6">
            <p className="text-muted-foreground">
              Angular projects come with essential dependencies. Here's what a typical package.json looks like:
            </p>
            <CodeExample {...setupExamples[2]} />

            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-6 bg-muted rounded-lg">
                <h3 className="text-lg font-semibold mb-3">Core Dependencies</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>
                    • <strong>@angular/core:</strong> Core Angular framework
                  </li>
                  <li>
                    • <strong>@angular/common:</strong> Common directives and pipes
                  </li>
                  <li>
                    • <strong>@angular/router:</strong> Routing functionality
                  </li>
                  <li>
                    • <strong>@angular/forms:</strong> Form handling
                  </li>
                  <li>
                    • <strong>rxjs:</strong> Reactive programming library
                  </li>
                </ul>
              </div>
              <div className="p-6 bg-muted rounded-lg">
                <h3 className="text-lg font-semibold mb-3">Development Dependencies</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>
                    • <strong>@angular/cli:</strong> Angular command line tools
                  </li>
                  <li>
                    • <strong>@angular/compiler-cli:</strong> Angular compiler
                  </li>
                  <li>
                    • <strong>typescript:</strong> TypeScript compiler
                  </li>
                  <li>
                    • <strong>@angular-devkit/build-angular:</strong> Build tools
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Development Environment */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Development Environment Setup</h2>
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-6 bg-muted rounded-lg">
                <h3 className="text-lg font-semibold mb-3">VS Code Extensions</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Angular Language Service</li>
                  <li>• Angular Snippets</li>
                  <li>• TypeScript Hero</li>
                  <li>• Prettier - Code formatter</li>
                  <li>• ESLint</li>
                  <li>• Auto Rename Tag</li>
                </ul>
              </div>
              <div className="p-6 bg-muted rounded-lg">
                <h3 className="text-lg font-semibold mb-3">Browser Tools</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Angular DevTools (Chrome/Firefox)</li>
                  <li>• Redux DevTools (for NgRx)</li>
                  <li>• Augury (legacy Angular debugging)</li>
                  <li>• Browser Developer Tools</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Troubleshooting */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Common Setup Issues</h2>
          <div className="space-y-4">
            <div className="p-6 bg-muted rounded-lg">
              <h3 className="text-lg font-semibold mb-3">Permission Issues</h3>
              <p className="text-sm text-muted-foreground mb-2">
                If you get permission errors when installing Angular CLI globally:
              </p>
              <CodeExample
                title="Fix npm Permissions"
                code={`# On macOS/Linux
sudo npm install -g @angular/cli

# Or configure npm to use a different directory
npm config set prefix '~/.npm-global'
export PATH=~/.npm-global/bin:$PATH`}
                language="bash"
              />
            </div>

            <div className="p-6 bg-muted rounded-lg">
              <h3 className="text-lg font-semibold mb-3">Port Already in Use</h3>
              <p className="text-sm text-muted-foreground mb-2">If port 4200 is already in use:</p>
              <CodeExample
                title="Use Different Port"
                code={`# Serve on different port
ng serve --port 4201

# Or kill process using port 4200
lsof -ti:4200 | xargs kill -9`}
                language="bash"
              />
            </div>
          </div>
        </section>

        {/* Interview Questions */}
        <InterviewQuestions questions={interviewQuestions} />
      </div>
    </PageLayout>
  )
}
