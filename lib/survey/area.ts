export {
  builtUpSqftFromFloors,
  isOpenLandFloor,
  openLandSqftFromFloors,
  plinthSqftFromFloors,
} from "@/convex/areaMasters";

export { PROPERTY_ID_PATTERN, formatPropertyId, propertyUseCode } from "@/convex/propertyId";

/** Format sq ft for display in area summaries. */
export function formatAreaSqft(sqft: number): string {
  if (sqft <= 0) return "—";
  return `${sqft.toLocaleString("en-IN")} sq ft`;
}
