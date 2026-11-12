import { Badge } from "@blox-ui/ui";
import type { PropsTable as PropsTableData } from "@/lib/docs";

/** One table per exported Props type, read from the component source. */
export function PropsTable({ table }: { table: PropsTableData }) {
  return (
    <div className="space-y-3">
      <h3 id={`api-${table.component.toLowerCase()}`} className="scroll-mt-20 font-mono text-sm font-semibold">
        {table.component}
      </h3>
      {table.props.length > 0 ? (
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full min-w-[36rem] border-collapse text-left text-sm">
            <thead className="bg-sunken text-xs text-muted">
              <tr>
                <th scope="col" className="px-4 py-2.5 font-medium">Prop</th>
                <th scope="col" className="px-4 py-2.5 font-medium">Type</th>
                <th scope="col" className="px-4 py-2.5 font-medium">Default</th>
              </tr>
            </thead>
            <tbody>
              {table.props.map((prop) => (
                <tr key={prop.name} className="border-t border-border align-top">
                  <td className="px-4 py-3">
                    <span className="flex flex-wrap items-center gap-1.5">
                      <code className="font-mono text-[0.8125rem] font-medium text-brand-text">{prop.name}</code>
                      {prop.required ? (
                        <Badge size="sm" tone="warning">
                          required
                        </Badge>
                      ) : null}
                    </span>
                    {prop.description ? <p className="mt-1 text-muted">{prop.description}</p> : null}
                  </td>
                  <td className="px-4 py-3">
                    <code className="font-mono text-xs break-words">{prop.type}</code>
                  </td>
                  <td className="px-4 py-3">
                    {prop.defaultValue ? (
                      <code className="font-mono text-xs">{prop.defaultValue}</code>
                    ) : (
                      <span className="text-muted" aria-label="No default">
                        —
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
      {table.extends ? <p className="text-sm text-muted">Also accepts {table.extends}.</p> : null}
    </div>
  );
}
