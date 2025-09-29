import Header from "@/components/shared/Header/Header";
import Hero from "@/components/shared/sections/Hero";
import Features from "@/components/shared/sections/Features/Features";
import About from "@/components/shared/sections/About";
import Testimonials from "@/components/shared/sections/Testimonials";
import Footer from "@/components/shared/sections/Footer";
import CTA from "@/components/shared/sections/CTA";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <div className="mx-auto mb-8 max-w-4xl p-4">
        <Header />
      </div>
      <main className="p-8">
        <Hero />
        <About />
        <Features />
        <Testimonials />
        <div className="md:px-20 lg:px-40">
          <CTA />
        </div>
      </main>

      {/* Footer */}
      <footer className="">
        <div className="p-8">
          <Footer />
        </div>
      </footer>
    </div>
  );
}
