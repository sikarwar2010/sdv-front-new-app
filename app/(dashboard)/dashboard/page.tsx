"use client";

import { Users, UserCog, Building2, ClipboardCheck } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { KpiCard } from "@/components/shared/kpi-card";
import { CardsSkeleton } from "@/components/shared/loading";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCurrentUser } from "@/lib/session";
import {
  useDashboardCounts,
  useStatsBreakdown,
  useDailyTrend,
  useWardCoverage,
} from "@/hooks/analytics/useAnalytics";
import { TrendChart, SurveyorProductivityChart, CoverageChart } from "@/components/analytics/charts";
import { can } from "@/lib/permissions";

export default function DashboardPage() {
  const { user, role } = useCurrentUser();
  const counts = useDashboardCounts();
  const showAnalytics = can(role, "analytics.view");

  // Heavier aggregates only for supervisor/admin.
  const breakdown = useStatsBreakdown();
  const trend = useDailyTrend(30);
  const coverage = useWardCoverage();

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Welcome, ${user?.name?.split(" ")[0] ?? ""}`}
        description={
          role === "surveyor" ? "Your survey activity at a glance." : "Executive overview across your assigned scope."
        }
      />

      {/* Survey KPIs — scoped server-side by dashboardCounts */}
      {counts === undefined ? (
        <CardsSkeleton count={6} />
      ) : (
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-6">
          <KpiCard label="Total Surveys" value={counts.total} />
          <KpiCard label="Drafts" value={counts.drafts} tone="muted" />
          <KpiCard label="Submitted" value={counts.submitted} tone="default" />
          <KpiCard label="Pending QC" value={counts.submitted} tone="warning" hint="Awaiting review" />
          <KpiCard label="Approved" value={counts.approved} tone="success" />
          <KpiCard label="Rejected" value={counts.rejected} tone="destructive" />
        </div>
      )}

      {/* Org KPIs from the breakdown filterOptions — admin/supervisor only */}
      {showAnalytics && breakdown && (
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <KpiCard label="Surveyors" value={breakdown.filterOptions.surveyors.length} />
          <KpiCard label="Municipalities Covered" value={breakdown.byUlb.length} />
          <KpiCard label="Districts" value={breakdown.filterOptions.districts.length} />
          <KpiCard label="Today" value={counts?.today ?? 0} tone="default" hint="Surveys created today" />
        </div>
      )}

      {/* Charts — analytics.view capability */}
      {showAnalytics && (
        <>
          <div className="grid gap-4 lg:grid-cols-2">
            <TrendChart data={trend ?? undefined} title="Daily Survey & Approval Trend (30d)" />
            <SurveyorProductivityChart
              data={breakdown?.bySurveyor.map((s) => ({
                name: s.name,
                approved: s.approved,
                submitted: s.submitted,
                drafts: s.drafts,
              }))}
              title="Surveyor Productivity"
            />
          </div>
          <div className="grid gap-4 lg:grid-cols-2">
            <CoverageChart
              data={coverage?.map((w) => ({
                label: `W${w.wardNo} · ${w.municipalityName}`,
                total: w.total,
                approvalRate: w.approvalRate,
              }))}
              title="Ward Coverage"
            />
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Municipality Performance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {breakdown?.byUlb.length === 0 && <p className="text-sm text-muted-foreground">No data in scope.</p>}
                {breakdown?.byUlb.map((m) => {
                  const rate = m.total > 0 ? Math.round((m.approved / m.total) * 100) : 0;
                  return (
                    <div key={m.municipalityId} className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium">{m.name}</span>
                        <span className="text-muted-foreground tabular-nums">
                          {m.approved}/{m.total} · {rate}%
                        </span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-muted">
                        <div className="h-full rounded-full bg-success" style={{ width: `${rate}%` }} />
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
