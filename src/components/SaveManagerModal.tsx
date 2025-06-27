// SaveManagerModal.tsx
import { useState, useEffect } from "react";
import { X, Save, Trash2, Edit2, Play } from "lucide-react";

interface SaveData {
  id: string;
  name: string;
  data: any;
  createdAt: string;
}

interface SaveManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'save' | 'load' | 'manage';
  storageKey: string;
  currentData?: any;
  onLoad?: (data: any) => void;
  title?: string;
}

export default function SaveManagerModal({
  isOpen,
  onClose,
  mode,
  storageKey,
  currentData,
  onLoad,
  title = "Gerenciar Gravações"
}: SaveManagerModalProps) {
  const [saves, setSaves] = useState<SaveData[]>([]);
  const [saveName, setSaveName] = useState("");
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

  // Salvar nova gravação
  const handleSave = () => {
    if (!saveName.trim() || !currentData) return;

    const newSave: SaveData = {
      id: Date.now().toString(),
      name: saveName.trim(),
      data: currentData,
      createdAt: new Date().toLocaleString()
    };

    const newSaves = [...saves, newSave];
    updateSaves(newSaves);
    setSaveName("");
    onClose();
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

  // Método para renderizar o cabeçalho do modal
  const renderModalHeader = () => {
    return (
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">{title}</h2>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    );
  };

  // Método para renderizar o formulário de salvamento
  const renderSaveForm = () => {
    return (
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
    );
  };

  // Método para renderizar mensagem quando não há saves
  const renderEmptyState = () => {
    return (
      <p className="text-gray-500 text-center py-4">
        Nenhuma gravação encontrada
      </p>
    );
  };

  // Método para renderizar um item de save no modo carregar
  const renderLoadItem = (save: SaveData) => {
    return (
      <div
        key={save.id}
        className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
      >
        <div>
          <div className="font-medium">{save.name}</div>
          <div className="text-sm text-gray-500">{save.createdAt}</div>
        </div>
        <button
          onClick={() => handleLoad(save)}
          className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 flex items-center gap-1"
        >
          <Play className="w-4 h-4" />
          Carregar
        </button>
      </div>
    );
  };

  // Método para renderizar lista de saves no modo carregar
  const renderLoadList = () => {
    return (
      <div className="space-y-2">
        {saves.length === 0 ? renderEmptyState() : saves.map(renderLoadItem)}
      </div>
    );
  };

  // Método para renderizar input de edição ou informações do save
  const renderSaveInfo = (save: SaveData) => {
    if (editingId === save.id) {
      return (
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
      );
    }

    return (
      <div>
        <div className="font-medium">{save.name}</div>
        <div className="text-sm text-gray-500">{save.createdAt}</div>
      </div>
    );
  };

  // Método para renderizar botões de ação (editar/excluir)
  const renderActionButtons = (save: SaveData) => {
    return (
      <div className="flex gap-2">
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
    );
  };

  // Método para renderizar um item de save no modo gerenciar
  const renderManageItem = (save: SaveData) => {
    return (
      <div
        key={save.id}
        className="flex items-center justify-between p-3 border rounded-lg"
      >
        <div className="flex-1">
          {renderSaveInfo(save)}
        </div>
        {renderActionButtons(save)}
      </div>
    );
  };

  // Método para renderizar lista de saves no modo gerenciar
  const renderManageList = () => {
    return (
      <div className="space-y-2">
        {saves.length === 0 ? renderEmptyState() : saves.map(renderManageItem)}
      </div>
    );
  };

  // Método para renderizar o conteúdo do modal baseado no modo
  const renderModalContent = () => {
    switch (mode) {
      case 'save':
        return renderSaveForm();
      case 'load':
        return renderLoadList();
      case 'manage':
        return renderManageList();
      default:
        return null;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[80vh] overflow-y-auto m-4">
        {renderModalHeader()}
        {renderModalContent()}
      </div>
    </div>
  );
}