"use client";

import * as React from "react";
import {
  Alert,
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Checkbox,
  cn,
  Field,
  Input,
  Label,
  Progress,
  Slider,
  Switch,
  Tabs,
  TabsList,
  TabsTrigger,
} from "@blox-ui/ui";
import { CopyButton } from "./copy-button";

const presets = [
  { name: "Indigo", hue: 275, chroma: 0.22 },
  { name: "Blue", hue: 250, chroma: 0.2 },
  { name: "Teal", hue: 185, chroma: 0.13 },
  { name: "Green", hue: 150, chroma: 0.17 },
  { name: "Amber", hue: 65, chroma: 0.17 },
  { name: "Rose", hue: 10, chroma: 0.21 },
  { name: "Violet", hue: 300, chroma: 0.22 },
] as const;

const round = (value: number) => Number(value.toFixed(3));

/** The brand roles for one hue and strength, in both themes. Lightness steps match the default theme. */
export function brandTokens(hue: number, chroma: number) {
  const c = (factor: number) => round(chroma * factor);
  return {
    light: {
      "--bx-brand": `oklch(0.55 ${c(1)} ${hue})`,
      "--bx-brand-hover": `oklch(0.49 ${c(1)} ${hue})`,
      "--bx-brand-fg": "oklch(1 0 0)",
      "--bx-brand-soft": `oklch(0.95 ${c(0.16)} ${hue})`,
      "--bx-brand-text": `oklch(0.45 ${c(0.9)} ${hue})`,
    },
    dark: {
      "--bx-brand": `oklch(0.68 ${c(0.86)} ${hue})`,
      "--bx-brand-hover": `oklch(0.74 ${c(0.77)} ${hue})`,
      "--bx-brand-fg": `oklch(0.15 0.03 ${hue})`,
      "--bx-brand-soft": `oklch(0.3 ${c(0.36)} ${hue})`,
      "--bx-brand-text": `oklch(0.82 ${c(0.55)} ${hue})`,
    },
  };
}

function declarations(tokens: Record<string, string>, indent: string) {
  return Object.entries(tokens)
    .map(([name, value]) => `${indent}${name}: ${value};`)
    .join("\n");
}

export function ThemeCustomizer() {
  const [hue, setHue] = React.useState(275);
  const [chroma, setChroma] = React.useState(0.22);
  const [radius, setRadius] = React.useState(0.625);

  const tokens = brandTokens(hue, chroma);
  const css = `:root {
${declarations(tokens.light, "  ")}
  --bx-radius: ${radius}rem;
}

.dark {
${declarations(tokens.dark, "  ")}
}`;

  // Scoped to the preview, so the rest of the page keeps the default theme.
  const previewCss = `#theme-preview {
${declarations(tokens.light, "  ")}
  --bx-radius: ${radius}rem;
}
.dark #theme-preview {
${declarations(tokens.dark, "  ")}
}`;

  return (
    <div className="space-y-6">
      <style>{previewCss}</style>

      <div className="grid gap-6 rounded-xl border border-border p-5 sm:grid-cols-2">
        <div className="space-y-3 sm:col-span-2">
          <Label>Preset</Label>
          <div className="flex flex-wrap gap-2">
            {presets.map((preset) => {
              const active = preset.hue === hue && preset.chroma === chroma;
              return (
                <button
                  key={preset.name}
                  type="button"
                  aria-pressed={active}
                  onClick={() => {
                    setHue(preset.hue);
                    setChroma(preset.chroma);
                  }}
                  className={cn(
                    "flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    active ? "border-fg font-medium" : "border-border hover:border-border-strong",
                  )}
                >
                  <span
                    aria-hidden
                    className="size-3.5 rounded-full"
                    style={{ backgroundColor: `oklch(0.6 ${preset.chroma} ${preset.hue})` }}
                  />
                  {preset.name}
                </button>
              );
            })}
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="font-medium">Hue</span>
            <span className="text-muted tabular-nums">{hue}°</span>
          </div>
          <Slider value={[hue]} onValueChange={([value]) => setHue(value ?? hue)} min={0} max={360} aria-label="Hue" />
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="font-medium">Strength</span>
            <span className="text-muted tabular-nums">{chroma.toFixed(2)}</span>
          </div>
          <Slider
            value={[chroma]}
            onValueChange={([value]) => setChroma(value ?? chroma)}
            min={0.04}
            max={0.26}
            step={0.01}
            aria-label="Colour strength"
          />
        </div>
        <div className="space-y-2 sm:col-span-2">
          <div className="flex justify-between text-sm">
            <span className="font-medium">Corner radius</span>
            <span className="text-muted tabular-nums">{radius}rem</span>
          </div>
          <Slider
            value={[radius]}
            onValueChange={([value]) => setRadius(value ?? radius)}
            min={0}
            max={1.25}
            step={0.125}
            aria-label="Corner radius"
          />
        </div>
      </div>

      <div id="theme-preview" className="grid gap-4 rounded-xl border border-border bg-sunken p-5 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Create project</CardTitle>
            <CardDescription>Your theme, applied to real components.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <Field label="Name">
              <Input defaultValue="Atlas" />
            </Field>
            <Field label="Public" orientation="horizontal">
              <Switch defaultChecked />
            </Field>
            <div className="flex gap-2">
              <Button>Create</Button>
              <Button variant="soft">Preview</Button>
              <Button variant="ghost" tone="neutral">
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
        <div className="grid content-start gap-4">
          <Tabs defaultValue="all" variant="pills" size="sm">
            <TabsList aria-label="Filter" fullWidth>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="open">Open</TabsTrigger>
              <TabsTrigger value="done">Done</TabsTrigger>
            </TabsList>
          </Tabs>
          <Alert title="Theme applied" role="status">
            Brand colours update in light and dark mode.
          </Alert>
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone="brand">Brand</Badge>
            <Badge tone="brand" variant="solid">
              Solid
            </Badge>
            <Field label="Agree" orientation="horizontal">
              <Checkbox defaultChecked />
            </Field>
          </div>
          <Progress value={64} aria-label="Example progress" />
        </div>
      </div>

      <div className="relative overflow-hidden rounded-lg border border-border bg-sunken">
        <div className="border-b border-border px-4 py-2 font-mono text-xs text-muted">
          Paste after the theme import in your stylesheet
        </div>
        <CopyButton value={css} label="Copy CSS" className="absolute top-1.5 right-2" />
        <pre className="overflow-auto p-4 font-mono text-[0.8125rem] leading-relaxed">{css}</pre>
      </div>
    </div>
  );
}
