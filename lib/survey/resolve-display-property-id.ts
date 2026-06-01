import { formatPropertyId } from "@/lib/survey/area";

export type PropertyIdSource = {
  propertyId?: string;
  municipalityId?: string;
  wardNo?: string;
  parcelNo?: string;
  propertyUse?: string;
};

/** Stored Property ID, or computed from ULB code + ward + parcel + property use. */
export function resolveDisplayPropertyId(
  survey: PropertyIdSource,
  ulbCodeByMunicipalityId?: Map<string, string> | Record<string, string>,
): string | undefined {
  const stored = survey.propertyId?.trim();
  if (stored) return stored.toUpperCase();

  const muniId = survey.municipalityId;
  if (!muniId) return undefined;

  const ulbCode =
    ulbCodeByMunicipalityId instanceof Map ? ulbCodeByMunicipalityId.get(muniId) : ulbCodeByMunicipalityId?.[muniId];
  if (!ulbCode) return undefined;

  return formatPropertyId({
    ulbCode,
    wardNo: survey.wardNo ?? "",
    parcelNo: survey.parcelNo ?? "",
    propertyUse: survey.propertyUse ?? "",
  });
}

export function buildUlbCodeMap(ulbs: { _id: string; code: string }[] | undefined): Map<string, string> {
  return new Map((ulbs ?? []).map((u) => [u._id, u.code]));
}
