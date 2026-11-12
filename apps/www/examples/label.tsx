import { Input, Label } from "@blox-ui/ui";

export default function LabelExample() {
  return (
    <div className="grid w-full max-w-xs gap-1.5">
      <Label htmlFor="username" required>Username</Label>
      <Input id="username" required />
    </div>
  );
}
