import { Field, InputNumber } from "@blox-ui/ui";

export default function InputNumberExample() {
  return (
    <div className="grid w-full max-w-xs gap-4">
      <Field label="Guests" hint="Between 1 and 12.">
        <InputNumber defaultValue={2} min={1} max={12} />
      </Field>
      <Field label="Price">
        <InputNumber defaultValue={1499} step={50} formatOptions={{ style: "currency", currency: "INR" }} locale="en-IN" />
      </Field>
    </div>
  );
}
