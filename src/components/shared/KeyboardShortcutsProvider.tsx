"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import GlobalSearchModal from "@/components/shared/search/GlobalSearchModal";
import { useRouter } from "next/navigation";

interface KeyboardShortcutsContextType {
  openSearch: () => void;
  closeSearch: () => void;
  isSearchOpen: boolean;
}

const KeyboardShortcutsContext =
  createContext<KeyboardShortcutsContextType | null>(null);

export function useKeyboardShortcuts() {
  const context = useContext(KeyboardShortcutsContext);
  if (!context) {
    throw new Error(
      "useKeyboardShortcuts must be used within KeyboardShortcutsProvider"
    );
  }
  return context;
}

export function KeyboardShortcutsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const router = useRouter();

  const openSearch = useCallback(() => setIsSearchOpen(true), []);
  const closeSearch = useCallback(() => setIsSearchOpen(false), []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Get the target element
      const target = e.target as HTMLElement;
      const tagName = target.tagName.toLowerCase();
      // IMPORTANT: ProseMirror/TipTap often fires key events from nested spans/text nodes
      // where `isContentEditable` is false. Use closest() to detect contenteditable ancestors.
      const isInsideContentEditable = !!target.closest?.('[contenteditable="true"]');
      const isEditable =
        isInsideContentEditable ||
        target.isContentEditable ||
        tagName === "input" ||
        tagName === "textarea" ||
        tagName === "select";

      // Cmd/Ctrl + K - Universal Search (works everywhere)
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsSearchOpen(true);
        return;
      }

      // Cmd/Ctrl + / - Open Keyboard Shortcuts page
      if ((e.metaKey || e.ctrlKey) && e.key === "/") {
        e.preventDefault();
        router.push("/shortcuts");
        return;
      }

      // Don't process other shortcuts if in editable field
      if (isEditable) return;

      // Escape - Close search
      if (e.key === "Escape" && isSearchOpen) {
        e.preventDefault();
        setIsSearchOpen(false);
        return;
      }

      // G then H - Go to Dashboard (using a sequence)
      // G then P - Go to Projects
      // G then T - Go to Tasks
      // G then N - Go to Notifications
      // These would need a more complex implementation with key sequences
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [router, isSearchOpen]);

  return (
    <KeyboardShortcutsContext.Provider
      value={{ openSearch, closeSearch, isSearchOpen }}
    >
      {children}
      <GlobalSearchModal
        isOpen={isSearchOpen}
        onOpenChange={setIsSearchOpen}
        title="Universal Search"
      />
    </KeyboardShortcutsContext.Provider>
  );
}
