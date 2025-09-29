"use client";

import { Button } from "@/components/ui/button/Button";
import { AnimatedDiv } from "../AnimatedDiv";
import Link from "next/link";

const CTA = () => {
  return (
    <div className="bg-gradient-stone-cable rounded-2xl">
      <div className="max-w-2xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
        <AnimatedDiv variant="fade" direction="up">
          <h2 className="text-3xl font-extrabold text-primary-foreground sm:text-4xl">
            <span className="block">Ready to try NEXA?</span>
            <span className="block">Get started for free today.</span>
          </h2>
          <p className="mt-4 text-lg leading-6 text-primary-foreground/80">
            Join over 10 million people who use Slack to connect their teams.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
            <AnimatedDiv variant="fade" direction="right" delay={0.2}>
              <Link href="/register">
                <Button className="neon-button" variant="outline" color="white">
                  Sign up with email
                </Button>
              </Link>
            </AnimatedDiv>
          </div>
        </AnimatedDiv>
      </div>
    </div>
  );
};

export default CTA;
