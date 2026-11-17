import "server-only";

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { toProjectImports } from "./docs";

/**
 * Builds a self-contained copy of one component's example, the way the CLI would
 * install it, for opening outside this site: in StackBlitz and in v0.
 */

const appRoot = process.cwd();
const registryDir = join(appRoot, "public/r");
const siteUrl = "https://bloxui-kit.vercel.app";

interface RegistryItem {
  name: string;
  type: "ui" | "block" | "lib" | "style";
  dependencies: Record<string, string>;
  registryDependencies: string[];
  files: { path: string; content: string }[];
}

const readItem = (name: string): RegistryItem => JSON.parse(readFileSync(join(registryDir, `${name}.json`), "utf8"));

/** Versions for packages the examples import that the components themselves do not. */
const exampleOnlyPackages: Record<string, string> = {
  "lucide-react": "^0.460.0",
  "react-hook-form": "^7.92.0",
  recharts: "^3.10.1",
};

export interface Playground {
  name: string;
  /** Component and helper files, keyed by project path (e.g. "components/ui/button.tsx"), imports using "@/". */
  files: Record<string, string>;
  /** The example, importing from "@/components/ui/…". */
  example: string;
  /** The theme stylesheet. */
  css: string;
  /** npm packages the files need. */
  dependencies: Record<string, string>;
}

/** Everything the example needs: the component, the components and helpers it uses, the theme, the packages. */
export function getPlayground(name: string): Playground {
  const files: Record<string, string> = {};
  const dependencies: Record<string, string> = { ...readItem("cn").dependencies };
  const seen = new Set<string>();

  const visit = (itemName: string) => {
    if (seen.has(itemName)) return;
    seen.add(itemName);
    const item = readItem(itemName);
    Object.assign(dependencies, item.dependencies);
    for (const dependency of item.registryDependencies) visit(dependency);
    for (const file of item.files) {
      const fileName = file.path.split("/").pop()!;
      const folder = item.type === "lib" ? "lib" : "components/ui";
      files[`${folder}/${fileName}`] = file.content
        .replaceAll('from "~ui/', 'from "@/components/ui/')
        .replaceAll('from "~lib/', 'from "@/lib/');
    }
  };
  visit("cn");
  visit(name);

  const example = toProjectImports(readFileSync(join(appRoot, `examples/${name}.tsx`), "utf8").replace(/\r\n/g, "\n"));
  // Examples often use other components too (an Alert example with a Button), so bring those as well.
  for (const match of example.matchAll(/from\s+"@\/components\/ui\/([\w-]+)"/g)) visit(match[1]!);
  for (const match of example.matchAll(/from\s+"([^"./@][^"]*|@[^"/]+\/[^"/]+)"/g)) {
    const pkg = match[1]!.startsWith("@") ? match[1]! : match[1]!.split("/")[0]!;
    if (exampleOnlyPackages[pkg]) dependencies[pkg] = exampleOnlyPackages[pkg]!;
  }

  return { name, files, example, css: readItem("theme").files[0]!.content, dependencies };
}

const componentName = (name: string) =>
  name
    .split("-")
    .map((part) => part[0]!.toUpperCase() + part.slice(1))
    .join("");

