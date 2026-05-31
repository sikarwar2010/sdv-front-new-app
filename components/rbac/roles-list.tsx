"use client";

import { EmptyState } from "@/components/shared/empty-state";
import { TableSkeleton } from "@/components/shared/loading";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Id } from "@/convex/_generated/dataModel";
import { cn } from "@/lib/utils";
import { Shield, ShieldOff } from "lucide-react";
import { useMemo } from "react";

export type RoleRow = {
  _id: Id<"roles">;
  key: string;
  name: string;
  isSystem: boolean;
  isActive: boolean;
  permissionKeys: string[];
  description?: string;
};

type RolesListProps = {
  roles: RoleRow[] | undefined;
  permissionLabels: Map<string, string>;
  permissionCategories: Map<string, string>;
  onToggleActive: (roleId: Id<"roles">, isActive: boolean) => void;
};

export function RolesList({ roles, permissionLabels, permissionCategories, onToggleActive }: RolesListProps) {
  const sorted = useMemo(
    () =>
      roles
        ? [...roles].sort((a, b) => Number(b.isSystem) - Number(a.isSystem) || a.name.localeCompare(b.name))
        : undefined,
    [roles],
  );

  if (sorted === undefined) {
    return <TableSkeleton rows={4} />;
  }

  if (sorted.length === 0) {
    return (
      <EmptyState
        title="No roles"
        description="Create a custom role or refresh system RBAC to seed defaults."
        icon={Shield}
      />
    );
  }

  return (
    <Accordion type="multiple" defaultValue={sorted.filter((r) => r.isSystem).map((r) => r._id)} className="w-full">
      {sorted.map((role) => {
        const byCategory = new Map<string, string[]>();
        for (const key of role.permissionKeys) {
          const cat = permissionCategories.get(key) ?? "other";
          const list = byCategory.get(cat) ?? [];
          list.push(key);
          byCategory.set(cat, list);
        }
        const categories = [...byCategory.entries()].sort(([a], [b]) => a.localeCompare(b));

        return (
          <AccordionItem key={role._id} value={role._id} className="border-b border-border px-1">
            <AccordionTrigger className="py-4 hover:no-underline">
              <div className="flex flex-1 flex-wrap items-center gap-2 pr-2 text-left">
                <span className="font-semibold">{role.name}</span>
                <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-muted-foreground">
                  {role.key}
                </code>
                {role.isSystem ? (
                  <Badge variant="secondary" className="text-xs">
                    System
                  </Badge>
                ) : null}
                <Badge variant={role.isActive ? "default" : "outline"} className="ml-auto sm:ml-0">
                  {role.isActive ? "Active" : "Inactive"}
                </Badge>
                <Badge variant="outline" className="tabular-nums">
                  {role.permissionKeys.length} permissions
                </Badge>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pb-4">
              {role.description ? <p className="mb-3 text-sm text-muted-foreground">{role.description}</p> : null}
              {categories.length === 0 ? (
                <p className="text-sm text-muted-foreground">No permissions assigned.</p>
              ) : (
                <div className="space-y-3">
                  {categories.map(([category, keys]) => (
                    <div key={category}>
                      <p className="mb-1.5 text-xs font-medium tracking-wide text-muted-foreground uppercase">
                        {category}
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {keys.sort().map((key) => (
                          <Badge key={key} variant="outline" className="font-normal">
                            {permissionLabels.get(key) ?? key}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {!role.isSystem ? (
                <div className="mt-4 flex justify-end border-t border-border pt-3">
                  <Button
                    variant={role.isActive ? "outline" : "default"}
                    size="sm"
                    onClick={() => onToggleActive(role._id, role.isActive)}
                  >
                    {role.isActive ? (
                      <>
                        <ShieldOff className="h-4 w-4" /> Deactivate role
                      </>
                    ) : (
                      <>
                        <Shield className="h-4 w-4" /> Activate role
                      </>
                    )}
                  </Button>
                </div>
              ) : (
                <p className={cn("mt-3 text-xs text-muted-foreground")}>
                  System roles are managed via &quot;Refresh system RBAC&quot; and cannot be deactivated here.
                </p>
              )}
            </AccordionContent>
          </AccordionItem>
        );
      })}
    </Accordion>
  );
}
