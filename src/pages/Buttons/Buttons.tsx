import { Header } from "@/components/Header";
import DropdownSelector from "@/components/DropdownSelector";
import Selecter from "@/components/Selecter";
import { useState } from "react";
import LED from "@/components/LED";
import ColorPicker from "@/components/ColorPicker";
import { Button } from "@/components/ui/button";
import { useLedRGB } from "@/hooks/useLedRGB";

export default function Buttons() {
  const [selectedComponent, setSelectedComponent] = useState("");

  const {
    // Valores individuais de RGB e seus setters (mantidos para compatibilidade)
    valueR,
    valueG,
    valueB,
    setValueR,
    setValueG,
    setValueB,
    // Estado e manipuladores dos LED
    currentColor,
    handleClear,
    handleSend
  } = useLedRGB();

  const buttonscomponents = [
    { id: "botaoa", label: "Botão A" },
    { id: "botaob", label: "Botão B" }
  ]

  const components = [
    { id: "neopixel", label: "Neopixel Personalizado" },
    { id: "ledrgb", label: "LED RGB" },
    { id: "buzzera", label: "Buzzer A" },
    { id: "buzzerb", label: "Buzzer B" }
  ];

  const renderDynamicContent = () => {
    switch (selectedComponent) {
      case "neopixel":
        return (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">
              Primeira opção selecionada
            </h3>
          </div>
        );

      case "ledrgb":
        return (
          <div className="h-screen flex flex-col items-center gap-5">
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
              <Button onClick={handleClear}>Limpar</Button>
              <Button onClick={handleSend}>Enviar</Button>
            </div>
          </div>
        );

      case "buzzera":
        return (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">
              Terceira Opção Selecionada
            </h3>
          </div>
        );

      case "buzzerb":
        return (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">
              Quarta Opção Selecionada
            </h3>
          </div>
        );

      default:
        return (
          <div className="mt-6 p-4 bg-gray-100 rounded-lg text-center">
            <p className="text-gray-500">Selecione uma opção acima para ver o conteúdo</p>
          </div>
        );
    }
  };
  
  return (
    <div className="flex flex-col">
      <Header title="Botões" 
        showIdeaButton={true}
        ideaButtonPath="/components/botoes/info" />
      <main className="h-screen flex flex-col items-center gap-3.5">
        <h2 className="text-ubuntu text-md mb-5">  Escolha um  botão e defina o que ele faz quando for pressionado</h2>
        <Selecter
          options={buttonscomponents}
        />
        <DropdownSelector
          options={components}
          placeholder="Selecione um componente"
          onSelect={setSelectedComponent}
          value={selectedComponent}
        />
        {/* Conteúdo Dinâmico */}
        {renderDynamicContent()}
      </main>
    </div>
  );
}
