import React, { useState, useRef } from 'react';

interface PianoKeyProps {
  id: string;
  isBlack: boolean;
  onClick?: (duration: number) => void;
  style?: React.CSSProperties;
}

const PianoKey: React.FC<PianoKeyProps> = ({ id, isBlack, onClick, style }) => {
  const [isPressed, setIsPressed] = useState(false);
  const pressStart = useRef<number | null>(null);

  const handleMouseDown = () => {
    setIsPressed(true);
    pressStart.current = Date.now();
  };

  const handleMouseUp = () => {
    if (!isPressed) return; // Só executa se a tecla estava pressionada
    
    setIsPressed(false);
    const duration = pressStart.current ? Date.now() - pressStart.current : 0;
    pressStart.current = null;
    if (onClick && duration > 0) onClick(duration); // Só chama onClick se houve um click real
  };

  const handleMouseLeave = () => {
    if (isPressed) {
      // Só processa se realmente estava pressionado
      setIsPressed(false);
      const duration = pressStart.current ? Date.now() - pressStart.current : 0;
      pressStart.current = null;
      if (onClick && duration > 0) onClick(duration);
    }
  };

  // Cores das teclas
  const whiteKeyColor = isPressed ? '#ddd' : 'white';
  const blackKeyColor = isPressed ? '#444' : '#1a1a1a';
  
  return (
    <div
      className="cursor-pointer select-none transition-all duration-75"
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      data-key-id={id}
      style={style}
    >
      {isBlack ? (
        // Tecla preta - SVG inline
        <svg 
          viewBox="0 0 30 72" 
          className="w-7 h-18 drop-shadow-md hover:drop-shadow-lg"
          style={{ filter: isPressed ? 'brightness(0.8)' : 'none' }}
        >
          <rect
            x="0"
            y="0"
            width="30"
            height="72"
            rx="6"
            ry="6"
            fill={blackKeyColor}
            stroke="#000"
            strokeWidth="1"
          />
        </svg>
      ) : (
        // Tecla branca - SVG inline
        <svg 
          viewBox="0 0 50 120" 
          className="w-12 h-30 drop-shadow-sm hover:drop-shadow-md"
          style={{ filter: isPressed ? 'brightness(0.9)' : 'none' }}
        >
          <rect
            x="0"
            y="0"
            width="50"
            height="120"
            rx="8"
            ry="8"
            fill={whiteKeyColor}
            stroke="#ccc"
            strokeWidth="1"
          />
        </svg>
      )}
      
      {/* Labels das notas */}
      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-xs font-medium">
        {isBlack ? (
          // Label branca para teclas pretas
          <span className="text-white drop-shadow-sm">{id}</span>
        ) : (
          // Label cinza para teclas brancas
          <span className="text-gray-600">{id}</span>
        )}
      </div>
    </div>
  );
};
export default PianoKey;