// SaveModal.tsx
import { useState } from "react";
import { X, Save } from "lucide-react";

interface SaveData {
  id: string;
  name: string;
  data: any;
  createdAt: string;
}

interface SaveModalProps {
  isOpen: boolean;
  onClose: () => void;
  storageKey: string;
  currentData?: any;
  title?: string;
}

export default function SaveModal({
  isOpen,
  onClose,
  storageKey,
  currentData,
  title = "Salvar Gravação"
}: SaveModalProps) {
  const [saveName, setSaveName] = useState("");

  // Salvar nova gravação
  const handleSave = () => {
    if (!saveName.trim() || !currentData) return;

    // Carregar saves existentes
    const savedData = localStorage.getItem(storageKey);
    let saves: SaveData[] = [];
    if (savedData) {
      try {
        saves = JSON.parse(savedData);
      } catch (error) {
        console.error('Erro ao carregar saves:', error);
        saves = [];
      }
    }

    const newSave: SaveData = {
      id: Date.now().toString(),
      name: saveName.trim(),
      data: currentData,
      createdAt: new Date().toLocaleString()
    };

    const newSaves = [...saves, newSave];
    localStorage.setItem(storageKey, JSON.stringify(newSaves));
    
    setSaveName("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md m-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Nome da Gravação
            </label>
            <input
              type="text"
              value={saveName}
              onChange={(e) => setSaveName(e.target.value)}
              placeholder="Digite o nome..."
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              onKeyPress={(e) => e.key === 'Enter' && handleSave()}
              autoFocus
            />
          </div>
          <div className="flex gap-2 justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              disabled={!saveName.trim()}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              Salvar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}