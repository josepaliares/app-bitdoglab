import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { RecordsList } from '@/components/RecordsList';
import type { RecordConfig } from '@/components/RecordsList';

interface RecordsPageProps {
  config: RecordConfig;
}

const Records: React.FC<RecordsPageProps> = ({ config }) => {
  const navigate = useNavigate();

  const handleSelectRecording = (recording: any) => {
    try {
      // Salva a gravação selecionada no localStorage para ser carregada pela outra tela
      localStorage.setItem(config.loadedRecordingKey, JSON.stringify(recording));
      // Navega de volta para a tela anterior
      navigate(config.backPath);
    } catch (error) {
      console.error("Erro ao selecionar gravação:", error);
      alert("Não foi possível carregar a gravação.");
    }
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      <Header
        title="Minhas Gravações"
      />
      <main className="flex-1 overflow-y-auto">
        <RecordsList config={config} onSelect={handleSelectRecording} />
      </main>
    </div>
  );
};

export default Records;
