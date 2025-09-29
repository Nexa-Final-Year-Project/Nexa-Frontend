import { Button } from "@/components/ui/button/Button";
import Link from "next/link";
import React from "react";
const Hero = () => {
  return (
    <section className="max-w-6xl mx-auto  h-screen flex flex-col items-center">
      <div className=" max-w-4xl mx-auto text-center mt-32">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 primary-text-neon ">
          Project Management{" "}
          <span className="text-gradient-stone">Evolved</span>
        </h1>
        <p className="text-lg md:text-xl mb-8 opacity-80 max-w-2xl mx-auto">
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
