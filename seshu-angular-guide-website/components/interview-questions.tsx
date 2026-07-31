"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ChevronDown, ChevronRight, MessageSquare } from "lucide-react"

interface Question {
  id: string
  question: string
  answer: string
  difficulty: "Easy" | "Medium" | "Hard"
  tags?: string[]
}

interface InterviewQuestionsProps {
  title: string
  questions: Question[]
  className?: string
}

export function InterviewQuestions({ title, questions, className }: InterviewQuestionsProps) {
  const [openQuestions, setOpenQuestions] = useState<Set<string>>(new Set())

  const toggleQuestion = (id: string) => {
    const newOpenQuestions = new Set(openQuestions)
    if (newOpenQuestions.has(id)) {
      newOpenQuestions.delete(id)
    } else {
      newOpenQuestions.add(id)
    }
    setOpenQuestions(newOpenQuestions)
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "Medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      case "Hard":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-primary" />
          <CardTitle>{title}</CardTitle>
          <Badge variant="secondary">{questions.length} Questions</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {questions.map((q) => (
          <Collapsible key={q.id}>
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                className="w-full justify-start p-4 h-auto text-left hover:bg-muted"
                onClick={() => toggleQuestion(q.id)}
              >
                <div className="flex items-start gap-3 w-full">
                  {openQuestions.has(q.id) ? (
                    <ChevronDown className="w-4 h-4 mt-1 flex-shrink-0" />
                  ) : (
                    <ChevronRight className="w-4 h-4 mt-1 flex-shrink-0" />
                  )}
                  <div className="flex-1 space-y-2">
                    <p className="font-medium">{q.question}</p>
                    <div className="flex items-center gap-2">
                      <Badge className={getDifficultyColor(q.difficulty)}>{q.difficulty}</Badge>
                      {q.tags?.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="px-4 pb-4">
              <div className="bg-muted p-4 rounded-md mt-2">
                <div className="prose prose-sm max-w-none dark:prose-invert">
                  <div dangerouslySetInnerHTML={{ __html: q.answer }} />
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>
        ))}
      </CardContent>
    </Card>
  )
}

export default InterviewQuestions
