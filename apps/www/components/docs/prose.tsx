import * as React from "react";
import { cn } from "@blox-ui/ui";

/** Building blocks for hand-written docs pages, so every page has the same rhythm. */

export function DocsHeader({ title, description, children }: { title: string; description: string; children?: React.ReactNode }) {
  return (
    <header className="space-y-3 border-b border-border pb-8">
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{title}</h1>
      <p className="max-w-2xl text-lg text-muted">{description}</p>
      {children}
    </header>
  );
}

export function H2({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <h2 id={id} className="scroll-mt-20 pt-4 text-xl font-semibold tracking-tight">
      {children}
    </h2>
  );
}

export function P({ className, ...props }: React.ComponentProps<"p">) {
  return <p className={cn("leading-7 text-fg/85", className)} {...props} />;
}

export function Code({ className, ...props }: React.ComponentProps<"code">) {
  return <code className={cn("rounded-md bg-sunken px-1.5 py-0.5 font-mono text-[0.8125rem]", className)} {...props} />;
}

export function List({ className, ...props }: React.ComponentProps<"ul">) {
  return <ul className={cn("list-disc space-y-2 pl-6 leading-7 text-fg/85 marker:text-muted", className)} {...props} />;
}

export function Section({ className, ...props }: React.ComponentProps<"section">) {
  return <section className={cn("space-y-4", className)} {...props} />;
}
