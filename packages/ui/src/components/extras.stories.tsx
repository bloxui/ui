import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { ChatInput, ChatMessage, ChatMessages, ChatTypingIndicator } from "./chat";
import { ColorPicker } from "./color-picker";
import { Field } from "./field";
import { FileUpload } from "./file-upload";
import { Kanban, type KanbanColumn } from "./kanban";
import { MultiSelect } from "./multi-select";
import { PhoneInput } from "./phone-input";
import { Rating } from "./rating";
import { Stepper } from "./stepper";
import { Timeline } from "./timeline";
import { TreeView } from "./tree-view";

const meta = { title: "Components/Extras" } satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const MultiSelectStory: Story = {
  name: "Multi Select",
  render: () => (
    <Field label="Skills" className="w-80">
      <MultiSelect
        defaultValue={["react"]}
        options={["React", "TypeScript", "Tailwind CSS", "Node.js", "Testing"].map((label) => ({
          value: label.toLowerCase(),
          label,
        }))}
      />
    </Field>
  ),
};

export const FileUploadStory: Story = {
  name: "File Upload",
  render: () => (
    <Field label="Attachments" className="w-96">
      <FileUpload accept="image/*,.pdf" maxSize={5 * 1024 * 1024} maxFiles={3} hint="Images or PDF, up to 5 MB." />
    </Field>
  ),
};

export const StepperStory: Story = {
  name: "Stepper",
  render: () => {
    const [current, setCurrent] = React.useState(1);
    const steps = [{ title: "Account" }, { title: "Profile" }, { title: "Plan" }, { title: "Done" }];
    return (
      <div className="grid w-[36rem] gap-10">
        <Stepper steps={steps} current={current} onStepClick={setCurrent} />
        <Stepper steps={steps} current={current} orientation="vertical" onStepClick={setCurrent} />
      </div>
    );
  },
};

export const RatingStory: Story = {
  name: "Rating",
  render: () => (
    <div className="grid gap-4">
      <Rating aria-label="Quality" defaultValue={3} />
      <Rating aria-label="Large" size="lg" defaultValue={4} />
      <Rating readOnly value={3.5} aria-label="Average" />
    </div>
  ),
};

export const TimelineStory: Story = {
  name: "Timeline",
  render: () => (
    <Timeline
      className="w-96"
      items={[
        { title: "Order placed", time: "Mon, 9:12 AM", tone: "success" },
        { title: "Shipped", description: "Left the warehouse.", time: "Tue, 6:30 PM", tone: "brand" },
        { title: "Delivered", time: "Expected Thursday" },
      ]}
    />
  ),
};

export const TreeViewStory: Story = {
  name: "Tree View",
  render: () => (
    <TreeView
      aria-label="Files"
      className="w-72"
      defaultExpandedIds={["src"]}
      items={[
        { id: "src", label: "src", children: [{ id: "app", label: "app.tsx" }, { id: "lib", label: "lib", children: [{ id: "cn", label: "cn.ts" }] }] },
        { id: "readme", label: "README.md" },
      ]}
    />
  ),
};

export const PhoneInputStory: Story = {
  name: "Phone Input",
  render: () => (
    <Field label="Phone number" className="w-80">
      <PhoneInput />
    </Field>
  ),
};

export const ColorPickerStory: Story = {
  name: "Color Picker",
  render: () => (
    <Field label="Brand colour" className="w-64">
      <ColorPicker />
    </Field>
  ),
};

const board: KanbanColumn[] = [
  { id: "todo", title: "To do", cards: [{ id: "1", title: "Write docs" }, { id: "2", title: "Fix the select" }] },
  { id: "doing", title: "In progress", tone: "brand", limit: 2, cards: [{ id: "3", title: "Kanban" }] },
  { id: "done", title: "Done", tone: "success", cards: [] },
];

export const KanbanStory: Story = {
  name: "Kanban",
  parameters: { layout: "padded" },
  render: () => {
    const [columns, setColumns] = React.useState(board);
    return <Kanban columns={columns} onColumnsChange={setColumns} />;
  },
};

export const ChatStory: Story = {
  name: "Chat",
  render: () => (
    <div className="flex h-96 w-[28rem] flex-col rounded-xl border border-border">
      <ChatMessages>
        <ChatMessage role="user" content="How do I add a button?" />
        <ChatMessage role="assistant" content="Run npx @bloxui/cli add button." copyText="npx @bloxui/cli add button" />
        <ChatTypingIndicator />
      </ChatMessages>
      <div className="p-3 pt-0">
        <ChatInput onSubmit={() => {}} />
      </div>
    </div>
  ),
};
