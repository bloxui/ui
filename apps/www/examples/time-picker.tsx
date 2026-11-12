import { Field, TimePicker } from "@blox-ui/ui";

export default function TimePickerExample() {
  return (
    <div className="grid w-full max-w-xs gap-4">
      <Field label="Meeting starts">
        <TimePicker hour12 minuteStep={15} defaultValue="10:30" />
      </Field>
      <Field label="Alarm (24-hour)">
        <TimePicker />
      </Field>
    </div>
  );
}
