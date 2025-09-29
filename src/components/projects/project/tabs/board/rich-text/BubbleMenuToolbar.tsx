"use client";
import React, { useState } from "react";
import { BubbleMenu } from "@tiptap/react/menus";
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  List,
  ListOrdered,
  Quote,
  Code,
  Undo,
  Redo,
  Link as LinkIcon,
} from "lucide-react"; // prettier icons
import ToolbarButton from "./ToolbarButton";
import LinkMenu from "./LinkMenu";

import type { Editor } from "@tiptap/react";

export default function BubbleMenuToolbar({ editor }: { editor: Editor }) {
  const [showLinkInput, setShowLinkInput] = useState(false);

  return (
    <BubbleMenu
      editor={editor}
      options={{ placement: "bottom", offset: 8 }}
      className="bg-white shadow-lg rounded-md p-1 flex gap-1 border"
    >
      {showLinkInput ? (
        <LinkMenu editor={editor} onClose={() => setShowLinkInput(false)} />
      ) : (
        <>
          <ToolbarButton
            icon={Bold}
            isActive={editor.isActive("bold")}
            onClick={() => editor.chain().focus().toggleBold().run()}
          />
          <ToolbarButton
            icon={Italic}
            isActive={editor.isActive("italic")}
            onClick={() => editor.chain().focus().toggleItalic().run()}
          />
          <ToolbarButton
            icon={Underline}
            isActive={editor.isActive("underline")}
            onClick={() => editor.chain().focus().toggleUnderline().run()}
          />
          <ToolbarButton
            icon={Strikethrough}
            isActive={editor.isActive("strike")}
            onClick={() => editor.chain().focus().toggleStrike().run()}
          />
          <ToolbarButton
            icon={List}
            isActive={editor.isActive("bulletList")}
            onClick={() => editor.chain().focus().toggleBulletList().run()}
          />
          <ToolbarButton
            icon={ListOrdered}
            isActive={editor.isActive("orderedList")}
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
          />
          <ToolbarButton
            icon={Quote}
            isActive={editor.isActive("blockquote")}
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
          />
          <ToolbarButton
            icon={Code}
            isActive={editor.isActive("codeBlock")}
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          />
          <ToolbarButton
            icon={LinkIcon}
            isActive={editor.isActive("link")}
            onClick={() => setShowLinkInput(true)}
          />
          <ToolbarButton
            icon={Undo}
            isActive={false}
            onClick={() => editor.chain().focus().undo().run()}
          />
          <ToolbarButton
            icon={Redo}
            isActive={false}
            onClick={() => editor.chain().focus().redo().run()}
          />
        </>
      )}
    </BubbleMenu>
  );
}
