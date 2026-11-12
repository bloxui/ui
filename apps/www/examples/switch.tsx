import { Field, Switch } from "@blox-ui/ui";

export default function SwitchExample() {
  return (
    <div className="grid gap-4">
      <Field label="Notifications" hint="Email me about updates." orientation="horizontal">
        <Switch defaultChecked />
      </Field>
      <Field label="Auto-save" orientation="horizontal">
        <Switch tone="success" size="sm" />
      </Field>
    </div>
  );
}
