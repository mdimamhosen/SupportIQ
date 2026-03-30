import React, { useState, useEffect } from 'react';
import { Mail, Lock, User, ArrowRight, Loader2, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Modal } from './Modal';
import { useAuthStore } from '../store/useAuthStore';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'signup';
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, initialMode = 'login' }) => {
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  const { signup, login, isLoading, error, clearError, isAuthenticated } = useAuthStore();
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [localError, setLocalError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    clearError();
    setLocalError(null);
  }, [mode, isOpen, clearError]);

  useEffect(() => {
    if (isAuthenticated && isOpen) {
      onClose();
    }
  }, [isAuthenticated, isOpen, onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    
    try {
      if (mode === 'signup') {
        if (formData.password !== formData.confirmPassword) {
          setLocalError('Passwords do not match');
          return;
        }
        await signup(formData.email, formData.password, formData.firstName, formData.lastName);
      } else {
        await login(formData.email, formData.password);
      }
    } catch (err) {
      console.error('Auth error:', err);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={mode === 'login' ? 'Welcome Back' : 'Create Account'}>
      <motion.form 
        layout
        onSubmit={handleSubmit} 
        style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}
      >
        <AnimatePresence mode="popLayout">
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="error-banner"
              style={{
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.2)',
                padding: '12px',
                borderRadius: '12px',
                color: '#ef4444',
                fontSize: '0.85rem',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <AlertCircle size={16} />
              <span>{error}</span>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence mode="popLayout">
          {mode === 'signup' && (
            <motion.div 
              key="signup-names"
              initial={{ opacity: 0, height: 0, marginBottom: -20 }}
              animate={{ opacity: 1, height: 'auto', marginBottom: 0 }}
              exit={{ opacity: 0, height: 0, marginBottom: -20 }}
              transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
              style={{ overflow: 'hidden' }}
            >
              <div style={{ display: 'flex', gap: '16px' }}>
                <div className="input-group">
                  <User size={18} className="input-icon" />
                  <input 
                    name="firstName" 
                    placeholder="First Name" 
                    onChange={handleChange} 
                    required 
                    className="glass-input"
                  />
                </div>
                <div className="input-group">
                  <User size={18} className="input-icon" />
                  <input 
                    name="lastName" 
                    placeholder="Last Name" 
                    onChange={handleChange} 
                    required 
                    className="glass-input"
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        <motion.div layout className="input-group">
          <Mail size={18} className="input-icon" />
          <input 
            type="email" 
            name="email" 
            placeholder="Email Address" 
            onChange={handleChange} 
            required 
            className="glass-input"
          />
        </motion.div>
        
        <motion.div layout className="input-group">
          <Lock size={18} className="input-icon" />
          <input 
            type={showPassword ? "text" : "password"} 
            name="password" 
            placeholder="Password" 
            onChange={handleChange} 
            required 
            className="glass-input"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="password-toggle"
            style={{
              position: 'absolute',
              right: '16px',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'none',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              zIndex: 10,
              padding: '4px'
            }}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </motion.div>
        
        <AnimatePresence mode="popLayout">
          {mode === 'signup' && (
            <motion.div 
              key="signup-confirm"
              initial={{ opacity: 0, height: 0, marginTop: -20 }}
              animate={{ opacity: 1, height: 'auto', marginTop: 0 }}
              exit={{ opacity: 0, height: 0, marginTop: -20 }}
              transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
              style={{ overflow: 'hidden' }}
            >
              <div className="input-group" style={{ marginTop: '20px' }}>
                <Lock size={18} className="input-icon" />
                <input 
                  type={showConfirmPassword ? "text" : "password"} 
                  name="confirmPassword" 
                  placeholder="Confirm Password" 
                  onChange={handleChange} 
                  required 
                  className="glass-input"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="password-toggle"
                  style={{
                    position: 'absolute',
                    right: '16px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-muted)',
                    cursor: 'pointer',
                    zIndex: 10,
                    padding: '4px'
                  }}
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        <motion.button 
          layout
          type="submit" 
          disabled={isLoading}
          className={`btn-pill btn-primary ${isLoading ? 'loading' : ''}`} 
          style={{ 
            width: '100%', 
            marginTop: '12px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            gap: '10px',
            opacity: isLoading ? 0.7 : 1,
            cursor: isLoading ? 'not-allowed' : 'pointer'
          }}
        >
          {isLoading ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            <>
              <motion.span
                key={mode}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                {mode === 'login' ? 'Sign In' : 'Create Account'}
              </motion.span>
              <ArrowRight size={18} />
            </>
          )}
        </motion.button>
        
        <motion.div layout style={{ textAlign: 'center', marginTop: '12px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={mode}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {mode === 'login' ? (
                <>
                  Don't have an account?{' '}
                  <button 
                    type="button" 
                    onClick={() => setMode('signup')}
                    style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontWeight: 600 }}
                  >
                    Sign Up
                  </button>
                </>
              ) : (
                <>
                  Already have an account?{' '}
                  <button 
                    type="button" 
                    onClick={() => setMode('login')}
                    style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontWeight: 600 }}
                  >
                    Log In
                  </button>
                </>
              )}
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </motion.form>
    </Modal>
  );
};
