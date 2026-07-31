import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Code, Users, Trophy, Zap, ArrowRight, Star, Clock, Target } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Main Content */}
      <div className="lg:pl-80">
        <main className="container mx-auto px-6 py-8">
          {/* Hero Section */}
          <div className="text-center space-y-6 mb-16">
            <div className="space-y-4">
              <Badge variant="secondary" className="text-sm">
                Complete Angular Mastery Guide
              </Badge>
              <h1 className="text-4xl md:text-6xl font-bold font-heading bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Angular Guide
              </h1>
              <h2 className="text-xl md:text-2xl text-muted-foreground font-heading">From Beginner to Expert</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Master Angular with comprehensive tutorials, real-world examples, design patterns, and interview
                preparation. Created by <strong>Seshagiri Pentapati</strong>.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="text-lg">
                <Link href="/fundamentals/components">
                  Start Learning <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-lg bg-transparent">
                <Link href="/interview-questions">
                  Interview Prep <Target className="ml-2 w-5 h-5" />
                </Link>
              </Button>
            </div>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
            <Card className="text-center">
              <CardContent className="pt-6">
                <BookOpen className="w-8 h-8 text-primary mx-auto mb-2" />
                <div className="text-2xl font-bold">50+</div>
                <div className="text-sm text-muted-foreground">Topics Covered</div>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="pt-6">
                <Code className="w-8 h-8 text-primary mx-auto mb-2" />
                <div className="text-2xl font-bold">200+</div>
                <div className="text-sm text-muted-foreground">Code Examples</div>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="pt-6">
                <Users className="w-8 h-8 text-primary mx-auto mb-2" />
                <div className="text-2xl font-bold">100+</div>
                <div className="text-sm text-muted-foreground">Interview Questions</div>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="pt-6">
                <Trophy className="w-8 h-8 text-primary mx-auto mb-2" />
                <div className="text-2xl font-bold">Latest</div>
                <div className="text-sm text-muted-foreground">Angular 19/20</div>
              </CardContent>
            </Card>
          </div>

          {/* Learning Path */}
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold font-heading mb-4">Learning Path</h2>
              <p className="text-muted-foreground">Follow this structured path to master Angular</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-6 h-6 text-primary" />
                    <Badge variant="secondary">Beginner</Badge>
                  </div>
                  <CardTitle>Fundamentals</CardTitle>
                  <CardDescription>Start with Angular basics, components, templates, and core concepts</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Components & Templates</li>
                    <li>• Data Binding & Directives</li>
                    <li>• Services & Dependency Injection</li>
                    <li>• Routing & Forms</li>
                  </ul>
                  <Button asChild className="w-full mt-4">
                    <Link href="/fundamentals/components">Start Here</Link>
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Zap className="w-6 h-6 text-primary" />
                    <Badge variant="secondary">Intermediate</Badge>
                  </div>
                  <CardTitle>Advanced Concepts</CardTitle>
                  <CardDescription>
                    Dive deeper into HTTP, RxJS, state management, and advanced patterns
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• HTTP Client & Observables</li>
                    <li>• RxJS Operators</li>
                    <li>• State Management</li>
                    <li>• Dynamic Components</li>
                  </ul>
                  <Button asChild variant="outline" className="w-full mt-4 bg-transparent">
                    <Link href="/intermediate/http-client">Continue Learning</Link>
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Trophy className="w-6 h-6 text-primary" />
                    <Badge>Expert</Badge>
                  </div>
                  <CardTitle>Mastery & Interviews</CardTitle>
                  <CardDescription>Master design patterns, latest features, and ace your interviews</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Architecture Patterns</li>
                    <li>• Performance Optimization</li>
                    <li>• Angular 19/20 Features</li>
                    <li>• Interview Questions</li>
                  </ul>
                  <Button asChild variant="outline" className="w-full mt-4 bg-transparent">
                    <Link href="/design-patterns/singleton">Master Angular</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Features */}
          <div className="mt-16 space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold font-heading mb-4">What You'll Learn</h2>
              <p className="text-muted-foreground">Comprehensive coverage of Angular ecosystem</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Star className="w-5 h-5 text-primary mt-1" />
                  <div>
                    <h3 className="font-semibold">Complete Angular Fundamentals</h3>
                    <p className="text-sm text-muted-foreground">
                      From basic concepts to advanced patterns with practical examples
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-primary mt-1" />
                  <div>
                    <h3 className="font-semibold">Latest Angular 19/20 Features</h3>
                    <p className="text-sm text-muted-foreground">
                      Stay updated with the newest Angular features and best practices
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Target className="w-5 h-5 text-primary mt-1" />
                  <div>
                    <h3 className="font-semibold">Interview Preparation</h3>
                    <p className="text-sm text-muted-foreground">
                      50+ most important interview questions with detailed answers
                    </p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Code className="w-5 h-5 text-primary mt-1" />
                  <div>
                    <h3 className="font-semibold">Real-world Examples</h3>
                    <p className="text-sm text-muted-foreground">
                      Practical code examples and projects you can use immediately
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Trophy className="w-5 h-5 text-primary mt-1" />
                  <div>
                    <h3 className="font-semibold">Design Patterns & Architecture</h3>
                    <p className="text-sm text-muted-foreground">
                      Learn professional patterns used in enterprise applications
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Users className="w-5 h-5 text-primary mt-1" />
                  <div>
                    <h3 className="font-semibold">Expert-level Insights</h3>
                    <p className="text-sm text-muted-foreground">
                      Deep understanding of Angular internals and performance optimization
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Copyright Footer Section */}
          <footer className="mt-16 pt-8 border-t bg-muted/30 rounded-lg">
            <div className="text-center space-y-4 py-8">
              <div className="text-sm text-muted-foreground">
                © 2024 <strong>Seshagiri Pentapati</strong>. All rights reserved.
              </div>
              <div className="text-xs text-muted-foreground">Comprehensive Angular Guide - From Beginner to Expert</div>
            </div>
          </footer>
        </main>
      </div>
    </div>
  )
}
