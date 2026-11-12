import { Carousel, CarouselContent, CarouselDots, CarouselItem, CarouselNext, CarouselPrevious } from "@blox-ui/ui";

export default function CarouselExample() {
  return (
    <Carousel aria-label="Featured" className="w-full max-w-xs">
      <CarouselContent>
        {[1, 2, 3, 4, 5].map((slide) => (
          <CarouselItem key={slide}>
            <div className="flex aspect-video items-center justify-center rounded-lg bg-sunken text-3xl font-semibold">
              {slide}
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
      <CarouselDots />
    </Carousel>
  );
}
