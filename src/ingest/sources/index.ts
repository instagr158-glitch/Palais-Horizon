import type { SourceAdapter } from "./base";
import genericJsonLd from "./generic-jsonld";

/** Register every source adapter here. */
export const ADAPTERS: SourceAdapter[] = [genericJsonLd];

export function enabledAdapters(): SourceAdapter[] {
  return ADAPTERS.filter((a) => a.enabled);
}
