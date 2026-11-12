import * as React from "react";
import { cn } from "../lib/cn";
import { CheckCircleIcon, CircleAlertIcon, InfoIcon, TriangleAlertIcon } from "../lib/icons";
import { toneClasses, type Tone } from "../lib/tone";

export type ResultStatus = "success" | "info" | "warning" | "error" | number;

/** Default title and message for common HTTP status codes. */
export const statusMessages: Record<number, { title: string; description: string }> = {
  400: { title: "Bad request", description: "The request could not be understood. Check the address or the form and try again." },
  401: { title: "Sign in required", description: "You need to sign in to see this page." },
  403: { title: "Access denied", description: "You do not have permission to see this page. Ask an admin if you think you should." },
  404: { title: "Page not found", description: "The page you are looking for does not exist or has moved." },
  405: { title: "Not allowed", description: "That action is not allowed here." },
  408: { title: "Request timed out", description: "The server took too long to respond. Check your connection and try again." },
  409: { title: "Conflict", description: "Someone else changed this at the same time. Reload to see the latest version." },
  410: { title: "Gone", description: "This page has been removed for good." },
  413: { title: "Too large", description: "What you sent is bigger than the server accepts." },
  418: { title: "I'm a teapot", description: "The server refuses to brew coffee because it is, permanently, a teapot." },
  422: { title: "Could not process", description: "Some of the information is not valid. Check it and try again." },
  429: { title: "Too many requests", description: "You are going a little fast. Wait a moment, then try again." },
  500: { title: "Something went wrong", description: "An unexpected error happened on our side. We have been notified; please try again." },
  501: { title: "Not implemented", description: "The server does not support this yet." },
  502: { title: "Bad gateway", description: "A server we depend on sent a bad response. Try again in a moment." },
  503: { title: "Down for maintenance", description: "We are making some improvements and will be back shortly." },
  504: { title: "Gateway timeout", description: "A server we depend on took too long to answer. Try again in a moment." },
};

function toneFor(status: ResultStatus): Tone {
  if (typeof status === "number") return status >= 500 ? "danger" : status === 404 || status === 410 ? "neutral" : "warning";
  return ({ success: "success", info: "brand", warning: "warning", error: "danger" } as const)[status];
}

const statusIcons = {
  success: <CheckCircleIcon />,
  info: <InfoIcon />,
  warning: <TriangleAlertIcon />,
  error: <CircleAlertIcon />,
};

export interface ResultProps extends Omit<React.ComponentProps<"div">, "title"> {
  /** A state, or an HTTP status code such as 404 or 503. */
  status?: ResultStatus;
  /** Defaults to a sensible title for the status. */
  title?: React.ReactNode;
  description?: React.ReactNode;
  /** Replaces the default icon or status number. */
  icon?: React.ReactNode;
  /** Buttons such as "Go home" or "Try again". */
  actions?: React.ReactNode;
  /** Heading level of the title. Use 1 on a page of its own. */
  headingLevel?: 1 | 2 | 3;
}

/** A full result screen: success after checkout, an empty search, or an error page for any status code. */
export function Result({
  status = "info",
  title,
  description,
  icon,
  actions,
  headingLevel = 2,
  className,
  children,
  ...props
}: ResultProps) {
  const tone = toneFor(status);
  const preset = typeof status === "number" ? statusMessages[status] : undefined;
  const Heading = `h${headingLevel}` as const;

  return (
    <div
      data-slot="result"
      className={cn(toneClasses[tone], "flex flex-col items-center gap-5 px-4 py-12 text-center", className)}
      {...props}
    >
      {icon ? (
        <div className="flex size-16 items-center justify-center rounded-full bg-(--t-soft) text-(color:--t-text) [&_svg]:size-8">{icon}</div>
      ) : typeof status === "number" ? (
        <p aria-hidden className="bg-linear-to-b from-fg to-fg/25 bg-clip-text text-7xl font-bold tracking-tighter text-transparent tabular-nums sm:text-8xl">
          {status}
        </p>
      ) : (
        <div className="flex size-16 items-center justify-center rounded-full bg-(--t-soft) text-(color:--t-text) [&_svg]:size-8">
          {statusIcons[status]}
        </div>
      )}
      <div className="grid max-w-md gap-2">
        <Heading className="text-2xl font-semibold tracking-tight">
          {title ?? preset?.title ?? (typeof status === "number" ? `Error ${status}` : null)}
          {typeof status === "number" ? <span className="sr-only"> (error {status})</span> : null}
        </Heading>
        {(description ?? preset?.description) ? <p className="text-muted">{description ?? preset?.description}</p> : null}
      </div>
      {actions ? <div className="flex flex-wrap items-center justify-center gap-2">{actions}</div> : null}
      {children}
    </div>
  );
}
