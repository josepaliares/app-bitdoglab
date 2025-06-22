import { Button } from "@/components/ui/button";
import { useConnection } from "@/contexts/ConnectionContext";
import { Header } from "@/components/Header";
import ColorPicker from "@/components/ColorPicker";
import LEDMatrix from "@/components/LEDMatrix";
import { useNeopixel } from "@/hooks/useNeopixel";

export default function Neopixel() {
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
  } = useNeopixel(sendCommand, totalLEDs);

  return (
    <div className="flex flex-col bg-background min-h-screen">
      <Header
        title="Neopixel"
        showIdeaButton={true}
        ideaButtonPath="/components/neopixel/info"
      />
      <main className="flex flex-col items-center">
        <h2 className="text-ubuntu mb-5 text-center text-heading">
          Selecione um dos 25 LEDS e regule a cor conforme desejar
        </h2>

        <LEDMatrix
          ledsPerCol={LEDSInCol}
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
          <Button variant="whiteSecondary" onClick={handleClear}>
            Limpar
          </Button>
          <Button variant="secondary" onClick={handleSend}>Enviar</Button>
        </div>
      </main>
    </div>
  );
}