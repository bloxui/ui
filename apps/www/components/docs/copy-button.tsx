"use client";

import * as React from "react";
import { Check, Copy } from "lucide-react";
import { Button, cn } from "@blox-ui/ui";

export function CopyButton({ value, label = "Copy code", className }: { value: string; label?: string; className?: string }) {
  const [copied, setCopied] = React.useState(false);

  React.useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 1600);
    return () => clearTimeout(timer);
  }, [copied]);

  return (
    <Button
      variant="ghost"
      tone="neutral"
      size="xs"
      iconOnly
      aria-label={copied ? "Copied" : label}
      className={cn("bg-surface/80 backdrop-blur-sm", className)}
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(value);
          setCopied(true);
        } catch {
          // Clipboard access can be blocked; the code is still selectable by hand.
        }
      }}
    >
      {copied ? <Check className="text-success-text" /> : <Copy />}
    </Button>
  );
}
