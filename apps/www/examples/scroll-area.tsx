import { ScrollArea } from "@blox-ui/ui";

export default function ScrollAreaExample() {
  return (
    <ScrollArea className="h-56 w-full max-w-xs rounded-lg border border-border">
      <div className="p-4 text-sm">
        {Array.from({ length: 30 }, (_, index) => (
          <p key={index} className="border-b border-border py-2 last:border-0">
            Release v0.{index + 1}.0
          </p>
        ))}
      </div>
    </ScrollArea>
  );
}
