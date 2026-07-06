"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Dumbbell,
  Loader2,
  PartyPopper,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SingleSelect, MultiSelect, FieldLabel } from "@/components/survey/fields";
import {
  AI_FEATURES,
  AI_INTEREST_LEVELS,
  CONTACT_TIMES,
  COUNTRIES,
  CURRENT_SOFTWARE,
  GYM_SIZES,
  GYM_TYPES,
  MEMBER_RANGES,
  OPERATIONS_METHODS,
  PAIN_POINTS,
  PRICING_TIERS,
} from "@/lib/constants";
import { submitSurvey } from "@/lib/firestore";
import { isFirebaseConfigured } from "@/lib/firebase";
import type { SurveyDraft } from "@/lib/types";

type FormState = {
  gymName: string;
  ownerName: string;
  country: string;
  city: string;
  gymType: string;
  gymSize: string;
  memberRange: string;
  currentSoftware: string;
  operationsMethods: string[];
  painPoints: string[];
  biggestPain: string;
  timeWastedHours: string;
  aiInterest: string;
  aiFeatures: string[];
  pricingTier: string;
  wantsBeta: boolean | null;
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  preferredContactTime: string;
};

const INITIAL: FormState = {
  gymName: "",
  ownerName: "",
  country: "",
  city: "",
  gymType: "",
  gymSize: "",
  memberRange: "",
  currentSoftware: "",
  operationsMethods: [],
  painPoints: [],
  biggestPain: "",
  timeWastedHours: "",
  aiInterest: "",
  aiFeatures: [],
  pricingTier: "",
  wantsBeta: null,
  contactName: "",
  contactPhone: "",
  contactEmail: "",
  preferredContactTime: "",
};

const STEPS = [
  "Business Profile",
  "Current Operations",
  "Pain Points",
  "AI Interest",
  "Pricing",
  "Beta Signup",
];

