"use client";

import { ErrorPageBlock } from "@blox-ui/ui/blocks/error-page";
import "./globals.css";

/** Last resort when the root layout itself fails, so it renders its own <html>. */
export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="en">
      <body>
        <ErrorPageBlock status={500} error={error} reset={reset} />
      </body>
    </html>
  );
}
