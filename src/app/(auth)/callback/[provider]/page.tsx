"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getAuth, signInWithCustomToken } from "firebase/auth";
import { app } from "@/lib/firebase/firebase";
import { jwtDecode } from "jwt-decode";
import { useAuthStore } from "@/store/auth/authStore";
import { useAuthRedirect } from "@/hooks/auth/useAuthRedirect";
import { useTheme } from "next-themes";
import { Loader2, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

interface DecodedToken {
  name?: string;
  email?: string;
  picture?: string;
  user_id?: string;
  userId?: string;
  exp?: number;
  [key: string]: any;
}

export default function OAuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setUser } = useAuthStore();
  const { next, setNext } = useAuthRedirect();
  const { theme, resolvedTheme } = useTheme();
  const [statusText, setStatusText] = useState("Signing you in...");
  const hasProcessedRef = useRef(false);
  const currentTheme = theme === "system" ? resolvedTheme : theme;
  const isDark = currentTheme === "dark";

  const buildUserData = (decoded: DecodedToken, fallbackUid: string) => {
    const rawUid = decoded.user_id || fallbackUid;
    const uid = rawUid.includes("-")
      ? rawUid.split("-").slice(1).join("-")
      : rawUid;

    return {
      uid,
      id: decoded.userId || fallbackUid,
      name: decoded.name || "",
      email: decoded.email || "",
      photoURL: decoded.picture || "",
      token: "",
      createdAt: new Date().toISOString(),
    };
  };

  useEffect(() => {
    if (hasProcessedRef.current) {
      return;
    }
    hasProcessedRef.current = true;

    const handleOAuth = async () => {
      const token = searchParams.get("token");
      const auth = getAuth(app);

      if (!token) {
        if (auth.currentUser) {
          const idToken = await auth.currentUser.getIdToken();
          const decoded: DecodedToken = jwtDecode(idToken);
          const userData = buildUserData(decoded, auth.currentUser.uid);
          userData.token = idToken;

          localStorage.setItem("authToken", idToken);
          localStorage.setItem("userData", JSON.stringify(userData));
          setUser(userData);
          router.replace(`/u/${userData.uid}`);
          return;
        }

        router.replace("/login?error=oauth_failed");
        return;
      }

      try {
        const userCredential = await signInWithCustomToken(auth, token);
        setStatusText("Finalizing your workspace...");

        const idToken = await userCredential.user.getIdToken();
        const decoded: DecodedToken = jwtDecode(idToken);
        const userData = buildUserData(decoded, userCredential.user.uid);
        userData.token = idToken;

        localStorage.setItem("authToken", idToken);
        localStorage.setItem("userData", JSON.stringify(userData));

        if (decoded.exp) {
          useAuthStore.getState().setTokenExpiry(decoded.exp * 1000);
        }

        setUser(userData);

        if (next) {
          sessionStorage.removeItem("next");
          setNext(null);
          router.replace(next);
        } else {
          router.replace(`/u/${userData.uid}`);
        }
      } catch (error) {
        console.error("Firebase sign-in failed:", error);
        router.replace("/login?error=auth_failed");
      }
    };

    void handleOAuth();
  }, [router, searchParams, setUser, next, setNext]);

  return (
    <div className="w-full max-w-md px-2 sm:px-0">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={`relative w-full max-w-md rounded-2xl border p-7 backdrop-blur-md ${
          isDark
            ? "bg-neutral-900/70 border-white/10"
            : "bg-white/90 border-neutral-200"
        }`}
      >
        <div className="flex items-center justify-center mb-5">
          <div
            className={`h-12 w-12 rounded-xl flex items-center justify-center ${
              isDark ? "bg-emerald-500/15" : "bg-emerald-100"
            }`}
          >
            <ShieldCheck
              className={`h-6 w-6 ${
                isDark ? "text-emerald-400" : "text-emerald-600"
              }`}
            />
          </div>
        </div>

        <h1
          className={`text-center text-lg font-semibold mb-1 ${
            isDark ? "text-white" : "text-neutral-900"
          }`}
        >
          Signing you in
        </h1>
        <p
          className={`text-center text-sm mb-5 ${
            isDark ? "text-neutral-400" : "text-neutral-600"
          }`}
        >
          {statusText}
        </p>

        <div className="flex items-center justify-center gap-2 mb-4">
          <Loader2
            className={`h-4 w-4 animate-spin ${
              isDark ? "text-emerald-400" : "text-emerald-600"
            }`}
          />
          <span
            className={`text-xs ${
              isDark ? "text-neutral-500" : "text-neutral-500"
            }`}
          >
            Secure authentication in progress
          </span>
        </div>

        <div
          className={`h-1 w-full rounded-full overflow-hidden ${
            isDark ? "bg-white/10" : "bg-neutral-200"
          }`}
        >
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: "200%" }}
            transition={{ repeat: Infinity, duration: 1.3, ease: "linear" }}
            className={`h-full w-1/3 rounded-full ${
              isDark ? "bg-emerald-400/80" : "bg-emerald-500"
            }`}
          />
        </div>
      </motion.div>
    </div>
  );
}
