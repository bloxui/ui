import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Slider } from "./slider";

const meta = {
  title: "Components/Slider",
  component: Slider,
  args: { defaultValue: [40], "aria-label": "Volume" },
  argTypes: {
    tone: { control: "select", options: ["brand", "neutral", "success", "warning", "danger"] },
  },
  decorators: [(Story) => <div className="w-72">{Story()}</div>],
} satisfies Meta<typeof Slider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Range: Story = {
  render: (args) => {
    const [value, setValue] = React.useState([20, 70]);
    return (
      <div className="grid gap-2">
        <div className="flex justify-between text-sm">
          <span>Price range</span>
          <span className="text-muted tabular-nums">
            {value[0]} – {value[1]}
          </span>
        </div>
        <Slider
          {...args}
          defaultValue={undefined}
          value={value}
          onValueChange={setValue}
          thumbLabels={["Minimum price", "Maximum price"]}
        />
      </div>
    );
  },
};

export const Steps: Story = { args: { step: 25, defaultValue: [50] } };

export const Vertical: Story = {
  args: { orientation: "vertical" },
  decorators: [(Story) => <div className="flex h-48 justify-center">{Story()}</div>],
};

export const Disabled: Story = { args: { disabled: true } };
