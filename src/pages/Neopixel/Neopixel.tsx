import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useConnection } from "../../contexts/ConnectionContext";
import idea from "@/assets/imgs/lampada.png";
import ColorPicker from "@/components/ColorPicker";
import LEDMatrix from "@/components/LEDMatrix";
import { useNeopixelController } from "@/hooks/useNeopixel";

export default function Neopixel() {
  const navigate = useNavigate();
  const { sendCommand } = useConnection();
  
  // Definição da matriz de LEDs
  const LEDsInline = 5; // LEDs por linha
  const LEDSInCol = 5;  // LEDs por coluna
  const totalLEDs = LEDsInline * LEDSInCol;
  
  // Utilizamos o hook personalizado para gerenciar os LEDs
  const {
    // Valores individuais de RGB e seus setters (mantidos para compatibilidade)
    valueR,
    valueG,
    valueB,
    setValueR,
    setValueG,
    setValueB,
    // Estado e manipuladores dos LEDs
    ledColors,
    handleLEDSelected,
    handleClear,
    handleSend
  } = useNeopixelController(sendCommand, totalLEDs);

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

        {/* LED Matrix Component */}
        <LEDMatrix 
          ledsPerCol={LEDSInCol}
          ledsPerRow={LEDsInline}
          onLEDSelected={handleLEDSelected}
          ledColors={ledColors}
        />

        {/* Color Picker Component */}
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
      </div>
    </>
  );
}