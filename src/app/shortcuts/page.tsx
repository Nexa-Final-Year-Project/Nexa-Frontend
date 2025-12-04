"use client";

import { motion } from "framer-motion";
import { 
  ArrowLeft, 
  Search,
  Keyboard,
  Monitor,
  Command
} from "lucide-react";
import Link from "next/link";
import { AppSidebar } from "@/components/shared/sidebar/Sidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

const shortcuts = {
  "Navigation": [
    { keys: ["Ctrl/⌘", "K"], description: "Open universal search" },
    { keys: ["Ctrl/⌘", "B"], description: "Toggle sidebar" },
    { keys: ["Ctrl/⌘", "/"], description: "Open keyboard shortcuts" },
    { keys: ["G", "then", "H"], description: "Go to Dashboard" },
    { keys: ["G", "then", "P"], description: "Go to Projects" },
    { keys: ["G", "then", "S"], description: "Go to Sprints" },
    { keys: ["G", "then", "T"], description: "Go to Tasks" },
    { keys: ["G", "then", "N"], description: "Go to Notifications" },
  ],
  "Tasks & Projects": [
    { keys: ["C"], description: "Create new task" },
    { keys: ["Shift", "C"], description: "Create new project" },
    { keys: ["Shift", "S"], description: "Start new sprint" },
    { keys: ["E"], description: "Edit selected item" },
    { keys: ["D"], description: "View task details" },
    { keys: ["Del/Backspace"], description: "Delete selected item" },
    { keys: ["Ctrl/⌘", "Enter"], description: "Save and close modal" },
    { keys: ["Esc"], description: "Close modal/dialog" },
  ],
  "Board View": [
    { keys: ["←", "→"], description: "Move between columns" },
    { keys: ["↑", "↓"], description: "Navigate tasks in column" },
    { keys: ["Space"], description: "Select/deselect task" },
    { keys: ["M"], description: "Move selected task" },
    { keys: ["A"], description: "Assign to me" },
    { keys: ["L"], description: "Add label" },
    { keys: ["P"], description: "Set priority" },
  ],
  "Search & Filter": [
    { keys: ["Ctrl/⌘", "F"], description: "Focus search in current view" },
    { keys: ["/"], description: "Quick filter" },
    { keys: ["F"], description: "Open filter panel" },
    { keys: ["X"], description: "Clear all filters" },
    { keys: ["S"], description: "Toggle starred only" },
  ],
  "Productivity": [
    { keys: ["Ctrl/⌘", "Shift", "P"], description: "Open command palette" },
    { keys: ["?"], description: "Show help" },
    { keys: ["Ctrl/⌘", "."], description: "Toggle dark/light mode" },
    { keys: ["R"], description: "Refresh data" },
    { keys: ["Ctrl/⌘", "Z"], description: "Undo last action" },
    { keys: ["Ctrl/⌘", "Shift", "Z"], description: "Redo last action" },
  ],
};

function KeyCombo({ keys, isDark }: { keys: string[]; isDark: boolean }) {
  return (
    <div className="flex items-center gap-1">
      {keys.map((key, i) => (
        <span key={i} className="flex items-center gap-1">
          {key === "then" ? (
            <span className={cn(
              "text-xs mx-1",
              isDark ? "text-white/30" : "text-neutral-400"
            )}>then</span>
          ) : (
            <kbd className={cn(
              "px-2 py-1 rounded-md border text-xs font-medium min-w-[28px] text-center",
              isDark 
                ? "bg-white/[0.06] border-white/[0.08] text-white/80"
                : "bg-neutral-100 border-neutral-200 text-neutral-700"
            )}>
              {key}
            </kbd>
          )}
        </span>
      ))}
    </div>
  );
}

