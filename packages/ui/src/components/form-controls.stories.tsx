import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Checkbox } from "./checkbox";
import { Field } from "./field";
import { Label } from "./label";
import { RadioGroup, RadioGroupItem } from "./radio-group";
import { Switch } from "./switch";
import { Textarea } from "./textarea";

const tones = ["brand", "neutral", "success", "warning", "danger"] as const;

const meta = { title: "Components/Form controls" } satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const CheckboxStates: Story = {
  name: "Checkbox",
  render: () => (
    <div className="grid gap-3">
      <Field label="Unchecked" orientation="horizontal">
        <Checkbox />
      </Field>
      <Field label="Checked" orientation="horizontal">
        <Checkbox defaultChecked />
      </Field>
      <Field label="Indeterminate" orientation="horizontal">
        <Checkbox checked="indeterminate" onCheckedChange={() => {}} />
      </Field>
      <Field label="Small" orientation="horizontal">
        <Checkbox size="sm" defaultChecked />
      </Field>
      <Field label="Invalid" error="You must accept the terms." orientation="horizontal">
        <Checkbox />
      </Field>
      <Field label="Disabled" orientation="horizontal">
        <Checkbox disabled defaultChecked />
      </Field>
    </div>
  ),
};

export const CheckboxSelectAll: Story = {
  name: "Checkbox — select all",
  render: () => {
    const names = ["Buttons", "Inputs", "Cards"];
    const [items, setItems] = React.useState([true, false, false]);
    const all = items.every(Boolean);
    const some = items.some(Boolean);
    return (
      <div className="grid gap-3">
        <Field label="Select all" orientation="horizontal">
          <Checkbox
            checked={all ? true : some ? "indeterminate" : false}
            onCheckedChange={(checked) => setItems(items.map(() => checked === true))}
          />
        </Field>
        <div className="grid gap-3 pl-7">
          {names.map((name, index) => (
            <Field key={name} label={name} orientation="horizontal">
              <Checkbox
                checked={items[index]}
                onCheckedChange={(checked) =>
                  setItems(items.map((item, i) => (i === index ? checked === true : item)))
                }
              />
            </Field>
          ))}
        </div>
      </div>
    );
  },
};

export const RadioGroupStory: Story = {
  name: "Radio Group",
  render: () => (
    <div className="grid gap-8">
      <RadioGroup defaultValue="pro" aria-label="Plan">
        {["free", "pro", "team"].map((value) => (
          <div key={value} className="flex items-center gap-3">
            <RadioGroupItem value={value} id={`plan-${value}`} disabled={value === "team"} />
            <Label htmlFor={`plan-${value}`} className="capitalize">
              {value}
            </Label>
          </div>
        ))}
      </RadioGroup>
      <RadioGroup defaultValue="m" orientation="horizontal" tone="success" aria-label="Size">
        {["s", "m", "l"].map((value) => (
          <div key={value} className="flex items-center gap-2">
            <RadioGroupItem value={value} id={`size-${value}`} />
            <Label htmlFor={`size-${value}`} className="uppercase">
              {value}
            </Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  ),
};

export const SwitchStory: Story = {
  name: "Switch",
  render: () => (
    <div className="grid gap-3">
      {tones.map((tone) => (
        <Field key={tone} label={tone} orientation="horizontal">
          <Switch tone={tone} defaultChecked />
        </Field>
      ))}
      <Field label="Small" orientation="horizontal">
        <Switch size="sm" defaultChecked />
      </Field>
      <Field label="Disabled" orientation="horizontal">
        <Switch disabled />
      </Field>
    </div>
  ),
};

export const TextareaStory: Story = {
  name: "Textarea",
  render: () => (
    <div className="grid w-80 gap-4">
      <Textarea placeholder="Default, resizable" aria-label="Default" />
      <Textarea autoResize placeholder="Auto-resize: grows as you type" aria-label="Auto resize" />
      <Textarea invalid defaultValue="Too short" aria-label="Invalid" />
      <Textarea disabled placeholder="Disabled" aria-label="Disabled" />
    </div>
  ),
};
