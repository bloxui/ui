import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "./button";
import { Kbd } from "./kbd";
import { Label } from "./label";
import { Progress } from "./progress";
import { Separator } from "./separator";
import { Skeleton, SkeletonText } from "./skeleton";
import { Spinner } from "./spinner";

const tones = ["brand", "neutral", "success", "warning", "danger"] as const;

const meta = { title: "Components/Display" } satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const ProgressStory: Story = {
  name: "Progress",
  render: () => {
    const [value, setValue] = React.useState(35);
    return (
      <div className="grid w-72 gap-4">
        {tones.map((tone) => (
          <Progress key={tone} tone={tone} value={value} aria-label={`${tone} progress`} />
        ))}
        <Progress size="sm" value={value} aria-label="Small progress" />
        <Progress size="lg" value={value} aria-label="Large progress" />
        <div className="flex gap-2">
          <Button size="sm" variant="soft" onClick={() => setValue(Math.max(0, value - 15))}>
            − 15
          </Button>
          <Button size="sm" variant="soft" onClick={() => setValue(Math.min(100, value + 15))}>
            + 15
          </Button>
        </div>
      </div>
    );
  },
};

export const ProgressIndeterminate: Story = {
  name: "Progress — indeterminate",
  render: () => (
    <div className="w-72">
      <Progress aria-label="Loading" />
    </div>
  ),
};

export const SeparatorStory: Story = {
  name: "Separator",
  render: () => (
    <div className="grid w-72 gap-5">
      <Separator />
      <Separator>or</Separator>
      <div className="flex h-5 items-center gap-3 text-sm">
        <span>Docs</span>
        <Separator orientation="vertical" />
        <span>Components</span>
        <Separator orientation="vertical" />
        <span>Themes</span>
      </div>
    </div>
  ),
};

export const SkeletonStory: Story = {
  name: "Skeleton",
  render: () => (
    <div className="flex w-72 items-start gap-3">
      <Skeleton className="size-10 rounded-full" />
      <div className="flex-1 space-y-3">
        <Skeleton className="h-4 w-32" />
        <SkeletonText lines={3} />
      </div>
    </div>
  ),
};

export const KbdStory: Story = {
  name: "Kbd",
  render: () => (
    <p className="flex items-center gap-1.5 text-sm text-muted">
      Press <Kbd>Ctrl</Kbd>
      <Kbd>K</Kbd> to search
    </p>
  ),
};

export const LabelStory: Story = {
  name: "Label",
  render: () => (
    <div className="grid gap-2">
      <Label>Plain label</Label>
      <Label required>Required label</Label>
    </div>
  ),
};

export const SpinnerStory: Story = {
  name: "Spinner",
  render: () => (
    <div className="flex items-center gap-4 text-brand-text">
      <Spinner className="size-4" />
      <Spinner className="size-6" />
      <Spinner className="size-8" />
    </div>
  ),
};
