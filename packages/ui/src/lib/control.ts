/** Styles for button-like form triggers (date pickers and other custom fields), matching Input and Select. */

export const fieldTriggerSizes = {
  sm: "h-8 rounded-md px-2.5 text-sm",
  md: "h-9 rounded-lg px-3 text-sm",
  lg: "h-11 rounded-lg px-3.5 text-base",
} as const;

export type FieldTriggerSize = keyof typeof fieldTriggerSizes;

export const fieldTriggerClass =
  "flex w-full items-center gap-2 border border-border-strong bg-surface text-left text-fg shadow-xs transition-[border-color,box-shadow] duration-150 outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/25 disabled:cursor-not-allowed disabled:bg-sunken disabled:opacity-60 aria-invalid:border-danger";
