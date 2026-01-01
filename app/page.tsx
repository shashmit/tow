import { Navbar } from "@/components/navbar";
import { HeroSection } from "@/components/hero-section";
import { PhilosophySection } from "@/components/philosophy-section";
import { CounselorJourney } from "@/components/counselor-journey";
import { Testimonials } from "@/components/testimonials";
import { PricingSection } from "@/components/pricing-section";
import { FAQSection } from "@/components/faq-section";
import { PreFooterCTA } from "@/components/pre-footer-cta";
import { Footer } from "@/components/footer";
import { Marquee } from "@/components/marquee";

export default function Home() {
  return (
    <main className="min-h-screen bg-background font-sans selection:bg-black/10 selection:text-black">
      <Marquee />
      <Navbar />
      <HeroSection />
      <PhilosophySection />
      <CounselorJourney />
      <Testimonials />
      <PricingSection />
      <FAQSection />
      <PreFooterCTA />
      <Footer />
    </main>
  );
}
