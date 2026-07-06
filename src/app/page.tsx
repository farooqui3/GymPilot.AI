import { Navbar } from "@/components/site/navbar";
import { Footer } from "@/components/site/footer";
import { Hero } from "@/components/landing/hero";
import { Features } from "@/components/landing/features";
import { Mockups } from "@/components/landing/mockups";
import { Benefits } from "@/components/landing/benefits";
import { SurveyCTA } from "@/components/landing/survey-cta";
import { FAQ } from "@/components/landing/faq";
import { BetaSignup } from "@/components/landing/beta-signup";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Features />
        <Mockups />
        <Benefits />
        <SurveyCTA />
        <FAQ />
        <BetaSignup />
      </main>
      <Footer />
    </>
  );
}
