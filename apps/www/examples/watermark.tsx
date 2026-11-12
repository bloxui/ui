import { Watermark } from "@blox-ui/ui";

export default function WatermarkExample() {
  return (
    <Watermark text={["Confidential", "ada@studio.dev"]} className="w-full max-w-md rounded-xl border border-border bg-surface p-6">
      <h3 className="font-semibold">Q3 board report</h3>
      <p className="mt-2 text-sm leading-6 text-muted">
        Revenue grew 18% quarter on quarter, driven by the new team plan. Churn fell to 2.3%. Hiring is on track for the
        mobile team, and the design system shipped 24 new components.
      </p>
    </Watermark>
  );
}
