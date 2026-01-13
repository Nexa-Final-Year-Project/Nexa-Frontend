"use client";

import React, { useEffect, useState } from "react";
import {
  integrationService,
  IntegrationPlatform,
} from "@/services/integrationService";
import toast from "@/lib/customToast";

interface IntegrationDataModalProps {
  projectId: string;
  platform: IntegrationPlatform;
  platformInfo: {
    name: string;
    icon: string;
    color: string;
  };
  onClose: () => void;
}

/**
 * IntegrationDataModal Component
 *
 * ⚠️ DEMO MODE: Displays simulated data from integrated platforms
 *
 * Shows realistic mock data including:
 * - Jira: Projects, Sprints, Issues
 * - Slack: Workspace, Channels, Messages
 * - Asana: Workspaces, Projects, Tasks
 * - Trello: Boards, Lists, Cards
 * - GitHub: Repositories, Pull Requests, Issues
 *
 * All data is generated on the backend - no real API calls
 */

export default function IntegrationDataModal({
  projectId,
  platform,
  platformInfo,
  onClose,
}: IntegrationDataModalProps) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await integrationService.getIntegrationData(
        projectId,
        platform
      );
      setData(result);
    } catch (err: any) {
      setError(err.message || "Failed to load data");
      toast.error("Failed to fetch integration data");
    } finally {
      setLoading(false);
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">
            Fetching data from {platformInfo.name}...
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
            (Simulating API call)
          </p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center py-12">
          <div className="text-5xl mb-4">⚠️</div>
          <p className="text-red-600 dark:text-red-400 font-medium">{error}</p>
        </div>
      );
    }

    // Render platform-specific data
    switch (platform) {
      case "jira":
        return renderJiraData(data);
      case "slack":
        return renderSlackData(data);
      case "asana":
        return renderAsanaData(data);
      case "trello":
        return renderTrelloData(data);
      case "github":
        return renderGitHubData(data);
      default:
        return <div>No data available</div>;
    }
  };

  const renderJiraData = (data: any) => (
    <div className="space-y-6">
      {/* Projects */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
          📁 Projects ({data.projects?.length || 0})
        </h3>
        <div className="space-y-2">
          {data.projects?.map((project: any) => (
            <div
              key={project.id}
              className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded text-xs font-mono font-bold">
                  {project.key}
                </span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {project.name}
                </span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {project.description}
              </p>
              <div className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                Lead: {project.lead}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sprints */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
          🏃 Sprints ({data.sprints?.length || 0})
        </h3>
        <div className="space-y-2">
          {data.sprints?.map((sprint: any) => (
            <div
              key={sprint.id}
              className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-gray-900 dark:text-white">
                  {sprint.name}
                </span>
                <span
                  className={`px-2 py-1 rounded text-xs font-medium ${
                    sprint.state === "active"
                      ? "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
                  }`}
                >
                  {sprint.state}
                </span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                {sprint.goal}
              </p>
              <div className="text-xs text-gray-500 dark:text-gray-500">
                {new Date(sprint.startDate).toLocaleDateString()} -{" "}
                {new Date(sprint.endDate).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Issues */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
          🎫 Issues ({data.issues?.length || 0})
        </h3>
        <div className="space-y-2">
          {data.issues?.map((issue: any) => (
            <div
              key={issue.id}
              className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded text-xs font-mono font-bold">
                  {issue.key}
                </span>
                <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 rounded text-xs">
                  {issue.type}
                </span>
                <span
                  className={`px-2 py-1 rounded text-xs ${getPriorityColor(
                    issue.priority
                  )}`}
                >
                  {issue.priority}
                </span>
              </div>
              <div className="font-medium text-gray-900 dark:text-white mb-1">
                {issue.summary}
              </div>
              <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-500">
                <span>
                  Status: <span className="font-medium">{issue.status}</span>
                </span>
                <span>Assignee: {issue.assignee}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderSlackData = (data: any) => (
    <div className="space-y-6">
      {/* Workspace */}
      <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          💼 {data.workspace?.name}
        </h3>
        <div className="text-sm text-gray-600 dark:text-gray-400">
          <div>{data.workspace?.domain}.slack.com</div>
          <div className="mt-1">{data.workspace?.memberCount} members</div>
        </div>
      </div>

      {/* Channels */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
          📢 Channels ({data.channels?.length || 0})
        </h3>
        <div className="space-y-2">
          {data.channels?.map((channel: any) => (
            <div
              key={channel.id}
              className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-lg">
                  {channel.isPrivate ? "🔒" : "#"}
                </span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {channel.name}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-500">
                  {channel.memberCount} members
                </span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {channel.topic}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Messages */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
          💬 Recent Messages
        </h3>
        <div className="space-y-2">
          {data.recentMessages?.map((msg: any, idx: number) => (
            <div
              key={idx}
              className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="font-medium text-gray-900 dark:text-white text-sm">
                  {msg.user}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-500">
                  in #{msg.channel}
                </span>
              </div>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                {msg.text}
              </p>
              <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                {new Date(msg.timestamp).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderAsanaData = (data: any) => (
    <div className="space-y-6">
      {/* Workspaces */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
          🏢 Workspaces ({data.workspaces?.length || 0})
        </h3>
        <div className="space-y-2">
          {data.workspaces?.map((workspace: any) => (
            <div
              key={workspace.id}
              className="p-3 bg-pink-50 dark:bg-pink-900/20 rounded-lg border border-pink-200 dark:border-pink-800"
            >
              <span className="font-semibold text-gray-900 dark:text-white">
                {workspace.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Projects */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
          📁 Projects ({data.projects?.length || 0})
        </h3>
        <div className="space-y-2">
          {data.projects?.map((project: any) => (
            <div
              key={project.id}
              className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-gray-900 dark:text-white">
                  {project.name}
                </span>
                <span
                  className={`px-2 py-1 rounded-full text-xs ${
                    project.completed
                      ? "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300"
                      : "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300"
                  }`}
                >
                  {project.completed ? "Completed" : "Active"}
                </span>
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                <div>Owner: {project.owner}</div>
                {project.dueDate && (
                  <div>
                    Due: {new Date(project.dueDate).toLocaleDateString()}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tasks */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
          ✅ Tasks ({data.tasks?.length || 0})
        </h3>
        <div className="space-y-2">
          {data.tasks?.map((task: any) => (
            <div
              key={task.id}
              className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-start gap-2 mb-2">
                <input
                  type="checkbox"
                  checked={task.completed}
                  readOnly
                  className="mt-1"
                />
                <div className="flex-1">
                  <div
                    className={`font-medium ${
                      task.completed
                        ? "line-through text-gray-500"
                        : "text-gray-900 dark:text-white"
                    }`}
                  >
                    {task.name}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Assignee: {task.assignee}
                  </div>
                  {task.dueDate && (
                    <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                      Due: {new Date(task.dueDate).toLocaleDateString()}
                    </div>
                  )}
                  <div className="flex gap-1 mt-2">
                    {task.tags?.map((tag: string) => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-xs"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderTrelloData = (data: any) => (
    <div className="space-y-6">
      {/* Boards */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
          📋 Boards ({data.boards?.length || 0})
        </h3>
        <div className="space-y-2">
          {data.boards?.map((board: any) => (
            <div
              key={board.id}
              className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800"
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold text-gray-900 dark:text-white">
                  {board.name}
                </span>
                {board.starred && <span className="text-yellow-500">⭐</span>}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {board.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Lists */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
          📝 Lists ({data.lists?.length || 0})
        </h3>
        <div className="grid grid-cols-2 gap-2">
          {data.lists?.map((list: any) => (
            <div
              key={list.id}
              className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
            >
              <span className="font-medium text-gray-900 dark:text-white text-sm">
                {list.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Cards */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
          🎴 Cards ({data.cards?.length || 0})
        </h3>
        <div className="space-y-2">
          {data.cards?.map((card: any) => (
            <div
              key={card.id}
              className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
            >
              <div className="font-medium text-gray-900 dark:text-white mb-1">
                {card.name}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                {card.desc}
              </p>
              {card.due && (
                <div className="text-xs text-gray-500 dark:text-gray-500">
                  Due: {new Date(card.due).toLocaleDateString()}
                </div>
              )}
              {card.labels && (
                <div className="flex gap-1 mt-2">
                  {card.labels.map((label: any, idx: number) => (
                    <span
                      key={idx}
                      style={{ backgroundColor: label.color }}
                      className="px-2 py-1 text-white rounded text-xs"
                    >
                      {label.name}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderGitHubData = (data: any) => (
    <div className="space-y-6">
      {/* Repositories */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
          📦 Repositories ({data.repositories?.length || 0})
        </h3>
        <div className="space-y-2">
          {data.repositories?.map((repo: any) => (
            <div
              key={repo.id}
              className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="font-mono font-semibold text-gray-900 dark:text-white">
                  {repo.fullName}
                </span>
                {repo.private && (
                  <span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300 rounded text-xs">
                    Private
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                {repo.description}
              </p>
              <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-500">
                <span>⭐ {repo.stargazersCount}</span>
                <span>🍴 {repo.forksCount}</span>
                <span>🐛 {repo.openIssuesCount} issues</span>
                <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded">
                  {repo.language}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pull Requests */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
          🔀 Pull Requests ({data.pullRequests?.length || 0})
        </h3>
        <div className="space-y-2">
          {data.pullRequests?.map((pr: any) => (
            <div
              key={pr.id}
              className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-green-600 dark:text-green-400">
                  #{pr.number}
                </span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {pr.title}
                </span>
              </div>
              <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-500">
                <span>by {pr.user}</span>
                <span>{new Date(pr.createdAt).toLocaleDateString()}</span>
              </div>
              {pr.labels && (
                <div className="flex gap-1 mt-2">
                  {pr.labels.map((label: string) => (
                    <span
                      key={label}
                      className="px-2 py-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-xs"
                    >
                      {label}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Issues */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
          🐛 Issues ({data.issues?.length || 0})
        </h3>
        <div className="space-y-2">
          {data.issues?.map((issue: any) => (
            <div
              key={issue.id}
              className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-red-600 dark:text-red-400">
                  #{issue.number}
                </span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {issue.title}
                </span>
              </div>
              <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-500">
                <span>by {issue.user}</span>
                <span>💬 {issue.comments} comments</span>
              </div>
              {issue.labels && (
                <div className="flex gap-1 mt-2">
                  {issue.labels.map((label: string) => (
                    <span
                      key={label}
                      className="px-2 py-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-xs"
                    >
                      {label}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const getPriorityColor = (priority: string) => {
    const colors: Record<string, string> = {
      Critical: "bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300",
      High: "bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300",
      Medium:
        "bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300",
      Low: "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300",
    };
    return (
      colors[priority] ||
      "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{platformInfo.icon}</span>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {platformInfo.name} Data
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Sample data fetched from {platformInfo.name} (Demo Mode)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-2xl"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">{renderContent()}</div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <span className="text-xl">🧪</span>
              <span>This is simulated data for demonstration purposes</span>
            </div>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
