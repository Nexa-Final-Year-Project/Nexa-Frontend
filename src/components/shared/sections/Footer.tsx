"use client";
import React from "react";
import { AnimatedDiv } from "../AnimatedDiv";
import {
  MENU_ITEMS,
  SOCIAL_MEDIA_LINKS,
} from "@/lib/constants/menu/menuConstants";
import Link from "next/link";
import Image from "next/image";
import Logo from "../Logo";

const footerLinks = [
  {
    title: "Links",
    links: [
      { name: "Construction Takeoffs", href: "/services/takeoffs" },
      { name: "Cost Estimation", href: "/services/estimation" },
      { name: "Bid Preparation", href: "/services/bid-preparation" },
      { name: "Value Engineering", href: "/services/value-engineering" },
    ],
  },
  {
    title: "Company",
    links: [
      { name: "About Us", href: "/about" },
      { name: "Our Portfolio", href: "/portfolio" },
      { name: "Trades", href: "/construction-trades" },
    ],
  },
];

const Footer = () => {
  return (
    <div className="container mx-auto p-12">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
        <div className="lg:col-span-1">
          <Logo />
          <p className="text-gray-400 mt-4 mb-6">
            An all-in-one project management solution to streamline workflows,
            enhance collaboration, and boost productivity.
          </p>
          <div className="flex space-x-4">
            {SOCIAL_MEDIA_LINKS.map((social) => (
              <Link
                href={social.url}
                key={social.platform}
                className="bg-dark-800 hover:bg-gold-600 text-gray-400 hover:text-stone-cable w-10 h-10 rounded-full flex items-center justify-center transition-colors"
                aria-label={social.platform}
                target="_blank"
                rel="noopener noreferrer"
              >
                <social.Icon />
              </Link>
            ))}
          </div>
        </div>
        {/* Brand Column */}

        {/* Link Columns */}
        {footerLinks.map((column, index) => (
          <AnimatedDiv
            key={index}
            direction="up"
            delay={0.1 * index}
            duration={0.75}
            className="space-y-4 text-white"
          >
            <h3 className="text-lg font-semibold mb-4">{column.title}</h3>
            <ul className="space-y-3">
              {column.links.map((link, i) => (
                <li key={i}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-stone-cable transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </AnimatedDiv>
        ))}

        {/* Contact Column */}
        <AnimatedDiv
          variant="fade"
          direction="up"
          delay={0.3}
          duration={0.75}
          className="space-y-4"
        >
          <h3 className="text-lg font-semibold text-white mb-4 ">Contact Us</h3>
          <address className="text-gray-400 not-italic space-y-3">
            <div className="flex items-start">
              <svg
                className="flex-shrink-0 w-5 h-5 text-gold-500 mr-3 mt-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                ></path>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                ></path>
              </svg>
              <span>123 Estimation Way, New York, NY 10001</span>
            </div>

            <div className="flex items-start">
              <svg
                className="flex-shrink-0 w-5 h-5 text-gold-500 mr-3 mt-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                ></path>
              </svg>
              <Link
                href="tel:+12125551234"
                className="hover:text-gold-400 transition-colors"
              >
                (212) 555-1234
              </Link>
            </div>

            <div className="flex items-start">
              <svg
                className="flex-shrink-0 w-5 h-5 text-gold-500 mr-3 mt-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                ></path>
              </svg>
              <Link
                href="mailto:info@nexa.com"
                className="hover:text-gold-400 transition-colors"
              >
                info@nexa.com
              </Link>
            </div>
          </address>
        </AnimatedDiv>
      </div>

      {/* Bottom Bar */}
      <AnimatedDiv
        variant="fade"
        direction="up"
        delay={0.5}
        duration={0.75}
        className="border-t border-dark-800 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center"
      >
        <p className="text-gray-500 text-sm mb-4 md:mb-0">
          &copy; {new Date().getFullYear()} NEXA. All rights reserved.
        </p>

        <div className="flex space-x-6">
          <Link
            href="/privacy"
            className="text-gray-500 hover:text-gold-400 text-sm transition-colors"
          >
            Privacy Policy
          </Link>
          <Link
            href="/terms"
            className="text-gray-500 hover:text-gold-400 text-sm transition-colors"
          >
            Terms of Service
          </Link>
          <Link
            href="/cookies"
            className="text-gray-500 hover:text-gold-400 text-sm transition-colors"
          >
            Cookie Policy
          </Link>
        </div>
      </AnimatedDiv>
    </div>
  );
};

export default Footer;
