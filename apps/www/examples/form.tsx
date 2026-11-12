"use client";

import { useForm } from "react-hook-form";
import { Checkbox, Form, FormField, FormRootError, FormSubmit, Input, Textarea } from "@blox-ui/ui";

interface Values {
  name: string;
  email: string;
  message: string;
  updates: boolean;
}

export default function FormExample() {
  const form = useForm<Values>({ defaultValues: { name: "", email: "", message: "", updates: true } });

  async function onSubmit(values: Values) {
    await new Promise((resolve) => setTimeout(resolve, 800));
    if (values.email.endsWith("@example.com")) {
      form.setError("root", { message: "Example addresses cannot receive replies. Use your real email." });
      return;
    }
    form.reset();
  }

  return (
    <Form form={form} onSubmit={onSubmit} className="w-full max-w-sm">
      <FormRootError />
      <FormField name="name" label="Name" required rules={{ required: "Enter your name." }} render={({ field }) => <Input {...field} />} />
      <FormField
        name="email"
        label="Email"
        required
        rules={{ required: "Enter your email.", pattern: { value: /^\S+@\S+\.\S+$/, message: "Enter a valid email address." } }}
        render={({ field }) => <Input type="email" {...field} />}
      />
      <FormField
        name="message"
        label="Message"
        hint="At least 10 characters."
        rules={{ minLength: { value: 10, message: "Write at least 10 characters." } }}
        render={({ field }) => <Textarea autoResize {...field} />}
      />
      <FormField
        name="updates"
        label="Email me product updates"
        orientation="horizontal"
        render={({ field }) => <Checkbox checked={field.value} onCheckedChange={field.onChange} />}
      />
      <FormSubmit>Send message</FormSubmit>
    </Form>
  );
}
