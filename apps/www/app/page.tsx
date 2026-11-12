import Link from "next/link";
import { ArrowRight, Blocks, Palette, Terminal } from "lucide-react";
import { Badge, Button, Card, CardDescription, CardHeader, CardTitle } from "@blox-ui/ui";
import { CodeBlock } from "@/components/docs/code-block";
import { SiteHeader } from "@/components/site-header";
import { getComponentList } from "@/lib/docs";
import { highlight } from "@/lib/highlight";

const install = "npx @bloxui/cli init\nnpx @bloxui/cli add button dialog data-table";

const features = [
  {
    icon: Terminal,
    title: "Copy, then own it",
    description: "One command puts the source in your project, with everything it needs. Change anything.",
    href: "/docs/cli",
  },
  {
    icon: Palette,
    title: "One theme, five tones",
    description: "Every component takes the same tones and reads the same CSS variables. Light and dark built in.",
    href: "/docs/theming",
  },
  {
    icon: Blocks,
    title: "Screens, not just parts",
    description: "Login, sign-up, settings and a dashboard, built from the same components.",
    href: "/blocks",
  },
];

export default async function HomePage() {
  const components = getComponentList();
  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-5xl space-y-20 px-4 py-16 sm:px-6 sm:py-24">
        <section className="space-y-6 text-center">
          <Badge tone="brand" className="mx-auto">
            {components.length} components · 4 blocks
          </Badge>
          <h1 className="mx-auto max-w-3xl text-4xl font-bold tracking-tight text-balance sm:text-6xl">
            Accessible React components you own.
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-muted text-balance">
            Copy them into your project with one command. Built on Tailwind CSS v4 and Radix, themed with plain CSS
            variables.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button asChild size="lg" rightIcon={<ArrowRight />}>
              <Link href="/docs/installation">Get started</Link>
            </Button>
            <Button asChild size="lg" variant="outline" tone="neutral">
              <Link href="/showcase">See every component</Link>
            </Button>
          </div>
          <CodeBlock
            html={await highlight(install, "bash")}
            code={install}
            className="mx-auto max-w-xl text-left"
          />
        </section>

        <section aria-labelledby="features" className="space-y-6">
          <h2 id="features" className="sr-only">
            Features
          </h2>
          <ul className="grid gap-4 sm:grid-cols-3">
            {features.map((feature) => (
              <li key={feature.title}>
                <Link
                  href={feature.href}
                  className="block h-full rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
                >
                  <Card interactive className="h-full">
                    <CardHeader>
                      <feature.icon aria-hidden className="mb-2 size-5 text-brand-text" />
                      <CardTitle as="h3">{feature.title}</CardTitle>
                      <CardDescription>{feature.description}</CardDescription>
                    </CardHeader>
                  </Card>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="all-components" className="space-y-6">
          <h2 id="all-components" className="text-2xl font-bold tracking-tight">
            Components
          </h2>
          <ul className="flex flex-wrap gap-2">
            {components.map((item) => (
              <li key={item.name}>
                <Link
                  href={`/docs/components/${item.name}`}
                  className="block rounded-full border border-border px-3 py-1.5 text-sm transition-colors outline-none hover:border-border-strong hover:bg-neutral-soft focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {item.title}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </main>
    </>
  );
}
