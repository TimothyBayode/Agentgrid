import { MainLayout } from "@/layouts/MainLayout";
import { Hero } from "@/components/landing/Hero";
import { ShowcaseGallery } from "@/components/landing/ShowcaseGallery";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { PricingSection } from "@/components/landing/PricingSection";
import { EnterpriseSection } from "@/components/landing/EnterpriseSection";
import { ResourcesSection } from "@/components/landing/ResourcesSection";
import { TestimonialStrip } from "@/components/landing/TestimonialStrip";
import { CTASection } from "@/components/landing/CTASection";
import { Footer } from "@/components/landing/Footer";

export default function LandingPage() {
  return (
    <MainLayout>
      <Hero />
      <ShowcaseGallery />
      <FeaturesSection />
      <HowItWorks />
      <PricingSection />
      <EnterpriseSection />
      <ResourcesSection />
      <TestimonialStrip />
      <CTASection />
      <Footer />
    </MainLayout>
  );
}