export default function ShortcutsPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className={isDark ? "bg-[#0a0a0f]" : "bg-neutral-50"}>
        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          <div className="max-w-5xl mx-auto px-6 py-8">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-4 mb-8"
            >
              <Link
                href="/u/dashboard"
                className={cn(
                  "p-2 rounded-lg border transition-colors",
                  isDark 
                    ? "bg-white/[0.04] border-white/[0.06] hover:bg-white/[0.06]"
                    : "bg-white border-neutral-200 hover:bg-neutral-50"
                )}
              >
                <ArrowLeft className={cn(
                  "w-5 h-5",
                  isDark ? "text-white/60" : "text-neutral-500"
                )} />
              </Link>
            <div>
              <h1 className={cn(
                "text-2xl font-bold flex items-center gap-3",
                isDark ? "text-white" : "text-neutral-900"
              )}>
                <Keyboard className="w-7 h-7 text-emerald-500" />
                Keyboard Shortcuts
              </h1>
              <p className={cn(
                "text-sm mt-1",
                isDark ? "text-white/50" : "text-neutral-500"
              )}>
                Master these shortcuts to navigate Nexa like a pro
              </p>
            </div>
          </motion.div>

          {/* OS Toggle Info */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className={cn(
              "flex items-center gap-4 mb-8 p-4 rounded-xl border",
              isDark 
                ? "bg-emerald-500/5 border-emerald-500/10"
                : "bg-emerald-50 border-emerald-200"
            )}
          >
            <div className="flex items-center gap-3">
              <div className={cn(
                "p-2 rounded-lg",
                isDark ? "bg-emerald-500/10" : "bg-emerald-100"
              )}>
                <Monitor className="w-5 h-5 text-emerald-500" />
              </div>
              <div>
                <p className={cn(
                  "text-sm",
                  isDark ? "text-white/70" : "text-neutral-600"
                )}>
                  <span className="text-emerald-500 font-medium">Ctrl</span> = Windows/Linux
                </p>
              </div>
            </div>
            <div className={cn(
              "w-px h-8",
              isDark ? "bg-white/10" : "bg-neutral-200"
            )} />
            <div className="flex items-center gap-3">
              <div className={cn(
                "p-2 rounded-lg",
                isDark ? "bg-emerald-500/10" : "bg-emerald-100"
              )}>
                <Command className="w-5 h-5 text-emerald-500" />
              </div>
              <div>
                <p className={cn(
                  "text-sm",
                  isDark ? "text-white/70" : "text-neutral-600"
                )}>
                  <span className="text-emerald-500 font-medium">⌘</span> = macOS
                </p>
              </div>
            </div>
          </motion.div>

          {/* Shortcuts Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            {Object.entries(shortcuts).map(([category, items], categoryIndex) => (
              <motion.div
                key={category}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + categoryIndex * 0.05 }}
                className={cn(
                  "p-5 rounded-2xl border",
                  isDark 
                    ? "bg-neutral-900/40 border-white/[0.06]"
                    : "bg-white border-neutral-200 shadow-sm"
                )}
              >
                <h2 className={cn(
                  "text-lg font-semibold mb-4 flex items-center gap-2",
                  isDark ? "text-white" : "text-neutral-900"
                )}>
                  <div className="w-2 h-2 rounded-full bg-emerald-500" />
                  {category}
                </h2>
                <div className="space-y-3">
                  {items.map((shortcut, index) => (
                    <div
                      key={index}
                      className={cn(
                        "flex items-center justify-between py-2 border-b last:border-0",
                        isDark ? "border-white/[0.04]" : "border-neutral-100"
                      )}
                    >
                      <span className={cn(
                        "text-sm",
                        isDark ? "text-white/60" : "text-neutral-600"
                      )}>{shortcut.description}</span>
                      <KeyCombo keys={shortcut.keys} isDark={isDark} />
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Quick Search Highlight */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className={cn(
              "mt-8 p-6 rounded-2xl border bg-gradient-to-br",
              isDark 
                ? "from-emerald-500/10 to-cyan-500/5 border-emerald-500/20"
                : "from-emerald-50 to-cyan-50 border-emerald-200"
            )}
          >
            <div className="flex items-start gap-4">
              <div className={cn(
                "p-3 rounded-xl",
                isDark ? "bg-emerald-500/20" : "bg-emerald-100"
              )}>
                <Search className="w-6 h-6 text-emerald-500" />
              </div>
              <div className="flex-1">
                <h3 className={cn(
                  "text-lg font-semibold mb-2",
                  isDark ? "text-white" : "text-neutral-900"
                )}>
                  Universal Search is Your Best Friend
                </h3>
                <p className={cn(
                  "text-sm mb-4",
                  isDark ? "text-white/60" : "text-neutral-600"
                )}>
                  Press <kbd className={cn(
                    "px-2 py-0.5 rounded text-xs font-medium mx-1",
                    isDark ? "bg-white/10 text-emerald-400" : "bg-emerald-100 text-emerald-600"
                  )}>Ctrl/⌘ + K</kbd> 
                  anywhere in the app to instantly search projects, tasks, team members, and more. 
                  It's the fastest way to navigate.
                </p>
                <div className="flex items-center gap-4 text-sm">
                  <span className={isDark ? "text-white/40" : "text-neutral-500"}>Try searching for:</span>
                  <span className={cn(
                    "px-2 py-1 rounded-lg",
                    isDark ? "bg-white/[0.04] text-white/60" : "bg-neutral-100 text-neutral-600"
                  )}>project name</span>
                  <span className={cn(
                    "px-2 py-1 rounded-lg",
                    isDark ? "bg-white/[0.04] text-white/60" : "bg-neutral-100 text-neutral-600"
                  )}>@teammate</span>
                  <span className={cn(
                    "px-2 py-1 rounded-lg",
                    isDark ? "bg-white/[0.04] text-white/60" : "bg-neutral-100 text-neutral-600"
                  )}>#task-id</span>
                </div>
              </div>
            </div>
          </motion.div>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
