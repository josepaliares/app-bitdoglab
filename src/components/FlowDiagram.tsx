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
  onCardSelected: (index: string) => void;
  showNumbers?: boolean; // Nova prop para controlar se mostra numeração
}

/**
 * Componente FlowDiagram - Exibe um fluxograma composto por cards
 */
const FlowDiagram: React.FC<FlowDiagramProps> = ({ 
  steps, 
  className = "",
  onCardSelected,
  showNumbers = true,
}) => {

  const handleCardClick = (index: string) => {
    onCardSelected(index);
  };

  return (
    <div className={`flex flex-col items-center ${className}`}>
      {steps.map((step, index) => (
        <FlowCard 
          key={index}
          id={index.toString()}
          icon={step.icon}
          text={step.text}
          className={step.className}
          stepNumber={showNumbers ? index + 1 : undefined}
          showArrow={index < steps.length - 1} // Mostra seta para todos exceto o último
          onClick={handleCardClick}
        />
      ))}
    </div>
  );
};

export default FlowDiagram;