"use client";

import * as React from "react";
import { AlignCenter, AlignLeft, AlignRight, Bold, FolderOpen, Italic, Underline, User } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Badge,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  Button,
  ButtonGroup,
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  Combobox,
  Empty,
  Field,
  InputOTP,
  Pagination,
  ScrollArea,
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  toast,
  Toaster,
  Toggle,
  ToggleGroup,
  ToggleGroupItem,
} from "@blox-ui/ui";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-4">
      <h2 className="text-sm font-semibold tracking-wide text-muted uppercase">{title}</h2>
      {children}
    </section>
  );
}

const faqs = [
  ["What is Blox UI?", "A set of React components you copy into your project and own."],
  ["Is it accessible?", "Yes. Keyboard and screen reader behaviour comes from Radix primitives."],
  ["Can I theme it?", "Override any --bx-* CSS variable to restyle the whole library."],
] as const;

const invoices = [
  ["INV-001", "Paid", "Card", 250],
  ["INV-002", "Pending", "Bank transfer", 150],
  ["INV-003", "Overdue", "Card", 350],
  ["INV-004", "Paid", "UPI", 450],
] as const;

const statusTone = { Paid: "success", Pending: "warning", Overdue: "danger" } as const;

const frameworks = [
  { value: "next", label: "Next.js" },
  { value: "vite", label: "Vite", keywords: ["bundler"] },
  { value: "router", label: "React Router" },
  { value: "astro", label: "Astro" },
  { value: "laravel", label: "Laravel (soon)", disabled: true },
];

export function Week4Demo() {
  const [page, setPage] = React.useState(6);
  const [framework, setFramework] = React.useState("");
  const [code, setCode] = React.useState("");

  return (
    <>
      <Toaster />

      <Section title="Breadcrumb and Tabs">
        <Breadcrumb>
          <BreadcrumbItem>
            <BreadcrumbLink href="#">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <BreadcrumbLink href="#">Components</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <BreadcrumbPage>Tabs</BreadcrumbPage>
          </BreadcrumbItem>
        </Breadcrumb>
        <div className="grid gap-8 sm:grid-cols-2">
          <Tabs defaultValue="account">
            <TabsList aria-label="Settings">
              <TabsTrigger value="account">
                <User /> Account
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
          <Tabs defaultValue="week" variant="pills">
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
        </div>
      </Section>

      <Section title="Accordion and Collapsible">
        <div className="grid gap-8 sm:grid-cols-2">
          <Accordion type="single" collapsible defaultValue="0">
            {faqs.map(([question, answer], index) => (
              <AccordionItem key={question} value={String(index)}>
                <AccordionTrigger>{question}</AccordionTrigger>
                <AccordionContent>{answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
          <div className="space-y-4">
            <Accordion type="multiple" variant="card">
              {faqs.slice(0, 2).map(([question, answer], index) => (
                <AccordionItem key={question} value={String(index)}>
                  <AccordionTrigger>{question}</AccordionTrigger>
                  <AccordionContent>{answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
            <Collapsible>
              <CollapsibleTrigger asChild>
                <Button variant="outline" tone="neutral" size="sm">
                  Show advanced options
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <p className="pt-3 text-sm text-muted">Hidden until asked for, with an animated height.</p>
              </CollapsibleContent>
            </Collapsible>
          </div>
        </div>
      </Section>

      <Section title="Table and Pagination">
        <Table striped>
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
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-muted">Page {page} of 20</p>
          <Pagination page={page} count={20} onPageChange={setPage} />
        </div>
      </Section>

      <Section title="Toggle, Toggle Group, Button Group">
        <div className="flex flex-wrap items-center gap-4">
          <Toggle aria-label="Bold">
            <Bold />
          </Toggle>
          <ToggleGroup type="multiple" variant="outline" aria-label="Formatting">
            <ToggleGroupItem value="bold" aria-label="Bold">
              <Bold />
            </ToggleGroupItem>
            <ToggleGroupItem value="italic" aria-label="Italic">
              <Italic />
            </ToggleGroupItem>
            <ToggleGroupItem value="underline" aria-label="Underline">
              <Underline />
            </ToggleGroupItem>
          </ToggleGroup>
          <ToggleGroup type="single" defaultValue="left" aria-label="Alignment">
            <ToggleGroupItem value="left" aria-label="Align left">
              <AlignLeft />
            </ToggleGroupItem>
            <ToggleGroupItem value="center" aria-label="Align center">
              <AlignCenter />
            </ToggleGroupItem>
            <ToggleGroupItem value="right" aria-label="Align right">
              <AlignRight />
            </ToggleGroupItem>
          </ToggleGroup>
          <ButtonGroup aria-label="History">
            <Button variant="outline" tone="neutral">
              Undo
            </Button>
            <Button variant="outline" tone="neutral">
              Redo
            </Button>
          </ButtonGroup>
        </div>
      </Section>

      <Section title="Combobox and Input OTP">
        <div className="grid gap-6 sm:grid-cols-2">
          <Field label="Framework" hint={framework ? `Selected: ${framework}` : "Type to search."}>
            <Combobox
              options={frameworks}
              value={framework}
              onValueChange={setFramework}
              clearable
              placeholder="Choose one"
            />
          </Field>
          <Field label="Verification code" hint={code.length === 6 ? "Complete." : "Enter the 6-digit code."}>
            <InputOTP groupSize={3} value={code} onChange={setCode} />
          </Field>
        </div>
      </Section>

      <Section title="Toast, Scroll Area, Empty">
        <div className="flex flex-wrap gap-2">
          <Button
            variant="soft"
            tone="neutral"
            onClick={() => toast("Event created", { description: "Monday at 9:00" })}
          >
            Default toast
          </Button>
          <Button variant="soft" tone="success" onClick={() => toast.success("Profile saved")}>
            Success
          </Button>
          <Button variant="soft" tone="danger" onClick={() => toast.error("Payment failed")}>
            Error
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
        <div className="grid gap-6 sm:grid-cols-2">
          <ScrollArea className="h-56 rounded-lg border border-border">
            <div className="p-4 text-sm">
              {Array.from({ length: 30 }, (_, index) => (
                <p key={index} className="border-b border-border py-2 last:border-0">
                  Release v0.{index + 1}.0
                </p>
              ))}
            </div>
          </ScrollArea>
          <Empty
            icon={<FolderOpen />}
            title="No projects yet"
            description="Projects you create will show up here."
            actions={<Button size="sm">New project</Button>}
          />
        </div>
      </Section>
    </>
  );
}
