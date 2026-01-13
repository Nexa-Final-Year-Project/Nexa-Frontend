"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  integrationService,
  Integration,
  IntegrationPlatform,
  PLATFORM_INFO,
} from "@/services/integrationService";
import IntegrationCard from "@/components/integrations/IntegrationCard";
import IntegrationDataModal from "@/components/integrations/IntegrationDataModal";
import toast from "@/lib/customToast";

/**
 * Integrations Page
 *
 * ⚠️ DEMO MODE: Mock third-party integration management
 *
 * This page demonstrates integration capabilities with:
 * - Jira, Slack, Asana, Trello, GitHub
 * - All connections are simulated for demonstration
 * - No real external API calls are made
 *
 * Perfect for academic evaluation and UI/UX demonstration
 */

export default function IntegrationsPage() {
  const params = useParams();
  const projectId = params?.projectId as string;

  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [loading, setLoading] = useState(true);
  const [connectingPlatform, setConnectingPlatform] =
    useState<IntegrationPlatform | null>(null);
  const [selectedPlatform, setSelectedPlatform] =
    useState<IntegrationPlatform | null>(null);
  const [showDataModal, setShowDataModal] = useState(false);

  useEffect(() => {
    if (projectId) {
      loadIntegrations();
    }
  }, [projectId]);

  const loadIntegrations = async () => {
    try {
      setLoading(true);
      console.log("🔄 Loading integrations for project:", projectId);
      const data = await integrationService.getProjectIntegrations(projectId);
      console.log("✅ Integrations loaded successfully:", data);
      setIntegrations(data);
    } catch (error: any) {
      console.error("❌ Error loading integrations:", error);
      toast.error(
        `Failed to load integrations: ${error.message || "Unknown error"}`
      );
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = async (platform: IntegrationPlatform) => {
    try {
      setConnectingPlatform(platform);

      // Simulate OAuth flow with loading state
      await integrationService.connectIntegration(projectId, platform);

      // Success feedback
      toast.success(
        `✅ ${PLATFORM_INFO[platform].name} connected successfully!`
      );

      // Reload integrations
      await loadIntegrations();
    } catch (error) {
      console.error(`Error connecting to ${platform}:`, error);
      toast.error(`Failed to connect to ${PLATFORM_INFO[platform].name}`);
    } finally {
      setConnectingPlatform(null);
    }
  };

  const handleDisconnect = async (platform: IntegrationPlatform) => {
    try {
      await integrationService.disconnectIntegration(projectId, platform);
      toast.success(`${PLATFORM_INFO[platform].name} disconnected`);
      await loadIntegrations();
    } catch (error) {
      console.error(`Error disconnecting from ${platform}:`, error);
      toast.error(`Failed to disconnect from ${PLATFORM_INFO[platform].name}`);
    }
  };

  const handleViewData = (platform: IntegrationPlatform) => {
    setSelectedPlatform(platform);
    setShowDataModal(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              🔗 Third-Party Integrations
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Connect your project with external tools and services
            </p>
          </div>

          {/* Demo Mode Badge */}
          <div className="flex items-center gap-2 px-4 py-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg border border-yellow-300 dark:border-yellow-700">
            <span className="text-xl">🧪</span>
            <div className="text-sm">
              <div className="font-semibold text-yellow-800 dark:text-yellow-200">
                Demo Mode
              </div>
              <div className="text-yellow-700 dark:text-yellow-300 text-xs">
                Mock integrations for demonstration
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Integration Framework Info */}
      <div className="mb-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
        <div className="flex items-start gap-3">
          <span className="text-2xl">ℹ️</span>
          <div>
            <h3 className="font-semibold text-blue-900 dark:text-blue-200 mb-1">
              Integration Framework Ready
            </h3>
            <p className="text-sm text-blue-800 dark:text-blue-300">
              This integration layer demonstrates the architecture for
              connecting external tools. The framework is designed to be easily
              upgraded with real OAuth flows and API integrations in production.
            </p>
          </div>
        </div>
      </div>

      {/* Integration Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {integrations.map((integration) => (
          <IntegrationCard
            key={integration.platform}
            integration={integration}
            platformInfo={PLATFORM_INFO[integration.platform]}
            onConnect={() => handleConnect(integration.platform)}
            onDisconnect={() => handleDisconnect(integration.platform)}
            onViewData={() => handleViewData(integration.platform)}
            isConnecting={connectingPlatform === integration.platform}
          />
        ))}
      </div>

      {/* Integration Categories */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
            📊 Project Management Tools
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
            Sync tasks, sprints, and project data with popular PM platforms
          </p>
          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full text-xs font-medium">
              Jira
            </span>
            <span className="px-3 py-1 bg-pink-100 dark:bg-pink-900 text-pink-700 dark:text-pink-300 rounded-full text-xs font-medium">
              Asana
            </span>
            <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full text-xs font-medium">
              Trello
            </span>
          </div>
        </div>

        <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
            💻 Development & Communication
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
            Connect code repositories and team communication tools
          </p>
          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-xs font-medium">
              GitHub
            </span>
            <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 rounded-full text-xs font-medium">
              Slack
            </span>
          </div>
        </div>
      </div>

      {/* Data Modal */}
      {showDataModal && selectedPlatform && (
        <IntegrationDataModal
          projectId={projectId}
          platform={selectedPlatform}
          platformInfo={PLATFORM_INFO[selectedPlatform]}
          onClose={() => {
            setShowDataModal(false);
            setSelectedPlatform(null);
          }}
        />
      )}
    </div>
  );
}
