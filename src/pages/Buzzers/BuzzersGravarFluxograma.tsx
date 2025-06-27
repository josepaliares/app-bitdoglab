import React from "react";
import { Header } from "@/components/Header";
import FlowDiagram from "@/components/FlowDiagram";
import type { FlowStep } from "@/components/FlowDiagram";
import pressedPiaonKey from "@/assets/imgs/pressedpianokey.png";
import music from "@/assets/imgs/music.png";
import touch from "@/assets/imgs/touch.png";
import stop from "@/assets/imgs/stop_recording.png";
import disk from "@/assets/imgs/Floppy-disk.png";

export default function BuzzersGravarFluxograma(): React.ReactElement {
  // Definindo os passos do fluxograma com tipagem
  const flowSteps: FlowStep[] = [
    {
      icon: <img src={touch} alt="imagem touch"/>,
      text: "Clica em gravar uma musica",
    },
    {
      icon: <img src={pressedPiaonKey} className="w-16"/>,
      text: "Pressiona as teclas do piano",
    },
    {
      icon: <img src={disk} className="w-16"/>,
      text: "Placa salva a sequencia musical",
    },
    {
      icon: <img src={stop} className="w-16"/>,
      text: "Finaliza a gravação",
    },
    {
      icon: <img src={music} className="w-16"/>,
      text: "Reproduz a sequência gravada",
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
