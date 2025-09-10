import HeroSection from "@/components/Landing/hero";
import Header from "@/components/Layout/header";
import Features from "@/components/Landing/features";
import Trust from "@/components/Landing/trust";
import CallToAction from "@/components/Landing/cta";
import Footer from "@/components/Layout/footer";

export default function Home() {
  return (
    <main className="min-h-screen w-full bg-background text-foreground">
      <Header />
      <HeroSection />
      <Features />
      <Trust />
      <CallToAction />
      <Footer />
    </main>
  )
}