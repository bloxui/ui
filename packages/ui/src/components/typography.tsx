import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/cn";

/**
 * Text styles that match the components. The size is separate from the heading
 * level, so the page outline stays correct whatever the design calls for.
 */

export const headingVariants = cva("font-semibold tracking-tight text-fg text-balance", {
  variants: {
    size: {
      "4xl": "text-4xl sm:text-5xl font-bold tracking-tighter",
      "3xl": "text-3xl sm:text-4xl font-bold",
      "2xl": "text-2xl sm:text-3xl",
      xl: "text-xl sm:text-2xl",
      lg: "text-lg",
      md: "text-base",
    },
  },
  defaultVariants: { size: "xl" },
});

const defaultSizes = { 1: "3xl", 2: "2xl", 3: "xl", 4: "lg", 5: "md", 6: "md" } as const;

export interface HeadingProps extends React.ComponentProps<"h2">, VariantProps<typeof headingVariants> {
  /** The element: h1 to h6. */
  level?: 1 | 2 | 3 | 4 | 5 | 6;
}

export function Heading({ level = 2, size, className, ...props }: HeadingProps) {
  const Tag = `h${level}` as const;
  return <Tag data-slot="heading" className={cn(headingVariants({ size: size ?? defaultSizes[level] }), className)} {...props} />;
}

export const textVariants = cva("", {
  variants: {
    variant: {
      body: "text-base leading-7 text-fg/90",
      lead: "text-xl leading-8 text-muted text-pretty",
      large: "text-lg font-semibold text-fg",
      small: "text-sm font-medium leading-none",
      muted: "text-sm text-muted",
      caption: "text-xs text-muted",
    },
  },
  defaultVariants: { variant: "body" },
});

export interface TextProps extends React.ComponentProps<"p">, VariantProps<typeof textVariants> {
  /** Render another element, e.g. "span" or "div". */
  as?: "p" | "span" | "div" | "label";
}

export function Text({ variant, as = "p", className, ...props }: TextProps) {
  // The element varies, so the props are applied through createElement.
  return React.createElement(as, { "data-slot": "text", className: cn(textVariants({ variant }), className), ...props });
}

export function InlineCode({ className, ...props }: React.ComponentProps<"code">) {
  return (
    <code
      data-slot="inline-code"
      className={cn("rounded-md border border-border bg-sunken px-1.5 py-0.5 font-mono text-[0.875em]", className)}
      {...props}
    />
  );
}

export function Blockquote({ className, ...props }: React.ComponentProps<"blockquote">) {
  return (
    <blockquote
      data-slot="blockquote"
      className={cn("border-l-2 border-border-strong pl-5 text-fg/80 italic", className)}
      {...props}
    />
  );
}

/** A bulleted or numbered list with comfortable spacing. */
export function TypographyList({ ordered = false, className, ...props }: React.ComponentProps<"ul"> & { ordered?: boolean }) {
  return React.createElement(ordered ? "ol" : "ul", {
    "data-slot": "typography-list",
    className: cn("space-y-2 pl-6 leading-7 marker:text-muted", ordered ? "list-decimal" : "list-disc", className),
    ...props,
  });
}

/**
 * Styles long-form content you do not control, such as rendered Markdown or CMS HTML:
 * headings, paragraphs, lists, links, code, quotes and tables inside it.
 */
export function Prose({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="prose"
      className={cn(
        "max-w-prose text-base leading-7 text-fg/90",
        "[&_h1]:mt-10 [&_h1]:mb-4 [&_h1]:text-3xl [&_h1]:font-bold [&_h1]:tracking-tight [&_h1]:text-fg",
        "[&_h2]:mt-10 [&_h2]:mb-3 [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:tracking-tight [&_h2]:text-fg",
        "[&_h3]:mt-8 [&_h3]:mb-2 [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:text-fg",
        "[&_p]:my-4 [&_ul]:my-4 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:my-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_li]:my-1.5 [&_li]:marker:text-muted",
        "[&_a]:font-medium [&_a]:text-brand-text [&_a]:underline [&_a]:underline-offset-4",
        "[&_code]:rounded-md [&_code]:bg-sunken [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-[0.875em]",
        "[&_pre]:my-5 [&_pre]:overflow-x-auto [&_pre]:rounded-lg [&_pre]:bg-sunken [&_pre]:p-4 [&_pre_code]:bg-transparent [&_pre_code]:p-0",
        "[&_blockquote]:my-5 [&_blockquote]:border-l-2 [&_blockquote]:border-border-strong [&_blockquote]:pl-5 [&_blockquote]:italic",
        "[&_hr]:my-8 [&_hr]:border-border [&_img]:my-6 [&_img]:rounded-lg",
        "[&_table]:my-5 [&_table]:w-full [&_table]:text-sm [&_th]:border-b [&_th]:border-border [&_th]:p-2 [&_th]:text-left [&_td]:border-b [&_td]:border-border [&_td]:p-2",
        "[&>*:first-child]:mt-0",
        className,
      )}
      {...props}
    />
  );
}
