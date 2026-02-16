/**
 * @fileoverview Professional Word-like Toolbar for Document Editor
 * @description Full formatting toolbar with all editing capabilities
 */

"use client";

import React from 'react';
import type { Editor } from '@tiptap/react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Code,
  Link2,
  Image as ImageIcon,
  List,
  ListOrdered,
  ListChecks,
  Quote,
  Table,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Undo2,
  Redo2,
  Heading1,
  Heading2,
  Heading3,
  Type,
  Subscript as SubIcon,
  Superscript as SuperIcon,
  RemoveFormatting,
  CodeSquare,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface DocumentEditorToolbarProps {
  editor: Editor;
}

export default function DocumentEditorToolbar({ editor }: DocumentEditorToolbarProps) {
  const addImage = () => {
    const url = window.prompt('Image URL:');
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  const addLink = () => {
    const url = window.prompt('Link URL:');
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  const insertTable = () => {
    editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
  };

  const ToolbarButton = ({ 
    onClick, 
    active, 
    disabled, 
    tooltip, 
    icon: Icon 
  }: { 
    onClick: () => void; 
    active?: boolean; 
    disabled?: boolean; 
    tooltip: string; 
    icon: any;
  }) => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={active ? 'default' : 'ghost'}
            size="sm"
            onClick={onClick}
            onMouseDown={(e) => {
              // Keep selection in editor; don’t blur on toolbar click.
              e.preventDefault();
            }}
            disabled={disabled}
            className={cn(
              'h-8 w-8 p-0',
              active && 'bg-primary text-primary-foreground'
            )}
          >
            <Icon className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p className="text-xs">{tooltip}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );

  return (
    <div
      className={cn(
        // IMPORTANT: keep buttons accessible on all screen sizes
        'flex items-center gap-1 px-2 py-1.5',
        'overflow-x-auto hide-scrollbar',
        'whitespace-nowrap',
      )}
    >
      {/* Undo/Redo */}
      <div className="flex items-center gap-1 shrink-0">
        <ToolbarButton
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          tooltip="Undo (Ctrl+Z)"
          icon={Undo2}
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          tooltip="Redo (Ctrl+Y)"
          icon={Redo2}
        />
      </div>

      <Separator orientation="vertical" className="h-6 shrink-0 mx-1" />

      {/* Text Style Selector */}
      <Select
        value={
          editor.isActive('heading', { level: 1 }) ? 'h1' :
          editor.isActive('heading', { level: 2 }) ? 'h2' :
          editor.isActive('heading', { level: 3 }) ? 'h3' :
          editor.isActive('heading', { level: 4 }) ? 'h4' :
          editor.isActive('heading', { level: 5 }) ? 'h5' :
          editor.isActive('heading', { level: 6 }) ? 'h6' :
          'paragraph'
        }
        onValueChange={(value) => {
          if (value === 'paragraph') {
            editor.chain().focus().setParagraph().run();
          } else {
            const level = parseInt(value.replace('h', '')) as 1 | 2 | 3 | 4 | 5 | 6;
            editor.chain().focus().toggleHeading({ level }).run();
          }
        }}
      >
        <SelectTrigger className="w-32 h-8 shrink-0">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="paragraph">Paragraph</SelectItem>
          <SelectItem value="h1">Heading 1</SelectItem>
          <SelectItem value="h2">Heading 2</SelectItem>
          <SelectItem value="h3">Heading 3</SelectItem>
          <SelectItem value="h4">Heading 4</SelectItem>
          <SelectItem value="h5">Heading 5</SelectItem>
          <SelectItem value="h6">Heading 6</SelectItem>
        </SelectContent>
      </Select>

      <Separator orientation="vertical" className="h-6 shrink-0 mx-1" />

      {/* Text Formatting */}
      <div className="flex items-center gap-1 shrink-0">
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          active={editor.isActive('bold')}
          tooltip="Bold (Ctrl+B)"
          icon={Bold}
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          active={editor.isActive('italic')}
          tooltip="Italic (Ctrl+I)"
          icon={Italic}
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          active={editor.isActive('underline')}
          tooltip="Underline (Ctrl+U)"
          icon={Underline}
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleStrike().run()}
          active={editor.isActive('strike')}
          tooltip="Strikethrough"
          icon={Strikethrough}
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleCode().run()}
          active={editor.isActive('code')}
          tooltip="Inline Code"
          icon={Code}
        />
      </div>

      <Separator orientation="vertical" className="h-6 shrink-0 mx-1" />

      {/* Subscript/Superscript */}
      <div className="flex items-center gap-1 shrink-0">
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleSubscript().run()}
          active={editor.isActive('subscript')}
          tooltip="Subscript"
          icon={SubIcon}
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleSuperscript().run()}
          active={editor.isActive('superscript')}
          tooltip="Superscript"
          icon={SuperIcon}
        />
      </div>

      <Separator orientation="vertical" className="h-6 shrink-0 mx-1" />

      {/* Lists */}
      <div className="flex items-center gap-1 shrink-0">
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          active={editor.isActive('bulletList')}
          tooltip="Bullet List"
          icon={List}
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          active={editor.isActive('orderedList')}
          tooltip="Numbered List"
          icon={ListOrdered}
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleTaskList().run()}
          active={editor.isActive('taskList')}
          tooltip="Task List"
          icon={ListChecks}
        />
      </div>

      <Separator orientation="vertical" className="h-6 shrink-0 mx-1" />

      {/* Blocks */}
      <div className="flex items-center gap-1 shrink-0">
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          active={editor.isActive('blockquote')}
          tooltip="Quote"
          icon={Quote}
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          active={editor.isActive('codeBlock')}
          tooltip="Code Block"
          icon={CodeSquare}
        />
      </div>

      <Separator orientation="vertical" className="h-6 shrink-0 mx-1" />

      {/* Insert */}
      <div className="flex items-center gap-1 shrink-0">
        <ToolbarButton
          onClick={addLink}
          active={editor.isActive('link')}
          tooltip="Insert Link"
          icon={Link2}
        />
        <ToolbarButton
          onClick={addImage}
          tooltip="Insert Image"
          icon={ImageIcon}
        />
        <ToolbarButton
          onClick={insertTable}
          active={editor.isActive('table')}
          tooltip="Insert Table"
          icon={Table}
        />
      </div>

      <Separator orientation="vertical" className="h-6 shrink-0 mx-1" />

      {/* Clear Formatting */}
      <ToolbarButton
        onClick={() => editor.chain().focus().unsetAllMarks().run()}
        tooltip="Clear Formatting"
        icon={RemoveFormatting}
      />
    </div>
  );
}
