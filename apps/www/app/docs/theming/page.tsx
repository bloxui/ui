import type { Metadata } from "next";
import { CodeBlock } from "@/components/docs/code-block";
import { Code, DocsHeader, H2, List, P, Section } from "@/components/docs/prose";
import { ThemeCustomizer } from "@/components/docs/theme-customizer";
import { highlight } from "@/lib/highlight";

export const metadata: Metadata = {
  title: "Theming — Blox UI",
  description: "Change colours, corners and dark mode with CSS variables.",
};

const tonesExample = `<Button tone="danger" variant="soft">Delete</Button>
<Badge tone="success" dot>Active</Badge>
<Switch tone="warning" />`;

const overrideExample = `@import "tailwindcss";
@import "../styles/blox.css";

:root {
  --bx-radius: 0.375rem;
}`;

const darkExample = `<html class="dark">`;

export default async function ThemingPage() {
  return (
    <div className="space-y-10">
      <DocsHeader
        title="Theming"
        description="Every colour, corner and shadow is a CSS variable. Change them in one place and every component follows."
      />

      <Section>
        <H2 id="customizer">Make a theme</H2>
        <P>Pick a colour and corner radius, check it on real components in both themes, then copy the CSS.</P>
        <ThemeCustomizer />
      </Section>

      <Section>
        <H2 id="tones">Tones</H2>
        <P>
          Each tone has five roles: a solid fill, its hover, the text on it, a soft tint and coloured text. Components
          take a <Code>tone</Code> prop and pick the roles they need, so changing a tone changes it everywhere.
        </P>
        <CodeBlock html={await highlight(tonesExample, "tsx")} code={tonesExample} />
        <List>
          <li>
            <Code>--bx-brand</Code>, <Code>--bx-brand-hover</Code>, <Code>--bx-brand-fg</Code>,{" "}
            <Code>--bx-brand-soft</Code>, <Code>--bx-brand-text</Code>, and the same for <Code>neutral</Code>,{" "}
            <Code>success</Code>, <Code>warning</Code> and <Code>danger</Code>.
          </li>
          <li>
            Surfaces: <Code>--bx-bg</Code>, <Code>--bx-surface</Code>, <Code>--bx-sunken</Code>, <Code>--bx-fg</Code>,{" "}
            <Code>--bx-muted</Code>, <Code>--bx-border</Code>, <Code>--bx-border-strong</Code>.
          </li>
          <li>
            Shape: <Code>--bx-radius</Code>, <Code>--bx-shadow-raised</Code>, and <Code>--bx-ring</Code> for focus
            outlines.
          </li>
          <li>
            Charts: <Code>--bx-chart-1</Code> to <Code>--bx-chart-8</Code>, checked for colour-blind separation.
          </li>
        </List>
      </Section>

      <Section>
        <H2 id="override">Override a variable</H2>
        <P>Redefine any variable after the theme import:</P>
        <CodeBlock html={await highlight(overrideExample, "css")} code={overrideExample} title="app/globals.css" />
        <P>
          The same names work as Tailwind utilities in your own markup: <Code>bg-surface</Code>, <Code>text-muted</Code>
          , <Code>border-border</Code>, <Code>bg-brand-soft</Code>.
        </P>
      </Section>

      <Section>
        <H2 id="dark-mode">Dark mode</H2>
        <P>
          Add the <Code>dark</Code> class to a parent element, usually <Code>{"<html>"}</Code>. Every variable has a
          dark value, tuned separately rather than inverted.
        </P>
        <CodeBlock html={await highlight(darkExample, "tsx")} code={darkExample} />
      </Section>
    </div>
  );
}
