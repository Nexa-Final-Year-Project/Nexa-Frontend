"use client";

import SectionWrapper from "./SectionWrapper";
import { CompanyLogos } from "./customers/CompanyLogos";
import { TestimonialCarousel } from "./customers/TestimonialCarousel";
import StatsSection from "./customers/StatsSection";

const Customers = () => {
  return (
    <div className="bg-gradient-to-b from-background-start to-background-end py-24">
      <div className="max-w-8xl mx-auto px-6 sm:px-8 lg:px-12">
        <CompanyLogos />
        <TestimonialCarousel />
        <StatsSection />
      </div>
    </div>
  );
};

export default SectionWrapper(
  Customers,
  "Trusted by visionaries worldwide",
  "customers",
  "Where industry leaders collaborate",
  "NEXA powers the most innovative teams across the globe, providing the foundation for breakthrough ideas and seamless execution."
);
