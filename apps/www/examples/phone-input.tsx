"use client";

import * as React from "react";
import { Field, PhoneInput } from "@blox-ui/ui";

export default function PhoneInputExample() {
  const [phone, setPhone] = React.useState("");
  return (
    <Field label="Phone number" hint={phone ? "Saved as " + phone : "We will text you a code."} className="w-full max-w-xs">
      <PhoneInput value={phone} onValueChange={setPhone} />
    </Field>
  );
}
