import type { Metadata } from "next";
import { CodeBlock } from "@/components/docs/code-block";
import { Code, DocsHeader, H2, P, Section } from "@/components/docs/prose";
import { highlight } from "@/lib/highlight";

export const metadata: Metadata = {
  title: "Installation — Blox UI",
  description: "Add Blox UI to a React project that uses Tailwind CSS v4.",
};

const steps = {
  create: "npx create-next-app@latest my-app\ncd my-app",
  init: "npx @bloxui/cli init",
  add: "npx @bloxui/cli add button card",
  use: `import { Button } from "@/components/ui/button";

export default function Page() {
  return <Button>Hello</Button>;
}`,
  css: `@import "tailwindcss";
@import "../styles/blox.css";`,
};

export default async function InstallationPage() {
  const html = {
    create: await highlight(steps.create, "bash"),
    init: await highlight(steps.init, "bash"),
    add: await highlight(steps.add, "bash"),
    use: await highlight(steps.use, "tsx"),
    css: await highlight(steps.css, "css"),
  };

  return (
    <div className="space-y-10">
      <DocsHeader title="Installation" description="Add Blox UI to a React project that uses Tailwind CSS v4." />

      <Section>
        <H2 id="create">1. Start from a project</H2>
        <P>
          Any React setup with Tailwind CSS v4 works: Next.js, Vite, React Router. To start fresh with Next.js (choose
          Tailwind when it asks):
        </P>
        <CodeBlock html={html.create} code={steps.create} />
      </Section>

      <Section>
        <H2 id="init">2. Set up Blox UI</H2>
        <P>Run this in the project&apos;s root folder:</P>
        <CodeBlock html={html.init} code={steps.init} />
        <P>
          It creates <Code>blox.json</Code>, adds the theme and the <Code>cn</Code> helper, imports the theme in your
          global stylesheet and installs the packages they need. If it cannot find your stylesheet, add the import
          yourself, after Tailwind:
        </P>
        <CodeBlock html={html.css} code={steps.css} title="app/globals.css" />
      </Section>

      <Section>
        <H2 id="add">3. Add components</H2>
        <CodeBlock html={html.add} code={steps.add} />
        <P>Then import them from your own components folder:</P>
        <CodeBlock html={html.use} code={steps.use} title="app/page.tsx" />
      </Section>
    </div>
  );
}
