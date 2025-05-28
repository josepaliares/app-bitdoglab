import React from 'react';
import { Header } from "@/components/Header";
import FlowDiagram from '@/components/FlowDiagram';
import type { FlowStep } from "@/components/FlowDiagram";

export default function NeopixelInfo(): React.ReactElement {

  // Definindo os passos do fluxograma com tipagem
  const flowSteps: FlowStep[] = [
  ];

  return (
    <>
      <Header
        title=""
        showIdeaButton={false}
      />
      <div className="h-screen flex flex-col items-center gap-3.5">
        <h2 className="text-ubuntu font-medium text-lg mb-1">Como Funciona?</h2>
        {/* Usando o componente FlowDiagram para renderizar o fluxograma */}
        <FlowDiagram steps={flowSteps} />
      </div>
    </>
  );
}