import React from 'react';
import { GlassCard } from './GlassCard';

interface GlowFrameProps {
  children: React.ReactNode;
  className?: string;
}

export const GlowFrame: React.FC<GlowFrameProps> = ({ children, className = "" }) => {
  return (
    <GlassCard className={`glow-frame ${className}`} intensity="high">
      {children}
    </GlassCard>
  );
};
