"use client";

import * as React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../components/alert-dialog";
import { Avatar } from "../components/avatar";
import { Button } from "../components/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/card";
import { Field } from "../components/field";
import { Input } from "../components/input";
import { Switch } from "../components/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/tabs";
import { Textarea } from "../components/textarea";

export interface SettingsBlockProps {
  defaultName?: string;
  defaultEmail?: string;
  /** Called when the profile form is saved. */
  onSaveProfile?: (values: { name: string; email: string; bio: string }) => void;
  /** Called after the user confirms account deletion. */
  onDeleteAccount?: () => void;
}

const notifications = [
  { id: "product", label: "Product updates", hint: "New components and releases.", defaultOn: true },
  { id: "security", label: "Security alerts", hint: "Sign-ins from new devices.", defaultOn: true },
  { id: "digest", label: "Weekly digest", hint: "A summary of your team's activity.", defaultOn: false },
] as const;

/** An account settings page: profile form, notification switches and a guarded delete action. */
export function SettingsBlock({
  defaultName = "Ada Lovelace",
  defaultEmail = "ada@example.com",
  onSaveProfile,
  onDeleteAccount,
}: SettingsBlockProps) {
  const [name, setName] = React.useState(defaultName);
  const [saved, setSaved] = React.useState(false);
  const nameError = name.trim() ? undefined : "Enter your name.";

  function handleSave(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (nameError) return;
    const data = new FormData(event.currentTarget);
    onSaveProfile?.({
      name: name.trim(),
      email: String(data.get("email") ?? ""),
      bio: String(data.get("bio") ?? ""),
    });
    setSaved(true);
  }

  return (
    <div className="mx-auto w-full max-w-2xl space-y-6 p-4 sm:p-8">
      <header className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-sm text-muted">Manage your profile, notifications and account.</p>
      </header>

      <Tabs defaultValue="profile">
        <TabsList aria-label="Settings sections">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="account">Account</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <form onSubmit={handleSave} noValidate>
              <CardHeader>
                <CardTitle as="h2">Profile</CardTitle>
                <CardDescription>This is how others see you.</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-5">
                <div className="flex items-center gap-4">
                  <Avatar name={name.trim() || undefined} size="lg" />
                  <Button type="button" variant="outline" tone="neutral" size="sm">
                    Change photo
                  </Button>
                </div>
                <Field label="Name" error={nameError} required>
                  <Input
                    name="name"
                    autoComplete="name"
                    value={name}
                    onChange={(event) => {
                      setName(event.target.value);
                      setSaved(false);
                    }}
                  />
                </Field>
                <Field label="Email" hint="Used for sign-in and notifications.">
                  <Input name="email" type="email" autoComplete="email" defaultValue={defaultEmail} />
                </Field>
                <Field label="Bio" hint="A sentence or two about you.">
                  <Textarea name="bio" autoResize />
                </Field>
              </CardContent>
              <CardFooter className="justify-end gap-3">
                <span role="status" className="text-sm text-muted">
                  {saved ? "Saved." : ""}
                </span>
                <Button type="submit">Save changes</Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle as="h2">Notifications</CardTitle>
              <CardDescription>Choose which emails you receive.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-5">
              {notifications.map((item) => (
                <Field key={item.id} label={item.label} hint={item.hint} orientation="horizontal">
                  <Switch defaultChecked={item.defaultOn} />
                </Field>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="account">
          <Card>
            <CardHeader>
              <CardTitle as="h2">Delete account</CardTitle>
              <CardDescription>
                Permanently removes your account and everything in it. This cannot be undone.
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button tone="danger" variant="soft">
                    Delete account
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete your account?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Your profile, projects and settings will be removed for good.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Keep account</AlertDialogCancel>
                    <AlertDialogAction tone="danger" onClick={onDeleteAccount}>
                      Yes, delete it
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
