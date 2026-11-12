import { Grid } from "@blox-ui/ui";

export default function GridExample() {
  return (
    <Grid columns={{ base: 2, md: 4 }} gap={3} className="w-full max-w-2xl">
      {Array.from({ length: 8 }, (_, index) => (
        <div key={index} className="flex aspect-square items-center justify-center rounded-lg bg-sunken text-sm font-medium text-muted">
          {index + 1}
        </div>
      ))}
    </Grid>
  );
}
