"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import type { Id } from "@/convex/_generated/dataModel";
import { useSetUserAllotments, useUserAllotments } from "@/hooks/rbac/useRbac";
import { useTenantCatalog } from "@/hooks/users/useUsers";
import { parseConvexError } from "@/lib/errors";
import { Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

type DraftRow = {
  id: string;
  scope: "ulb" | "district";
  districtId: string;
  municipalityId: string;
  isActive: boolean;
};

export function UserAllotmentsDialog({
  open,
  onOpenChange,
  user,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  user: { _id: string; name: string; role: string } | null;
}) {
  const catalog = useTenantCatalog();
  const existing = useUserAllotments(open && user ? user._id : undefined);
  const setAllotments = useSetUserAllotments();
  const [rows, setRows] = useState<DraftRow[]>([]);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!existing || !open) return;
    setRows(
      existing.map((a) => ({
        id: a._id,
        scope: a.municipalityId ? "ulb" : "district",
        districtId: a.districtId ?? "",
        municipalityId: a.municipalityId ?? "",
        isActive: a.isActive,
      })),
    );
  }, [existing, open]);

  if (!user) return null;

  function addRow() {
    const firstDistrict = catalog?.[0]?._id ?? "";
    setRows((r) => [
      ...r,
      {
        id: `new-${Date.now()}`,
        scope: "ulb",
        districtId: firstDistrict,
        municipalityId: "",
        isActive: true,
      },
    ]);
  }

  async function save() {
    setBusy(true);
    try {
      const payload = rows
        .filter((r) => (r.scope === "ulb" ? r.municipalityId : r.districtId))
        .map((r) => ({
          isActive: r.isActive,
          municipalityId: r.scope === "ulb" ? (r.municipalityId as Id<"municipalities">) : undefined,
          districtId: r.scope === "district" ? (r.districtId as Id<"districts">) : undefined,
        }));
      await setAllotments({ userId: user._id as Id<"users">, allotments: payload });
      toast.success("Allotments saved — effective on mobile immediately");
      onOpenChange(false);
    } catch (e) {
      toast.error(parseConvexError(e).message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Supervisor / surveyor allotments</DialogTitle>
          <DialogDescription>
            {user.name} · assign multiple districts or ULBs (e.g. Agra MC, Mathura district, Hathras MC). Inactive rows
            keep history but remove access.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          {rows.map((row, idx) => {
            const district = catalog?.find((d) => d._id === row.districtId);
            const ulbs = district?.ulbs ?? [];
            return (
              <div key={row.id} className="flex flex-wrap items-end gap-2 rounded-md border border-border p-3">
                <div className="space-y-1">
                  <Label className="text-xs">Scope</Label>
                  <Select
                    value={row.scope}
                    onValueChange={(v: "ulb" | "district") =>
                      setRows((all) => all.map((r, i) => (i === idx ? { ...r, scope: v, municipalityId: "" } : r)))
                    }
                  >
                    <SelectTrigger className="w-[130px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ulb">ULB (city)</SelectItem>
                      <SelectItem value="district">Whole district</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1 min-w-[140px] flex-1">
                  <Label className="text-xs">District</Label>
                  <Select
                    value={row.districtId}
                    onValueChange={(v) =>
                      setRows((all) => all.map((r, i) => (i === idx ? { ...r, districtId: v, municipalityId: "" } : r)))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="District" />
                    </SelectTrigger>
                    <SelectContent>
                      {catalog?.map((d) => (
                        <SelectItem key={d._id} value={d._id}>
                          {d.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {row.scope === "ulb" ? (
                  <div className="space-y-1 min-w-[180px] flex-1">
                    <Label className="text-xs">Municipality</Label>
                    <Select
                      value={row.municipalityId}
                      onValueChange={(v) =>
                        setRows((all) => all.map((r, i) => (i === idx ? { ...r, municipalityId: v } : r)))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="ULB" />
                      </SelectTrigger>
                      <SelectContent>
                        {ulbs.map((m) => (
                          <SelectItem key={m._id} value={m._id}>
                            {m.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                ) : null}
                <div className="flex items-center gap-2 pb-1">
                  <Switch
                    checked={row.isActive}
                    onCheckedChange={(c) =>
                      setRows((all) => all.map((r, i) => (i === idx ? { ...r, isActive: c } : r)))
                    }
                  />
                  <Badge variant={row.isActive ? "default" : "outline"}>{row.isActive ? "Active" : "Inactive"}</Badge>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => setRows((all) => all.filter((_, i) => i !== idx))}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            );
          })}
          <Button type="button" variant="outline" size="sm" onClick={addRow}>
            <Plus className="mr-1 h-4 w-4" /> Add allotment
          </Button>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={busy}>
            Cancel
          </Button>
          <Button onClick={save} disabled={busy}>
            Save allotments
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
