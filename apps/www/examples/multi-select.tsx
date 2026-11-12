"use client";

import * as React from "react";
import { Field, MultiSelect } from "@blox-ui/ui";

const skills = [
  { value: "react", label: "React" },
  { value: "typescript", label: "TypeScript" },
  { value: "tailwind", label: "Tailwind CSS", keywords: ["css"] },
  { value: "node", label: "Node.js" },
  { value: "design", label: "Design systems" },
  { value: "testing", label: "Testing" },
];

export default function MultiSelectExample() {
  const [value, setValue] = React.useState(["react", "typescript"]);
  return (
    <Field label="Skills" hint="Pick up to four." className="w-full max-w-sm">
      <MultiSelect options={skills} value={value} onValueChange={setValue} maxSelected={4} placeholder="Add skills" />
    </Field>
  );
}
