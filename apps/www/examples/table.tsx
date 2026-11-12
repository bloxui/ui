import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@blox-ui/ui";

const invoices = [
  { id: "INV-001", method: "Card", amount: "$250.00" },
  { id: "INV-002", method: "Bank transfer", amount: "$150.00" },
  { id: "INV-003", method: "UPI", amount: "$350.00" },
];

export default function TableExample() {
  return (
    <Table striped containerClassName="w-full max-w-lg">
      <TableCaption>Recent invoices</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Invoice</TableHead>
          <TableHead>Method</TableHead>
          <TableHead numeric>Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {invoices.map((invoice) => (
          <TableRow key={invoice.id}>
            <TableCell className="font-medium">{invoice.id}</TableCell>
            <TableCell>{invoice.method}</TableCell>
            <TableCell numeric>{invoice.amount}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
