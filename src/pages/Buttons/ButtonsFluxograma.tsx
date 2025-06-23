import type { FlowStep } from "@/components/FlowDiagram";
import FlowDiagram from "@/components/FlowDiagram";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import cabobluetooth from "@/assets/imgs/CaboEBlutooth.png";
import touch from "@/assets/imgs/touch.png";
import idea from "@/assets/imgs/lampada.png";
import button3d from "@/assets/imgs/Button3D.png";
import down from "@/assets/imgs/Down.png";

export default function ButtonsFluxograma() {

  // Definindo os passos do fluxograma com tipagem
  const flowSteps: FlowStep[] = [
    {
      icon: <img src={button3d} alt="imagem button3d"/>,
      text: "Escolha o botão para a ação"
    },
    {
      icon: <img src={down} alt="imagem down"/>,
      text: "Escolha o que controlar"
    },
    {
      icon: <img src={touch} alt="imagem touch"/>,
      text: "Seleciona a ação do botão"
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
      icon: <img src={idea} alt="imagem idea"/>,
      text: "LED muda para a cor selecionada"
    }
  ];
  
  return (
    <div className="flex flex-col">
      <Header title="Como funciona?" showIdeaButton={false} />
      <main className="h-screen flex flex-col items-center gap-3.5">
        {/* Usando o componente FlowDiagram para renderizar o fluxograma */}
        <FlowDiagram steps={flowSteps} />
      </main>
    </div>
  );
}