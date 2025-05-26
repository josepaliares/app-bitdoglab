import { useEffect, useRef, useState } from "react";
import { ScreenOrientation } from "@capacitor/screen-orientation";
import { BuzzersTocarController } from "../utils/buzzersTocarController";

/**
 * Custom hook to manage Piano Buzzer state and control
 * @param sendCommand - Function to send commands to the device
 * @returns All necessary state and handlers for the BuzzersTocar component
 */
export const useBuzzersTocar = (
  sendCommand: (command: string) => Promise<void>,
) => {
  const buzzersTocarController = useRef<BuzzersTocarController | null>(null);
  const hasInitialized = useRef(false);

  const [tom, setTom] = useState(1);

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

  return {
    tom,
    setTom,
  };
};