"use client";

import * as React from "react";
import {
  Controller,
  FormProvider,
  useFormContext,
  type ControllerFieldState,
  type ControllerRenderProps,
  type FieldPath,
  type FieldValues,
  type RegisterOptions,
  type SubmitErrorHandler,
  type SubmitHandler,
  type UseFormReturn,
} from "react-hook-form";
import { cn } from "../lib/cn";
import { Alert } from "./alert";
import { Button, type ButtonProps } from "./button";
import { Field, type FieldProps } from "./field";

export interface FormProps<TValues extends FieldValues>
  extends Omit<React.ComponentProps<"form">, "onSubmit" | "onInvalid"> {
  /** The object returned by react-hook-form's useForm(). */
  form: UseFormReturn<TValues>;
  /** Called with valid values. Return a promise to keep the submit button loading until it settles. */
  onSubmit: SubmitHandler<TValues>;
  onInvalid?: SubmitErrorHandler<TValues>;
}

/**
 * Connects react-hook-form to Blox UI. Validation is up to you: pass `rules` to each
 * FormField, or a schema resolver (zod, valibot…) to useForm.
 */
export function Form<TValues extends FieldValues>({
  form,
  onSubmit,
  onInvalid,
  className,
  children,
  ...props
}: FormProps<TValues>) {
  return (
    <FormProvider {...form}>
      <form
        data-slot="form"
        noValidate
        onSubmit={form.handleSubmit(onSubmit, onInvalid)}
        className={cn("grid gap-5", className)}
        {...props}
      >
        {children}
      </form>
    </FormProvider>
  );
}

export interface FormFieldProps<TValues extends FieldValues, TName extends FieldPath<TValues>>
  extends Omit<FieldProps, "children" | "error"> {
  name: TName;
  rules?: Omit<RegisterOptions<TValues, TName>, "valueAsNumber" | "valueAsDate" | "setValueAs" | "disabled">;
  /**
   * Renders the control. Spread `field` onto inputs; map it for others,
   * e.g. <Checkbox checked={field.value} onCheckedChange={field.onChange} />.
   */
  render: (props: {
    field: ControllerRenderProps<TValues, TName>;
    fieldState: ControllerFieldState;
  }) => React.ReactElement;
}

/**
 * One form field: a Field (label, hint, error, ARIA wiring) around a react-hook-form
 * Controller. The error message comes from validation automatically.
 */
export function FormField<TValues extends FieldValues, TName extends FieldPath<TValues>>({
  name,
  rules,
  render,
  ...fieldProps
}: FormFieldProps<TValues, TName>) {
  const { control } = useFormContext<TValues>();
  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field, fieldState }) => (
        <Field {...fieldProps} error={fieldState.error?.message}>
          {render({ field, fieldState })}
        </Field>
      )}
    />
  );
}

/** A submit button that shows a spinner while the form is submitting. */
export function FormSubmit({ children = "Submit", ...props }: ButtonProps) {
  const { formState } = useFormContext();
  return (
    <Button type="submit" loading={formState.isSubmitting} {...props}>
      {children}
    </Button>
  );
}

/**
 * Shows an error that belongs to the whole form, e.g. from the server. Set it with
 * form.setError("root", { message: "…" }).
 */
export function FormRootError({ title = "Something went wrong", className }: { title?: string; className?: string }) {
  const { formState } = useFormContext();
  const message = formState.errors.root?.message;
  if (!message) return null;
  return (
    <Alert tone="danger" title={title} className={className}>
      {message}
    </Alert>
  );
}
