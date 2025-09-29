// components/FloatingFeature.tsx
"use client";
import { motion } from "framer-motion";

type Feature = {
  title: string;
  description: string;
  img: string;
  floatLeft?: boolean;
};

export default function FloatingFeature({ feature }: { feature: Feature }) {
  return (
    <motion.section
      className="relative py-24 flex items-center max-w-6xl mx-auto"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={{
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
      }}
    >
      {feature.floatLeft ? (
        <>
          <motion.img
            src={feature.img}
            alt={feature.title}
            className="w-1/2 rounded-xl shadow-glass"
            initial={{ x: -100, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
          />
          <div className="ml-12 text-left">
            <h3 className="text-heading-1 primary-text-neon mb-4">
              {feature.title}
            </h3>
            <p className="text-foreground opacity-80">{feature.description}</p>
          </div>
        </>
      ) : (
        <>
          <div className="mr-12 text-right">
            <h3 className="text-heading-1 primary-text-neon mb-4">
              {feature.title}
            </h3>
            <p className="text-foreground opacity-80">{feature.description}</p>
          </div>
          <motion.img
            src={feature.img}
            alt={feature.title}
            className="w-1/2 rounded-xl shadow-glass"
            initial={{ x: 100, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
          />
        </>
      )}
    </motion.section>
  );
}
