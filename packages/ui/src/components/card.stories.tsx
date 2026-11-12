import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "./button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./card";

const meta = {
  title: "Components/Card",
  component: Card,
  argTypes: {
    variant: { control: "select", options: ["outline", "raised", "sunken"] },
    padding: { control: "select", options: ["sm", "md", "lg"] },
  },
  render: (args) => (
    <Card {...args} className="w-80">
      <CardHeader>
        <CardTitle>Project Atlas</CardTitle>
        <CardDescription>Last updated two hours ago.</CardDescription>
      </CardHeader>
      <CardContent className="text-sm">Twelve components shipped, three in review.</CardContent>
      <CardFooter>
        <Button size="sm">Open</Button>
        <Button size="sm" variant="ghost" tone="neutral">
          Archive
        </Button>
      </CardFooter>
    </Card>
  ),
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
export const Raised: Story = { args: { variant: "raised" } };
export const Sunken: Story = { args: { variant: "sunken" } };
export const Interactive: Story = { args: { interactive: true, tabIndex: 0 } };
export const CompactPadding: Story = { args: { padding: "sm" } };
