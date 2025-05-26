import React, { useState } from 'react';
import type { ReactNode } from 'react';

interface CardsOption {
  id: string;
  icon: ReactNode;
  text: string;
}

/**
 * Interface para as props do FlowCard
 */
interface CardsProps {
  cards: CardsOption[];
  onSelect: (value: string) => void;
  value: string;
}

/**
 * Componente Cards - Representa um card no fluxograma
 */
const Cards: React.FC<CardsProps> = ({ cards, onSelect, value }) => {
  const [selectedCard, setSelectedCard] = useState(value || "");

  const handleSelect = (cardId: string) => {
    setSelectedCard(cardId);
    onSelect(cardId);
  };

  return (
    <div className={`flex items-center p-4 border-2 border-gray-300 rounded-lg shadow-md w-80 h-24`}>
      {cards.map((card) => (
        <div
          key={card.id}
          onClick={() => handleSelect(card.id)}
          className={`
            flex flex-col items-center justify-center p-6 border-2 rounded-lg shadow-md cursor-pointer
            transition-all duration-200 hover:shadow-lg transform hover:scale-105
            ${selectedCard === card.id 
              ? 'border-blue-500 bg-blue-50 text-blue-700' 
              : 'border-gray-300 bg-white hover:border-gray-400'
            }
          `}
        >
          <div className="mb-3 text-4xl">
            {card.icon}
          </div>
          <p className="font-medium text-center text-sm">
            {card.text}
          </p>
        </div>
      ))}
    </div>
  );
};

export default Cards;