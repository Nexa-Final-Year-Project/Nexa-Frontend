"use client";

import React, { useState } from "react";
import { Integration, IntegrationPlatform, PLATFORM_INFO } from "@/services/integrationService";

interface IntegrationCardProps {
  integration: Integration;
  onImport: () => void;
  onDisconnect: () => void;
}

export default function IntegrationCard({
  integration,
  onImport,
  onDisconnect,
}: IntegrationCardProps) {
  const [showDisconnectConfirm, setShowDisconnectConfirm] = useState(false);
  const info = PLATFORM_INFO[integration.platform as IntegrationPlatform];
  const isConnected = integration.status === "connected";

  if (!info) return null;

  const handleDisconnect = () => {
    setShowDisconnectConfirm(false);
    onDisconnect();
  };

  return (
    <div className="relative rounded-2xl border border-neutral-200 dark:border-white/[0.06] bg-white dark:bg-neutral-900/40 p-5 transition-all duration-200 hover:border-neutral-300 dark:hover:border-white/[0.1] hover:shadow-lg hover:shadow-neutral-200/50 dark:hover:shadow-black/20 backdrop-blur-sm shadow-sm dark:shadow-none group">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="text-3xl">{info.icon}</div>
          <div>
            <h3 className="text-base font-semibold text-neutral-900 dark:text-white">{info.name}</h3>
            <span className="text-xs text-neutral-500 dark:text-white/40 font-medium">
              {info.category}
            </span>
          </div>
        </div>

        {isConnected ? (
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 rounded-full text-xs font-medium border border-emerald-500/20">
            <span className="w-1.5 h-1.5 bg-emerald-500 dark:bg-emerald-400 rounded-full animate-pulse" />
            Connected
          </div>
        ) : (
          <div className="px-2.5 py-1 bg-neutral-100 dark:bg-white/10 text-neutral-500 dark:text-white/60 rounded-full text-xs font-medium">
            Not Connected
          </div>
        )}
      </div>

      {/* Description */}
      <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4 min-h-[36px] leading-relaxed">
        {info.description}
      </p>

      {/* Connected Info */}
      {isConnected && integration.metadata && (
        <div className="mb-4 p-3 rounded-xl bg-neutral-50 dark:bg-white/[0.04] border border-neutral-200 dark:border-white/[0.06]">
          <div className="text-xs text-neutral-500 dark:text-white/40 mb-0.5">Account</div>
          <div className="text-sm font-medium text-neutral-900 dark:text-white">
            {integration.metadata.accountName}
          </div>
          {integration.metadata.accountEmail && (
            <div className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
              {integration.metadata.accountEmail}
            </div>
          )}
          {integration.lastSyncAt && (
            <div className="text-xs text-neutral-400 dark:text-white/30 mt-1">
              Last sync: {new Date(integration.lastSyncAt).toLocaleDateString()}
            </div>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2">
        {!isConnected ? (
          <button
            onClick={onImport}
            className="flex-1 px-4 py-2.5 rounded-xl font-medium text-sm bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 hover:bg-blue-500/20 hover:border-blue-500/40 transition-all"
          >
            Connect & Import
          </button>
        ) : (
          <>
            {!showDisconnectConfirm ? (
              <>
                <button
                  onClick={onImport}
                  className="flex-1 px-4 py-2.5 rounded-xl font-medium text-sm bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 transition-all"
                >
                  Import Data
                </button>
                <button
                  onClick={() => setShowDisconnectConfirm(true)}
                  className="px-3 py-2.5 rounded-xl text-sm text-red-500/70 dark:text-red-400/70 border border-neutral-200 dark:border-neutral-700 hover:border-red-500/30 hover:bg-red-500/5 transition-all"
                >
                  Disconnect
                </button>
              </>
            ) : (
              <div className="flex-1 flex flex-col gap-2">
                <div className="text-xs text-center text-neutral-500 dark:text-neutral-400">
                  Disconnect {info.name}?
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleDisconnect}
                    className="flex-1 px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium text-sm transition-colors"
                  >
                    Confirm
                  </button>
                  <button
                    onClick={() => setShowDisconnectConfirm(false)}
                    className="flex-1 px-3 py-2 bg-neutral-100 dark:bg-white/10 text-neutral-700 dark:text-neutral-300 rounded-lg font-medium text-sm hover:bg-neutral-200 dark:hover:bg-white/[0.15] transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
