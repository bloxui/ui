"use client";

import * as React from "react";
import { Button, ColorPicker, Field } from "@blox-ui/ui";

export default function ColorPickerExample() {
  const [color, setColor] = React.useState("#6366f1");
  return (
    <div className="grid w-full max-w-xs gap-4">
      <Field label="Brand colour">
        <ColorPicker value={color} onValueChange={setColor} />
      </Field>
      <Button style={{ backgroundColor: color }}>Preview</Button>
    </div>
  );
}
