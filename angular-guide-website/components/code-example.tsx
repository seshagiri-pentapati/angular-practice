"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Copy, Check } from "lucide-react"
import { cn } from "@/lib/utils"

interface CodeExampleProps {
  title: string
  description?: string
  code: string
  language?: string
  filename?: string
  className?: string
}

export function CodeExample({
  title,
  description,
  code,
  language = "typescript",
  filename,
  className,
}: CodeExampleProps) {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Card className={cn("my-6", className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg">{title}</CardTitle>
            {description && <p className="text-sm text-muted-foreground">{description}</p>}
          </div>
          <div className="flex items-center gap-2">
            {filename && (
              <Badge variant="outline" className="text-xs">
                {filename}
              </Badge>
            )}
            <Button variant="ghost" size="sm" onClick={copyToClipboard} className="h-8 w-8 p-0">
              {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="relative">
          <pre className="bg-muted p-4 rounded-md overflow-x-auto text-sm">
            <code className={`language-${language}`}>{code}</code>
          </pre>
        </div>
      </CardContent>
    </Card>
  )
}

export default CodeExample
