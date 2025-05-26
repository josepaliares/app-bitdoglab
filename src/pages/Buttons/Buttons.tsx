import { Header } from "@/components/Header";
import DropdownSelector from "@/components/DropdownSelector";
import Selecter from "@/components/Selecter";
import { useState } from "react";
import LED from "@/components/LED";
import ColorPicker from "@/components/ColorPicker";
import { Button } from "@/components/ui/button";
import { useLedRGB } from "@/hooks/useLedRGB";
import Slider from "@/components/Slider";
import Cards from "@/components/Cards";
import bigx from "@/assets/imgs/BigX.png";
import smalx from "@/assets/imgs/SmalX.png";
import bigheart from "@/assets/imgs/BigHeart.png";
import smalheart from "@/assets/imgs/SmalHeart.png";
import smilley from "@/assets/imgs/Smiley.png";
import sad from "@/assets/imgs/Sad.png";
import giraffe from "@/assets/imgs/Giraffe.png";

export default function Buttons() {
  const [selectedComponent, setSelectedComponent] = useState("");
  const [selectedButton, setSelectedButton] = useState("");
  const [selectedCard, setSelectedCard] = useState("");

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

  const cardscomponents = [
    { id: "bigx", icon: <img src={bigx} alt="imagem bigx"/>, text: "X grande"},
    { id: "smalx", icon: <img src={smalx} alt="imagem smalx"/>, text: "X pequeno"},
    { id: "bigheart", icon: <img src={bigheart} alt="imagem bigheart"/>, text: "Coração grande"},
    { id: "smalheart", icon: <img src={smalheart} alt="imagem smalheart"/>, text: "Coração grande"},
    { id: "smilley", icon: <img src={smilley} alt="imagem smilley"/>, text: "Coração grande"},
    { id: "sad", icon: <img src={sad} alt="imagem sad"/>, text: "Coração grande"},
    { id: "giraffe", icon: <img src={giraffe} alt="imagem giraffe"/>, text: "Coração grande"}
  ];

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

  const handleClear = () => {
    if (selectedComponent === "neopixel") {
      setSelectedCard("");
    } else if (selectedComponent === "ledrgb") {
      handleClearL();
    } else if (selectedComponent === "buzzera" || selectedComponent === "buzzerb") {
      onChangeN(0);
      onChangeV(0);
    }
  }

  const handleSend = () => {
    if(selectedButton === ""){
      return console.log("Botão não selecionado");
    }
    let json;
    if (selectedComponent === "neopixel") {
      json = JSON.stringify({ [selectedComponent]: [selectedCard] }, null, 3);
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
        <div>
          <Cards
            cards={cardscomponents}
            onSelect={setSelectedCard}
            value={selectedCard}
          />
          {/* Botões de ação */}
          <div className='flex flex-row justify-center gap-3 mt-3'>
            <Button variant="whitePink" onClick={handleClear}>Limpar</Button>
            <Button onClick={handleSend}>Enviar</Button>
          </div>
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
      <div className="mt-6 p-4 text-center">
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
