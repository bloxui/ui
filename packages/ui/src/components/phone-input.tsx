"use client";

import * as React from "react";
import { cn } from "../lib/cn";
import { useFieldControl } from "../lib/field-context";
import { CheckIcon, ChevronDownIcon } from "../lib/icons";
import { Command, CommandEmpty, CommandInput, CommandItem, CommandList } from "./command";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";

export interface PhoneCountry {
  /** ISO 3166 code, e.g. "IN". */
  code: string;
  name: string;
  /** Calling code without "+", e.g. "91". */
  dialCode: string;
  /** Digit groups for display, e.g. [5, 5] → "98765 43210". */
  pattern?: number[];
}

/** A starting list; pass your own `countries` to add or reorder. */
export const defaultCountries: PhoneCountry[] = [
  { code: "IN", name: "India", dialCode: "91", pattern: [5, 5] },
  { code: "US", name: "United States", dialCode: "1", pattern: [3, 3, 4] },
  { code: "GB", name: "United Kingdom", dialCode: "44", pattern: [4, 6] },
  { code: "CA", name: "Canada", dialCode: "1", pattern: [3, 3, 4] },
  { code: "AU", name: "Australia", dialCode: "61", pattern: [3, 3, 3] },
  { code: "AE", name: "United Arab Emirates", dialCode: "971", pattern: [2, 3, 4] },
  { code: "SG", name: "Singapore", dialCode: "65", pattern: [4, 4] },
  { code: "DE", name: "Germany", dialCode: "49", pattern: [3, 4, 4] },
  { code: "FR", name: "France", dialCode: "33", pattern: [1, 2, 2, 2, 2] },
  { code: "JP", name: "Japan", dialCode: "81", pattern: [2, 4, 4] },
  { code: "BR", name: "Brazil", dialCode: "55", pattern: [2, 5, 4] },
  { code: "ZA", name: "South Africa", dialCode: "27", pattern: [2, 3, 4] },
  { code: "NP", name: "Nepal", dialCode: "977", pattern: [3, 7] },
  { code: "BD", name: "Bangladesh", dialCode: "880", pattern: [4, 6] },
  { code: "PK", name: "Pakistan", dialCode: "92", pattern: [3, 7] },
  { code: "LK", name: "Sri Lanka", dialCode: "94", pattern: [2, 3, 4] },
];

/** "IN" → 🇮🇳, built from regional indicator letters so no images are needed. */
export function countryFlag(code: string) {
  return code.toUpperCase().replace(/[A-Z]/g, (letter) => String.fromCodePoint(127397 + letter.charCodeAt(0)));
}

/** Groups digits by a pattern; extra digits go in a final group. */
export function formatPhone(digits: string, pattern?: number[]) {
  if (!pattern) return digits;
  const groups: string[] = [];
  let rest = digits;
  for (const size of pattern) {
    if (!rest) break;
    groups.push(rest.slice(0, size));
    rest = rest.slice(size);
  }
  if (rest) groups.push(rest);
  return groups.join(" ");
}

/** Splits "+919876543210" into a country and national digits, preferring `preferred` on shared codes. */
export function parsePhone(value: string, countries: PhoneCountry[], preferred?: string) {
  const digits = value.replace(/\D/g, "");
  const matches = countries
    .filter((country) => digits.startsWith(country.dialCode))
    .sort((a, b) => b.dialCode.length - a.dialCode.length || Number(b.code === preferred) - Number(a.code === preferred));
  const country = matches[0];
  return country ? { country, national: digits.slice(country.dialCode.length) } : null;
}

export interface PhoneInputProps {
  /** Full number in E.164 form, e.g. "+919876543210", or "" when empty. */
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  countries?: PhoneCountry[];
  /** Country selected when the value is empty. */
  defaultCountry?: string;
  placeholder?: string;
  invalid?: boolean;
  disabled?: boolean;
  /** Submits the E.164 value under this name. */
  name?: string;
  id?: string;
  className?: string;
  "aria-label"?: string;
  "aria-describedby"?: string;
}

