import React from 'react';
import { motion } from 'framer-motion';

export const TypingIndicator: React.FC = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 5 }}
      className="typing-indicator-v2"
    >
      <div className="typing-dot"></div>
      <div className="typing-dot"></div>
      <div className="typing-dot"></div>
      <span className="typing-text">Support Assistant is typing...</span>
    </motion.div>
  );
};
