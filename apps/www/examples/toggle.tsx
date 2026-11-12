import { Bold, Italic, Underline } from "lucide-react";
import { Toggle, ToggleGroup, ToggleGroupItem } from "@blox-ui/ui";

export default function ToggleExample() {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <Toggle aria-label="Bold">
        <Bold />
      </Toggle>
      <ToggleGroup type="multiple" variant="outline" aria-label="Formatting">
        <ToggleGroupItem value="bold" aria-label="Bold">
          <Bold />
        </ToggleGroupItem>
        <ToggleGroupItem value="italic" aria-label="Italic">
          <Italic />
        </ToggleGroupItem>
        <ToggleGroupItem value="underline" aria-label="Underline">
          <Underline />
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
}
