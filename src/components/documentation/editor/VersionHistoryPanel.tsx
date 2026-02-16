/**
 * @fileoverview Version History Panel - Timeline with rollback capability
 * @description Shows document version history with restore functionality
 */

"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  History,
  Clock,
  User,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import type { DocumentVersion } from '@/store/documentation/documentationStore';

interface VersionHistoryPanelProps {
  documentId: string;
  currentVersion: number;
}

export default function VersionHistoryPanel({
  documentId,
  currentVersion
}: VersionHistoryPanelProps) {
  const [versions, setVersions] = useState<DocumentVersion[]>([]);
  const [loading, setLoading] = useState(false);
  const [restoring, setRestoring] = useState<number | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  // Fetch version history when panel opens
  useEffect(() => {
    if (isOpen && documentId) {
      fetchVersionHistory();
    }
  }, [isOpen, documentId]);

  const fetchVersionHistory = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('authToken');
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
      const apiUrl = backendUrl.endsWith('/api') ? backendUrl : `${backendUrl}/api`;

      const response = await fetch(
        `${apiUrl}/documentation/${documentId}/versions`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (data.success && data.data.versions) {
        setVersions(data.data.versions.reverse()); // Newest first
      }
    } catch (error) {
      console.error('Error fetching versions:', error);
      toast.error('Failed to load version history');
    } finally {
      setLoading(false);
    }
  };

  const handleRestore = async (versionIndex: number) => {
    if (!confirm('Are you sure you want to restore this version? This will create a new version with the restored content.')) {
      return;
    }

    try {
      setRestoring(versionIndex);
      const token = localStorage.getItem('authToken');
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
      const apiUrl = backendUrl.endsWith('/api') ? backendUrl : `${backendUrl}/api`;

      // We need to reverse the index because we reversed the array for display
      const actualIndex = versions.length - 1 - versionIndex;

      const response = await fetch(
        `${apiUrl}/documentation/${documentId}/versions/restore`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ versionIndex: actualIndex }),
        }
      );

      const data = await response.json();

      if (data.success) {
        toast.success('Version restored successfully');
        setIsOpen(false);
        // Trigger a page reload to show restored content
        window.location.reload();
      } else {
        toast.error(data.message || 'Failed to restore version');
      }
    } catch (error) {
      console.error('Error restoring version:', error);
      toast.error('Failed to restore version');
    } finally {
      setRestoring(null);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <History className="h-4 w-4" />
          Version History
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>Version History</SheetTitle>
          <SheetDescription>
            View and restore previous versions of this document
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : versions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-sm text-muted-foreground">
                No version history available yet
              </p>
            </div>
          ) : (
            <ScrollArea className="h-[calc(100vh-200px)]">
              <div className="space-y-4 pr-4">
                {versions.map((version, index) => {
                  const isLatest = index === 0;
                  const initials = version.editedByName
                    .split(' ')
                    .map(n => n[0])
                    .join('')
                    .toUpperCase()
                    .slice(0, 2);

                  return (
                    <div
                      key={index}
                      className={cn(
                        'relative flex gap-4 rounded-lg border p-4 transition-colors',
                        isLatest && 'border-primary bg-primary/5'
                      )}
                    >
                      {/* Timeline connector */}
                      {index < versions.length - 1 && (
                        <div className="absolute left-[2.25rem] top-16 bottom-0 w-px bg-border" />
                      )}

                      {/* Avatar */}
                      <Avatar className="h-10 w-10 flex-shrink-0">
                        <AvatarFallback className="bg-primary/10 text-primary font-semibold text-sm">
                          {initials}
                        </AvatarFallback>
                      </Avatar>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <p className="font-medium text-sm">
                                {version.editedByName}
                              </p>
                              {isLatest && (
                                <Badge variant="default" className="text-xs">
                                  Current
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                              <Clock className="h-3 w-3" />
                              <span>{formatDate(version.createdAt)}</span>
                            </div>
                          </div>

                          {/* Restore button */}
                          {!isLatest && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleRestore(index)}
                              disabled={restoring === index}
                              className="flex-shrink-0"
                            >
                              {restoring === index ? (
                                <>
                                  <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                                  Restoring...
                                </>
                              ) : (
                                <>
                                  <RotateCcw className="h-3 w-3 mr-1" />
                                  Restore
                                </>
                              )}
                            </Button>
                          )}
                        </div>

                        {/* Preview (if we had content preview) */}
                        <div className="mt-2 text-xs text-muted-foreground">
                          Version {versions.length - index}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
