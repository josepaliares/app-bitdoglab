import { useState } from "react";
import type { RGB } from "@/types/rgb";

/**
 * Custom hook to manage LED state and control
 * 
 * @returns All necessary state and handlers for the component
 */
export const useLedRGB = (
) => {
   
  // RGB color values for the currently selected LED
  const [rgb, setRgb] = useState<RGB>({ r: 0, g: 0, b: 0 });
 
  // Calcular a cor atual baseada nos valores RGB
  const currentColor = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;

  /**
   * Reset the color to black (off state)
   */
  const handleClear = () => {
    setRgb({ r: 0, g: 0, b: 0 });
  };

  /**
   * Atualiza o valor de um componente RGB específico (r, g ou b)
   * 
   * @param component - Componente a ser atualizado ('r', 'g' ou 'b')
   * @param value - Novo valor para o componente
   */
  const updateRgbComponent = (component: keyof RGB, value: number) => {
    setRgb(prev => ({
      ...prev,
      [component]: value
    }));
  };
  
  // Função para exportar a configuração atual
  const handleSend = () => {
    const json = JSON.stringify({ ledRGB: currentColor }, null, 3);
    const blob = new Blob([json], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'infoLEDs.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return {
    rgb,
    valueR: rgb.r,
    valueG: rgb.g,
    valueB: rgb.b,
    setValueR: (value: number) => updateRgbComponent('r', value),
    setValueG: (value: number) => updateRgbComponent('g', value),
    setValueB: (value: number) => updateRgbComponent('b', value),
    currentColor,
    handleClear,
    handleSend
  };
};