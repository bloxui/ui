import { Settings } from "lucide-react";
import { Button, Tooltip } from "@blox-ui/ui";

export default function TooltipExample() {
  return (
    <div className="flex gap-3">
      <Tooltip content="Open settings" shortcut="Ctrl ,">
        <Button iconOnly variant="outline" tone="neutral" aria-label="Settings">
          <Settings />
        </Button>
      </Tooltip>
      <Tooltip content="Shown below" side="bottom">
        <Button variant="soft">Hover or focus me</Button>
      </Tooltip>
    </div>
  );
}
