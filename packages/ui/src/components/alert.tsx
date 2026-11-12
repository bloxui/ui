import * as React from "react";
import { cn } from "../lib/cn";
import { CheckCircleIcon, CircleAlertIcon, InfoIcon, TriangleAlertIcon, XIcon } from "../lib/icons";
import { toneClasses, type Tone } from "../lib/tone";

const defaultIcons: Record<Tone, React.ReactNode> = {
  brand: <InfoIcon />,
  neutral: <InfoIcon />,
  success: <CheckCircleIcon />,
  warning: <TriangleAlertIcon />,
  danger: <CircleAlertIcon />,
};

export interface AlertProps extends Omit<React.ComponentProps<"div">, "title"> {
  tone?: Tone;
  variant?: "soft" | "outline";
  title?: React.ReactNode;
  /** Custom icon, or `false` to hide it. Each tone has a default. */
  icon?: React.ReactNode | false;
  /** Buttons or links shown under the text. */
  actions?: React.ReactNode;
  /** Renders a close button that calls this handler. */
  onDismiss?: () => void;
  dismissLabel?: string;
}

/** Children are the description. Danger and warning announce immediately; other tones politely. */
export function Alert({
  className,
  tone = "brand",
  variant = "soft",
  title,
  icon,
  actions,
  onDismiss,
  dismissLabel = "Dismiss",
  role,
  children,
  ...props
}: AlertProps) {
  const iconNode = icon === false ? null : (icon ?? defaultIcons[tone]);
  return (
    <div
      data-slot="alert"
      role={role ?? (tone === "danger" || tone === "warning" ? "alert" : "status")}
      className={cn(
        toneClasses[tone],
        "flex gap-3 rounded-lg border p-4 text-sm text-fg",
        variant === "soft" ? "border-transparent bg-(--t-soft)" : "border-border bg-surface",
        className,
      )}
      {...props}
    >
      {iconNode ? (
        <span className="flex h-5 shrink-0 items-center text-(color:--t-text) [&_svg]:size-[1.125rem]">
          {iconNode}
        </span>
      ) : null}
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        {title ? <div className="leading-5 font-medium">{title}</div> : null}
        {children ? (
          <div className={cn("leading-5", title ? "text-fg/75" : undefined)}>{children}</div>
        ) : null}
        {actions ? <div className="mt-2 flex flex-wrap items-center gap-2">{actions}</div> : null}
      </div>
      {onDismiss ? (
        <button
          type="button"
          aria-label={dismissLabel}
          onClick={onDismiss}
          className="-m-1 flex size-7 shrink-0 items-center justify-center rounded-md text-fg/60 transition-colors outline-none hover:bg-fg/10 hover:text-fg focus-visible:ring-2 focus-visible:ring-ring"
        >
          <XIcon className="size-4" />
        </button>
      ) : null}
    </div>
  );
}
