import { Field, InputOTP } from "@blox-ui/ui";

export default function InputOTPExample() {
  return (
    <Field label="Verification code" hint="Enter the 6-digit code we sent you.">
      <InputOTP groupSize={3} />
    </Field>
  );
}
