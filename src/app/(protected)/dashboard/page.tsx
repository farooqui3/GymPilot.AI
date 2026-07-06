"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Users,
  Rocket,
  Sparkles,
  Clock,
  RefreshCw,
  Loader2,
  Lightbulb,
} from "lucide-react";
import { ProtectedNav } from "@/components/admin/protected-nav";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  VerticalBarCard,
  HorizontalBarCard,
  DonutCard,
} from "@/components/dashboard/charts";
import { getSurveyResponses } from "@/lib/firestore";
import { computeDashboard } from "@/lib/analytics";
import type { SurveyResponse } from "@/lib/types";

export default function DashboardPage() {
  const [responses, setResponses] = useState<SurveyResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function load() {
    setLoading(true);
    setError("");
    try {
      setResponses(await getSurveyResponses());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load responses.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const data = useMemo(() => computeDashboard(responses), [responses]);

  return (
    <div className="min-h-screen">
      <ProtectedNav />
      <main className="container py-8">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Analytics</h1>
            <p className="text-sm text-muted-foreground">Live insights from survey responses.</p>
          </div>
          <Button variant="outline" size="sm" onClick={load} disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
            Refresh
          </Button>
        </div>

        {error && (
          <p className="mb-6 rounded-md bg-destructive/10 px-4 py-3 text-sm text-destructive">{error}</p>
        )}

        {loading && responses.length === 0 ? (
          <div className="flex h-64 items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="space-y-6">
            {/* Stat row */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard icon={Users} label="Total responses" value={data.total} accent="text-primary" hint="Goal: 100" />
              <StatCard icon={Rocket} label="Beta signups" value={data.betaSignups} accent="text-sky-400" hint="Goal: 10" />
              <StatCard icon={Sparkles} label="Interested in AI" value={`${data.aiInterestedPct}%`} accent="text-violet-400" hint="Very + somewhat" />
              <StatCard icon={Clock} label="Avg admin hours/wk" value={data.avgAdminHours} accent="text-amber-400" hint="Self-reported" />
            </div>

            {/* Decision insights */}
            <DecisionInsights data={data} />

            {/* Charts */}
            <div className="grid gap-6 lg:grid-cols-2">
              <HorizontalBarCard title="Top pain points" data={data.painPoints} max={10} />
              <HorizontalBarCard title="AI features in demand" data={data.aiFeatures} max={8} />
              <DonutCard title="Gym size distribution" data={data.gymSizes} />
              <DonutCard title="Current tools used" data={data.software} />
              <VerticalBarCard title="Pricing expectations (USD / month)" data={data.pricing} />
              <VerticalBarCard title="AI interest level" data={data.aiInterest} />
              <HorizontalBarCard title="Country distribution" data={data.countries} max={12} />
              <HorizontalBarCard title="City distribution" data={data.cities} max={12} />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  accent,
  hint,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string | number;
  accent: string;
  hint?: string;
}) {
  return (
    <Card>
      <CardContent className="flex items-start justify-between p-6">
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="mt-2 text-3xl font-bold">{value}</p>
          {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
        </div>
        <div className={`rounded-lg bg-secondary p-2.5 ${accent}`}>
          <Icon className="h-5 w-5" />
        </div>
      </CardContent>
    </Card>
  );
}

/** Turns the raw distributions into MVP recommendations (the Decision Framework). */
function DecisionInsights({ data }: { data: ReturnType<typeof computeDashboard> }) {
  const insights = useMemo(() => {
    const out: string[] = [];
    const topPain = data.painPoints[0];
    const topSoftware = data.software[0];
    const topFeature = data.aiFeatures[0];
    const topPrice = [...data.pricing].sort((a, b) => b.value - a.value)[0];

    if (topPain) out.push(`Biggest pain is "${topPain.name}" (${topPain.value}) → prioritise this in the MVP.`);
    if (topSoftware && /excel|sheet/i.test(topSoftware.name))
      out.push(`Many use Excel/Sheets → build a one-click Excel import to lower switching friction.`);
    if (topSoftware && /whatsapp/i.test(topSoftware.name))
      out.push(`WhatsApp is a primary tool → lead with the WhatsApp assistant.`);
    if (topFeature) out.push(`Most-wanted AI feature: "${topFeature.name}" (${topFeature.value}) → strong signal to build first.`);
    if (topPrice) out.push(`Most common budget: ${topPrice.name} → anchor pricing here.`);
    return out;
  }, [data]);

  if (data.total === 0 || insights.length === 0) return null;

  return (
    <Card className="border-primary/30 bg-primary/5">
      <CardContent className="p-6">
        <div className="mb-3 flex items-center gap-2 font-semibold">
          <Lightbulb className="h-5 w-5 text-primary" />
          MVP decision signals
        </div>
        <ul className="grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">
          {insights.map((i, idx) => (
            <li key={idx} className="flex gap-2">
              <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
              {i}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
