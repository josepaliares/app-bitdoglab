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

  /**
   * Manipula o evento de pressionar uma tecla (onMouseDown)
   * Envia JSON com status: "on" e frequency
   * @param note - Nota musical pressionada
   */
  const handleNotePress = async (note: Note) => {
    const selectedOctave = octave;
    const frequency = noteToFrequency(note, selectedOctave);
    // Envia comando para INICIAR o buzzer
    try {
      await buzzersTocarController.current?.startBuzzer(frequency);
    } catch (error) {
      console.error("Erro ao iniciar nota:", error);
    }
  };

  /**
   * Manipula o evento de soltar uma tecla (onMouseUp)
   * Envia JSON com status: "off" e duration
   * @param note - Nota musical que foi solta
   * @param duration - Duração em milissegundos que a tecla ficou pressionada
   */
  const handleNoteRelease = async (duration: number) => {
    // Envia comando para PARAR o buzzer
    try {
      await buzzersTocarController.current?.stopBuzzer(duration);
    } catch (error) {
      console.error("Erro ao parar nota:", error);
    }
  };

  return {
    octave,
    setOctave,
    handleNotePress,
    handleNoteRelease,
  };
};