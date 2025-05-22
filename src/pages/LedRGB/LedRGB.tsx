import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import LED from '@/components/LED';
import idea from "@/assets/imgs/lampada.png";
import ColorPicker from '@/components/ColorPicker';

/**
 * LEDRgb - Um componente para controlar um único LED RGB
 * 
 * @returns {JSX.Element} - O componente LEDRgb renderizado
 */
export default function LEDRgb() {
  const navigate = useNavigate();
  
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
      <div className="absolute top-5 left-5">
        <Button variant="blue" onClick={() => navigate('/components')}>
          Voltar
        </Button>
      </div>
      <img
        src={idea}
        alt="Como funciona?"
        className="absolute top-5 right-5 w-1/8 mb-4"
        onClick={() => navigate("/components/ledrgb/info")}
      />
      <div className="h-screen flex flex-col items-center justify-center gap-3.5">
        <h1 className="text-ubuntu font-medium text-lg">Led RGB</h1>
        <h2 className="text-ubuntu font-medium text-md mb-5">
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