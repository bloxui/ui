import { Affix, Button, ScrollArea } from "@blox-ui/ui";

export default function AffixExample() {
  return (
    <ScrollArea className="h-72 w-full max-w-md rounded-xl border border-border">
      <div className="p-4">
        <p className="pb-4 text-sm text-muted">Scroll down: the bar sticks to the top of this box.</p>
        <Affix className="rounded-lg border border-border bg-surface/90 p-3 backdrop-blur-sm data-[stuck]:shadow-raised">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Pro plan · ₹499/month</span>
            <Button size="sm">Upgrade</Button>
          </div>
        </Affix>
        {Array.from({ length: 12 }, (_, index) => (
          <p key={index} className="py-3 text-sm text-muted">Feature {index + 1}: included in every plan.</p>
        ))}
      </div>
    </ScrollArea>
  );
}
