import { DatePicker, DateRangePicker, Field } from "@blox-ui/ui";

export default function DatePickerExample() {
  return (
    <div className="grid w-full max-w-xs gap-4">
      <Field label="Start date">
        <DatePicker clearable />
      </Field>
      <Field label="Trip dates">
        <DateRangePicker numberOfMonths={1} clearable />
      </Field>
    </div>
  );
}
