import React from 'react';
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import cabobluetooth from "@/assets/imgs/CaboEBlutooth.png";
import touch from "@/assets/imgs/touch.png";
import LED from "../../../public/assets/LED.svg";
import FlowDiagram from '@/components/FlowDiagram';
import type { FlowStep } from "@/components/FlowDiagram";

export default function NeopixelFluxograma(): React.ReactElement {
  const navigate = useNavigate();

  // Definindo os passos do fluxograma com tipagem
  const flowSteps: FlowStep[] = [
    {
      icon: <img src={touch} alt="imagem touch"/>,
      text: "Seleciona as cores dos leds"
    },
    {
      icon: <Button>Enviar</Button>,
      text: "Clica em \"Enviar\"",
      className: "items-center" // Classe extra para ajustar a posição do texto
    },
    {
      icon: <img src={cabobluetooth} alt="imagem cabobluetooth"/>,
      text: "Placa recebe via cabo ou Bluetooth"
    },
    {
      icon: (
        <div
          className="w-12 aspect-square bg-gradient-to-bl from-pink-30 to-blue-30 mask mask-center mask-no-repeat mask-contain"
          style={{
            WebkitMaskImage: `url(${LED})`,
            maskImage: `url(${LED})`,
          }}
        />
      ),
      text: "LED(x,y) muda para a cor selecionada"
    }
  ];

  const handleCardSelection = (cardId: string) => {
    if (cardId == '0'){
      navigate("/components/neopixel/info1");
    }
    if (cardId == '1'){
      navigate("/components/neopixel/info2");
    }
    if (cardId == '2'){
      navigate("/components/neopixel/info3");
    }
    if (cardId == '3'){
      navigate("/components/neopixel/info4");
    }
  }

  return (
    <>
      <Header
        title=""
        showIdeaButton={false}
      />
      <div className="h-screen flex flex-col items-center gap-3.5 mx-2">
        <h2 className="text-ubuntu font-medium text-lg mb-1">Como Funciona?</h2>
        {/* Usando o componente FlowDiagram para renderizar o fluxograma */}
        <FlowDiagram 
          steps={flowSteps}
          onCardSelected={handleCardSelection} />
        
        <Button className="mb-1" onClick={() => navigate("/components/neopixel/rgb-info")}>
          Como funciona o RGB?
        </Button>
      </div>
    </>
  );
}