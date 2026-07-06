import type { SurveyResponse } from "./types";
import {
  AI_FEATURES,
  AI_INTEREST_LEVELS,
  GYM_SIZES,
  PAIN_POINTS,
  PRICING_TIERS,
} from "./constants";

export interface CountItem {
  name: string;
  value: number;
}

const labelOf = (
  set: readonly { value: string; label: string }[],
  value: string
): string => set.find((x) => x.value === value)?.label ?? value;

function countBy(values: string[]): Map<string, number> {
  const map = new Map<string, number>();
  for (const v of values) {
    if (!v) continue;
    map.set(v, (map.get(v) ?? 0) + 1);
  }
  return map;
}

function toSorted(map: Map<string, number>): CountItem[] {
  return Array.from(map.entries())
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);
}

export interface DashboardData {
  total: number;
  betaSignups: number;
  aiInterestedPct: number; // very + somewhat
  avgAdminHours: number;
  countries: CountItem[];
  cities: CountItem[];
  gymSizes: CountItem[];
  software: CountItem[];
  painPoints: CountItem[]; // top-ranked
  aiFeatures: CountItem[];
  aiInterest: CountItem[];
  pricing: CountItem[]; // ordered by tier
}

export function computeDashboard(responses: SurveyResponse[]): DashboardData {
  const total = responses.length;

  const betaSignups = responses.filter((r) => r.wantsBeta).length;

  const interested = responses.filter(
    (r) => r.aiInterest === "very" || r.aiInterest === "somewhat"
  ).length;
  const aiInterestedPct = total ? Math.round((interested / total) * 100) : 0;

  const hoursList = responses
    .map((r) => r.timeWastedHours)
    .filter((h): h is number => typeof h === "number" && !Number.isNaN(h));
  const avgAdminHours = hoursList.length
    ? Math.round((hoursList.reduce((a, b) => a + b, 0) / hoursList.length) * 10) / 10
    : 0;

  const countries = toSorted(countBy(responses.map((r) => r.country)));

  const cities = toSorted(countBy(responses.map((r) => r.city)));

  const gymSizes = toSorted(countBy(responses.map((r) => r.gymSize))).map((c) => ({
    name: labelOf(GYM_SIZES, c.name),
    value: c.value,
  }));

  const software = toSorted(countBy(responses.map((r) => r.currentSoftware)));

  const painPoints = toSorted(
    countBy(responses.flatMap((r) => r.painPoints ?? []))
  ).map((c) => ({ name: labelOf(PAIN_POINTS, c.name), value: c.value }));

  const aiFeatures = toSorted(
    countBy(responses.flatMap((r) => r.aiFeatures ?? []))
  ).map((c) => ({ name: labelOf(AI_FEATURES, c.name), value: c.value }));

  // Preserve the natural interest-level order (very -> not).
  const interestMap = countBy(responses.map((r) => r.aiInterest));
  const aiInterest = AI_INTEREST_LEVELS.map((lvl) => ({
    name: lvl.label,
    value: interestMap.get(lvl.value) ?? 0,
  })).filter((x) => x.value > 0);

  // Preserve pricing tier order (low -> high).
  const priceMap = countBy(responses.map((r) => r.pricingTier));
  const pricing = PRICING_TIERS.map((t) => ({
    name: t.label,
    value: priceMap.get(t.value) ?? 0,
  })).filter((x) => x.value > 0);

  return {
    total,
    betaSignups,
    aiInterestedPct,
    avgAdminHours,
    countries,
    cities,
    gymSizes,
    software,
    painPoints,
    aiFeatures,
    aiInterest,
    pricing,
  };
}
