"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { Menu, BookOpen, Code, Trophy, Lightbulb, Zap, MessageSquare } from "lucide-react"
import { cn } from "@/lib/utils"

const navigationSections = [
  {
    title: "Getting Started",
    icon: BookOpen,
    items: [
      { title: "Introduction", href: "/introduction" },
      { title: "What's New (2026)", href: "/whats-new", badge: "Updated" },
      { title: "Setup & Installation", href: "/setup" },
      { title: "Project Structure", href: "/project-structure" },
    ],
  },
  {
    title: "Fundamentals",
    icon: Code,
    badge: "Beginner",
    items: [
      { title: "Components", href: "/fundamentals/components" },
      { title: "Templates & Data Binding", href: "/fundamentals/templates" },
      { title: "Directives", href: "/fundamentals/directives" },
      { title: "Services & DI", href: "/fundamentals/services" },
      { title: "Routing", href: "/fundamentals/routing" },
      { title: "Forms", href: "/fundamentals/forms" },
    ],
  },
  {
    title: "Intermediate",
    icon: Lightbulb,
    badge: "Intermediate",
    items: [
      { title: "HTTP Client", href: "/intermediate/http-client" },
      { title: "RxJS & Observables", href: "/intermediate/rxjs" },
      { title: "State Management", href: "/intermediate/state-management" },
      { title: "Pipes & Custom Pipes", href: "/intermediate/pipes" },
      { title: "Lifecycle Hooks", href: "/intermediate/lifecycle-hooks" },
      { title: "Component Communication", href: "/intermediate/component-communication" },
    ],
  },
  {
    title: "Advanced",
    icon: Zap,
    badge: "Advanced",
    items: [
      { title: "Change Detection", href: "/advanced/change-detection" },
      { title: "Dynamic Components", href: "/advanced/dynamic-components" },
      { title: "Custom Directives", href: "/advanced/custom-directives" },
      { title: "Angular Animations", href: "/advanced/animations" },
      { title: "Lazy Loading", href: "/advanced/lazy-loading" },
      { title: "Testing Strategies", href: "/advanced/testing" },
      { title: "Performance Optimization", href: "/advanced/performance" },
      { title: "Security Best Practices", href: "/advanced/security" },
    ],
  },
  {
    title: "Design Patterns",
    icon: Trophy,
    badge: "Expert",
    items: [
      { title: "Singleton Pattern", href: "/design-patterns/singleton" },
      { title: "Observer Pattern", href: "/design-patterns/observer" },
      { title: "Dependency Injection", href: "/design-patterns/dependency-injection" },
      { title: "Factory Pattern", href: "/design-patterns/factory" },
      { title: "Repository Pattern", href: "/design-patterns/repository" },
    ],
  },
  {
    title: "Latest Features",
    icon: Zap,
    badge: "New",
    items: [
      { title: "Angular 19 Features", href: "/latest-features/angular-19" },
      { title: "Angular 20 Features", href: "/latest-features/angular-20" },
      { title: "Angular 21 Features", href: "/latest-features/angular-21" },
      { title: "Angular 22 Features", href: "/latest-features/angular-22" },
    ],
  },
  {
    title: "Interview Prep",
    icon: MessageSquare,
    badge: "Important",
    items: [{ title: "All Interview Questions", href: "/interview-questions" }],
  },
]

interface NavigationProps {
  className?: string
}

export function Navigation({ className }: NavigationProps) {
  const pathname = usePathname()

  const NavigationContent = () => (
    <ScrollArea className="h-[calc(100vh-2rem)] py-6">
      <div className="space-y-6">
        <div className="px-6">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Code className="w-4 h-4 text-primary-foreground" />
            </div>
            <div>
              <h2 className="text-lg font-bold font-heading">Angular Guide</h2>
              <p className="text-xs text-muted-foreground">by Seshagiri Pentapati</p>
            </div>
          </Link>
        </div>

        <nav className="space-y-2">
          {navigationSections.map((section) => (
            <div key={section.title} className="px-3">
              <div className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-muted-foreground">
                <section.icon className="w-4 h-4" />
                <span>{section.title}</span>
                {section.badge && (
                  <Badge variant={section.badge === "New" ? "default" : "secondary"} className="text-xs">
                    {section.badge}
                  </Badge>
                )}
              </div>
              <div className="space-y-1">
                {section.items.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "block px-6 py-2 text-sm rounded-md transition-colors hover:bg-accent hover:text-accent-foreground",
                      pathname === item.href ? "bg-primary text-primary-foreground" : "text-muted-foreground",
                    )}
                  >
                    {item.title}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </nav>
      </div>
    </ScrollArea>
  )

  return (
    <>
      {/* Desktop Sidebar */}
      <div className={cn("hidden lg:flex lg:w-80 lg:flex-col lg:fixed lg:inset-y-0", className)}>
        <div className="flex flex-col flex-grow bg-sidebar border-r border-sidebar-border overflow-hidden">
          <NavigationContent />
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="lg:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="fixed top-4 left-4 z-50">
              <Menu className="w-5 h-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-80 p-0">
            <NavigationContent />
          </SheetContent>
        </Sheet>
      </div>
    </>
  )
}
