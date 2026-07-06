"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Download,
  Loader2,
  Search,
  RefreshCw,
  Star,
  MessageCircle,
  Mail,
  Phone,
  CheckCircle2,
  Save,
  Users,
  Trash2,
  X,
} from "lucide-react";
import { ProtectedNav } from "@/components/admin/protected-nav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  deleteSurveyResponse,
  getSurveyResponses,
  updateSurveyResponse,
} from "@/lib/firestore";
import {
  AI_FEATURES,
  AI_INTEREST_LEVELS,
  GYM_SIZES,
  PAIN_POINTS,
  PRICING_TIERS,
} from "@/lib/constants";
import { cn, downloadFile, toCSV } from "@/lib/utils";
import type { SurveyResponse } from "@/lib/types";

const label = (set: readonly { value: string; label: string }[], v: string) =>
  set.find((x) => x.value === v)?.label ?? v;
const labels = (set: readonly { value: string; label: string }[], vs: string[] = []) =>
  vs.map((v) => label(set, v));
const sizeLabel = (v: string) => GYM_SIZES.find((g) => g.value === v)?.label ?? v;

export default function AdminPage() {
  const [rows, setRows] = useState<SurveyResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [q, setQ] = useState("");
  const [countryFilter, setCountryFilter] = useState("all");
  const [sizeFilter, setSizeFilter] = useState("all");
  const [betaOnly, setBetaOnly] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError("");
    try {
      const data = await getSurveyResponses();
      setRows(data);
      if (data.length && !selectedId) setSelectedId(data[0].id ?? null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load responses.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Distinct countries present in the data, for the filter dropdown.
  const countries = useMemo(
    () => Array.from(new Set(rows.map((r) => r.country).filter(Boolean))).sort(),
    [rows]
  );

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return rows.filter((r) => {
      if (countryFilter !== "all" && r.country !== countryFilter) return false;
      if (sizeFilter !== "all" && r.gymSize !== sizeFilter) return false;
      if (betaOnly && !r.wantsBeta && !r.isBetaUser) return false;
      if (needle) {
        const hay = [
          r.gymName,
          r.ownerName,
          r.country,
          r.city,
          r.contactName,
          r.contactEmail,
          r.contactPhone,
          r.biggestPain,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        if (!hay.includes(needle)) return false;
      }
      return true;
    });
  }, [rows, q, countryFilter, sizeFilter, betaOnly]);

  const selected = filtered.find((r) => r.id === selectedId) ?? filtered[0] ?? null;

  function patchLocal(id: string, patch: Partial<SurveyResponse>) {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  }

  async function handleDelete(id: string) {
    await deleteSurveyResponse(id);
    setRows((prev) => prev.filter((r) => r.id !== id));
    setSelectedId((cur) => (cur === id ? null : cur));
  }

  function exportCSV() {
    const flat = filtered.map((r) => ({
      gymName: r.gymName,
      ownerName: r.ownerName,
      country: r.country,
      city: r.city,
      gymType: r.gymType,
      gymSize: sizeLabel(r.gymSize),
      memberRange: r.memberRange,
      currentSoftware: r.currentSoftware,
      operationsMethods: (r.operationsMethods ?? []).join("; "),
      painPoints: labels(PAIN_POINTS, r.painPoints).join("; "),
      biggestPain: r.biggestPain,
      adminHoursPerWeek: r.timeWastedHours ?? "",
      aiInterest: label(AI_INTEREST_LEVELS, r.aiInterest),
      aiFeatures: labels(AI_FEATURES, r.aiFeatures).join("; "),
      wantsWhatsApp: r.wantsWhatsApp ? "yes" : "no",
      pricingTier: label(PRICING_TIERS, r.pricingTier),
      wantsBeta: r.wantsBeta ? "yes" : "no",
      isBetaUser: r.isBetaUser ? "yes" : "no",
      contacted: r.contacted ? "yes" : "no",
      contactName: r.contactName ?? "",
      contactPhone: r.contactPhone ?? "",
      contactEmail: r.contactEmail ?? "",
      preferredContactTime: r.preferredContactTime ?? "",
      adminNotes: r.adminNotes ?? "",
    }));
    const stamp = new Date().toISOString().slice(0, 10);
    downloadFile(`gympilot-responses-${stamp}.csv`, toCSV(flat));
  }

  return (
    <div className="min-h-screen">
      <ProtectedNav />
      <main className="container py-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Responses</h1>
            <p className="text-sm text-muted-foreground">
              {filtered.length} of {rows.length} shown
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={load} disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
              Refresh
            </Button>
            <Button size="sm" onClick={exportCSV} disabled={filtered.length === 0}>
              <Download className="h-4 w-4" /> Export CSV
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6 grid gap-3 md:grid-cols-[1fr_auto_auto_auto]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search gym, owner, country, city, pain point…"
              className="pl-9"
            />
          </div>
          <Select value={countryFilter} onValueChange={setCountryFilter}>
            <SelectTrigger className="min-w-[150px]"><SelectValue placeholder="Country" /></SelectTrigger>
            <SelectContent className="max-h-72">
              <SelectItem value="all">All countries</SelectItem>
              {countries.map((c) => (
                <SelectItem key={c} value={c}>{c}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={sizeFilter} onValueChange={setSizeFilter}>
            <SelectTrigger className="min-w-[150px]"><SelectValue placeholder="Size" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All sizes</SelectItem>
              {GYM_SIZES.map((g) => (
                <SelectItem key={g.value} value={g.value}>{g.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            variant={betaOnly ? "default" : "outline"}
            onClick={() => setBetaOnly((v) => !v)}
            className="whitespace-nowrap"
          >
            <Star className={cn("h-4 w-4", betaOnly && "fill-current")} /> Beta only
          </Button>
        </div>

        {error && (
          <p className="mb-6 rounded-md bg-destructive/10 px-4 py-3 text-sm text-destructive">{error}</p>
        )}

        {loading && rows.length === 0 ? (
          <div className="flex h-64 items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex h-64 flex-col items-center justify-center gap-2 text-muted-foreground">
            <Users className="h-8 w-8" />
            <p>No responses match your filters.</p>
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[minmax(0,380px)_1fr]">
            {/* List */}
            <div className="space-y-2 lg:max-h-[calc(100vh-260px)] lg:overflow-y-auto lg:pr-2">
              {filtered.map((r) => (
                <button
                  key={r.id}
                  onClick={() => setSelectedId(r.id ?? null)}
                  className={cn(
                    "w-full rounded-xl border p-4 text-left transition-colors",
                    selected?.id === r.id
                      ? "border-primary bg-primary/5"
                      : "border-border bg-card hover:border-primary/40"
                  )}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="truncate font-medium">{r.gymName || "Unnamed gym"}</span>
                    <div className="flex shrink-0 gap-1">
                      {r.isBetaUser && <Badge variant="success">Beta</Badge>}
                      {r.contacted && <Badge variant="secondary">Contacted</Badge>}
                    </div>
                  </div>
                  <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{r.ownerName}</span>
                    <span>·</span>
                    <span className="truncate">{[r.city, r.country].filter(Boolean).join(", ")}</span>
                    <span>·</span>
                    <span className="shrink-0">{sizeLabel(r.gymSize)}</span>
                  </div>
                </button>
              ))}
            </div>

            {/* Detail */}
            {selected && (
              <ResponseDetail
                key={selected.id}
                response={selected}
                onPatch={(patch) => selected.id && patchLocal(selected.id, patch)}
                onDelete={async () => {
                  if (selected.id) await handleDelete(selected.id);
                }}
              />
            )}
          </div>
        )}
      </main>
    </div>
  );
}

// ---------------------------------------------------------------------------

function ResponseDetail({
  response,
  onPatch,
  onDelete,
}: {
  response: SurveyResponse;
  onPatch: (patch: Partial<SurveyResponse>) => void;
  onDelete: () => Promise<void>;
}) {
  const [notes, setNotes] = useState(response.adminNotes ?? "");
  const [savingNotes, setSavingNotes] = useState(false);
  const [busy, setBusy] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  useEffect(() => {
    setNotes(response.adminNotes ?? "");
    setConfirmDelete(false);
    setDeleteError("");
  }, [response.id, response.adminNotes]);

  async function handleConfirmedDelete() {
    setDeleting(true);
    setDeleteError("");
    try {
      await onDelete();
    } catch (err) {
      setDeleting(false);
      setConfirmDelete(false);
      setDeleteError(err instanceof Error ? err.message : "Failed to delete.");
    }
  }

  async function toggle(field: "isBetaUser" | "contacted") {
    if (!response.id) return;
    const value = !response[field];
    setBusy(field);
    try {
      await updateSurveyResponse(response.id, { [field]: value });
      onPatch({ [field]: value });
    } finally {
      setBusy(null);
    }
  }

  async function saveNotes() {
    if (!response.id) return;
    setSavingNotes(true);
    try {
      await updateSurveyResponse(response.id, { adminNotes: notes });
      onPatch({ adminNotes: notes });
    } finally {
      setSavingNotes(false);
    }
  }

  const waLink = response.contactPhone
    ? `https://wa.me/${response.contactPhone.replace(/[^\d]/g, "")}`
    : null;

  return (
    <div className="space-y-5 rounded-xl border border-border bg-card p-6">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold">{response.gymName || "Unnamed gym"}</h2>
          <p className="text-sm text-muted-foreground">
            {response.ownerName} · {response.gymType || "—"} ·{" "}
            {[response.city, response.country].filter(Boolean).join(", ")}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            size="sm"
            variant={response.isBetaUser ? "default" : "outline"}
            onClick={() => toggle("isBetaUser")}
            disabled={busy === "isBetaUser"}
          >
            {busy === "isBetaUser" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Star className={cn("h-4 w-4", response.isBetaUser && "fill-current")} />}
            {response.isBetaUser ? "Beta user" : "Mark beta"}
          </Button>
          <Button
            size="sm"
            variant={response.contacted ? "default" : "outline"}
            onClick={() => toggle("contacted")}
            disabled={busy === "contacted"}
          >
            {busy === "contacted" ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
            {response.contacted ? "Contacted" : "Mark contacted"}
          </Button>
        </div>
      </div>

      {/* Contact actions */}
      {(response.contactPhone || response.contactEmail) && (
        <div className="flex flex-wrap gap-2">
          {waLink && (
            <Button asChild size="sm" variant="secondary">
              <a href={waLink} target="_blank" rel="noreferrer">
                <MessageCircle className="h-4 w-4 text-emerald-400" /> WhatsApp
              </a>
            </Button>
          )}
          {response.contactPhone && (
            <Button asChild size="sm" variant="secondary">
              <a href={`tel:${response.contactPhone}`}><Phone className="h-4 w-4" /> Call</a>
            </Button>
          )}
          {response.contactEmail && (
            <Button asChild size="sm" variant="secondary">
              <a href={`mailto:${response.contactEmail}`}><Mail className="h-4 w-4" /> Email</a>
            </Button>
          )}
          {response.preferredContactTime && (
            <span className="flex items-center text-xs text-muted-foreground">
              Prefers: {response.preferredContactTime}
            </span>
          )}
        </div>
      )}

      {/* Facts grid */}
      <div className="grid gap-4 sm:grid-cols-2">
        <Fact label="Gym size" value={sizeLabel(response.gymSize)} />
        <Fact label="Active members" value={response.memberRange || "—"} />
        <Fact label="Current tools" value={response.currentSoftware || "—"} />
        <Fact label="Admin hours / week" value={response.timeWastedHours != null ? String(response.timeWastedHours) : "—"} />
        <Fact label="AI interest" value={label(AI_INTEREST_LEVELS, response.aiInterest) || "—"} />
        <Fact label="Budget / month" value={label(PRICING_TIERS, response.pricingTier) || "—"} />
      </div>

      <FactList title="Operations" items={response.operationsMethods ?? []} />
      <FactList title="Pain points" items={labels(PAIN_POINTS, response.painPoints)} highlight />
      <FactList title="Wanted AI features" items={labels(AI_FEATURES, response.aiFeatures)} />

      {response.biggestPain && (
        <div>
          <p className="mb-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            &ldquo;If I could fix one thing…&rdquo;
          </p>
          <p className="rounded-lg border border-border bg-background/50 p-3 text-sm italic">
            {response.biggestPain}
          </p>
        </div>
      )}

      {/* Notes */}
      <div>
        <Label htmlFor="notes" className="text-xs uppercase tracking-wider text-muted-foreground">
          Internal notes
        </Label>
        <Textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Add notes after your interview / call…"
          className="mt-2 min-h-[90px]"
        />
        <div className="mt-2 flex justify-end">
          <Button
            size="sm"
            onClick={saveNotes}
            disabled={savingNotes || notes === (response.adminNotes ?? "")}
          >
            {savingNotes ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Save notes
          </Button>
        </div>
      </div>

      {/* Danger zone — delete this response */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-5">
        {deleteError && <p className="text-sm text-destructive">{deleteError}</p>}
        {!confirmDelete ? (
          <Button
            variant="ghost"
            size="sm"
            className="ml-auto text-destructive hover:bg-destructive/10 hover:text-destructive"
            onClick={() => setConfirmDelete(true)}
          >
            <Trash2 className="h-4 w-4" /> Delete response
          </Button>
        ) : (
          <div className="ml-auto flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Delete permanently?</span>
            <Button variant="ghost" size="sm" onClick={() => setConfirmDelete(false)} disabled={deleting}>
              <X className="h-4 w-4" /> Cancel
            </Button>
            <Button variant="destructive" size="sm" onClick={handleConfirmedDelete} disabled={deleting}>
              {deleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
              Yes, delete
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border bg-background/50 p-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 text-sm font-medium">{value}</p>
    </div>
  );
}

function FactList({ title, items, highlight }: { title: string; items: string[]; highlight?: boolean }) {
  if (!items.length) return null;
  return (
    <div>
      <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">{title}</p>
      <div className="flex flex-wrap gap-2">
        {items.map((i) => (
          <Badge key={i} variant={highlight ? "default" : "outline"}>{i}</Badge>
        ))}
      </div>
    </div>
  );
}
