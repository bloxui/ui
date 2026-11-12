import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Badge, Collapsible, CollapsibleContent, CollapsibleTrigger, Button } from "@blox-ui/ui";
import { CodeBlock } from "@/components/docs/code-block";
import { ComponentPreview } from "@/components/docs/component-preview";
import { Code, DocsHeader, H2, P, Section } from "@/components/docs/prose";
import { PropsTable } from "@/components/docs/props-table";
import { getComponentDoc, getComponentList } from "@/lib/docs";
import { highlight } from "@/lib/highlight";

interface PageProps {
  params: Promise<{ name: string }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return getComponentList().map((item) => ({ name: item.name }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { name } = await params;
  const item = getComponentList().find((entry) => entry.name === name);
  return item ? { title: `${item.title} — Blox UI`, description: item.description } : {};
}

export default async function ComponentPage({ params }: PageProps) {
  const { name } = await params;
  const doc = await getComponentDoc(name);
  if (!doc) notFound();

  const { item } = doc;
  const install = `npx @bloxui/cli add ${item.name}`;
  const packages = Object.keys(item.dependencies);
  const manual = packages.length > 0 ? `npm install ${packages.join(" ")}` : null;

  return (
    <article className="space-y-10">
      <DocsHeader title={item.title} description={item.description}>
        <Badge size="sm">{item.category}</Badge>
      </DocsHeader>

      <ComponentPreview name={item.name} html={doc.exampleHtml} code={doc.exampleCode} />

      <Section>
        <H2 id="installation">Installation</H2>
        <CodeBlock html={await highlight(install, "bash")} code={install} />
        {item.registryDependencies.length > 0 ? (
          <P className="text-sm text-muted">
            Also adds:{" "}
            {item.registryDependencies.map((dependency, index) => (
              <span key={dependency}>
                {index > 0 ? ", " : null}
                <Code>{dependency}</Code>
              </span>
            ))}
          </P>
        ) : null}
        <Collapsible>
          <CollapsibleTrigger asChild>
            <Button variant="outline" tone="neutral" size="sm">
              Install by hand
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="space-y-3 pt-4">
              {manual ? (
                <>
                  <P className="text-sm">Install the packages it uses:</P>
                  <CodeBlock html={await highlight(manual, "bash")} code={manual} />
                </>
              ) : null}
              <P className="text-sm">
                Copy the source into <Code>components/ui/{item.name}.tsx</Code>:
              </P>
              <CodeBlock html={doc.sourceHtml} code={doc.sourceCode} title={`components/ui/${item.name}.tsx`} maxHeight />
            </div>
          </CollapsibleContent>
        </Collapsible>
      </Section>

      {doc.props.length > 0 ? (
        <Section>
          <H2 id="api">API</H2>
          <div className="space-y-8">
            {doc.props.map((table) => (
              <PropsTable key={table.component} table={table} />
            ))}
          </div>
        </Section>
      ) : null}

      <nav aria-label="Other components" className="flex items-center justify-between gap-4 border-t border-border pt-6">
        {doc.previous ? (
          <Button asChild variant="ghost" tone="neutral" leftIcon={<ArrowLeft />}>
            <Link href={`/docs/components/${doc.previous.name}`}>{doc.previous.title}</Link>
          </Button>
        ) : (
          <span />
        )}
        {doc.next ? (
          <Button asChild variant="ghost" tone="neutral" rightIcon={<ArrowRight />}>
            <Link href={`/docs/components/${doc.next.name}`}>{doc.next.title}</Link>
          </Button>
        ) : null}
      </nav>
    </article>
  );
}
