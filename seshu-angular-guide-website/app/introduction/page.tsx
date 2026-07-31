import { PageLayout } from "@/components/page-layout"

export default function IntroductionPage() {
  return (
    <PageLayout
      title="Introduction to Angular"
      description="Welcome to the comprehensive Angular guide"
      previousPage={null}
      nextPage={{ title: "Components", href: "/fundamentals/components" }}
    >
      <div className="prose prose-slate max-w-none">
        <h2>Welcome to Angular Mastery</h2>
        <p>
          This comprehensive guide will take you from Angular beginner to expert level. Whether you're preparing for
          interviews, building your first Angular application, or looking to master advanced concepts, this guide has
          everything you need.
        </p>

        <h3>What You'll Learn</h3>
        <ul>
          <li>
            <strong>Fundamentals:</strong> Components, templates, data binding, directives, services, routing, and forms
          </li>
          <li>
            <strong>Intermediate Concepts:</strong> HTTP client, RxJS, state management, pipes, lifecycle hooks, and
            component communication
          </li>
          <li>
            <strong>Advanced Topics:</strong> Change detection, dynamic components, custom directives, animations, lazy
            loading, testing, performance, and security
          </li>
          <li>
            <strong>Design Patterns:</strong> Singleton, Observer, Dependency Injection, Factory, Repository patterns
            and more
          </li>
          <li>
            <strong>Latest Features:</strong> Angular 19 and 20 features including Signals, standalone components, and
            SSR improvements
          </li>
          <li>
            <strong>Interview Preparation:</strong> 50+ most important Angular interview questions with detailed answers
          </li>
        </ul>

        <h3>How to Use This Guide</h3>
        <p>
          This guide is structured as a progressive learning path. Start with the fundamentals if you're new to Angular,
          or jump to specific sections based on your needs. Each section includes:
        </p>
        <ul>
          <li>Detailed theory explanations</li>
          <li>Practical code examples</li>
          <li>Best practices and common pitfalls</li>
          <li>Interview questions to test your understanding</li>
        </ul>

        <h3>Prerequisites</h3>
        <p>To get the most out of this guide, you should have:</p>
        <ul>
          <li>Basic knowledge of HTML, CSS, and JavaScript</li>
          <li>Understanding of TypeScript fundamentals</li>
          <li>Familiarity with modern JavaScript (ES6+)</li>
          <li>Basic understanding of web development concepts</li>
        </ul>

        <p>Ready to start your Angular journey? Let's begin with the fundamentals!</p>
      </div>
    </PageLayout>
  )
}
