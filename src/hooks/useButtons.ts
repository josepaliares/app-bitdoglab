import { useState } from "react";
import { useLedRGB } from "./useLedRGB";

/**
 * Custom hook to manage buttons page state and logic
 * 
 * @param sendCommand - Function to send commands to the device
 * @returns All necessary state and handlers for the Buttons component
 */
export const useButtons = (
  sendCommand: (command: string) => Promise<void>
) => {
  // State for selected options
  const [selectedComponent, setSelectedComponent] = useState("");
  const [selectedButton, setSelectedButton] = useState("");
  const [selectedCard, setSelectedCard] = useState("");

  // Popup state
  const [popup, setPopup] = useState({
    isOpen: false,
    message: ''
  });

  // Buzzer values
  const [valueN, onChangeN] = useState(0); // Frequency (Hz)
  const [valueV, onChangeV] = useState(0); // Volume

  // LED RGB hook
  const {
    valueR,
    valueG,
    valueB,
    setValueR,
    setValueG,
    setValueB,
    currentColor,
    handleClearL,
    handleSendL
  } = useLedRGB(sendCommand);

  /**
   * Close the popup modal
   */
  const closePopup = () => {
    setPopup({ isOpen: false, message: '' });
  };

  /**
   * Show popup with error message
   */
  const showPopup = (message: string) => {
    setPopup({
      isOpen: true,
      message
    });
  };

  /**
   * Clear values based on selected component
   */
  const handleClear = () => {
    if (selectedComponent === "ledrgb") {
      handleClearL();
    } else if (selectedComponent === "buzzera" || selectedComponent === "buzzerb") {
      onChangeN(0);
      onChangeV(0);
    }
  };

  /**
   * Generate and send command based on selected component and button
   */
  const handleSend = () => {
    // Validate button selection
    if (selectedButton === "") {
      showPopup("você precisa escolher um dos botões");
      return;
    }

    let json: string;

    // Generate JSON based on selected component
    if (selectedComponent === "neopixel") {
      json = JSON.stringify({ [selectedComponent]: [selectedCard] }, null, 3);
    } else if (selectedComponent === "ledrgb") {
      json = handleSendL();
    } else if (selectedComponent === "buzzera" || selectedComponent === "buzzerb") {
      json = JSON.stringify({ [selectedComponent]: [valueN, valueV] }, null, 3);
    } else {
      showPopup("você precisa escolher um dos componentes");
      return;
    }

    // Generate complete JSON command
    const jsonComplet = JSON.stringify({
      "botões": { [selectedButton]: [json] }
    }, null, 3);

    console.log(jsonComplet);
    return jsonComplet;
  };
  

  return {
    // State
    selectedComponent,
    selectedButton,
    selectedCard,
    popup,
    valueN,
    valueV,
    
    // LED RGB values
    valueR,
    valueG,
    valueB,
    currentColor,
    
    // Setters
    setSelectedComponent,
    setSelectedButton,
    setSelectedCard,
    onChangeN,
    onChangeV,
    setValueR,
    setValueG,
    setValueB,
    
    // Handlers
    closePopup,
    handleClear,
    handleSend
  };
};