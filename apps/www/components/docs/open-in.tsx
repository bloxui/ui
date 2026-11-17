"use client";

import * as React from "react";
import sdk from "@stackblitz/sdk";
import { Button, Tooltip, TooltipProvider } from "@blox-ui/ui";

const SITE = "https://bloxui-kit.vercel.app";

// Official brand marks, from Simple Icons (simpleicons.org).
function StackBlitzIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden fill="currentColor">
      <path d="M10.797 14.182H3.635L16.728 0l-3.525 9.818h7.162L7.272 24l3.524-9.818Z" />
    </svg>
  );
}

function V0Icon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden fill="currentColor">
      <path d="M14.066 6.028v2.22h5.729q.075-.001.148.005l-5.853 5.752a2 2 0 0 1-.024-.309V8.247h-2.353v5.45c0 2.322 1.935 4.222 4.258 4.222h5.675v-2.22h-5.675q-.03 0-.059-.003l5.729-5.629q.006.082.006.166v5.465H24v-5.465a4.204 4.204 0 0 0-4.205-4.205zM0 8.245l8.28 9.266c.839.94 2.396.346 2.396-.914V8.245H8.19v5.44l-4.86-5.44Z" />
    </svg>
  );
}

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
