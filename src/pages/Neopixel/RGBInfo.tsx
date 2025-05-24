import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
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
      <Header
        title=""
        showIdeaButton={false}
      />

      <div className="h-screen flex flex-col items-center gap-3.5">
        <h1 className="text-ubuntu font-bold text-lg">Como a cor é formada?</h1>
        
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
        <div className="flex flex-row gap-3 mt-6 items-center">
          {/* LED Vermelho */}
          <LED id="red-led" color={redColor} />
          
          {/* Sinal de + */}
          <span className="text-2xl font-bold text-black self-center">+</span>
          
          {/* LED Verde */}
          <LED id="green-led" color={greenColor} />
          
          {/* Sinal de + */}
          <span className="text-2xl font-bold text-black self-center">+</span>
          
          {/* LED Azul */}
          <LED id="blue-led" color={blueColor} />
          
          {/* Sinal de = */}
          <span className="text-2xl font-bold text-black self-center">=</span>
          
          {/* LED combinado (resultante) */}
          <LED 
            id="combined-led" 
            color={combinedColor} 
          />
        </div>

        <h3 className="text-ubuntu font-regular text-sm text-center mt-10 mb-10 pl-2 pr-2">
          Todas as cores podem ser vistas como uma "mistura" de vermelho, verde e azul!
        </h3>
        
        <Button onClick={() => navigate(-2)}>Teste você mesmo!</Button>
      </div>
    </>
  );
}