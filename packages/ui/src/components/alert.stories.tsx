import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Alert } from "./alert";
import { Button } from "./button";

const tones = ["brand", "neutral", "success", "warning", "danger"] as const;

const meta = {
  title: "Components/Alert",
  component: Alert,
  args: {
    title: "New version available",
    children: "Blox UI 0.2 adds forms and feedback components.",
    // Stories render on load, so keep them from interrupting screen readers.
    role: "status",
  },
  argTypes: {
    tone: { control: "select", options: tones },
    variant: { control: "inline-radio", options: ["soft", "outline"] },
    icon: { control: false },
    actions: { control: false },
  },
  decorators: [(Story) => <div className="w-[28rem] max-w-full">{Story()}</div>],
} satisfies Meta<typeof Alert>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Tones: Story = {
  render: (args) => (
    <div className="grid gap-3">
      {tones.map((tone) => (
        <Alert key={tone} {...args} tone={tone} title={`${tone} alert`} />
      ))}
    </div>
  ),
};

export const Outline: Story = { args: { variant: "outline", tone: "danger", title: "Payment failed" } };

export const DescriptionOnly: Story = { args: { title: undefined, tone: "success", children: "Saved." } };

export const WithoutIcon: Story = { args: { icon: false } };

export const WithActions: Story = {
  args: {
    actions: (
      <>
        <Button size="xs">Update now</Button>
        <Button size="xs" variant="ghost">
          Later
        </Button>
      </>
    ),
  },
};

export const Dismissible: Story = {
  render: (args) => {
    const [open, setOpen] = React.useState(true);
    return open ? (
      <Alert {...args} onDismiss={() => setOpen(false)} />
    ) : (
      <Button variant="soft" size="sm" onClick={() => setOpen(true)}>
        Show the alert again
      </Button>
    );
  },
};