/** A Vite + React + Tailwind v4 project for StackBlitz, as { path: content }. */
export function stackblitzFiles(playground: Playground) {
  const files: Record<string, string> = {};
  for (const [path, content] of Object.entries(playground.files)) files[`src/${path}`] = content;
  files["src/example.tsx"] = playground.example;
  files["src/styles/blox.css"] = playground.css;

  files["package.json"] = JSON.stringify(
    {
      name: `blox-ui-${playground.name}`,
      private: true,
      type: "module",
      scripts: { dev: "vite", build: "vite build" },
      dependencies: { react: "^19.0.0", "react-dom": "^19.0.0", ...playground.dependencies },
      devDependencies: {
        "@tailwindcss/vite": "^4.0.0",
        "@types/react": "^19.0.0",
        "@types/react-dom": "^19.0.0",
        "@vitejs/plugin-react": "^5.0.0",
        tailwindcss: "^4.0.0",
        typescript: "^5.6.0",
        vite: "^7.0.0",
      },
    },
    null,
    2,
  );
  files["vite.config.ts"] = `import { fileURLToPath, URL } from "node:url";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: { alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) } },
});
`;
  files["tsconfig.json"] = JSON.stringify(
    {
      compilerOptions: {
        target: "ES2022",
        lib: ["DOM", "DOM.Iterable", "ES2022"],
        module: "ESNext",
        moduleResolution: "Bundler",
        jsx: "react-jsx",
        strict: true,
        skipLibCheck: true,
        noEmit: true,
        baseUrl: ".",
        paths: { "@/*": ["./src/*"] },
      },
      include: ["src"],
    },
    null,
    2,
  );
  files["index.html"] = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${componentName(playground.name)} - Blox UI</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
`;
  files["src/index.css"] = `@import "tailwindcss";
@import "./styles/blox.css";
`;
  files["src/main.tsx"] = `import { StrictMode, useState } from "react";
import { createRoot } from "react-dom/client";
import Example from "./example";
import "./index.css";

function App() {
  const [dark, setDark] = useState(false);
  return (
    <div className={dark ? "dark" : undefined}>
      <main className="flex min-h-dvh flex-col items-center justify-center gap-6 bg-bg p-6 text-fg">
        <button
          type="button"
          onClick={() => setDark(!dark)}
          className="fixed top-4 right-4 rounded-lg border border-border px-3 py-1.5 text-sm hover:bg-neutral-soft"
        >
          {dark ? "Light" : "Dark"} mode
        </button>
        <Example />
      </main>
    </div>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
`;
  files["README.md"] = `# ${componentName(playground.name)} - Blox UI

Edit \`src/example.tsx\` to try the component. The component itself is in \`src/components/ui/\`.

Add it to your own project with:

\`\`\`bash
npx @bloxui/cli add ${playground.name}
\`\`\`

Docs: ${siteUrl}/docs/components/${playground.name}
`;
  return files;
}

// --- v0 -------------------------------------------------------------------------------------

/** Pulls the custom properties out of one CSS block, e.g. the :root { … } of the theme. */
function readVariables(css: string, selector: RegExp) {
  const match = css.match(selector);
  const vars: Record<string, string> = {};
  if (!match) return vars;
  for (const [, key, value] of match[1]!.matchAll(/--([\w-]+):\s*([^;]+);/g)) vars[key!] = value!.replace(/\s+/g, " ").trim();
  return vars;
}

/** Turns "@keyframes x { from { a: b; } to { … } }" blocks into the nested object v0's css field expects. */
function readKeyframes(css: string) {
  const result: Record<string, Record<string, Record<string, string>>> = {};
  for (const [, name, body] of css.matchAll(/@keyframes\s+([\w-]+)\s*\{((?:[^{}]*\{[^{}]*\})+)\s*\}/g)) {
    const frames: Record<string, Record<string, string>> = {};
    for (const [, step, declarations] of body!.matchAll(/([\w%,\s]+?)\s*\{([^{}]*)\}/g)) {
      const props: Record<string, string> = {};
      for (const [, prop, value] of declarations!.matchAll(/([\w-]+):\s*([^;]+);/g)) props[prop!] = value!.trim();
      frames[step!.trim()] = props;
    }
    result[`@keyframes ${name}`] = frames;
  }
  return result;
}

/**
 * The example as a shadcn-format registry item, which "Open in v0" reads. The theme's
 * tokens go in cssVars, the animations in css, and every file the example needs is included.
 */
export function v0RegistryItem(playground: Playground) {
  const { css } = playground;
  const light = readVariables(css, /:root\s*\{([^}]*)\}/);
  const dark = readVariables(css, /\.dark\s*\{([^}]*)\}/);
  const theme = {
    ...readVariables(css, /@theme inline\s*\{([^}]*)\}/),
    ...readVariables(css, /\/\* Motion \*\/\s*@theme\s*\{([^@]*)/),
  };
  const exportName = `${componentName(playground.name)}Example`;

  return {
    $schema: "https://ui.shadcn.com/schema/registry-item.json",
    name: `${playground.name}-example`,
    type: "registry:block",
    title: `${componentName(playground.name)} - Blox UI`,
    description: `The ${playground.name} component from Blox UI (${siteUrl}).`,
    dependencies: Object.entries(playground.dependencies).map(([pkg, range]) => `${pkg}@${range}`),
    cssVars: { theme, light, dark },
    css: {
      ...readKeyframes(css),
      "@layer base": {
        "*": { "border-color": "var(--bx-border)" },
        ":root": { "color-scheme": "light" },
        ".dark": { "color-scheme": "dark" },
        body: { "background-color": "var(--bx-bg)", color: "var(--bx-fg)" },
      },
    },
    files: [
      ...Object.entries(playground.files).map(([path, content]) => ({
        path,
        content,
        type: path.startsWith("lib/") ? "registry:lib" : "registry:ui",
        target: path,
      })),
      {
        path: `components/${playground.name}-example.tsx`,
        content: playground.example.replace(/export default function \w+/, `export default function ${exportName}`),
        type: "registry:component",
        target: `components/${playground.name}-example.tsx`,
      },
      {
        path: "app/page.tsx",
        content: `import ${exportName} from "@/components/${playground.name}-example";

export default function Page() {
  return (
    <main className="flex min-h-dvh items-center justify-center p-6">
      <${exportName} />
    </main>
  );
}
`,
        type: "registry:page",
        target: "app/page.tsx",
      },
    ],
  };
}
