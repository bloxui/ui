import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Checkbox } from "./checkbox";
import { Field } from "./field";
import { Input } from "./input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./select";
import { Switch } from "./switch";
import { Textarea } from "./textarea";

const meta = {
  title: "Components/Field",
  component: Field,
  args: { label: "Email", hint: "We never share it." },
  argTypes: { orientation: { control: "inline-radio", options: ["vertical", "horizontal"] } },
  decorators: [(Story) => <div className="w-80">{Story()}</div>],
  render: (args) => (
    <Field {...args}>
      <Input type="email" placeholder="you@example.com" />
    </Field>
  ),
} satisfies Meta<typeof Field>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Required: Story = { args: { required: true } };

export const WithError: Story = { args: { error: "Enter a valid email address." } };

export const LiveValidation: Story = {
  render: (args) => {
    const [value, setValue] = React.useState("not-an-email");
    const error = /^\S+@\S+\.\S+$/.test(value) ? undefined : "Enter a valid email address.";
    return (
      <Field {...args} error={error}>
        <Input type="email" value={value} onChange={(event) => setValue(event.target.value)} />
      </Field>
    );
  },
};

export const WithOtherControls: Story = {
  render: () => (
    <div className="grid gap-5">
      <Field label="Bio" hint="Grows as you type.">
        <Textarea autoResize />
      </Field>
      <Field label="Framework" error="Pick a framework.">
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Choose one" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="next">Next.js</SelectItem>
            <SelectItem value="vite">Vite</SelectItem>
          </SelectContent>
        </Select>
      </Field>
      <Field label="Accept terms" hint="Required to continue." orientation="horizontal">
        <Checkbox />
      </Field>
      <Field label="Notifications" orientation="horizontal">
        <Switch defaultChecked />
      </Field>
    </div>
  ),
};
