import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { blocks } from "@/lib/blocks";

interface PageProps {
  params: Promise<{ name: string }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return Object.keys(blocks).map((name) => ({ name }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { name } = await params;
  const block = blocks[name];
  return block ? { title: `${block.title} block — Blox UI`, description: block.description } : {};
}

/** Renders one block on its own page, full screen, the way it would appear in an app. */
export default async function BlockPage({ params }: PageProps) {
  const { name } = await params;
  const block = blocks[name];
  if (!block) notFound();
  const { Component } = block;
  return <Component />;
}
