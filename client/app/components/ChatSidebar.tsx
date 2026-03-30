import React from 'react';
import { useChatStore } from '../store/useChatStore';
import { useAuthStore } from '../store/useAuthStore';
import { useUIStore } from '../store/useUIStore';
import { Plus, MessageSquare, LogIn, LogOut } from 'lucide-react';
import { Skeleton } from './Skeleton';

interface ChatSidebarProps {
  onSelect?: () => void;
}

export const ChatSidebar: React.FC<ChatSidebarProps> = ({ onSelect }) => {
  const { chatContexts, currentContextId, setContext, startNewChat } = useChatStore();
  const { isAuthenticated, isLoading, logout, user } = useAuthStore();
  const { openAuthModal, openProfileModal } = useUIStore();

  const handleSelect = (id: number) => {
    setContext(id);
    onSelect?.();
  };

  const handleNewChat = () => {
    startNewChat();
    onSelect?.();
  };

  const getInitials = () => {
    if (user?.firstName || user?.lastName) {
      const first = user.firstName?.charAt(0) || '';
      const last = user.lastName?.charAt(0) || '';
      return (first + last).toUpperCase() || 'U';
    }
    if (user?.username) return user.username.charAt(0).toUpperCase();
    return 'U';
  };

  return (
    <div className="glow-frame sidebar-panel-inner" style={{ 
      height: '100%', 
      border: 'none', 
      display: 'flex', 
      flexDirection: 'column' 
    }}>
      <div className="sidebar-header">
        <h3 className="editorial" style={{ fontSize: '1.2rem', marginBottom: '4px' }}>Conversations</h3>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Manage your AI interactions</p>
        
        {isAuthenticated && !isLoading && (
          <button 
            className="glass-button-v2" 
            onClick={handleNewChat}
          >
            <Plus size={18} />
            <span>New Chat</span>
          </button>
        )}
        
        {isLoading && (
          <div style={{ marginTop: '12px' }}>
            <Skeleton height="40px" className="skeleton-rounded" />
          </div>
        )}
      </div>
      
      <div className="conversation-list" style={{ flex: 1, overflowY: 'auto' }}>
        {isLoading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <div key={i} style={{ padding: '16px', display: 'flex', gap: '12px' }}>
              <div style={{ flex: 1 }}>
                <Skeleton width="70%" height="1.1rem" style={{ marginBottom: '8px' }} />
                <Skeleton width="40%" height="0.75rem" />
              </div>
            </div>
          ))
        ) : !isAuthenticated && !isLoading ? (
          <div style={{ padding: '24px', textAlign: 'center', opacity: 0.6 }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
              <MessageSquare size={32} style={{ opacity: 0.3 }} />
            </div>
            <p className="editorial" style={{ fontSize: '0.9rem', marginBottom: '8px' }}>Login Required</p>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Sign in to access your chats</p>
          </div>
        ) : !isAuthenticated && isLoading ? null : (
          chatContexts.map((context) => (
            <div 
              key={context.id} 
              className={`conversation-item ${context.id === currentContextId ? 'active' : ''}`}
              onClick={() => handleSelect(context.id)}
            >
              <div className="conv-info">
                <div className="conv-name-row">
                  <span className="conv-name">{context.summary}</span>
                  <span className="conv-time">
                    {new Date(context.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="sidebar-auth-footer show-on-mobile" style={{
        padding: '20px',
        borderTop: '1px solid var(--glass-border)',
        marginTop: 'auto',
        background: 'rgba(255, 255, 255, 0.02)'
      }}>
        {!isAuthenticated ? (
          <button 
            onClick={openAuthModal}
            style={{ 
              width: '100%',
              background: 'linear-gradient(135deg, var(--primary), var(--secondary))', 
              color: '#000',
              border: 'none',
              padding: '12px',
              borderRadius: '12px',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            <LogIn size={18} />
            <span>Sign In</span>
          </button>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
            <button 
              onClick={openProfileModal}
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                background: 'rgba(255, 255, 255, 0.05)',
                padding: '10px 16px',
                borderRadius: '12px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: '#fff',
                cursor: 'pointer'
              }}
            >
              <div style={{ 
                width: '32px', 
                height: '32px', 
                background: 'linear-gradient(135deg, var(--primary), #a855f7)', 
                borderRadius: '50%', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                fontSize: '11px', 
                fontWeight: 800
              }}>
                {getInitials()}
              </div>
              <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>Profile</span>
            </button>
            <button 
              onClick={logout}
              style={{
                padding: '12px',
                background: 'rgba(255, 68, 68, 0.1)',
                border: '1px solid rgba(255, 68, 68, 0.2)',
                borderRadius: '12px',
                color: '#ff4444',
                cursor: 'pointer'
              }}
            >
              <LogOut size={20} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
