import { Spinner } from "@blox-ui/ui";

export default function SpinnerExample() {
  return (
    <div className="flex items-center gap-4 text-brand-text">
      <Spinner className="size-4" />
      <Spinner className="size-6" />
      <Spinner className="size-8" />
    </div>
  );
}
