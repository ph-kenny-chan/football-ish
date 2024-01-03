import React from 'react';

interface CardProps {
  className: string;
  children: React.ReactNode;
}

const Card: React.FC<CardProps> = ({ className, children }) => {
  return (
    <div className="bg-slate-100 rounded-xl p-8 md:p-0 dark:bg-slate-800 ${className}">
      {children}
    </div>
  );
};

export default Card;
