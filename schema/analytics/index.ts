/** Analytics DTOs (analytics.surveyStatsBreakdown + analyticsTrends + dashboardCounts). */
import type { Id } from "@/convex/_generated/dataModel";

export interface SurveyCounts {
  total: number;
  today: number;
  drafts: number;
  submitted: number;
  approved: number;
  rejected: number;
}

export interface DistrictBreakdown extends SurveyCounts {
  districtId: Id<"districts">;
  code: string;
  name: string;
}
export interface UlbBreakdown extends SurveyCounts {
  municipalityId: Id<"municipalities">;
  code: string;
  name: string;
  districtId: Id<"districts">;
  districtName: string;
}
export interface SurveyorBreakdown extends SurveyCounts {
  surveyorId: Id<"users">;
  name: string;
  email: string;
  municipalityName: string | null;
  districtName: string | null;
}

export interface StatsBreakdown {
  summary: SurveyCounts;
  byDistrict: DistrictBreakdown[];
  byUlb: UlbBreakdown[];
  bySurveyor: SurveyorBreakdown[];
  filterOptions: {
    districts: { _id: Id<"districts">; code: string; name: string }[];
    municipalities: { _id: Id<"municipalities">; code: string; name: string; districtId: Id<"districts"> }[];
    surveyors: { _id: Id<"users">; name: string; email: string }[];
  };
}

export interface DailyTrendPoint {
  date: string;
  created: number;
  submitted: number;
  approved: number;
  rejected: number;
}
export interface WardCoverageRow {
  municipalityId: Id<"municipalities">;
  municipalityName: string;
  wardNo: string;
  total: number;
  approved: number;
  approvalRate: number;
}
