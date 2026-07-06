import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Reveal } from "@/components/site/reveal";

const FAQS = [
  {
    q: "Is this available yet?",
    a: "Not yet — we're in the discovery stage. We're talking to gym owners around the world to make sure we build exactly what you need before writing the full product. Your survey answers directly shape what we ship first.",
  },
  {
    q: "How much will it cost?",
    a: "Pricing isn't finalised — that's part of what we're validating. The survey asks what feels fair to you, and beta members will get founding-member pricing when we launch.",
  },
  {
    q: "Do I need to be technical to use it?",
    a: "No. GymPilot is designed for gym owners, not IT teams. If you can use WhatsApp, you can use GymPilot. Setup help is included for beta members.",
  },
  {
    q: "Will it work with WhatsApp and my local payment methods?",
    a: "That's the plan. We're building around the tools gyms already use — WhatsApp for messaging and popular local payment methods for collections. Tell us in the survey which ones matter most to you.",
  },
  {
    q: "What happens to my data?",
    a: "Your data stays yours. We use secure, industry-standard cloud infrastructure and will never sell your members' information. During beta we only use anonymised, aggregated insights to improve the product.",
  },
  {
    q: "What do I get for joining the beta?",
    a: "Early access before public launch, founding-member pricing locked in, direct input into features, and hands-on setup support. In return, we'd love your honest feedback.",
  },
];

export function FAQ() {
  return (
    <section id="faq" className="border-t border-border/60 py-24">
      <div className="container">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">FAQ</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            Questions gym owners ask us
          </h2>
        </Reveal>

        <Reveal className="mx-auto mt-12 max-w-3xl">
          <Accordion type="single" collapsible className="w-full">
            {FAQS.map((f, i) => (
              <AccordionItem key={i} value={`item-${i}`}>
                <AccordionTrigger>{f.q}</AccordionTrigger>
                <AccordionContent>{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>
      </div>
    </section>
  );
}
