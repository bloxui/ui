import { BasicsDemo } from "@/components/basics-demo";
import { DataDemo } from "@/components/data-demo";
import { FormsDemo } from "@/components/forms-demo";
import { NavigationDemo } from "@/components/navigation-demo";
import { OverlaysDemo } from "@/components/overlays-demo";
import { ThemeToggle } from "@/components/theme-toggle";

export default function Page() {
  return (
    <main className="mx-auto max-w-4xl space-y-14 px-4 py-12 sm:px-6">
      <header className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Blox UI</h1>
          <p className="text-muted">Every component in the library, in light and dark themes.</p>
        </div>
        <ThemeToggle />
      </header>
      <BasicsDemo />
      <FormsDemo />
      <OverlaysDemo />
      <NavigationDemo />
      <DataDemo />
    </main>
  );
}
