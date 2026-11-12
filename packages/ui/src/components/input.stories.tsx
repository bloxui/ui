import type { Meta, StoryObj } from "@storybook/react-vite";
import { UserIcon } from "../lib/icons";
import { Input } from "./input";
import { Kbd } from "./kbd";

const meta = {
  title: "Components/Input",
  component: Input,
  args: { placeholder: "Type here", "aria-label": "Demo input" },
  argTypes: {
    size: { control: "select", options: ["sm", "md", "lg"] },
    leading: { control: false },
    trailing: { control: false },
  },
  decorators: [(Story) => <div className="w-80">{Story()}</div>],
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Sizes: Story = {
  render: (args) => (
    <div className="grid gap-3">
      <Input {...args} size="sm" placeholder="Small" />
      <Input {...args} size="md" placeholder="Medium" />
      <Input {...args} size="lg" placeholder="Large" />
    </div>
  ),
};

export const WithSlots: Story = {
  render: (args) => (
    <div className="grid gap-3">
      <Input {...args} leading={<UserIcon />} placeholder="Username" />
      <Input
        {...args}
        leading={<span className="text-sm">https://</span>}
        trailing={<span className="text-sm">.com</span>}
        placeholder="your-site"
      />
      <Input {...args} placeholder="Search" trailing={<Kbd>/</Kbd>} />
    </div>
  ),
};

export const Invalid: Story = { args: { invalid: true, defaultValue: "not-an-email" } };

export const Disabled: Story = { args: { disabled: true } };
