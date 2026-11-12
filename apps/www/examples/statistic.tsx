import { Card, CardContent, Statistic } from "@blox-ui/ui";

export default function StatisticExample() {
  return (
    <div className="grid w-full max-w-2xl gap-4 sm:grid-cols-3">
      <Card padding="sm">
        <CardContent className="pt-(--card-pad)">
          <Statistic label="Revenue" value={482900} formatOptions={{ style: "currency", currency: "INR", maximumFractionDigits: 0 }} locale="en-IN" change={12.4} changeLabel="vs last month" animate />
        </CardContent>
      </Card>
      <Card padding="sm">
        <CardContent className="pt-(--card-pad)">
          <Statistic label="Active users" value={18420} formatOptions={{ notation: "compact" }} change={4.1} changeLabel="this week" />
        </CardContent>
      </Card>
      <Card padding="sm">
        <CardContent className="pt-(--card-pad)">
          <Statistic label="Churn" value={2.3} suffix="%" change={0.4} riseIsGood={false} changeLabel="vs last month" />
        </CardContent>
      </Card>
    </div>
  );
}
