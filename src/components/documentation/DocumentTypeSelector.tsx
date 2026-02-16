/**
 * @fileoverview Document Type Selector - Beautiful grid of 9 professional templates
 * @description Displays all available document types with icons and descriptions
 */

"use client";

import React, { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge/badge';
import { Button } from '@/components/ui/button';
import { Loader2, FileText, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import type { DocumentType } from '@/store/documentation/documentationStore';

interface DocumentTypeSelectorProps {
  onSelect: (documentType: DocumentType) => void;
  selectedType?: DocumentType | null;
}

// Document type icons mapping
const documentIcons: Record<string, string> = {
  'SRS': '📋',
  'SPRINT_REPORT': '📊',
  'ARCHITECTURE_DOC': '🏗️',
  'USER_MANUAL': '📖',
  'API_DOCUMENTATION': '🔌',
  'TEST_PLAN': '🧪',
  'PROJECT_CHARTER': '📑',
  'DESIGN_DOCUMENT': '🎨',
  'RELEASE_NOTES': '🚀',
};

const categoryColors: Record<string, string> = {
  'Requirements': 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300',
  'Agile': 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300',
  'Architecture': 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300',
  'User Documentation': 'bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300',
  'Technical': 'bg-cyan-100 text-cyan-700 dark:bg-cyan-950 dark:text-cyan-300',
  'Quality Assurance': 'bg-pink-100 text-pink-700 dark:bg-pink-950 dark:text-pink-300',
  'Project Management': 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300',
  'Design': 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300',
};

export default function DocumentTypeSelector({ 
  onSelect, 
  selectedType 
}: DocumentTypeSelectorProps) {
  const [documentTypes, setDocumentTypes] = useState<DocumentType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDocumentTypes();
  }, []);

  const fetchDocumentTypes = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
      const apiUrl = backendUrl.endsWith('/api') ? backendUrl : `${backendUrl}/api`;

      const response = await fetch(`${apiUrl}/documentation/types`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
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
        <p className="text-sm text-muted-foreground">
          No document types available
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {documentTypes.map((docType) => {
        const isSelected = selectedType?.id === docType.id;
        const icon = documentIcons[docType.id] || '📄';
        const categoryColor = categoryColors[docType.category] || 'bg-gray-100 text-gray-700';

        return (
          <button
            key={docType.id}
            onClick={() => onSelect(docType)}
            type="button"
            className={cn(
              "w-full text-left",
              "rounded-xl border p-4 transition-colors",
              "hover:bg-muted/40",
              isSelected ? "border-primary bg-primary/5" : "border-border bg-background"
            )}
          >
            <div className="flex items-start gap-3">
              <div className="text-3xl leading-none mt-0.5 flex-shrink-0">{icon}</div>

              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 min-w-0">
                      <p className="font-semibold text-sm sm:text-base leading-snug break-words">
                        {docType.name}
                      </p>
                      {isSelected && (
                        <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                      )}
                    </div>
                    <div className="mt-2">
                      <Badge className={cn("text-[11px]", categoryColor)} variant="secondary">
                        {docType.category}
                      </Badge>
                    </div>
                  </div>
                </div>

                <p className="mt-3 text-sm text-muted-foreground leading-relaxed line-clamp-3">
                  {docType.description}
                </p>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
