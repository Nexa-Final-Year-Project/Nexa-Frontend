"use client";

import React, { useState } from "react";
import { Integration } from "@/services/integrationService";

interface IntegrationCardProps {
  integration: Integration;
  platformInfo: {
    name: string;
    description: string;
    icon: string;
    color: string;
    category: string;
  };
  onConnect: () => void;
  onDisconnect: () => void;
  onViewData: () => void;
  isConnecting: boolean;
}

/**
 * IntegrationCard Component
 *
 * Displays a single third-party integration with:
 * - Platform logo and info
 * - Connection status
 * - Connect/Disconnect actions
 * - View data button (when connected)
 */

export default function IntegrationCard({
  integration,
  platformInfo,
  onConnect,
  onDisconnect,
  onViewData,
  isConnecting,
}: IntegrationCardProps) {
  const [showDisconnectConfirm, setShowDisconnectConfirm] = useState(false);
  const isConnected = integration.status === "connected";

  const handleDisconnect = () => {
    setShowDisconnectConfirm(false);
    onDisconnect();
  };

  const getColorClasses = () => {
    const colorMap: Record<
      string,
      { bg: string; border: string; text: string; badge: string }
    > = {
      blue: {
        bg: "bg-blue-50 dark:bg-blue-900/20",
        border: "border-blue-200 dark:border-blue-800",
        text: "text-blue-600 dark:text-blue-400",
        badge: "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300",
      },
      purple: {
        bg: "bg-purple-50 dark:bg-purple-900/20",
        border: "border-purple-200 dark:border-purple-800",
        text: "text-purple-600 dark:text-purple-400",
        badge:
          "bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300",
      },
      pink: {
        bg: "bg-pink-50 dark:bg-pink-900/20",
        border: "border-pink-200 dark:border-pink-800",
        text: "text-pink-600 dark:text-pink-400",
        badge: "bg-pink-100 dark:bg-pink-900 text-pink-700 dark:text-pink-300",
      },
      gray: {
        bg: "bg-gray-50 dark:bg-gray-800",
        border: "border-gray-200 dark:border-gray-700",
        text: "text-gray-600 dark:text-gray-400",
        badge: "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300",
      },
    };
    return colorMap[platformInfo.color] || colorMap.gray;
  };

  const colors = getColorClasses();

  return (
    <div
      className={`relative rounded-lg border-2 ${colors.border} ${colors.bg} p-6 transition-all duration-200 hover:shadow-lg`}
    >
      {/* Header with Icon and Status */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="text-4xl">{platformInfo.icon}</div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {platformInfo.name}
            </h3>
            <span
              className={`text-xs px-2 py-1 rounded-full ${colors.badge} font-medium`}
            >
              {platformInfo.category}
            </span>
          </div>
        </div>

        {/* Status Badge */}
        {isConnected ? (
          <div className="flex items-center gap-1 px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-xs font-medium border border-green-300 dark:border-green-700">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            Connected
          </div>
        ) : (
          <div className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-full text-xs font-medium">
            Not Connected
          </div>
        )}
      </div>

      {/* Description */}
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 min-h-[40px]">
        {platformInfo.description}
      </p>

      {/* Connection Info (when connected) */}
      {isConnected && integration.metadata && (
        <div className="mb-4 p-3 bg-white dark:bg-gray-800/50 rounded border border-gray-200 dark:border-gray-700">
          <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
            Connected Account
          </div>
          <div className="text-sm font-medium text-gray-900 dark:text-white">
            {integration.metadata.accountName || "Demo Account"}
          </div>
          {integration.connectedAt && (
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Connected {new Date(integration.connectedAt).toLocaleDateString()}
            </div>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2">
        {!isConnected ? (
          <button
            onClick={onConnect}
            disabled={isConnecting}
            className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              isConnecting
                ? "bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                : `${colors.text} border-2 ${colors.border} hover:bg-opacity-10 hover:shadow-md`
            }`}
          >
            {isConnecting ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></span>
                Connecting...
              </span>
            ) : (
              `Connect ${platformInfo.name}`
            )}
          </button>
        ) : (
          <>
            {!showDisconnectConfirm ? (
              <>
                <button
                  onClick={onViewData}
                  className={`flex-1 px-4 py-2 ${colors.text} border-2 ${colors.border} rounded-lg font-medium hover:bg-opacity-10 hover:shadow-md transition-all duration-200`}
                >
                  View Data
                </button>
                <button
                  onClick={() => setShowDisconnectConfirm(true)}
                  className="px-4 py-2 text-red-600 dark:text-red-400 border-2 border-red-200 dark:border-red-800 rounded-lg font-medium hover:bg-red-50 dark:hover:bg-red-900/20 hover:shadow-md transition-all duration-200"
                >
                  Disconnect
                </button>
              </>
            ) : (
              <div className="flex-1 flex flex-col gap-2">
                <div className="text-xs text-center text-gray-600 dark:text-gray-400 font-medium">
                  Disconnect {platformInfo.name}?
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleDisconnect}
                    className="flex-1 px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded font-medium text-sm transition-colors"
                  >
                    Confirm
                  </button>
                  <button
                    onClick={() => setShowDisconnectConfirm(false)}
                    className="flex-1 px-3 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded font-medium text-sm hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Connecting Overlay */}
      {isConnecting && (
        <div className="absolute inset-0 bg-white dark:bg-gray-900 bg-opacity-90 dark:bg-opacity-90 rounded-lg flex items-center justify-center backdrop-blur-sm">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
            <div className="text-sm font-medium text-gray-900 dark:text-white">
              Connecting to {platformInfo.name}...
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Simulating OAuth flow
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
