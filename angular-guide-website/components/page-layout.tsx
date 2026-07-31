import type React from "react"
import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, ArrowRight } from "lucide-react"
import Link from "next/link"

interface PageLayoutProps {
  title: string
  description: string
  badge?: string
  children: React.ReactNode
  previousPage?: { title: string; href: string }
  nextPage?: { title: string; href: string }
}

export function PageLayout({ title, description, badge, children, previousPage, nextPage }: PageLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="lg:pl-80">
        <main className="container mx-auto px-6 py-8">
          {/* Header */}
          <div className="space-y-4 mb-8">
            {badge && <Badge variant="secondary">{badge}</Badge>}
            <h1 className="text-4xl font-bold font-heading">{title}</h1>
            <p className="text-xl text-muted-foreground">{description}</p>
          </div>

          {/* Content */}
          <div className="prose prose-lg max-w-none dark:prose-invert">{children}</div>

          {/* Navigation */}
          <div className="flex justify-between items-center mt-16 pt-8 border-t">
            {previousPage ? (
              <Button asChild variant="outline">
                <Link href={previousPage.href}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  {previousPage.title}
                </Link>
              </Button>
            ) : (
              <div />
            )}

            {nextPage && (
              <Button asChild>
                <Link href={nextPage.href}>
                  {nextPage.title}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            )}
          </div>

          <footer className="mt-8 pt-4 border-t text-center text-sm text-muted-foreground">
            © 2024 Seshagiri Pentapati. All rights reserved.
          </footer>
        </main>
      </div>
    </div>
  )
}

export default PageLayout
