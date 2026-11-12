"use client";

import * as React from "react";
import {
  Alert,
  Avatar,
  AvatarGroup,
  Badge,
  Button,
  Checkbox,
  Field,
  Input,
  Kbd,
  Label,
  Progress,
  RadioGroup,
  RadioGroupItem,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
  Separator,
  Skeleton,
  SkeletonText,
  Slider,
  Switch,
  Textarea,
} from "@blox-ui/ui";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-4">
      <h2 className="text-sm font-semibold tracking-wide text-muted uppercase">{title}</h2>
      {children}
    </section>
  );
}

const tones = ["brand", "neutral", "success", "warning", "danger"] as const;

export function Week2Demo() {
  const [email, setEmail] = React.useState("not-an-email");
  const [items, setItems] = React.useState([true, false, false]);
  const [volume, setVolume] = React.useState([60]);
  const [price, setPrice] = React.useState([20, 70]);
  const [progress, setProgress] = React.useState(35);
  const [showAlert, setShowAlert] = React.useState(true);

  const emailError = /^\S+@\S+\.\S+$/.test(email) ? undefined : "Enter a valid email address.";
  const allChecked = items.every(Boolean);
  const someChecked = items.some(Boolean);

  return (
    <>
      <Section title="Field — label, hint and error wired automatically">
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Email" hint="Try fixing the address." error={emailError} required>
            <Input type="email" value={email} onChange={(event) => setEmail(event.target.value)} />
          </Field>
          <Field label="Framework" hint="Used to pick the right template.">
            <Select defaultValue="next">
              <SelectTrigger>
                <SelectValue placeholder="Choose one" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>React</SelectLabel>
                  <SelectItem value="next">Next.js</SelectItem>
                  <SelectItem value="vite">Vite</SelectItem>
                  <SelectItem value="remix">React Router</SelectItem>
                </SelectGroup>
                <SelectSeparator />
                <SelectGroup>
                  <SelectLabel>Other</SelectLabel>
                  <SelectItem value="astro">Astro</SelectItem>
                  <SelectItem value="laravel" disabled>
                    Laravel (soon)
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </Field>
          <Field label="Bio" hint="Grows as you type." className="sm:col-span-2">
            <Textarea autoResize placeholder="Tell us about yourself" />
          </Field>
        </div>
      </Section>

      <Section title="Checkbox, Radio Group, Switch">
        <div className="grid gap-8 sm:grid-cols-3">
          <div className="space-y-3">
            <Field label="Select all" orientation="horizontal">
              <Checkbox
                checked={allChecked ? true : someChecked ? "indeterminate" : false}
                onCheckedChange={(checked) => setItems(items.map(() => checked === true))}
              />
            </Field>
            <div className="space-y-3 pl-7">
              {["Buttons", "Inputs", "Cards"].map((name, index) => (
                <Field key={name} label={name} orientation="horizontal">
                  <Checkbox
                    checked={items[index]}
                    onCheckedChange={(checked) =>
                      setItems(items.map((item, i) => (i === index ? checked === true : item)))
                    }
                  />
                </Field>
              ))}
            </div>
          </div>

          <RadioGroup defaultValue="pro" aria-label="Plan">
            {[
              ["free", "Free"],
              ["pro", "Pro"],
              ["team", "Team"],
            ].map(([value, label]) => (
              <div key={value} className="flex items-center gap-3">
                <RadioGroupItem value={value!} id={`plan-${value}`} />
                <Label htmlFor={`plan-${value}`}>{label}</Label>
              </div>
            ))}
          </RadioGroup>

          <div className="space-y-4">
            <Field label="Notifications" hint="Email me about updates." orientation="horizontal">
              <Switch defaultChecked />
            </Field>
            <Field label="Small, success tone" orientation="horizontal">
              <Switch size="sm" tone="success" defaultChecked />
            </Field>
            <Field label="Disabled" orientation="horizontal">
              <Switch disabled />
            </Field>
          </div>
        </div>
      </Section>

      <Section title="Slider and Progress">
        <div className="grid gap-8 sm:grid-cols-2">
          <div className="space-y-5">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Volume</span>
                <span className="text-muted tabular-nums">{volume[0]}</span>
              </div>
              <Slider value={volume} onValueChange={setVolume} aria-label="Volume" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Price range</span>
                <span className="text-muted tabular-nums">
                  {price[0]} – {price[1]}
                </span>
              </div>
              <Slider
                tone="success"
                value={price}
                onValueChange={setPrice}
                thumbLabels={["Minimum price", "Maximum price"]}
              />
            </div>
          </div>
          <div className="space-y-4">
            <Progress value={progress} aria-label="Upload progress" />
            <Progress value={progress} tone="success" size="sm" aria-label="Upload progress, small" />
            <Progress tone="neutral" size="lg" aria-label="Loading" />
            <div className="flex gap-2">
              <Button size="sm" variant="soft" onClick={() => setProgress(Math.max(0, progress - 15))}>
                − 15
              </Button>
              <Button size="sm" variant="soft" onClick={() => setProgress(Math.min(100, progress + 15))}>
                + 15
              </Button>
            </div>
          </div>
        </div>
      </Section>

      <Section title="Badge, Avatar, Kbd">
        <div className="flex flex-wrap items-center gap-2">
          {tones.map((tone) => (
            <Badge key={tone} tone={tone}>
              {tone}
            </Badge>
          ))}
          <Badge tone="brand" variant="solid">
            solid
          </Badge>
          <Badge tone="success" variant="outline" dot>
            Active
          </Badge>
          <Badge tone="danger" size="sm" dot>
            Offline
          </Badge>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <Avatar name="Ada Lovelace" size="xs" />
          <Avatar name="Alan Turing" size="sm" status="away" />
          <Avatar name="Grace Hopper" status="online" />
          <Avatar name="Linus Torvalds" size="lg" shape="square" status="busy" />
          <Avatar size="xl" />
          <AvatarGroup max={3}>
            <Avatar name="Ada Lovelace" />
            <Avatar name="Alan Turing" />
            <Avatar name="Grace Hopper" />
            <Avatar name="Linus Torvalds" />
            <Avatar name="Margaret Hamilton" />
          </AvatarGroup>
        </div>
        <p className="flex items-center gap-1.5 text-sm text-muted">
          Press <Kbd>Ctrl</Kbd>
          <Kbd>K</Kbd> to search
        </p>
      </Section>

      <Section title="Alert">
        <div className="grid gap-3">
          {showAlert ? (
            <Alert
              title="New version available"
              onDismiss={() => setShowAlert(false)}
              actions={
                <Button size="xs" variant="outline">
                  Update now
                </Button>
              }
            >
              Blox UI 0.2 adds forms and feedback components.
            </Alert>
          ) : (
            <Button variant="soft" size="sm" className="justify-self-start" onClick={() => setShowAlert(true)}>
              Show the alert again
            </Button>
          )}
          <Alert tone="success" role="status">
            Your changes were saved.
          </Alert>
          <Alert tone="warning" role="status" title="Storage almost full">
            You have used 92% of your space.
          </Alert>
          <Alert tone="danger" role="status" variant="outline" title="Payment failed">
            Check your card details and try again.
          </Alert>
        </div>
      </Section>

      <Section title="Separator and Skeleton">
        <div className="grid gap-8 sm:grid-cols-2">
          <div className="space-y-4">
            <Button fullWidth variant="outline" tone="neutral">
              Continue with email
            </Button>
            <Separator>or</Separator>
            <div className="flex h-5 items-center gap-3 text-sm">
              <span>Docs</span>
              <Separator orientation="vertical" />
              <span>Components</span>
              <Separator orientation="vertical" />
              <span>Themes</span>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Skeleton className="size-10 rounded-full" />
            <div className="flex-1 space-y-3">
              <Skeleton className="h-4 w-32" />
              <SkeletonText />
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
