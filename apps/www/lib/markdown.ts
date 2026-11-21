import { readFileSync } from "node:fs";
import { join } from "node:path";
import { getComponentList, getPropsTables, toProjectImports } from "@/lib/docs";

export const SITE = "https://bloxui-kit.vercel.app";

const cell = (text: string) => text.replace(/\|/g, "\|").replace(/\n/g, " ");

/** A component's docs page as Markdown, for "Copy page" and for AI chats to read. */
export function componentMarkdown(name: string): string | null {
  const item = getComponentList().find((entry) => entry.name === name);
  if (!item) return null;

  const example = toProjectImports(readFileSync(join(process.cwd(), `examples/${name}.tsx`), "utf8").replace(/\r\n/g, "\n")).trim();
  const packages = Object.keys(item.dependencies);
  const lines = [
    `# ${item.title}`,
    "",
    item.description,
    "",
    `Docs: ${SITE}/docs/components/${name}`,
    "",
    "## Installation",
    "",
    "```bash",
    `npx @bloxui/cli add ${name}`,
    "```",
    "",
  ];
  if (item.registryDependencies.length) lines.push(`Also adds: ${item.registryDependencies.join(", ")}.`, "");
  if (packages.length) lines.push("To install by hand, add the packages it uses:", "", "```bash", `npm install ${packages.join(" ")}`, "```", "", `Then copy the source from ${SITE}/r/${name}.json into \`components/ui/${name}.tsx\`.`, "");
  lines.push("## Usage", "", "```tsx", example, "```", "");

  const tables = getPropsTables(name);
  if (tables.length) {
    lines.push("## API", "");
    for (const table of tables) {
      lines.push(`### ${table.component}`, "");
      if (table.extends) lines.push(`Also accepts ${table.extends}.`, "");
      lines.push("| Prop | Type | Default | Description |", "| --- | --- | --- | --- |");
      for (const prop of table.props) {
        lines.push(`| \`${prop.name}\`${prop.required ? " (required)" : ""} | \`${cell(prop.type)}\` | ${prop.defaultValue ? `\`${cell(prop.defaultValue)}\`` : "-"} | ${cell(prop.description ?? "")} |`);
      }
      lines.push("");
    }
  }
  return lines.join("\n");
}
