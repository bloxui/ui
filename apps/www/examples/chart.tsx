"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@blox-ui/ui";

const data = [
  { month: "Jan", desktop: 1860, mobile: 800 },
  { month: "Feb", desktop: 3050, mobile: 2000 },
  { month: "Mar", desktop: 2370, mobile: 1200 },
  { month: "Apr", desktop: 730, mobile: 1900 },
  { month: "May", desktop: 2090, mobile: 1300 },
  { month: "Jun", desktop: 2140, mobile: 1400 },
];

const config = { desktop: { label: "Desktop" }, mobile: { label: "Mobile" } } satisfies ChartConfig;

export default function ChartExample() {
  return (
    <figure className="w-full max-w-lg">
      <figcaption className="pb-3 text-sm font-medium">Visits by device, January to June</figcaption>
      <ChartContainer config={config}>
        <BarChart data={data} accessibilityLayer barGap={2}>
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
  );
}
