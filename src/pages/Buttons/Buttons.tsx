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
import PopUp from "@/components/PopUp";
import { useConnection } from "@/contexts/ConnectionContext";

export default function Buttons() {
  const { sendCommand } = useConnection();
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
  } = useLedRGB(sendCommand);

  const cardscomponents = [
    { id: "bigx", icon: <img src={bigx} alt="imagem bigx"/>, text: "X grande"},
    { id: "smalx", icon: <img src={smalx} alt="imagem smalx"/>, text: "X pequeno"},
    { id: "bigheart", icon: <img src={bigheart} alt="imagem bigheart"/>, text: "Coração grande"},
    { id: "smalheart", icon: <img src={smalheart} alt="imagem smalheart"/>, text: "Coração pequeno"},
    { id: "smilley", icon: <img src={smilley} alt="imagem smilley"/>, text: "Carinha feliz"},
    { id: "sad", icon: <img src={sad} alt="imagem sad"/>, text: "Carinha triste"},
    { id: "giraffe", icon: <img src={giraffe} alt="imagem giraffe"/>, text: "Girafa"}
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

  const [popup, setPopup] = useState({
    isOpen: false,
    message: ''
  });

  const closePopup = () => {
    setPopup({ isOpen: false, message: '' });
  };

  const [valueN, onChangeN] = useState(0);
  const [valueV, onChangeV] = useState(0);

  const handleClear = () => {
    if (selectedComponent === "ledrgb") {
      handleClearL();
    } else if (selectedComponent === "buzzera" || selectedComponent === "buzzerb") {
      onChangeN(0);
      onChangeV(0);
    }
  }

  const handleSend = () => {
    if(selectedButton === ""){
      setPopup({
        isOpen: true,
        message: "você precisa escolher um dos botões"
      });
      return;
    }
    let json;
    if (selectedComponent === "neopixel") {
      json = JSON.stringify({ [selectedComponent]: [selectedCard] }, null, 3);
    } else if (selectedComponent === "ledrgb") {
      json = handleSendL();
    } else if (selectedComponent === "buzzera" || selectedComponent === "buzzerb") {
      json = JSON.stringify({ [selectedComponent]: [valueN, valueV] }, null, 3);
    } else{
      setPopup({
        isOpen: true,
        message: "você precisa escolher um dos componentes"
      });
      return;
    }

    const jsonComplet = JSON.stringify({
      "botões": { [selectedButton]: [json] }
    }, null, 3)
    return jsonComplet;
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
            <Button onClick={handleSend}>Enviar</Button>
          </div>
        </div>
      );
    }
    
    if (selectedComponent === "ledrgb") {
      return (
        <div className="h-screen flex flex-col items-center gap-2">
          <div className="mb-4">
            <LED 
              id="single-led" 
              color={currentColor}
              selected={false}
              size='lg'
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
        <div className="mt-6 p-4 rounded-lg items-center">
          <Slider 
            variant="numeric" 
            value={valueN} 
            onChange={onChangeN}
            label={true ? 'Hz' : undefined}
            showValue={true}
            width='w-250'
            min={0}
            max={5000}
          />
          <Slider 
            variant="volume" 
            value={valueV} 
            onChange={onChangeV}
            label={true ? 'Vol' : undefined}
            showValue={true}
            width='w-250'
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
      <Header 
        title="Botões" 
        showIdeaButton={true}
        ideaButtonPath="/components/botoes/info" 
      />
      <main className="h-screen flex flex-col items-center gap-2">
        <h2 className="text-ubuntu text-md mb-5 text-center pr-5">
          Escolha um  botão e defina o que ele faz quando for pressionado
        </h2>
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
        <PopUp
          isOpen={popup.isOpen}
          onClose={closePopup}
          message={popup.message}
        />

        {/* Conteúdo Dinâmico */}
        {renderDynamicContent()}
      </main>
    </div>
  );
}