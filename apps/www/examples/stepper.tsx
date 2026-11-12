"use client";

import * as React from "react";
import { Button, Stepper } from "@blox-ui/ui";

const steps = [
  { title: "Account", description: "Email and password" },
  { title: "Profile", description: "Name and photo" },
  { title: "Plan", description: "Choose a plan" },
  { title: "Done" },
];

export default function StepperExample() {
  const [current, setCurrent] = React.useState(1);
  return (
    <div className="grid w-full max-w-2xl gap-8">
      <Stepper steps={steps} current={current} onStepClick={setCurrent} />
      <div className="flex justify-center gap-2">
        <Button variant="outline" tone="neutral" disabled={current === 0} onClick={() => setCurrent(current - 1)}>
          Back
        </Button>
        <Button disabled={current === steps.length - 1} onClick={() => setCurrent(current + 1)}>
          Continue
        </Button>
      </div>
    </div>
  );
}
