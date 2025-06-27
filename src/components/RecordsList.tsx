import React, { useState, useEffect } from 'react';
import { Save, Trash2, CheckCircle, Circle } from 'lucide-react';

// Define a estrutura para a configuração de uma gravação
export interface RecordConfig {
  storageKey: string;
  title: string;
  currentBufferKey: string;
  loadedRecordingKey: string;
  backPath: string;
}

// Objeto de configuração para cada tipo de gravação
export const recordsConfigs = {
  buzzers: {
    storageKey: 'buzzer_recordings',
    title: 'Gravações de Músicas',
    currentBufferKey: 'buzzer_recordings_current_buffer',
    loadedRecordingKey: 'buzzer_recordings_loaded_recording',
    backPath: '/components/buzzers',
  },
  neopixel: {
    storageKey: 'neopixel_recordings',
    title: 'Gravações de Animações',
    currentBufferKey: 'neopixel_recordings_current_buffer',
    loadedRecordingKey: 'neopixel_recordings_loaded_recording',
    backPath: '/components/neopixel',
  },
};

interface RecordsListProps {
  config: RecordConfig;
  onSelect: (recording: any) => void;
}

const MAX_SLOTS = 5; // Número máximo de slots de gravação

export const RecordsList: React.FC<RecordsListProps> = ({ config, onSelect }) => {
  const [recordings, setRecordings] = useState<(any[] | null)[]>([]);

  // Carrega as gravações do localStorage ao iniciar
  useEffect(() => {
    try {
      const storedRecordings = localStorage.getItem(config.storageKey);
      if (storedRecordings) {
        setRecordings(JSON.parse(storedRecordings));
      } else {
        // Inicializa com slots vazios se não houver nada salvo
        setRecordings(new Array(MAX_SLOTS).fill(null));
      }
    } catch (error) {
      console.error("Erro ao carregar gravações:", error);
      setRecordings(new Array(MAX_SLOTS).fill(null));
    }
  }, [config.storageKey]);

  // Função para salvar o estado atual das gravações no localStorage
  const saveRecordingsToStorage = (updatedRecordings: (any[] | null)[]) => {
    try {
      localStorage.setItem(config.storageKey, JSON.stringify(updatedRecordings));
      setRecordings(updatedRecordings);
    } catch (error) {
      console.error("Erro ao salvar gravações:", error);
    }
  };

  // Salva o buffer atual em um slot de gravação
  const handleSave = (slotIndex: number) => {
    try {
      const currentBuffer = localStorage.getItem(config.currentBufferKey);
      if (currentBuffer) {
        const newRecordings = [...recordings];
        newRecordings[slotIndex] = JSON.parse(currentBuffer);
        saveRecordingsToStorage(newRecordings);
        // Opcional: remover o buffer atual após salvar
        // localStorage.removeItem(config.currentBufferKey); 
      } else {
        alert("Nenhuma gravação atual para salvar.");
      }
    } catch (error) {
      console.error("Erro ao salvar no slot:", error);
    }
  };

  // Deleta uma gravação de um slot
  const handleDelete = (slotIndex: number) => {
    if (window.confirm(`Tem certeza que deseja deletar a gravação do Slot ${slotIndex + 1}?`)) {
        const newRecordings = [...recordings];
        newRecordings[slotIndex] = null;
        saveRecordingsToStorage(newRecordings);
    }
  };

  // Seleciona uma gravação para ser carregada no componente principal
  const handleSelect = (slotIndex: number) => {
    const recording = recordings[slotIndex];
    if (recording) {
      onSelect(recording);
    }
  };

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-bold text-center">{config.title}</h2>
      {recordings.map((recording, index) => (
        <div key={index} className="flex items-center justify-between p-3 bg-gray-100 rounded-lg shadow">
          <div className="flex items-center gap-3">
            {recording ? (
              <CheckCircle className="w-6 h-6 text-green-500" />
            ) : (
              <Circle className="w-6 h-6 text-gray-400" />
            )}
            <span className="font-semibold">Slot {index + 1}</span>
            {recording && <span className="text-sm text-gray-600">({Array.isArray(recording) ? `${recording.length} itens` : 'Gravado'})</span>}
          </div>
          <div className="flex gap-2">
            {recording ? (
              <>
                <button onClick={() => handleSelect(index)} className="p-2 text-white bg-blue-500 rounded-md hover:bg-blue-600">
                  Selecionar
                </button>
                <button onClick={() => handleDelete(index)} className="p-2 text-white bg-red-500 rounded-md hover:bg-red-600">
                  <Trash2 className="w-5 h-5" />
                </button>
              </>
            ) : (
              <button onClick={() => handleSave(index)} className="p-2 text-white bg-green-500 rounded-md hover:bg-green-600">
                <Save className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
