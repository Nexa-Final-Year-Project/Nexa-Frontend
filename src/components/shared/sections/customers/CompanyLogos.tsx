"use client";

import { AnimatedDiv } from "../../AnimatedDiv";

const logos = [
  {
    name: "Airbnb",
    avatar: "https://api.dicebear.com/7.x/initials/svg?seed=Airbnb&scale=80",
  },
  {
    name: "NASA",
    avatar: "https://api.dicebear.com/7.x/initials/svg?seed=NASA&scale=80",
  },
  {
    name: "Uber",
    avatar: "https://api.dicebear.com/7.x/initials/svg?seed=Uber&scale=80",
  },
  {
    name: "Target",
    avatar: "https://api.dicebear.com/7.x/initials/svg?seed=Target&scale=80",
  },
  {
    name: "NYT",
    avatar: "https://api.dicebear.com/7.x/initials/svg?seed=NYT&scale=80",
  },
  {
    name: "Spotify",
    avatar: "https://api.dicebear.com/7.x/initials/svg?seed=Spotify&scale=80",
  },
];

export const CompanyLogos = () => {
  return (
    <>
      <AnimatedDiv variant="fade" direction="up" delay={0.1}>
        <div className="relative">
          <div className="absolute mb-14 inset-0 flex items-center">
            <div className="w-full border-t border-glass-border" />
          </div>
          <div className="relative flex justify-center">
            <span className="glass-card-sm text-white px-4 mt-8 text-sm font-medium">
              TRUSTED BY INDUSTRY LEADERS
            </span>
          </div>
        </div>
      </AnimatedDiv>

      <AnimatedDiv variant="stagger" className="mt-16">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-3 lg:grid-cols-6">
          {logos.map((company, index) => (
            <AnimatedDiv
              key={company.name}
              variant="fade"
              direction="up"
              delay={0.1 * (index + 1)}
              className="col-span-1 flex justify-center"
            >
              <div className="glass-card-sm p-6 flex items-center justify-center hover:shadow-neon transition-all duration-500 hover:scale-105">
                <img
                  className="h-10 object-contain grayscale hover:grayscale-0 transition-all duration-500"
                  src={company.avatar}
                  alt={company.name}
                  loading="lazy"
                />
              </div>
            </AnimatedDiv>
          ))}
        </div>
      </AnimatedDiv>
    </>
  );
};
