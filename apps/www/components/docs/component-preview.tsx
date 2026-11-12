"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@blox-ui/ui";
import { examples } from "@/examples";
import { CodeBlock } from "./code-block";

interface ComponentPreviewProps {
  name: string;
  html: string;
  code: string;
}

/** The live example and its code, which are the same file. */
export function ComponentPreview({ name, html, code }: ComponentPreviewProps) {
  const Example = examples[name];
  return (
    <Tabs defaultValue="preview" variant="pills" size="sm">
      <TabsList aria-label="Example">
        <TabsTrigger value="preview">Preview</TabsTrigger>
        <TabsTrigger value="code">Code</TabsTrigger>
      </TabsList>
      <TabsContent value="preview">
        <div className="flex min-h-72 items-center justify-center overflow-x-auto rounded-lg border border-border bg-bg p-6 sm:p-10">
          {Example ? <Example /> : <p className="text-sm text-muted">No example yet.</p>}
        </div>
      </TabsContent>
      <TabsContent value="code">
        <CodeBlock html={html} code={code} />
      </TabsContent>
    </Tabs>
  );
}
