import {
  IconLayoutGrid,
  IconHeadphones,
  IconVideo,
  IconLayoutKanban,
  IconMessages,
  IconFileText,
  IconShieldLock,
  IconChartHistogram,
} from "@tabler/icons-react";

export const features = [
  // {
  //   name: "Channels",
  //   description:
  //     "Organized spaces for everything related to a project, topic or team.",
  //   Icon: IconLayoutGrid, // Represents organized layouts/grids
  // },
  // {
  //   name: "Huddles",
  //   description:
  //     "Lightweight, audio-first conversations to replace scheduled meetings.",
  //   Icon: IconHeadphones, // Represents audio conversations
  // },
  // {
  //   name: "Clips",
  //   description: "Short recordings to quickly share updates with your team.",
  //   Icon: IconVideo, // Represents video clips
  // },
  // {
  //   name: "Canvas",
  //   description:
  //     "Collaborative surfaces that bring together people, content and tools.",
  //   Icon: IconLayoutKanban, // Represents collaborative workspaces
  // },
  {
    name: "Messaging",
    description:
      "Real-time messaging with threads, reactions, and file sharing.",
    Icon: IconMessages, // Directly represents messaging
  },
  {
    name: "Docs",
    description:
      "Create and collaborate on documents right alongside your conversations.",
    Icon: IconFileText, // Represents documents
  },
  {
    name: "Security",
    description:
      "Enterprise-grade security and compliance to keep your data safe.",
    Icon: IconShieldLock, // Represents security
  },
  {
    name: "Analytics",
    description:
      "Gain insights into how your team communicates and collaborates.",
    Icon: IconChartHistogram, // Represents analytics
  },
];

export const highlightItems = [
  {
    title: "Automated Workflows",
    description:
      "Discover intelligent features that automate planning, track progress, and keep your team aligned—so you can focus on building, not managing.",
    image: "/graph1.svg",
    floatElement: {
      image:
        "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f5d3.svg", // 📓 Notebook emoji
      alt: "Automation emoji",
      position: "right" as const,
    },
    position: "right" as const,
  },
  {
    title: "AI-Powered Insights",
    description:
      "Packed with powerful AI tools to help you plan smarter, work faster, and stay in control—without the chaos.",
    image: "/graph2.svg",
    floatElement: {
      image:
        "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f9e0.svg", // 🧠 Brain emoji
      alt: "AI emoji",
      position: "left" as const,
    },
    position: "left" as const,
  },
];
