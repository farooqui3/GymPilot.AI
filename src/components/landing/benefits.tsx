import { Clock, TrendingUp, HeartHandshake, ShieldCheck } from "lucide-react";
import { Reveal } from "@/components/site/reveal";

const BENEFITS = [
  {
    icon: Clock,
    title: "Get your time back",
    desc: "Stop spending evenings on reminders and reconciliation. Automation handles the repetitive work so you can coach and grow.",
    stat: "6+ hours saved / week",
  },
  {
    icon: TrendingUp,
    title: "Collect more, faster",
    desc: "Timely, automatic renewal nudges mean fewer lapsed members and less money left on the table each month.",
    stat: "Up to 20% fewer lapses",
  },
  {
    icon: HeartHandshake,
    title: "Keep members longer",
    desc: "Spot at-risk members before they quit and reach out with the right offer. Retention beats acquisition, every time.",
    stat: "Win back silent churners",
  },
  {
    icon: ShieldCheck,
    title: "Know your real numbers",
    desc: "No more guessing from a register. See revenue, active members and trends in plain English, updated live.",
    stat: "Decisions with confidence",
  },
];

export function Benefits() {
  return (
    <section id="benefits" className="border-t border-border/60 py-24">
      <div className="container">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">Why it matters</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            Built to fix what actually costs you money
          </h2>
        </Reveal>

        <div className="mt-16 grid gap-4 md:grid-cols-2">
          {BENEFITS.map((b, i) => (
            <Reveal key={b.title} delay={(i % 2) * 0.08}>
              <div className="flex h-full gap-5 rounded-xl border border-border bg-card p-6">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <b.icon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{b.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{b.desc}</p>
                  <p className="mt-3 text-sm font-medium text-primary">{b.stat}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
