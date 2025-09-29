import {
  IconBrandFacebook,
  IconBrandLinkedin,
  IconBrandTwitter,
} from "@tabler/icons-react";

export const MENU_ITEMS = [
  {
    label: "Home",
    icon: "home",
    path: "/",
  },
  {
    label: "About",
    icon: "info",
    path: "/about",
  },
  {
    label: "Services",
    icon: "briefcase",
    path: "/services",
  },
  {
    label: "Contact",
    icon: "phone",
    path: "/contact",
  },
];

export const FOOTER_ITEMS = [
  {
    label: "Privacy Policy",
    path: "/privacy-policy",
  },
  {
    label: "Terms of Service",
    path: "/terms-of-service",
  },
];

export const SOCIAL_MEDIA_LINKS = [
  {
    platform: "Twitter",
    url: "https://twitter.com/yourprofile",
    Icon: IconBrandTwitter,
  },
  {
    platform: "Facebook",
    url: "https://facebook.com/yourprofile",
    Icon: IconBrandFacebook,
  },
  {
    platform: "LinkedIn",
    url: "https://linkedin.com/in/yourprofile",
    Icon: IconBrandLinkedin,
  },
];
