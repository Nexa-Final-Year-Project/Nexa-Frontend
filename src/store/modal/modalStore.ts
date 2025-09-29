// store/modal/modalStore.ts
import { create } from "zustand";

interface ModalState {
  stack: { type: string; data?: any }[];
  openModal: (type: string, data?: any) => void;
  closeModal: () => void; // closes top modal
  closeAllModals: () => void;
}

export const useModalStore = create<ModalState>((set, get) => ({
  stack: [],
  openModal: (type, data) =>
    set((state) => ({ stack: [...state.stack, { type, data }] })),
  closeModal: () => set((state) => ({ stack: state.stack.slice(0, -1) })),
  closeAllModals: () => set({ stack: [] }),
}));
