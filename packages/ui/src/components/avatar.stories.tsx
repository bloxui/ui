import type { Meta, StoryObj } from "@storybook/react-vite";
import { Avatar, AvatarGroup } from "./avatar";

const sizes = ["xs", "sm", "md", "lg", "xl"] as const;

// Inline image so the story works offline.
const photo =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#7c6cf5"/><stop offset="1" stop-color="#27b08a"/></linearGradient></defs><rect width="80" height="80" fill="url(#g)"/><circle cx="40" cy="32" r="14" fill="#fff" opacity=".9"/><path d="M12 80c3-18 14-26 28-26s25 8 28 26z" fill="#fff" opacity=".9"/></svg>',
  );

const meta = {
  title: "Components/Avatar",
  component: Avatar,
  args: { name: "Ada Lovelace" },
  argTypes: {
    size: { control: "select", options: sizes },
    shape: { control: "inline-radio", options: ["circle", "square"] },
    status: { control: "select", options: [undefined, "online", "away", "busy", "offline"] },
  },
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const WithImage: Story = { args: { src: photo } };

export const BrokenImageFallsBackToInitials: Story = { args: { src: "/does-not-exist.png" } };

export const NoNameFallsBackToIcon: Story = { args: { name: undefined } };

export const Sizes: Story = {
  render: (args) => (
    <div className="flex items-center gap-3">
      {sizes.map((size) => (
        <Avatar key={size} {...args} size={size} />
      ))}
    </div>
  ),
};

export const Status: Story = {
  render: (args) => (
    <div className="flex items-center gap-3">
      <Avatar {...args} status="online" />
      <Avatar {...args} status="away" />
      <Avatar {...args} status="busy" />
      <Avatar {...args} status="offline" shape="square" />
    </div>
  ),
};

export const Group: Story = {
  render: () => (
    <AvatarGroup max={3}>
      <Avatar name="Ada Lovelace" src={photo} />
      <Avatar name="Alan Turing" />
      <Avatar name="Grace Hopper" />
      <Avatar name="Linus Torvalds" />
      <Avatar name="Margaret Hamilton" />
    </AvatarGroup>
  ),
};
