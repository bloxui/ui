"use client";

import * as React from "react";
import { Field, Rating } from "@blox-ui/ui";

export default function RatingExample() {
  const [value, setValue] = React.useState(4);
  return (
    <div className="grid gap-6">
      <Field label="How was your order?" hint={value ? value + " of 5" : "Not rated"}>
        <Rating value={value} onValueChange={setValue} clearable labels={["Terrible", "Bad", "OK", "Good", "Great"]} />
      </Field>
      <div className="flex items-center gap-2 text-sm text-muted">
        <Rating readOnly value={4.5} size="sm" aria-label="Average rating" />
        4.5 from 1,284 reviews
      </div>
    </div>
  );
}
