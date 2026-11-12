import type { Metadata } from "next";
import { CodeBlock } from "@/components/docs/code-block";
import { Code, DocsHeader, H2, List, P, Section } from "@/components/docs/prose";
import { highlight } from "@/lib/highlight";

export const metadata: Metadata = {
  title: "CLI — Blox UI",
  description: "Commands and options of the blox command-line tool.",
};

const snippets = {
  init: "npx @bloxui/cli init",
  add: `npx @bloxui/cli add button dialog
npx @bloxui/cli add block-login
npx @bloxui/cli add --all`,
  list: "npx @bloxui/cli list",
  config: `{
  "registry": "https://raw.githubusercontent.com/bloxui/ui/main/apps/www/public/r",
  "aliases": { "ui": "@/components/ui", "lib": "@/lib", "blocks": "@/components/blocks" },
  "dirs": { "ui": "src/components/ui", "lib": "src/lib", "blocks": "src/components/blocks", "styles": "src/styles" },
  "css": "src/app/globals.css"
}`,
};

const options = [
  ["--overwrite", "Replace files that already exist."],
  ["--dry-run", "Show what would change without writing anything."],
  ["--no-install", "Skip installing packages and print the command instead."],
  ["--force", "init: recreate blox.json."],
  ["--registry <url>", "Use another registry, a URL or a local folder."],
  ["--cwd <path>", "Run in another folder."],
] as const;

export default async function CliPage() {
  const html = {
    init: await highlight(snippets.init, "bash"),
    add: await highlight(snippets.add, "bash"),
    list: await highlight(snippets.list, "bash"),
    config: await highlight(snippets.config, "json"),
  };

  return (
    <div className="space-y-10">
      <DocsHeader title="CLI" description="The blox command copies components from the registry into your project." />

      <Section>
        <H2 id="init">init</H2>
        <CodeBlock html={html.init} code={snippets.init} />
        <List>
          <li>
            Puts files inside <Code>src</Code> when the project has one.
          </li>
          <li>
            Uses the <Code>@/*</Code> alias from <Code>tsconfig.json</Code> when it points at that folder, and relative
            imports otherwise.
          </li>
          <li>Imports the theme in your global stylesheet, right after Tailwind.</li>
          <li>Installs packages with the package manager your lockfile belongs to.</li>
        </List>
      </Section>

      <Section>
        <H2 id="add">add</H2>
        <CodeBlock html={html.add} code={snippets.add} />
        <P>
          Each component brings the components and helpers it uses. A file you have changed is left alone unless you
          pass <Code>--overwrite</Code>, and packages your project already lists keep their version.
        </P>
      </Section>

      <Section>
        <H2 id="list">list</H2>
        <CodeBlock html={html.list} code={snippets.list} />
      </Section>

      <Section>
        <H2 id="options">Options</H2>
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full border-collapse text-left text-sm">
            <tbody>
              {options.map(([flag, description]) => (
                <tr key={flag} className="border-b border-border last:border-0">
                  <th scope="row" className="px-4 py-3 align-top font-normal whitespace-nowrap">
                    <Code>{flag}</Code>
                  </th>
                  <td className="px-4 py-3 text-muted">{description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section>
        <H2 id="config">blox.json</H2>
        <CodeBlock html={html.config} code={snippets.config} title="blox.json" />
        <P>
          <Code>dirs</Code> are where files are written. <Code>aliases</Code> are the import paths written into them;
          set it to <Code>{"{}"}</Code> for relative imports.
        </P>
      </Section>
    </div>
  );
}
