import assert from "node:assert/strict";
import { test } from "node:test";
import { classifyImports, findImports, packageName, resolveItems, rewriteImports } from "./registry-lib.mjs";

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

test("classifyImports rejects relative imports it cannot place", () => {
  assert.throws(() => classifyImports(`import { x } from "../../elsewhere/x";`, "ui"), /Unsupported relative import/);
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

const items = {
  cn: { registryDependencies: [] },
  icons: { registryDependencies: [] },
  button: { registryDependencies: ["cn"] },
  dialog: { registryDependencies: ["cn", "icons"] },
  "alert-dialog": { registryDependencies: ["cn", "button"] },
  command: { registryDependencies: ["dialog", "icons"] },
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
