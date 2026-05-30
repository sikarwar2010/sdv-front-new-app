import { EmptyState } from "@/components/shared/empty-state";
import { TableSkeleton } from "@/components/shared/loading";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { fmtDate } from "@/lib/utils";
import type { AuditEntry } from "@/schema/audit/index";

const ENTITY_TONE: Record<string, any> = {
  survey: "default",
  user: "success",
  qc: "warning",
  qcRemark: "warning",
  storage: "muted",
  masters: "muted",
};

/** Renders an audit feed. Reused by the Audit page and the survey detail
 *  "Audit History" tab. */
export function AuditTable({ rows, compact = false }: { rows?: AuditEntry[]; compact?: boolean }) {
  if (rows === undefined) return <TableSkeleton rows={compact ? 4 : 10} />;
  if (rows.length === 0) return <EmptyState title="No audit entries" />;

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>When</TableHead>
          <TableHead>Action</TableHead>
          {!compact && <TableHead>Entity</TableHead>}
          {!compact && <TableHead>Entity ID</TableHead>}
          <TableHead>Actor</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((a) => (
          <TableRow key={a._id}>
            <TableCell className="whitespace-nowrap text-muted-foreground">{fmtDate(a._creationTime)}</TableCell>
            <TableCell className="font-mono text-xs">{a.action}</TableCell>
            {!compact && (
              <TableCell>
                <Badge variant={ENTITY_TONE[a.entity] ?? "muted"}>{a.entity}</Badge>
              </TableCell>
            )}
            {!compact && (
              <TableCell className="max-w-40 truncate font-mono text-[11px] text-muted-foreground">
                {a.entityId ?? "—"}
              </TableCell>
            )}
            <TableCell>{a.actor?.name ?? "System"}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
