"use client";

import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";

export function useDashboardCounts() {
  return useQuery(api.masters.dashboardCounts);
}

export function useStatsBreakdown(filters: { districtId?: string; municipalityId?: string; surveyorId?: string } = {}) {
  return useQuery(api.analytics.surveyStatsBreakdown, {
    districtId: filters.districtId as Id<"districts"> | undefined,
    municipalityId: filters.municipalityId as Id<"municipalities"> | undefined,
    surveyorId: filters.surveyorId as Id<"users"> | undefined,
  });
}

/** Additive (analyticsTrends.ts) — daily survey/approval trend. */
export function useDailyTrend(days = 30, filters: { districtId?: string; municipalityId?: string } = {}) {
  return useQuery(api.analyticsTrends.dailyTrend, {
    days,
    districtId: filters.districtId as Id<"districts"> | undefined,
    municipalityId: filters.municipalityId as Id<"municipalities"> | undefined,
  });
}

/** Additive (analyticsTrends.ts) — ward coverage. */
export function useWardCoverage(filters: { districtId?: string; municipalityId?: string } = {}) {
  return useQuery(api.analyticsTrends.wardCoverage, {
    districtId: filters.districtId as Id<"districts"> | undefined,
    municipalityId: filters.municipalityId as Id<"municipalities"> | undefined,
  });
}
