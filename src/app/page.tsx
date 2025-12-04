import Header from "@/components/shared/Header/Header";
import Hero from "@/components/shared/sections/Hero";
import Features from "@/components/shared/sections/Features/Features";
import About from "@/components/shared/sections/About";
import Testimonials from "@/components/shared/sections/Testimonials";
import Footer from "@/components/shared/sections/Footer";
import CTA from "@/components/shared/sections/CTA";
import HowItWorks from "@/components/shared/sections/HowItWorks";
import Stats from "@/components/shared/sections/Stats";
import FAQ from "@/components/shared/sections/FAQ";
import Integrations from "@/components/shared/sections/Integrations";

export default function Home() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background gradient mesh */}
      <div className="fixed inset-0 -z-20 bg-gradient-to-b from-neutral-950 via-neutral-900 to-neutral-950 dark:block hidden" />
      <div className="fixed inset-0 -z-10 opacity-30 dark:block hidden" style={{
        backgroundImage: `radial-gradient(circle at 25% 25%, rgba(139, 92, 246, 0.15) 0%, transparent 50%),
                          radial-gradient(circle at 75% 75%, rgba(16, 185, 129, 0.1) 0%, transparent 50%)`
      }} />

      {/* Navigation */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-background/80 border-b border-white/5">
        <div className="mx-auto max-w-7xl px-4 py-4">
          <Header />
        </div>
      </header>

      {/* Main Content */}
      <main>
        {/* Hero Section */}
        <section className="px-4 sm:px-6 lg:px-8">
          <Hero />
        </section>

        {/* About Section */}
        <section className="px-4 sm:px-6 lg:px-8">
          <About />
        </section>

        {/* How It Works Section */}
        <section className="px-4 sm:px-6 lg:px-8">
          <HowItWorks />
        </section>

        {/* Features Section */}
        <section className="px-4 sm:px-6 lg:px-8">
          <Features />
        </section>

        {/* Stats Section */}
        <section className="px-4 sm:px-6 lg:px-8">
          <Stats />
        </section>

        {/* Integrations Section */}
        <section className="px-4 sm:px-6 lg:px-8">
          <Integrations />
        </section>

        {/* Testimonials Section */}
        <section className="px-4 sm:px-6 lg:px-8">
          <Testimonials />
        </section>

        {/* FAQ Section */}
        <section className="px-4 sm:px-6 lg:px-8">
          <FAQ />
        </section>

        {/* CTA Section */}
        <section className="px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-5xl mx-auto">
            <CTA />
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 mt-20">
        <Footer />
      </footer>
    </div>
  );
}