export default function SurveyPage() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormState>(INITIAL);
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [error, setError] = useState("");

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const progress = useMemo(() => ((step + 1) / STEPS.length) * 100, [step]);

  // ---- Per-step validation ----
  const stepValid = useMemo(() => {
    switch (step) {
      case 0:
        return (
          form.gymName.trim() &&
          form.ownerName.trim() &&
          form.country &&
          form.city.trim() &&
          form.gymSize
        );
      case 1:
        return !!form.currentSoftware;
      case 2:
        return form.painPoints.length > 0 || form.biggestPain.trim().length > 0;
      case 3:
        return !!form.aiInterest;
      case 4:
        return !!form.pricingTier;
      case 5:
        if (form.wantsBeta === null) return false;
        if (form.wantsBeta) {
          return (
            form.contactName.trim() &&
            (form.contactPhone.trim() || form.contactEmail.trim())
          );
        }
        return true;
      default:
        return true;
    }
  }, [step, form]);

  const next = () => setStep((s) => Math.min(s + 1, STEPS.length - 1));
  const back = () => setStep((s) => Math.max(s - 1, 0));

  async function handleSubmit() {
    setStatus("loading");
    setError("");
    try {
      if (!isFirebaseConfigured) {
        throw new Error("Firebase isn't configured yet. Add your keys to .env.local to save responses.");
      }
      const draft: SurveyDraft = {
        gymName: form.gymName.trim(),
        ownerName: form.ownerName.trim(),
        country: form.country,
        city: form.city.trim(),
        gymType: form.gymType,
        gymSize: form.gymSize,
        memberRange: form.memberRange,
        currentSoftware: form.currentSoftware,
        operationsMethods: form.operationsMethods,
        painPoints: form.painPoints,
        biggestPain: form.biggestPain.trim(),
        timeWastedHours: form.timeWastedHours ? Number(form.timeWastedHours) : null,
        aiInterest: form.aiInterest,
        aiFeatures: form.aiFeatures,
        wantsWhatsApp: form.aiFeatures.includes("whatsapp_assistant"),
        pricingTier: form.pricingTier,
        wantsBeta: !!form.wantsBeta,
        contactName: form.wantsBeta ? form.contactName.trim() : "",
        contactPhone: form.wantsBeta ? form.contactPhone.trim() : "",
        contactEmail: form.wantsBeta ? form.contactEmail.trim() : "",
        preferredContactTime: form.wantsBeta ? form.preferredContactTime : "",
      };
      await submitSurvey(draft);
      setStatus("done");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    }
  }

  if (status === "done") {
    return <ThankYou wantsBeta={!!form.wantsBeta} />;
  }

  return (
    <div className="relative min-h-screen">
      <div className="pointer-events-none absolute inset-0 grid-bg opacity-30" />
      <div className="relative mx-auto flex min-h-screen max-w-2xl flex-col px-5 py-8">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Dumbbell className="h-5 w-5" />
            </span>
            GymPilot<span className="-ml-1 text-primary">AI</span>
          </Link>
          <span className="text-sm text-muted-foreground">~3 minutes</span>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="font-medium text-primary">{STEPS[step]}</span>
            <span className="text-muted-foreground">
              Step {step + 1} of {STEPS.length}
            </span>
          </div>
          <Progress value={progress} />
        </div>

        {/* Steps */}
        <div className="flex-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.3 }}
            >
              {step === 0 && <BusinessProfile form={form} update={update} />}
              {step === 1 && <Operations form={form} update={update} />}
              {step === 2 && <PainPoints form={form} update={update} />}
              {step === 3 && <AIInterest form={form} update={update} />}
              {step === 4 && <Pricing form={form} update={update} />}
              {step === 5 && <BetaStep form={form} update={update} />}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Error */}
        {status === "error" && (
          <p className="mt-6 rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {error}
          </p>
        )}

        {/* Nav */}
        <div className="mt-10 flex items-center justify-between gap-4 border-t border-border/60 pt-6">
          <Button variant="ghost" onClick={back} disabled={step === 0 || status === "loading"}>
            <ArrowLeft /> Back
          </Button>
          {step < STEPS.length - 1 ? (
            <Button onClick={next} disabled={!stepValid} className="group">
              Continue
              <ArrowRight className="transition-transform group-hover:translate-x-1" />
            </Button>
          ) : (
            <Button onClick={handleSubmit} disabled={!stepValid || status === "loading"} size="lg">
              {status === "loading" ? (
                <>
                  <Loader2 className="animate-spin" /> Submitting…
                </>
              ) : (
                <>
                  Submit <CheckCircle2 />
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Step components
// ---------------------------------------------------------------------------

type StepProps = {
  form: FormState;
  update: <K extends keyof FormState>(key: K, value: FormState[K]) => void;
};

function BusinessProfile({ form, update }: StepProps) {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold">Tell us about your gym</h2>
        <p className="mt-1 text-muted-foreground">The basics, so we understand who you are.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor="gymName">Gym name *</Label>
          <Input id="gymName" value={form.gymName} onChange={(e) => update("gymName", e.target.value)} placeholder="Iron House Fitness" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="ownerName">Your name *</Label>
          <Input id="ownerName" value={form.ownerName} onChange={(e) => update("ownerName", e.target.value)} placeholder="Ahmed Khan" />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="grid gap-2">
          <Label>Country *</Label>
          <Select value={form.country} onValueChange={(v) => update("country", v)}>
            <SelectTrigger><SelectValue placeholder="Select country" /></SelectTrigger>
            <SelectContent className="max-h-72">
              {COUNTRIES.map((c) => (
                <SelectItem key={c} value={c}>{c}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="city">City *</Label>
          <Input id="city" value={form.city} onChange={(e) => update("city", e.target.value)} placeholder="e.g. London" />
        </div>
      </div>

      <div className="grid gap-2">
        <Label>Type of gym</Label>
        <Select value={form.gymType} onValueChange={(v) => update("gymType", v)}>
          <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
          <SelectContent>
            {GYM_TYPES.map((t) => (
              <SelectItem key={t} value={t}>{t}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <FieldLabel hint="Roughly how big is your gym?">Gym size *</FieldLabel>
        <SingleSelect
          columns={2}
          value={form.gymSize}
          onChange={(v) => update("gymSize", v)}
          options={GYM_SIZES.map((g) => ({ value: g.value, label: g.label, detail: g.detail }))}
        />
      </div>

      <div className="grid gap-2">
        <Label>Approximate active members</Label>
        <Select value={form.memberRange} onValueChange={(v) => update("memberRange", v)}>
          <SelectTrigger><SelectValue placeholder="Select range" /></SelectTrigger>
          <SelectContent>
            {MEMBER_RANGES.map((r) => (
              <SelectItem key={r} value={r}>{r}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

function Operations({ form, update }: StepProps) {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold">How do you run things today?</h2>
        <p className="mt-1 text-muted-foreground">This tells us what to integrate with — and what to replace.</p>
      </div>

      <div>
        <FieldLabel hint="What do you mainly use to manage the gym?">Current tools *</FieldLabel>
        <SingleSelect
          columns={2}
          value={form.currentSoftware}
          onChange={(v) => update("currentSoftware", v)}
          options={CURRENT_SOFTWARE.map((s) => ({ value: s, label: s }))}
        />
      </div>

      <div>
        <FieldLabel hint="Select all that apply.">How do you handle day-to-day operations?</FieldLabel>
        <MultiSelect
          columns={2}
          values={form.operationsMethods}
          onChange={(v) => update("operationsMethods", v)}
          options={OPERATIONS_METHODS.map((m) => ({ value: m, label: m }))}
        />
      </div>
    </div>
  );
}

function PainPoints({ form, update }: StepProps) {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold">What frustrates you most?</h2>
        <p className="mt-1 text-muted-foreground">Be honest — this decides what we build first.</p>
      </div>

      <div>
        <FieldLabel hint="Select all that cause you headaches.">Your biggest pain points *</FieldLabel>
        <MultiSelect
          columns={2}
          values={form.painPoints}
          onChange={(v) => update("painPoints", v)}
          options={PAIN_POINTS.map((p) => ({ value: p.value, label: p.label }))}
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="biggestPain">If you could fix ONE thing overnight, what would it be?</Label>
        <Textarea
          id="biggestPain"
          value={form.biggestPain}
          onChange={(e) => update("biggestPain", e.target.value)}
          placeholder="e.g. I lose track of who hasn't paid and spend hours every week reminding people on WhatsApp…"
          className="min-h-[100px]"
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="timeWasted">Roughly how many hours a week do you spend on admin?</Label>
        <Input
          id="timeWasted"
          type="number"
          min={0}
          value={form.timeWastedHours}
          onChange={(e) => update("timeWastedHours", e.target.value)}
          placeholder="e.g. 8"
          className="max-w-[160px]"
        />
      </div>
    </div>
  );
}

function AIInterest({ form, update }: StepProps) {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold">How do you feel about AI helping out?</h2>
        <p className="mt-1 text-muted-foreground">No wrong answers — we want the real picture.</p>
      </div>

      <div>
        <FieldLabel>How interested are you in AI automation for your gym? *</FieldLabel>
        <SingleSelect
          value={form.aiInterest}
          onChange={(v) => update("aiInterest", v)}
          options={AI_INTEREST_LEVELS.map((a) => ({ value: a.value, label: a.label }))}
        />
      </div>

      <div>
        <FieldLabel hint="Which of these would actually help you? Select all.">Features you&apos;d want</FieldLabel>
        <MultiSelect
          columns={1}
          values={form.aiFeatures}
          onChange={(v) => update("aiFeatures", v)}
          options={AI_FEATURES.map((a) => ({ value: a.value, label: a.label }))}
        />
      </div>
    </div>
  );
}

function Pricing({ form, update }: StepProps) {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold">What feels fair to pay?</h2>
        <p className="mt-1 text-muted-foreground">
          Monthly price for software that automates the pain points above. This stays between us.
        </p>
      </div>

      <div>
        <FieldLabel>Monthly budget *</FieldLabel>
        <SingleSelect
          columns={2}
          value={form.pricingTier}
          onChange={(v) => update("pricingTier", v)}
          options={PRICING_TIERS.map((p) => ({ value: p.value, label: p.label }))}
        />
      </div>
    </div>
  );
}

function BetaStep({ form, update }: StepProps) {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold">Want early access?</h2>
        <p className="mt-1 text-muted-foreground">
          Join the beta as a founding gym — early access and founding-member pricing.
        </p>
      </div>

      <div>
        <FieldLabel>Would you like to join the beta? *</FieldLabel>
        <SingleSelect
          columns={2}
          value={form.wantsBeta === null ? "" : form.wantsBeta ? "yes" : "no"}
          onChange={(v) => update("wantsBeta", v === "yes")}
          options={[
            { value: "yes", label: "Yes, count me in! 🚀", detail: "Get early access & founding pricing" },
            { value: "no", label: "Not right now", detail: "Just sharing my feedback" },
          ]}
        />
      </div>

      {form.wantsBeta && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="space-y-4 overflow-hidden"
        >
          <div className="grid gap-2">
            <Label htmlFor="contactName">Contact name *</Label>
            <Input id="contactName" value={form.contactName} onChange={(e) => update("contactName", e.target.value)} placeholder="Ahmed Khan" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="contactPhone">WhatsApp number</Label>
              <Input id="contactPhone" value={form.contactPhone} onChange={(e) => update("contactPhone", e.target.value)} placeholder="+1 555 123 4567" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="contactEmail">Email</Label>
              <Input id="contactEmail" type="email" value={form.contactEmail} onChange={(e) => update("contactEmail", e.target.value)} placeholder="you@gym.com" />
            </div>
          </div>
          <p className="text-xs text-muted-foreground">Provide at least one way to reach you.</p>
          <div className="grid gap-2">
            <Label>Best time to contact you</Label>
            <Select value={form.preferredContactTime} onValueChange={(v) => update("preferredContactTime", v)}>
              <SelectTrigger className="max-w-xs"><SelectValue placeholder="Select time" /></SelectTrigger>
              <SelectContent>
                {CONTACT_TIMES.map((t) => (
                  <SelectItem key={t} value={t}>{t}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </motion.div>
      )}
    </div>
  );
}

function ThankYou({ wantsBeta }: { wantsBeta: boolean }) {
  return (
    <div className="relative flex min-h-screen items-center justify-center px-5">
      <div className="pointer-events-none absolute inset-0 grid-bg opacity-30" />
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md rounded-2xl border border-border bg-card p-10 text-center"
      >
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
          <PartyPopper className="h-8 w-8" />
        </div>
        <h1 className="mt-6 text-2xl font-bold">Thank you! 🙏</h1>
        <p className="mt-3 text-muted-foreground">
          Your answers just helped shape GymPilot AI. Every response moves us closer to building
          the right thing for gyms like yours.
        </p>
        {wantsBeta && (
          <p className="mt-3 rounded-lg bg-primary/10 px-4 py-3 text-sm text-primary">
            You&apos;re on the founding-member list — we&apos;ll be in touch soon. 🚀
          </p>
        )}
        <div className="mt-8 flex flex-col gap-3">
          <Button asChild>
            <Link href="/">Back to home</Link>
          </Button>
          <Button asChild variant="ghost">
            <Link href="/#features">Explore the product</Link>
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
