"use client";

import * as React from "react";
import { Button } from "../components/button";
import { Result } from "../components/result";

export interface ErrorPageBlockProps {
  /** HTTP status to show. 500 when it is an unexpected crash. */
  status?: number;
  /** The caught error. Its message is not shown (it may leak internals); its digest is, for support. */
  error?: Error & { digest?: string };
  /** Retry the failed render, e.g. the `reset` Next.js passes to error.tsx. */
  reset?: () => void;
  homeHref?: string;
  supportHref?: string;
}

/** An error page for any status code: an explanation, a retry when it makes sense, and a reference for support. */
export function ErrorPageBlock({ status = 500, error, reset, homeHref = "/", supportHref }: ErrorPageBlockProps) {
  // Retrying helps with server and network errors, not with missing or forbidden pages.
  const retryable = status >= 500 || status === 408 || status === 429;
  return (
    <main className="flex min-h-dvh items-center justify-center p-4">
      <Result
        status={status}
        headingLevel={1}
        actions={
          <>
            {retryable ? (
              <Button onClick={() => (reset ? reset() : window.location.reload())}>Try again</Button>
            ) : status === 401 ? (
              <Button asChild>
                <a href="/login">Sign in</a>
              </Button>
            ) : null}
            <Button asChild variant={retryable || status === 401 ? "outline" : "solid"} tone={retryable || status === 401 ? "neutral" : "brand"}>
              <a href={homeHref}>Go home</a>
            </Button>
            {supportHref ? (
              <Button asChild variant="ghost" tone="neutral">
                <a href={supportHref}>Contact support</a>
              </Button>
            ) : null}
          </>
        }
      >
        {error?.digest ? (
          <p className="text-xs text-muted">
            Reference: <code className="rounded bg-sunken px-1.5 py-0.5 font-mono">{error.digest}</code>
          </p>
        ) : null}
      </Result>
    </main>
  );
}
