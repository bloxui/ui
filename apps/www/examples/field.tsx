"use client";

import * as React from "react";
import { Field, Input } from "@blox-ui/ui";

export default function FieldExample() {
  const [email, setEmail] = React.useState("not-an-email");
  const error = /^\S+@\S+\.\S+$/.test(email) ? undefined : "Enter a valid email address.";
  return (
    <Field label="Email" hint="We never share it." error={error} required className="w-full max-w-xs">
      <Input type="email" value={email} onChange={(event) => setEmail(event.target.value)} />
    </Field>
  );
}
