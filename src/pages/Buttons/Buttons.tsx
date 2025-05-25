import { Header } from "@/components/Header";
import DropdownSelector from "@/components/DropdownSelector";
import Selecter from "@/components/Selecter";
import { useState } from "react";

export default function Buttons() {
  const [selectedComponent, setSelectedComponent] = useState("");

  const buttonscomponents = [
    { id: "botaoa", label: "Botão A" },
    { id: "botaob", label: "Botão B" }
  ]

  const components = [
    { id: "neopixel", label: "Neopixel" },
    { id: "ledrgb", label: "LED RGB" },
    { id: "buzzera", label: "Buzzer A" },
    { id: "buzzerb", label: "Buzzer B" }
  ];
  
  return (
    <div className="flex flex-col">
      <Header title="Botões" 
        showIdeaButton={true}
        ideaButtonPath="/components/botoes/info" />
      <main className="h-screen flex flex-col items-center gap-3.5">
        <h2 className="text-ubuntu text-md mb-5">  Escolha um  botão e defina o que ele faz quando for pressionado</h2>
        <Selecter
          options={buttonscomponents}
        />
        <DropdownSelector
          options={components}
          placeholder="Selecione um componente"
          onSelect={setSelectedComponent}
          value={selectedComponent}
        />
      </main>
    </div>
  );
}
