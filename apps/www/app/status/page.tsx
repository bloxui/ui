import type { Metadata } from "next";
import Link from "next/link";
import { Badge, Card, CardDescription, CardHeader, CardTitle, statusMessages } from "@blox-ui/ui";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = {
  title: "Status pages — Blox UI",
  description: "Error pages for every common HTTP status code, built with the Result component.",
};

const groups = [
  { title: "Client errors (4xx)", tone: "warning" as const, filter: (code: number) => code < 500 },
  { title: "Server errors (5xx)", tone: "danger" as const, filter: (code: number) => code >= 500 },
];

export default function StatusPages() {
  const codes = Object.keys(statusMessages).map(Number);
  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-5xl space-y-10 px-4 py-12 sm:px-6">
        <header className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Status pages</h1>
          <p className="max-w-2xl text-muted">
            Ready-made pages for common HTTP status codes, built with{" "}
            <Link href="/docs/components/result" className="font-medium text-brand-text underline-offset-4 hover:underline">
              Result
            </Link>{" "}
            and the{" "}
            <Link href="/blocks/error-page" className="font-medium text-brand-text underline-offset-4 hover:underline">
              error page block
            </Link>
            . Open one to see it full screen.
          </p>
        </header>
        {groups.map((group) => (
          <section key={group.title} className="space-y-4">
            <h2 className="text-sm font-semibold tracking-wide text-muted uppercase">{group.title}</h2>
            <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {codes.filter(group.filter).map((code) => (
                <li key={code}>
                  <Link
                    href={`/status/${code}`}
                    className="block h-full rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
                  >
                    <Card interactive className="h-full">
                      <CardHeader>
                        <Badge tone={group.tone} className="w-fit font-mono">
                          {code}
                        </Badge>
                        <CardTitle as="h3">{statusMessages[code]!.title}</CardTitle>
                        <CardDescription>{statusMessages[code]!.description}</CardDescription>
                      </CardHeader>
                    </Card>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </main>
      <SiteFooter />
    </>
  );
}
