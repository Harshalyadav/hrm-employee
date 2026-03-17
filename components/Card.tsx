import React from 'react';

interface CardProps {
  title: string;
  value?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ title, value, children, className }) => {
  return (
    <div className={`bg-white dark:bg-gray-800 rounded shadow p-4 ${className || ''}`}>
      <div className="text-lg font-semibold mb-2">{title}</div>
      {value && <div className="text-2xl font-bold mb-2">{value}</div>}
      {children}
    </div>
  );
};

export default Card;
