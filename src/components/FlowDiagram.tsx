import React from 'react';
import type { ReactNode } from 'react';
import FlowCard from './FlowCard';

/**
 * Interface para cada passo do fluxograma
 */
export interface FlowStep {
  icon: ReactNode;
  text: string;
  className?: string;
}

/**
 * Interface para as props do FlowDiagram
 */
interface FlowDiagramProps {
  steps: FlowStep[];
  className?: string;
  showNumbers?: boolean; // Nova prop para controlar se mostra numeração
}

/**
 * Componente FlowDiagram - Exibe um fluxograma composto por cards
 */
const FlowDiagram: React.FC<FlowDiagramProps> = ({ 
  steps, 
  className = "",
  showNumbers = true 
}) => {
  return (
    <div className={`flex flex-col items-center ${className}`}>
      {steps.map((step, index) => (
        <FlowCard 
          key={index}
          icon={step.icon}
          text={step.text}
          className={step.className}
          stepNumber={showNumbers ? index + 1 : undefined}
          showArrow={index < steps.length - 1} // Mostra seta para todos exceto o último
        />
      ))}
    </div>
  );
};

export default FlowDiagram;