import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@blox-ui/ui";
import { ExampleCards } from "@/components/home/example-cards";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getComponentList } from "@/lib/docs";

export default function HomePage() {
  const count = getComponentList().length;
  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-7xl px-4 sm:px-6">
        <section className="flex flex-col items-center gap-6 py-16 text-center sm:py-24">
          <Link
            href="/blocks"
            className="group inline-flex items-center gap-1.5 rounded-full border border-border bg-sunken px-3 py-1 text-xs font-medium transition-colors outline-none hover:border-border-strong focus-visible:ring-2 focus-visible:ring-ring"
          >
            <span className="size-1.5 rounded-full bg-brand" aria-hidden />
            New: ready-made blocks and a theme builder
            <ArrowRight className="size-3 transition-transform group-hover:translate-x-0.5" />
          </Link>
          <h1 className="max-w-4xl text-4xl font-bold tracking-tighter text-balance sm:text-6xl">
            Build your product, not your button.
          </h1>
          <p className="max-w-2xl text-lg text-muted text-balance">
            {count} accessible React components and ready-made screens. Copy them into your project, theme them with
            CSS variables, and change anything — the code is yours.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button asChild size="lg" tone="neutral">
              <Link href="/docs/installation">Get started</Link>
            </Button>
            <Button asChild size="lg" variant="ghost" tone="neutral" rightIcon={<ArrowRight />}>
              <Link href="/docs/components/button">Browse components</Link>
            </Button>
          </div>
        </section>

        <section aria-label="Examples built with Blox UI" className="pb-16">
          <ExampleCards />
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
