"use client";

import { AnimatedDiv } from "../AnimatedDiv";
import GlowDots from "../GlowDots";
import SectionWrapper from "./SectionWrapper";

const featuresTop = [
  {
    title: "AI-Driven Automation",
    description: "No more manual planning or backlog grooming",
  },
  {
    title: "Real-Time Monitoring",
    description: "Live team updates at a glance",
  },
];

const featuresBottom = [
  {
    title: "Smart Nudges",
    description: "Reminders before things fall behind",
  },
  {
    title: "Seamless Integrations",
    description: "Connect with GitHub, Jira, and more",
  },
];

const AboutUs = () => {
  return (
    <div className="relative flex flex-col items-center space-y-6  mt-20">
      <div className="flex flex-col sm:flex-row gap-6 justify-center">
        {featuresTop.map((feature, index) => (
          <AnimatedDiv
            key={feature.title}
            variant="fade"
            direction="up"
            delay={index * 0.2}
            className="glass-card border border-glass-border text-center rounded-xl w-[280px] sm:w-[300px]"
          >
            <div className="!bg-gradient-stone-cable w-full p-4">
              <h3 className="text-xl font-semibold text-secondary-foreground ">
                {feature.title}
              </h3>
            </div>
            <p className="text-foreground/70 text-sm p-8">
              {feature.description}
            </p>
          </AnimatedDiv>
        ))}
      </div>
      {/* Bottom Row (spread out) */}
      <div className="flex flex-col sm:flex-row justify-between w-[70%] px-4 sm:px-0 mt-8 gap-6">
        {featuresBottom.map((feature, index) => (
          <>
            <AnimatedDiv
              key={feature.title}
              variant="fade"
              direction="up"
              delay={0.4 + index * 0.2}
              className="glass-card border border-glass-border text-center rounded-xl w-[280px] sm:w-[300px] mx-auto sm:mx-0"
            >
              <div className="!bg-gradient-stone-cable w-full p-4">
                <h3 className="text-xl font-semibold text-secondary-foreground ">
                  {feature.title}
                </h3>
              </div>
              <p className="text-foreground/70 text-sm p-8">
                {feature.description}
              </p>
            </AnimatedDiv>
            {index === 0 && (
              <GlowDots
                spacingX={2}
                spacingY={0.5}
                noOfDots={32}
                cols={8}
                color="bg-gradient-stone-cable"
                className="hidden sm:grid mt-6"
              />
            )}
          </>
        ))}
      </div>
    </div>
  );
};

export default SectionWrapper(
  AboutUs,
  "About NEXA",
  "about",
  "Work Smarter, Not Harder",
  "NEXA transforms project management with AI-powered automation and real-time collaboration tools that adapt to your team's needs."
);
