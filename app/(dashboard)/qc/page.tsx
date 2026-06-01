"use client";

import { KpiCard } from "@/components/shared/kpi-card";
import { PageHeader } from "@/components/shared/page-header";
import { TablePagination } from "@/components/shared/table-pagination";
import { SurveyFilters, type FilterState } from "@/components/surveys/survey-filters";
import { SurveyTable } from "@/components/surveys/survey-tables";
import { useMasters } from "@/hooks/masters/useMasters";
import { searchSurveys, useSurveyList, useSurveyListPaginated } from "@/hooks/surveys/useSurveys";
import { buildUlbCodeMap } from "@/lib/survey/resolve-display-property-id";
import { useMemo, useState } from "react";

export default function QcQueuePage() {
  const { masters } = useMasters();
  const ulbCodes = useMemo(() => buildUlbCodeMap(masters?.ulbs), [masters?.ulbs]);
  const [filters, setFilters] = useState<FilterState>({ search: "" });
  const [pageSize, setPageSize] = useState(20);

  const pendingCount = useSurveyList({
    status: "submitted",
    qcStatus: "pending",
    wardNo: filters.wardNo,
    districtId: filters.districtId,
    municipalityId: filters.municipalityId,
    limit: 200,
  });

  const {
    surveys,
    isLoading,
    pageNumber,
    pageSize: rowsPerPage,
    canGoPrev,
    canGoNext,
    goNext,
    goPrev,
  } = useSurveyListPaginated(
    {
      status: "submitted",
      qcStatus: "pending",
      wardNo: filters.wardNo,
      districtId: filters.districtId,
      municipalityId: filters.municipalityId,
    },
    pageSize,
  );

  const filtered = useMemo(
    () => (surveys ? searchSurveys(surveys as any, filters.search, ulbCodes) : surveys),
    [surveys, filters.search, ulbCodes],
  );

  return (
    <div className="space-y-5">
      <PageHeader title="Quality Control" description="Surveys submitted and awaiting your review." />
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:max-w-md">
        <KpiCard label="Pending QC" value={pendingCount?.length ?? "…"} tone="warning" />
      </div>
      <SurveyFilters value={filters} onChange={setFilters} showStatus={false} showQcStatus={false} />
      <SurveyTable rows={isLoading ? undefined : (filtered as any)} hrefBase="/qc" />
      <TablePagination
        pageNumber={pageNumber}
        pageSize={rowsPerPage}
        itemCount={filtered?.length ?? 0}
        canGoPrev={canGoPrev}
        canGoNext={canGoNext}
        onPrev={goPrev}
        onNext={goNext}
        pageSizeOptions={[10, 20, 50]}
        onPageSizeChange={setPageSize}
      />
    </div>
  );
}
