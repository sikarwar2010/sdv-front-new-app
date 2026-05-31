"use client";

import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";

export function useRoles() {
  return useQuery(api.rbac.listRoles, {});
}

export function usePermissions() {
  return useQuery(api.rbac.listPermissions, {});
}

export function useCreateRole() {
  return useMutation(api.rbac.createRole);
}

export function useUpdateRole() {
  return useMutation(api.rbac.updateRole);
}

export function useSeedRbac() {
  return useMutation(api.rbac.seedSystem);
}

export function useUserAllotments(userId: string | undefined) {
  return useQuery(api.allotments.listForUser, userId ? { userId: userId as Id<"users"> } : "skip");
}

export function useSetUserAllotments() {
  return useMutation(api.allotments.setForUser);
}

export function useToggleAllotment() {
  return useMutation(api.allotments.setActive);
}
