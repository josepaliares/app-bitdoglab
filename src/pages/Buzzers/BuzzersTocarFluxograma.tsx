import React from "react";
import { Header } from "@/components/Header";
import { useNavigate } from "react-router-dom";
import FlowDiagram from "@/components/FlowDiagram";
import type { FlowStep } from "@/components/FlowDiagram";
import pressedPiaonKey from "@/assets/imgs/pressedpianokey.png";
import music from "@/assets/imgs/music.png";
import touch from "@/assets/imgs/touch.png";
import SemSom from "@/assets/imgs/SemSom.png";
import unpressedPiaonKey from "@/assets/imgs/unpressedpianokey.png";

export default function BuzzersTocarFluxograma(): React.ReactElement {
  const navigate = useNavigate();

  // Definindo os passos do fluxograma com tipagem
  const flowSteps: FlowStep[] = [
    {
      icon: <img src={touch} alt="imagem touch"/>,
      text: "Usuário escolhe uma oitava",
    },
    {
      icon: <img src={pressedPiaonKey} className="w-16"/>,
      text: "Pressiona uma tecla do piano",
    },
    {
      icon: <img src={music} className="w-16"/>,
      text: "Placa começa a tocar a nota",
    },
    {
      icon: <img src={unpressedPiaonKey} className="w-16"/>,
      text: "Solta a tecla do piano",
    },
    {
      icon: <img src={SemSom} className="w-16"/>,
      text: "Placa para de tocar a nota",
    },
  ];

  const handleCardSelection = (cardId: string) => {
    if (cardId == '0'){
      navigate("/components/buzzers/tocar/info1");
    }
    if (cardId == '1'){
      navigate("/components/buzzers/tocar/info2");
    }
    if (cardId == '2'){
      navigate("/components/buzzers/tocar/info3");
    }
    if (cardId == '3'){
      navigate("/components/buzzers/tocar/info4");
    }
    if (cardId == '4'){
      navigate("/components/buzzers/tocar/info5");
    }
  }

  return (
    <>
      <Header title="" showIdeaButton={false} />
      <div className="h-screen flex flex-col items-center gap-3.5">
        <h2 className="text-ubuntu font-medium text-lg mb-1">Como Funciona?</h2>
        {/* Usando o componente FlowDiagram para renderizar o fluxograma */}
        <FlowDiagram 
          steps={flowSteps}
          onCardSelected={handleCardSelection} />
      </div>
    </>
  );
}
