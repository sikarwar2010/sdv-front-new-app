"use client";

import { EmptyState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/shared/page-header";
import { RoleGate } from "@/components/shared/role-gate";
import { SurveyEditor } from "@/components/surveys/survey-editor";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

/** Generates the idempotency key the mobile app would generate before sync. */
function newLocalId() {
  return `web_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

export default function NewSurveyPage() {
  const router = useRouter();
  const [localId] = useState(newLocalId);
  const [surveyId, setSurveyId] = useState<string | undefined>();

  return (
    <RoleGate
      capability="surveys.editDraft"
      fallback={<EmptyState title="Not permitted" description="Only surveyors and admins can create surveys." />}
    >
      <div className="space-y-5">
        <Button asChild variant="ghost" size="sm" className="-ml-2 w-fit">
          <Link href="/surveys">
            <ArrowLeft className="h-4 w-4" /> Back to surveys
          </Link>
        </Button>
        <PageHeader
          title="New Survey"
          description="Complete each tab — property details, area, photos and GPS — then submit for QC."
        />
        <SurveyEditor
          localId={localId}
          surveyId={surveyId}
          onSaved={(id) => {
            setSurveyId(id);
            router.replace(`/surveys/${id}/edit`);
          }}
        />
      </div>
    </RoleGate>
  );
}
