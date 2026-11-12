import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { statusMessages } from "@blox-ui/ui";
import { ErrorPageBlock } from "@blox-ui/ui/blocks/error-page";

interface PageProps {
  params: Promise<{ code: string }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return Object.keys(statusMessages).map((code) => ({ code }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { code } = await params;
  const message = statusMessages[Number(code)];
  return message ? { title: `${code} ${message.title}`, robots: { index: false } } : {};
}

/**
 * A preview of the error page for one status code. This page itself answers 200;
 * in an app, return the real status from your route handler or middleware.
 */
export default async function StatusPreview({ params }: PageProps) {
  const { code } = await params;
  const status = Number(code);
  if (!statusMessages[status]) notFound();
  return <ErrorPageBlock status={status} supportHref="https://github.com/bloxui/ui/issues" />;
}
