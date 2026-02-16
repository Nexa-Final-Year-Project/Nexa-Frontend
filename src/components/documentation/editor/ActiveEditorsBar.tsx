/**
 * @fileoverview Active Editors Bar - Shows live presence of collaborators
 * @description Beautiful avatar bar with user presence indicators
 */

"use client";

import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge/badge';
import { Users } from 'lucide-react';
import type { ActiveEditor } from '@/store/documentation/documentationStore';

interface ActiveEditorsBarProps {
  editors: ActiveEditor[];
}

// Generate consistent colors for users
const getUserColor = (userId: string): string => {
  const colors = [
    'bg-blue-500',
    'bg-green-500',
    'bg-purple-500',
    'bg-pink-500',
    'bg-orange-500',
    'bg-teal-500',
    'bg-indigo-500',
    'bg-rose-500',
    'bg-cyan-500',
    'bg-amber-500',
  ];
  
  // Simple hash function to get consistent color for user
  let hash = 0;
  for (let i = 0; i < userId.length; i++) {
    hash = userId.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
};

export default function ActiveEditorsBar({ editors }: ActiveEditorsBarProps) {
  if (editors.length === 0) return null;

  return (
    <div className="flex items-center justify-between px-4 py-2 bg-blue-50 dark:bg-blue-950/20 border-b">
      <div className="flex items-center gap-2">
        <Users className="h-4 w-4 text-blue-600 dark:text-blue-400" />
        <span className="text-sm font-medium text-blue-900 dark:text-blue-100">
          {editors.length} {editors.length === 1 ? 'person' : 'people'} editing
        </span>
      </div>

      <div className="flex items-center gap-2">
        <TooltipProvider>
          <div className="flex -space-x-2">
            {editors.map((editor) => {
              const initials = editor.userName
                .split(' ')
                .map(n => n[0])
                .join('')
                .toUpperCase()
                .slice(0, 2);
              
              const colorClass = getUserColor(editor.userId);

              return (
                <Tooltip key={editor.socketId}>
                  <TooltipTrigger asChild>
                    <div
                      className={`relative ring-2 ring-background rounded-full transition-transform hover:scale-110 hover:z-10`}
                    >
                      <Avatar className="h-8 w-8 cursor-pointer">
                        {editor.userAvatar ? (
                          <AvatarImage src={editor.userAvatar} alt={editor.userName} />
                        ) : null}
                        <AvatarFallback className={`${colorClass} text-white text-xs font-semibold`}>
                          {initials}
                        </AvatarFallback>
                      </Avatar>
                      {/* Active indicator dot */}
                      <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-green-500 ring-2 ring-background" />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <div className="text-xs">
                      <p className="font-semibold">{editor.userName}</p>
                      <p className="text-muted-foreground">
                        Active now
                      </p>
                    </div>
                  </TooltipContent>
                </Tooltip>
              );
            })}
          </div>
        </TooltipProvider>

        <Badge variant="secondary" className="text-xs">
          Real-time collaboration
        </Badge>
      </div>
    </div>
  );
}
