import { AspectRatio } from "@blox-ui/ui";

export default function AspectRatioExample() {
  return (
    <AspectRatio ratio={16 / 9} className="max-w-sm rounded-lg bg-sunken">
      <div className="flex size-full items-center justify-center text-sm text-muted">16 / 9</div>
    </AspectRatio>
  );
}
