"use client";

import * as React from "react";
import { ErrorPageBlock } from "@blox-ui/ui/blocks/error-page";

/** Shown when a page crashes while rendering. `reset` retries just that page. */
export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  React.useEffect(() => {
    // Replace with your error reporting service.
    console.error(error);
  }, [error]);

  return <ErrorPageBlock status={500} error={error} reset={reset} supportHref="https://github.com/bloxui/ui/issues" />;
}
