import { create } from 'zustand';
import type { JSONContent } from '@tiptap/core';

export interface DocumentType {
  id: string;
  name: string;
  category: string;
  description: string;
  icon: string;
}

export interface DocumentVersion {
  content: JSONContent;
  editedBy: string;
  editedByName: string;
  createdAt: string;
}

export interface ActiveEditor {
  userId: string;
  userName: string;
  userAvatar: string;
  socketId: string;
  lastActive: string;
}

export interface Documentation {
  _id: string;
  projectId: string;
  title: string;
  documentType: string;
  audience: 'Developers' | 'Managers' | 'Clients' | 'Mixed';
  depthLevel: 'Brief' | 'Standard' | 'Detailed';
  content: {
    richText?: JSONContent | null;
    markdown?: string;
    sections?: Array<{
      level: number;
      title: string;
      content: string;
    }>;
    wordCount?: number;
    // Legacy fields
    projectOverview?: string;
    problemStatement?: string;
    systemArchitecture?: string;
    techStack?: string;
    sprintBreakdown?: string;
    taskWorkflow?: string;
    aiFeatures?: string;
    apiOverview?: string;
    databaseModels?: string;
    authSecurity?: string;
    deploymentNotes?: string;
    futureRoadmap?: string;
    appendix?: string;
  };
  userRequirements?: string;
  customSections?: Array<{
    title: string;
    description: string;
  }>;
  additionalNotes?: string;
  sprintId?: string;
  metadata?: {
    projectName?: string;
    projectDescription?: string;
    owner?: string;
    timeline?: string;
    sprintCount?: number;
    taskCount?: number;
    teamSize?: number;
  };
  generatedBy: {
    _id: string;
    name: string;
    email: string;
  };
  status: 'generating' | 'completed' | 'failed';
  version: number;
  aiGenerated: boolean;
  generationError: string | null;
  createdAt: string;
  updatedAt: string;
  activeEditors?: ActiveEditor[];
  versions?: DocumentVersion[];
}

interface DocumentationStore {
  // State
  documentations: Documentation[];
  selectedDoc: Documentation | null;
  documentTypes: DocumentType[];
  activeEditors: ActiveEditor[];
  isGenerating: boolean;
  isSaving: boolean;
  lastSaved: Date | null;
  
  // Actions
  setDocumentations: (docs: Documentation[]) => void;
  setSelectedDoc: (doc: Documentation | null) => void;
  setDocumentTypes: (types: DocumentType[]) => void;
  setActiveEditors: (editors: ActiveEditor[]) => void;
  setIsGenerating: (generating: boolean) => void;
  setIsSaving: (saving: boolean) => void;
  setLastSaved: (date: Date | null) => void;
  updateDocumentContent: (docId: string, content: JSONContent) => void;
  addActiveEditor: (editor: ActiveEditor) => void;
  removeActiveEditor: (socketId: string) => void;
}

export const useDocumentationStore = create<DocumentationStore>((set, get) => ({
  // Initial state
  documentations: [],
  selectedDoc: null,
  documentTypes: [],
  activeEditors: [],
  isGenerating: false,
  isSaving: false,
  lastSaved: null,
  
  // Actions
  setDocumentations: (docs) => set({ documentations: docs }),
  
  setSelectedDoc: (doc) => set({ selectedDoc: doc }),
  
  setDocumentTypes: (types) => set({ documentTypes: types }),
  
  setActiveEditors: (editors) => set({ activeEditors: editors }),
  
  setIsGenerating: (generating) => set({ isGenerating: generating }),
  
  setIsSaving: (saving) => set({ isSaving: saving }),
  
  setLastSaved: (date) => set({ lastSaved: date }),
  
  updateDocumentContent: (docId, content) => {
    const { documentations, selectedDoc } = get();
    
    // Update in list
    const updatedDocs = documentations.map(doc => 
      doc._id === docId 
        ? { ...doc, content: { ...doc.content, richText: content } }
        : doc
    );
    
    // Update selected if it's the same doc
    const updatedSelected = selectedDoc?._id === docId
      ? { ...selectedDoc, content: { ...selectedDoc.content, richText: content } }
      : selectedDoc;
    
    set({
      documentations: updatedDocs,
      selectedDoc: updatedSelected
    });
  },
  
  addActiveEditor: (editor) => {
    const { activeEditors } = get();
    const exists = activeEditors.find(e => e.socketId === editor.socketId);
    
    if (!exists) {
      set({ activeEditors: [...activeEditors, editor] });
    }
  },
  
  removeActiveEditor: (socketId) => {
    const { activeEditors } = get();
    set({ activeEditors: activeEditors.filter(e => e.socketId !== socketId) });
  },
}));
