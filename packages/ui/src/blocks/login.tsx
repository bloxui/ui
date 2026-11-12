"use client";

import * as React from "react";
import { Alert } from "../components/alert";
import { Button } from "../components/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/card";
import { Checkbox } from "../components/checkbox";
import { Field } from "../components/field";
import { Input } from "../components/input";
import { Separator } from "../components/separator";

export interface LoginValues {
  email: string;
  password: string;
  remember: boolean;
}

export interface LoginBlockProps {
  /** Called with valid values. Return a promise to show the loading state; throw to show an error. */
  onSubmit?: (values: LoginValues) => void | Promise<void>;
  forgotPasswordHref?: string;
  signUpHref?: string;
}

const emailPattern = /^\S+@\S+\.\S+$/;

const linkClass =
  "rounded-sm font-medium text-brand-text underline-offset-4 outline-none hover:underline focus-visible:ring-2 focus-visible:ring-ring";

/** A sign-in card with validation, a loading state and an error message. */
export function LoginBlock({ onSubmit, forgotPasswordHref = "#", signUpHref = "#" }: LoginBlockProps) {
  const [errors, setErrors] = React.useState<{ email?: string; password?: string }>({});
  const [failure, setFailure] = React.useState<string>();
  const [remember, setRemember] = React.useState(false);
  const [pending, setPending] = React.useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const values: LoginValues = {
      email: String(data.get("email") ?? "").trim(),
      password: String(data.get("password") ?? ""),
      remember,
    };

    const nextErrors: typeof errors = {};
    if (!emailPattern.test(values.email)) nextErrors.email = "Enter a valid email address.";
    if (!values.password) nextErrors.password = "Enter your password.";
    setErrors(nextErrors);
    setFailure(undefined);
    if (Object.keys(nextErrors).length > 0) return;

    setPending(true);
    try {
      await onSubmit?.(values);
    } catch (error) {
      setFailure(error instanceof Error && error.message ? error.message : "Could not sign in. Try again.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="flex min-h-dvh items-center justify-center bg-sunken p-4">
      <Card variant="raised" className="w-full max-w-sm">
        <CardHeader>
          <CardTitle as="h1" className="text-xl">
            Welcome back
          </CardTitle>
          <CardDescription>Sign in to continue to your workspace.</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit} noValidate>
          <CardContent className="grid gap-4">
            {failure ? (
              <Alert tone="danger" title="Sign-in failed">
                {failure}
              </Alert>
            ) : null}
            <Field label="Email" error={errors.email} required>
              <Input name="email" type="email" autoComplete="email" placeholder="you@example.com" />
            </Field>
            <Field label="Password" error={errors.password} required>
              <Input name="password" type="password" autoComplete="current-password" />
            </Field>
            <div className="flex items-center justify-between gap-3">
              <Field label="Remember me" orientation="horizontal">
                <Checkbox checked={remember} onCheckedChange={(checked) => setRemember(checked === true)} />
              </Field>
              <a href={forgotPasswordHref} className={`text-sm ${linkClass}`}>
                Forgot password?
              </a>
            </div>
          </CardContent>
          <CardFooter className="flex-col items-stretch gap-4">
            <Button type="submit" loading={pending} fullWidth>
              Sign in
            </Button>
            <Separator>or</Separator>
            <Button type="button" variant="outline" tone="neutral" fullWidth>
              Continue with SSO
            </Button>
            <p className="text-center text-sm text-muted">
              New here?{" "}
              <a href={signUpHref} className={linkClass}>
                Create an account
              </a>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
