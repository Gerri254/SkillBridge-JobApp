import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'success' | 'warning' | 'error' | 'info' | 'primary' | 'default';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  className = '',
}) => {
  const variants = {
    success: 'bg-gradient-to-r from-green-600/20 to-emerald-600/20 text-green-400 border border-green-600/30',
    warning: 'bg-gradient-to-r from-yellow-600/20 to-orange-600/20 text-yellow-400 border border-yellow-600/30',
    error: 'bg-gradient-to-r from-red-600/20 to-rose-600/20 text-red-400 border border-red-600/30',
    info: 'bg-gradient-to-r from-blue-600/20 to-cyan-600/20 text-blue-400 border border-blue-600/30',
    primary: 'bg-gradient-to-r from-purple-600/20 to-blue-600/20 text-purple-400 border border-purple-600/30',
    default: 'bg-zinc-800 text-zinc-300 border border-zinc-700',
  };

  return (
    <span
      className={`
        inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
        ${variants[variant]}
        ${className}
      `}
    >
      {children}
    </span>
  );
};
