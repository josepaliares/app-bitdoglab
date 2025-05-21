import React from 'react';
import type { ReactNode } from 'react';

/**
 * Interface para as props do FlowCard
 */
interface FlowCardProps {
  icon: ReactNode;
  text: string;
  className?: string;
}

/**
 * Componente FlowCard - Representa um card no fluxograma
 */
const FlowCard: React.FC<FlowCardProps> = ({ icon, text, className = "" }) => {
  return (
    <div className={`flex items-center p-4 border-2 border-gray-300 rounded-lg shadow-md w-80 h-24 ${className}`}>
      <div className="flex-shrink-0">
        {icon}
      </div>
      <p className="font-medium font-ubuntu text-md text-center flex-1">
        {text}
      </p>
    </div>
  );
};

export default FlowCard;