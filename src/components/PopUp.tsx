import React from 'react';
import { X, AlertCircle } from 'lucide-react';

interface PopupProps {
  isOpen: boolean;
  onClose: () => void;
  message: string;
}

const PopUp: React.FC<PopupProps> = ({ isOpen, onClose, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center z-50" onClick={onClose}>
      <div className="bg-background rounded-lg p-6 max-w-md w-full relative animate-pulse" onClick={(e) => e.stopPropagation()}>
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-on-surface hover:text-error hover:bg-surface rounded-full p-1 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-secondary-container"
          aria-label="Fechar popup"
        >
          <X size={24} />
        </button>
        
        <div className="flex items-center mb-4">
          <AlertCircle className="text-error mr-3" size={24} />
          <h3 className="text-lg font-semibold text-heading">Atenção!</h3>
        </div>
        
        <p className="text-text mb-6">{message}</p>
      </div>
    </div>
  );
};

export default PopUp;