import { useState, useEffect, useRef } from "react";
import { useConnection } from "../../contexts/ConnectionContext";
import { Header } from "../../components/Header";
import Slider from "../../components/Slider";
import { useBuzzers } from "../../hooks/useBuzzers";
import Piano from "../../components/Piano";
import { playbackBuzzerSequence } from "../../utils/playbackBuzzer";
import { recordsConfigs } from "../../components/RecordsList";
import { Music, FolderOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Buzzers() {
  const navigate = useNavigate();
  const { sendCommand } = useConnection();
  const [isRecording, setIsRecording] = useState(false);
  const { 
    octave, 
    setOctave, 
    handleNotePress, 
    handleNoteRelease, 
    getRecordingBuffer, 
    buzzersController
  } = useBuzzers(sendCommand, isRecording);

  const prevRecording = useRef(isRecording);

  // Efeito para lidar com o fim da gravação
  useEffect(() => {
    if (prevRecording.current && !isRecording) {
      const buffer = getRecordingBuffer();
      console.log("Buffer gravado:", buffer);
      
      // Salva o buffer atual para ser acessado pela tela de Records
      try {
        localStorage.setItem(recordsConfigs.buzzers.currentBufferKey, JSON.stringify(buffer));
      } catch (error) {
        console.error("Erro ao salvar buffer atual:", error);
      }
      
      // Reproduz a gravação imediatamente após parar de gravar
      if (buzzersController && buffer.length > 0) {
        playbackBuzzerSequence(buzzersController, buffer);
      }
    }
    prevRecording.current = isRecording;
  }, [isRecording, getRecordingBuffer, buzzersController]);

  // Efeito para carregar uma gravação selecionada na tela de Records
  useEffect(() => {
    try {
      const loadedRecording = localStorage.getItem(recordsConfigs.buzzers.loadedRecordingKey);
      if (loadedRecording) {
        const parsedRecording = JSON.parse(loadedRecording);
        console.log("Gravação carregada:", parsedRecording);
        
        if (buzzersController && parsedRecording.length > 0) {
          playbackBuzzerSequence(buzzersController, parsedRecording);
        }
        
        // Limpa a gravação do localStorage após o uso
        localStorage.removeItem(recordsConfigs.buzzers.loadedRecordingKey);
      }
    } catch (error) {
      console.error("Erro ao carregar gravação:", error);
    }
  }, [buzzersController]);

  const handleRecord = () => {
    // Se não está gravando e vai começar a gravar, limpa o buffer anterior
    if (!isRecording) {
        //clearRecordingBuffer();
    }
    setIsRecording((prev) => !prev);
  };

  const handleOpenRecords = () => {
    // Garante que o buffer atual (mesmo que vazio) seja salvo antes de navegar
    const currentBuffer = getRecordingBuffer();
     try {
        localStorage.setItem(recordsConfigs.buzzers.currentBufferKey, JSON.stringify(currentBuffer));
      } catch (error) {
        console.error("Erro ao salvar buffer atual:", error);
      }
    
    navigate('/buzzer-records');
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
      <div className="flex-1 flex flex-col items-center justify-between overflow-y-auto pb-4 bg-background relative">
        <div className="flex flex-col items-center gap-3.5 w-full">
          <h3 className="text-ubuntu text-text font-medium text-lg mb-1">Escolha uma nota e seu tom</h3>
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
        
        <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
          <button
            onClick={handleOpenRecords}
            className="flex items-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-full font-semibold shadow-lg hover:bg-blue-700 transition-all duration-200"
            title="Ver Gravações"
          >
            <FolderOpen className="w-4 h-4" />
            Gravações
          </button>
          
          <button
            onClick={handleRecord}
            className={`flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-white shadow-lg transition-all duration-200 ${
              isRecording ? "bg-red-600 animate-pulse" : "bg-primary"
            }`}
          >
            <Music className="w-4 h-4" />
            {isRecording ? "Gravando..." : "Gravar"}
          </button>
        </div>
      </div>
    </div>
  );
}
