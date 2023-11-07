import { create } from "zustand";

interface DialogState {
  isOpen: boolean;
  setOpen: (isOpen: boolean) => void;
}

export const projectCreateFormState = create<DialogState>((set) => ({
  isOpen: false,
  setOpen: (isOpen) => set(() => ({ isOpen })),
}));

export const taskCreateFormState = create<DialogState>((set) => ({
  isOpen: false,
  setOpen: (isOpen) => set(() => ({ isOpen })),
}));
