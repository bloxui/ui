"use client";

import * as React from "react";
import { Bell, Check, CloudUpload, CreditCard, GitBranch, Mail, MoreHorizontal, Plus, ShieldCheck } from "lucide-react";
import { Bar, BarChart, XAxis, YAxis } from "recharts";
import {
  Avatar,
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  cn,
  DatePicker,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Field,
  Input,
  InputOTP,
  Progress,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Separator,
  Slider,
  Switch,
  Tabs,
  TabsList,
  TabsTrigger,
  toast,
  Toaster,
  ToggleGroup,
  ToggleGroupItem,
  type ChartConfig,
} from "@blox-ui/ui";

/**
 * Real, working examples shown on the home page. Each card is an ordinary
 * composition of library components, the kind of thing you would build with them.
 */

function TeamCard() {
  const [members, setMembers] = React.useState([
    { name: "Ada Lovelace", email: "ada@studio.dev", role: "owner" },
    { name: "Alan Turing", email: "alan@studio.dev", role: "editor" },
    { name: "Grace Hopper", email: "grace@studio.dev", role: "viewer" },
  ]);
  const [email, setEmail] = React.useState("");
  const valid = /^\S+@\S+\.\S+$/.test(email);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Team members</CardTitle>
        <CardDescription>Invite people to collaborate on this project.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <form
          className="flex gap-2"
          onSubmit={(event) => {
            event.preventDefault();
            if (!valid) return;
            const name = email.split("@")[0]!.replace(/^\w/, (letter) => letter.toUpperCase());
            setMembers((current) => [...current, { name, email, role: "viewer" }]);
            setEmail("");
            toast.success(`Invite sent to ${email}`);
          }}
        >
          <Input
            type="email"
            leading={<Mail />}
            placeholder="name@company.com"
            aria-label="Email to invite"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
          <Button type="submit" disabled={!valid}>
            Invite
          </Button>
        </form>
        <ul className="grid gap-3">
          {members.map((member, index) => (
            <li key={member.email} className="flex items-center gap-3">
              <Avatar name={member.name} size="sm" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{member.name}</p>
                <p className="truncate text-xs text-muted">{member.email}</p>
              </div>
              <Select
                value={member.role}
                disabled={member.role === "owner"}
                onValueChange={(role) =>
                  setMembers((current) => current.map((item, i) => (i === index ? { ...item, role } : item)))
                }
              >
                <SelectTrigger size="sm" className="w-24" aria-label={`Role for ${member.name}`}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="owner" disabled>
                    Owner
                  </SelectItem>
                  <SelectItem value="editor">Editor</SelectItem>
                  <SelectItem value="viewer">Viewer</SelectItem>
                </SelectContent>
              </Select>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

const weeks = {
  week: [
    { day: "Mon", minutes: 42 },
    { day: "Tue", minutes: 58 },
    { day: "Wed", minutes: 35 },
    { day: "Thu", minutes: 71 },
    { day: "Fri", minutes: 64 },
    { day: "Sat", minutes: 22 },
    { day: "Sun", minutes: 30 },
  ],
  last: [
    { day: "Mon", minutes: 30 },
    { day: "Tue", minutes: 44 },
    { day: "Wed", minutes: 52 },
    { day: "Thu", minutes: 40 },
    { day: "Fri", minutes: 38 },
    { day: "Sat", minutes: 18 },
    { day: "Sun", minutes: 12 },
  ],
};

const focusConfig = { minutes: { label: "Focus time" } } satisfies ChartConfig;

function FocusCard() {
  const [range, setRange] = React.useState<keyof typeof weeks>("week");
  const data = weeks[range];
  const total = data.reduce((sum, item) => sum + item.minutes, 0);
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1.5">
            <CardTitle>Focus time</CardTitle>
            <CardDescription>Minutes of deep work per day</CardDescription>
          </div>
          <Tabs value={range} onValueChange={(value) => setRange(value as keyof typeof weeks)} variant="pills" size="sm">
            <TabsList aria-label="Week">
              <TabsTrigger value="week">This week</TabsTrigger>
              <TabsTrigger value="last">Last</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        <p className="pt-2 text-3xl font-semibold tracking-tight tabular-nums">
          {Math.floor(total / 60)}h {total % 60}m
        </p>
      </CardHeader>
      <CardContent>
        <ChartContainer config={focusConfig} className="aspect-[2/1]">
          <BarChart data={data} accessibilityLayer>
            <XAxis dataKey="day" tickLine={false} axisLine={false} tickMargin={8} />
            {/* Hidden, but Recharts needs a y-axis to size the bars. */}
            <YAxis hide />
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel valueFormatter={(value) => `${String(value)} min`} />} />
            {/* Masonry columns resize while they balance, which keeps restarting the bar animation. */}
            <Bar dataKey="minutes" fill="var(--color-minutes)" radius={4} maxBarSize={28} isAnimationActive={false} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

function PaymentCard() {
  const [method, setMethod] = React.useState("card");
  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment method</CardTitle>
        <CardDescription>Add a new way to pay for your plan.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <ToggleGroup
          type="single"
          variant="outline"
          value={method}
          onValueChange={(value) => value && setMethod(value)}
          aria-label="Payment method"
          className="grid w-full grid-cols-3"
        >
          <ToggleGroupItem value="card" className="h-16 flex-col gap-1 text-xs">
            <CreditCard />
            Card
          </ToggleGroupItem>
          <ToggleGroupItem value="upi" className="h-16 flex-col gap-1 text-xs">
            <span className="text-sm font-bold">UPI</span>
            Instant
          </ToggleGroupItem>
          <ToggleGroupItem value="bank" className="h-16 flex-col gap-1 text-xs">
            <ShieldCheck />
            Bank
          </ToggleGroupItem>
        </ToggleGroup>
        {method === "card" ? (
          <>
            <Field label="Name on card">
              <Input placeholder="Ada Lovelace" />
            </Field>
            <Field label="Card number">
              <Input inputMode="numeric" placeholder="4242 4242 4242 4242" leading={<CreditCard />} />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Expires">
                <Input placeholder="MM / YY" />
              </Field>
              <Field label="CVC">
                <Input inputMode="numeric" placeholder="123" />
              </Field>
            </div>
          </>
        ) : method === "upi" ? (
          <Field label="UPI ID" hint="We will send a collect request.">
            <Input placeholder="name@bank" />
          </Field>
        ) : (
          <Field label="Account number">
            <Input inputMode="numeric" placeholder="0000 0000 0000" />
          </Field>
        )}
      </CardContent>
      <CardFooter>
        <Button fullWidth onClick={() => toast.success("Payment method saved")}>
          Save payment method
        </Button>
      </CardFooter>
    </Card>
  );
}

function NotificationsCard() {
  const [settings, setSettings] = React.useState({ mentions: true, deploys: true, digest: false });
  const items = [
    { key: "mentions", label: "Mentions", hint: "When someone @mentions you." },
    { key: "deploys", label: "Deploys", hint: "When a deploy succeeds or fails." },
    { key: "digest", label: "Weekly digest", hint: "A summary every Monday." },
  ] as const;
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="size-4 text-muted" /> Notifications
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        {items.map((item) => (
          <Field key={item.key} label={item.label} hint={item.hint} orientation="horizontal">
            <Switch
              checked={settings[item.key]}
              onCheckedChange={(checked) => setSettings((current) => ({ ...current, [item.key]: checked }))}
            />
          </Field>
        ))}
      </CardContent>
    </Card>
  );
}

function StorageCard() {
  const parts = [
    { label: "Images", used: 8.4, tone: "brand" as const },
    { label: "Videos", used: 5.1, tone: "warning" as const },
    { label: "Documents", used: 1.9, tone: "success" as const },
  ];
  const used = parts.reduce((sum, part) => sum + part.used, 0);
  return (
    <Card>
      <CardHeader>
        <CardDescription>Storage</CardDescription>
        <p className="text-3xl font-semibold tracking-tight tabular-nums">
          {used.toFixed(1)} <span className="text-base font-normal text-muted">/ 20 GB</span>
        </p>
      </CardHeader>
      <CardContent className="grid gap-3">
        <Progress value={used} max={20} aria-label="Storage used" />
        <ul className="grid gap-2 text-sm">
          {parts.map((part) => (
            <li key={part.label} className="flex items-center gap-2">
              <Badge tone={part.tone} dot size="sm">
                {part.label}
              </Badge>
              <span className="ml-auto text-muted tabular-nums">{part.used} GB</span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter>
        <Button variant="soft" fullWidth leftIcon={<CloudUpload />}>
          Upgrade storage
        </Button>
      </CardFooter>
    </Card>
  );
}

function DeploysCard() {
  const deploys = [
    { branch: "main", message: "Add the theme builder", status: "Ready", time: "2m ago" },
    { branch: "docs", message: "Write the CLI guide", status: "Building", time: "8m ago" },
    { branch: "fix/select", message: "Close menu on Escape", status: "Failed", time: "1h ago" },
  ];
  const tone = { Ready: "success", Building: "warning", Failed: "danger" } as const;
  return (
    <Card>
      <CardHeader>
        <CardTitle>Deployments</CardTitle>
        <CardDescription>Latest builds for blox-ui.dev</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="grid">
          {deploys.map((deploy, index) => (
            <li key={deploy.branch}>
              {index > 0 ? <Separator className="my-3" /> : null}
              <div className="flex items-center gap-3">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{deploy.message}</p>
                  <p className="flex items-center gap-1 text-xs text-muted">
                    <GitBranch className="size-3" /> {deploy.branch} · {deploy.time}
                  </p>
                </div>
                <Badge tone={tone[deploy.status as keyof typeof tone]} dot size="sm">
                  {deploy.status}
                </Badge>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" tone="neutral" size="xs" iconOnly aria-label={`Actions for ${deploy.branch}`}>
                      <MoreHorizontal />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>View logs</DropdownMenuItem>
                    <DropdownMenuItem>Redeploy</DropdownMenuItem>
                    <DropdownMenuItem tone="danger">Cancel</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

function TwoFactorCard() {
  const [code, setCode] = React.useState("");
  const [verified, setVerified] = React.useState(false);
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShieldCheck className="size-4 text-muted" /> Two-factor authentication
        </CardTitle>
        <CardDescription>Enter the 6-digit code from your authenticator app. Try 123456.</CardDescription>
      </CardHeader>
      <CardContent className="grid justify-items-center gap-3">
        <InputOTP
          groupSize={3}
          aria-label="Verification code"
          value={code}
          invalid={code.length === 6 && !verified}
          onChange={(value) => {
            setCode(value);
            setVerified(false);
          }}
          onComplete={(value) => setVerified(value === "123456")}
        />
        <p role="status" className={cn("h-5 text-sm", verified ? "text-success-text" : "text-danger-text")}>
          {code.length === 6 ? (verified ? "Verified" : "That code is not right") : ""}
        </p>
      </CardContent>
      <CardFooter>
        <Button fullWidth disabled={!verified} leftIcon={verified ? <Check /> : undefined}>
          Turn on
        </Button>
      </CardFooter>
    </Card>
  );
}

function GoalCard() {
  const [amount, setAmount] = React.useState([12000]);
  return (
    <Card>
      <CardHeader>
        <CardTitle>Savings goal</CardTitle>
        <CardDescription>Pick a target and a date; we will pace it for you.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <Field label="Goal name">
          <Input placeholder="New laptop, trip to Goa…" />
        </Field>
        <div className="grid gap-2">
          <div className="flex justify-between text-sm">
            <span className="font-medium">Target</span>
            <span className="tabular-nums">₹{(amount[0] ?? 0).toLocaleString("en-IN")}</span>
          </div>
          <Slider value={amount} onValueChange={setAmount} min={1000} max={50000} step={500} aria-label="Target amount" />
        </div>
        <Field label="Target date">
          <DatePicker placeholder="Pick a date" />
        </Field>
      </CardContent>
      <CardFooter className="gap-2">
        <Button fullWidth leftIcon={<Plus />} onClick={() => toast.success("Goal created")}>
          Create goal
        </Button>
      </CardFooter>
    </Card>
  );
}

/** Masonry grid of the cards above. */
export function ExampleCards() {
  return (
    <>
      <Toaster />
      <div className="columns-1 gap-4 md:columns-2 xl:columns-3 [&>*]:mb-4 [&>*]:break-inside-avoid">
        <TeamCard />
        <FocusCard />
        <NotificationsCard />
        <PaymentCard />
        <StorageCard />
        <DeploysCard />
        <GoalCard />
        <TwoFactorCard />
      </div>
    </>
  );
}
