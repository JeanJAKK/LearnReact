import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Star, CheckCircle } from 'lucide-react';
import { cn } from "@/lib/utils";
import { Lesson } from '@/data/courseData';

interface LessonContentProps {
  lesson: Lesson;
  isCompleted: boolean;
}

export default function LessonContent({ lesson, isCompleted }: LessonContentProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <div className={cn(
            "w-14 h-14 rounded-2xl flex items-center justify-center",
            isCompleted 
              ? "bg-success/10 text-success"
              : "bg-primary/10 text-primary"
          )}>
            {isCompleted ? (
              <CheckCircle className="w-7 h-7" />
            ) : (
              <BookOpen className="w-7 h-7" />
            )}
          </div>
          <div>
            <h1 className="text-2xl font-bold font-heading text-foreground">{lesson.title}</h1>
            <div className="flex items-center gap-3 mt-2">
              <Badge variant="secondary" className="bg-primary/10 text-primary border-0">
                {lesson.type === 'theory' ? 'Théorie' : 'Pratique'}
              </Badge>
              <span className="flex items-center gap-1 text-sm text-muted-foreground">
                <Star className="w-4 h-4 text-warning" />
                {lesson.points} points
              </span>
            </div>
          </div>
        </div>
        {isCompleted && (
          <Badge className="bg-success/10 text-success border-success/20">
            <CheckCircle className="w-4 h-4 mr-1" />
            Complété
          </Badge>
        )}
      </div>

      {/* Content */}
      <Card className="border-0 shadow-lg overflow-hidden">
        <CardContent className="p-8">
          <div className="markdown-content">
            <ReactMarkdown
              components={{
                h1: ({ children }) => (
                  <h1 className="text-2xl font-bold font-heading text-foreground mb-6 pb-4 border-b border-border">
                    {children}
                  </h1>
                ),
                h2: ({ children }) => (
                  <h2 className="text-xl font-bold font-heading text-foreground mt-8 mb-4 flex items-center gap-2">
                    <span className="w-1 h-6 bg-primary rounded-full" />
                    {children}
                  </h2>
                ),
                h3: ({ children }) => (
                  <h3 className="text-lg font-semibold font-heading text-foreground mt-6 mb-3">
                    {children}
                  </h3>
                ),
                p: ({ children }) => (
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    {children}
                  </p>
                ),
                ul: ({ children }) => (
                  <ul className="space-y-2 my-4 list-none pl-0">
                    {children}
                  </ul>
                ),
                li: ({ children }) => (
                  <li className="flex items-start gap-2 text-muted-foreground">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                    <span>{children}</span>
                  </li>
                ),
                code: ({ className, children }) => {
                  const match = /language-(\w+)/.exec(className || '');
                  const isInline = !match;
                  
                  if (isInline) {
                    return (
                      <code className="px-1.5 py-0.5 bg-primary/10 text-primary rounded text-sm font-mono">
                        {children}
                      </code>
                    );
                  }
                  
                  return (
                    <div className="relative group my-6">
                      <div className="absolute top-0 right-0 px-3 py-1 bg-slate-800 rounded-bl-lg text-xs text-slate-400 font-mono">
                        {match[1]}
                      </div>
                      <pre className="bg-slate-900 rounded-xl p-4 pt-10 overflow-x-auto">
                        <code className="text-sm text-slate-100 font-mono">
                          {children}
                        </code>
                      </pre>
                    </div>
                  );
                },
                pre: ({ children }) => <>{children}</>,
                blockquote: ({ children }) => (
                  <blockquote className="border-l-4 border-primary pl-4 py-2 my-4 bg-primary/5 rounded-r-lg">
                    {children}
                  </blockquote>
                ),
                strong: ({ children }) => (
                  <strong className="font-semibold text-foreground">
                    {children}
                  </strong>
                ),
              }}
            >
              {lesson.content}
            </ReactMarkdown>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
