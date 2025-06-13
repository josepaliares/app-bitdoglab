import { useConnection } from "@/contexts/ConnectionContext";
import { Header } from "@/components/Header";
import Slider from "@/components/Slider";
import { useBuzzersTocar } from "@/hooks/useBuzzersTocar";
import Piano from "@/components/Piano";

export default function BuzzersTocar() {
  const { sendCommand } = useConnection();
  const { octave, setOctave, handleNotePress, handleNoteRelease } = useBuzzersTocar(sendCommand);

  return (
    <>
      <Header
        title="Toque uma música"
        showIdeaButton={true}
        ideaButtonPath="/components/buzzers/info"
      />
      <div className="h-screen flex flex-col items-center gap-3.5 bg-background">
        <h3 className="text-ubuntu text-text font-medium text-lg mb-1">Escolha uma nota e seu tom</h3>
        <Slider
          variant="pianoTones"
          value={octave}
          onChange={setOctave}
          showValue={false}
        />
        <Piano 
          onKeyPress={handleNotePress} 
          onKeyRelease={handleNoteRelease}
        />
      </div>
    </>
  );
}