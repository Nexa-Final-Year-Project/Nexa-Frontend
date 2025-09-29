import {
  IconBrandGoogle,
  IconBrandSlack,
  IconBrandGithub,
} from "@tabler/icons-react";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";

import { SiSlack } from "react-icons/si";

export type SocialProvider =
  | "google"
  | "slack"
  | "github"
  | "apple"
  | "microsoft";

export type ProviderConfig = {
  Icon: React.ComponentType<any>;
  label: string;
  brandColor: string;
  textColor: string;
};

export const providers: Record<SocialProvider, ProviderConfig | undefined> = {
  google: {
    Icon: FcGoogle,
    label: "Continue with Google",
    brandColor: "#292d49",
    textColor: "",
  },
  slack: {
    Icon: SiSlack,
    label: "Continue with Slack",
    brandColor: "#292d49",
    textColor: "#292d49",
  },
  github: {
    Icon: FaGithub,
    label: "Continue with GitHub",
    brandColor: "#292d49",
    textColor: "#333333",
  },
  apple: undefined,
  microsoft: undefined,
  //   apple: {
  //     icon: <span className="h-5 w-5 text-lg"></span>,
  //     label: "Continue with Apple",
  //     brandColor: "#000000",
  //     textColor: "#000000",
  //   },
  //   microsoft: {
  //     icon: <span className="h-5 w-5 text-lg"></span>,
  //     label: "Continue with Microsoft",
  //     brandColor: "#0078D4",
  //     textColor: "#0078D4",
  //   },
};
