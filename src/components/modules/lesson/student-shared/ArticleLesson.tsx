"use client";

import { BookOpen } from "lucide-react";
import type React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export interface ArticleDataDetails {
  content?: string;
  sections?: Array<{ content?: string }>;
}

interface ArticleLessonProps {
  articleData?: ArticleDataDetails | null;
}

export function ArticleLesson({ articleData }: ArticleLessonProps) {
  const articleContent =
    articleData?.sections?.[0]?.content ||
    articleData?.content ||
    "No article content provided.";

  return (
    <article className="prose dark:prose-invert max-w-none space-y-4">
      <div className="flex items-center gap-2 border-b pb-3 mb-6 text-xs text-muted-foreground font-semibold uppercase tracking-wider">
        <BookOpen className="w-4 h-4 text-primary" />
        <span>Reading Material</span>
      </div>

      <div className="article-body">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            h1: ({ children }) => (
              <h1 className="text-2xl font-bold tracking-tight mt-6 mb-4 text-foreground border-b pb-2">
                {children}
              </h1>
            ),
            h2: ({ children }) => (
              <h2 className="text-xl font-semibold tracking-tight mt-6 mb-3 text-foreground">
                {children}
              </h2>
            ),
            h3: ({ children }) => (
              <h3 className="text-lg font-semibold tracking-tight mt-4 mb-2 text-foreground">
                {children}
              </h3>
            ),
            p: ({ children }) => (
              <p className="text-sm md:text-base leading-relaxed text-muted-foreground/90 mb-4">
                {children}
              </p>
            ),
            ul: ({ children }) => (
              <ul className="list-disc list-inside space-y-2 mb-4 text-sm md:text-base text-muted-foreground pl-2">
                {children}
              </ul>
            ),
            ol: ({ children }) => (
              <ol className="list-decimal list-inside space-y-2 mb-4 text-sm md:text-base text-muted-foreground pl-2">
                {children}
              </ol>
            ),
            blockquote: ({ children }) => (
              <blockquote className="border-l-4 border-primary/70 pl-4 italic text-muted-foreground my-4 bg-muted/40 py-2.5 px-3 rounded-r-md">
                {children}
              </blockquote>
            ),
            a: ({ href, children }) => (
              <a
                href={href}
                target="_blank"
                rel="noreferrer"
                className="text-primary underline underline-offset-4 font-medium hover:text-primary/80"
              >
                {children}
              </a>
            ),
            code: ({
              className,
              children,
              ...props
            }: React.ComponentPropsWithoutRef<"code">) => {
              const match = /language-(\w+)/.exec(className || "");
              return match ? (
                <div className="my-4 rounded-lg overflow-hidden border border-slate-800 bg-slate-950">
                  <div className="bg-slate-900 px-4 py-1.5 text-[11px] font-mono text-slate-400 border-b border-slate-800">
                    {match[1]}
                  </div>
                  <pre className="p-4 font-mono text-xs md:text-sm text-slate-100 overflow-x-auto">
                    <code className={className} {...props}>
                      {children}
                    </code>
                  </pre>
                </div>
              ) : (
                <code
                  className="bg-muted px-1.5 py-0.5 rounded text-xs font-mono font-medium text-foreground"
                  {...props}
                >
                  {children}
                </code>
              );
            },
          }}
        >
          {articleContent}
        </ReactMarkdown>
      </div>
    </article>
  );
}
