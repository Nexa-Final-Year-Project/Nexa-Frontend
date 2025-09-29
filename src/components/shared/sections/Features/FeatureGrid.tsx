import { FeatureCard } from "./FeatureCard";
import { features } from "./features-data";

export const FeatureGrid = () => (
  <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
    {features?.map((feature, index) => (
      <FeatureCard
        key={feature.name}
        name={feature.name}
        description={feature.description}
        icon={<feature.Icon />}
        index={index}
      />
    ))}
  </div>
);
