"use client";

import { QcPanel } from "@/components/qc/qc-panel";
import { generateQcReportPdf } from "@/components/reports/queries/pdf";
import { EmptyState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/shared/page-header";
import { QcStatusBadge, SurveyStatusBadge } from "@/components/shared/status-badge";
import { PhotoGallery } from "@/components/surveys/photo-gallery";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useQcRemarks } from "@/hooks/qc/useQc";
import { useSurvey } from "@/hooks/surveys/useSurveys";
import { ArrowLeft, Download } from "lucide-react";
import Link from "next/link";
import { use } from "react";

function F({ label, value }: { label: string; value: any }) {
  return (
    <div className="space-y-0.5">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="text-sm">{value == null || value === "" ? "—" : String(value)}</p>
    </div>
  );
}

export default function QcReviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const survey = useSurvey(id);
  const remarks = useQcRemarks(id);

  if (survey === undefined) return <Skeleton className="h-96 w-full" />;
  if (survey === null) return <EmptyState title="Survey not found" />;

  return (
    <div className="space-y-5">
      <Button asChild variant="ghost" size="sm" className="-ml-2 w-fit">
        <Link href="/qc">
          <ArrowLeft className="h-4 w-4" /> Back to QC queue
        </Link>
      </Button>
      <PageHeader
        title={`Review — ${survey.propertyId || survey.parcelNo}`}
        description={`${survey.city} · Ward ${survey.wardNo} · Surveyor: ${survey.surveyor?.name ?? "—"}`}
        actions={
          <div className="flex items-center gap-2">
            <SurveyStatusBadge status={survey.status} />
            <QcStatusBadge status={survey.qcStatus} />
            <Button variant="outline" size="sm" onClick={() => generateQcReportPdf(survey, remarks ?? [])}>
              <Download className="h-4 w-4" /> QC PDF
            </Button>
            <Button asChild variant="ghost" size="sm">
              <Link href={`/surveys/${id}`}>Full detail</Link>
            </Button>
          </div>
        }
      />

      <div className="grid gap-5 lg:grid-cols-[1fr_380px]">
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Key fields</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <F label="Owner" value={survey.respondentName} />
              <F label="Mobile" value={survey.mobileNo} />
              <F label="Property Use" value={survey.propertyUse} />
              <F label="Ownership" value={survey.ownershipType} />
              <F label="Assessment Year" value={survey.assessmentYear} />
              <F label="Plot / Plinth" value={`${survey.plotSqft} / ${survey.plinthSqft}`} />
              <F
                label="GPS"
                value={
                  survey.gps
                    ? `${survey.gps.latitude.toFixed(5)}, ${survey.gps.longitude.toFixed(5)} (±${survey.gps.accuracyMeters}m)`
                    : "none"
                }
              />
            </CardContent>
          </Card>

          {survey.floors?.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Floors</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Floor</TableHead>
                      <TableHead>Usage</TableHead>
                      <TableHead>Construction</TableHead>
                      <TableHead>Area</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {survey.floors.map((f: any) => (
                      <TableRow key={f._id}>
                        <TableCell className="capitalize">{f.floorName}</TableCell>
                        <TableCell className="capitalize">{f.usageType}</TableCell>
                        <TableCell className="capitalize">{f.constructionType}</TableCell>
                        <TableCell>{f.areaSqft}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Photos</CardTitle>
            </CardHeader>
            <CardContent>
              <PhotoGallery photos={(survey.photos ?? []) as any} uploaderName={survey.surveyor?.name} />
            </CardContent>
          </Card>
        </div>

        <QcPanel survey={survey} />
      </div>
    </div>
  );
}
