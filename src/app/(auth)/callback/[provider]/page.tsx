"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getAuth, signInWithCustomToken } from "firebase/auth";
import { app } from "@/lib/firebase/firebase";
import { jwtDecode } from "jwt-decode";
import { useAuthStore } from "@/store/auth/authStore";
import { useHandleLoginSuccess } from "@/hooks/auth/useHandleLoginSuccess";
import { useAuthRedirect } from "@/hooks/auth/useAuthRedirect";

interface DecodedToken {
  name?: string;
  email?: string;
  picture?: string;
  user_id: string;
  [key: string]: any;
}

export default function OAuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setUser } = useAuthStore();
  const { next, setNext } = useAuthRedirect();

  useEffect(() => {
    const token = searchParams.get("token");

    if (!token) {
      router.replace("/login?error=oauth_failed");
      return;
    }

    const auth = getAuth(app);

    signInWithCustomToken(auth, token)
      .then(async (userCredential) => {
        const idToken = await userCredential.user.getIdToken();
        const decoded: DecodedToken = jwtDecode(idToken);
        console.log("Decoded Token:", decoded);

        const userData = {
          uid: decoded.user_id.split("-")[1],
          id: decoded.userId,
          name: decoded.name || "",
          email: decoded.email || "",
          photoURL: decoded.picture || "",
          token: idToken,
          createdAt: new Date().toISOString(),
        };

        // Persist locally
        localStorage.setItem("authToken", idToken);
        localStorage.setItem("userData", JSON.stringify(userData));

        // Store token expiry time
        if (decoded.exp) {
          const expiryTime = decoded.exp * 1000; // Convert to milliseconds
          useAuthStore.getState().setTokenExpiry(expiryTime);
        }

        setUser(userData);
        if (next) {
          router.push(next);
          sessionStorage.removeItem("next");
          setNext(null);
        } else {
          router.push(`/u/${userData.uid}`);
        }
      })
      .catch((error) => {
        console.error("Firebase sign-in failed:", error);
        router.replace("/login?error=auth_failed");
      });
  }, [router, searchParams, setUser]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <p className="mb-2 text-gray-600">Signing you in...</p>
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
      </div>
    </div>
  );
}
