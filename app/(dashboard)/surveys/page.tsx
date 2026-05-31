"use client";

import { exportSurveysCsv } from "@/components/reports/queries/exporters";
import { PageHeader } from "@/components/shared/page-header";
import { RoleGate } from "@/components/shared/role-gate";
import { TablePagination } from "@/components/shared/table-pagination";
import { SurveyFilters, type FilterState } from "@/components/surveys/survey-filters";
import { SurveyTable } from "@/components/surveys/survey-tables";
import { Button } from "@/components/ui/button";
import { searchSurveys, useSurveyListPaginated } from "@/hooks/surveys/useSurveys";
import type { QcStatus, SurveyStatus } from "@/lib/domain";
import { Download, Plus } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

export default function SurveysPage() {
  const [filters, setFilters] = useState<FilterState>({ search: "" });
  const [pageSize, setPageSize] = useState(20);

  const listFilters = useMemo(
    () => ({
      status: filters.status as SurveyStatus | undefined,
      qcStatus: filters.qcStatus as QcStatus | undefined,
      wardNo: filters.wardNo,
      districtId: filters.districtId,
      municipalityId: filters.municipalityId,
    }),
    [filters],
  );

  const {
    surveys,
    isLoading,
    pageNumber,
    pageSize: rowsPerPage,
    canGoPrev,
    canGoNext,
    goNext,
    goPrev,
  } = useSurveyListPaginated(listFilters, pageSize);

  const filtered = useMemo(
    () => (surveys ? searchSurveys(surveys as any, filters.search) : surveys),
    [surveys, filters.search],
  );

  return (
    <div className="space-y-5">
      <PageHeader
        title="Surveys"
        description="All property surveys within your assigned scope, sorted by Property ID."
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              disabled={!filtered?.length}
              onClick={() => filtered && exportSurveysCsv(filtered as any)}
            >
              <Download className="h-4 w-4" /> Export CSV
            </Button>
            <RoleGate capability="surveys.editDraft">
              <Button asChild>
                <Link href="/surveys/new">
                  <Plus className="h-4 w-4" /> New Survey
                </Link>
              </Button>
            </RoleGate>
          </div>
        }
      />
      <SurveyFilters value={filters} onChange={setFilters} />
      <SurveyTable rows={isLoading ? undefined : (filtered as any)} />
      <TablePagination
        pageNumber={pageNumber}
        pageSize={rowsPerPage}
        itemCount={filtered?.length ?? 0}
        canGoPrev={canGoPrev}
        canGoNext={canGoNext}
        onPrev={goPrev}
        onNext={goNext}
        pageSizeOptions={[10, 20, 50, 100]}
        onPageSizeChange={setPageSize}
      />
    </div>
  );
}
