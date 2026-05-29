"use client";

import { useMemo, useState } from "react";
import { Download } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { SurveyFilters, type FilterState } from "@/features/surveys/components/survey-filters";
import { SurveyTable } from "@/features/surveys/components/survey-table";
import { useSurveyList, searchSurveys } from "@/features/surveys/hooks/useSurveys";
import { exportSurveysCsv } from "@/features/reports/queries/exporters";
import type { SurveyStatus, QcStatus } from "@/lib/domain";

export default function SurveysPage() {
  const [filters, setFilters] = useState<FilterState>({ search: "" });

  const rows = useSurveyList({
    status: filters.status as SurveyStatus | undefined,
    qcStatus: filters.qcStatus as QcStatus | undefined,
    wardNo: filters.wardNo,
    districtId: filters.districtId,
    municipalityId: filters.municipalityId,
  });

  const filtered = useMemo(() => (rows ? searchSurveys(rows as any, filters.search) : rows), [rows, filters.search]);

  return (
    <div className="space-y-5">
      <PageHeader
        title="Surveys"
        description="All property surveys within your assigned scope."
        actions={
          <Button
            variant="outline"
            disabled={!filtered?.length}
            onClick={() => filtered && exportSurveysCsv(filtered as any)}
          >
            <Download className="h-4 w-4" /> Export CSV
          </Button>
        }
      />
      <SurveyFilters value={filters} onChange={setFilters} />
      <p className="text-xs text-muted-foreground">
        {filtered?.length ?? 0} result{filtered?.length === 1 ? "" : "s"}
      </p>
      <SurveyTable rows={filtered as any} />
    </div>
  );
}
