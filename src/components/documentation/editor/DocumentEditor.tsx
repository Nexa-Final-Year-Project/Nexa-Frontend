"use client";

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { Loader2 } from 'lucide-react';

// Dynamically import the actual editor component with no SSR
const DocumentEditorClient = dynamic(
  () => import('./DocumentEditorClient'),
  { 
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-[600px] bg-background border border-border rounded-lg">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading editor...</p>
        </div>
      </div>
    )
  }
);

interface DocumentEditorProps {
  documentId: string;
  initialContent?: any;
  markdownContent?: string;
  onSave?: (content: any) => void;
  readOnly?: boolean;
}

export default function DocumentEditor(props: DocumentEditorProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className="flex items-center justify-center h-[600px] bg-background border border-border rounded-lg">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Initializing...</p>
        </div>
      </div>
    );
  }

  return <DocumentEditorClient {...props} />;
}
