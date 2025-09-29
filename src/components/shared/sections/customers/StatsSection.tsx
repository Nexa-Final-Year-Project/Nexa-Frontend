"use client";
import { AnimatedDiv } from "../../AnimatedDiv";
import SectionWrapper from "../SectionWrapper";

const stats = [
  { value: "95%", label: "Customer satisfaction" },
  { value: "10M+", label: "Daily active users" },
  { value: "150+", label: "Countries served" },
  { value: "4.9/5", label: "Average rating" },
];

const StatsSection = () => {
  return (
    <AnimatedDiv variant="fade" delay={1} className="mt-12">
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <AnimatedDiv
            key={index}
            variant="fade"
            direction="up"
            delay={0.2 * index}
            className="glass-card p-8 text-center transition-all duration-500 "
          >
            <p className="text-5xl font-bold text-foreground mb-2">
              {stat.value}
            </p>
            <p className="text-lg text-foreground">{stat.label}</p>
          </AnimatedDiv>
        ))}
      </div>
    </AnimatedDiv>
  );
};

export default SectionWrapper(
  StatsSection,
  "Customer Stats",
  "stats",
  "Trusted by millions",
  "Join the community that relies on NEXA for seamless collaboration and productivity."
);
