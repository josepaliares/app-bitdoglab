import { useConnection } from "@/contexts/ConnectionContext";
import { Header } from "@/components/Header";
import Slider from "@/components/Slider";
import { useBuzzersTocar } from "@/hooks/useBuzzersTocar";
import Piano from "@/components/Piano";

export default function Buzzers() {
  const { sendCommand } = useConnection();

  const { tom, setTom } = useBuzzersTocar(sendCommand);

  const handleNotePress = (note: string, duration: number) => {
    console.log(`Pressed: ${note} for ${duration}ms`);
    // Aqui você pode integrar com seu sistema de buzzers
  };

  return (
    <>
      <Header
        title="Buzzers"
        showIdeaButton={true}
        ideaButtonPath="/components/buzzers/info"
      />
      <div className="h-screen flex flex-col items-center justify-center gap-3.5">
        <h3>Escolha uma nota e seu tom</h3>
        <Slider
          variant="pianoTones"
          value={tom}
          onChange={setTom}
          showValue={false}
        />
        <Piano onKeyPress={handleNotePress} />
      </div>
    </>
  );
}
