"use client";

import * as React from "react";
import useEmblaCarousel, { type UseEmblaCarouselType } from "embla-carousel-react";
import { cn } from "../lib/cn";
import { ChevronLeftIcon, ChevronRightIcon } from "../lib/icons";
import { Button, type ButtonProps } from "./button";

export type CarouselApi = UseEmblaCarouselType[1];
type CarouselOptions = Parameters<typeof useEmblaCarousel>[0];
type Orientation = "horizontal" | "vertical";

interface CarouselContextValue {
  viewportRef: UseEmblaCarouselType[0];
  api: CarouselApi;
  orientation: Orientation;
  canScrollPrev: boolean;
  canScrollNext: boolean;
  selectedIndex: number;
  snapCount: number;
}

const CarouselContext = React.createContext<CarouselContextValue | null>(null);

/** Read the carousel state from any child, e.g. to build a custom counter. */
export function useCarousel() {
  const context = React.useContext(CarouselContext);
  if (!context) throw new Error("useCarousel must be used inside <Carousel>.");
  return context;
}

export interface CarouselProps extends React.ComponentProps<"div"> {
  orientation?: Orientation;
  /** Embla options, e.g. { loop: true, align: "start" }. */
  opts?: CarouselOptions;
  /** Receive the Embla API to control the carousel from outside. */
  setApi?: (api: CarouselApi) => void;
}

/** A swipeable row (or column) of slides. Arrow keys move between slides when it has focus. */
export function Carousel({
  className,
  orientation = "horizontal",
  opts,
  setApi,
  children,
  onKeyDownCapture,
  "aria-label": ariaLabel = "Carousel",
  ...props
}: CarouselProps) {
  const [viewportRef, api] = useEmblaCarousel({ ...opts, axis: orientation === "horizontal" ? "x" : "y" });
  const [state, setState] = React.useState({
    canScrollPrev: false,
    canScrollNext: false,
    selectedIndex: 0,
    snapCount: 0,
  });

  React.useEffect(() => {
    if (!api) return;
    const update = () =>
      setState({
        canScrollPrev: api.canScrollPrev(),
        canScrollNext: api.canScrollNext(),
        selectedIndex: api.selectedScrollSnap(),
        snapCount: api.scrollSnapList().length,
      });
    update();
    api.on("select", update);
    api.on("reInit", update);
    return () => {
      api.off("select", update);
      api.off("reInit", update);
    };
  }, [api]);

  React.useEffect(() => {
    if (api) setApi?.(api);
  }, [api, setApi]);

  const context = React.useMemo(
    () => ({ viewportRef, api, orientation, ...state }),
    [viewportRef, api, orientation, state],
  );

  const [prevKey, nextKey] = orientation === "horizontal" ? ["ArrowLeft", "ArrowRight"] : ["ArrowUp", "ArrowDown"];

  return (
    <CarouselContext.Provider value={context}>
      <div
        data-slot="carousel"
        role="region"
        aria-roledescription="carousel"
        aria-label={ariaLabel}
        className={cn("relative", className)}
        onKeyDownCapture={(event) => {
          onKeyDownCapture?.(event);
          if (event.key === prevKey) {
            event.preventDefault();
            api?.scrollPrev();
          } else if (event.key === nextKey) {
            event.preventDefault();
            api?.scrollNext();
          }
        }}
        {...props}
      >
        {children}
      </div>
    </CarouselContext.Provider>
  );
}

export function CarouselContent({ className, ...props }: React.ComponentProps<"div">) {
  const { viewportRef, orientation } = useCarousel();
  return (
    <div ref={viewportRef} data-slot="carousel-viewport" className="overflow-hidden">
      <div
        data-slot="carousel-content"
        className={cn("flex", orientation === "horizontal" ? "-ml-4" : "-mt-4 flex-col", className)}
        {...props}
      />
    </div>
  );
}

/** One slide. Set its width with a basis class, e.g. className="basis-1/3" for three per view. */
export function CarouselItem({ className, ...props }: React.ComponentProps<"div">) {
  const { orientation } = useCarousel();
  return (
    <div
      data-slot="carousel-item"
      role="group"
      aria-roledescription="slide"
      className={cn("min-w-0 shrink-0 grow-0 basis-full", orientation === "horizontal" ? "pl-4" : "pt-4", className)}
      {...props}
    />
  );
}

function arrowPosition(orientation: Orientation, direction: "prev" | "next") {
  if (orientation === "horizontal") {
    return cn("top-1/2 -translate-y-1/2", direction === "prev" ? "left-2" : "right-2");
  }
  return cn("left-1/2 -translate-x-1/2 rotate-90", direction === "prev" ? "top-2" : "bottom-2");
}

export function CarouselPrevious({ className, ...props }: ButtonProps) {
  const { api, orientation, canScrollPrev } = useCarousel();
  return (
    <Button
      data-slot="carousel-previous"
      variant="outline"
      tone="neutral"
      size="sm"
      iconOnly
      aria-label="Previous slide"
      disabled={!canScrollPrev}
      onClick={() => api?.scrollPrev()}
      className={cn("absolute rounded-full", arrowPosition(orientation, "prev"), className)}
      {...props}
    >
      <ChevronLeftIcon />
    </Button>
  );
}

export function CarouselNext({ className, ...props }: ButtonProps) {
  const { api, orientation, canScrollNext } = useCarousel();
  return (
    <Button
      data-slot="carousel-next"
      variant="outline"
      tone="neutral"
      size="sm"
      iconOnly
      aria-label="Next slide"
      disabled={!canScrollNext}
      onClick={() => api?.scrollNext()}
      className={cn("absolute rounded-full", arrowPosition(orientation, "next"), className)}
      {...props}
    >
      <ChevronRightIcon />
    </Button>
  );
}

/** One dot per slide position; the current one is highlighted. */
export function CarouselDots({ className, ...props }: React.ComponentProps<"div">) {
  const { api, selectedIndex, snapCount } = useCarousel();
  if (snapCount <= 1) return null;
  return (
    <div data-slot="carousel-dots" className={cn("flex items-center justify-center gap-1.5 pt-3", className)} {...props}>
      {Array.from({ length: snapCount }, (_, index) => (
        <button
          key={index}
          type="button"
          aria-label={`Go to slide ${index + 1}`}
          aria-current={index === selectedIndex ? "true" : undefined}
          onClick={() => api?.scrollTo(index)}
          className={cn(
            "h-2 rounded-full transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-bg",
            index === selectedIndex ? "w-5 bg-brand" : "w-2 bg-border-strong hover:bg-muted",
          )}
        />
      ))}
    </div>
  );
}
