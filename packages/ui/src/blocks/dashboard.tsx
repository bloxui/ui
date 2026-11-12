"use client";

import * as React from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { Avatar } from "../components/avatar";
import { Badge } from "../components/badge";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage } from "../components/breadcrumb";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "../components/chart";
import { DataTable, type DataTableColumn } from "../components/data-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../components/dropdown-menu";
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
} from "../components/sidebar";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  BarChartIcon,
  CalendarIcon,
  HomeIcon,
  LogOutIcon,
  SlidersIcon,
  UserIcon,
} from "../lib/icons";

interface Stat {
  label: string;
  value: string;
  /** Change against the previous period, in percent. */
  change: number;
  /** Whether a rise is good news for this number (it is not for refunds). */
  riseIsGood: boolean;
}

const stats: Stat[] = [
  { label: "Revenue", value: "$48,290", change: 12.4, riseIsGood: true },
  { label: "Orders", value: "1,284", change: 8.1, riseIsGood: true },
  { label: "New customers", value: "312", change: -3.2, riseIsGood: true },
  { label: "Refunds", value: "$1,120", change: 5.6, riseIsGood: false },
];

const revenue = [
  { month: "Jan", revenue: 31200 },
  { month: "Feb", revenue: 35400 },
  { month: "Mar", revenue: 33800 },
  { month: "Apr", revenue: 41900 },
  { month: "May", revenue: 44600 },
  { month: "Jun", revenue: 48290 },
];

const revenueConfig = { revenue: { label: "Revenue" } } satisfies ChartConfig;

interface Order {
  id: string;
  customer: string;
  status: "Paid" | "Pending" | "Refunded";
  total: number;
}

const orders: Order[] = [
  { id: "ORD-1042", customer: "Acme Inc.", status: "Paid", total: 1240 },
  { id: "ORD-1041", customer: "Globex", status: "Pending", total: 860 },
  { id: "ORD-1040", customer: "Initech", status: "Paid", total: 2310 },
  { id: "ORD-1039", customer: "Umbrella", status: "Refunded", total: 420 },
  { id: "ORD-1038", customer: "Hooli", status: "Paid", total: 1790 },
  { id: "ORD-1037", customer: "Stark Industries", status: "Pending", total: 3120 },
  { id: "ORD-1036", customer: "Wayne Corp", status: "Paid", total: 980 },
];

const statusTone = { Paid: "success", Pending: "warning", Refunded: "neutral" } as const;

const currency = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

const orderColumns: DataTableColumn<Order>[] = [
  { id: "id", header: "Order", accessor: (order) => order.id, sortable: true, className: "font-medium" },
  { id: "customer", header: "Customer", accessor: (order) => order.customer, sortable: true },
  {
    id: "status",
    header: "Status",
    accessor: (order) => order.status,
    sortable: true,
    cell: (order) => (
      <Badge tone={statusTone[order.status]} dot>
        {order.status}
      </Badge>
    ),
  },
  {
    id: "total",
    header: "Total",
    accessor: (order) => order.total,
    sortable: true,
    numeric: true,
    cell: (order) => currency.format(order.total),
  },
];

function StatCard({ label, value, change, riseIsGood }: Stat) {
  const rose = change >= 0;
  const good = rose === riseIsGood;
  const Arrow = rose ? ArrowUpIcon : ArrowDownIcon;
  return (
    <Card padding="sm">
      <CardHeader>
        <CardDescription>{label}</CardDescription>
        <p className="text-2xl font-semibold tracking-tight tabular-nums">{value}</p>
        {/* The arrow and the wording carry the meaning; colour only reinforces it. */}
        <p className={`flex items-center gap-1 text-xs font-medium ${good ? "text-success-text" : "text-danger-text"}`}>
          <Arrow className="size-3.5" />
          <span className="tabular-nums">{Math.abs(change)}%</span>
          <span className="font-normal text-muted">{rose ? "up" : "down"} from last month</span>
        </p>
      </CardHeader>
    </Card>
  );
}

