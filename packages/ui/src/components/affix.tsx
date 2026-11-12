"use client";

import * as React from "react";
import { cn } from "../lib/cn";

export interface AffixProps extends React.ComponentProps<"div"> {
  /** Distance from the top of the viewport (or scroll container) where it sticks. */
  offsetTop?: number;
  /** Called when it starts or stops sticking. */
  onStuckChange?: (stuck: boolean) => void;
}

/**
 * Keeps its content in view once you scroll past it, such as a toolbar or a buy button.
 * Uses CSS sticky positioning; while stuck it gets data-stuck so you can add a shadow.
 */
export function Affix({ offsetTop = 0, onStuckChange, className, style, children, ...props }: AffixProps) {
  const sentinel = React.useRef<HTMLSpanElement>(null);
  const [stuck, setStuck] = React.useState(false);
  const callback = React.useRef(onStuckChange);
  callback.current = onStuckChange;

  React.useEffect(() => {
    const element = sentinel.current;
    if (!element) return;
    // An invisible marker just above the content: once it leaves the top band, the content is stuck.
    const observer = new IntersectionObserver(
      ([entry]) => {
        const next = entry ? !entry.isIntersecting && entry.boundingClientRect.top < offsetTop + 1 : false;
        setStuck(next);
        callback.current?.(next);
      },
      { rootMargin: `-${offsetTop + 1}px 0px 0px 0px`, threshold: 0 },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [offsetTop]);

  return (
    <>
      <span ref={sentinel} aria-hidden className="block h-px" />
      <div
        data-slot="affix"
        data-stuck={stuck ? "" : undefined}
        className={cn("sticky z-30", className)}
        style={{ top: offsetTop, ...style }}
        {...props}
      >
        {children}
      </div>
    </>
  );
}
