"use client";

import { QcPanel } from "@/components/qc/qc-panel";
import { generateSurveyReportPdf } from "@/components/reports/queries/pdf";
import { EmptyState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/shared/page-header";
import { RoleGate } from "@/components/shared/role-gate";
import { QcStatusBadge, SurveyStatusBadge } from "@/components/shared/status-badge";
import { SurveyDetailView } from "@/components/surveys/survey-detail-view";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useQcRemarks } from "@/hooks/qc/useQc";
import { useRemoveSurvey, useSurvey } from "@/hooks/surveys/useSurveys";
import { parseConvexError } from "@/lib/errors";
import { ArrowLeft, Download, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { use } from "react";
import { toast } from "sonner";

export default function SurveyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const survey = useSurvey(id);
  const remarks = useQcRemarks(id);
  const removeSurvey = useRemoveSurvey();

  if (survey === undefined) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }
  if (survey === null) {
    return <EmptyState title="Survey not found" description="It may have been deleted or is outside your scope." />;
  }

  async function onDelete() {
    if (!confirm("Delete this survey? This cannot be undone.")) return;
    try {
      await removeSurvey({ id: id as any });
      toast.success("Survey deleted");
      router.push("/surveys");
    } catch (e) {
      toast.error(parseConvexError(e).message);
    }
  }

  const title = survey.propertyId || `Parcel ${survey.parcelNo}`;

  return (
    <div className="space-y-5">
      <Button asChild variant="ghost" size="sm" className="-ml-2 w-fit">
        <Link href="/surveys">
          <ArrowLeft className="h-4 w-4" /> Back to surveys
        </Link>
      </Button>

      <PageHeader
        title="Property Survey"
        description={title}
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <SurveyStatusBadge status={survey.status} />
            <QcStatusBadge status={survey.qcStatus} />
            <Button variant="outline" size="sm" onClick={() => generateSurveyReportPdf(survey)}>
              <Download className="h-4 w-4" /> PDF
            </Button>
            <RoleGate capability="surveys.editDraft">
              {survey.qcStatus !== "approved" && (
                <Button asChild variant="default" size="sm">
                  <Link href={`/surveys/${id}/edit`}>
                    <Pencil className="h-4 w-4" /> Edit
                  </Link>
                </Button>
              )}
            </RoleGate>
            <RoleGate capability="surveys.delete">
              {survey.qcStatus !== "approved" && (
                <Button variant="ghost" size="icon" onClick={onDelete}>
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              )}
            </RoleGate>
          </div>
        }
      />

      <div className="grid gap-5 xl:grid-cols-[1fr_360px]">
        <SurveyDetailView survey={survey as any} surveyId={id} remarks={remarks as any} />
        <RoleGate anyOf={["qc.review", "qc.decide"]}>
          <div className="xl:sticky xl:top-4 xl:self-start">
            <QcPanel survey={survey} />
          </div>
        </RoleGate>
      </div>
    </div>
  );
}
