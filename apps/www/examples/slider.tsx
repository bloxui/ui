"use client";

import * as React from "react";
import { Slider } from "@blox-ui/ui";

export default function SliderExample() {
  const [price, setPrice] = React.useState([20, 70]);
  return (
    <div className="grid w-full max-w-xs gap-2">
      <div className="flex justify-between text-sm">
        <span>Price range</span>
        <span className="text-muted tabular-nums">
          {price[0]} – {price[1]}
        </span>
      </div>
      <Slider value={price} onValueChange={setPrice} thumbLabels={["Minimum price", "Maximum price"]} />
    </div>
  );
}
