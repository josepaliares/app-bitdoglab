import { Header } from "@/components/Header";
import DropdownSelector from "@/components/DropdownSelector";
import Selecter from "@/components/Selecter";
import { useState } from "react";
import LED from "@/components/LED";
import ColorPicker from "@/components/ColorPicker";
import { Button } from "@/components/ui/button";
import { useLedRGB } from "@/hooks/useLedRGB";
import Slider from "@/components/Slider";

export default function Buttons() {
  const [selectedComponent, setSelectedComponent] = useState("");
  const [selectedButton, setSelectedButton] = useState("");

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
    handleClearL,
    handleSendL
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

  const [valueN, onChangeN] = useState(0);
  const [valueV, onChangeV] = useState(0);

  const handleClearB = () => {
    onChangeN(0);
    onChangeV(0);
  };

  const handleClear = () => {
    if (selectedComponent === "neopixel") {
      console.log("limpou");
    } else if (selectedComponent === "ledrgb") {
      handleClearL();
    } else if (selectedComponent === "buzzera" || selectedComponent === "buzzerb") {
      handleClearB();
    }
  }

  const handleSend = () => {
    if(selectedButton === ""){
      return console.log("Botão não selecionado");
    }
    let json;
    if (selectedComponent === "neopixel") {
      json = 0;
    } else if (selectedComponent === "ledrgb") {
      json = handleSendL();
    } else if (selectedComponent === "buzzera" || selectedComponent === "buzzerb") {
      json = JSON.stringify({ [selectedComponent]: [valueN, valueV] }, null, 3);
    } else{
      //component isn't select
      json = null;
    }
    const jsonCompletB = JSON.stringify({
      "botões": { [selectedButton]: [json] }
    }, null, 3)
    console.log(jsonCompletB);
  }

  const renderDynamicContent = () => {
    if (selectedComponent === "neopixel") {
      return (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">
            Primeira opção selecionada
          </h3>
        </div>
      );
    }
    
    if (selectedComponent === "ledrgb") {
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
            <Button variant="whitePink" onClick={handleClear}>Limpar</Button>
            <Button onClick={handleSend}>Enviar</Button>
          </div>
        </div>
      );
    }
    
    if (selectedComponent === "buzzera" || selectedComponent === "buzzerb") {
      return (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg items-center">
          <Slider 
            variant="numeric" 
            value={valueN} 
            onChange={onChangeN}
            label={true ? '' : undefined}
            showValue={true}
            min={0}
            max={5000}
          />
          <Slider 
            variant="volume" 
            value={valueV} 
            onChange={onChangeV}
            label={true ? 'Volume' : undefined}
            showValue={true}
            min={0}
            max={100}
          />
          {/* Botões de ação */}
          <div className='flex flex-row justify-center gap-3 mt-3'>
            <Button variant="whitePink" onClick={handleClear}>Limpar</Button>
            <Button onClick={handleSend}>Enviar</Button>
          </div>
        </div>
      );
    }
    
    // Default case - quando nenhuma opção válida é selecionada
    return (
      <div className="mt-6 p-4 bg-gray-100 rounded-lg text-center">
        <p className="text-gray-500">Selecione uma opção acima para ver o conteúdo</p>
      </div>
    );
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
          onSelect={setSelectedButton}
          value={selectedButton}
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