export interface DashboardBlockProps {
  userName?: string;
  userEmail?: string;
  onSignOut?: () => void;
}

/** An app shell with a collapsible sidebar, stat cards, a revenue chart and a sortable orders table. */
export function DashboardBlock({
  userName = "Ada Lovelace",
  userEmail = "ada@example.com",
  onSignOut,
}: DashboardBlockProps) {
  return (
    <SidebarProvider>
      <Sidebar label="Main navigation">
        <SidebarHeader>
          <div className="flex h-9 items-center gap-2 px-2.5 text-sm font-semibold">
            <span className="flex size-6 shrink-0 items-center justify-center rounded-md bg-brand text-xs text-brand-fg">
              B
            </span>
            <span className="group-data-[collapsed]/sidebar:sr-only">Blox Store</span>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup label="Overview">
            <SidebarMenu>
              <SidebarMenuItem icon={<HomeIcon />} href="#" active>
                Dashboard
              </SidebarMenuItem>
              <SidebarMenuItem icon={<BarChartIcon />} href="#">
                Analytics
              </SidebarMenuItem>
              <SidebarMenuItem icon={<CalendarIcon />} href="#" badge={<Badge size="sm">4</Badge>}>
                Orders
              </SidebarMenuItem>
              <SidebarMenuItem icon={<UserIcon />} href="#">
                Customers
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem icon={<SlidersIcon />} href="#">
              Settings
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>

      <SidebarInset>
        <header className="flex h-14 shrink-0 items-center gap-3 border-b border-border px-4">
          <SidebarTrigger />
          <Breadcrumb className="min-w-0 flex-1">
            <BreadcrumbItem className="hidden sm:inline-flex">
              <BreadcrumbLink href="#">Blox Store</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <BreadcrumbPage>Dashboard</BreadcrumbPage>
            </BreadcrumbItem>
          </Breadcrumb>
          <DropdownMenu>
            <DropdownMenuTrigger
              aria-label="Account menu"
              className="rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
            >
              <Avatar name={userName} size="sm" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <span className="block text-sm font-medium text-fg">{userName}</span>
                <span className="block truncate font-normal">{userEmail}</span>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem icon={<UserIcon />}>Profile</DropdownMenuItem>
              <DropdownMenuItem icon={<SlidersIcon />}>Settings</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem tone="danger" icon={<LogOutIcon />} onSelect={onSignOut}>
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>

        <div className="flex flex-col gap-6 p-4 sm:p-6">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-sm text-muted">How the store did this month.</p>
          </div>

          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {stats.map((stat) => (
              <StatCard key={stat.label} {...stat} />
            ))}
          </div>

          <div className="grid gap-6 xl:grid-cols-5">
            <Card className="xl:col-span-2">
              <CardHeader>
                <CardTitle as="h2">Revenue</CardTitle>
                <CardDescription>Monthly revenue, January to June</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={revenueConfig}>
                  <BarChart data={revenue} accessibilityLayer>
                    <CartesianGrid vertical={false} />
                    <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
                    <YAxis
                      tickLine={false}
                      axisLine={false}
                      width={44}
                      tickFormatter={(value: number) => `$${Math.round(value / 1000)}k`}
                    />
                    <ChartTooltip
                      content={<ChartTooltipContent valueFormatter={(value) => currency.format(Number(value))} />}
                    />
                    <Bar dataKey="revenue" fill="var(--color-revenue)" radius={[4, 4, 0, 0]} maxBarSize={28} />
                  </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card className="xl:col-span-3">
              <CardHeader>
                <CardTitle as="h2">Recent orders</CardTitle>
                <CardDescription>Sort by any column or search by customer.</CardDescription>
              </CardHeader>
              <CardContent>
                <DataTable
                  aria-label="Recent orders"
                  columns={orderColumns}
                  data={orders}
                  getRowId={(order) => order.id}
                  searchable
                  searchPlaceholder="Search orders"
                  pageSize={5}
                  dense
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
