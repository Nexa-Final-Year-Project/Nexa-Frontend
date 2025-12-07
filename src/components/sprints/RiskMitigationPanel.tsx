"use client";

import React, { useState } from "react";
import { useTheme } from "next-themes";
import {
  AlertTriangle,
  CheckCircle2,
  AlertCircle,
  Zap,
  X,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface Risk {
  id: string;
  type: "delay" | "overload" | "dependency" | "custom";
  title: string;
  description: string;
  severity: "low" | "medium" | "high";
  mitigation: string;
  acknowledged: boolean;
}

interface RiskMitigationPanelProps {
  delayRiskPercent?: number;
  overloadedMembers?: string[];
  criticalDependencies?: string[];
  deadlineThreats?: string[];
}

const RiskMitigationPanel: React.FC<RiskMitigationPanelProps> = ({
  delayRiskPercent = 0,
  overloadedMembers = [],
  criticalDependencies = [],
  deadlineThreats = [],
}) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [risks, setRisks] = useState<Risk[]>([
    {
      id: "delay",
      type: "delay",
      title: "Delay Risk",
      description: `${delayRiskPercent}% probability of sprint delay identified by AI analysis`,
      severity:
        delayRiskPercent > 40
          ? "high"
          : delayRiskPercent > 20
          ? "medium"
          : "low",
      mitigation: "Add buffer tasks and monitor velocity daily",
      acknowledged: false,
    },
    ...(overloadedMembers.length > 0
      ? [
          {
            id: "overload",
            type: "overload" as const,
            title: "Member Overload Risk",
            description: `${overloadedMembers.length} team member(s) show overload risk`,
            severity: "high" as const,
            mitigation: "Redistribute tasks or extend sprint timeline",
            acknowledged: false,
          },
        ]
      : []),
    ...(criticalDependencies.length > 0
      ? [
          {
            id: "dependencies",
            type: "dependency" as const,
            title: "Critical Dependencies",
            description: `${criticalDependencies.length} blocking task(s) detected`,
            severity: "high" as const,
            mitigation: "Prioritize blocking tasks in sprint kickoff",
            acknowledged: false,
          },
        ]
      : []),
    ...(deadlineThreats.length > 0
      ? [
          {
            id: "deadline",
            type: "custom" as const,
            title: "Deadline Threats",
            description: `${deadlineThreats.length} task(s) at risk of missing deadline`,
            severity: "high" as const,
            mitigation: "Assign senior team member or break into subtasks",
            acknowledged: false,
          },
        ]
      : []),
  ]);

  const [showAddRisk, setShowAddRisk] = useState(false);
  const [newRiskTitle, setNewRiskTitle] = useState("");
  const [newRiskMitigation, setNewRiskMitigation] = useState("");

  const toggleAcknowledge = (riskId: string) => {
    setRisks(
      risks.map((risk) =>
        risk.id === riskId
          ? { ...risk, acknowledged: !risk.acknowledged }
          : risk
      )
    );
  };

  const addCustomRisk = () => {
    if (newRiskTitle.trim()) {
      const newRisk: Risk = {
        id: `custom-${Date.now()}`,
        type: "custom",
        title: newRiskTitle,
        description: "",
        severity: "medium",
        mitigation: newRiskMitigation,
        acknowledged: false,
      };
      setRisks([...risks, newRisk]);
      setNewRiskTitle("");
      setNewRiskMitigation("");
      setShowAddRisk(false);
    }
  };

  const removeRisk = (riskId: string) => {
    setRisks(risks.filter((r) => r.id !== riskId));
  };

  const severityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "border-red-500/30 bg-red-500/5";
      case "medium":
        return "border-yellow-500/30 bg-yellow-500/5";
      case "low":
        return "border-blue-500/30 bg-blue-500/5";
      default:
        return "border-gray-500/30 bg-gray-500/5";
    }
  };

  const severityIcon = (severity: string) => {
    switch (severity) {
      case "high":
        return <AlertTriangle className="w-5 h-5 text-red-500" />;
      case "medium":
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      default:
        return <Zap className="w-5 h-5 text-blue-500" />;
    }
  };

  const acknowledgedCount = risks.filter((r) => r.acknowledged).length;

  return (
    <div className="space-y-4">
      {/* Risk Summary */}
      <div
        className={`flex items-center justify-between p-3 rounded-lg border ${
          isDark
            ? "bg-white/5 border-white/10"
            : "bg-neutral-100 border-neutral-200"
        }`}
      >
        <div>
          <p
            className={`text-sm font-medium ${
              isDark ? "text-white" : "text-neutral-900"
            }`}
          >
            Risk Mitigation Status
          </p>
          <p
            className={`text-xs ${
              isDark ? "text-white/60" : "text-neutral-600"
            }`}
          >
            {acknowledgedCount} of {risks.length} risks acknowledged
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-right">
            <p
              className={`text-lg font-semibold ${
                isDark ? "text-white" : "text-neutral-900"
              }`}
            >
              {acknowledgedCount}
            </p>
            <p
              className={`text-xs ${
                isDark ? "text-white/60" : "text-neutral-600"
              }`}
            >
              Acknowledged
            </p>
          </div>
        </div>
      </div>

      {/* Risk List */}
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {risks.map((risk) => (
          <div
            key={risk.id}
            className={`p-3 rounded-lg border transition-all ${severityColor(
              risk.severity
            )} ${risk.acknowledged ? "opacity-60" : ""}`}
          >
            <div className="flex gap-3">
              <div className="flex-shrink-0 mt-1">
                {severityIcon(risk.severity)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p
                      className={`font-medium text-sm ${
                        isDark ? "text-white" : "text-neutral-900"
                      }`}
                    >
                      {risk.title}
                    </p>
                    {risk.description && (
                      <p
                        className={`text-xs mt-1 ${
                          isDark ? "text-white/60" : "text-neutral-600"
                        }`}
                      >
                        {risk.description}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => removeRisk(risk.id)}
                    className={`flex-shrink-0 transition-colors ${
                      isDark
                        ? "text-white/40 hover:text-white/60"
                        : "text-neutral-400 hover:text-neutral-600"
                    }`}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="mt-2">
                  <p
                    className={`text-xs ${
                      isDark ? "text-white/70" : "text-neutral-700"
                    }`}
                  >
                    <span className="font-semibold">Mitigation:</span>{" "}
                    {risk.mitigation}
                  </p>
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <button
                    onClick={() => toggleAcknowledge(risk.id)}
                    className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-medium transition-colors ${
                      risk.acknowledged
                        ? "bg-green-500/20 text-green-400"
                        : "bg-white/10 text-white/70 hover:bg-white/20"
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    {risk.acknowledged ? "Acknowledged" : "Acknowledge"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Custom Risk */}
      {!showAddRisk ? (
        <Button
          onClick={() => setShowAddRisk(true)}
          variant="outline"
          size="sm"
          className="w-full"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Custom Risk
        </Button>
      ) : (
        <div
          className={`p-3 rounded-lg border space-y-2 ${
            isDark
              ? "bg-white/5 border-white/10"
              : "bg-neutral-100 border-neutral-200"
          }`}
        >
          <input
            type="text"
            placeholder="Risk title..."
            value={newRiskTitle}
            onChange={(e) => setNewRiskTitle(e.target.value)}
            className={`w-full px-2 py-1.5 rounded border text-sm transition-all focus:outline-none focus:ring-1 ${
              isDark
                ? "bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:ring-blue-500/50"
                : "bg-white border-neutral-300 text-neutral-900 placeholder:text-neutral-500 focus:ring-blue-500"
            }`}
          />
          <textarea
            placeholder="Mitigation strategy..."
            value={newRiskMitigation}
            onChange={(e) => setNewRiskMitigation(e.target.value)}
            rows={2}
            className={`w-full px-2 py-1.5 rounded border text-sm resize-none transition-all focus:outline-none focus:ring-1 ${
              isDark
                ? "bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:ring-blue-500/50"
                : "bg-white border-neutral-300 text-neutral-900 placeholder:text-neutral-500 focus:ring-blue-500"
            }`}
          />
          <div className="flex gap-2">
            <Button
              onClick={addCustomRisk}
              size="sm"
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              Add
            </Button>
            <Button
              onClick={() => setShowAddRisk(false)}
              variant="outline"
              size="sm"
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RiskMitigationPanel;
