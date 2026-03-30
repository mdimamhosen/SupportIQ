import React from 'react';
import { Sparkles, LogIn, LogOut, Menu } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { useUIStore } from '../store/useUIStore';
import { Skeleton } from './Skeleton';

interface HeaderProps {
  onMenuClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const { isAuthenticated, logout, user, isLoading } = useAuthStore();
  const { openAuthModal, openProfileModal, toggleSidebar } = useUIStore();
  
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
    <header className="app-header">
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <button 
          className="mobile-sidebar-trigger show-on-mobile" 
          onClick={toggleSidebar}
          style={{ 
            background: 'rgba(255, 255, 255, 0.05)', 
            border: '1px solid rgba(255, 255, 255, 0.1)', 
            color: 'var(--primary)', 
            width: '44px', 
            height: '44px', 
            borderRadius: '12px', 
            display: 'none', 
            alignItems: 'center', 
            justifyContent: 'center',
            cursor: 'pointer'
          }}
        >
          <Menu size={24} />
        </button>

        <div className="logo" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, fontSize: '1.5rem', background: 'rgba(255, 255, 255, 0.05)', padding: '10px 20px', borderRadius: '16px', backdropFilter: 'blur(10px)', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
          <Sparkles className="text-primary" fill="currentColor" size={24} />
          <span className="editorial" style={{ letterSpacing: '-0.02em' }}>SupportIQ</span>
        </div>
      </div>
      
      <div className="header-status" style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '8px', height: '8px', background: 'var(--accent-green)', borderRadius: '50%', boxShadow: '0 0 10px var(--accent-green)' }}></div>
          <span style={{ fontSize: '0.85rem', opacity: 0.7, fontWeight: 500 }}>System Active</span>
        </div>

        {isLoading ? (
          <Skeleton width="100px" height="42px" className="skeleton-rounded" />
        ) : !isAuthenticated ? (
          <button 
            className="btn-login-header hide-on-mobile" 
            onClick={openAuthModal}
            style={{ 
              background: 'rgba(255, 255, 255, 0.05)', 
              border: '1px solid rgba(255, 255, 255, 0.1)', 
              color: '#fff', 
              padding: '10px 24px', 
              borderRadius: '100px', 
              fontSize: '0.95rem',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer',
              transition: 'var(--transition)'
            }}
          >
            <LogIn size={18} />
            <span>Login</span>
          </button>
        ) : (
          <div className="hide-on-mobile" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button 
              onClick={openProfileModal}
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '10px', 
                color: 'rgba(255,255,255,0.9)', 
                fontSize: '0.9rem',
                background: 'rgba(255,255,255,0.05)',
                padding: '6px 16px',
                borderRadius: '12px',
                border: '1px solid rgba(255,255,255,0.1)',
                cursor: 'pointer',
                transition: '0.2s',
                fontWeight: 500
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
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
                fontWeight: 800, 
                color: '#fff',
                boxShadow: '0 0 15px rgba(129, 140, 248, 0.3)'
              }}>
                {getInitials()}
              </div>
            </button>
            <button 
              onClick={logout}
              style={{ 
                background: 'none', 
                border: 'none', 
                color: 'rgba(255,255,255,0.5)', 
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '0.9rem',
                padding: '4px 8px',
                borderRadius: '8px',
                transition: '0.2s'
              }}
              onMouseOver={(e) => e.currentTarget.style.color = '#ff4444'}
              onMouseOut={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.5)'}
            >
              <LogOut size={16} />
              <span>Logout</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
