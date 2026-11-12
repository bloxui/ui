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
import { Section } from "@/components/demo-section";

const variants = ["solid", "soft", "outline", "ghost", "link"] as const;
const tones = ["brand", "neutral", "success", "warning", "danger"] as const;
const sizes = ["xs", "sm", "md", "lg"] as const;

export function BasicsDemo() {
  return (
    <>
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
    </>
  );
}
