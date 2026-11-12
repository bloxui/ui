import { Progress } from "@blox-ui/ui";

export default function ProgressExample() {
  return (
    <div className="grid w-full max-w-xs gap-4">
      <Progress value={60} aria-label="Upload progress" />
      <Progress value={85} tone="success" size="sm" aria-label="Storage used" />
      <Progress aria-label="Loading" />
    </div>
  );
}
