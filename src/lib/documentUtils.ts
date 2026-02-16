/**
 * @fileoverview Markdown to TipTap JSON Converter
 * @description Converts AI-generated markdown to TipTap JSON format
 */

import type { JSONContent } from '@tiptap/core';

/**
 * Convert markdown to TipTap JSON
 * This is a basic implementation - for production, consider using a proper markdown parser
 */
export function markdownToTiptap(markdown: string): JSONContent {
  const lines = markdown.split('\n');
  const content: JSONContent[] = [];
  let currentList: JSONContent | null = null;
  let currentListType: 'bulletList' | 'orderedList' | null = null;

  for (const line of lines) {
    const trimmed = line.trim();

    // Skip empty lines
    if (!trimmed) {
      // Close any open list
      if (currentList) {
        content.push(currentList);
        currentList = null;
        currentListType = null;
      }
      continue;
    }

    // Headings
    if (trimmed.startsWith('# ')) {
      if (currentList) content.push(currentList);
      currentList = null;
      content.push({
        type: 'heading',
        attrs: { level: 1 },
        content: [{ type: 'text', text: trimmed.slice(2) }]
      });
    } else if (trimmed.startsWith('## ')) {
      if (currentList) content.push(currentList);
      currentList = null;
      content.push({
        type: 'heading',
        attrs: { level: 2 },
        content: [{ type: 'text', text: trimmed.slice(3) }]
      });
    } else if (trimmed.startsWith('### ')) {
      if (currentList) content.push(currentList);
      currentList = null;
      content.push({
        type: 'heading',
        attrs: { level: 3 },
        content: [{ type: 'text', text: trimmed.slice(4) }]
      });
    } else if (trimmed.startsWith('#### ')) {
      if (currentList) content.push(currentList);
      currentList = null;
      content.push({
        type: 'heading',
        attrs: { level: 4 },
        content: [{ type: 'text', text: trimmed.slice(5) }]
      });
    }
    // Bullet lists
    else if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      const text = trimmed.slice(2);
      const listItem = {
        type: 'listItem',
        content: [
          {
            type: 'paragraph',
            content: [{ type: 'text', text }]
          }
        ]
      };

      if (currentListType === 'bulletList' && currentList) {
        currentList.content = currentList.content || [];
        currentList.content.push(listItem);
      } else {
        if (currentList) content.push(currentList);
        currentList = {
          type: 'bulletList',
          content: [listItem]
        };
        currentListType = 'bulletList';
      }
    }
    // Numbered lists
    else if (/^\d+\.\s/.test(trimmed)) {
      const text = trimmed.replace(/^\d+\.\s/, '');
      const listItem = {
        type: 'listItem',
        content: [
          {
            type: 'paragraph',
            content: [{ type: 'text', text }]
          }
        ]
      };

      if (currentListType === 'orderedList' && currentList) {
        currentList.content = currentList.content || [];
        currentList.content.push(listItem);
      } else {
        if (currentList) content.push(currentList);
        currentList = {
          type: 'orderedList',
          content: [listItem]
        };
        currentListType = 'orderedList';
      }
    }
    // Code blocks
    else if (trimmed.startsWith('```')) {
      if (currentList) content.push(currentList);
      currentList = null;
      // Simple code block detection (would need multi-line parsing for real implementation)
      content.push({
        type: 'codeBlock',
        content: [{ type: 'text', text: 'Code block content' }]
      });
    }
    // Blockquotes
    else if (trimmed.startsWith('> ')) {
      if (currentList) content.push(currentList);
      currentList = null;
      content.push({
        type: 'blockquote',
        content: [
          {
            type: 'paragraph',
            content: [{ type: 'text', text: trimmed.slice(2) }]
          }
        ]
      });
    }
    // Horizontal rule
    else if (trimmed === '---' || trimmed === '***') {
      if (currentList) content.push(currentList);
      currentList = null;
      content.push({
        type: 'horizontalRule'
      });
    }
    // Regular paragraph
    else {
      if (currentList) content.push(currentList);
      currentList = null;
      
      // Parse inline formatting
      let text = trimmed;
      const paragraphContent: any[] = [];
      
      // Bold: **text**
      const boldRegex = /\*\*(.+?)\*\*/g;
      const italicRegex = /\*(.+?)\*/g;
      const codeRegex = /`(.+?)`/g;
      
      // Simple text node for now
      paragraphContent.push({ type: 'text', text });
      
      content.push({
        type: 'paragraph',
        content: paragraphContent
      });
    }
  }

  // Push any remaining list
  if (currentList) {
    content.push(currentList);
  }

  return {
    type: 'doc',
    content: content.length > 0 ? content : [
      {
        type: 'paragraph',
        content: [{ type: 'text', text: '' }]
      }
    ]
  };
}

/**
 * Convert TipTap JSON to markdown
 */
export function tiptapToMarkdown(json: JSONContent): string {
  if (!json || !json.content) return '';

  let markdown = '';

  const processNode = (node: JSONContent): string => {
    let result = '';

    switch (node.type) {
      case 'doc':
        if (node.content) {
          result = node.content.map(processNode).join('\n\n');
        }
        break;

      case 'heading':
        const level = node.attrs?.level || 1;
        const hashes = '#'.repeat(level);
        const headingText = node.content?.map(processNode).join('') || '';
        result = `${hashes} ${headingText}`;
        break;

      case 'paragraph':
        result = node.content?.map(processNode).join('') || '';
        break;

      case 'text':
        let text = node.text || '';
        
        // Apply marks
        if (node.marks) {
          for (const mark of node.marks) {
            switch (mark.type) {
              case 'bold':
                text = `**${text}**`;
                break;
              case 'italic':
                text = `*${text}*`;
                break;
              case 'code':
                text = `\`${text}\``;
                break;
              case 'strike':
                text = `~~${text}~~`;
                break;
            }
          }
        }
        result = text;
        break;

      case 'bulletList':
        if (node.content) {
          result = node.content.map(item => {
            const itemText = processNode(item);
            return `- ${itemText}`;
          }).join('\n');
        }
        break;

      case 'orderedList':
        if (node.content) {
          result = node.content.map((item, index) => {
            const itemText = processNode(item);
            return `${index + 1}. ${itemText}`;
          }).join('\n');
        }
        break;

      case 'listItem':
        result = node.content?.map(processNode).join(' ') || '';
        break;

      case 'codeBlock':
        const code = node.content?.map(processNode).join('\n') || '';
        result = `\`\`\`\n${code}\n\`\`\``;
        break;

      case 'blockquote':
        const quoteText = node.content?.map(processNode).join('\n') || '';
        result = quoteText.split('\n').map(line => `> ${line}`).join('\n');
        break;

      case 'horizontalRule':
        result = '---';
        break;

      case 'hardBreak':
        result = '\n';
        break;

      default:
        // Handle unknown nodes gracefully
        if (node.content) {
          result = node.content.map(processNode).join('');
        }
    }

    return result;
  };

  markdown = processNode(json);
  return markdown;
}

/**
 * Export utilities
 */
export const documentUtils = {
  markdownToTiptap,
  tiptapToMarkdown,
  
  /**
   * Get word count from TipTap JSON
   */
  getWordCount(json: JSONContent): number {
    const text = tiptapToMarkdown(json);
    return text.split(/\s+/).filter(word => word.length > 0).length;
  },

  /**
   * Get character count from TipTap JSON
   */
  getCharCount(json: JSONContent): number {
    const text = tiptapToMarkdown(json);
    return text.length;
  }
};
