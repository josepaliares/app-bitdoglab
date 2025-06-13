import React from "react";
import PianoKey from "./PianoKey";
import type { Note } from "../types/notes";

interface PianoProps {
  onKeyPress?: (note: Note) => void;      // Chamado quando tecla é pressionada
  onKeyRelease?: (duration: number) => void; // Chamado quando tecla é solta
}

const Piano: React.FC<PianoProps> = ({ onKeyPress, onKeyRelease }) => {
  const whiteNotes: Note[] = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
  const blackNotes: (Note | null)[] = ['C#', 'D#', null, 'F#', 'G#', 'A#', null]; // null onde não há tecla preta

  const handleKeyPress = (note: Note) => {
    if (onKeyPress) {
      onKeyPress(note);
    }
  };

  const handleKeyRelease = (duration: number) => {
    if (onKeyRelease) {
      onKeyRelease(duration);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 p-6">
      {/* Container do piano */}
      <div className="relative bg-gradient-to-b from-surface to-background p-4 rounded-lg shadow-lg">
        <div className="relative flex">
          {/* Teclas brancas */}
          {whiteNotes.map((note) => (
            <PianoKey
              key={note}
              id={note}
              variant="white"
              onPress={() => handleKeyPress(note)}
              onRelease={(duration) => handleKeyRelease(duration)}
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
                onPress={() => handleKeyPress(note)}
                onRelease={(duration) => handleKeyRelease(duration)}
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