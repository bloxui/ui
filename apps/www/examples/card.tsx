import { Button, Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@blox-ui/ui";

export default function CardExample() {
  return (
    <Card variant="raised" className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Project Atlas</CardTitle>
        <CardDescription>Last updated two hours ago.</CardDescription>
      </CardHeader>
      <CardContent className="text-sm">Twelve components shipped, three in review.</CardContent>
      <CardFooter>
        <Button size="sm">Open</Button>
        <Button size="sm" variant="ghost" tone="neutral">Archive</Button>
      </CardFooter>
    </Card>
  );
}
