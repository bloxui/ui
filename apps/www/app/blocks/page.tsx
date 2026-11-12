import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Badge, Card, CardDescription, CardHeader, CardTitle } from "@blox-ui/ui";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { blocks } from "@/lib/blocks";

export const metadata: Metadata = {
  title: "Blocks — Blox UI",
  description: "Ready-made screens composed from Blox UI components.",
};

const linkFocus = "rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-bg";

export default function BlocksPage() {
  return (
    <>
    <SiteHeader />
    <main className="mx-auto max-w-4xl space-y-10 px-4 py-12 sm:px-6">
      <header className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Blocks</h1>
          <p className="text-muted">Ready-made screens composed from the components. Open one to try it.</p>
        </div>
      </header>

      <ul className="grid gap-4 sm:grid-cols-2">
        {Object.entries(blocks).map(([name, block]) => (
          <li key={name}>
            <Link href={`/blocks/${name}`} className={`block ${linkFocus}`}>
              <Card interactive className="h-full">
                <CardHeader>
                  <CardTitle as="h2" className="flex items-center justify-between gap-2">
                    {block.title}
                    <ArrowRight className="size-4 text-muted" />
                  </CardTitle>
                  <CardDescription>{block.description}</CardDescription>
                  <Badge size="sm" className="mt-2 w-fit font-mono">
                    {block.registryName}
                  </Badge>
                </CardHeader>
              </Card>
            </Link>
          </li>
        ))}
      </ul>
    </main>
    <SiteFooter />
    </>
  );
}
