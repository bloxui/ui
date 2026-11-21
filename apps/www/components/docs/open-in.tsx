"use client";

import * as React from "react";
import sdk from "@stackblitz/sdk";
import { Button, Tooltip, TooltipProvider } from "@blox-ui/ui";
import { StackBlitzIcon, V0Icon } from "@/components/docs/brand-icons";

const SITE = "https://bloxui-kit.vercel.app";

/** Icon buttons that open a component's example outside the docs: in StackBlitz or in v0. */
export function OpenIn({ name, title }: { name: string; title: string }) {
  const [loading, setLoading] = React.useState(false);

  async function openStackBlitz() {
    setLoading(true);
    try {
      const files = (await fetch(`/playground/${name}`).then((response) => response.json())) as Record<string, string>;
      sdk.openProject(
        { title: `${title} - Blox UI`, description: `${title} from Blox UI`, template: "node", files },
        { openFile: "src/example.tsx", newWindow: true },
      );
    } finally {
      setLoading(false);
    }
  }

  // v0 fetches the registry item itself, so it needs the public URL.
  const v0Href = `https://v0.dev/chat/api/open?url=${encodeURIComponent(`${SITE}/v0/${name}.json`)}`;

  return (
    <TooltipProvider>
      <div className="flex items-center gap-1">
        <Tooltip content="Open in StackBlitz">
          <Button variant="ghost" tone="neutral" size="sm" iconOnly aria-label="Open in StackBlitz" loading={loading} onClick={openStackBlitz}>
            <StackBlitzIcon />
          </Button>
        </Tooltip>
        <Tooltip content="Open in v0">
          <Button asChild variant="ghost" tone="neutral" size="sm" iconOnly>
            <a href={v0Href} target="_blank" rel="noopener noreferrer" aria-label="Open in v0 (opens in a new tab)">
              <V0Icon />
            </a>
          </Button>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
}
