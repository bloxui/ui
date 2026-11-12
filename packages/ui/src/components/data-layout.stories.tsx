import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Bar, BarChart, CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import { CalendarIcon, InfoIcon, SearchIcon, UserIcon } from "../lib/icons";
import { Badge } from "./badge";
import { Button } from "./button";
import { Calendar } from "./calendar";
import { Carousel, CarouselContent, CarouselDots, CarouselItem, CarouselNext, CarouselPrevious } from "./carousel";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "./chart";
import { DataTable, type DataTableColumn } from "./data-table";
import { DatePicker, DateRangePicker, type DateRange } from "./date-picker";
import { Field } from "./field";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "./navigation-menu";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "./resizable";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "./sidebar";

const meta = { title: "Components/Data and layout" } satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const CalendarStory: Story = {
  name: "Calendar",
  render: () => {
    const [date, setDate] = React.useState<Date | undefined>(new Date(2026, 0, 15));
    const [range, setRange] = React.useState<DateRange | undefined>({
      from: new Date(2026, 0, 8),
      to: new Date(2026, 0, 14),
    });
    return (
      <div className="flex flex-wrap items-start gap-6">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          defaultMonth={new Date(2026, 0, 1)}
          className="rounded-lg border border-border"
        />
        <Calendar
          mode="range"
          selected={range}
          onSelect={setRange}
          defaultMonth={new Date(2026, 0, 1)}
          disabled={{ dayOfWeek: [0] }}
          className="rounded-lg border border-border"
        />
      </div>
    );
  },
};

export const DatePickerStory: Story = {
  name: "Date Picker",
  render: () => {
    const [date, setDate] = React.useState<Date | null>(null);
    return (
      <div className="grid w-72 gap-5">
        <Field label="Start date" hint={date ? date.toDateString() : "No date chosen."}>
          <DatePicker value={date} onChange={(next) => setDate(next ?? null)} clearable />
        </Field>
        <Field label="Trip dates">
          <DateRangePicker defaultValue={{ from: new Date(2026, 0, 8), to: new Date(2026, 0, 14) }} clearable />
        </Field>
        <Field label="With limits" error="Pick a day between the 10th and the 20th.">
          <DatePicker
            defaultValue={new Date(2026, 0, 15)}
            min={new Date(2026, 0, 10)}
            max={new Date(2026, 0, 20)}
          />
        </Field>
        <DatePicker disabled aria-label="Disabled" />
      </div>
    );
  },
};

interface Invoice {
  id: string;
  customer: string;
  status: "Paid" | "Pending" | "Overdue";
  amount: number;
  due: Date;
}

const customers = ["Acme Inc.", "Globex", "Initech", "Umbrella", "Hooli", "Stark Industries", "Wayne Corp"];
const statuses = ["Paid", "Pending", "Overdue"] as const;

const invoices: Invoice[] = Array.from({ length: 23 }, (_, index) => ({
  id: `INV-${String(index + 1).padStart(3, "0")}`,
  customer: customers[index % customers.length]!,
  status: statuses[index % statuses.length]!,
  amount: 120 + ((index * 137) % 900),
  due: new Date(2026, 0, 1 + ((index * 5) % 28)),
}));

const statusTone = { Paid: "success", Pending: "warning", Overdue: "danger" } as const;

const invoiceColumns: DataTableColumn<Invoice>[] = [
  { id: "id", header: "Invoice", accessor: (row) => row.id, sortable: true, className: "font-medium" },
  { id: "customer", header: "Customer", accessor: (row) => row.customer, sortable: true },
  {
    id: "status",
    header: "Status",
    accessor: (row) => row.status,
    sortable: true,
    cell: (row) => (
      <Badge tone={statusTone[row.status]} dot>
        {row.status}
      </Badge>
    ),
  },
  {
    id: "due",
    header: "Due",
    accessor: (row) => row.due,
    sortable: true,
    cell: (row) => row.due.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
  },
  {
    id: "amount",
    header: "Amount",
    accessor: (row) => row.amount,
    sortable: true,
    numeric: true,
    cell: (row) => `$${row.amount.toFixed(2)}`,
  },
];

export const DataTableStory: Story = {
  name: "Data Table",
  render: () => {
    const [selected, setSelected] = React.useState<string[]>([]);
    return (
      <div className="w-[44rem] max-w-full">
        <DataTable
          aria-label="Invoices"
          columns={invoiceColumns}
          data={invoices}
          getRowId={(row) => row.id}
          searchable
          searchPlaceholder="Search invoices"
          pageSize={6}
          selectable
          selectedIds={selected}
          onSelectedIdsChange={setSelected}
          defaultSort={{ id: "due", direction: "asc" }}
          toolbar={
            selected.length > 0 ? (
              <Button size="sm" variant="soft" tone="danger" onClick={() => setSelected([])}>
                Clear selection
              </Button>
            ) : null
          }
        />
      </div>
    );
  },
};

export const SidebarStory: Story = {
  name: "Sidebar",
  parameters: { layout: "fullscreen" },
  render: () => (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex h-9 items-center gap-2 px-2.5 text-sm font-semibold">
            <span className="flex size-6 shrink-0 items-center justify-center rounded-md bg-brand text-xs text-brand-fg">
              B
            </span>
            <span className="group-data-[collapsed]/sidebar:sr-only">Blox UI</span>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup label="Workspace">
            <SidebarMenu>
              <SidebarMenuItem icon={<SearchIcon />} href="#" active>
                Overview
              </SidebarMenuItem>
              <SidebarMenuItem icon={<CalendarIcon />} href="#" badge={<Badge size="sm">3</Badge>}>
                Schedule
              </SidebarMenuItem>
              <SidebarMenuItem icon={<InfoIcon />} href="#">
                Reports
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>
          <SidebarGroup label="Account">
            <SidebarMenu>
              <SidebarMenuItem icon={<UserIcon />}>Profile</SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem icon={<UserIcon />}>Ada Lovelace</SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="flex h-14 items-center gap-3 border-b border-border px-4">
          <SidebarTrigger />
          <span className="text-sm font-medium">Overview</span>
        </header>
        <div className="p-6 text-sm text-muted">
          Press Ctrl+B (⌘B on macOS) or the button to collapse. Narrow the window to see the mobile sheet.
        </div>
      </SidebarInset>
    </SidebarProvider>
  ),
};

