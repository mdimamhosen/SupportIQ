import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassCard } from './GlassCard';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (isOpen && e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          className="modal-overlay"
          initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
          animate={{ opacity: 1, backdropFilter: 'blur(12px)' }}
          exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
          transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
          onClick={onClose}
          style={{ pointerEvents: 'auto' }}
        >
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.98 }}
            transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1], delay: 0.05 }}
            style={{ width: '100%', maxWidth: '480px', pointerEvents: 'auto' }}
            onClick={(e) => e.stopPropagation()}
          >
            <GlassCard className="modal-content" intensity="high" style={{ padding: '48px', position: 'relative' }}>
              <button 
                className="modal-close" 
                onClick={onClose}
                style={{ position: 'absolute', top: '24px', right: '24px' }}
              >
                <X size={20} />
              </button>
              
              <motion.h2 
                className="editorial" 
                style={{ fontSize: '2.5rem', marginBottom: '32px', textAlign: 'center' }}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
              >
                {title}
              </motion.h2>
              
              {children}
            </GlassCard>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
