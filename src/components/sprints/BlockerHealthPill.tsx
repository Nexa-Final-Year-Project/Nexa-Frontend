"use client";

import React from "react";
import { useTheme } from "next-themes";
import { Shield } from "lucide-react";

type Props = {
  blockerStatus?: string | null;
  blockerHealthScore?: number | null;
  blockerCount?: number | null;
  blockerUpdatedAt?: string | null;
  compact?: boolean;
  className?: string;
};

const norm = (s?: string | null) => (s || "").trim().toLowerCase();

const pickColor = (status?: string | null, score?: number | null) => {
  const st = norm(status);
  const n = typeof score === "number" ? score : null;
  if (st.includes("healthy") || (n !== null && n >= 75)) return "emerald";
  if (st.includes("risk") || (n !== null && n < 75)) return "amber";
  return "neutral";
};

export default function BlockerHealthPill({
  blockerStatus,
  blockerHealthScore,
  blockerCount,
  blockerUpdatedAt,
  compact = false,
  className = "",
}: Props) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const color = pickColor(blockerStatus, blockerHealthScore);
  const scoreText =
    typeof blockerHealthScore === "number"
      ? `${Math.round(blockerHealthScore)}%`
      : "—";

  const label = blockerStatus
    ? blockerStatus
    : typeof blockerHealthScore === "number"
    ? blockerHealthScore >= 75
      ? "Healthy"
      : "At Risk"
    : "Blockers";

  const titleParts = [
    `Blocker status: ${label}`,
    typeof blockerCount === "number" ? `Blockers: ${blockerCount}` : null,
    blockerUpdatedAt ? `Updated: ${blockerUpdatedAt}` : null,
  ].filter(Boolean);

  const styles =
    color === "emerald"
      ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
      : color === "amber"
      ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
      : "bg-neutral-500/10 text-neutral-400 border border-neutral-500/20";

  return (
    <div
      title={titleParts.join(" • ")}
      className={`inline-flex items-center gap-1.5 rounded-full font-medium ${
        compact ? "px-2 py-0.5 text-[11px]" : "px-2.5 py-1 text-xs"
      } ${styles} ${className}`}
    >
      <Shield className={compact ? "w-3 h-3" : "w-3.5 h-3.5"} />
      <span className="whitespace-nowrap">
        {compact ? scoreText : label}
      </span>
      {!compact && (
        <span className={isDark ? "text-white/30" : "text-neutral-400"}>
          {scoreText}
        </span>
      )}
      {typeof blockerCount === "number" && blockerCount > 0 && !compact && (
        <span className={isDark ? "text-white/30" : "text-neutral-400"}>
          • {blockerCount}
        </span>
      )}
    </div>
  );
}

