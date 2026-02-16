/**
 * @fileoverview Documentation rich text editor (Quill)
 * @description Reliable typing/editing in React 19, saves markdown for exports
 */

"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Quill from "quill";
import TurndownService from "turndown";
import { marked } from "marked";
import { Button } from "@/components/ui/button";
import { Save, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface DocumentEditorClientProps {
  documentId: string;
  initialContent?: any;
  markdownContent?: string;
  onSave?: (content: any) => void;
  readOnly?: boolean;
}

export default function DocumentEditorClient({
  documentId,
  initialContent,
  markdownContent,
  onSave,
  readOnly = false
}: DocumentEditorClientProps) {

  // IMPORTANT:
  // Quill (Snow theme) injects the toolbar as a *sibling* of the editor container.
  // If we mount Quill into a React-managed div, strict-mode/dev remounts can leave behind
  // old toolbars, causing the "double header/toolbar" bug.
  //
  // Solution: provide Quill a DOM container that we create/destroy ourselves inside a mount root.
  const mountRootRef = useRef<HTMLDivElement | null>(null);
  const quillRef = useRef<Quill | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [initError, setInitError] = useState<string | null>(null);

  const resolvedInitialHtml = useMemo(() => {
    // Prefer stored HTML if present
    if (initialContent && typeof initialContent === "object" && typeof initialContent.html === "string") {
      return initialContent.html;
    }
    if (typeof initialContent === "string" && initialContent.trim()) {
      // Might be HTML or markdown; best-effort
      if (initialContent.trim().startsWith("<")) return initialContent;
      return marked.parse(initialContent);
    }
    if (typeof markdownContent === "string" && markdownContent.trim()) {
      return marked.parse(markdownContent);
    }
    return "<p></p>";
  }, [initialContent, markdownContent]);

  useEffect(() => {
    if (!mountRootRef.current) return;
    if (quillRef.current) return;

    try {
      setInitError(null);
      setIsReady(false);

      // Create a fresh editor host inside the mount root.
      const editorHost = document.createElement("div");
      mountRootRef.current.innerHTML = "";
      mountRootRef.current.appendChild(editorHost);

      // Build toolbar (Word-like)
      const toolbarOptions: any[] = [
        [{ font: [] }, { size: [] }],
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        ["bold", "italic", "underline", "strike"],
        [{ color: [] }, { background: [] }],
        [{ script: "sub" }, { script: "super" }],
        [{ list: "ordered" }, { list: "bullet" }, { list: "check" }],
        [{ indent: "-1" }, { indent: "+1" }],
        [{ direction: "rtl" }, { align: [] }],
        ["blockquote", "code-block"],
        ["link", "image", "video"],
        ["clean"],
      ];

      const quill = new Quill(editorHost, {
        theme: "snow",
        readOnly,
        modules: {
          toolbar: toolbarOptions,
          history: { delay: 500, maxStack: 200, userOnly: true },
          clipboard: { matchVisual: false },
        },
      });

      quill.root.setAttribute("spellcheck", "true");
      quill.root.classList.add("min-h-[520px]");

      // Set initial content
      quill.clipboard.dangerouslyPasteHTML(resolvedInitialHtml);

      // Make sure it's focusable & typing works
      if (!readOnly) {
        setTimeout(() => quill.focus(), 0);
      }

      quillRef.current = quill;
      setIsReady(true);
    } catch (err: any) {
      console.error("Quill init error:", err);
      setInitError(err?.message || "Failed to initialize editor");
    }

    return () => {
      // React dev/StrictMode can mount/unmount effects twice.
      // If we don’t clear the container, Quill toolbars can duplicate.
      quillRef.current = null;
      if (mountRootRef.current) mountRootRef.current.innerHTML = "";
    };
  }, [readOnly, resolvedInitialHtml, documentId]);

  const handleSave = async () => {
    const quill = quillRef.current;
    if (!quill) return;

    try {
      setIsSaving(true);
      const html = quill.root.innerHTML || "<p></p>";

      const turndown = new TurndownService({
        headingStyle: "atx",
        bulletListMarker: "-",
        codeBlockStyle: "fenced",
        emDelimiter: "_",
        strongDelimiter: "**",
      });

      // Preserve line breaks
      turndown.addRule("br", {
        filter: "br",
        replacement: () => "\n",
      });

      const markdown = turndown.turndown(html);

      // Call parent save (we send both forms)
      onSave?.({ html, markdown });

      toast.success("Saved");
    } catch (e: any) {
      console.error(e);
      toast.error(e?.message || "Failed to save");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex flex-col h-full w-full bg-background">
      {/* Quill renders its own toolbar + editor inside this container */}
      <div className="border-b bg-muted/30 px-4 py-2 flex items-center justify-end">
        <Button onClick={handleSave} size="sm" className="gap-2" disabled={readOnly || isSaving}>
          {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Save
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto bg-white dark:bg-gray-900">
        <div className="mx-auto max-w-4xl p-6">
          <div className="relative">
            <div
              className={cn(
                "rounded-lg border bg-background",
                // Quill internal styling tweaks (better UX)
                "[&_.ql-toolbar]:rounded-t-lg [&_.ql-toolbar]:border-b",
                "[&_.ql-container]:rounded-b-lg",
                "[&_.ql-editor]:min-h-[520px] [&_.ql-editor]:text-base [&_.ql-editor]:leading-relaxed",
                "[&_.ql-editor]:cursor-text"
              )}
            >
              <div ref={mountRootRef} />
            </div>

            {!isReady && !initError && (
              <div className="absolute inset-0 flex items-center justify-center bg-background/60 backdrop-blur-sm rounded-lg">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            )}

            {initError && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm rounded-lg p-6 text-center">
                <p className="text-sm font-medium mb-2">Editor failed to load</p>
                <p className="text-xs text-muted-foreground">{initError}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
