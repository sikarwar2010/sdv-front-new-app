"use client";

import { PermissionPicker } from "@/components/rbac/permission-picker";
import { RolesList } from "@/components/rbac/roles-list";
import { EmptyState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/shared/page-header";
import { RoleGate } from "@/components/shared/role-gate";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import type { Id } from "@/convex/_generated/dataModel";
import { useCreateRole, usePermissions, useRoles, useSeedRbac, useUpdateRole } from "@/hooks/rbac/useRbac";
import { parseConvexError } from "@/lib/errors";
import { Plus, RefreshCw, Shield } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

export default function RolesPage() {
  const roles = useRoles();
  const permissions = usePermissions();
  const seed = useSeedRbac();
  const createRole = useCreateRole();
  const updateRole = useUpdateRole();

  const [newKey, setNewKey] = useState("");
  const [newName, setNewName] = useState("");
  const [newPerms, setNewPerms] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const [seeding, setSeeding] = useState(false);

  const permissionOptions = useMemo(
    () =>
      (permissions ?? []).map((p) => ({
        key: p.key,
        label: p.label,
        category: p.category,
      })),
    [permissions],
  );

  const permissionLabels = useMemo(
    () => new Map((permissions ?? []).map((p) => [p.key, p.label] as const)),
    [permissions],
  );

  const permissionCategories = useMemo(
    () => new Map((permissions ?? []).map((p) => [p.key, p.category] as const)),
    [permissions],
  );

  const roleCount = roles?.length ?? 0;
  const permCount = permissions?.length ?? 0;

  async function onSeed() {
    setSeeding(true);
    try {
      await seed({});
      toast.success("System roles and permissions refreshed");
    } catch (e) {
      toast.error(parseConvexError(e).message);
    } finally {
      setSeeding(false);
    }
  }

  async function onCreate() {
    setBusy(true);
    try {
      await createRole({ key: newKey, name: newName, permissionKeys: newPerms });
      toast.success("Role created — mobile and web pick it up on next sync");
      setNewKey("");
      setNewName("");
      setNewPerms([]);
    } catch (e) {
      toast.error(parseConvexError(e).message);
    } finally {
      setBusy(false);
    }
  }

  async function toggleRoleActive(roleId: Id<"roles">, isActive: boolean) {
    try {
      await updateRole({ roleId, isActive: !isActive });
      toast.success(isActive ? "Role deactivated" : "Role activated");
    } catch (e) {
      toast.error(parseConvexError(e).message);
    }
  }

  return (
    <RoleGate
      capability="roles.manage"
      fallback={<EmptyState title="Not permitted" description="Only administrators can manage roles." />}
    >
      <div className="space-y-6">
        <PageHeader
          title="Roles & permissions"
          description="Define who can do what on web and mobile. Changes apply after the next capability sync."
          actions={
            <Button variant="outline" size="sm" onClick={onSeed} disabled={seeding}>
              <RefreshCw className={`h-4 w-4 ${seeding ? "animate-spin" : ""}`} />
              Refresh system RBAC
            </Button>
          }
        />

        <div className="grid gap-3 sm:grid-cols-2">
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="flex items-center gap-3 pt-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Shield className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-semibold tabular-nums">{roles === undefined ? "—" : roleCount}</p>
                <p className="text-sm text-muted-foreground">Roles</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-3 pt-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                <Shield className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-2xl font-semibold tabular-nums">{permissions === undefined ? "—" : permCount}</p>
                <p className="text-sm text-muted-foreground">Permission keys</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-5">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Plus className="h-4 w-4" />
                Create custom role
              </CardTitle>
              <CardDescription>
                Use a short slug for the key. Pick permissions below — grouped by module.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
                <div className="space-y-1.5">
                  <Label htmlFor="role-key">Key (slug)</Label>
                  <Input
                    id="role-key"
                    value={newKey}
                    onChange={(e) => setNewKey(e.target.value)}
                    placeholder="qc_lead"
                    autoComplete="off"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="role-name">Display name</Label>
                  <Input
                    id="role-name"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="QC Lead"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Permissions</Label>
                {permissions === undefined ? (
                  <p className="text-sm text-muted-foreground">Loading permissions…</p>
                ) : (
                  <PermissionPicker permissions={permissionOptions} selected={newPerms} onChange={setNewPerms} />
                )}
              </div>

              <Button
                className="w-full sm:w-auto"
                onClick={onCreate}
                disabled={busy || !newKey.trim() || !newName.trim() || newPerms.length === 0}
              >
                {busy ? "Creating…" : "Create role"}
              </Button>
            </CardContent>
          </Card>

          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle className="text-base">Role directory</CardTitle>
              <CardDescription>
                Expand a role to review its permission set. System roles are seeded from the catalog.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RolesList
                roles={roles}
                permissionLabels={permissionLabels}
                permissionCategories={permissionCategories}
                onToggleActive={toggleRoleActive}
              />
            </CardContent>
          </Card>
        </div>

        <Separator />

        <p className="text-center text-xs text-muted-foreground">
          Surveyors and supervisors receive capabilities from their assigned role on the next app session.
        </p>
      </div>
    </RoleGate>
  );
}
