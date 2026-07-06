import {
  MessageCircle,
  RefreshCw,
  Wallet,
  TrendingDown,
  UserPlus,
  BarChart3,
  Dumbbell,
  Bell,
} from "lucide-react";
import { Reveal } from "@/components/site/reveal";

const FEATURES = [
  {
    icon: MessageCircle,
    title: "AI WhatsApp Assistant",
    desc: "Answers member questions, books slots, and sends reminders on WhatsApp — automatically, 24/7.",
  },
  {
    icon: RefreshCw,
    title: "Renewal Automation",
    desc: "Never chase a renewal again. Members get timely, personal reminders before they lapse.",
  },
  {
    icon: Wallet,
    title: "Payments & Reconciliation",
    desc: "Track cash, bank, card and mobile wallet payments in one place. Know exactly who owes what.",
  },
  {
    icon: TrendingDown,
    title: "Churn Prediction",
    desc: "AI flags members about to quit — based on attendance drops — so you can win them back.",
  },
  {
    icon: UserPlus,
    title: "Lead Follow-up",
    desc: "Every walk-in and DM followed up automatically until they convert or opt out.",
  },
  {
    icon: Dumbbell,
    title: "AI Diet & Workout Plans",
    desc: "Generate personalised plans in seconds — a premium perk your members will pay for.",
  },
  {
    icon: BarChart3,
    title: "Plain-English Reports",
    desc: "Ask 'how was last month?' and get real numbers — revenue, active members, growth.",
  },
  {
    icon: Bell,
    title: "Smart Broadcasts",
    desc: "Send offers and class updates to the right members at the right time, not everyone at once.",
  },
];

export function Features() {
  return (
    <section id="features" className="border-t border-border/60 py-24">
      <div className="container">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">Features</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            Everything a busy gym needs — with AI doing the boring parts
          </h2>
          <p className="mt-4 text-muted-foreground">
            Built around the real headaches gym owners told us about: renewals, payments,
            retention and endless WhatsApp.
          </p>
        </Reveal>

        <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((f, i) => (
            <Reveal key={f.title} delay={(i % 4) * 0.06}>
              <div className="group h-full rounded-xl border border-border bg-card p-6 transition-colors hover:border-primary/40">
                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <f.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-5 font-semibold">{f.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
