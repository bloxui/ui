import { Button, Separator } from "@blox-ui/ui";

export default function SeparatorExample() {
  return (
    <div className="grid w-full max-w-xs gap-4">
      <Button variant="outline" tone="neutral">Continue with email</Button>
      <Separator>or</Separator>
      <div className="flex h-5 items-center gap-3 text-sm">
        <span>Docs</span>
        <Separator orientation="vertical" />
        <span>Components</span>
      </div>
    </div>
  );
}
