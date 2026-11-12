import { Label, RadioGroup, RadioGroupItem } from "@blox-ui/ui";

const plans = ["Free", "Pro", "Team"];

export default function RadioGroupExample() {
  return (
    <RadioGroup defaultValue="Pro" aria-label="Plan">
      {plans.map((plan) => (
        <div key={plan} className="flex items-center gap-3">
          <RadioGroupItem value={plan} id={"plan-" + plan} />
          <Label htmlFor={"plan-" + plan}>{plan}</Label>
        </div>
      ))}
    </RadioGroup>
  );
}