/** A phone field with a searchable country picker. Its value is always one E.164 string. */
export function PhoneInput({
  value: valueProp,
  defaultValue = "",
  onValueChange,
  countries = defaultCountries,
  defaultCountry = "IN",
  placeholder,
  invalid,
  disabled,
  name,
  id,
  className,
  "aria-label": ariaLabel = "Phone number",
  "aria-describedby": describedBy,
}: PhoneInputProps) {
  const control = useFieldControl({ id, invalid, "aria-describedby": describedBy });
  const fallback = countries.find((country) => country.code === defaultCountry) ?? countries[0]!;
  const [internal, setInternal] = React.useState(defaultValue);
  const value = valueProp ?? internal;
  const [countryCode, setCountryCode] = React.useState(() => parsePhone(value, countries, defaultCountry)?.country.code ?? fallback.code);
  const [open, setOpen] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const country = countries.find((item) => item.code === countryCode) ?? fallback;
  const parsed = parsePhone(value, countries, countryCode);
  const national = parsed && parsed.country.dialCode === country.dialCode ? parsed.national : "";

  function emit(nextCountry: PhoneCountry, digits: string) {
    const next = digits ? `+${nextCountry.dialCode}${digits}` : "";
    if (valueProp === undefined) setInternal(next);
    onValueChange?.(next);
  }

  return (
    <div
      data-slot="phone-input"
      data-invalid={control.invalid ? "" : undefined}
      className={cn(
        "flex h-9 w-full items-stretch overflow-hidden rounded-lg border border-border-strong bg-surface text-sm text-fg shadow-xs",
        "transition-[border-color,box-shadow] duration-150 focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/25",
        "data-[invalid]:border-danger has-[input:disabled]:cursor-not-allowed has-[input:disabled]:bg-sunken has-[input:disabled]:opacity-60",
        className,
      )}
    >
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            disabled={disabled}
            aria-label={`Country: ${country.name} +${country.dialCode}`}
            className="flex shrink-0 items-center gap-1.5 border-r border-border px-2.5 outline-none hover:bg-neutral-soft focus-visible:bg-neutral-soft"
          >
            <span aria-hidden className="text-base leading-none">
              {countryFlag(country.code)}
            </span>
            <span className="text-muted tabular-nums">+{country.dialCode}</span>
            <ChevronDownIcon className="size-3.5 text-muted" />
          </button>
        </PopoverTrigger>
        <PopoverContent align="start" className="w-72 p-0">
          <Command>
            <CommandInput placeholder="Search country" />
            <CommandList>
              <CommandEmpty>No country found.</CommandEmpty>
              {countries.map((item) => (
                <CommandItem
                  key={item.code}
                  value={`${item.name} ${item.code} +${item.dialCode}`}
                  onSelect={() => {
                    setCountryCode(item.code);
                    setOpen(false);
                    emit(item, national);
                    inputRef.current?.focus();
                  }}
                >
                  <span aria-hidden className="text-base leading-none">
                    {countryFlag(item.code)}
                  </span>
                  <span className="flex-1 truncate">{item.name}</span>
                  <span className="text-xs text-muted tabular-nums">+{item.dialCode}</span>
                  <CheckIcon className={cn("text-brand-text", item.code === country.code ? "opacity-100" : "opacity-0")} />
                </CommandItem>
              ))}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      <input
        ref={inputRef}
        type="tel"
        inputMode="tel"
        autoComplete="tel-national"
        id={control.id}
        aria-label={ariaLabel}
        aria-describedby={control["aria-describedby"]}
        aria-invalid={control.invalid || undefined}
        disabled={disabled}
        placeholder={placeholder ?? formatPhone("98765432101234".slice(0, (country.pattern ?? [10]).reduce((a, b) => a + b, 0)), country.pattern)}
        value={formatPhone(national, country.pattern)}
        onChange={(event) => {
          let digits = event.target.value.replace(/\D/g, "");
          // A pasted full number with its country code: pick that country.
          if (event.target.value.trim().startsWith("+")) {
            const pasted = parsePhone(digits, countries, country.code);
            if (pasted) {
              setCountryCode(pasted.country.code);
              emit(pasted.country, pasted.national.slice(0, 15));
              return;
            }
          }
          digits = digits.slice(0, 15);
          emit(country, digits);
        }}
        className="h-full min-w-0 flex-1 bg-transparent px-3 tabular-nums outline-none placeholder:text-muted/50 disabled:cursor-not-allowed"
      />
      {name ? <input type="hidden" name={name} value={value} /> : null}
    </div>
  );
}
