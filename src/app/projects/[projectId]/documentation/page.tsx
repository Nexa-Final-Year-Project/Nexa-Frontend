"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import {
  generateDocumentation,
  getProjectDocumentation,
  getDocumentation,
  deleteDocumentation,
  exportToPDF,
  exportToWord,
  downloadFile,
  getGenerationStatus,
  type DocumentationType,
  type GenerateDocumentationRequest,
} from "@/api/documentation/documentationApi";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge/badge";
import {
  Loader2,
  FileText,
  Download,
  Trash2,
  RefreshCw,
  FileCheck,
  Edit,
  Search,
} from "lucide-react";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";

export default function DocumentationPage() {
  const params = useParams();
  const projectId = params.projectId as string;

  const [documentations, setDocumentations] = useState<DocumentationType[]>([]);
  const [selectedDoc, setSelectedDoc] = useState<DocumentationType | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [exporting, setExporting] = useState<"pdf" | "word" | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "completed" | "generating" | "failed"
  >("all");
  const [sortOption, setSortOption] = useState<
    "newest" | "oldest" | "title" | "status"
  >("newest");
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editOverview, setEditOverview] = useState("");
  const [editProblem, setEditProblem] = useState("");
  const [savingEdit, setSavingEdit] = useState(false);

  // Form state
  const [documentType, setDocumentType] = useState<
    "Technical" | "Product" | "Client-Facing"
  >("Technical");
  const [audience, setAudience] = useState<
    "Developers" | "Managers" | "Clients" | "Mixed"
  >("Developers");
  const [depthLevel, setDepthLevel] = useState<
    "Brief" | "Standard" | "Detailed"
  >("Standard");

  useEffect(() => {
    loadDocumentations();
  }, [projectId]);

  const loadDocumentations = async (options?: {
    forceSelectFirst?: boolean;
  }) => {
    try {
      setLoading(true);
      const response = await getProjectDocumentation(projectId);
      if (response.success && Array.isArray(response.data)) {
        const docs = response.data;
        setDocumentations(docs);

        const stillExists =
          selectedDoc && docs.find((d) => d._id === selectedDoc._id);
        if (docs.length === 0) {
          setSelectedDoc(null);
        } else if (options?.forceSelectFirst || !stillExists) {
          setSelectedDoc(docs[0]);
        }
        return docs;
      }
    } catch (error: any) {
      console.error("Error loading documentations:", error);
      const errorMessage = error?.message || "Failed to load documentation";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async () => {
    try {
      setGenerating(true);
      const request: GenerateDocumentationRequest = {
        documentType,
        audience,
        depthLevel,
      };

      const response = await generateDocumentation(projectId, request);

      if (response.success && response.data && !Array.isArray(response.data)) {
        toast.success("Documentation generation started!");

        // Poll for completion
        pollGenerationStatus(response.data._id);
      }
    } catch (error: any) {
      console.error("Error generating documentation:", error);
      const errorMessage = error?.message || "Failed to generate documentation";
      toast.error(errorMessage);
      setGenerating(false);
    }
  };

  const pollGenerationStatus = async (docId: string) => {
    const interval = setInterval(async () => {
      try {
        const statusResponse = await getGenerationStatus(docId);

        if (statusResponse.success && statusResponse.data) {
          const { status } = statusResponse.data;

          if (status === "completed") {
            clearInterval(interval);
            toast.success("Documentation generated successfully!");
            await loadDocumentations();

            // Select the newly generated doc
            const docResponse = await getDocumentation(docId);
            if (docResponse.success && !Array.isArray(docResponse.data)) {
              setSelectedDoc(docResponse.data);
            }
            setGenerating(false);
          } else if (status === "failed") {
            clearInterval(interval);
            toast.error("Documentation generation failed");
            setGenerating(false);
          }
        }
      } catch (error) {
        clearInterval(interval);
        console.error("Error polling status:", error);
        setGenerating(false);
      }
    }, 3000); // Poll every 3 seconds

    // Timeout after 5 minutes
    setTimeout(() => {
      clearInterval(interval);
      if (generating) {
        toast.error("Generation timeout - please check manually");
        setGenerating(false);
      }
    }, 300000);
  };

  const handleDelete = async (docId: string) => {
    if (!confirm("Are you sure you want to delete this documentation?")) {
      return;
    }

    try {
      await deleteDocumentation(docId);
      toast.success("Documentation deleted");
      const docs = await loadDocumentations({ forceSelectFirst: true });
      if (docs && docs.length > 0) {
        setSelectedDoc(docs[0]);
      } else {
        setSelectedDoc(null);
      }
    } catch (error: any) {
      console.error("Error deleting documentation:", error);
      toast.error("Failed to delete documentation");
    }
  };

  const startEditing = () => {
    if (!selectedDoc) return;
    setEditTitle(selectedDoc.title);
    setEditOverview(selectedDoc.content.projectOverview || "");
    setEditProblem(selectedDoc.content.problemStatement || "");
    setIsEditing(true);
  };

  const handleSaveEdit = async () => {
    if (!selectedDoc) return;
    try {
      setSavingEdit(true);
      await updateDocumentation(selectedDoc._id, {
        title: editTitle,
        content: {
          projectOverview: editOverview,
          problemStatement: editProblem,
        },
      });

      toast.success("Documentation updated");
      const docs = await loadDocumentations();
      if (docs) {
        const updated = docs.find((d) => d._id === selectedDoc._id);
        setSelectedDoc(updated || null);
      }
      setIsEditing(false);
    } catch (error: any) {
      console.error("Error updating documentation:", error);
      toast.error(error?.message || "Failed to update documentation");
    } finally {
      setSavingEdit(false);
    }
  };

  const filteredDocumentations = documentations
    .filter((doc) => {
      const term = searchTerm.toLowerCase();
      const matchesSearch =
        doc.title.toLowerCase().includes(term) ||
        doc.documentType.toLowerCase().includes(term) ||
        doc.audience.toLowerCase().includes(term) ||
        doc.depthLevel.toLowerCase().includes(term);
      const matchesStatus =
        statusFilter === "all" ? true : doc.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      switch (sortOption) {
        case "oldest":
          return (
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );
        case "title":
          return a.title.localeCompare(b.title);
        case "status":
          return a.status.localeCompare(b.status);
        case "newest":
        default:
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
      }
    });

  const handleExport = async (format: "pdf" | "word") => {
    if (!selectedDoc) return;

    try {
      setExporting(format);

      const blob =
        format === "pdf"
          ? await exportToPDF(selectedDoc._id)
          : await exportToWord(selectedDoc._id);

      const filename = `${selectedDoc.title}.${
        format === "pdf" ? "pdf" : "docx"
      }`;
      downloadFile(blob, filename);

      toast.success(`Exported as ${format.toUpperCase()}`);
    } catch (error: any) {
      console.error("Error exporting:", error);
      toast.error(`Failed to export as ${format.toUpperCase()}`);
    } finally {
      setExporting(null);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold">📘 Documentation</h1>
          <p className="text-muted-foreground mt-1">
            AI-powered project documentation generation
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="h-4 w-4 absolute left-3 top-3 text-muted-foreground" />
            <Input
              placeholder="Search docs..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <Select
            value={statusFilter}
            onValueChange={(v: any) => setStatusFilter(v)}
          >
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="generating">Generating</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={sortOption}
            onValueChange={(v: any) => setSortOption(v)}
          >
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Sort" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest first</SelectItem>
              <SelectItem value="oldest">Oldest first</SelectItem>
              <SelectItem value="title">Title A-Z</SelectItem>
              <SelectItem value="status">Status</SelectItem>
            </SelectContent>
          </Select>

          <Button
            onClick={() => loadDocumentations({ forceSelectFirst: true })}
            variant="outline"
            size="sm"
            disabled={loading}
            className="w-full sm:w-auto"
          >
            <RefreshCw
              className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Generation Panel */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Generate New Documentation</CardTitle>
            <CardDescription>
              Configure and generate AI-powered documentation
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium block">Document Type</label>
              <Select
                value={documentType}
                onValueChange={(value: any) => setDocumentType(value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent align="center">
                  <SelectItem value="Technical">📄 Technical</SelectItem>
                  <SelectItem value="Product">📦 Product</SelectItem>
                  <SelectItem value="Client-Facing">
                    🤝 Client-Facing
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium block">Audience</label>
              <Select
                value={audience}
                onValueChange={(value: any) => setAudience(value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent align="center">
                  <SelectItem value="Developers">👨‍💻 Developers</SelectItem>
                  <SelectItem value="Managers">👔 Managers</SelectItem>
                  <SelectItem value="Clients">🎯 Clients</SelectItem>
                  <SelectItem value="Mixed">👥 Mixed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium block">Depth Level</label>
              <Select
                value={depthLevel}
                onValueChange={(value: any) => setDepthLevel(value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent align="center">
                  <SelectItem value="Brief">⚡ Brief</SelectItem>
                  <SelectItem value="Standard">📊 Standard</SelectItem>
                  <SelectItem value="Detailed">📚 Detailed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              onClick={handleGenerate}
              disabled={generating}
              className="w-full"
            >
              {generating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <FileCheck className="h-4 w-4 mr-2" />
                  Generate Documentation
                </>
              )}
            </Button>

            {/* Recent Documentations */}
            <div className="pt-4 border-t">
              <h3 className="text-sm font-medium mb-3">Recent Documentation</h3>
              <div className="space-y-2 max-h-[300px] overflow-y-auto">
                {filteredDocumentations.map((doc) => (
                  <div
                    key={doc._id}
                    className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                      selectedDoc?._id === doc._id
                        ? "bg-primary/10 border-primary"
                        : "hover:bg-muted"
                    }`}
                    onClick={() => setSelectedDoc(doc)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">
                          {doc.title}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(doc.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge
                        variant={
                          doc.status === "completed" ? "default" : "secondary"
                        }
                      >
                        {doc.status}
                      </Badge>
                    </div>
                  </div>
                ))}

                {filteredDocumentations.length === 0 && !loading && (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No documentation found
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Preview Panel */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>
                  {selectedDoc?.title || "No Documentation Selected"}
                </CardTitle>
                {selectedDoc && (
                  <CardDescription className="mt-2 flex gap-2">
                    <Badge>{selectedDoc.documentType}</Badge>
                    <Badge variant="outline">{selectedDoc.audience}</Badge>
                    <Badge variant="outline">{selectedDoc.depthLevel}</Badge>
                  </CardDescription>
                )}
              </div>

              {selectedDoc && (
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" size="sm" onClick={startEditing}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleExport("pdf")}
                    disabled={!!exporting}
                  >
                    {exporting === "pdf" ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <>
                        <Download className="h-4 w-4 mr-2" />
                        PDF
                      </>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleExport("word")}
                    disabled={!!exporting}
                  >
                    {exporting === "word" ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <>
                        <Download className="h-4 w-4 mr-2" />
                        Word
                      </>
                    )}
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(selectedDoc._id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {selectedDoc ? (
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="flex flex-wrap gap-2 overflow-x-auto scrollbar-none px-1 py-1">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="architecture">Architecture</TabsTrigger>
                  <TabsTrigger value="sprints">Sprints</TabsTrigger>
                  <TabsTrigger value="tasks">Tasks</TabsTrigger>
                  <TabsTrigger value="ai">AI Features</TabsTrigger>
                  <TabsTrigger value="api">API</TabsTrigger>
                  <TabsTrigger value="more">More</TabsTrigger>
                </TabsList>

                {isEditing && (
                  <div className="grid gap-4 border rounded-lg p-4 mb-4">
                    <Input
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      placeholder="Title"
                    />
                    <Textarea
                      value={editOverview}
                      onChange={(e) => setEditOverview(e.target.value)}
                      placeholder="Project overview (markdown)"
                      rows={4}
                    />
                    <Textarea
                      value={editProblem}
                      onChange={(e) => setEditProblem(e.target.value)}
                      placeholder="Problem statement (markdown)"
                      rows={4}
                    />
                    <div className="flex gap-2 justify-end">
                      <Button
                        variant="outline"
                        onClick={() => setIsEditing(false)}
                        disabled={savingEdit}
                      >
                        Cancel
                      </Button>
                      <Button onClick={handleSaveEdit} disabled={savingEdit}>
                        {savingEdit ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Saving
                          </>
                        ) : (
                          "Save changes"
                        )}
                      </Button>
                    </div>
                  </div>
                )}

                <div className="mt-4 max-h-[70vh] overflow-y-auto prose prose-sm dark:prose-invert max-w-none">
                  <TabsContent value="overview">
                    <ReactMarkdown>
                      {selectedDoc.content?.projectOverview ||
                        "No overview available."}
                    </ReactMarkdown>
                    <ReactMarkdown>
                      {selectedDoc.content?.problemStatement || ""}
                    </ReactMarkdown>
                  </TabsContent>

                  <TabsContent value="architecture">
                    <ReactMarkdown>
                      {selectedDoc.content?.systemArchitecture || ""}
                    </ReactMarkdown>
                    <ReactMarkdown>
                      {selectedDoc.content?.techStack || ""}
                    </ReactMarkdown>
                  </TabsContent>

                  <TabsContent value="sprints">
                    <ReactMarkdown>
                      {selectedDoc.content?.sprintBreakdown || ""}
                    </ReactMarkdown>
                  </TabsContent>

                  <TabsContent value="tasks">
                    <ReactMarkdown>
                      {selectedDoc.content?.taskWorkflow || ""}
                    </ReactMarkdown>
                  </TabsContent>

                  <TabsContent value="ai">
                    <ReactMarkdown>
                      {selectedDoc.content?.aiFeatures || ""}
                    </ReactMarkdown>
                  </TabsContent>

                  <TabsContent value="api">
                    <ReactMarkdown>
                      {selectedDoc.content?.apiOverview || ""}
                    </ReactMarkdown>
                    <ReactMarkdown>
                      {selectedDoc.content?.databaseModels || ""}
                    </ReactMarkdown>
                  </TabsContent>

                  <TabsContent value="more">
                    <ReactMarkdown>
                      {selectedDoc.content?.authSecurity || ""}
                    </ReactMarkdown>
                    <ReactMarkdown>
                      {selectedDoc.content?.deploymentNotes || ""}
                    </ReactMarkdown>
                    <ReactMarkdown>
                      {selectedDoc.content?.futureRoadmap || ""}
                    </ReactMarkdown>
                    <ReactMarkdown>
                      {selectedDoc.content?.appendix || ""}
                    </ReactMarkdown>
                  </TabsContent>
                </div>
              </Tabs>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <FileText className="h-16 w-16 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">
                  No Documentation Selected
                </h3>
                <p className="text-sm text-muted-foreground max-w-md">
                  Generate new documentation or select an existing one from the
                  sidebar to preview and export.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
