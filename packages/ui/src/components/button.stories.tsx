import type { Meta, StoryObj } from "@storybook/react-vite";
import { CheckIcon, ChevronDownIcon, XIcon } from "../lib/icons";
import { Button } from "./button";

const variants = ["solid", "soft", "outline", "ghost", "link"] as const;
const tones = ["brand", "neutral", "success", "warning", "danger"] as const;
const sizes = ["xs", "sm", "md", "lg"] as const;

const meta = {
  title: "Components/Button",
  component: Button,
  args: { children: "Button" },
  argTypes: {
    variant: { control: "select", options: variants },
    tone: { control: "select", options: tones },
    size: { control: "select", options: sizes },
    leftIcon: { control: false },
    rightIcon: { control: false },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const ToneAndVariant: Story = {
  render: (args) => (
    <div className="grid grid-cols-[auto_repeat(5,auto)] items-center gap-x-4 gap-y-3">
      {tones.map((tone) => (
        <div key={tone} className="contents">
          <span className="pr-2 text-sm text-muted">{tone}</span>
          {variants.map((variant) => (
            <Button key={variant} {...args} tone={tone} variant={variant}>
              {variant}
            </Button>
          ))}
        </div>
      ))}
    </div>
  ),
};

export const Sizes: Story = {
  render: (args) => (
    <div className="flex items-center gap-3">
      {sizes.map((size) => (
        <Button key={size} {...args} size={size}>
          Size {size}
        </Button>
      ))}
    </div>
  ),
};

export const WithIcons: Story = {
  render: (args) => (
    <div className="flex items-center gap-3">
      <Button {...args} leftIcon={<CheckIcon />}>
        Approve
      </Button>
      <Button {...args} variant="soft" rightIcon={<ChevronDownIcon />}>
        Options
      </Button>
      <Button {...args} variant="outline" tone="danger" iconOnly aria-label="Close">
        <XIcon />
      </Button>
    </div>
  ),
};

export const Loading: Story = { args: { loading: true, children: "Saving" } };

export const Disabled: Story = { args: { disabled: true } };

export const AsLink: Story = {
  render: (args) => (
    <Button {...args} asChild variant="link">
      <a href="https://www.npmjs.com/package/blox-ui">Rendered as a link</a>
    </Button>
  ),
};
