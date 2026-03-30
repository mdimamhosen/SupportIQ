import { create } from 'zustand';

interface UIState {
  isSidebarOpen: boolean;
  isAuthModalOpen: boolean;
  isProfileModalOpen: boolean;
  
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  openProfileModal: () => void;
  closeProfileModal: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  isSidebarOpen: false,
  isAuthModalOpen: false,
  isProfileModalOpen: false,

  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  
  setSidebarOpen: (open) => set({ isSidebarOpen: open }),

  openAuthModal: () => set({ 
    isAuthModalOpen: true, 
    isSidebarOpen: false
  }),

  closeAuthModal: () => set({ isAuthModalOpen: false }),

  openProfileModal: () => set({ 
    isProfileModalOpen: true, 
    isSidebarOpen: false
  }),

  closeProfileModal: () => set({ isProfileModalOpen: false }),
}));
