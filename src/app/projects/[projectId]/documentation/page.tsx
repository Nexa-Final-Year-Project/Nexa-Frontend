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

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between px-6 py-4 border-b">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <FileText className="h-6 w-6" />
            Documentation
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            AI-powered professional documentation with real-time collaboration
          </p>
        </div>

        <div className="flex items-center gap-3">
          <DocumentGenerationModal
            projectId={projectId}
            onGenerated={handleGenerated}
          />
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - Document List */}
        <div className="w-80 border-r flex flex-col bg-muted/30">
          {/* Search and Filters */}
          <div className="p-4 space-y-3 border-b">
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
            <div className="p-4 space-y-2">
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
        <div className="flex-1 flex flex-col">
          {selectedDoc ? (
            <>
              {/* Document Header */}
              <div className="px-6 py-4 border-b bg-muted/20">
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] items-center gap-4">
                  {/* Left: meta */}
                  <div className="min-w-0 flex items-center gap-2 flex-wrap justify-center lg:justify-start">
                    <Badge variant="outline" className="text-xs">
                      {selectedDoc.documentType}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      v{selectedDoc.version}
                    </span>
                    {selectedDoc.generatedBy && (
                      <span className="text-xs text-muted-foreground truncate">
                        by {selectedDoc.generatedBy.name}
                      </span>
                    )}
                  </div>

                  {/* Center: title */}
                  <div className="min-w-0 text-center">
                    <h2 className="text-xl font-bold truncate">{selectedDoc.title}</h2>
                  </div>

                  {/* Right: actions */}
                  <div className="flex items-center gap-2 flex-wrap justify-center lg:justify-end">
                  {/* View Mode Toggle */}
                  <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
                    <Button
                      variant={viewMode === 'preview' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setViewMode('preview')}
                      className="gap-2 h-8"
                    >
                      <Eye className="h-4 w-4" />
                      Preview
                    </Button>
                    <Button
                      variant={viewMode === 'edit' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setViewMode('edit')}
                      className="gap-2 h-8"
                      disabled={selectedDoc.status !== 'completed'}
                    >
                      <Edit3 className="h-4 w-4" />
                      Edit
                    </Button>
                  </div>

                  <Separator orientation="vertical" className="h-8" />

                  {/* Version History */}
                  <VersionHistoryPanel
                    documentId={selectedDoc._id}
                    currentVersion={selectedDoc.version}
                  />

                  <Separator orientation="vertical" className="h-8" />

                  {/* Export Buttons */}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleExport('pdf')}
                    disabled={!!exporting || selectedDoc.status !== 'completed'}
                    className="gap-2"
                  >
                    {exporting === 'pdf' ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Download className="h-4 w-4" />
                    )}
                    PDF
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleExport('word')}
                    disabled={!!exporting || selectedDoc.status !== 'completed'}
                    className="gap-2"
                  >
                    {exporting === 'word' ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Download className="h-4 w-4" />
                    )}
                    Word
                  </Button>

                  <Separator orientation="vertical" className="h-8" />

                  {/* Delete */}
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(selectedDoc._id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  </div>
                </div>
              </div>

              {/* Document Content */}
              <div className="flex-1 overflow-hidden">
                {selectedDoc.status === 'generating' ? (
                  <div className="flex flex-col items-center justify-center h-full">
                    <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
                    <h3 className="text-lg font-medium mb-2">Generating Document...</h3>
                    <p className="text-sm text-muted-foreground">
                      AI is crafting your professional documentation
                    </p>
                  </div>
                ) : selectedDoc.status === 'failed' ? (
                  <div className="flex flex-col items-center justify-center h-full">
                    <div className="bg-destructive/10 rounded-full p-4 mb-4">
                      <Trash2 className="h-12 w-12 text-destructive" />
                    </div>
                    <h3 className="text-lg font-medium mb-2">Generation Failed</h3>
                    <p className="text-sm text-muted-foreground max-w-md text-center">
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
                  // Preview Mode - Show generated markdown
                  <ScrollArea className="h-full">
                    <div className="mx-auto max-w-4xl p-8">
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
            // No Document Selected
            <div className="flex flex-col items-center justify-center h-full text-center p-12">
              <div className="bg-primary/10 rounded-full p-6 mb-6">
                <FileText className="h-16 w-16 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-2">
                No Document Selected
              </h3>
              <p className="text-muted-foreground max-w-md mb-6">
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
