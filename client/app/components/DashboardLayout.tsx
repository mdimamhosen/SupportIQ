import React from 'react';
import { ChatSidebar } from './ChatSidebar';
import { GlowFrame } from './GlowFrame';
import { MessageList } from './MessageList';
import { ChatInput } from './ChatInput';
import { useChatStore } from '../store/useChatStore';
import { useAuthStore } from '../store/useAuthStore';
import { useUIStore } from '../store/useUIStore';
import { Skeleton } from './Skeleton';
import { Header } from './Header';
import { AuthModal } from './AuthModal';
import ProfileModal from './ProfileModal';
import { Menu, X } from 'lucide-react';

export const DashboardLayout: React.FC = () => {
  const { fetchContexts } = useChatStore();
  const { isAuthenticated, isLoading } = useAuthStore();
  const { 
    isSidebarOpen, 
    setSidebarOpen, 
    toggleSidebar,
    isAuthModalOpen,
    closeAuthModal,
    isProfileModalOpen,
    closeProfileModal
  } = useUIStore();

  React.useEffect(() => {
    if (isAuthenticated) {
      fetchContexts();
    }
  }, [isAuthenticated, fetchContexts]);

  return (
    <>
      <Header onMenuClick={toggleSidebar} />
      
      <main className="dashboard-view">
        <div 
          className={`sidebar-overlay ${isSidebarOpen ? 'visible' : ''}`} 
          onClick={() => setSidebarOpen(false)}
        />
        
        <div className={`sidebar-panel ${isSidebarOpen ? 'open' : ''}`}>
          <div className="mobile-sidebar-close show-on-mobile" onClick={() => setSidebarOpen(false)} style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            zIndex: 10,
            color: 'var(--text-muted)',
            cursor: 'pointer'
          }}>
            <X size={24} />
          </div>
          <ChatSidebar onSelect={() => setSidebarOpen(false)} />
        </div>
        
        <GlowFrame className="content-panel">
          <header className="chat-thread-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ flex: 1, textAlign: 'center' }}>
              <span className="editorial" style={{ 
                fontSize: 'clamp(1rem, 4vw, 1.4rem)', 
                fontWeight: 600, 
                letterSpacing: '-0.02em',
                background: 'linear-gradient(to right, #fff, #888)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                opacity: 0.9
              }}>
                {isLoading ? (
                  <Skeleton width="120px" height="1.4rem" />
                ) : !isAuthenticated ? (
                  "Chat Support"
                ) : (
                  ""
                )}
              </span>
            </div>
          </header>
          
          <MessageList />
          <ChatInput />
        </GlowFrame>
      </main>

      <AuthModal isOpen={isAuthModalOpen} onClose={closeAuthModal} />
      <ProfileModal isOpen={isProfileModalOpen} onClose={closeProfileModal} />
    </>
  );
};
