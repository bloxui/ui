"use client";

import * as React from "react";
import { Calendar } from "@blox-ui/ui";

export default function CalendarExample() {
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  return <Calendar mode="single" selected={date} onSelect={setDate} className="rounded-lg border border-border" />;
}
