import React from 'react';
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import lampada from "@/assets/imgs/lampada.png";
import bluetooth from "@/assets/imgs/bluetooth.png";
import touch from "@/assets/imgs/touch.png";
import LED from "../../../public/assets/LED.svg";
import FlowDiagram from '@/components/FlowDiagram';
import type { FlowStep } from "@/components/FlowDiagram";

export default function NeopixelInfo(): React.ReactElement {
  const navigate = useNavigate();

  // Definindo os passos do fluxograma com tipagem
  const flowSteps: FlowStep[] = [
    {
      icon: (
        <div
          className="w-12 aspect-square bg-black mask mask-center mask-no-repeat mask-contain"
          style={{
            WebkitMaskImage: `url(${LED})`,
            maskImage: `url(${LED})`,
          }}
        />
      ),
      text: "Usuário toca no LED(x,y)"
    },
    {
      icon: <img src={touch} alt="imagem touch"/>,
      text: "Seleciona uma cor"
    },
    {
      icon: <Button>Enviar</Button>,
      text: "Clica em \"Enviar\"",
      className: "items-center" // Classe extra para ajustar a posição do texto
    },
    {
      icon: <img src={bluetooth} alt="imagem bluetooth"/>,
      text: "Placa recebe via Bluetooth"
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

  return (
    <>
      <div className="absolute top-5 left-5">
        <Button variant="blue" onClick={() => navigate("/components/neopixel")}>
          Voltar
        </Button>
      </div>
      <div className="h-screen flex flex-col items-center justify-center gap-3.5">
        <img src={lampada} alt="imagem lampada" className="w-1/10 mb-4" />
        <h1 className="text-ubuntu font-bold text-lg">Como funciona?</h1>
        
        {/* Usando o componente FlowDiagram para renderizar o fluxograma */}
        <FlowDiagram steps={flowSteps} />
        
        <Button className="mt-2" onClick={() => navigate("/components/neopixel/rgb-info")}>
          Como funciona o RGB?
        </Button>
      </div>
    </>
  );
}