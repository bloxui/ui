/**
 * Tones map the shared token roles onto local `--t-*` variables, so a
 * component writes its styles once (`bg-(--t)`) and works in every tone.
 */
export type Tone = "brand" | "neutral" | "danger" | "success" | "warning";

export const toneClasses: Record<Tone, string> = {
  brand:
    "[--t:var(--bx-brand)] [--t-hover:var(--bx-brand-hover)] [--t-fg:var(--bx-brand-fg)] [--t-soft:var(--bx-brand-soft)] [--t-text:var(--bx-brand-text)]",
  neutral:
    "[--t:var(--bx-neutral)] [--t-hover:var(--bx-neutral-hover)] [--t-fg:var(--bx-neutral-fg)] [--t-soft:var(--bx-neutral-soft)] [--t-text:var(--bx-neutral-text)]",
  danger:
    "[--t:var(--bx-danger)] [--t-hover:var(--bx-danger-hover)] [--t-fg:var(--bx-danger-fg)] [--t-soft:var(--bx-danger-soft)] [--t-text:var(--bx-danger-text)]",
  success:
    "[--t:var(--bx-success)] [--t-hover:var(--bx-success-hover)] [--t-fg:var(--bx-success-fg)] [--t-soft:var(--bx-success-soft)] [--t-text:var(--bx-success-text)]",
  warning:
    "[--t:var(--bx-warning)] [--t-hover:var(--bx-warning-hover)] [--t-fg:var(--bx-warning-fg)] [--t-soft:var(--bx-warning-soft)] [--t-text:var(--bx-warning-text)]",
};
