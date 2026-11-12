import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useForm } from "react-hook-form";
import { Affix } from "./affix";
import { Anchor } from "./anchor";
import { Button } from "./button";
import { Cascader } from "./cascader";
import { Descriptions } from "./descriptions";
import { Field } from "./field";
import { Flex } from "./flex";
import { BackToTop, FloatButton, FloatButtonGroup } from "./float-button";
import { Form, FormField, FormRootError, FormSubmit } from "./form";
import { Grid } from "./grid";
import { Image } from "./image";
import { Input } from "./input";
import { InputNumber } from "./input-number";
import { List, ListItem } from "./list";
import { Mentions } from "./mentions";
import { Popconfirm } from "./popconfirm";
import { QRCode } from "./qr-code";
import { Result } from "./result";
import { Space } from "./space";
import { Statistic } from "./statistic";
import { ThemeProvider, useTheme } from "./theme-provider";
import { TimePicker } from "./time-picker";
import { Tour } from "./tour";
import { Transfer } from "./transfer";
import { TreeSelect } from "./tree-select";
import { Blockquote, Heading, InlineCode, Text } from "./typography";
import { Watermark } from "./watermark";

const meta = { title: "Components/Data entry and display" } satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const FormStory: Story = {
  name: "Form",
  render: () => {
    const form = useForm({ defaultValues: { email: "" } });
    return (
      <Form form={form} onSubmit={() => form.setError("root", { message: "This email is already registered." })} className="w-80">
        <FormRootError />
        <FormField
          name="email"
          label="Email"
          rules={{ required: "Enter your email.", pattern: { value: /^\S+@\S+\.\S+$/, message: "Enter a valid email address." } }}
          render={({ field }) => <Input {...field} />}
        />
        <FormSubmit>Sign up</FormSubmit>
      </Form>
    );
  },
};

export const InputsStory: Story = {
  name: "Input Number, Time Picker, Mentions",
  render: () => (
    <div className="grid w-80 gap-4">
      <Field label="Guests">
        <InputNumber defaultValue={2} min={1} max={12} />
      </Field>
      <Field label="Starts at">
        <TimePicker hour12 minuteStep={15} defaultValue="10:30" />
      </Field>
      <Field label="Comment" hint="Type @">
        <Mentions options={[{ value: "ada", label: "Ada Lovelace" }, { value: "alan", label: "Alan Turing" }]} />
      </Field>
    </div>
  ),
};

export const PickersStory: Story = {
  name: "Cascader, Tree Select, Transfer",
  render: () => (
    <div className="grid w-[40rem] gap-4">
      <Field label="City">
        <Cascader
          options={[
            { value: "in", label: "India", children: [{ value: "gj", label: "Gujarat", children: [{ value: "surat", label: "Surat" }] }] },
          ]}
        />
      </Field>
      <Field label="Team">
        <TreeSelect items={[{ id: "eng", label: "Engineering", children: [{ id: "web", label: "Web" }] }]} />
      </Field>
      <Transfer items={["Read", "Write", "Invite", "Billing"].map((label) => ({ key: label.toLowerCase(), label }))} />
    </div>
  ),
};

export const DisplayStory: Story = {
  name: "Typography, Descriptions, List, Statistic",
  render: () => (
    <div className="grid w-[36rem] gap-6">
      <Heading level={2}>Quarterly report</Heading>
      <Text variant="lead">Revenue grew while churn fell.</Text>
      <Text>
        Use <InlineCode>tone</InlineCode> everywhere.
      </Text>
      <Blockquote>Change a token once.</Blockquote>
      <Descriptions items={[{ label: "Owner", value: "Ada" }, { label: "Status", value: "Active" }, { label: "Plan", value: "Pro" }]} bordered />
      <List bordered header="Team">
        <ListItem title="Ada Lovelace" description="Owner" />
        <ListItem title="Alan Turing" description="Editor" />
      </List>
      <Statistic label="Revenue" value={48290} formatOptions={{ style: "currency", currency: "USD" }} change={12.4} changeLabel="vs last month" />
    </div>
  ),
};

export const MediaStory: Story = {
  name: "Image, QR Code, Watermark",
  render: () => (
    <div className="flex items-start gap-6">
      <Image src="/does-not-exist.png" alt="Missing photo" wrapperClassName="size-40" />
      <div className="rounded-lg bg-white p-2 text-black">
        <QRCode value="https://github.com/bloxui/ui" size={140} />
      </div>
      <Watermark text="Draft" className="w-56 rounded-lg border border-border p-4 text-sm">
        A watermarked note.
      </Watermark>
    </div>
  ),
};

export const ResultStory: Story = {
  name: "Result",
  render: () => (
    <div className="grid w-[40rem] grid-cols-2 gap-4">
      <Result status="success" title="Saved" className="rounded-xl border border-border" />
      <Result status={503} actions={<Button size="sm">Try again</Button>} className="rounded-xl border border-border" />
    </div>
  ),
};

export const OverlaysStory: Story = {
  name: "Popconfirm and Tour",
  render: () => {
    const [open, setOpen] = React.useState(false);
    const target = React.useRef<HTMLButtonElement>(null);
    return (
      <div className="flex gap-3">
        <Popconfirm title="Delete this?" onConfirm={() => {}}>
          <Button tone="danger" variant="soft">Delete</Button>
        </Popconfirm>
        <Button ref={target} onClick={() => setOpen(true)}>Start tour</Button>
        <Tour open={open} onOpenChange={setOpen} steps={[{ target, title: "This button", description: "Starts the tour." }, { title: "Done" }]} />
      </div>
    );
  },
};

export const LayoutStory: Story = {
  name: "Flex, Grid, Space, Affix, Anchor",
  render: () => (
    <div className="grid w-[36rem] gap-6">
      <Flex justify="between" align="center" className="rounded-lg border border-border p-3">
        <span>Flex</span>
        <Button size="sm">Action</Button>
      </Flex>
      <Grid columns={{ base: 2, md: 4 }} gap={2}>
        {[1, 2, 3, 4].map((n) => (
          <div key={n} className="rounded bg-sunken p-4 text-center">{n}</div>
        ))}
      </Grid>
      <Space separator="·">
        <span>One</span>
        <span>Two</span>
        <span>Three</span>
      </Space>
      <Affix className="rounded border border-border bg-surface p-2">Sticks at the top</Affix>
      <Anchor links={[{ id: "a", title: "Section A" }, { id: "b", title: "Section B" }]} />
    </div>
  ),
};

export const FloatButtonStory: Story = {
  name: "Float Button",
  render: () => (
    <div className="h-64">
      <FloatButton icon={<span>?</span>} label="Help" />
      <FloatButtonGroup label="Create">
        <FloatButton icon={<span>N</span>} label="New note" size="md" />
      </FloatButtonGroup>
      <BackToTop />
    </div>
  ),
};

function ThemeName() {
  const { theme, setTheme } = useTheme();
  return (
    <Button variant="outline" tone="neutral" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
      Theme: {theme}
    </Button>
  );
}

export const ThemeProviderStory: Story = {
  name: "Theme Provider",
  render: () => (
    <ThemeProvider storageKey="storybook-theme">
      <ThemeName />
    </ThemeProvider>
  ),
};
