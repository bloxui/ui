import { cn } from "@blox-ui/ui";

/**
 * The Blox UI mark: a rounded square with two tiles cut out on the diagonal.
 * The tiles are holes, not white shapes, so the mark works on any background
 * and takes its colour from the surrounding text.
 */
export const brandMarkPath =
  "M24 0h52a24 24 0 0 1 24 24v52a24 24 0 0 1-24 24H24A24 24 0 0 1 0 76V24A24 24 0 0 1 24 0ZM21 21v30h30V21ZM51 51v30h30V51Z";

export function BrandMark({ className, title }: { className?: string; title?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      className={cn("shrink-0", className)}
    >
      <path d={brandMarkPath} fill="currentColor" fillRule="evenodd" />
    </svg>
  );
}
