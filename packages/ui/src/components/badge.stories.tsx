import type { Meta, StoryObj } from "@storybook/react-vite";
import { Badge } from "./badge";

const tones = ["brand", "neutral", "success", "warning", "danger"] as const;
const variants = ["solid", "soft", "outline"] as const;

const meta = {
  title: "Components/Badge",
  component: Badge,
  args: { children: "Badge" },
  argTypes: {
    tone: { control: "select", options: tones },
    variant: { control: "select", options: variants },
    size: { control: "inline-radio", options: ["sm", "md"] },
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const ToneAndVariant: Story = {
  render: (args) => (
    <div className="grid grid-cols-[auto_repeat(3,auto)] items-center gap-x-4 gap-y-3">
      {tones.map((tone) => (
        <div key={tone} className="contents">
          <span className="pr-2 text-sm text-muted">{tone}</span>
          {variants.map((variant) => (
            <Badge key={variant} {...args} tone={tone} variant={variant}>
              {variant}
            </Badge>
          ))}
        </div>
      ))}
    </div>
  ),
};

export const WithDot: Story = {
  render: (args) => (
    <div className="flex gap-2">
      <Badge {...args} tone="success" dot>
        Active
      </Badge>
      <Badge {...args} tone="warning" dot>
        Pending
      </Badge>
      <Badge {...args} tone="danger" dot>
        Offline
      </Badge>
    </div>
  ),
};
