"use client";

import { useState } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { AuditTable } from "@/components/audit/audit-table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RoleGate } from "@/components/shared/role-gate";
import { EmptyState } from "@/components/shared/empty-state";
import { useAuditLog, useAuditFacets } from "@/hooks/audit/useAudit";

const ALL = "__all__";

export default function AuditPage() {
  const [action, setAction] = useState<string | undefined>();
  const facets = useAuditFacets();
  const rows = useAuditLog({ action, limit: 200 });

  return (
    <RoleGate
      capability="audit.view"
      fallback={<EmptyState title="Not permitted" description="The audit log is restricted to administrators." />}
    >
      <div className="space-y-5">
        <PageHeader title="Audit Log" description="Append-only trail of every mutation across the system." />

        <div className="flex items-center gap-3">
          <Select value={action ?? ALL} onValueChange={(v) => setAction(v === ALL ? undefined : v)}>
            <SelectTrigger className="w-64">
              <SelectValue placeholder="Filter by action" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL}>All actions</SelectItem>
              {facets?.map((a) => (
                <SelectItem key={a} value={a}>
                  {a}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">{rows?.length ?? 0} entries</p>
        </div>

        <Card>
          <CardContent className="pt-5">
            <AuditTable rows={rows as any} />
          </CardContent>
        </Card>
      </div>
    </RoleGate>
  );
}
