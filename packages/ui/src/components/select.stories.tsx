import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "./select";

const meta = {
  title: "Components/Select",
  component: SelectTrigger,
  args: { "aria-label": "Framework" },
  argTypes: { size: { control: "select", options: ["sm", "md", "lg"] } },
  decorators: [(Story) => <div className="w-64">{Story()}</div>],
  render: (args) => (
    <Select>
      <SelectTrigger {...args}>
        <SelectValue placeholder="Choose a framework" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>React</SelectLabel>
          <SelectItem value="next">Next.js</SelectItem>
          <SelectItem value="vite">Vite</SelectItem>
          <SelectItem value="router">React Router</SelectItem>
        </SelectGroup>
        <SelectSeparator />
        <SelectGroup>
          <SelectLabel>Other</SelectLabel>
          <SelectItem value="astro">Astro</SelectItem>
          <SelectItem value="laravel" disabled>
            Laravel (soon)
          </SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  ),
} satisfies Meta<typeof SelectTrigger>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
export const Small: Story = { args: { size: "sm" } };
export const Large: Story = { args: { size: "lg" } };
export const Invalid: Story = { args: { invalid: true } };
export const Disabled: Story = { args: { disabled: true } };
