import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@blox-ui/ui";
import { Code, DocsHeader, H2, List, P, Section } from "@/components/docs/prose";
import { getComponentList } from "@/lib/docs";

export const metadata: Metadata = {
  title: "Introduction — Blox UI",
  description: "React components you copy into your project and own.",
};

export default function IntroductionPage() {
  const count = getComponentList().length;
  return (
    <div className="space-y-10">
      <DocsHeader
        title="Introduction"
        description="Blox UI is a set of accessible React components you copy into your project and own. Built on Tailwind CSS v4 and Radix."
      >
        <div className="flex flex-wrap gap-2 pt-2">
          <Button asChild rightIcon={<ArrowRight />}>
            <Link href="/docs/installation">Get started</Link>
          </Button>
          <Button asChild variant="outline" tone="neutral">
            <Link href="/docs/components/button">Browse {count} components</Link>
          </Button>
        </div>
      </DocsHeader>

      <Section>
        <H2 id="not-a-package">Not a package you install</H2>
        <P>
          Most libraries ship compiled code you import and cannot change. Blox UI copies each component&apos;s source into
          your project with one command. From then on it is your code: read it, change it, delete what you do not need.
        </P>
        <P>
          Each component brings only what it uses. Adding <Code>data-table</Code> also adds the table, checkbox, input
          and pagination it is built from, and installs the npm packages they need.
        </P>
      </Section>

      <Section>
        <H2 id="what-is-different">What you get</H2>
        <List>
          <li>
            <strong>One colour model everywhere.</strong> Every component takes the same five tones (
            <Code>brand</Code>, <Code>neutral</Code>, <Code>success</Code>, <Code>warning</Code>, <Code>danger</Code>
            ), so a soft danger button and a soft danger badge always match.
          </li>
          <li>
            <strong>Forms that wire themselves.</strong> Wrap a control in <Code>Field</Code> and its label, hint,
            error and ARIA attributes are connected for you.
          </li>
          <li>
            <strong>Fewer pieces to assemble.</strong> Pagination works out its own page list, Combobox and Data Table
            take data instead of markup, Tooltip is one element.
          </li>
          <li>
            <strong>Accessible by default.</strong> Keyboard support, focus handling and screen reader names come
            built in, and every component has tests that check them.
          </li>
          <li>
            <strong>Ready-made screens.</strong> <Link className="font-medium text-brand-text underline-offset-4 hover:underline" href="/blocks">Blocks</Link>{" "}
            for login, sign-up, settings and a dashboard, built from the same components.
          </li>
        </List>
      </Section>

      <Section>
        <H2 id="requirements">Requirements</H2>
        <List>
          <li>React 18 or 19</li>
          <li>Tailwind CSS v4</li>
          <li>TypeScript is recommended; the components are written in it.</li>
        </List>
      </Section>
    </div>
  );
}
