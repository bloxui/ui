import { Checkbox, Field } from "@blox-ui/ui";

export default function CheckboxExample() {
  return (
    <div className="grid gap-3">
      <Field label="Accept terms" hint="You can change this later." orientation="horizontal">
        <Checkbox defaultChecked />
      </Field>
      <Field label="Some selected" orientation="horizontal">
        <Checkbox checked="indeterminate" />
      </Field>
      <Field label="Disabled" orientation="horizontal">
        <Checkbox disabled />
      </Field>
    </div>
  );
}
