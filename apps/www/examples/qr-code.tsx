"use client";

import * as React from "react";
import { Field, Input, QRCode } from "@blox-ui/ui";

export default function QRCodeExample() {
  const [value, setValue] = React.useState("https://github.com/bloxui/ui");
  return (
    <div className="grid w-full max-w-xs justify-items-center gap-4">
      <div className="rounded-xl bg-white p-3 text-black shadow-raised">
        <QRCode value={value || " "} size={176} level="M" />
      </div>
      <Field label="Link" className="w-full">
        <Input value={value} onChange={(event) => setValue(event.target.value)} />
      </Field>
    </div>
  );
}
