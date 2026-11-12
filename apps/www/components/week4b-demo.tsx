"use client";

import * as React from "react";
import { BarChart3, CalendarDays, Home, Settings, Users } from "lucide-react";
import { Bar, BarChart, CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import {
  Badge,
  Button,
  Calendar,
  Carousel,
  CarouselContent,
  CarouselDots,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  DataTable,
  DatePicker,
  DateRangePicker,
  Field,
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
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
  type ChartConfig,
  type DataTableColumn,
} from "@blox-ui/ui";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-4">
      <h2 className="text-sm font-semibold tracking-wide text-muted uppercase">{title}</h2>
      {children}
    </section>
  );
}

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

export function Week4bDemo() {
  const [date, setDate] = React.useState<Date | undefined>(new Date(2026, 0, 15));
  const [selected, setSelected] = React.useState<string[]>([]);

  return (
    <>
      <Section title="Navigation Menu">
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Components</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[26rem] max-w-[calc(100vw-3rem)] grid-cols-2 gap-1">
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
              <NavigationMenuLink href="#" active>
                Docs
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </Section>

      <Section title="Calendar and Date Picker">
        <div className="flex flex-wrap items-start gap-6">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            defaultMonth={new Date(2026, 0, 1)}
            className="rounded-lg border border-border"
          />
          <div className="grid w-full max-w-xs gap-5">
            <Field label="Start date" hint="Opens a calendar.">
              <DatePicker clearable />
            </Field>
            <Field label="Trip dates">
              <DateRangePicker
                defaultValue={{ from: new Date(2026, 0, 8), to: new Date(2026, 0, 14) }}
                numberOfMonths={1}
                clearable
              />
            </Field>
          </div>
        </div>
      </Section>

      <Section title="Data Table — sort, search, select, paginate">
        <DataTable
          aria-label="Invoices"
          columns={invoiceColumns}
          data={invoices}
          getRowId={(row) => row.id}
          searchable
          searchPlaceholder="Search invoices"
          pageSize={5}
          selectable
          selectedIds={selected}
          onSelectedIdsChange={setSelected}
          toolbar={
            selected.length > 0 ? (
              <Button size="sm" variant="soft" tone="danger" onClick={() => setSelected([])}>
                Clear selection
              </Button>
            ) : null
          }
        />
      </Section>

      <Section title="Chart">
        <div className="grid gap-8 sm:grid-cols-2">
          <figure>
            <figcaption className="pb-3 text-sm font-medium">Visits by device (bar)</figcaption>
            <ChartContainer config={visitsConfig}>
              <BarChart data={visits} accessibilityLayer barGap={2}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
                <YAxis tickLine={false} axisLine={false} width={40} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <ChartLegend content={<ChartLegendContent />} />
                <Bar dataKey="desktop" fill="var(--color-desktop)" radius={[4, 4, 0, 0]} maxBarSize={20} />
                <Bar dataKey="mobile" fill="var(--color-mobile)" radius={[4, 4, 0, 0]} maxBarSize={20} />
              </BarChart>
            </ChartContainer>
          </figure>
          <figure>
            <figcaption className="pb-3 text-sm font-medium">Visits by device (line)</figcaption>
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
        </div>
      </Section>

      <Section title="Carousel and Resizable">
        <div className="grid gap-8 sm:grid-cols-2">
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
          <div className="h-56 overflow-hidden rounded-lg border border-border">
            <ResizablePanelGroup>
              <ResizablePanel defaultSize={35} minSize={20}>
                <div className="flex h-full items-center justify-center text-sm text-muted">Files</div>
              </ResizablePanel>
              <ResizableHandle withHandle />
              <ResizablePanel defaultSize={65}>
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
        </div>
      </Section>

      <Section title="Sidebar — collapse with the button or Ctrl+B">
        <SidebarProvider className="h-96 min-h-0 overflow-hidden rounded-lg border border-border">
          <Sidebar className="h-full">
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
                  <SidebarMenuItem icon={<Home />} active>
                    Overview
                  </SidebarMenuItem>
                  <SidebarMenuItem icon={<CalendarDays />} badge={<Badge size="sm">3</Badge>}>
                    Schedule
                  </SidebarMenuItem>
                  <SidebarMenuItem icon={<BarChart3 />}>Reports</SidebarMenuItem>
                  <SidebarMenuItem icon={<Users />}>Team</SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
              <SidebarMenu>
                <SidebarMenuItem icon={<Settings />}>Settings</SidebarMenuItem>
              </SidebarMenu>
            </SidebarFooter>
          </Sidebar>
          <SidebarInset>
            <header className="flex h-12 shrink-0 items-center gap-3 border-b border-border px-3">
              <SidebarTrigger />
              <span className="text-sm font-medium">Overview</span>
            </header>
            <div className="p-4 text-sm text-muted">
              Collapsed, the sidebar keeps its icons and shows labels as tooltips. On a narrow screen it becomes a
              sheet.
            </div>
          </SidebarInset>
        </SidebarProvider>
      </Section>
    </>
  );
}
