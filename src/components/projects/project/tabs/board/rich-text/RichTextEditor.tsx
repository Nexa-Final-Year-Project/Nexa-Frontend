// "use client";
// import React from "react";
// import { useEditor, EditorContent } from "@tiptap/react";
// import StarterKit from "@tiptap/starter-kit";
// import Underline from "@tiptap/extension-underline";
// import Link from "@tiptap/extension-link";
// import Placeholder from "@tiptap/extension-placeholder";
// import BubbleMenuToolbar from "./BubbleMenuToolbar";

// interface RichTextEditorProps {
//   content: string;
//   onChange: (value: string) => void;
// }

// export default function RichTextEditor({
//   content,
//   onChange,
// }: RichTextEditorProps) {
//   const editor = useEditor({
//     extensions: [
//       StarterKit.configure({
//         heading: { levels: [1, 2, 3] },
//       }),
//       Underline,
//       Link.configure({ openOnClick: true }),
//       Placeholder.configure({
//         placeholder: "Type description...",
//       }),
//     ],
//     immediatelyRender: false,
//     content,
//     onUpdate: ({ editor }) => {
//       onChange(editor.getHTML());
//     },
//   });

//   if (!editor) return null;

//   return (
//     <div className="border border-gray-300 rounded-lg overflow-hidden">
//       <BubbleMenuToolbar editor={editor} />
//       <EditorContent
//         editor={editor}
//         className="p-4 min-h-[200px] focus:outline-none prose prose-sm max-w-none"
//       />
//     </div>
//   );
// }

"use client";
import type { Editor, JSONContent } from "@/components/ui/kibo-ui/editor";
import {
  EditorBubbleMenu,
  EditorCharacterCount,
  EditorClearFormatting,
  EditorFloatingMenu,
  EditorFormatBold,
  EditorFormatCode,
  EditorFormatItalic,
  EditorFormatStrike,
  EditorFormatSubscript,
  EditorFormatSuperscript,
  EditorFormatUnderline,
  EditorLinkSelector,
  EditorNodeBulletList,
  EditorNodeCode,
  EditorNodeHeading1,
  EditorNodeHeading2,
  EditorNodeHeading3,
  EditorNodeOrderedList,
  EditorNodeQuote,
  EditorNodeTable,
  EditorNodeTaskList,
  EditorNodeText,
  EditorProvider,
  EditorSelector,
  EditorTableColumnAfter,
  EditorTableColumnBefore,
  EditorTableColumnDelete,
  EditorTableColumnMenu,
  EditorTableDelete,
  EditorTableFix,
  EditorTableGlobalMenu,
  EditorTableHeaderColumnToggle,
  EditorTableHeaderRowToggle,
  EditorTableMenu,
  EditorTableMergeCells,
  EditorTableRowAfter,
  EditorTableRowBefore,
  EditorTableRowDelete,
  EditorTableRowMenu,
  EditorTableSplitCell,
} from "@/components/ui/kibo-ui/editor";
import { useState } from "react";
const RichTextEditor = ({
  content,
  setContent,
}: {
  content: JSONContent;
  setContent: (content: JSONContent) => void;
}) => {
  const handleUpdate = ({ editor }: { editor: Editor }) => {
    const json = editor.getJSON();
    setContent(json);
    console.log(JSON.stringify(json));
  };
  return (
    <EditorProvider
      className="h-full w-full overflow-y-auto rounded-lg border-b-2 p-4"
      content={content}
      onUpdate={handleUpdate}
      placeholder="Start typing..."
    >
      <EditorFloatingMenu>
        <EditorNodeHeading1 hideName />
        <EditorNodeBulletList hideName />
        <EditorNodeQuote hideName />
        <EditorNodeCode hideName />
        <EditorNodeTable hideName />
      </EditorFloatingMenu>
      <EditorBubbleMenu>
        <EditorSelector title="Text">
          <EditorNodeText />
          <EditorNodeHeading1 />
          <EditorNodeHeading2 />
          <EditorNodeHeading3 />
          <EditorNodeBulletList />
          <EditorNodeOrderedList />
          <EditorNodeTaskList />
          <EditorNodeQuote />
          <EditorNodeCode />
        </EditorSelector>
        <EditorSelector title="Format">
          <EditorFormatBold />
          <EditorFormatItalic />
          <EditorFormatUnderline />
          <EditorFormatStrike />
          <EditorFormatCode />
          <EditorFormatSuperscript />
          <EditorFormatSubscript />
        </EditorSelector>
        <EditorLinkSelector />
        <EditorClearFormatting />
      </EditorBubbleMenu>
      <EditorTableMenu>
        <EditorTableColumnMenu>
          <EditorTableColumnBefore />
          <EditorTableColumnAfter />
          <EditorTableColumnDelete />
        </EditorTableColumnMenu>
        <EditorTableRowMenu>
          <EditorTableRowBefore />
          <EditorTableRowAfter />
          <EditorTableRowDelete />
        </EditorTableRowMenu>
        <EditorTableGlobalMenu>
          <EditorTableHeaderColumnToggle />
          <EditorTableHeaderRowToggle />
          <EditorTableDelete />
          <EditorTableMergeCells />
          <EditorTableSplitCell />
          <EditorTableFix />
        </EditorTableGlobalMenu>
      </EditorTableMenu>
      <EditorCharacterCount.Words>Words: </EditorCharacterCount.Words>
    </EditorProvider>
  );
};
export default RichTextEditor;
