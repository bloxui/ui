import { Button, Collapsible, CollapsibleContent, CollapsibleTrigger } from "@blox-ui/ui";

export default function CollapsibleExample() {
  return (
    <Collapsible className="w-full max-w-xs">
      <CollapsibleTrigger asChild>
        <Button variant="outline" tone="neutral" fullWidth>Show advanced options</Button>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <p className="pt-3 text-sm text-muted">Hidden until asked for, with an animated height.</p>
      </CollapsibleContent>
    </Collapsible>
  );
}
