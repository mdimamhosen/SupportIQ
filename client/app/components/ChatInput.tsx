import React, { useState, useEffect, useRef } from 'react';
import { useChatStore } from '../store/useChatStore';
import { useAuthStore } from '../store/useAuthStore';
import { Send, Loader2, Lock, Sparkles } from 'lucide-react';
import { Skeleton } from './Skeleton';

export const ChatInput: React.FC = () => {
  const [input, setInput] = useState('');
  const { sendMessage, isLoading: isChatLoading, refineMessage } = useChatStore();
  const { isAuthenticated, isLoading: isAuthLoading } = useAuthStore();
  const [isRefining, setIsRefining] = useState(false);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    const trimmedInput = input.trim();
    if (!trimmedInput || isChatLoading) return;

    setInput('');
    await sendMessage(trimmedInput);
  };

  if (isAuthLoading) {
    return (
      <div className="input-section-v2">
        <div className="input-container-v2">
          <Skeleton height="44px" className="skeleton-rounded" />
          <div className="input-actions-v2">
            <div className="action-row">
              <Skeleton width="100px" height="36px" className="skeleton-rounded" />
              <Skeleton width="100px" height="36px" className="skeleton-rounded" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  const handleRefine = async () => {
    if (!input.trim() || isRefining) return;
    setIsRefining(true);
    const refined = await refineMessage(input);
    setInput(refined);
    setIsRefining(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="input-section-v2">
      <form
        onSubmit={handleSend}
        className="input-container-v2"
      >
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={
            isAuthenticated ? 'Type your message here...' : 'You must be logged in to send messages'
          }
          className="input-field-v2"
          disabled={isChatLoading || !isAuthenticated}
          style={{ padding: '4px', opacity: isAuthenticated ? 1 : 0.5 }}
        />

        <div className="input-actions-v2">
          <div className="action-row">
            <button
              type="submit"
              className="btn-send-v2"
              disabled={!input.trim() || isChatLoading || !isAuthenticated}
              style={{
                background: isAuthenticated
                  ? 'linear-gradient(135deg, var(--accent-orange), #ff8c00)'
                  : 'rgba(255, 255, 255, 0.05)',
                color: isAuthenticated ? '#000' : 'rgba(255, 255, 255, 0.2)',
                boxShadow: isAuthenticated ? '0 4px 12px rgba(242, 180, 124, 0.2)' : 'none',
                cursor: isAuthenticated ? 'pointer' : 'not-allowed',
              }}
            >
              {isChatLoading ? (
                <Loader2 className="animate-spin" size={16} />
              ) : isAuthenticated ? (
                <Send size={16} />
              ) : (
                <Lock size={16} />
              )}
              <span>{isAuthenticated ? 'Send Message' : 'Login Required'}</span>
            </button>

            <button
              type="button"
              className="glass-button-v2"
              onClick={handleRefine}
              disabled={!input.trim() || isRefining || !isAuthenticated}
              style={{
                width: 'auto',
                height: '40px',
                marginTop: '0',
                padding: '0 16px',
                background: 'rgba(210, 119, 255, 0.1)',
                borderColor: 'rgba(210, 119, 255, 0.2)',
                color: '#d277ff',
                display: isAuthenticated ? 'flex' : 'none',
              }}
            >
              {isRefining ? <Loader2 className="animate-spin" size={16} /> : <Sparkles size={16} />}
              <span>AI Refine</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
