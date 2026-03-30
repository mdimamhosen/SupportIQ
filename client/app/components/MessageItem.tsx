import React, { useState } from 'react';
import type { Message } from '../store/useChatStore';
import { useChatStore } from '../store/useChatStore';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Copy, Edit2, RotateCcw, Check, X, Save, Smile, Frown, Meh } from 'lucide-react';

interface MessageItemProps {
  message: Message;
}

export const MessageItem: React.FC<MessageItemProps> = ({ message }) => {
  const isAi = message.role === 'assistant';
  const { editMessage, regenerateResponse } = useChatStore();
  
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(message.content);
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const handleSaveEdit = async () => {
    if (editContent.trim() === message.content) {
      setIsEditing(false);
      return;
    }
    await editMessage(message.id, editContent);
    setIsEditing(false);
  };

  const handleRegenerate = async () => {
    await regenerateResponse(message.id);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
      className={`message-item-v2 ${isAi ? 'ai' : 'user'} ${isEditing ? 'editing' : ''}`}
      style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignSelf: isAi ? 'flex-start' : 'flex-end', 
        maxWidth: '90%',
        position: 'relative'
      }}
    >
      <div className={`message-bubble-v2 ${isAi ? 'ai-bubble-v2' : 'user-bubble-v2'}`}>
        {isEditing ? (
          <div className="edit-container-v2">
            <textarea
              className="edit-textarea-v2"
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              autoFocus
            />
            <div className="edit-actions-v2">
              <button onClick={handleSaveEdit} className="glass-icon-btn-v2 success" title="Save">
                <Check size={14} />
              </button>
              <button onClick={() => { setIsEditing(false); setEditContent(message.content); }} className="glass-icon-btn-v2 danger" title="Cancel">
                <X size={14} />
              </button>
            </div>
          </div>
        ) : (
          <>
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {message.content}
            </ReactMarkdown>
            
            {isAi && message.sentiment && (
              <div className={`sentiment-indicator ${message.sentiment}`} title={`Sentiment: ${message.sentiment}`}>
                {message.sentiment === 'positive' && <Smile size={14} />}
                {message.sentiment === 'negative' && <Frown size={14} />}
                {message.sentiment === 'neutral' && <Meh size={14} />}
              </div>
            )}
            
            <div className="message-actions-v2">
              <button onClick={handleCopy} className="action-btn-v2" title="Copy">
                {isCopied ? <Check size={14} className="success-text" /> : <Copy size={14} />}
              </button>
              
              {!isAi && (
                <button onClick={() => setIsEditing(true)} className="action-btn-v2" title="Edit">
                  <Edit2 size={14} />
                </button>
              )}
              
              <button onClick={handleRegenerate} className="action-btn-v2" title={isAi ? "Regenerate" : "Resend"}>
                <RotateCcw size={14} />
              </button>
            </div>
          </>
        )}
      </div>
      <div className="conv-time" style={{ marginTop: '6px', textAlign: isAi ? 'left' : 'right', padding: '0 8px', opacity: 0.7 }}>
        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </div>
    </motion.div>
  );
};
