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
}

/**
 * Componente FlowDiagram - Exibe um fluxograma composto por cards
 */
const FlowDiagram: React.FC<FlowDiagramProps> = ({ steps, className = "" }) => {
  return (
    <div className={`grid grid-cols-1 gap-4 ${className}`}>
      {steps.map((step, index) => (
        <FlowCard 
          key={index}
          icon={step.icon}
          text={step.text}
          className={step.className}
        />
      ))}
    </div>
  );
};

export default FlowDiagram;