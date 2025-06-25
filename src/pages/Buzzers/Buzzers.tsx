import { useState, useEffect, useRef } from "react";
import { useConnection } from "@/contexts/ConnectionContext";
import { Header } from "@/components/Header";
import Slider from "@/components/Slider";
import { useBuzzers } from "@/hooks/useBuzzers";
import Piano from "@/components/Piano";
import { playbackBuzzerSequence } from "@/utils/playbackBuzzer";

export default function Buzzers() {
  const { sendCommand } = useConnection();
  const [isRecording, setIsRecording] = useState(false);
  const { octave, setOctave, handleNotePress, handleNoteRelease, getRecordingBuffer, buzzersController } = useBuzzers(sendCommand, isRecording);

  // Referência para guardar o valor anterior de isRecording
  const prevRecording = useRef(isRecording);

  useEffect(() => {
    // Quando parar de gravar (mudou de true para false)
    if (prevRecording.current && !isRecording) {
      const buffer = getRecordingBuffer();
      console.log("Buffer gravado:", buffer);
      if (buzzersController) {
        playbackBuzzerSequence(buzzersController, buffer);
      }
    }
    prevRecording.current = isRecording;
  }, [isRecording, getRecordingBuffer]);

  const handleRecord = () => {
    setIsRecording((prev) => !prev);
  };

  return (
    <div
      className={`flex flex-col h-screen transition-all duration-200 ${
        isRecording ? "border-4 border-red-600" : ""
      }`}
    >
      <Header
        title="Toque uma música"
        showIdeaButton={true}
        ideaButtonPath="/components/buzzers/info"
      />
      <div className="flex-1 flex flex-col items-center overflow-y-auto pb-4 bg-background relative">
        <div className="flex flex-col items-center gap-3.5 w-full">
          <h3 className="text-ubuntu text-text font-medium text-lg mb-1">Escolha uma nota e sua oitava</h3>
          <Slider
            variant="pianoTones"
            value={octave}
            onChange={setOctave}
            showValue={false}
          />
        </div>
        <div className="w-full flex-shrink-0 mb-2 flex flex-col items-center gap-3">
          <Piano 
            onKeyPress={handleNotePress} 
            onKeyRelease={handleNoteRelease}
          />
        </div>
        {/* Botão de gravar no canto inferior direito */}
        <button
          onClick={handleRecord}
          className={`fixed bottom-6 right-6 z-50 px-6 py-3 rounded-full font-semibold text-white shadow-lg transition-all duration-200 ${
            isRecording ? "bg-red-600 animate-pulse" : "bg-primary"
          }`}
        >
          {isRecording ? "Gravando..." : "Gravar"}
        </button>
      </div>
    </div>
  );
}