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
  width?: string;
  height?: string;
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
  className = "",
  width = "w-64", // Largura padrão (256px)
  height = "h-10" // Altura padrão (48px)
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
        className={`${width} ${height} px-4 py-3 bg-background border border-neutral-palette-30 rounded cursor-pointer flex justify-between items-center hover:border-neutral-palette-20 transition-colors`}
      >
        <span className={value ? "text-text" : "text-neutral-palette-20"}>
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
        <div className="absolute top-full left-0 right-0 mt-1 bg-background border border-neutral-palette-30 rounded shadow-lg z-10">
          {options.map((option) => (
            <div
              key={option.id}
              onClick={() => handleSelect(option.id)}
              className="px-4 py-3 hover:bg-primary hover:text-on-primary cursor-pointer transition-colors text-text border-b border-neutral-palette-30 last:border-b-0"
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