import React from "react";
import PianoKey from "./PianoKey";
import type { Note } from "../types/notes";

interface PianoProps {
  onKeyPress?: (note: Note, duration: number) => void;
}

const Piano: React.FC<PianoProps> = ({ onKeyPress }) => {
  const whiteNotes: Note[] = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
  const blackNotes: (Note | null)[] = ['C#', 'D#', null, 'F#', 'G#', 'A#', null]; // null onde não há tecla preta

  const handleKeyPress = (note: Note, duration: number) => {
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
            <PianoKey
              key={note}
              id={note}
              variant="white"
              onClick={(duration) => handleKeyPress(note, duration)}
            />
          ))}
          
          {/* Teclas pretas - posicionadas absolutamente */}
          {blackNotes.map((note, index) => {
            if (!note) return null; // Remove espaços vazios
            
            // Posicionamento correto das teclas pretas
            const leftPosition = (index * 48) + 34; // 48px largura + offset para centralizar
            
            return (
              <PianoKey
                key={note}
                id={note}
                variant="black"
                onClick={(duration) => handleKeyPress(note, duration)}
                style={{
                  position: 'absolute',
                  left: `${leftPosition}px`,
                  top: '0',
                  zIndex: 10
                }}
              />
            );
          })}
          
        </div>
      </div>
    </div>
  );
};
export default Piano;
