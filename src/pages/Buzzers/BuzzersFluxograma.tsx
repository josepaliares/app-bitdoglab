import React from "react";
import { Header } from "@/components/Header";
import FlowDiagram from "@/components/FlowDiagram";
import type { FlowStep } from "@/components/FlowDiagram";
import pressedPiaonKey from "@/assets/imgs/pressedpianokey.jpeg";

export default function NeopixelInfo(): React.ReactElement {
  // Definindo os passos do fluxograma com tipagem
  const flowSteps: FlowStep[] = [
    {
      icon: <></>,
      text: "Usuário escolhe uma oitava",
    },
    {
      icon: <img src={pressedPiaonKey} className="w-20"/>,
      text: "Pressiona uma tecla do piano",
    },
    {
      icon: <></>,
      text: "Placa começa a tocar a nota",
    },
    {
      icon: <></>,
      text: "Solta a tecla do piano",
    },
    {
      icon: <></>,
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
