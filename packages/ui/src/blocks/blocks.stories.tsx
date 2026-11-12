import type { Meta, StoryObj } from "@storybook/react-vite";
import { DashboardBlock } from "./dashboard";
import { LoginBlock } from "./login";
import { SettingsBlock } from "./settings";
import { SignupBlock } from "./signup";

const meta = {
  title: "Blocks",
  parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

export const Login: Story = {
  render: () => (
    <LoginBlock
      onSubmit={async ({ password }) => {
        await wait(800);
        if (password !== "password") throw new Error('Wrong email or password. Try the password "password".');
      }}
    />
  ),
};

export const Signup: Story = {
  render: () => <SignupBlock onSubmit={() => wait(800)} />,
};

export const Settings: Story = {
  render: () => <SettingsBlock />,
};

export const Dashboard: Story = {
  render: () => <DashboardBlock />,
};
