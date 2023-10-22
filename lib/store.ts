import { create } from "zustand";

interface DrawerState {
  isOpen: boolean;
  setOpen: (isOpen: boolean) => void;
}

export const useDrawerStore = create<DrawerState>((set) => ({
  isOpen: false,
  setOpen: (isOpen) => set(() => ({ isOpen })),
}));
