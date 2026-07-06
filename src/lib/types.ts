import type { Timestamp } from "firebase/firestore";

// ---- Survey response ----------------------------------------------------

export interface SurveyResponse {
  id?: string;

  // Section 1 — Business Profile
  gymName: string;
  ownerName: string;
  country: string;
  city: string;
  gymType: string;
  gymSize: string; // GYM_SIZES value
  memberRange: string;

  // Section 2 — Current Operations
  currentSoftware: string; // CURRENT_SOFTWARE value
  operationsMethods: string[];

  // Section 3 — Pain Points
  painPoints: string[]; // PAIN_POINTS values
  biggestPain: string; // free text
  timeWastedHours?: number | null; // hours/week on admin (null when not answered)

  // Section 4 — AI Interest
  aiInterest: string; // AI_INTEREST_LEVELS value
  aiFeatures: string[]; // AI_FEATURES values
  wantsWhatsApp: boolean;

  // Section 5 — Pricing
  pricingTier: string; // PRICING_TIERS value

  // Section 6 — Beta / Contact
  wantsBeta: boolean;
  contactName?: string;
  contactPhone?: string;
  contactEmail?: string;
  preferredContactTime?: string;

  // Meta (admin-managed)
  isBetaUser?: boolean;
  adminNotes?: string;
  contacted?: boolean;

  createdAt?: Timestamp | null;
  createdAtMs?: number; // client fallback timestamp for ordering
}

// Type used when writing from the survey (no id/admin fields).
export type SurveyDraft = Omit<
  SurveyResponse,
  "id" | "createdAt" | "isBetaUser" | "adminNotes" | "contacted"
>;

// ---- Waiting list (beta signup from landing) ----------------------------

export interface WaitingListEntry {
  id?: string;
  name: string;
  email: string;
  phone?: string;
  gymName?: string;
  city?: string;
  createdAt?: Timestamp | null;
  createdAtMs?: number;
}

// ---- Contact / interview request ----------------------------------------

export interface ContactEntry {
  id?: string;
  name: string;
  email: string;
  message: string;
  createdAt?: Timestamp | null;
  createdAtMs?: number;
}
