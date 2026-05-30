"use client";

import { KpiCard } from "@/components/shared/kpi-card";
import { PageHeader } from "@/components/shared/page-header";
import { SurveyFilters, type FilterState } from "@/components/surveys/survey-filters";
import { SurveyTable } from "@/components/surveys/survey-tables";
import { searchSurveys, useSurveyList } from "@/hooks/surveys/useSurveys";
import { useMemo, useState } from "react";

export default function QcQueuePage() {
  const [filters, setFilters] = useState<FilterState>({ search: "" });

  // QC works the "submitted + pending QC" queue by default.
  const pending = useSurveyList({
    status: "submitted",
    qcStatus: "pending",
    wardNo: filters.wardNo,
    districtId: filters.districtId,
    municipalityId: filters.municipalityId,
  });
  const filtered = useMemo(
    () => (pending ? searchSurveys(pending as any, filters.search) : pending),
    [pending, filters.search],
  );

  return (
    <div className="space-y-5">
      <PageHeader title="Quality Control" description="Surveys submitted and awaiting your review." />
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:max-w-md">
        <KpiCard label="Pending QC" value={pending?.length ?? "…"} tone="warning" />
      </div>
      <SurveyFilters value={filters} onChange={setFilters} showStatus={false} showQcStatus={false} />
      <SurveyTable rows={filtered as any} hrefBase="/qc" />
    </div>
  );
}
