import { ReactNode } from "react";
import { AnimatedDiv } from "../../AnimatedDiv";

type FeatureCardProps = {
  name: string;
  description: string;
  icon: ReactNode;
  index: number;
};

export const FeatureCard = ({
  name,
  description,
  icon,
  index,
}: FeatureCardProps) => (
  <AnimatedDiv
    variant="fade"
    direction="up"
    delay={0.1 * (index + 1)}
    className="glass-card p-6"
  >
    <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-gradient-stone-cable text-primary-foreground">
      {icon}
    </div>
    <div className="ml-16">
      <h3 className="text-lg leading-6 font-medium text-foreground">{name}</h3>
      <p className="mt-2 text-base text-muted-foreground">{description}</p>
    </div>
  </AnimatedDiv>
);
