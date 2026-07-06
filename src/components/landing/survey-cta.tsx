import Link from "next/link";
import { ArrowRight, ClipboardList } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/site/reveal";

export function SurveyCTA() {
  return (
    <section className="border-t border-border/60 py-24">
      <div className="container">
        <Reveal>
          <div className="relative overflow-hidden rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/15 via-card to-card p-10 text-center md:p-16">
            <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/20 blur-3xl" />
            <div className="relative">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
                <ClipboardList className="h-7 w-7" />
              </div>
              <h2 className="mx-auto mt-6 max-w-2xl text-3xl font-bold tracking-tight sm:text-4xl">
                Help us build the right thing
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
                Take our 3-minute survey. Every answer directly decides which feature we build
                first — from Excel import to WhatsApp automation. Your voice shapes the product.
              </p>
              <Button asChild size="lg" className="group mt-8">
                <Link href="/survey">
                  Start the survey
                  <ArrowRight className="transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
