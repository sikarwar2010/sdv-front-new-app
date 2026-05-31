"use client";

import { RoleGate } from "@/components/shared/role-gate";
import { FloorsEditor } from "@/components/surveys/floors-editor";
import { GpsCapturePanel } from "@/components/surveys/gps-capture";
import { PhotoUploader } from "@/components/surveys/photo-uploader";
import { SurveyForm } from "@/components/surveys/survey-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSurvey } from "@/hooks/surveys/useSurveys";
import type { SurveyListItem } from "@/schema/surveys/index";
import { Camera, Layers, MapPin, Save, Send } from "lucide-react";
import { useState } from "react";

function LockedTab({ title, description }: { title: string; description: string }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          Save the property details first using the <strong>Details</strong> tab, then return here to complete this
          section.
        </p>
      </CardContent>
    </Card>
  );
}

export function SurveyEditor({
  localId,
  surveyId,
  existing,
  locked = false,
  onSaved,
  showSubmitBar,
  onSubmit,
  submitting,
}: {
  localId: string;
  surveyId?: string;
  existing?: SurveyListItem | null;
  locked?: boolean;
  onSaved?: (surveyId: string) => void;
  showSubmitBar?: boolean;
  onSubmit?: () => void;
  submitting?: boolean;
}) {
  const [activeTab, setActiveTab] = useState("details");
  const loaded = useSurvey(surveyId);
  const survey = existing ?? loaded;
  const canEditSections = !!surveyId && !locked;

  return (
    <div className="space-y-4">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="flex h-auto w-full flex-wrap justify-start gap-1 bg-muted/50 p-1">
          <TabsTrigger value="details" className="gap-1.5">
            <Save className="h-3.5 w-3.5" /> Details
          </TabsTrigger>
          <TabsTrigger value="area" className="gap-1.5" disabled={!canEditSections}>
            <Layers className="h-3.5 w-3.5" /> Area
          </TabsTrigger>
          <TabsTrigger value="photos" className="gap-1.5" disabled={!canEditSections}>
            <Camera className="h-3.5 w-3.5" /> Photos
          </TabsTrigger>
          <TabsTrigger value="gps" className="gap-1.5" disabled={!canEditSections}>
            <MapPin className="h-3.5 w-3.5" /> GPS
          </TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="mt-0">
          {locked ? (
            <Card>
              <CardContent className="pt-5 text-sm text-muted-foreground">
                This survey is locked and cannot be edited.
              </CardContent>
            </Card>
          ) : (
            <SurveyForm localId={localId} existing={survey as SurveyListItem | null | undefined} onSaved={onSaved} />
          )}
        </TabsContent>

        <TabsContent value="area" className="mt-0">
          {canEditSections && surveyId ? (
            <FloorsEditor surveyId={surveyId} plotSqft={survey?.plotSqft} plinthSqft={survey?.plinthSqft} />
          ) : (
            <LockedTab
              title="Area details"
              description="Plot area, floor rows, plinth, built-up and open land areas."
            />
          )}
        </TabsContent>

        <TabsContent value="photos" className="mt-0">
          {canEditSections && surveyId ? (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Survey photos</CardTitle>
                <CardDescription>Front and side photos are required before submit.</CardDescription>
              </CardHeader>
              <CardContent>
                <PhotoUploader surveyId={surveyId} />
              </CardContent>
            </Card>
          ) : (
            <LockedTab title="Photos" description="Upload front, inside, side and document photos." />
          )}
        </TabsContent>

        <TabsContent value="gps" className="mt-0">
          {canEditSections && surveyId ? (
            <GpsCapturePanel surveyId={surveyId} gps={survey?.gps} />
          ) : (
            <LockedTab title="GPS location" description="Capture the property coordinates before submitting." />
          )}
        </TabsContent>
      </Tabs>

      {showSubmitBar && onSubmit && canEditSections && (
        <RoleGate capability="surveys.submit">
          <div className="flex justify-end border-t border-border pt-5">
            <Button disabled={submitting} onClick={onSubmit}>
              <Send className="h-4 w-4" /> {submitting ? "Submitting…" : "Submit for QC"}
            </Button>
          </div>
        </RoleGate>
      )}
    </div>
  );
}
