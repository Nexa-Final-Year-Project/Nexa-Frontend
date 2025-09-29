// utils/redirect.ts

import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

export function redirectAfterLogin(
  router: AppRouterInstance,
  searchParams: URLSearchParams
) {
  const next = searchParams.get("next");
  const prev = searchParams.get("prev");

  if (next) {
    router.push(next);
  } else if (prev) {
    router.push(prev);
  } else {
    router.push("/dashboard");
  }
}
