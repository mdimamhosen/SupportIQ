import React, { useEffect, useRef } from 'react';
import { useChatStore } from '../store/useChatStore';
import { useAuthStore } from '../store/useAuthStore';
import { MessageItem } from './MessageItem';
import { motion, AnimatePresence } from 'framer-motion';
import { TypingIndicator } from './TypingIndicator';
import { Lock, LogIn } from 'lucide-react';
import { Skeleton } from './Skeleton';

export const MessageList: React.FC = () => {
  const { messages, isLoading: isChatLoading } = useChatStore();
  const { isAuthenticated, isLoading: isAuthLoading } = useAuthStore();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current && isAuthenticated) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isChatLoading, isAuthenticated]);

  if (isAuthLoading) {
    return (
      <div className="chat-thread-messages">
        {Array.from({ length: 4 }).map((_, i) => (
          <div 
            key={i} 
            style={{ 
              display: 'flex', 
              flexDirection: 'column',
              alignItems: i % 2 === 0 ? 'flex-start' : 'flex-end',
              gap: '12px',
              width: '100%'
            }}
          >
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center', width: '200px' }}>
              {i % 2 === 0 && <Skeleton circle width={32} height={32} />}
              <Skeleton width={120} height={12} />
            </div>
            <Skeleton 
              width={i % 2 === 0 ? "60%" : "50%"} 
              height="80px" 
              className="skeleton-rounded" 
              style={{
                borderRadius: i % 2 === 0 ? '0 20px 20px 20px' : '20px 0 20px 20px'
              }}
            />
          </div>
        ))}
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="chat-thread-messages" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="login-placeholder-v2"
        >
          <div className="login-placeholder-icon">
            <Lock size={32} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <h3 className="editorial" style={{ fontSize: '1.4rem', color: '#fff', marginBottom: 0 }}>Login Required</h3>
            <p style={{ color: 'var(--text-muted)', lineHeight: 1.6, margin: 0 }}>Please log in to your account to view your messages and continue the conversation.</p>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="chat-thread-messages" ref={scrollRef}>
      <AnimatePresence initial={false}>
        {messages.map((message) => (
          <div key={message.id} style={{ display: 'flex', flexDirection: 'column' }}>
            <MessageItem message={message} />
          </div>
        ))}
      </AnimatePresence>
      
      {isChatLoading && <TypingIndicator />}
    </div>
  );
};
