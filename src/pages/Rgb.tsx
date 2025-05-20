import { useEffect, useRef, useState } from "react";
import { Button } from "../components/ui/button";
import { useNavigate } from "react-router-dom";
import "./style.css";

export default function Rgb() {
  const navigate = useNavigate();
  const hasRun = useRef(false);

  const wrapperRefs = useRef<HTMLDivElement>(null);

  const [valueR, setValueR] = useState(0);
  const [valueG, setValueG] = useState(0);
  const [valueB, setValueB] = useState(0);

  const [leds, setLeds] = useState<HTMLDivElement[]>([]);

  const updateLEDColor =
    (color: "r" | "g" | "b") =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = parseInt(event.target.value);

      if (color === "r") setValueR(value);
      if (color === "g") setValueG(value);
      if (color === "b") setValueB(value);

      if (leds.length === 4) {
        const [ledR, ledG, ledB, ledRGB] = leds.map((div) =>
          div.querySelector("svg #led")
        );

        ledR?.setAttribute("fill", `rgb(${valueR},0,0)`);
        ledG?.setAttribute("fill", `rgb(0,${valueG},0)`);
        ledB?.setAttribute("fill", `rgb(0,0,${valueB})`);

        const r = color === "r" ? value : valueR;
        const g = color === "g" ? value : valueG;
        const b = color === "b" ? value : valueB;
        ledRGB?.setAttribute("fill", `rgb(${r},${g},${b})`);
      }
    };

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    fetch("/assets/LED.svg")
      .then((res) => res.text())
      .then((svgText) => {
        const parser = new DOMParser();
        const svgDoc = parser.parseFromString(svgText, "image/svg+xml");
        const baseSvg = svgDoc.querySelector("svg");
        const baseRect = baseSvg?.querySelector("#led");

        if (!baseSvg || !baseRect) return;

        const createLed = (color: string, isFinal: boolean = false) => {
          const cloneSvg = baseSvg.cloneNode(true) as SVGSVGElement;
          cloneSvg.classList.add("led-svg");
        
          const container = document.createElement("div");
          container.classList.add("led-container");
          container.appendChild(cloneSvg);
        
          const rect = cloneSvg.querySelector("#led");
          rect?.setAttribute("fill", color);
        
          // Adiciona borda preta no LED final
          if (isFinal && rect) {
            rect.setAttribute("stroke", "gray");
            rect.setAttribute("stroke-width", "1");
            rect.setAttribute("rx", "12");
            rect.setAttribute("ry", "12");  
          }
        
          return container;
        };
        

        const ledR = createLed("rgb(0,0,0)");
        const ledG = createLed("rgb(0,0,0)");
        const ledB = createLed("rgb(0,0,0)");
        const ledRGB = createLed("rgb(0,0,0)", true);

        const allLeds = [ledR, ledG, ledB, ledRGB];
        setLeds(allLeds);

        if (wrapperRefs.current) {
          wrapperRefs.current.innerHTML = "";
          const separator = (text: string) => {
            const span = document.createElement("span");
            span.textContent = text;
            span.className = "text-2xl font-bold text-black self-center";
            return span;
          };

          wrapperRefs.current.appendChild(ledR);
          wrapperRefs.current.appendChild(separator("+"));
          wrapperRefs.current.appendChild(ledG);
          wrapperRefs.current.appendChild(separator("+"));
          wrapperRefs.current.appendChild(ledB);
          wrapperRefs.current.appendChild(separator("="));
          wrapperRefs.current.appendChild(ledRGB);
        }
      });
  }, [valueR, valueG, valueB]);

  return (
    <>
      <div className="absolute top-5 left-5">
        <Button variant="blue" onClick={() => navigate("/components")}>
          Voltar
        </Button>
      </div>

      <div className="h-screen flex flex-col items-center justify-center gap-3.5">
        <h1 className="text-ubuntu font-bold text-lg">Como a cor é formada?</h1>
        <div className="slider-container">
          <label className="font-medium font-ubuntu text-md">
            R:
            <input
              type="range"
              id="rSlider"
              min="0"
              max="255"
              value={valueR}
              onChange={updateLEDColor("r")}
            ></input>
            <span id="rValueDisplay">{valueR}</span>
          </label>
        </div>
        <div className="slider-container">
          <label className="font-medium font-ubuntu text-md">
            G:
            <input
              type="range"
              id="gSlider"
              min="0"
              max="255"
              value={valueG}
              onChange={updateLEDColor("g")}
            ></input>
            <span id="gValueDisplay">{valueG}</span>
          </label>
        </div>
        <div className="slider-container">
          <label className="font-medium font-ubuntu text-md">
            B:
            <input
              type="range"
              id="bSlider"
              min="0"
              max="255"
              value={valueB}
              onChange={updateLEDColor("b")}
            ></input>
            <span id="bValueDisplay">{valueB}</span>
          </label>
        </div>

        <div
          className="flex flex-row gap-4 mt-6 items-center"
          id="leds-wrapper"
          ref={wrapperRefs}
        ></div>
        <h3 className="text-ubuntu font-regular text-sm mt-10 mb-10">Todas as cores podem ser vistas como uma "mistura" de vermelho, verde e azul!</h3>
        <Button onClick={()=>navigate("/components/neopixel")}>Teste você mesmo!</Button>
      </div>
    </>
  );
}
