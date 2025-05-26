import React from "react";
import PianoKey from "./PianoKey";

interface PianoProps {
  onKeyPress?: (note: string, duration: number) => void;
}

const Piano: React.FC<PianoProps> = ({ onKeyPress }) => {
  const whiteNotes = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
  const blackNotes = ['C#', 'D#', null, 'F#', 'G#', 'A#', null]; // null onde não há tecla preta

  const handleKeyPress = (note: string, duration: number) => {
    if (onKeyPress) {
      onKeyPress(note, duration);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 p-6"> 
      {/* Container do piano */}
      <div className="relative bg-gradient-to-b from-gray-100 to-gray-200 p-4 rounded-lg shadow-lg">
        <div className="relative flex">
          
          {/* Teclas brancas */}
          {whiteNotes.map((note) => (
            <div key={note} className="relative">
              <PianoKey
                id={note}
                isBlack={false}
                onClick={(duration) => handleKeyPress(note, duration)}
              />
            </div>
          ))}
          
          {/* Teclas pretas - posicionadas absolutamente */}
          <div className="absolute top-0 left-0 flex">
            {blackNotes.map((note, index) => {
              if (!note) return <div key={index} className="w-12" />; // espaço vazio
              
              // Posicionamento correto das teclas pretas
              const leftPosition = (index * 48) + 36; // 48px é a largura da tecla branca, 36px é o offset
              
              return (
                <div 
                  key={note} 
                  className="absolute"
                  style={{ left: `${leftPosition}px`, zIndex: 10 }}
                >
                  <PianoKey
                    id={note}
                    isBlack={true}
                    onClick={(duration) => handleKeyPress(note, duration)}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
export default Piano;
