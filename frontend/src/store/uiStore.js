import { create } from 'zustand';

const useUIStore = create((set) => ({
  sidebarOpen: typeof window !== 'undefined' ? window.innerWidth >= 1024 : true,
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  setSidebar: (v) => set({ sidebarOpen: v }),

  modal: null,
  openModal: (modal) => set({ modal }),
  closeModal: () => set({ modal: null }),

  coursePlayer: null,
  openPlayer: (data) => set({ coursePlayer: data }),
  closePlayer: () => set({ coursePlayer: null }),
}));

export default useUIStore;
