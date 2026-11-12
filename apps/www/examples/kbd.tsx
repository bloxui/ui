import { Kbd } from "@blox-ui/ui";

export default function KbdExample() {
  return (
    <p className="flex items-center gap-1.5 text-sm text-muted">
      Press <Kbd>Ctrl</Kbd>
      <Kbd>K</Kbd> to search
    </p>
  );
}
