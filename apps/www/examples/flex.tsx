import { Button, Flex } from "@blox-ui/ui";

export default function FlexExample() {
  return (
    <Flex direction="column" gap={4} className="w-full max-w-md">
      <Flex justify="between" align="center" className="rounded-lg border border-border p-3">
        <span className="text-sm font-medium">Unsaved changes</span>
        <Flex gap={2}>
          <Button size="sm" variant="ghost" tone="neutral">Discard</Button>
          <Button size="sm">Save</Button>
        </Flex>
      </Flex>
      <Flex gap={2} wrap>
        {["React", "TypeScript", "Tailwind", "Radix", "Vitest"].map((tag) => (
          <span key={tag} className="rounded-full bg-neutral-soft px-3 py-1 text-sm">{tag}</span>
        ))}
      </Flex>
    </Flex>
  );
}
