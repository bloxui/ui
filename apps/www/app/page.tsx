import { ArrowRight, Download, Mail, Search, Trash2 } from "lucide-react";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Input,
} from "@blox-ui/ui";
import { ThemeToggle } from "@/components/theme-toggle";
import { Week2Demo } from "@/components/week2-demo";
import { Week3Demo } from "@/components/week3-demo";
import { Week4Demo } from "@/components/week4-demo";
import { Week4bDemo } from "@/components/week4b-demo";

const variants = ["solid", "soft", "outline", "ghost", "link"] as const;
const tones = ["brand", "neutral", "success", "warning", "danger"] as const;
const sizes = ["xs", "sm", "md", "lg"] as const;

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-4">
      <h2 className="text-sm font-semibold tracking-wide text-muted uppercase">{title}</h2>
      {children}
    </section>
  );
}

export default function Page() {
  return (
    <main className="mx-auto max-w-4xl space-y-14 px-4 py-12 sm:px-6">
      <header className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Blox UI</h1>
          <p className="text-muted">Tokens, buttons, forms, feedback, overlays, navigation and data components.</p>
        </div>
        <ThemeToggle />
      </header>

      <Section title="Button — tone × variant">
        <div className="overflow-x-auto">
          <div className="grid w-max grid-cols-[auto_repeat(5,auto)] items-center gap-x-4 gap-y-3">
            {tones.map((tone) => (
              <div key={tone} className="contents">
                <span className="pr-2 text-sm text-muted">{tone}</span>
                {variants.map((variant) => (
                  <Button key={variant} tone={tone} variant={variant}>
                    {variant}
                  </Button>
                ))}
              </div>
            ))}
          </div>
        </div>
      </Section>

      <Section title="Button — sizes, icons, states">
        <div className="flex flex-wrap items-center gap-3">
          {sizes.map((size) => (
            <Button key={size} size={size}>
              Size {size}
            </Button>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Button leftIcon={<Download />}>Download</Button>
          <Button variant="soft" rightIcon={<ArrowRight />}>
            Continue
          </Button>
          <Button tone="danger" variant="outline" iconOnly aria-label="Delete">
            <Trash2 />
          </Button>
          <Button loading>Saving</Button>
          <Button variant="soft" tone="neutral" disabled>
            Disabled
          </Button>
          <Button asChild variant="link">
            <a href="https://www.npmjs.com/package/blox-ui">Rendered as a link</a>
          </Button>
        </div>
      </Section>

      <Section title="Input">
        <div className="grid gap-4 sm:grid-cols-2">
          <Input placeholder="Plain input" aria-label="Plain input" />
          <Input leading={<Search />} placeholder="Search components" aria-label="Search" />
          <Input
            type="email"
            leading={<Mail />}
            defaultValue="not-an-email"
            invalid
            aria-label="Email"
          />
          <Input
            leading={<span className="text-sm">https://</span>}
            trailing={<span className="text-sm">.com</span>}
            placeholder="your-site"
            aria-label="Website"
          />
          <Input size="sm" placeholder="Small" aria-label="Small input" />
          <Input size="lg" placeholder="Large" aria-label="Large input" />
          <Input disabled placeholder="Disabled" aria-label="Disabled input" />
        </div>
      </Section>

      <Section title="Card">
        <div className="grid gap-4 sm:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Outline</CardTitle>
              <CardDescription>The default, quiet container.</CardDescription>
            </CardHeader>
            <CardContent className="text-sm">Use it for most grouped content.</CardContent>
          </Card>
          <Card variant="raised">
            <CardHeader>
              <CardTitle>Raised</CardTitle>
              <CardDescription>Lifts off the page with a shadow.</CardDescription>
            </CardHeader>
            <CardContent className="text-sm">Good for popovers and highlights.</CardContent>
          </Card>
          <Card variant="sunken" interactive tabIndex={0}>
            <CardHeader>
              <CardTitle>Sunken + interactive</CardTitle>
              <CardDescription>Hover or focus me.</CardDescription>
            </CardHeader>
            <CardContent className="text-sm">For clickable tiles.</CardContent>
          </Card>
        </div>

        <Card variant="raised" className="max-w-sm">
          <CardHeader>
            <CardTitle as="h2">Join the waitlist</CardTitle>
            <CardDescription>All three components working together.</CardDescription>
          </CardHeader>
          <CardContent>
            <Input type="email" leading={<Mail />} placeholder="you@example.com" aria-label="Email" />
          </CardContent>
          <CardFooter>
            <Button fullWidth rightIcon={<ArrowRight />}>
              Notify me
            </Button>
          </CardFooter>
        </Card>
      </Section>
      <Week2Demo />
      <Week3Demo />
      <Week4Demo />
      <Week4bDemo />
    </main>
  );
}
