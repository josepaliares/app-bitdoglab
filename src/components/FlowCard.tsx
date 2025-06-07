import React from 'react';
import type { ReactNode } from 'react';

/**
 * Interface para as props do FlowCard
 */
interface FlowCardProps {
  id: string,
  icon: ReactNode;
  text: string;
  className?: string;
  stepNumber?: number;
  showArrow?: boolean;
  onClick?: (card: string) => void;
}

/**
 * Componente FlowCard - Representa um card no fluxograma
 */
const FlowCard: React.FC<FlowCardProps> = ({ 
  id,
  icon, 
  text, 
  className = "", 
  stepNumber,
  showArrow = false,
  onClick
}) => {

  const handleClick = () => {
    if (onClick) {
      onClick(id); // Chama onClick se existir
    }
  };


  return (
    <div className="relative">
      {/* Container do card com numeração */}
      <div className="flex items-center relative"
        onClick={handleClick}
      >
        {/* Numeração à esquerda */}
        {stepNumber && (
          <div className="flex flex-col items-center mr-6 relative">
            <div className="w-8 h-8 text-black rounded-full flex items-center justify-center font-bold text-sm border-2">
              {stepNumber}
            </div>
            
            {/* Seta para baixo - posicionada abaixo do número */}
            {showArrow && (
              <div className="flex flex-col items-center mt-4 mb-4">
                {/* Linha vertical */}
                <div className="w-0.5 h-6 bg-gray-400"></div>
                {/* Seta */}
                <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-gray-400"></div>
              </div>
            )}
          </div>
        )}
        
        {/* Card principal */}
        <div className={`flex items-center p-4 border-2 border-gray-300 rounded-lg shadow-md w-80 h-24 ${className}`}>
          <div className="flex-shrink-0">
            {icon}
          </div>
          <p className="font-medium font-ubuntu text-md text-center flex-1">
            {text}
          </p>
        </div>
      </div>
    </div>
  );
};

export default FlowCard;