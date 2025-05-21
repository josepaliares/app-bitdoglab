import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { useConnection } from "../../contexts/ConnectionContext";
import { NeopixelController } from "../../utils/neopixelController";
import { Header } from "@/components/Header"
// import idea from "@/assets/imgs/lampada.png";
import ColorPicker from "@/components/ColorPicker";
import LEDMatrix from "@/components/LEDMatrix";

export default function Neopixel() {
  const navigate = useNavigate();
  const hasRun = useRef(false);
  const { sendCommand } = useConnection();
  const neopixelController = useRef<NeopixelController | null>(null);

  const [valueR, setValueR] = useState(0);
  const [valueG, setValueG] = useState(0);
  const [valueB, setValueB] = useState(0);
  const [selectedLEDIndex, setSelectedLEDIndex] = useState<number | null>(null);

  // Store all LED colors (initialized to black)
  const [ledColors, setLedColors] = useState<string[]>(
    Array(25).fill("rgb(0, 0, 0)")
  );

  const numbLEDs = 25; // Number of LEDs
  const LEDsInline = 5; // LEDs per row

  // Update the selected LED's color
  useEffect(() => {
    if (selectedLEDIndex !== null) {
      const newColor = `rgb(${valueR}, ${valueG}, ${valueB})`;
      setLedColors((prev) => {
        const newColors = [...prev];
        newColors[selectedLEDIndex] = newColor;
        return newColors;
      });
    }
  }, [valueR, valueG, valueB, selectedLEDIndex]);

  // Initialize the NeopixelController
  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    neopixelController.current = new NeopixelController(sendCommand);
  }, [sendCommand]);

  // Handle LED selection
  const handleLEDSelected = (index: number) => {
    setSelectedLEDIndex(index);

    // Update color slider values based on the selected LED's current color
    const color = ledColors[index];
    if (color) {
      // Parse the RGB values from the color string with proper type checking
      const rgbMatch = color.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
      if (rgbMatch && rgbMatch.length === 4) {
        // Full match + 3 groups
        // Use non-null assertion (!) since we checked length
        setValueR(parseInt(rgbMatch[1]!));
        setValueG(parseInt(rgbMatch[2]!));
        setValueB(parseInt(rgbMatch[3]!));
      } else {
        // Handle invalid color format (fallback to black)
        setValueR(0);
        setValueG(0);
        setValueB(0);
      }
    }
  };

  // Handle the Clear button click
  const handleClear = () => {
    setLedColors(Array(numbLEDs).fill("rgb(0, 0, 0)"));
    setValueR(0);
    setValueG(0);
    setValueB(0);
  };

  // Handle the Send button click
  const handleSend = async () => {
    try {
      // Get all LED SVG elements
      const ledElements = document.querySelectorAll("svg.led-svg");
      await neopixelController.current?.sendLEDConfigurations(ledElements);
    } catch (error) {
      console.error("Erro ao configurar LEDs:", error);
    }
  };

  return (
    <div className="flex flex-col">
      {/* <header className="text-ubuntu flex items-center p-4">
        <div className="text-ubuntu flex-1 flex justify-start">
          <Button variant="blue" onClick={() => navigate("/components")}>
            Voltar
          </Button>
        </div>
        <h1 className="text-ubuntu font-bold text-xl flex-1 text-center p-6">Neopixel</h1>
        <div className="flex-1 flex justify-end">
          <button
            onClick={() => navigate("/components/neopixel/como-funciona")}
          >
            <img src={idea} alt="Como funciona?" className="w-10" />
          </button>
        </div>
      </header> */}
      <Header 
      title="Neopixel" 
      showIdeaButton={true}
      ideaButtonPath="/components/neopixel/como-funciona"
      />
      <main className="h-screen flex flex-col items-center justify-center gap-3.5">
        <h2 className="text-ubuntu font-bold text-md mb-5">
          Selecione um dos 25 LEDS e regule a cor conforme desejar
        </h2>

        <LEDMatrix
          numLEDs={numbLEDs}
          ledsPerRow={LEDsInline}
          onLEDSelected={handleLEDSelected}
          ledColors={ledColors}
        />

        <ColorPicker
          valueR={valueR}
          valueG={valueG}
          valueB={valueB}
          onChangeR={setValueR}
          onChangeG={setValueG}
          onChangeB={setValueB}
          showLabels={true}
          showValues={true}
        />

        <div className="flex flex-row justify-center gap-3 mt-4">
          <Button variant="whitePink" onClick={handleClear}>
            Limpar
          </Button>
          <Button onClick={handleSend}>Enviar</Button>
        </div>
      </main>
    </div>
  );
}
