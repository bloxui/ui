import Link from "next/link";
import { ArrowLeft, ArrowRight, Blocks, BookOpen, Component } from "lucide-react";
import { Button, Kbd, Result } from "@blox-ui/ui";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

const suggestions = [
  { href: "/docs", label: "Read the docs", description: "Install Blox UI and learn the basics.", icon: BookOpen },
  { href: "/docs/components/button", label: "Browse components", description: "Every component with live examples.", icon: Component },
  { href: "/blocks", label: "See blocks", description: "Ready-made screens to copy.", icon: Blocks },
];

export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-2xl px-4">
        <Result
          status={404}
          headingLevel={1}
          description="This page does not exist or has moved. Try one of these instead:"
          className="py-16 sm:py-20"
        >
          <ul className="grid w-full max-w-md gap-2 text-left">
            {suggestions.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="group flex items-center gap-3 rounded-xl border border-border p-3 transition-colors outline-none hover:border-border-strong hover:bg-neutral-soft focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-sunken text-muted">
                    <item.icon aria-hidden className="size-5" />
                  </span>
                  <span className="grid min-w-0 flex-1 gap-0.5">
                    <span className="text-sm font-medium">{item.label}</span>
                    <span className="truncate text-sm text-muted">{item.description}</span>
                  </span>
                  <ArrowRight aria-hidden className="size-4 shrink-0 text-muted transition-transform group-hover:translate-x-0.5" />
                </Link>
              </li>
            ))}
          </ul>
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 pt-2">
            <Button asChild variant="ghost" tone="neutral" size="sm" leftIcon={<ArrowLeft />}>
              <Link href="/">Back to home</Link>
            </Button>
            <p className="flex items-center gap-1.5 text-xs text-muted">
              or press <Kbd>Ctrl</Kbd>
              <Kbd>K</Kbd> to search
            </p>
          </div>
        </Result>
      </main>
      <SiteFooter />
    </>
  );
}
