"use client";

import * as React from "react";
import { Combobox, Field } from "@blox-ui/ui";

const frameworks = [
  { value: "next", label: "Next.js" },
  { value: "vite", label: "Vite", keywords: ["bundler"] },
  { value: "router", label: "React Router" },
  { value: "astro", label: "Astro" },
];

export default function ComboboxExample() {
  const [value, setValue] = React.useState("");
  return (
    <Field label="Framework" hint="Type to search." className="w-full max-w-xs">
      <Combobox options={frameworks} value={value} onValueChange={setValue} clearable placeholder="Choose one" />
    </Field>
  );
}
