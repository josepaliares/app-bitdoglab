import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import LED from "@/components/LED";
import ColorPicker from "@/components/ColorPicker";

/**
 * RGBInfo - Componente para demonstrar a formação de cores RGB
 * 
 * @returns {JSX.Element} - O componente RGBInfo renderizado
 */
export default function RGBInfo() {
  const navigate = useNavigate();
  
  // Estados para controlar os valores RGB
  const [valueR, setValueR] = useState(0);
  const [valueG, setValueG] = useState(0);
  const [valueB, setValueB] = useState(0);

  // Calcular as cores individuais e combinadas
  const redColor = `rgb(${valueR}, 0, 0)`;
  const greenColor = `rgb(0, ${valueG}, 0)`;
  const blueColor = `rgb(0, 0, ${valueB})`;
  const combinedColor = `rgb(${valueR}, ${valueG}, ${valueB})`;

  return (
    <>
      <div className="absolute top-5 left-5">
        <Button variant="primary" onClick={() => navigate(-1)}>
          Voltar
        </Button>
      </div>

      <div className="h-screen flex flex-col items-center justify-center gap-3.5 bg-background">
        <h1 className="text-ubuntu font-bold text-lg text-heading">Como a cor é formada?</h1>
        
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

        {/* Demonstração visual dos LEDs */}
        <div className="flex flex-row gap-4 mt-6 items-center">
          {/* LED Vermelho */}
          <LED id="red-led" color={redColor} size='lg' />
          
          {/* Sinal de + */}
          <span className="text-2xl font-bold text-text self-center">+</span>
          
          {/* LED Verde */}
          <LED id="green-led" color={greenColor} size='lg' />
          
          {/* Sinal de + */}
          <span className="text-2xl font-bold text-text self-center">+</span>
          
          {/* LED Azul */}
          <LED id="blue-led" color={blueColor} size='lg' />
          
          {/* Sinal de = */}
          <span className="text-2xl font-bold text-text self-center">=</span>
          
          {/* LED combinado (resultante) */}
          <LED 
            id="combined-led" 
            color={combinedColor} 
            size='lg'
          />
        </div>

        <h3 className="text-ubuntu font-regular text-sm mt-10 mb-10 text-center text-text">
          Todas as cores podem ser vistas como uma "mistura" de vermelho, verde e azul!
        </h3>
        
        <Button variant="secondary" onClick={() => navigate(-2)}>Teste você mesmo!</Button>
      </div>
    </>
  );
}