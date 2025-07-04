// LoadManageModal.tsx
import { useState, useEffect } from "react";
import { X, Trash2, Edit2, Play } from "lucide-react";

interface SaveData {
  id: string;
  name: string;
  data: any;
  createdAt: string;
}

interface LoadManageModalProps {
  isOpen: boolean;
  onClose: () => void;
  storageKey: string;
  onLoad?: (data: any) => void;
  title?: string;
}

export default function LoadManageModal({
  isOpen,
  onClose,
  storageKey,
  onLoad,
  title = "Gerenciar Gravações"
}: LoadManageModalProps) {
  const [saves, setSaves] = useState<SaveData[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");

  // Carregar saves do localStorage
  useEffect(() => {
    if (isOpen) {
      const savedData = localStorage.getItem(storageKey);
      if (savedData) {
        try {
          setSaves(JSON.parse(savedData));
        } catch (error) {
          console.error('Erro ao carregar saves:', error);
          setSaves([]);
        }
      }
    }
  }, [isOpen, storageKey]);

  // Salvar no localStorage
  const updateSaves = (newSaves: SaveData[]) => {
    setSaves(newSaves);
    localStorage.setItem(storageKey, JSON.stringify(newSaves));
  };

  // Carregar gravação
  const handleLoad = (save: SaveData) => {
    if (onLoad) {
      onLoad(save.data);
    }
    onClose();
  };

  // Excluir gravação
  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja excluir esta gravação?')) {
      const newSaves = saves.filter(save => save.id !== id);
      updateSaves(newSaves);
    }
  };

  // Renomear gravação
  const handleRename = (id: string) => {
    if (!editName.trim()) return;
    
    const newSaves = saves.map(save => 
      save.id === id ? { ...save, name: editName.trim() } : save
    );
    updateSaves(newSaves);
    setEditingId(null);
    setEditName("");
  };

  // Iniciar edição
  const startEdit = (save: SaveData) => {
    setEditingId(save.id);
    setEditName(save.name);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[80vh] overflow-y-auto m-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-2">
          {saves.length === 0 ? (
            <p className="text-gray-500 text-center py-4">
              Nenhuma gravação encontrada
            </p>
          ) : (
            saves.map((save) => (
              <div
                key={save.id}
                className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
              >
                <div className="flex-1">
                  {editingId === save.id ? (
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="w-full px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') handleRename(save.id);
                        if (e.key === 'Escape') {
                          setEditingId(null);
                          setEditName("");
                        }
                      }}
                      onBlur={() => handleRename(save.id)}
                      autoFocus
                    />
                  ) : (
                    <div>
                      <div className="font-medium">{save.name}</div>
                      <div className="text-sm text-gray-500">{save.createdAt}</div>
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleLoad(save)}
                    className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 flex items-center gap-1"
                    title="Carregar"
                  >
                    <Play className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => startEdit(save)}
                    className="p-1 text-blue-500 hover:text-blue-700"
                    title="Renomear"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(save.id)}
                    className="p-1 text-red-500 hover:text-red-700"
                    title="Excluir"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}