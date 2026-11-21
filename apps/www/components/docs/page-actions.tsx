"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Check, ChevronDown, Copy } from "lucide-react";
import { Button, ButtonGroup, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, Tooltip, TooltipProvider } from "@blox-ui/ui";
import { ClaudeIcon, MarkdownIcon, OpenAIIcon, V0Icon } from "@/components/docs/brand-icons";

const SITE = "https://bloxui-kit.vercel.app";

type Neighbour = { name: string; title: string } | undefined;

function NeighbourLink({ to, direction }: { to: Neighbour; direction: "previous" | "next" }) {
  const icon = direction === "previous" ? <ArrowLeft /> : <ArrowRight />;
  const label = direction === "previous" ? "Previous" : "Next";
  if (!to) {
    return (
      <Button variant="outline" tone="neutral" size="sm" iconOnly aria-label={label} disabled>
        {icon}
      </Button>
    );
  }
  return (
    <Tooltip content={`${label}: ${to.title}`}>
      <Button asChild variant="outline" tone="neutral" size="sm" iconOnly>
        <Link href={`/docs/components/${to.name}`} aria-label={`${label}: ${to.title}`}>
          {icon}
        </Link>
      </Button>
    </Tooltip>
  );
}

/** "Copy page", a menu that opens the page's Markdown or hands it to v0, ChatGPT or Claude, and previous/next links. */
export function PageActions({ name, previous, next }: { name: string; previous?: Neighbour; next?: Neighbour }) {
  const [copied, setCopied] = React.useState(false);
  const markdownPath = `/docs/components/${name}.md`;
  const prompt = `Read ${SITE}${markdownPath} so I can ask questions about the ${name} component from Blox UI.`;

  React.useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 1600);
    return () => clearTimeout(timer);
  }, [copied]);

  async function copyPage() {
    try {
      const markdown = await fetch(markdownPath).then((response) => response.text());
      await navigator.clipboard.writeText(markdown);
      setCopied(true);
    } catch {
      // Clipboard access can be blocked; "View as Markdown" still works.
    }
  }

  const links = [
    { label: "View as Markdown", icon: <MarkdownIcon />, href: markdownPath },
    {
      label: "Open in v0",
      icon: <V0Icon />,
      href: `https://v0.dev/chat/api/open?url=${encodeURIComponent(`${SITE}/v0/${name}.json`)}`,
    },
    {
      label: "Open in ChatGPT",
      icon: <OpenAIIcon />,
      href: `https://chatgpt.com/?hints=search&q=${encodeURIComponent(prompt)}`,
    },
    {
      label: "Open in Claude",
      icon: <ClaudeIcon />,
      href: `https://claude.ai/new?q=${encodeURIComponent(prompt)}`,
    },
  ];

  return (
    <TooltipProvider>
      <div className="flex items-center gap-2">
        <ButtonGroup>
          <Button variant="outline" tone="neutral" size="sm" leftIcon={copied ? <Check className="text-success-text" /> : <Copy />} onClick={copyPage}>
            {copied ? "Copied" : "Copy page"}
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" tone="neutral" size="sm" iconOnly aria-label="More page actions">
                <ChevronDown />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {links.map((link) => (
                <DropdownMenuItem key={link.label} icon={link.icon} onSelect={() => window.open(link.href, "_blank", "noopener,noreferrer")}>
                  {link.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </ButtonGroup>
        <NeighbourLink to={previous} direction="previous" />
        <NeighbourLink to={next} direction="next" />
      </div>
    </TooltipProvider>
  );
}
