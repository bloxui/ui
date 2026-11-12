import { Badge, DataTable, type DataTableColumn } from "@blox-ui/ui";

interface Invoice {
  id: string;
  customer: string;
  status: "Paid" | "Pending";
  amount: number;
}

const invoices: Invoice[] = [
  { id: "INV-001", customer: "Acme Inc.", status: "Paid", amount: 250 },
  { id: "INV-002", customer: "Globex", status: "Pending", amount: 150 },
  { id: "INV-003", customer: "Initech", status: "Paid", amount: 350 },
  { id: "INV-004", customer: "Umbrella", status: "Pending", amount: 450 },
  { id: "INV-005", customer: "Hooli", status: "Paid", amount: 550 },
];

const columns: DataTableColumn<Invoice>[] = [
  { id: "id", header: "Invoice", accessor: (row) => row.id, sortable: true },
  { id: "customer", header: "Customer", accessor: (row) => row.customer, sortable: true },
  {
    id: "status",
    header: "Status",
    accessor: (row) => row.status,
    cell: (row) => <Badge tone={row.status === "Paid" ? "success" : "warning"} dot>{row.status}</Badge>,
  },
  { id: "amount", header: "Amount", accessor: (row) => row.amount, sortable: true, numeric: true },
];

export default function DataTableExample() {
  return (
    <DataTable
      aria-label="Invoices"
      columns={columns}
      data={invoices}
      getRowId={(row) => row.id}
      searchable
      selectable
      pageSize={4}
      className="w-full"
    />
  );
}
