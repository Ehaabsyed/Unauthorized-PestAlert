import { HeroSection } from '@/components/landing/hero-section'
import { FeaturesSection } from '@/components/landing/features-section'
import { AnalyticsPreview } from '@/components/landing/analytics-preview'
import { MapPreview } from '@/components/landing/map-preview'
import { TestimonialsSection } from '@/components/landing/testimonials-section'
import { PricingSection } from '@/components/landing/pricing-section'
import { Footer } from '@/components/landing/footer'
import { Navbar } from '@/components/landing/navbar'

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <AnalyticsPreview />
      <MapPreview />
      <TestimonialsSection />
      <PricingSection />
      <Footer />
    </main>
  )
}
