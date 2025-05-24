import { useState } from 'react';
import { Button } from '@/components/ui/button';
import LED from '@/components/LED';
import { Header } from "@/components/Header";
import ColorPicker from '@/components/ColorPicker';

/**
 * LEDRgb - Um componente para controlar um único LED RGB
 * 
 * @returns {JSX.Element} - O componente LEDRgb renderizado
 */
export default function LEDRgb() {
  
  // Estados para controlar os valores RGB
  const [valueR, setValueR] = useState(0);
  const [valueG, setValueG] = useState(0);
  const [valueB, setValueB] = useState(0);
  
  // Calcular a cor atual baseada nos valores RGB
  const currentColor = `rgb(${valueR}, ${valueG}, ${valueB})`;
  
  // Função para limpar a cor (definir para preto)
  const handleClear = () => {
    setValueR(0);
    setValueG(0);
    setValueB(0);
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

  return (
    <>
      <Header
        title="Led RGB"
        showIdeaButton={true}
        ideaButtonPath="/components/ledrgb/info"
      />
      <div className="h-screen flex flex-col items-center gap-5">
        <h2 className="text-ubuntu font-medium text-md mb-10">
          Ajuste a cor do LED com os controles abaixo!
        </h2>
        
        {/* Componente LED único no centro */}
        <div className="mb-4">
          <LED 
            id="single-led" 
            color={currentColor}
            selected={false}
          />
        </div>
        
        {/* ColorPicker para ajustar os valores RGB */}
        <ColorPicker
          valueR={valueR}
          valueG={valueG}
          valueB={valueB}
          onChangeR={setValueR}
          onChangeG={setValueG}
          onChangeB={setValueB}
          showLabels={true}
          showValues={true}
        />
        
        {/* Botões de ação */}
        <div className='flex flex-row justify-center gap-3 mt-3'>
          <Button variant="whitePink" onClick={handleClear}>Limpar</Button>
          <Button onClick={handleSend}>Enviar</Button>
        </div>
      </div>
    </>
  );
}