import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, Lock, Loader2, CheckCircle2, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { Modal } from './Modal';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose }) => {
  const { user, updateProfile, isLoading, error, clearError } = useAuthStore();
  
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    password: '',
    confirmPassword: ''
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setFormData({
        firstName: user?.firstName || '',
        lastName: user?.lastName || '',
        password: '',
        confirmPassword: ''
      });
      setLocalError(null);
      setSuccess(false);
      clearError();
    }
  }, [isOpen, user, clearError]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    setSuccess(false);

    if (formData.password && formData.password !== formData.confirmPassword) {
      setLocalError('Passwords do not match');
      return;
    }

    try {
      await updateProfile({
        firstName: formData.firstName,
        lastName: formData.lastName,
        ...(formData.password ? { password: formData.password } : {}),
      });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Update Profile">
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <AnimatePresence mode="popLayout">
          {(error || localError) && (
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
              <span>{localError || error}</span>
            </motion.div>
          )}

          {success && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              style={{
                background: 'rgba(16, 185, 129, 0.1)',
                border: '1px solid rgba(16, 185, 129, 0.2)',
                padding: '12px',
                borderRadius: '12px',
                color: '#10b981',
                fontSize: '0.85rem',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <CheckCircle2 size={16} />
              <span>Profile updated successfully!</span>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="input-group" style={{ opacity: 0.6 }}>
          <User size={18} className="input-icon" />
          <input 
            value={`@${user?.username}`} 
            readOnly 
            className="glass-input" 
            style={{ cursor: 'not-allowed' }}
            title="Username cannot be changed"
          />
          <span style={{ position: 'absolute', right: '16px', fontSize: '0.7rem', color: 'var(--text-muted)' }}>Read Only</span>
        </div>

        <div className="input-group" style={{ opacity: 0.6 }}>
          <Mail size={18} className="input-icon" />
          <input 
            value={user?.email || ''} 
            readOnly 
            className="glass-input" 
            style={{ cursor: 'not-allowed' }}
          />
          <span style={{ position: 'absolute', right: '16px', fontSize: '0.7rem', color: 'var(--text-muted)' }}>Read Only</span>
        </div>

        <div style={{ display: 'flex', gap: '16px' }}>
          <div className="input-group">
            <User size={18} className="input-icon" />
            <input 
              name="firstName"
              value={formData.firstName}
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
              value={formData.lastName}
              placeholder="Last Name" 
              onChange={handleChange} 
              required 
              className="glass-input"
            />
          </div>
        </div>

        <div className="input-group">
          <Lock size={18} className="input-icon" />
          <input 
            type={showPassword ? "text" : "password"} 
            name="password"
            value={formData.password}
            placeholder="New Password (Optional)" 
            onChange={handleChange} 
            className="glass-input"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
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
        </div>

        {formData.password && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="input-group"
          >
            <Lock size={18} className="input-icon" />
            <input 
              type={showConfirmPassword ? "text" : "password"} 
              name="confirmPassword"
              value={formData.confirmPassword}
              placeholder="Confirm New Password" 
              onChange={handleChange} 
              required 
              className="glass-input"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
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
          </motion.div>
        )}

        <button 
          type="submit" 
          disabled={isLoading}
          className={`btn-pill btn-primary ${isLoading ? 'loading' : ''}`} 
          style={{ width: '100%', marginTop: '12px' }}
        >
          {isLoading ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            <span>Update Profile</span>
          )}
        </button>
      </form>
    </Modal>
  );
};

export default ProfileModal;
