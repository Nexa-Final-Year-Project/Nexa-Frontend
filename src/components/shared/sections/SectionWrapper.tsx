import React, { ReactNode, ComponentType } from "react";
import { motion } from "framer-motion";
import { staggerContainer } from "@/lib/animations/stagger";
import { AnimatedDiv } from "../AnimatedDiv";

// This is the HOC
const SectionWrapper = <P extends object>(
  WrappedComponent: ComponentType<P>,
  title: string,
  id: string,
  heading: string,
  description?: string
) => {
  // Return a new functional component that wraps the input component
  const HOC = (props: P) => {
    return (
      <motion.section
        className="w-full max-w-6xl mx-auto px-6 py-20 md:py-40 "
        id={id}
        animate={{ opacity: 1 }}
        initial={{ opacity: 0 }}
        variants={staggerContainer}
      >
        <div className="lg:text-center">
          <AnimatedDiv
            variant="fade"
            direction="up"
            delay={0.1}
            className="bg-gradient-stone-cable p-4 rounded-full w-fit m-auto mb-4 text-center text-primary-foreground"
          >
            <h2 className="text-base  font-semibold tracking-wide uppercase">
              {title}
            </h2>
          </AnimatedDiv>
          <AnimatedDiv variant="fade" direction="up" delay={0.2}>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-foreground sm:text-4xl">
              {heading}
            </p>
          </AnimatedDiv>
          <AnimatedDiv
            variant="fade"
            direction="up"
            delay={0.3}
            className="text-stoneGradient"
          >
            <p className="mt-4 max-w-2xl  lg:mx-auto">{description}</p>
          </AnimatedDiv>
        </div>

        <WrappedComponent {...props} />
      </motion.section>
    );
  };

  return HOC;
};

export default SectionWrapper;
