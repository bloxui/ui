"use client";

import * as React from "react";
import { Button } from "../components/button";
import { Result } from "../components/result";

export interface NotFoundBlockProps {
  homeHref?: string;
  /** Useful pages to offer instead, e.g. docs, pricing, support. */
  links?: { href: string; label: string }[];
}

/** A 404 page: what happened, a way back, and a few useful places to go instead. */
export function NotFoundBlock({ homeHref = "/", links = [] }: NotFoundBlockProps) {
  return (
    <main className="flex min-h-dvh items-center justify-center p-4">
      <Result
        status={404}
        headingLevel={1}
        actions={
          <>
            <Button asChild>
              <a href={homeHref}>Go home</a>
            </Button>
            <Button variant="outline" tone="neutral" onClick={() => window.history.back()}>
              Go back
            </Button>
          </>
        }
      >
        {links.length > 0 ? (
          <nav aria-label="Popular pages" className="grid gap-2 pt-2 text-sm">
            <p className="text-muted">Or try one of these:</p>
            <ul className="flex flex-wrap justify-center gap-x-4 gap-y-1">
              {links.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="rounded-sm font-medium text-brand-text underline-offset-4 outline-none hover:underline focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        ) : null}
      </Result>
    </main>
  );
}
