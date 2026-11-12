import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { CheckIcon, InfoIcon, SearchIcon, UserIcon } from "../lib/icons";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./accordion";
import { AspectRatio } from "./aspect-ratio";
import { Badge } from "./badge";
import { Breadcrumb, BreadcrumbEllipsis, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage } from "./breadcrumb";
import { Button } from "./button";
import { ButtonGroup } from "./button-group";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./collapsible";
import { Combobox } from "./combobox";
import { Empty } from "./empty";
import { Field } from "./field";
import { InputOTP } from "./input-otp";
import { Pagination } from "./pagination";
import { ScrollArea } from "./scroll-area";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "./table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./tabs";
import { toast, Toaster } from "./toast";
import { Toggle, ToggleGroup, ToggleGroupItem } from "./toggle";

const meta = { title: "Components/Navigation and data" } satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const TabsStory: Story = {
  name: "Tabs",
  render: () => (
    <div className="grid w-[28rem] max-w-full gap-8">
      <Tabs defaultValue="account">
        <TabsList aria-label="Settings">
          <TabsTrigger value="account">
            <UserIcon /> Account
          </TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
          <TabsTrigger value="team" disabled>
            Team
          </TabsTrigger>
        </TabsList>
        <TabsContent value="account" className="text-sm text-muted">
          Underline tabs suit page-level navigation.
        </TabsContent>
        <TabsContent value="billing" className="text-sm text-muted">
          Billing settings.
        </TabsContent>
      </Tabs>

      <Tabs defaultValue="week" variant="pills" size="sm">
        <TabsList aria-label="Range" fullWidth>
          <TabsTrigger value="day">Day</TabsTrigger>
          <TabsTrigger value="week">Week</TabsTrigger>
          <TabsTrigger value="month">Month</TabsTrigger>
        </TabsList>
        <TabsContent value="day" className="text-sm text-muted">
          Today.
        </TabsContent>
        <TabsContent value="week" className="text-sm text-muted">
          Pills suit a compact segmented switch.
        </TabsContent>
        <TabsContent value="month" className="text-sm text-muted">
          This month.
        </TabsContent>
      </Tabs>

      <Tabs defaultValue="general" orientation="vertical">
        <TabsList aria-label="Preferences">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>
        <TabsContent value="general" className="text-sm text-muted">
          Vertical orientation.
        </TabsContent>
        <TabsContent value="security" className="text-sm text-muted">
          Security settings.
        </TabsContent>
      </Tabs>
    </div>
  ),
};

const faqs = [
  ["What is Blox UI?", "A set of React components you copy into your project and own."],
  ["Is it accessible?", "Yes. Keyboard and screen reader behaviour comes from Radix primitives."],
  ["Can I theme it?", "Override any --bx-* CSS variable to restyle the whole library."],
] as const;

