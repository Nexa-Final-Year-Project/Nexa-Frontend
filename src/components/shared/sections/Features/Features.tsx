"use client";

import SectionWrapper from "../SectionWrapper";
import { FeatureGrid } from "./FeatureGrid";
import { FeatureHighlight } from "./FeatureHighlight";
import { highlightItems } from "./features-data";

const Features = () => {
  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mt-10">
          <FeatureGrid />
        </div>
        <FeatureHighlight items={highlightItems} />
      </div>
    </div>
  );
};

export default SectionWrapper(
  Features,
  "Features",
  "features",
  "A better way to work together",
  "NEXA brings all your communication together in one place. It's real-time messaging, archiving and search for modern teams."
);
