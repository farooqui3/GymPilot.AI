// Central place for all survey option sets and business presets.
// Worldwide: country dropdown + free-text city, USD pricing.

// Common countries first, then the rest alphabetically. "Other" as fallback.
export const COUNTRIES = [
  "United States",
  "United Kingdom",
  "Canada",
  "Australia",
  "India",
  "Pakistan",
  "United Arab Emirates",
  "Saudi Arabia",
  "Germany",
  "France",
  "Spain",
  "Italy",
  "Netherlands",
  "Brazil",
  "Mexico",
  "Nigeria",
  "South Africa",
  "Egypt",
  "Turkey",
  "Indonesia",
  "Malaysia",
  "Singapore",
  "Philippines",
  "Bangladesh",
  "Japan",
  "South Korea",
  "China",
  "New Zealand",
  "Ireland",
  "Sweden",
  "Other",
] as const;

export const GYM_SIZES = [
  { value: "small", label: "Small", detail: "Under 100 members" },
  { value: "medium", label: "Medium", detail: "100 – 500 members" },
  { value: "large", label: "Large", detail: "500 – 1,500 members" },
  { value: "enterprise", label: "Enterprise / Chain", detail: "1,500+ members or multiple branches" },
] as const;

export const GYM_TYPES = [
  "General Fitness Gym",
  "CrossFit / Functional",
  "Ladies-only Gym",
  "Boutique Studio (Yoga/Pilates/Spin)",
  "Bodybuilding / Powerlifting",
  "MMA / Boxing",
  "Personal Training Studio",
  "Other",
] as const;

export const CURRENT_SOFTWARE = [
  "Pen & Paper / Register",
  "Excel / Google Sheets",
  "WhatsApp only",
  "Local desktop software",
  "A gym management app",
  "Custom-built system",
  "Nothing yet",
] as const;

export const OPERATIONS_METHODS = [
  "Manual attendance register",
  "Biometric / RFID access",
  "Cash collection at desk",
  "Bank transfer / mobile wallet",
  "Card / POS machine",
  "Online / app payments",
  "Manual renewal reminders",
] as const;

// Pain points — the heart of the discovery survey.
export const PAIN_POINTS = [
  { value: "renewals", label: "Chasing membership renewals" },
  { value: "attendance", label: "Tracking attendance accurately" },
  { value: "payments", label: "Collecting & reconciling payments" },
  { value: "retention", label: "Member retention / churn" },
  { value: "leads", label: "Following up with new leads" },
  { value: "staff", label: "Managing trainers & staff schedules" },
  { value: "communication", label: "Communicating with members (reminders/offers)" },
  { value: "reporting", label: "Knowing my real numbers (revenue, active members)" },
  { value: "diet_workout", label: "Creating diet & workout plans" },
  { value: "no_shows", label: "Reducing no-shows / inactive members" },
] as const;

// AI features to gauge demand for.
export const AI_FEATURES = [
  { value: "whatsapp_assistant", label: "AI WhatsApp assistant (answer members, book, remind)" },
  { value: "renewal_automation", label: "Automated renewal reminders & follow-ups" },
  { value: "churn_prediction", label: "Predict which members are about to quit" },
  { value: "diet_workout_ai", label: "AI diet & workout plan generator" },
  { value: "lead_followup", label: "Automatic lead follow-up & conversion" },
  { value: "smart_reports", label: "Plain-English business insights & reports" },
  { value: "voice_agent", label: "AI voice agent for calls" },
] as const;

export const AI_INTEREST_LEVELS = [
  { value: "very", label: "Very interested — I'd pay for this today" },
  { value: "somewhat", label: "Somewhat interested — want to see it first" },
  { value: "neutral", label: "Neutral / not sure" },
  { value: "not", label: "Not interested" },
] as const;

// Monthly pricing willingness (USD).
export const PRICING_TIERS = [
  { value: "0-10", label: "Under $10" },
  { value: "10-25", label: "$10 – 25" },
  { value: "25-50", label: "$25 – 50" },
  { value: "50-100", label: "$50 – 100" },
  { value: "100+", label: "$100+" },
  { value: "unsure", label: "Not sure yet" },
] as const;

export const MEMBER_RANGES = [
  "Under 50",
  "50 – 100",
  "100 – 250",
  "250 – 500",
  "500 – 1,000",
  "1,000+",
] as const;

// Firestore collection names (per blueprint).
export const COLLECTIONS = {
  surveyResponses: "surveyResponses",
  waitingList: "waitingList",
  contacts: "contacts",
} as const;

export const CONTACT_TIMES = ["Morning", "Afternoon", "Evening", "Anytime"] as const;