export const NavigationMenuStory: Story = {
  name: "Navigation Menu",
  render: () => (
    <div className="h-64">
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Components</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid w-[26rem] max-w-[calc(100vw-2rem)] grid-cols-2 gap-1">
                {[
                  ["Button", "Triggers an action."],
                  ["Dialog", "A window over the page."],
                  ["Data Table", "Sort, search and select rows."],
                  ["Chart", "Themed Recharts wrapper."],
                ].map(([title, description]) => (
                  <li key={title}>
                    <NavigationMenuLink href="#" title={title} description={description} />
                  </li>
                ))}
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Resources</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid w-56 gap-1">
                <li>
                  <NavigationMenuLink href="#" title="Changelog" description="What shipped." />
                </li>
                <li>
                  <NavigationMenuLink href="#" title="GitHub" description="Source and issues." />
                </li>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink href="#" active>
              Docs
            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  ),
};

export const CarouselStory: Story = {
  name: "Carousel",
  render: () => (
    <div className="grid w-80 gap-8">
      <Carousel aria-label="Featured">
        <CarouselContent>
          {Array.from({ length: 5 }, (_, index) => (
            <CarouselItem key={index}>
              <div className="flex aspect-video items-center justify-center rounded-lg bg-sunken text-3xl font-semibold">
                {index + 1}
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
        <CarouselDots />
      </Carousel>
      <Carousel aria-label="Three per view" opts={{ align: "start", loop: true }}>
        <CarouselContent>
          {Array.from({ length: 8 }, (_, index) => (
            <CarouselItem key={index} className="basis-1/3">
              <div className="flex aspect-square items-center justify-center rounded-lg bg-sunken font-semibold">
                {index + 1}
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselDots />
      </Carousel>
    </div>
  ),
};

export const ResizableStory: Story = {
  name: "Resizable",
  render: () => (
    <div className="h-64 w-[32rem] max-w-full overflow-hidden rounded-lg border border-border">
      <ResizablePanelGroup>
        <ResizablePanel defaultSize={30} minSize={20}>
          <div className="flex h-full items-center justify-center text-sm text-muted">Sidebar</div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={70}>
          <ResizablePanelGroup orientation="vertical">
            <ResizablePanel defaultSize={60} minSize={25}>
              <div className="flex h-full items-center justify-center text-sm text-muted">Editor</div>
            </ResizablePanel>
            <ResizableHandle />
            <ResizablePanel defaultSize={40} minSize={20}>
              <div className="flex h-full items-center justify-center text-sm text-muted">Terminal</div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  ),
};

const visits = [
  { month: "Jan", desktop: 1860, mobile: 800 },
  { month: "Feb", desktop: 3050, mobile: 2000 },
  { month: "Mar", desktop: 2370, mobile: 1200 },
  { month: "Apr", desktop: 730, mobile: 1900 },
  { month: "May", desktop: 2090, mobile: 1300 },
  { month: "Jun", desktop: 2140, mobile: 1400 },
];

const visitsConfig = {
  desktop: { label: "Desktop" },
  mobile: { label: "Mobile" },
} satisfies ChartConfig;

export const ChartBar: Story = {
  name: "Chart — bar",
  render: () => (
    <figure className="w-[32rem] max-w-full">
      <figcaption className="pb-3 text-sm font-medium">Visits by device, January to June</figcaption>
      <ChartContainer config={visitsConfig}>
        <BarChart data={visits} accessibilityLayer barGap={2}>
          <CartesianGrid vertical={false} />
          <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
          <YAxis tickLine={false} axisLine={false} width={40} />
          <ChartTooltip content={<ChartTooltipContent />} />
          <ChartLegend content={<ChartLegendContent />} />
          <Bar dataKey="desktop" fill="var(--color-desktop)" radius={[4, 4, 0, 0]} maxBarSize={24} />
          <Bar dataKey="mobile" fill="var(--color-mobile)" radius={[4, 4, 0, 0]} maxBarSize={24} />
        </BarChart>
      </ChartContainer>
    </figure>
  ),
};

export const ChartLine: Story = {
  name: "Chart — line",
  render: () => (
    <figure className="w-[32rem] max-w-full">
      <figcaption className="pb-3 text-sm font-medium">Visits by device, January to June</figcaption>
      <ChartContainer config={visitsConfig}>
        <LineChart data={visits} accessibilityLayer margin={{ left: 4, right: 12 }}>
          <CartesianGrid vertical={false} />
          <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
          <YAxis tickLine={false} axisLine={false} width={40} />
          <ChartTooltip content={<ChartTooltipContent />} />
          <ChartLegend content={<ChartLegendContent />} />
          <Line dataKey="desktop" stroke="var(--color-desktop)" strokeWidth={2} dot={false} />
          <Line dataKey="mobile" stroke="var(--color-mobile)" strokeWidth={2} dot={false} />
        </LineChart>
      </ChartContainer>
    </figure>
  ),
};
