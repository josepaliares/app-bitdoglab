import React, { useState } from 'react';
import LED from './LED';

interface LEDMatrixProps {
  ledsPerCol: number;
  ledsPerRow: number;
  onLEDSelected: (index: number) => void;
  ledColors: string[];
  maxWidth?: string;
  compact?: boolean;
}

/**
 * LEDMatrix - Renders a grid of LEDs with row and column labels
 * 
 * @param {LEDMatrixProps} props - Component properties
 * @returns {JSX.Element} - The rendered LED matrix component
 */
const LEDMatrix: React.FC<LEDMatrixProps> = ({
  ledsPerCol,
  ledsPerRow,
  onLEDSelected,
  ledColors,
  maxWidth = "100%",
  compact = false
}) => {
  const [selectedLEDIndex, setSelectedLEDIndex] = useState<number | null>(null);
  
  // Calculate number of  total leds
  const numLEDs = Math.ceil(ledsPerCol * ledsPerRow);
  
  // Create an array of row indices (from high to low, for reverse order display)
  const rowIndices = Array.from({ length: ledsPerCol }, (_, i) => ledsPerCol - i - 1);
  
  // Create an array of column indices
  const colIndices = Array.from({ length: ledsPerRow }, (_, i) => i);
  
  const handleLEDClick = (index: number) => {
    setSelectedLEDIndex(index);
    onLEDSelected(index);
  };

  // Calcular tamanho da gap baseado no número de LEDs e tamanho da tela
  const getGapClass = () => {
    if (compact) return "gap-1 sm:gap-2";
    if (ledsPerRow > 10) return "gap-1 sm:gap-2 md:gap-3";
    if (ledsPerRow > 5) return "gap-2 sm:gap-3 md:gap-4";
    return "gap-2 sm:gap-4 md:gap-6";
  };

  // Determinar tamanho dos LEDs baseado na quantidade
  const getLEDSize = (): 'sm' | 'md' | 'lg' | 'responsive' => {
    if (ledsPerRow > 15 || ledsPerCol > 15) return 'sm';
    if (ledsPerRow > 10 || ledsPerCol > 10) return 'md';
    if (ledsPerRow > 5 || ledsPerCol > 5) return 'responsive';
    return 'lg';
  };
  
  return (
    <div className="flex flex-col items-center mb-3">
      {/* LED Matrix Grid */}
      <div
        className="grid gap-1 sm:gap-2 md:gap-6 place-items-center"
        style={{
          display: 'grid',
          gridTemplateColumns: `auto repeat(${ledsPerRow}, 1fr)`,
          gap: '10px',
          alignItems: 'center',
        }}
      >
        {/* Render each row */}
        {rowIndices.map(rowIndex => (
          <React.Fragment key={`row-${rowIndex}`}>
            {/* Row label */}
            <div className="text-ubuntu font-medium text-md mt-3">
              {rowIndex}
            </div>
            
            {/* LEDs in this row */}
            {colIndices.map(colIndex => {
              const ledIndex = rowIndex * ledsPerRow + colIndex;
              // Only render if we haven't exceeded total LEDs
              return ledIndex < numLEDs ? (
                <LED
                  key={`led-${ledIndex}`}
                  id={ledIndex.toString()}
                  color={ledColors[ledIndex]}
                  selected={selectedLEDIndex === ledIndex}
                  onClick={() => handleLEDClick(ledIndex)}
                  size={getLEDSize()}
                />
              ) :(
                    // Placeholder para manter o grid alinhado
                    <div key={`empty-${ledIndex}`} className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-14 lg:h-14" />
                  );
            })}
          </React.Fragment>
        ))}
      </div>
      
       {/* Column labels */}
          <div 
            className={`grid ${getGapClass()} mt-2 sm:mt-4 place-items-center`}
            style={{
              gridTemplateColumns: `auto repeat(${ledsPerRow}, 50px)`,
            }}
          >
            {/* Empty space for row labels column */}
            <div className="w-8 sm:w-10 md:w-12" />
            
            {/* Column numbers */}
            {colIndices.map(colIndex => (
              <div 
                key={`col-${colIndex}`} 
                className={`
                  ${compact ? 'text-xs sm:text-sm' : 'text-sm sm:text-base md:text-lg'}
                  font-medium text-center
                `}
              >
                {colIndex}
              </div>
            ))}
      </div>
    </div>
  );
};

export default LEDMatrix;