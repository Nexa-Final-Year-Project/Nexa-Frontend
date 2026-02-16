import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuthStore } from '@/store/auth/authStore';
import { useDocumentationStore } from '@/store/documentation/documentationStore';
import type { JSONContent } from '@tiptap/core';
import { toast } from 'sonner';

interface UseDocumentSocketProps {
  documentId: string | null;
  enabled?: boolean;
}

export function useDocumentSocket({ documentId, enabled = true }: UseDocumentSocketProps) {
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  
  const user = useAuthStore((state) => state.user);
  const {
    setActiveEditors,
    addActiveEditor,
    removeActiveEditor,
    updateDocumentContent,
    setIsSaving,
    setLastSaved
  } = useDocumentationStore();

  useEffect(() => {
    if (!enabled || !documentId || !user) {
      return;
    }

    // Get backend URL
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
    const socketUrl = backendUrl.replace('/api', '');

    console.log('🔌 Connecting to Socket.IO:', socketUrl);

    // Create socket connection
    const socket = io(socketUrl, {
      transports: ['websocket', 'polling'],
      auth: {
        token: typeof window !== 'undefined' ? localStorage.getItem('authToken') : null
      }
    });

    socketRef.current = socket;

    // Connection handlers
    socket.on('connect', () => {
      console.log('✅ Socket connected:', socket.id);
      setIsConnected(true);
      
      // Join document room
      socket.emit('join-document', {
        documentId,
        user: {
          _id: user._id || user.id,
          name: user.name,
          avatar: user.avatar?.url || ''
        }
      });
    });

    socket.on('disconnect', () => {
      console.log('❌ Socket disconnected');
      setIsConnected(false);
      setActiveEditors([]);
    });

    // Document state
    socket.on('document-state', ({ content, activeEditors }) => {
      console.log('📄 Received document state');
      if (content) {
        updateDocumentContent(documentId, content);
      }
      setActiveEditors(activeEditors || []);
    });

    // User joined
    socket.on('user-joined', (editor) => {
      console.log('👋 User joined:', editor.userName);
      addActiveEditor(editor);
      toast.info(`${editor.userName} joined the document`);
    });

    // User left
    socket.on('user-left', (editor) => {
      console.log('👋 User left:', editor.userName);
      removeActiveEditor(editor.socketId);
      toast.info(`${editor.userName} left the document`);
    });

    // Content updates from other users
    socket.on('content-update', ({ content, userId, userName }) => {
      if (userId !== (user._id || user.id)) {
        console.log('📝 Content update from:', userName);
        setIsSyncing(true);
        updateDocumentContent(documentId, content);
        setTimeout(() => setIsSyncing(false), 500);
      }
    });

    // Document saved
    socket.on('document-saved', ({ success, version, savedBy, savedAt }) => {
      if (success) {
        console.log('💾 Document saved by:', savedBy);
        setIsSaving(false);
        setLastSaved(new Date(savedAt));
        
        if (savedBy !== user.name) {
          toast.success(`Document saved by ${savedBy}`);
        }
      }
    });

    // Save error
    socket.on('save-error', ({ message }) => {
      console.error('❌ Save error:', message);
      setIsSaving(false);
      toast.error(`Failed to save: ${message}`);
    });

    // Error handling
    socket.on('error', ({ message }) => {
      console.error('❌ Socket error:', message);
      toast.error(message);
    });

    // Cleanup
    return () => {
      if (socket.connected) {
        socket.emit('leave-document', {
          documentId,
          user: {
            _id: user._id || user.id,
            name: user.name
          }
        });
      }
      socket.disconnect();
      socketRef.current = null;
      setIsConnected(false);
      setActiveEditors([]);
    };
  }, [documentId, enabled, user]);

  // Emit content change
  const emitContentChange = (content: JSONContent) => {
    if (socketRef.current?.connected && user) {
      socketRef.current.emit('content-change', {
        documentId,
        content,
        user: {
          _id: user._id || user.id,
          name: user.name
        }
      });
    }
  };

  // Emit cursor update
  const emitCursorUpdate = (position: { from: number; to: number }) => {
    if (socketRef.current?.connected && user) {
      socketRef.current.emit('cursor-update', {
        documentId,
        position,
        user: {
          _id: user._id || user.id,
          name: user.name,
          avatar: user.avatar?.url || ''
        }
      });
    }
  };

  // Save document
  const saveDocument = (content: JSONContent) => {
    if (socketRef.current?.connected && user) {
      console.log('💾 Saving document via Socket.IO...');
      setIsSaving(true);
      
      socketRef.current.emit('save-document', {
        documentId,
        content,
        user: {
          _id: user._id || user.id,
          name: user.name
        }
      });
    }
  };

  return {
    isConnected,
    isSyncing,
    emitContentChange,
    emitCursorUpdate,
    saveDocument,
    socket: socketRef.current
  };
}
