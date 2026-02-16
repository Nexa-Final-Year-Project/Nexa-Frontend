/**
 * @fileoverview Section Selector Component
 * @description Beautiful UI for selecting document sections with descriptions
 */

"use client";

import React, { useState, useEffect } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface Subsection {
  id: string;
  title: string;
  description?: string;
  required: boolean;
  selectable: boolean;
}

interface Section {
  section: string;
  title: string;
  description?: string;
  subsections: Subsection[];
}

interface SectionSelectorProps {
  documentType: string;
  onSelectionChange: (selected: Array<{ id: string; title: string }>) => void;
}

export default function SectionSelector({ documentType, onSelectionChange }: SectionSelectorProps) {
  const [structure, setStructure] = useState<Section[]>([]);
  const [selectedSections, setSelectedSections] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    if (documentType) {
      fetchStructure();
    }
  }, [documentType]);
  
  const fetchStructure = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('authToken');
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
      const apiUrl = backendUrl.endsWith('/api') ? backendUrl : `${backendUrl}/api`;
      
      const response = await fetch(
        `${apiUrl}/documentation/types/${documentType}/structure`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );
      
      const data = await response.json();
      
      if (data.success && data.structure) {
        setStructure(data.structure.structure || []);
        
        // Auto-select all required sections
        const required = new Set<string>();
        (data.structure.structure || []).forEach((section: Section) => {
          section.subsections.forEach((sub) => {
            if (sub.required) {
              required.add(sub.id);
            }
          });
        });
        setSelectedSections(required);
        
        // Notify parent of initial selection
        const initialSelected = Array.from(required).map(id => {
          for (const section of data.structure.structure) {
            const sub = section.subsections.find(s => s.id === id);
            if (sub) {
              return { id, title: sub.title };
            }
          }
          return { id, title: '' };
        });
        onSelectionChange(initialSelected);
      } else {
        throw new Error(data.message || 'Failed to fetch structure');
      }
    } catch (error: any) {
      console.error('Failed to fetch structure:', error);
      setError(error.message || 'Failed to load document structure');
      toast.error('Failed to load document structure');
    } finally {
      setLoading(false);
    }
  };
  
  const toggleSection = (sectionId: string, required: boolean) => {
    if (required) {
      toast.info('This section is required and cannot be deselected');
      return;
    }
    
    const newSelected = new Set(selectedSections);
    if (newSelected.has(sectionId)) {
      newSelected.delete(sectionId);
    } else {
      newSelected.add(sectionId);
    }
    setSelectedSections(newSelected);
    
    // Build array of selected sections with titles
    const selected: Array<{ id: string; title: string }> = [];
    for (const section of structure) {
      for (const sub of section.subsections) {
        if (newSelected.has(sub.id)) {
          selected.push({ id: sub.id, title: sub.title });
        }
      }
    }
    
    onSelectionChange(selected);
  };
  
  const getSelectedCount = (section: Section): number => {
    return section.subsections.filter(s => selectedSections.has(s.id)).length;
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <AlertCircle className="h-12 w-12 text-destructive mb-4" />
        <h3 className="text-lg font-medium mb-2">Failed to Load Structure</h3>
        <p className="text-sm text-muted-foreground">{error}</p>
      </div>
    );
  }
  
  if (structure.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
        <p className="text-sm text-muted-foreground">No structure available for this document type</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Select Sections to Include</h3>
          <p className="text-sm text-muted-foreground">
            Choose which sections to include in your document. Required sections are pre-selected.
          </p>
        </div>
        <Badge variant="outline" className="text-sm">
          {selectedSections.size} selected
        </Badge>
      </div>
      
      <ScrollArea className="h-[500px] pr-4">
        <Accordion type="multiple" className="w-full" defaultValue={structure.map(s => s.section)}>
          {structure.map((section) => {
            const selectedCount = getSelectedCount(section);
            const totalCount = section.subsections.length;
            const allSelected = selectedCount === totalCount;
            
            return (
              <AccordionItem key={section.section} value={section.section}>
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center justify-between w-full pr-4">
                    <div className="flex items-center gap-3">
                      {allSelected ? (
                        <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                      ) : (
                        <div className="h-4 w-4 rounded-full border-2 border-muted-foreground flex-shrink-0" />
                      )}
                      <div className="text-left">
                        <span className="font-medium">{section.section}. {section.title}</span>
                        {section.description && (
                          <p className="text-xs text-muted-foreground font-normal mt-0.5">
                            {section.description}
                          </p>
                        )}
                      </div>
                    </div>
                    <Badge 
                      variant={allSelected ? "default" : "outline"} 
                      className="text-xs ml-2"
                    >
                      {selectedCount} / {totalCount}
                    </Badge>
                  </div>
                </AccordionTrigger>
                
                <AccordionContent>
                  <div className="space-y-2 mt-2">
                    {section.subsections.map((subsection) => {
                      const isSelected = selectedSections.has(subsection.id);
                      
                      return (
                        <div 
                          key={subsection.id} 
                          className={cn(
                            "flex items-start space-x-3 p-3 border rounded-lg transition-colors",
                            isSelected ? "bg-primary/5 border-primary/30" : "hover:bg-muted/50"
                          )}
                        >
                          <Checkbox
                            id={subsection.id}
                            checked={isSelected}
                            onCheckedChange={() => toggleSection(subsection.id, subsection.required)}
                            disabled={subsection.required}
                            className="mt-1"
                          />
                          <div className="flex-1 min-w-0">
                            <Label 
                              htmlFor={subsection.id}
                              className={cn(
                                "flex items-center gap-2 font-medium cursor-pointer",
                                subsection.required ? "cursor-not-allowed" : "cursor-pointer"
                              )}
                            >
                              <span>{subsection.title}</span>
                              {subsection.required && (
                                <Badge variant="secondary" className="text-xs">Required</Badge>
                              )}
                            </Label>
                            {subsection.description && (
                              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                                {subsection.description}
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      </ScrollArea>
      
      <div className="flex items-center gap-2 p-3 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg">
        <AlertCircle className="h-4 w-4 text-blue-600 dark:text-blue-400 flex-shrink-0" />
        <p className="text-xs text-blue-900 dark:text-blue-100">
          Required sections cannot be deselected. You can add optional sections by checking them above.
        </p>
      </div>
    </div>
  );
}
