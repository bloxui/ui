import Link from "next/link";
import { ArrowLeft, BookOpen, Blocks, Component } from "lucide-react";
import { Button, Kbd, Result } from "@blox-ui/ui";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

const suggestions = [
  { href: "/docs", label: "Read the docs", icon: BookOpen },
  { href: "/docs/components/button", label: "Browse components", icon: Component },
  { href: "/blocks", label: "See blocks", icon: Blocks },
];

export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-2xl px-4">
        <Result
          status={404}
          headingLevel={1}
          description="This page does not exist or has moved. Try the search (Ctrl K) or one of these:"
          className="py-20"
          actions={
            <Button asChild leftIcon={<ArrowLeft />}>
              <Link href="/">Back to home</Link>
            </Button>
          }
        >
          <ul className="grid w-full max-w-md gap-2 pt-4 sm:grid-cols-3">
            {suggestions.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="flex h-full flex-col items-center gap-2 rounded-xl border border-border p-4 text-sm font-medium transition-colors outline-none hover:border-border-strong hover:bg-neutral-soft focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <item.icon aria-hidden className="size-5 text-muted" />
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <p className="flex items-center gap-1.5 pt-2 text-xs text-muted">
            Press <Kbd>Ctrl</Kbd>
            <Kbd>K</Kbd> to search everything
          </p>
        </Result>
      </main>
      <SiteFooter />
    </>
  );
}
