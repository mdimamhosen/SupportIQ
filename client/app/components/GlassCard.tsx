import React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  intensity?: 'low' | 'medium' | 'high';
  borderOpacity?: number;
}

export const GlassCard: React.FC<GlassCardProps> = ({ 
  children, 
  className = '', 
  style = {}, 
  intensity = 'medium',
  borderOpacity = 0.1
}) => {
  const blurMap = {
    low: '10px',
    medium: '20px',
    high: '40px'
  };

  const baseStyle: React.CSSProperties = {
    background: 'rgba(255, 255, 255, 0.03)',
    backdropFilter: `blur(${blurMap[intensity]})`,
    WebkitBackdropFilter: `blur(${blurMap[intensity]})`,
    borderRadius: 'var(--radius-xl)',
    border: `1px solid rgba(255, 255, 255, ${borderOpacity})`,
    boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.3)',
    ...style
  };

  return (
    <div className={`glass-card ${className}`} style={baseStyle}>
      {children}
    </div>
  );
};
