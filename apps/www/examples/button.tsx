import { ArrowRight, Download, Trash2 } from "lucide-react";
import { Button } from "@blox-ui/ui";

export default function ButtonExample() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button leftIcon={<Download />}>Download</Button>
      <Button variant="soft" rightIcon={<ArrowRight />}>Continue</Button>
      <Button variant="outline" tone="neutral">Cancel</Button>
      <Button tone="danger" variant="ghost" iconOnly aria-label="Delete">
        <Trash2 />
      </Button>
      <Button loading>Saving</Button>
    </div>
  );
}
