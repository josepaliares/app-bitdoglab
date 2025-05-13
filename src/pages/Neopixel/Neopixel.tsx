import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { useConnection } from "../../contexts/ConnectionContext";
import { NeopixelController } from "../../utils/neopixelController";
import idea from "@/assets/imgs/lampada.png";

export default function Neopixel() {
  const navigate = useNavigate();
  const hasRun = useRef(false);
  const { sendCommand } = useConnection();
  const neopixelController = useRef<NeopixelController | null>(null);

  const ledsContainerRef = useRef<HTMLDivElement>(null);
  const textNumbers = useRef<HTMLDivElement>(null);

  const [valueR, setValueR] = useState(0);
  const [valueG, setValueG] = useState(0);
  const [valueB, setValueB] = useState(0);

  const [ledSelecionado, setLedSelecionado] = useState<HTMLDivElement | null>(
    null
  );
  const numbLEDs = 25; //numbLEDs will indicate the number of leds you want
  const LEDsInline = 5; //LEDInline define  the number of leds in one line, remember to change this number in the ledsContainerRef too

  function loadLed(container: HTMLDivElement | null, ledId: string) {
    fetch("/assets/LED.svg")
      .then((res) => res.text())
      .then((svgText) => {
        const parser = new DOMParser();
        const svgDoc = parser.parseFromString(svgText, "image/svg+xml");
        const svg = svgDoc.querySelector("svg");
        const rect = svg?.querySelector("#led");

        if (!svg || !rect) return;

        svg.setAttribute("id", ledId);
        svg.classList.add("led-svg");

        const ledContainer = document.createElement("div");
        ledContainer.className =
          "w-[50px] h-[50px] flex items-center justify-center";
        ledContainer.appendChild(svg);

        svg.addEventListener("click", () => {
          document.querySelectorAll(".led-container").forEach((c) => {
            (c as HTMLElement).style.border = "none";
          });
          (ledContainer as HTMLElement).style.border = "4px solid #e31a8b";
          (ledContainer as HTMLElement).style.borderRadius = "11px";

          setLedSelecionado(ledContainer);
        });

        if (container) {
          container.appendChild(ledContainer);
        }
      });
  }

  // Atualiza a cor do LED selecionado
  const updateLEDColor =
    (color: "r" | "g" | "b") =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = parseInt(event.target.value);

      if (color === "r") {
        setValueR(value);
      } else if (color === "g") {
        setValueG(value);
      } else if (color === "b") {
        setValueB(value);
      }

      // calcula nova cor RGB
      const rgbColor = `rgb(${color === "r" ? value : valueR}, ${
        color === "g" ? value : valueG
      }, ${color === "b" ? value : valueB})`;

      const svg = ledSelecionado?.querySelector("svg");
      const rect = svg?.querySelector("rect");
      rect?.setAttribute("fill", rgbColor);
      rect?.setAttribute("text", "on");
    };

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    neopixelController.current = new NeopixelController(sendCommand);

    // Cria os LEDs
    let line = Math.ceil(numbLEDs / LEDsInline) - 1;
    for (let row = 0; row < Math.ceil(numbLEDs / LEDsInline); row++) {
      // Crie um container para cada linha
      const rowContainer = document.createElement("div");
      rowContainer.className = "contents"; // Faz com que o grid ignore este elemento

      // Adicione o número da linha
      const label = document.createElement("div");
      label.className = "text-ubuntu font-medium text-md mt-3";
      label.textContent = `${line}`;
      rowContainer.appendChild(label);
      line--;

      // Adicione os LEDs desta linha
      for (let col = 0; col < LEDsInline; col++) {
        const ledIndex = row * LEDsInline + col;
        if (ledIndex < numbLEDs) {
          loadLed(rowContainer, ledIndex.toString());
        }
      }

      // Adicione a linha completa ao container principal
      ledsContainerRef.current?.appendChild(rowContainer);
    }

    const limparBtn = document.getElementById("limpar");
    const enviarBtn = document.getElementById("enviar");

    limparBtn?.addEventListener("click", () => {
      const leds = document.querySelectorAll("svg #led");
      leds.forEach((led) => {
        led.setAttribute("fill", "rgb(0, 0, 0)"); // Mudando para preto (LED apagado)
        led.setAttribute("text", "off");
      });

      // Resetar os valores dos sliders
      setValueR(0);
      setValueG(0);
      setValueB(0);
    });

    enviarBtn?.addEventListener("click", async () => {
      const leds = document.querySelectorAll("svg");
      try {
        await neopixelController.current?.sendLEDConfigurations(leds);
      } catch (error) {
        console.error("Erro ao configurar LEDs:", error);
      }
    });
  }, [sendCommand]);

  return (
    <>
      <div className="absolute top-5 left-5">
        <Button variant="blue" onClick={() => navigate("/components")}>
          Voltar
        </Button>
      </div>
      <img
        src={idea}
        alt="Como funciona?"
        className="absolute top-5 right-5 w-1/8 mb-4"
        onClick={() => navigate("/components/neopixel/info")}
      />
      <div className="h-screen flex flex-col items-center justify-center gap-3.5">
        <h1 className="text-ubuntu font-bold text-lg mt-5">Neopixel</h1>
        <h2 className="text-ubuntu font-medium text-md mb-2">
          Selecione um dos 25 LEDS e regule a cor conforme desejar
        </h2>

        <div
          className="ledsContainerRef"
          ref={ledsContainerRef}
          style={{
            display: "grid",
            gridTemplateColumns: "auto repeat(5, 1fr)", // the first number in "repeat" will indicate the number of leds in the line
            gap: "10px",
            alignItems: "center", // Alinha verticalmente
          }}
        />
        <div className="flex flex-row justify-center gap-10" ref={textNumbers}>
          <h5 className="ml-4">0</h5>
          <h5 className="ml-3">1</h5>
          <h5 className="ml-3">2</h5>
          <h5 className="ml-3">3</h5>
          <h5 className="ml-3">4</h5>
        </div>

        <div>
          {/* Slider R */}
          <div className="flex items-center gap-3 mt-2">
            <label className="w-6 text-right font-medium font-ubuntu text-md">
              R:
            </label>
            <input
              type="range"
              value={valueR}
              onChange={updateLEDColor("r")}
              min={0}
              max={255}
              className="w-[250px] h-[10px] rounded-lg appearance-none outline-none cursor-pointer bg-gradient-to-r from-black to-rgb-red"
            />
            <span className="w-8 text-left">{valueR}</span>
          </div>

          {/* Slider G */}
          <div className="flex items-center gap-3 mt-2">
            <label className="w-6 text-right font-medium font-ubuntu text-md">
              G:
            </label>
            <input
              type="range"
              value={valueG}
              onChange={updateLEDColor("g")}
              min={0}
              max={255}
              className="w-[250px] h-[10px] rounded-lg appearance-none outline-none cursor-pointer bg-gradient-to-r from-black to-rgb-green"
            />
            <span className="w-8 text-left">{valueG}</span>
          </div>

          {/* Slider B */}
          <div className="flex items-center gap-3 mt-2">
            <label className="w-6 text-right font-medium font-ubuntu text-md">
              B:
            </label>
            <input
              type="range"
              value={valueB}
              onChange={updateLEDColor("b")}
              min={0}
              max={255}
              className="w-[250px] h-[10px] rounded-lg appearance-none outline-none cursor-pointer bg-gradient-to-r from-black to-rgb-blue"
            />
            <span className="w-8 text-left">{valueB}</span>
          </div>
        </div>

        <div className="flex flex-row justify-center gap-3">
          <Button variant="whitePink" id="limpar">
            Limpar
          </Button>
          <Button id="enviar">Enviar</Button>
        </div>
      </div>
    </>
  );
}
