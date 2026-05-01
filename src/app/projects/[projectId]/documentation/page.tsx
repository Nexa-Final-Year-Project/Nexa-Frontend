/**
 * @fileoverview Professional Documentation Page - Complete Implementation
 * @description World-class documentation system with AI generation,
 * real-time collaboration, rich text editing, and version control
 */

"use client";

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Loader2,
  FileText,
  Download,
  Trash2,
  RefreshCw,
  Search,
  Plus,
  Eye,
  Edit3,
  Clock,
  ArrowLeft,
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store/auth/authStore';
import { useDocumentationStore, type Documentation } from '@/store/documentation/documentationStore';
import DocumentEditor from '@/components/documentation/editor/DocumentEditor';
import DocumentGenerationModal from '@/components/documentation/DocumentGenerationModal';
import VersionHistoryPanel from '@/components/documentation/editor/VersionHistoryPanel';
import ReactMarkdown from 'react-markdown';
import { updateDocumentation } from '@/api/documentation/documentationApi';

export default function DocumentationPage() {
  const params = useParams();
  const projectId = params.projectId as string;
  const user = useAuthStore((state) => state.user);

  const {
    documentations,
    selectedDoc,
    setDocumentations,
    setSelectedDoc,
  } = useDocumentationStore();

  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'completed' | 'generating' | 'failed'>('all');
  const [sortOption, setSortOption] = useState<'newest' | 'oldest' | 'title'>('newest');
  const [viewMode, setViewMode] = useState<'preview' | 'edit'>('preview');
  const [exporting, setExporting] = useState<'pdf' | 'word' | null>(null);

  useEffect(() => {
    loadDocumentations();
  }, [projectId]);

  const loadDocumentations = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('authToken');
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
      const apiUrl = backendUrl.endsWith('/api') ? backendUrl : `${backendUrl}/api`;

      const response = await fetch(
        `${apiUrl}/documentation/projects/${projectId}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (data.success && Array.isArray(data.data)) {
        setDocumentations(data.data);
        
        // Auto-select first doc if none selected
        if (data.data.length > 0 && !selectedDoc) {
          setSelectedDoc(data.data[0]);
        }
      }
    } catch (error: any) {
      console.error('Error loading documentations:', error);
      toast.error('Failed to load documentation');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (docId: string) => {
    if (!confirm('Are you sure you want to delete this documentation?')) {
      return;
    }

    try {
      const token = localStorage.getItem('authToken');
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
      const apiUrl = backendUrl.endsWith('/api') ? backendUrl : `${backendUrl}/api`;

      const response = await fetch(
        `${apiUrl}/documentation/${docId}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (data.success) {
        toast.success('Documentation deleted');
        await loadDocumentations();
        
        if (selectedDoc?._id === docId) {
          setSelectedDoc(null);
        }
      }
    } catch (error: any) {
      console.error('Error deleting documentation:', error);
      toast.error('Failed to delete documentation');
    }
  };

  const handleExport = async (format: 'pdf' | 'word') => {
    if (!selectedDoc) return;

    try {
      setExporting(format);
      const token = localStorage.getItem('authToken');
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
      const apiUrl = backendUrl.endsWith('/api') ? backendUrl : `${backendUrl}/api`;

      const response = await fetch(
        `${apiUrl}/documentation/${selectedDoc._id}/export/${format}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error('Export failed');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${selectedDoc.title}.${format === 'pdf' ? 'pdf' : 'docx'}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success(`Exported as ${format.toUpperCase()}`);
    } catch (error: any) {
      console.error('Error exporting:', error);
      toast.error(`Failed to export as ${format.toUpperCase()}`);
    } finally {
      setExporting(null);
    }
  };

  const handleSaveRichText = async (
    docId: string,
    payload: { html: string; markdown: string }
  ) => {
    try {
      await updateDocumentation(docId, {
        richText: { html: payload.html },
        content: {
          markdown: payload.markdown,
          wordCount: payload.markdown.split(/\s+/).filter(Boolean).length,
        },
      });
      toast.success('Document saved');
      await loadDocumentations();
    } catch (error: any) {
      console.error('Error saving document:', error);
      toast.error(error?.message || 'Failed to save document');
    }
  };

  const handleGenerated = async (docId: string) => {
    await loadDocumentations();
    
    // Select the newly generated document
    const doc = documentations.find(d => d._id === docId);
    if (doc) {
      setSelectedDoc(doc);
    }
  };

  // Filter and sort documents
  const filteredDocs = documentations
    .filter((doc) => {
      const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           doc.documentType.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || doc.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      switch (sortOption) {
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'title':
          return a.title.localeCompare(b.title);
        case 'newest':
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300';
      case 'generating': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300';
      case 'failed': return 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-950 dark:text-gray-300';
    }
  };

  const showDocView = !!selectedDoc;

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between px-4 sm:px-6 py-3 sm:py-4 border-b">
        <div className="min-w-0">
          <h1 className="text-lg sm:text-2xl font-bold flex items-center gap-2">
            <FileText className="h-5 w-5 sm:h-6 sm:w-6 flex-shrink-0" />
            Documentation
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 sm:mt-1">
            AI-powered professional documentation with real-time collaboration
          </p>
        </div>

        <div className="flex items-center gap-3 flex-shrink-0">
          <DocumentGenerationModal
            projectId={projectId}
            onGenerated={handleGenerated}
          />
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - Document List */}
        {/* On mobile: full-width, hidden when a doc is selected */}
        {/* On lg+: always visible as a 320px sidebar */}
        <div
          className={cn(
            'flex flex-col bg-muted/30 border-r',
            'w-full lg:w-80 lg:flex-shrink-0',
            showDocView ? 'hidden lg:flex' : 'flex'
          )}
        >
          {/* Search and Filters */}
          <div className="p-3 sm:p-4 space-y-3 border-b">
            <div className="relative">
              <Search className="h-4 w-4 absolute left-3 top-3 text-muted-foreground" />
              <Input
                placeholder="Search documents..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex gap-2">
              <Select
                value={statusFilter}
                onValueChange={(v: any) => setStatusFilter(v)}
              >
                <SelectTrigger className="flex-1 h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="generating">Generating</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={sortOption}
                onValueChange={(v: any) => setSortOption(v)}
              >
                <SelectTrigger className="flex-1 h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="oldest">Oldest</SelectItem>
                  <SelectItem value="title">Title</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                size="sm"
                onClick={loadDocumentations}
                disabled={loading}
              >
                <RefreshCw className={cn('h-4 w-4', loading && 'animate-spin')} />
              </Button>
            </div>
          </div>

          {/* Document List */}
          <ScrollArea className="flex-1">
            <div className="p-3 sm:p-4 space-y-2">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              ) : filteredDocs.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-sm text-muted-foreground">
                    No documents found
                  </p>
                </div>
              ) : (
                filteredDocs.map((doc) => (
                  <div
                    key={doc._id}
                    className={cn(
                      'p-3 rounded-lg border cursor-pointer transition-all',
                      'hover:shadow-md hover:border-primary/50',
                      selectedDoc?._id === doc._id
                        ? 'bg-primary/10 border-primary shadow-md'
                        : 'bg-card hover:bg-muted/50'
                    )}
                    onClick={() => setSelectedDoc(doc)}
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <p className="font-medium text-sm line-clamp-2 flex-1">
                        {doc.title}
                      </p>
                      <Badge
                        className={cn('text-xs flex-shrink-0', getStatusColor(doc.status))}
                        variant="secondary"
                      >
                        {doc.status}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>{new Date(doc.createdAt).toLocaleDateString()}</span>
                    </div>
                    
                    {doc.documentType && (
                      <Badge variant="outline" className="mt-2 text-xs">
                        {doc.documentType}
                      </Badge>
                    )}
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </div>

        {/* Main Content Area */}
        {/* On mobile: full-width, hidden when no doc is selected */}
        {/* On lg+: always visible as the flex-1 content area */}
        <div
          className={cn(
            'flex-1 flex flex-col min-w-0',
            showDocView ? 'flex' : 'hidden lg:flex'
          )}
        >
          {selectedDoc ? (
            <>
              {/* Document Header */}
              <div className="px-3 sm:px-6 py-3 sm:py-4 border-b bg-muted/20 space-y-3">
                {/* Row 1: Back button (mobile) + Title + Meta */}
                <div className="flex items-center gap-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="lg:hidden flex-shrink-0 gap-1.5 -ml-1"
                    onClick={() => setSelectedDoc(null)}
                  >
                    <ArrowLeft className="h-4 w-4" />
                    <span className="text-xs">Back</span>
                  </Button>
                  <div className="min-w-0 flex-1">
                    <h2 className="text-base sm:text-xl font-bold truncate">
                      {selectedDoc.title}
                    </h2>
                    <div className="flex items-center gap-2 flex-wrap mt-1">
                      <Badge variant="outline" className="text-[10px] sm:text-xs">
                        {selectedDoc.documentType}
                      </Badge>
                      <span className="text-[10px] sm:text-xs text-muted-foreground">
                        v{selectedDoc.version}
                      </span>
                      {selectedDoc.generatedBy && (
                        <span className="text-[10px] sm:text-xs text-muted-foreground truncate">
                          by {selectedDoc.generatedBy.name}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Row 2: Actions (scrollable on mobile) */}
                <div className="flex items-center gap-2 overflow-x-auto pb-1 -mb-1 scrollbar-thin">
                  {/* View Mode Toggle */}
                  <div className="flex items-center gap-1 bg-muted rounded-lg p-1 flex-shrink-0">
                    <Button
                      variant={viewMode === 'preview' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setViewMode('preview')}
                      className="gap-1.5 h-7 sm:h-8 text-xs sm:text-sm px-2 sm:px-3"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      Preview
                    </Button>
                    <Button
                      variant={viewMode === 'edit' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setViewMode('edit')}
                      className="gap-1.5 h-7 sm:h-8 text-xs sm:text-sm px-2 sm:px-3"
                      disabled={selectedDoc.status !== 'completed'}
                    >
                      <Edit3 className="h-3.5 w-3.5" />
                      Edit
                    </Button>
                  </div>

                  <Separator orientation="vertical" className="h-6 sm:h-8 flex-shrink-0 hidden sm:block" />

                  <VersionHistoryPanel
                    documentId={selectedDoc._id}
                    currentVersion={selectedDoc.version}
                  />

                  <Separator orientation="vertical" className="h-6 sm:h-8 flex-shrink-0 hidden sm:block" />

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleExport('pdf')}
                    disabled={!!exporting || selectedDoc.status !== 'completed'}
                    className="gap-1.5 flex-shrink-0 h-7 sm:h-8 text-xs sm:text-sm px-2 sm:px-3"
                  >
                    {exporting === 'pdf' ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Download className="h-3.5 w-3.5" />
                    )}
                    PDF
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleExport('word')}
                    disabled={!!exporting || selectedDoc.status !== 'completed'}
                    className="gap-1.5 flex-shrink-0 h-7 sm:h-8 text-xs sm:text-sm px-2 sm:px-3"
                  >
                    {exporting === 'word' ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Download className="h-3.5 w-3.5" />
                    )}
                    Word
                  </Button>

                  <Separator orientation="vertical" className="h-6 sm:h-8 flex-shrink-0 hidden sm:block" />

                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(selectedDoc._id)}
                    className="flex-shrink-0 h-7 sm:h-8 px-2 sm:px-3"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>

              {/* Document Content */}
              <div className="flex-1 overflow-hidden">
                {selectedDoc.status === 'generating' ? (
                  <div className="flex flex-col items-center justify-center h-full p-6">
                    <Loader2 className="h-10 w-10 sm:h-12 sm:w-12 animate-spin text-primary mb-4" />
                    <h3 className="text-base sm:text-lg font-medium mb-2">Generating Document...</h3>
                    <p className="text-xs sm:text-sm text-muted-foreground text-center">
                      AI is crafting your professional documentation
                    </p>
                  </div>
                ) : selectedDoc.status === 'failed' ? (
                  <div className="flex flex-col items-center justify-center h-full p-6">
                    <div className="bg-destructive/10 rounded-full p-3 sm:p-4 mb-4">
                      <Trash2 className="h-8 w-8 sm:h-12 sm:w-12 text-destructive" />
                    </div>
                    <h3 className="text-base sm:text-lg font-medium mb-2">Generation Failed</h3>
                    <p className="text-xs sm:text-sm text-muted-foreground max-w-md text-center">
                      {selectedDoc.generationError || 'An error occurred during generation'}
                    </p>
                  </div>
                ) : viewMode === 'edit' ? (
                  <DocumentEditor
                    documentId={selectedDoc._id}
                    initialContent={selectedDoc.content.richText}
                    markdownContent={selectedDoc.content.markdown}
                    readOnly={false}
                    onSave={(content) => handleSaveRichText(selectedDoc._id, content)}
                  />
                ) : (
                  <ScrollArea className="h-full">
                    <div className="mx-auto max-w-4xl px-4 py-6 sm:p-8">
                      <div className="prose prose-sm dark:prose-invert max-w-none">
                        <ReactMarkdown>
                          {selectedDoc.content.markdown || 
                           selectedDoc.content.projectOverview || 
                           'No content available'}
                        </ReactMarkdown>
                      </div>
                    </div>
                  </ScrollArea>
                )}
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center p-6 sm:p-12">
              <div className="bg-primary/10 rounded-full p-4 sm:p-6 mb-4 sm:mb-6">
                <FileText className="h-10 w-10 sm:h-16 sm:w-16 text-primary" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold mb-2">
                No Document Selected
              </h3>
              <p className="text-sm text-muted-foreground max-w-md mb-4 sm:mb-6">
                Select a document from the sidebar or generate a new one to get started
              </p>
              <DocumentGenerationModal
                projectId={projectId}
                onGenerated={handleGenerated}
                trigger={
                  <Button size="lg" className="gap-2">
                    <Plus className="h-5 w-5" />
                    Generate Your First Document
                  </Button>
                }
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
