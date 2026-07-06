"use client";

import { useState } from "react";
import { CheckCircle2, Loader2, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Reveal } from "@/components/site/reveal";
import { joinWaitingList } from "@/lib/firestore";
import { isFirebaseConfigured } from "@/lib/firebase";

const PERKS = [
  "Founding-member pricing, locked in",
  "Early access before public launch",
  "Direct say in what we build",
  "Free hands-on setup support",
];

export function BetaSignup() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", gymName: "", city: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [error, setError] = useState("");

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim()) return;
    setStatus("loading");
    setError("");
    try {
      if (!isFirebaseConfigured) {
        throw new Error("Firebase isn't configured yet. Add your keys in .env.local.");
      }
      await joinWaitingList(form);
      setStatus("done");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    }
  }

  return (
    <section id="beta" className="border-t border-border/60 py-24">
      <div className="container">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <Reveal>
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">Beta program</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              Be a founding gym
            </h2>
            <p className="mt-4 text-muted-foreground">
              Join the waiting list to get early access and help shape GymPilot AI from day one.
              We&apos;ll only reach out with meaningful updates.
            </p>
            <ul className="mt-8 space-y-3">
              {PERKS.map((p) => (
                <li key={p} className="flex items-center gap-3 text-sm">
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-primary" />
                  {p}
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="rounded-2xl border border-border bg-card p-8">
              {status === "done" ? (
                <div className="flex flex-col items-center py-10 text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Rocket className="h-8 w-8" />
                  </div>
                  <h3 className="mt-6 text-xl font-semibold">You&apos;re on the list! 🎉</h3>
                  <p className="mt-2 max-w-xs text-sm text-muted-foreground">
                    Thanks for joining. We&apos;ll be in touch as we open up early access.
                    Mind taking the 3-minute survey too? It helps a lot.
                  </p>
                  <Button asChild variant="outline" className="mt-6">
                    <a href="/survey">Take the survey</a>
                  </Button>
                </div>
              ) : (
                <form onSubmit={onSubmit} className="space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="beta-name">Your name *</Label>
                    <Input id="beta-name" required value={form.name} onChange={set("name")} placeholder="Ahmed Khan" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="beta-email">Email *</Label>
                    <Input id="beta-email" type="email" required value={form.email} onChange={set("email")} placeholder="you@gym.com" />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="grid gap-2">
                      <Label htmlFor="beta-phone">WhatsApp number</Label>
                      <Input id="beta-phone" value={form.phone} onChange={set("phone")} placeholder="+1 555 123 4567" />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="beta-city">City</Label>
                      <Input id="beta-city" value={form.city} onChange={set("city")} placeholder="Karachi" />
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="beta-gym">Gym name</Label>
                    <Input id="beta-gym" value={form.gymName} onChange={set("gymName")} placeholder="Iron House Fitness" />
                  </div>

                  {status === "error" && (
                    <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>
                  )}

                  <Button type="submit" size="lg" className="w-full" disabled={status === "loading"}>
                    {status === "loading" ? (
                      <>
                        <Loader2 className="animate-spin" /> Joining…
                      </>
                    ) : (
                      "Join the beta list"
                    )}
                  </Button>
                  <p className="text-center text-xs text-muted-foreground">
                    No spam. Unsubscribe anytime.
                  </p>
                </form>
              )}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
