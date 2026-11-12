import { cn } from "@blox-ui/ui";
import { CopyButton } from "./copy-button";

interface CodeBlockProps {
  /** Highlighted HTML from lib/highlight. */
  html: string;
  /** The plain code, for the copy button. */
  code: string;
  /** File name or language shown above the code. */
  title?: string;
  className?: string;
  /** Cap the height and scroll, for long files. */
  maxHeight?: boolean;
}

export function CodeBlock({ html, code, title, className, maxHeight }: CodeBlockProps) {
  return (
    <div className={cn("relative overflow-hidden rounded-lg border border-border bg-sunken", className)}>
      {title ? (
        <div className="border-b border-border px-4 py-2 font-mono text-xs text-muted">{title}</div>
      ) : null}
      <CopyButton value={code} className="absolute top-2 right-2 z-[1]" />
      <div
        className={cn("code-block overflow-auto text-[0.8125rem] leading-relaxed", maxHeight && "max-h-[28rem]")}
        // Produced by Shiki from our own source files at build time.
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}
