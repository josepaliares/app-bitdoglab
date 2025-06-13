import { useState } from "react";

interface SelecterOption {
  id: string;
  label: string;
}

interface SelecterProps {
  options: SelecterOption[];
  onSelect: (value: string) => void;
  value: string;
}

/**
 * Selecter - Renders a customizable buttons select component
 * 
 * @param {SelecterProps} props - Component properties
 * @returns {JSX.Element} - The rendered dropdown component
 */
const Selecter: React.FC<SelecterProps> = ({
  options,
  onSelect,
  value
}) => {
  const [selectedComponent, setSelectedComponent] = useState(value || "");

  const handleSelect = (componentId: string) => {
    setSelectedComponent(componentId);
    if (onSelect) {
      onSelect(componentId);
    }
  };

  return (
    <div className="space-y-1">
        {options.map((component) => (
          <div
            key={component.id}
            onClick={() => handleSelect(component.id)}
            className={`
              p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 hover:shadow-md
              ${selectedComponent === component.id
                ? 'border-primary shadow-md transform scale-105 bg-primary-container text-on-primary-container'
                : 'border-neutral-palette-30 bg-background hover:border-neutral-palette-20 text-text'
              }
            `}
          >
            <div className="flex items-center justify-between">
              <div className={`
                w-3 h-3 rounded-full border-2 flex items-center justify-center mr-3
                ${selectedComponent === component.id
                  ? 'border-primary bg-primary'
                  : 'border-neutral-palette-30 bg-background'
                }
              `}>
                {selectedComponent === component.id && (
                  <div className="w-1 h-1 bg-on-primary rounded-full"></div>
                )}
              </div>
              <div className="flex-1">
                <h3 className={`text-md font-ubuntu font-medium ${selectedComponent === component.id ? 'text-primary' : 'text-text'}`}>
                  {component.label}
                </h3>
              </div>
              
            </div>
          </div>
        ))}
    </div>
  );
};

export default Selecter;