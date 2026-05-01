/**
 * @fileoverview Document Type Selector - Beautiful grid of 9 professional templates
 * @description Free plan: SRS only. Pro/Premium: all types unlocked.
 */

"use client";

import React, { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge/badge';
import { Loader2, FileText, CheckCircle2, Lock, Zap } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import type { DocumentType } from '@/store/documentation/documentationStore';

interface DocumentTypeSelectorProps {
  onSelect: (documentType: DocumentType) => void;
  selectedType?: DocumentType | null;
}

// Free plan: only these types are unlocked
const FREE_PLAN_TYPES = ['SRS'];

const documentIcons: Record<string, string> = {
  'SRS': '📋',
  'SPRINT_REPORT': '📊',
  'ARCHITECTURE_DOC': '🏗️',
  'USER_MANUAL': '📖',
  'API_DOCUMENTATION': '🔌',
  'TEST_PLAN': '🧪',
  'PROJECT_CHARTER': '📑',
  'DESIGN_DOCUMENT': '🎨',
  'TECHNICAL_SPEC': '⚙️',
  'RELEASE_NOTES': '🚀',
};

const categoryColors: Record<string, string> = {
  'Requirements':       'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300',
  'Agile':              'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300',
  'Architecture':       'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300',
  'User Documentation': 'bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300',
  'Technical':          'bg-cyan-100 text-cyan-700 dark:bg-cyan-950 dark:text-cyan-300',
  'Quality Assurance':  'bg-pink-100 text-pink-700 dark:bg-pink-950 dark:text-pink-300',
  'Project Management': 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300',
  'Design':             'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300',
};

export default function DocumentTypeSelector({
  onSelect,
  selectedType,
}: DocumentTypeSelectorProps) {
  const [documentTypes, setDocumentTypes] = useState<DocumentType[]>([]);
  const [loading, setLoading] = useState(true);
  const [userPlan, setUserPlan] = useState<'free' | 'pro' | 'premium'>('free');

  useEffect(() => {
    Promise.all([fetchDocumentTypes(), fetchUserPlan()]);
  }, []);

  const fetchDocumentTypes = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
      const apiUrl = backendUrl.endsWith('/api') ? backendUrl : `${backendUrl}/api`;

      const response = await fetch(`${apiUrl}/documentation/types`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await response.json();
      if (data.success && data.data.documentTypes) {
        setDocumentTypes(data.data.documentTypes);
      }
    } catch (error) {
      console.error('Error fetching document types:', error);
      toast.error('Failed to load document types');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserPlan = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
      const apiUrl = backendUrl.endsWith('/api') ? backendUrl : `${backendUrl}/api`;

      const res = await fetch(`${apiUrl}/billing/subscription`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success && data.data?.planId) {
        setUserPlan(data.data.planId as 'free' | 'pro' | 'premium');
      }
    } catch {
      // silently default to free — backend guard will enforce anyway
    }
  };

  const isPro = userPlan === 'pro' || userPlan === 'premium';

  const isLocked = (docTypeId: string) =>
    !isPro && !FREE_PLAN_TYPES.includes(docTypeId.toUpperCase());

  const handleSelect = (docType: DocumentType) => {
    if (isLocked(docType.id)) {
      toast.error(
        `"${docType.name}" is a PRO feature. Upgrade your plan to unlock all 9 document types.`,
        { duration: 4000 }
      );
      return;
    }
    onSelect(docType);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (documentTypes.length === 0) {
    return (
      <div className="text-center py-12">
        <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <p className="text-sm text-muted-foreground">No document types available</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {/* Free plan banner */}
      {!isPro && (
        <div className="flex items-center gap-2 px-3 py-2 mb-3 rounded-lg bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 text-xs text-amber-700 dark:text-amber-400">
          <Zap className="h-3.5 w-3.5 flex-shrink-0" />
          <span>
            <strong>Free plan:</strong> SRS is available. Upgrade to <strong>PRO</strong> to unlock all 9 document types.
          </span>
        </div>
      )}

      {documentTypes.map((docType) => {
        const isSelected = selectedType?.id === docType.id;
        const locked = isLocked(docType.id);
        const icon = documentIcons[docType.id] || '📄';
        const categoryColor = categoryColors[docType.category] || 'bg-gray-100 text-gray-700';

        return (
          <button
            key={docType.id}
            onClick={() => handleSelect(docType)}
            type="button"
            className={cn(
              'w-full text-left rounded-xl border p-4 transition-all duration-150',
              locked
                ? 'opacity-55 cursor-not-allowed border-border bg-muted/30 hover:border-border'
                : 'hover:bg-muted/40 cursor-pointer',
              isSelected && !locked
                ? 'border-primary bg-primary/5'
                : !locked && 'border-border bg-background'
            )}
          >
            <div className="flex items-start gap-3">
              {/* Icon */}
              <div className={cn('text-3xl leading-none mt-0.5 flex-shrink-0', locked && 'grayscale')}>
                {icon}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold text-sm sm:text-base leading-snug break-words">
                        {docType.name}
                      </p>
                      {isSelected && !locked && (
                        <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                      )}
                    </div>
                    <div className="mt-2 flex items-center gap-2 flex-wrap">
                      <Badge className={cn('text-[11px]', categoryColor)} variant="secondary">
                        {docType.category}
                      </Badge>
                      {locked && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-300 dark:border-amber-500/30">
                          <Lock className="h-2.5 w-2.5" />
                          PRO
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <p className="mt-3 text-sm text-muted-foreground leading-relaxed line-clamp-3">
                  {docType.description}
                </p>

                {locked && (
                  <p className="mt-2 text-xs text-amber-600 dark:text-amber-400">
                    🔒 Upgrade to PRO to generate this document type
                  </p>
                )}
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
