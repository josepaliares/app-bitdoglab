import React from "react";
import { Header } from "@/components/Header";
import FlowDiagram from "@/components/FlowDiagram";
import type { FlowStep } from "@/components/FlowDiagram";
import pressedPiaonKey from "@/assets/imgs/pressedpianokey.jpeg";
import music from "@/assets/imgs/music.png";
import touch from "@/assets/imgs/touch.png";
import SemSom from "@/assets/imgs/SemSom.png";
import Piano from "@/assets/imgs/Piano.png";

export default function NeopixelInfo(): React.ReactElement {
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
      icon: <img src={Piano} alt="imagem Piano"/>,
      text: "Solta a tecla do piano",
    },
    {
      icon: <img src={SemSom} className="w-16"/>,
      text: "Placa para de tocar a nota",
    },
  ];

  return (
    <>
      <Header title="" showIdeaButton={false} />
      <div className="h-screen flex flex-col items-center gap-3.5 bg-background">
        <h2 className="text-ubuntu font-medium text-lg mb-1 text-heading">Como Funciona?</h2>
        {/* Usando o componente FlowDiagram para renderizar o fluxograma */}
        <FlowDiagram steps={flowSteps} />
      </div>
    </>
  );
}
