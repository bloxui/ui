import { Field, Textarea } from "@blox-ui/ui";

export default function TextareaExample() {
  return (
    <Field label="Bio" hint="Grows as you type." className="w-full max-w-sm">
      <Textarea autoResize placeholder="Tell us about yourself" />
    </Field>
  );
}