export const AccordionStory: Story = {
  name: "Accordion",
  render: () => (
    <div className="grid w-[28rem] max-w-full gap-8">
      <Accordion type="single" collapsible defaultValue="0">
        {faqs.map(([question, answer], index) => (
          <AccordionItem key={question} value={String(index)}>
            <AccordionTrigger>{question}</AccordionTrigger>
            <AccordionContent>{answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
      <Accordion type="multiple" variant="card">
        {faqs.map(([question, answer], index) => (
          <AccordionItem key={question} value={String(index)}>
            <AccordionTrigger>{question}</AccordionTrigger>
            <AccordionContent>{answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  ),
};

export const CollapsibleStory: Story = {
  name: "Collapsible",
  render: () => (
    <Collapsible className="w-72">
      <CollapsibleTrigger asChild>
        <Button variant="outline" tone="neutral" fullWidth>
          Show advanced options
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <p className="pt-3 text-sm text-muted">Hidden until asked for, with an animated height.</p>
      </CollapsibleContent>
    </Collapsible>
  ),
};

export const BreadcrumbStory: Story = {
  name: "Breadcrumb",
  render: () => (
    <div className="grid gap-4">
      <Breadcrumb>
        <BreadcrumbItem>
          <BreadcrumbLink href="#">Home</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <BreadcrumbLink href="#">Components</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <BreadcrumbPage>Breadcrumb</BreadcrumbPage>
        </BreadcrumbItem>
      </Breadcrumb>
      <Breadcrumb separator="/">
        <BreadcrumbItem>
          <BreadcrumbLink href="#">Home</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <BreadcrumbEllipsis />
        </BreadcrumbItem>
        <BreadcrumbItem>
          <BreadcrumbPage>Custom separator</BreadcrumbPage>
        </BreadcrumbItem>
      </Breadcrumb>
    </div>
  ),
};

export const PaginationStory: Story = {
  name: "Pagination",
  render: () => {
    const [page, setPage] = React.useState(6);
    return (
      <div className="grid gap-4">
        <Pagination page={page} count={20} onPageChange={setPage} />
        <Pagination page={page} count={20} onPageChange={setPage} size="sm" siblings={0} />
        <p className="text-sm text-muted">Page {page} of 20</p>
      </div>
    );
  },
};

const invoices = [
  ["INV-001", "Paid", "Card", 250],
  ["INV-002", "Pending", "Bank transfer", 150],
  ["INV-003", "Overdue", "Card", 350],
  ["INV-004", "Paid", "UPI", 450],
] as const;

const statusTone = { Paid: "success", Pending: "warning", Overdue: "danger" } as const;

export const TableStory: Story = {
  name: "Table",
  render: () => (
    <div className="w-[36rem] max-w-full">
      <Table striped>
        <TableCaption>Recent invoices</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Invoice</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Method</TableHead>
            <TableHead numeric>Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoices.map(([id, status, method, amount]) => (
            <TableRow key={id}>
              <TableCell className="font-medium">{id}</TableCell>
              <TableCell>
                <Badge tone={statusTone[status]} dot>
                  {status}
                </Badge>
              </TableCell>
              <TableCell>{method}</TableCell>
              <TableCell numeric>${amount.toFixed(2)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={3}>Total</TableCell>
            <TableCell numeric>$1,200.00</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  ),
};

export const TableDenseSticky: Story = {
  name: "Table — dense with sticky header",
  render: () => (
    <div className="w-[28rem] max-w-full">
      <Table dense stickyHeader containerClassName="max-h-56">
        <TableHeader>
          <TableRow>
            <TableHead>Component</TableHead>
            <TableHead numeric>Downloads</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: 16 }, (_, index) => (
            <TableRow key={index} data-state={index === 2 ? "selected" : undefined}>
              <TableCell>Component {index + 1}</TableCell>
              <TableCell numeric>{((index + 3) * 1371).toLocaleString("en-US")}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  ),
};

export const ToggleStory: Story = {
  name: "Toggle and Toggle Group",
  render: () => (
    <div className="grid justify-items-start gap-5">
      <div className="flex gap-2">
        <Toggle aria-label="Bold" className="font-bold">
          B
        </Toggle>
        <Toggle aria-label="Italic" variant="outline" className="italic">
          I
        </Toggle>
        <Toggle variant="outline" tone="success" defaultPressed>
          <CheckIcon /> Following
        </Toggle>
      </div>
      <ToggleGroup type="single" defaultValue="center" variant="outline" aria-label="Alignment">
        <ToggleGroupItem value="left">Left</ToggleGroupItem>
        <ToggleGroupItem value="center">Center</ToggleGroupItem>
        <ToggleGroupItem value="right">Right</ToggleGroupItem>
      </ToggleGroup>
      <ToggleGroup type="multiple" size="sm" aria-label="Formatting">
        <ToggleGroupItem value="bold" aria-label="Bold" className="font-bold">
          B
        </ToggleGroupItem>
        <ToggleGroupItem value="italic" aria-label="Italic" className="italic">
          I
        </ToggleGroupItem>
        <ToggleGroupItem value="underline" aria-label="Underline" className="underline">
          U
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  ),
};

export const ButtonGroupStory: Story = {
  name: "Button Group",
  render: () => (
    <div className="grid justify-items-start gap-5">
      <ButtonGroup aria-label="History">
        <Button variant="outline" tone="neutral">
          Undo
        </Button>
        <Button variant="outline" tone="neutral">
          Redo
        </Button>
        <Button variant="outline" tone="neutral">
          Reset
        </Button>
      </ButtonGroup>
      <ButtonGroup orientation="vertical" aria-label="Zoom">
        <Button variant="outline" tone="neutral">
          Zoom in
        </Button>
        <Button variant="outline" tone="neutral">
          Zoom out
        </Button>
      </ButtonGroup>
    </div>
  ),
};

export const ScrollAreaStory: Story = {
  name: "Scroll Area",
  render: () => (
    <div className="grid gap-5">
      <ScrollArea className="h-48 w-64 rounded-lg border border-border">
        <div className="p-4 text-sm">
          {Array.from({ length: 30 }, (_, index) => (
            <p key={index} className="border-b border-border py-2 last:border-0">
              Release v0.{index + 1}.0
            </p>
          ))}
        </div>
      </ScrollArea>
      <ScrollArea orientation="horizontal" className="w-64 rounded-lg border border-border">
        <div className="flex w-max gap-3 p-4">
          {Array.from({ length: 10 }, (_, index) => (
            <div key={index} className="flex size-20 items-center justify-center rounded-md bg-sunken text-sm">
              {index + 1}
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  ),
};

export const AspectRatioStory: Story = {
  name: "Aspect Ratio",
  render: () => (
    <div className="grid w-80 gap-4">
      <AspectRatio ratio={16 / 9} className="flex items-center justify-center rounded-lg bg-sunken text-sm text-muted">
        16 / 9
      </AspectRatio>
      <AspectRatio ratio={1} className="flex w-32 items-center justify-center rounded-lg bg-sunken text-sm text-muted">
        1 / 1
      </AspectRatio>
    </div>
  ),
};

export const EmptyStory: Story = {
  name: "Empty",
  render: () => (
    <div className="w-[26rem] max-w-full">
      <Empty
        icon={<SearchIcon />}
        title="No projects yet"
        description="Projects you create will show up here."
        actions={
          <>
            <Button>New project</Button>
            <Button variant="ghost" tone="neutral">
              Import
            </Button>
          </>
        }
      />
    </div>
  ),
};

export const ToastStory: Story = {
  name: "Toast",
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Toaster />
      <Button variant="soft" tone="neutral" onClick={() => toast("Event created", { description: "Monday at 9:00" })}>
        Default
      </Button>
      <Button variant="soft" tone="success" onClick={() => toast.success("Profile saved")}>
        Success
      </Button>
      <Button variant="soft" tone="warning" onClick={() => toast.warning("Storage almost full")}>
        Warning
      </Button>
      <Button variant="soft" tone="danger" onClick={() => toast.error("Payment failed")}>
        Error
      </Button>
      <Button
        variant="soft"
        onClick={() =>
          toast("File deleted", { action: { label: "Undo", onClick: () => toast.success("Restored") } })
        }
      >
        With action
      </Button>
      <Button
        variant="soft"
        onClick={() =>
          toast.promise(new Promise((resolve) => setTimeout(resolve, 1500)), {
            loading: "Uploading…",
            success: "Upload complete",
            error: "Upload failed",
          })
        }
      >
        Promise
      </Button>
    </div>
  ),
};

const frameworks = [
  { value: "next", label: "Next.js", icon: <InfoIcon /> },
  { value: "vite", label: "Vite", keywords: ["bundler"] },
  { value: "router", label: "React Router" },
  { value: "astro", label: "Astro" },
  { value: "laravel", label: "Laravel (soon)", disabled: true },
];

export const ComboboxStory: Story = {
  name: "Combobox",
  render: () => {
    const [value, setValue] = React.useState("");
    return (
      <div className="grid w-64 gap-4">
        <Field label="Framework" hint={value ? `Selected: ${value}` : "Type to search."}>
          <Combobox options={frameworks} value={value} onValueChange={setValue} clearable placeholder="Choose one" />
        </Field>
        <Field label="With an error" error="Pick a framework.">
          <Combobox options={frameworks} />
        </Field>
        <Combobox options={frameworks} defaultValue="vite" disabled aria-label="Disabled" />
      </div>
    );
  },
};

export const InputOTPStory: Story = {
  name: "Input OTP",
  render: () => {
    const [code, setCode] = React.useState("");
    return (
      <div className="grid gap-5">
        <Field label="Verification code" hint={code.length === 6 ? "Complete." : "Enter the 6-digit code."}>
          <InputOTP groupSize={3} value={code} onChange={setCode} />
        </Field>
        <Field label="PIN" error="That PIN is not correct.">
          <InputOTP length={4} defaultValue="12" />
        </Field>
        <InputOTP length={4} disabled aria-label="Disabled" />
      </div>
    );
  },
};
