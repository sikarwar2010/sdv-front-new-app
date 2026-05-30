/** Audit feed DTOs (audit.list). */
import type { Id } from "@/convex/_generated/dataModel";

export interface AuditEntry {
  _id: Id<"auditLogs">;
  _creationTime: number;
  action: string;
  entity: string;
  entityId: string | null;
  metadata: unknown;
  actor: { _id: Id<"users">; name: string; email: string } | null;
}
