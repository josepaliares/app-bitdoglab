import { useState } from "react";

interface DropdownSelectorOption {
  id: string;
  label: string;
}

interface DropdownSelectorProps {
  options: DropdownSelectorOption[];
  placeholder?: string;
  onSelect: (value: string) => void;
  value: string;
  className?: string;
}

/**
 * DropdownSelector - Renders a customizable Dropdown select component
 * 
 * @param {DropdownSelectorProps} props - Component properties
 * @returns {JSX.Element} - The rendered dropdown component
 */
const DropdownSelector: React.FC<DropdownSelectorProps> = ({
  options,
  placeholder = "Selecione uma opção",
  onSelect,
  value,
  className = ""
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (option: string) => {
    onSelect(option);
    setIsOpen(false);
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const getDisplayText = (): string => {
    if (value) {
      return options.find(option => option.id === value)?.label || "";
    }
    return placeholder;
  };

  return (
    <div className={`relative ${className || ''}`}>
      <div
        onClick={toggleDropdown}
        className="w-full px-4 py-3 bg-white border border-gray-300 rounded cursor-pointer flex justify-between items-center hover:border-gray-400 transition-colors"
      >
        <span className={value ? "text-gray-900" : "text-gray-500"}>
          {getDisplayText()}
        </span>
        <svg
          className={`w-4 h-4 transform transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded shadow-lg z-10">
          {options.map((option) => (
            <div
              key={option.id}
              onClick={() => handleSelect(option.id)}
              className="px-4 py-3 hover:bg-blue-500 hover:text-white cursor-pointer transition-colors text-gray-700 border-b border-gray-200 last:border-b-0"
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DropdownSelector;