/**
 * @fileoverview Document Generation Modal - AI Configuration Form
 * @description Professional modal for configuring and generating AI documents
 */

"use client";

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge/badge';
import { FileCheck, Loader2, Plus, X, Sparkles, ArrowLeft, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import DocumentTypeSelector from './DocumentTypeSelector';
import SectionSelector from './SectionSelector';
import type { DocumentType } from '@/store/documentation/documentationStore';

interface DocumentGenerationModalProps {
  projectId: string;
  onGenerated?: (documentId: string) => void;
  trigger?: React.ReactNode;
}

interface CustomSection {
  title: string;
  description: string;
}

interface SelectedSection {
  id: string;
  title: string;
}

export default function DocumentGenerationModal({
  projectId,
  onGenerated,
  trigger
}: DocumentGenerationModalProps) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<'type' | 'sections' | 'config'>('type');
  const [generating, setGenerating] = useState(false);

  // Form state
  const [selectedType, setSelectedType] = useState<DocumentType | null>(null);
  const [selectedSections, setSelectedSections] = useState<SelectedSection[]>([]);
  const [sprintId, setSprintId] = useState('');
  const [userRequirements, setUserRequirements] = useState('');
  const [additionalNotes, setAdditionalNotes] = useState('');
  const [customSections, setCustomSections] = useState<CustomSection[]>([]);

  const handleTypeSelect = (docType: DocumentType) => {
    setSelectedType(docType);
  };

  const handleNext = () => {
    if (!selectedType) {
      toast.error('Please select a document type');
      return;
    }
    setStep('sections');
  };
  
  const handleNextFromSections = () => {
    // Empty selectedSections is allowed — it means "generate all sections"
    // (the agent treats an empty array as no filter applied).
    setStep('config');
  };

  const handleBack = () => {
    if (step === 'config') {
      setStep('sections');
    } else if (step === 'sections') {
      setStep('type');
    }
  };

  const addCustomSection = () => {
    setCustomSections([...customSections, { title: '', description: '' }]);
  };

  const removeCustomSection = (index: number) => {
    setCustomSections(customSections.filter((_, i) => i !== index));
  };

  const updateCustomSection = (index: number, field: 'title' | 'description', value: string) => {
    const updated = [...customSections];
    updated[index][field] = value;
    setCustomSections(updated);
  };

  const handleGenerate = async () => {
    if (!selectedType) return;

    try {
      setGenerating(true);
      const token = localStorage.getItem('authToken');
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
      const apiUrl = backendUrl.endsWith('/api') ? backendUrl : `${backendUrl}/api`;

      const requestBody = {
        documentType: selectedType.id,
        selectedSections,  // NEW: Include selected sections
        sprintId: sprintId || undefined,
        userRequirements: userRequirements || undefined,
        customSections: customSections.filter(s => s.title.trim() !== ''),
        additionalNotes: additionalNotes || undefined,
        includeDataSummary: true,
      };

      const response = await fetch(
        `${apiUrl}/documentation/projects/${projectId}/generate`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(requestBody),
        }
      );

      const data = await response.json();

      if (data.success && data.data && !Array.isArray(data.data)) {
        toast.success('Document generation started!');
        
        // Start polling for completion
        const docId = data.data._id || data.data.documentationId;
        pollGenerationStatus(docId);
      } else {
        toast.error(data.message || 'Failed to start generation');
        setGenerating(false);
      }
    } catch (error: any) {
      console.error('Error generating document:', error);
      toast.error(error.message || 'Failed to generate document');
      setGenerating(false);
    }
  };

  const pollGenerationStatus = async (docId: string) => {
    const maxAttempts = 100; // 5 minutes max (3s * 100)
    let attempts = 0;

    const interval = setInterval(async () => {
      attempts++;

      try {
        const token = localStorage.getItem('authToken');
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
        const apiUrl = backendUrl.endsWith('/api') ? backendUrl : `${backendUrl}/api`;

        const response = await fetch(
          `${apiUrl}/documentation/${docId}/status`,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (data.success && data.data) {
          const { status } = data.data;

          if (status === 'completed') {
            clearInterval(interval);
            toast.success('Document generated successfully!');
            setGenerating(false);
            setOpen(false);
            resetForm();
            
            if (onGenerated) {
              onGenerated(docId);
            }
          } else if (status === 'failed') {
            clearInterval(interval);
            toast.error('Document generation failed');
            setGenerating(false);
          } else if (attempts >= maxAttempts) {
            clearInterval(interval);
            toast.error('Generation timeout - please check manually');
            setGenerating(false);
          }
        }
      } catch (error) {
        if (attempts >= maxAttempts) {
          clearInterval(interval);
          setGenerating(false);
        }
      }
    }, 3000); // Poll every 3 seconds
  };

  const resetForm = () => {
    setStep('type');
    setSelectedType(null);
    setSelectedSections([]);
    setSprintId('');
    setUserRequirements('');
    setAdditionalNotes('');
    setCustomSections([]);
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      setOpen(isOpen);
      if (!isOpen) {
        resetForm();
      }
    }}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="gap-2">
            <Sparkles className="h-4 w-4" />
            Generate Documentation
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="w-[min(96vw,64rem)] max-h-[90vh] overflow-y-auto overflow-x-hidden">
        <DialogHeader>
          <DialogTitle>
            {step === 'type' && 'Select Document Type'}
            {step === 'sections' && 'Select Sections'}
            {step === 'config' && 'Configure Document'}
          </DialogTitle>
          <DialogDescription>
            {step === 'type' && 'Choose the type of documentation you want to generate'}
            {step === 'sections' && 'Choose which sections to include in your document'}
            {step === 'config' && 'Customize your document generation settings'}
          </DialogDescription>
        </DialogHeader>

        {step === 'type' ? (
          <>
            <DocumentTypeSelector
              onSelect={handleTypeSelect}
              selectedType={selectedType}
            />

            <DialogFooter>
              <Button
                onClick={handleNext}
                disabled={!selectedType}
                className="gap-2"
              >
                Next
                <ArrowRight className="h-4 w-4" />
              </Button>
            </DialogFooter>
          </>
        ) : step === 'sections' ? (
          <>
            <SectionSelector
              documentType={selectedType?.id || ''}
              onSelectionChange={setSelectedSections}
            />

            <DialogFooter className="gap-2">
              <Button variant="outline" onClick={handleBack} className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
              <Button
                onClick={handleNextFromSections}
                disabled={selectedSections.length === 0}
                className="gap-2"
              >
                Next
                <ArrowRight className="h-4 w-4" />
              </Button>
            </DialogFooter>
          </>
        ) : (
          <>
            <div className="space-y-6">
              {/* Selected Type Info */}
              <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                <div className="flex items-center gap-3">
                  <FileCheck className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">{selectedType?.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {selectedType?.category}
                    </p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" onClick={handleBack}>
                  Change
                </Button>
              </div>

              <Separator />

              {/* Sprint ID (optional) */}
              {selectedType?.id === 'SPRINT_REPORT' && (
                <div className="space-y-2">
                  <Label htmlFor="sprintId">Sprint ID (Optional)</Label>
                  <Input
                    id="sprintId"
                    placeholder="Enter sprint ID for sprint-specific report"
                    value={sprintId}
                    onChange={(e) => setSprintId(e.target.value)}
                  />
                </div>
              )}

              {/* User Requirements */}
              <div className="space-y-2">
                <Label htmlFor="userRequirements">
                  Requirements & Focus Areas
                </Label>
                <Textarea
                  id="userRequirements"
                  placeholder="Describe what you want to emphasize in the document..."
                  rows={4}
                  value={userRequirements}
                  onChange={(e) => setUserRequirements(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Provide specific requirements or areas you want the AI to focus on
                </p>
              </div>

              {/* Custom Sections */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Custom Sections (Optional)</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addCustomSection}
                    className="gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Add Section
                  </Button>
                </div>

                {customSections.map((section, index) => (
                  <div key={index} className="flex gap-2 items-start p-3 border rounded-lg">
                    <div className="flex-1 space-y-2">
                      <Input
                        placeholder="Section title"
                        value={section.title}
                        onChange={(e) => updateCustomSection(index, 'title', e.target.value)}
                      />
                      <Input
                        placeholder="Section description"
                        value={section.description}
                        onChange={(e) => updateCustomSection(index, 'description', e.target.value)}
                      />
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeCustomSection(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>

              {/* Additional Notes */}
              <div className="space-y-2">
                <Label htmlFor="additionalNotes">
                  Additional Instructions for AI
                </Label>
                <Textarea
                  id="additionalNotes"
                  placeholder="Any additional notes or instructions for the AI..."
                  rows={3}
                  value={additionalNotes}
                  onChange={(e) => setAdditionalNotes(e.target.value)}
                />
              </div>
            </div>

            <DialogFooter className="gap-2">
              <Button variant="outline" onClick={handleBack} disabled={generating}>
                Back
              </Button>
              <Button onClick={handleGenerate} disabled={generating} className="gap-2">
                {generating ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    Generate Document
                  </>
                )}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
