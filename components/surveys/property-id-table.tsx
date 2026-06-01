import { TableCell, TableHead } from "@/components/ui/table";
import { cn } from "@/lib/utils";

/** Shared Property ID column for survey-scoped tables (ascending list uses same format). */
export function PropertyIdTableHead({ className }: { className?: string }) {
  return <TableHead className={cn("font-mono text-xs whitespace-nowrap", className)}>Property ID</TableHead>;
}

export function PropertyIdTableCell({ propertyId, className }: { propertyId?: string; className?: string }) {
  return (
    <TableCell className={cn("font-mono text-xs whitespace-nowrap", className)}>{propertyId?.trim() || "—"}</TableCell>
  );
}

export function PropertyIdBanner({ propertyId, className }: { propertyId?: string; className?: string }) {
  const id = propertyId?.trim();
  if (!id) return null;
  return (
    <div className={cn("rounded-lg border border-primary/20 bg-primary/5 px-4 py-3", className)}>
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Property ID</p>
      <p className="font-mono text-lg font-semibold tracking-tight text-primary">{id}</p>
      <p className="mt-0.5 text-xs text-muted-foreground">
        ULB (6) – Ward (3) – Parcel (5) – Use code · sorted ascending in lists
      </p>
    </div>
  );
}
