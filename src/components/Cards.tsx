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
    <div className="flex flex-wrap justify-center items-center p-4">
      {cards.map((card) => (
        <div
          key={card.id}
          onClick={() => handleSelect(card.id)}
          className={`
            flex flex-col items-center justify-center border-2 rounded-lg shadow-md cursor-pointer
            transition-all duration-200 hover:shadow-lg transform hover:scale-105
            w-28 h-28 sm:w-24 sm:h-24 md:w-28 md:h-28 p-4 flex-shrink-0
            ${selectedCard === card.id 
              ? 'border-blue-500 bg-blue-50 text-blue-700' 
              : 'border-gray-300 bg-white hover:border-gray-400'
            }
          `}
        >
          <div className="mb-2 text-2xl w-10 h-10 flex items-center justify-center">
            {card.icon}
          </div>
          <p className="text-center text-sm">
            {card.text}
          </p>
        </div>
      ))}
    </div>
  );
};

export default Cards;