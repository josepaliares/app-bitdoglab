import { useEffect, useRef, useState } from "react";
import { ScreenOrientation } from "@capacitor/screen-orientation";
import { BuzzersTocarController } from "../utils/buzzersTocarController";
import type { Note } from "../types/notes";
import { noteToFrequency } from "../types/notes";

/**
 * Custom hook to manage Piano Buzzer state and control
 * @param sendCommand - Function to send commands to the device
 * @returns All necessary state and handlers for the BuzzersTocar component
 */
export const useBuzzersTocar = (
  sendCommand: (command: string) => Promise<void>
) => {
  const buzzersTocarController = useRef<BuzzersTocarController | null>(null);
  const hasInitialized = useRef(false);

  const [octave, setOctave] = useState(4);

  // Initialize the BuzzersTocarController once
  useEffect(() => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    buzzersTocarController.current = new BuzzersTocarController(sendCommand);
  }, [sendCommand]);

  // Lock the screen orientation to landscape when the component mounts
  useEffect(() => {
    ScreenOrientation.lock({ orientation: "landscape" });
    return () => {
      // Volta para portrait ao sair
      ScreenOrientation.lock({ orientation: "portrait" });
    };
  }, []);

  const handleNotePress = (note: Note, duration: number) => {
    const selectedOctave = octave;
    const frequency = noteToFrequency(note, selectedOctave);
    console.log(
      `note: ${note}, octave: ${octave}, frequency: ${frequency.toFixed(2)}hz, duration: ${duration}ms`
    );
  };

  return {
    octave,
    setOctave,
    handleNotePress,
  };
};
