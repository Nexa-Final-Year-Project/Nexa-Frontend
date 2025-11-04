import { Button } from "@/components/ui/button/Button";
import Link from "next/link";
import React from "react";

const Hero = () => {
  return (
    // 💡 Changed pt-24 to pt-16 to reduce the top margin and move content up.
    <section className="max-w-6xl mx-auto pt-16">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl text-white md:text-6xl font-bold mb-6 primary-text-neon ">
          Project Management{" "}
          <span className="text-gradient-stone">Evolved</span>
        </h1>
        <p className="text-lg text-white md:text-xl mb-8 opacity-80 max-w-2xl mx-auto">
          Collaborate, track, and deliver projects faster with our intuitive
          management platform.
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/register">
            <Button
              size="lg"
              className="neon-button !bg-gradient-stone-cable"
              variant="filled"
            >
              Start Free Trial
            </Button>
          </Link>
          <Button variant="outline" color="var(--stone-cable)" size="lg">
            <span className="text-foreground">Watch Demo</span>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
