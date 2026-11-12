"use client";

import * as React from "react";
import { Button } from "../components/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/card";
import { Checkbox } from "../components/checkbox";
import { Field } from "../components/field";
import { Input } from "../components/input";
import { Progress } from "../components/progress";

export interface SignupValues {
  name: string;
  email: string;
  password: string;
}

export interface SignupBlockProps {
  /** Called with valid values. Return a promise to show the loading state. */
  onSubmit?: (values: SignupValues) => void | Promise<void>;
  signInHref?: string;
  termsHref?: string;
}

const emailPattern = /^\S+@\S+\.\S+$/;

const linkClass =
  "rounded-sm font-medium text-brand-text underline-offset-4 outline-none hover:underline focus-visible:ring-2 focus-visible:ring-ring";

/** Scores a password from 0 to 4: length, mixed case, a digit and a symbol each add one. */
export function passwordStrength(password: string) {
  let score = 0;
  if (password.length >= 8) score += 1;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score += 1;
  if (/\d/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;
  return score;
}

const strengthLabels = ["Too weak", "Weak", "Fair", "Good", "Strong"] as const;
const strengthTones = ["danger", "danger", "warning", "brand", "success"] as const;

type Errors = Partial<Record<"name" | "email" | "password" | "terms", string>>;

/** A sign-up card with validation, a password strength meter and a terms checkbox. */
export function SignupBlock({ onSubmit, signInHref = "#", termsHref = "#" }: SignupBlockProps) {
  const [password, setPassword] = React.useState("");
  const [accepted, setAccepted] = React.useState(false);
  const [errors, setErrors] = React.useState<Errors>({});
  const [pending, setPending] = React.useState(false);
  const strength = passwordStrength(password);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const values: SignupValues = {
      name: String(data.get("name") ?? "").trim(),
      email: String(data.get("email") ?? "").trim(),
      password,
    };

    const nextErrors: Errors = {};
    if (!values.name) nextErrors.name = "Enter your name.";
    if (!emailPattern.test(values.email)) nextErrors.email = "Enter a valid email address.";
    if (password.length < 8) nextErrors.password = "Use at least 8 characters.";
    if (!accepted) nextErrors.terms = "Accept the terms to continue.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setPending(true);
    try {
      await onSubmit?.(values);
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="flex min-h-dvh items-center justify-center bg-sunken p-4">
      <Card variant="raised" className="w-full max-w-sm">
        <CardHeader>
          <CardTitle as="h1" className="text-xl">
            Create your account
          </CardTitle>
          <CardDescription>Start building in under a minute.</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit} noValidate>
          <CardContent className="grid gap-4">
            <Field label="Name" error={errors.name} required>
              <Input name="name" autoComplete="name" placeholder="Ada Lovelace" />
            </Field>
            <Field label="Email" error={errors.email} required>
              <Input name="email" type="email" autoComplete="email" placeholder="you@example.com" />
            </Field>
            <Field
              label="Password"
              error={errors.password}
              hint={password ? `Strength: ${strengthLabels[strength]}` : "At least 8 characters."}
              required
            >
              <Input
                name="password"
                type="password"
                autoComplete="new-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
            </Field>
            {password ? (
              <Progress
                value={strength}
                max={4}
                size="sm"
                tone={strengthTones[strength]}
                aria-label="Password strength"
              />
            ) : null}
            <Field
              label={
                <span>
                  I agree to the{" "}
                  <a href={termsHref} className={linkClass}>
                    terms of service
                  </a>
                </span>
              }
              error={errors.terms}
              orientation="horizontal"
            >
              <Checkbox checked={accepted} onCheckedChange={(checked) => setAccepted(checked === true)} />
            </Field>
          </CardContent>
          <CardFooter className="flex-col items-stretch gap-4">
            <Button type="submit" loading={pending} fullWidth>
              Create account
            </Button>
            <p className="text-center text-sm text-muted">
              Already have an account?{" "}
              <a href={signInHref} className={linkClass}>
                Sign in
              </a>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
