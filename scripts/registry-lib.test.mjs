import assert from "node:assert/strict";
import { test } from "node:test";
import {
  applyAliases,
  classifyImports,
  collectDependencies,
  findImports,
  normalizeNewlines,
  packageName,
  resolveItems,
  rewriteImports,
} from "./registry-lib.mjs";

const component = `"use client";

import * as React from "react";
import { Dialog as DialogPrimitive } from "radix-ui";
import { Slot } from "@radix-ui/react-slot";
import {
  cva,
  type VariantProps,
} from "class-variance-authority";
import type { DateRange } from "react-day-picker";
import "some-side-effect";
import { cn } from "../lib/cn";
import { XIcon } from "../lib/icons";
import { Button, type ButtonProps } from "./button";
export { toast } from "sonner";

// import { Fake } from "not-a-real-import" inside a comment on the same line is ignored
const text = "import x from 'also-not-real'";
`;

const block = `"use client";

import * as React from "react";
import { Bar } from "recharts";
import { Button } from "../components/button";
import { Card, CardContent } from "../components/card";
import { HomeIcon } from "../lib/icons";
`;

test("findImports reads single-line, multi-line, type-only, side-effect and re-export forms", () => {
  assert.deepEqual(findImports(component), [
    "react",
    "radix-ui",
    "@radix-ui/react-slot",
    "class-variance-authority",
    "react-day-picker",
    "some-side-effect",
    "../lib/cn",
    "../lib/icons",
    "./button",
    "sonner",
  ]);
});

test("packageName keeps the scope and drops subpaths", () => {
  assert.equal(packageName("recharts"), "recharts");
  assert.equal(packageName("recharts/es6/chart"), "recharts");
  assert.equal(packageName("@radix-ui/react-slot"), "@radix-ui/react-slot");
  assert.equal(packageName("@radix-ui/react-slot/dist/x"), "@radix-ui/react-slot");
});

test("classifyImports separates packages, components and libs, and leaves React out", () => {
  assert.deepEqual(classifyImports(component, "ui"), {
    packages: ["@radix-ui/react-slot", "class-variance-authority", "radix-ui", "react-day-picker", "some-side-effect", "sonner"],
    components: ["button"],
    libs: ["cn", "icons"],
  });
});

test("classifyImports treats a lib file's sibling imports as libs", () => {
  const lib = `import * as React from "react";\nimport { cn } from "./cn";\nimport { clsx } from "clsx";\n`;
  assert.deepEqual(classifyImports(lib, "lib"), { packages: ["clsx"], components: [], libs: ["cn"] });
});

test("classifyImports reads a block's component and lib imports", () => {
  assert.deepEqual(classifyImports(block, "block"), {
    packages: ["recharts"],
    components: ["button", "card"],
    libs: ["icons"],
  });
});

test("classifyImports rejects relative imports it cannot place", () => {
  assert.throws(() => classifyImports(`import { x } from "../../elsewhere/x";`, "ui"), /Unsupported relative import/);
  // A block may not import another block, and a component may not reach into ../components.
  assert.throws(() => classifyImports(`import { x } from "./other-block";`, "block"), /Unsupported relative import/);
  assert.throws(() => classifyImports(`import { x } from "../components/x";`, "ui"), /Unsupported relative import/);
});

test("rewriteImports swaps relative paths for aliases and leaves packages alone", () => {
  const output = rewriteImports(component, "ui");
  assert.match(output, /from "~lib\/cn"/);
  assert.match(output, /from "~lib\/icons"/);
  assert.match(output, /from "~ui\/button"/);
  assert.match(output, /from "radix-ui"/);
  assert.doesNotMatch(output, /from "\.\.?\//);
});

test("rewriteImports points a lib file's siblings at the lib alias", () => {
  assert.equal(rewriteImports(`import { cn } from "./cn";`, "lib"), `import { cn } from "~lib/cn";`);
});

test("rewriteImports points a block's components at the ui alias", () => {
  const output = rewriteImports(block, "block");
  assert.match(output, /from "~ui\/button"/);
  assert.match(output, /from "~ui\/card"/);
  assert.match(output, /from "~lib\/icons"/);
  assert.doesNotMatch(output, /from "\.\.?\//);
});

test("applyAliases replaces the registry aliases with a project's paths", () => {
  const source = `import { cn } from "~lib/cn";\nimport { Button } from '~ui/button';\nimport "~lib/side-effect";\nconst text = "~ui/not-an-import";\n`;
  assert.equal(
    applyAliases(source, { ui: "@/components/ui", lib: "@/lib" }),
    `import { cn } from "@/lib/cn";\nimport { Button } from '@/components/ui/button';\nimport "@/lib/side-effect";\nconst text = "~ui/not-an-import";\n`,
  );
});

test("applyAliases undoes rewriteImports for any layout", () => {
  const installed = applyAliases(rewriteImports(component, "ui"), { ui: "../ui", lib: "../../shared" });
  assert.match(installed, /from "\.\.\/\.\.\/shared\/cn"/);
  assert.match(installed, /from "\.\.\/ui\/button"/);
});

test("normalizeNewlines makes Windows and Unix checkouts identical", () => {
  assert.equal(normalizeNewlines("a\r\nb\r\n"), "a\nb\n");
  assert.equal(normalizeNewlines("a\nb\n"), "a\nb\n");
});

const items = {
  cn: { registryDependencies: [], dependencies: { clsx: "^2.1.1", "tailwind-merge": "^3.0.0" } },
  icons: { registryDependencies: [], dependencies: {} },
  button: { registryDependencies: ["cn"], dependencies: { "class-variance-authority": "^0.7.1" } },
  dialog: { registryDependencies: ["cn", "icons"], dependencies: { "radix-ui": "^1.8.1" } },
  "alert-dialog": { registryDependencies: ["cn", "button"], dependencies: { "radix-ui": "^1.8.1" } },
  command: { registryDependencies: ["dialog", "icons"], dependencies: { cmdk: "^1.1.1" } },
};

test("resolveItems returns dependencies before the items that need them, once each", () => {
  assert.deepEqual(resolveItems(["command"], items), ["cn", "icons", "dialog", "command"]);
  assert.deepEqual(resolveItems(["alert-dialog", "button"], items), ["cn", "button", "alert-dialog"]);
});

test("resolveItems names the unknown item and who needed it", () => {
  assert.throws(() => resolveItems(["nope"], items), /Unknown registry item "nope"/);
  assert.throws(
    () => resolveItems(["broken"], { broken: { registryDependencies: ["missing"] } }),
    /Unknown registry item "missing" \(needed by broken\)/,
  );
});

test("resolveItems reports a cycle with its path", () => {
  const cyclic = { a: { registryDependencies: ["b"] }, b: { registryDependencies: ["a"] } };
  assert.throws(() => resolveItems(["a"], cyclic), /Circular dependency: a → b → a/);
});

test("collectDependencies merges the packages of every resolved item, sorted", () => {
  const resolved = resolveItems(["command", "alert-dialog"], items);
  assert.deepEqual(collectDependencies(resolved, items), {
    "class-variance-authority": "^0.7.1",
    clsx: "^2.1.1",
    cmdk: "^1.1.1",
    "radix-ui": "^1.8.1",
    "tailwind-merge": "^3.0.0",
  });
});
