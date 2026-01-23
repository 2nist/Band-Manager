import React from 'react';

export default function Card({ children, className = '', onClick, role = 'group', ...props }) {
  const clickProps = onClick ? { onClick, role: 'button', tabIndex: 0 } : {};
  return (
    <div className={`card ${className}`} {...clickProps} {...props}>
      {children}
    </div>
  );
}
