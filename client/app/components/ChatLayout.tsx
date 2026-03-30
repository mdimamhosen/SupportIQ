import React from 'react';
import { MessageList } from './MessageList';
import { ChatInput } from './ChatInput';
import { Cpu } from 'lucide-react';

export const ChatLayout: React.FC = () => {
  return (
    <div className="chat-container">
      <header className="chat-header">
        <Cpu size={28} className="text-primary" />
        <div className="header-info">
          <h1 style={{ fontSize: '1.2rem', fontWeight: 600 }}>Stunning AI</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span className="status-dot"></span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Online</span>
          </div>
        </div>
      </header>
      
      <MessageList />
      <ChatInput />
    </div>
  );
};
