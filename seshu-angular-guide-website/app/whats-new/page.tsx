'use client'

import { PageLayout } from '@/components/page-layout'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export default function UpdatesPage() {
  return (
    <PageLayout
      title="2026 Updates - Angular Guide Enhancement"
      description="Comprehensive updates to the Angular guide including Angular 21 & 22 features, latest breaking changes, and 10 new interview questions"
    >
      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6 text-foreground">What&apos;s New in May 2026</h2>
        
        <div className="bg-accent/20 border border-accent rounded-lg p-6 mb-8">
          <h3 className="text-lg font-semibold mb-3">📅 Latest Updates Summary</h3>
          <p className="text-muted-foreground mb-4">
            This comprehensive update brings the Angular Guide from the August 2025 build up to speed with all developments through May 2026. We&apos;ve added two complete new Angular versions (Angular 21 & 22), 10 new advanced interview questions, and critical migration guidance.
          </p>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">📚 New Sections Added</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6 border-primary/30 bg-primary/5">
            <div className="flex items-start gap-3 mb-3">
              <Badge className="mt-1">New</Badge>
              <div>
                <h3 className="font-semibold text-lg">Angular 21 Features</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Comprehensive coverage of breaking changes and new APIs in Angular 21
                </p>
              </div>
            </div>
            <ul className="text-sm space-y-1 text-muted-foreground mt-4">
              <li>✓ @Service Decorator</li>
              <li>✓ Removal of NgModuleFactory</li>
              <li>✓ Enhanced NgComponentOutlet</li>
              <li>✓ Improved TestBed PlatformLocation</li>
              <li>✓ Enhanced SSR Support</li>
            </ul>
          </Card>

          <Card className="p-6 border-accent/30 bg-accent/5">
            <div className="flex items-start gap-3 mb-3">
              <Badge className="mt-1">New</Badge>
              <div>
                <h3 className="font-semibold text-lg">Angular 22 Features</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Latest updates including TypeScript 6.0 requirement and modern APIs
                </p>
              </div>
            </div>
            <ul className="text-sm space-y-1 text-muted-foreground mt-4">
              <li>✓ TypeScript 6.0+ Requirement</li>
              <li>✓ ComponentFactoryResolver Removal</li>
              <li>✓ Enhanced Router Interfaces</li>
              <li>✓ Case-Insensitive URL Sanitizer</li>
              <li>✓ Zoneless Change Detection Preview</li>
            </ul>
          </Card>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">🎯 Critical Breaking Changes Timeline</h2>
        
        <div className="space-y-4">
          <div className="border-l-4 border-primary pl-4 py-2">
            <h4 className="font-semibold mb-1">Angular 21 (November 2025)</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• @Service decorator introduced</li>
              <li>• NgModuleFactory completely removed</li>
              <li>• TestBed PlatformLocation now properly mocked</li>
              <li>• Enhanced server-side rendering capabilities</li>
            </ul>
          </div>

          <div className="border-l-4 border-accent pl-4 py-2">
            <h4 className="font-semibold mb-1">Angular 22 (May 2026)</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• TypeScript 6.0+ is now required</li>
              <li>• ComponentFactoryResolver completely removed</li>
              <li>• Router interfaces significantly refined</li>
              <li>• Built-in SVG namespace handling</li>
              <li>• Zoneless change detection in preview</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">📊 Enhanced Interview Questions</h2>
        
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 mb-6">
          <h3 className="font-semibold mb-3">Added 10 New Expert-Level Questions (IDs 51-60)</h3>
          <p className="text-sm text-muted-foreground mb-4">
            The interview questions hub now includes targeted questions about Angular 21 and 22 features:
          </p>
          <ul className="space-y-2 text-sm">
            <li className="flex items-start gap-2">
              <span className="font-semibold min-w-fit">Q51:</span>
              <span>What is the new @Service decorator in Angular 21?</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-semibold min-w-fit">Q52:</span>
              <span>What are the breaking changes in Angular 21 regarding NgModuleFactory?</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-semibold min-w-fit">Q53:</span>
              <span>What TypeScript version is required for Angular 22?</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-semibold min-w-fit">Q54:</span>
              <span>How does the case-insensitive resource URL sanitizer work in Angular 22?</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-semibold min-w-fit">Q55:</span>
              <span>What improvements were made to SVG namespace handling in Angular 22?</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-semibold min-w-fit">Q56:</span>
              <span>How do enhanced router interfaces in Angular 22 improve type safety?</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-semibold min-w-fit">Q57:</span>
              <span>What is zoneless change detection in Angular 22?</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-semibold min-w-fit">Q58:</span>
              <span>What are the migration steps from Angular 21 to Angular 22?</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-semibold min-w-fit">Q59:</span>
              <span>How does @Service compare to @Injectable?</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-semibold min-w-fit">Q60:</span>
              <span>What are the performance improvements in Angular 22?</span>
            </li>
          </ul>
        </div>

        <div className="text-sm text-muted-foreground">
          <p>Total Interview Questions: Now 60 (Previously 50) - covering all new features with detailed code examples</p>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">🚀 Migration Guidance</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6 border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20">
            <h3 className="font-semibold mb-3">From Angular 20 to 21</h3>
            <ul className="text-sm space-y-2">
              <li>✓ Migrate NgModuleFactory to standalone components</li>
              <li>✓ Update TestBed tests for new PlatformLocation</li>
              <li>✓ Use @Service for new services</li>
              <li>✓ Update SSR bootstrapping</li>
            </ul>
          </Card>

          <Card className="p-6 border-orange-200 bg-orange-50 dark:bg-orange-900/20">
            <h3 className="font-semibold mb-3">From Angular 21 to 22</h3>
            <ul className="text-sm space-y-2">
              <li>✓ Update TypeScript to 6.0+</li>
              <li>✓ Replace all ComponentFactoryResolver usage</li>
              <li>✓ Update Router configurations</li>
              <li>✓ Test SVG rendering with new namespace support</li>
            </ul>
          </Card>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">📈 Version Comparison Matrix</h2>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left p-3 font-semibold">Feature</th>
                <th className="text-left p-3 font-semibold">Angular 19</th>
                <th className="text-left p-3 font-semibold">Angular 20</th>
                <th className="text-left p-3 font-semibold">Angular 21</th>
                <th className="text-left p-3 font-semibold">Angular 22</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-border hover:bg-accent/50">
                <td className="p-3">@Service Decorator</td>
                <td className="p-3">❌</td>
                <td className="p-3">❌</td>
                <td className="p-3">✅ New</td>
                <td className="p-3">✅ Enhanced</td>
              </tr>
              <tr className="border-b border-border hover:bg-accent/50">
                <td className="p-3">NgModuleFactory</td>
                <td className="p-3">✅</td>
                <td className="p-3">✅</td>
                <td className="p-3">❌ Removed</td>
                <td className="p-3">❌ Removed</td>
              </tr>
              <tr className="border-b border-border hover:bg-accent/50">
                <td className="p-3">ComponentFactoryResolver</td>
                <td className="p-3">✅</td>
                <td className="p-3">✅</td>
                <td className="p-3">❌ Removed</td>
                <td className="p-3">❌ Removed</td>
              </tr>
              <tr className="border-b border-border hover:bg-accent/50">
                <td className="p-3">Min TypeScript</td>
                <td className="p-3">5.2</td>
                <td className="p-3">5.5</td>
                <td className="p-3">5.5</td>
                <td className="p-3">6.0+</td>
              </tr>
              <tr className="border-b border-border hover:bg-accent/50">
                <td className="p-3">SVG Namespace Support</td>
                <td className="p-3">Basic</td>
                <td className="p-3">Basic</td>
                <td className="p-3">Basic</td>
                <td className="p-3">✅ Enhanced</td>
              </tr>
              <tr className="border-b border-border hover:bg-accent/50">
                <td className="p-3">Case-Insensitive URL Sanitizer</td>
                <td className="p-3">❌</td>
                <td className="p-3">❌</td>
                <td className="p-3">❌</td>
                <td className="p-3">✅ New</td>
              </tr>
              <tr className="border-b border-border hover:bg-accent/50">
                <td className="p-3">Zoneless Change Detection</td>
                <td className="p-3">❌</td>
                <td className="p-3">❌</td>
                <td className="p-3">❌</td>
                <td className="p-3">⚠️ Preview</td>
              </tr>
              <tr className="hover:bg-accent/50">
                <td className="p-3">Router Type Safety</td>
                <td className="p-3">Good</td>
                <td className="p-3">Good</td>
                <td className="p-3">Good</td>
                <td className="p-3">✅ Enhanced</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">📝 Updated Content Structure</h2>
        
        <div className="space-y-3">
          <div className="flex items-start gap-3 p-3 bg-foreground/5 rounded-lg">
            <span className="text-lg">📖</span>
            <div>
              <p className="font-semibold">Fundamentals (6 topics)</p>
              <p className="text-sm text-muted-foreground">Components, Templates, Directives, Services, Routing, Forms</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3 p-3 bg-foreground/5 rounded-lg">
            <span className="text-lg">⚙️</span>
            <div>
              <p className="font-semibold">Intermediate (6 topics)</p>
              <p className="text-sm text-muted-foreground">HTTP Client, RxJS, State Management, Pipes, Lifecycle Hooks, Component Communication</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3 p-3 bg-foreground/5 rounded-lg">
            <span className="text-lg">🔧</span>
            <div>
              <p className="font-semibold">Advanced (8 topics)</p>
              <p className="text-sm text-muted-foreground">Change Detection, Dynamic Components, Custom Directives, Animations, Lazy Loading, Testing, Performance, Security</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3 p-3 bg-foreground/5 rounded-lg">
            <span className="text-lg">🎨</span>
            <div>
              <p className="font-semibold">Design Patterns (5 topics)</p>
              <p className="text-sm text-muted-foreground">Singleton, Observer, Dependency Injection, Factory, Repository</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3 p-3 bg-foreground/5 rounded-lg">
            <span className="text-lg">✨</span>
            <div>
              <p className="font-semibold">Latest Features (4 topics) - NOW UPDATED!</p>
              <p className="text-sm text-muted-foreground">Angular 19, Angular 20, Angular 21 (NEW), Angular 22 (NEW)</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3 p-3 bg-foreground/5 rounded-lg">
            <span className="text-lg">❓</span>
            <div>
              <p className="font-semibold">Interview Questions (60 total) - EXPANDED!</p>
              <p className="text-sm text-muted-foreground">Previously 50 questions, now 60 with Angular 21 & 22 coverage</p>
            </div>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-6">🎓 What You Get Now</h2>
        
        <div className="bg-primary/5 border border-primary/20 rounded-lg p-8">
          <ul className="space-y-3">
            <li className="flex items-center gap-2">
              <span className="text-lg">✅</span>
              <span>Complete Angular fundamentals to advanced topics</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-lg">✅</span>
              <span>Latest Angular 21 & 22 features with breaking changes</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-lg">✅</span>
              <span>60 expert-level interview questions with code examples</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-lg">✅</span>
              <span>Migration guides for Angular versions 19-22</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-lg">✅</span>
              <span>Design patterns implementation in Angular</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-lg">✅</span>
              <span>Best practices for production-ready applications</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-lg">✅</span>
              <span>Comprehensive code examples for every topic</span>
            </li>
          </ul>
        </div>
      </section>
    </PageLayout>
  )
}
