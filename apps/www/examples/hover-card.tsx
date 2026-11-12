import { Avatar, HoverCard, HoverCardContent, HoverCardTrigger } from "@blox-ui/ui";

export default function HoverCardExample() {
  return (
    <HoverCard>
      <HoverCardTrigger href="#" className="text-sm font-medium text-brand-text underline underline-offset-4">
        @ada
      </HoverCardTrigger>
      <HoverCardContent className="flex gap-3">
        <Avatar name="Ada Lovelace" />
        <div className="grid gap-1">
          <p className="font-medium">Ada Lovelace</p>
          <p className="text-muted">Wrote the first published program.</p>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
