/** Rough completion % for the detail page progress bar (mirrors mobile survey steps). */
export function surveyCompletionPercent(survey: {
  propertyId?: string;
  wardNo?: string;
  parcelNo?: string;
  respondentName?: string;
  mobileNo?: string;
  locality?: string;
  ownershipType?: string;
  propertyUse?: string;
  plotSqft?: number;
  floors?: unknown[];
  gps?: unknown;
  photos?: unknown[];
}): number {
  const checks = [
    !!survey.propertyId?.trim(),
    !!survey.wardNo?.trim(),
    !!survey.parcelNo?.trim(),
    !!survey.respondentName?.trim(),
    !!survey.mobileNo?.trim(),
    !!survey.locality?.trim(),
    !!survey.ownershipType?.trim(),
    !!survey.propertyUse?.trim(),
    (survey.plotSqft ?? 0) > 0,
    (survey.floors?.length ?? 0) > 0,
    !!survey.gps,
    (survey.photos?.length ?? 0) >= 1,
  ];
  const done = checks.filter(Boolean).length;
  return Math.round((done / checks.length) * 100);
}
