import React from 'react';

interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  className?: string;
  circle?: boolean;
  style?: React.CSSProperties;
}

export const Skeleton: React.FC<SkeletonProps> = ({ 
  width, 
  height, 
  className = '', 
  circle = false,
  style = {}
}) => {
  const combinedStyle: React.CSSProperties = {
    width: width || '100%',
    height: height || '1rem',
    borderRadius: circle ? '50%' : style.borderRadius,
    ...style
  };

  return (
    <div 
      className={`skeleton ${className}`} 
      style={combinedStyle}
    />
  );
};
