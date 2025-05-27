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
                ? 'border-blue-500 shadow-md transform scale-105'
                : 'border-gray-200 bg-white hover:border-gray-300'
              }
            `}
            style={{
              borderColor: selectedComponent === component.id ? '#3f84af' : undefined
            }}
          >
            <div className="flex items-center justify-between">
              <div className={`
                w-3 h-3 rounded-full border-2 flex items-center justify-center mr-3
                ${selectedComponent === component.id
                  ? 'border-blue-500'
                  : 'border-gray-300'
                }
              `}
              style={{
                borderColor: selectedComponent === component.id ? '#3f84af' : undefined,
                backgroundColor: selectedComponent === component.id ? '#3f84af' : undefined
              }}>
                {selectedComponent === component.id && (
                  <div className="w-1 h-1 bg-white rounded-full"></div>
                )}
              </div>
              <div className="flex-1">
                <h3 className={`text-md ${
                  selectedComponent === component.id ? 'text-gray-800' : 'text-gray-800'
                }`}
                style={{
                  color: selectedComponent === component.id ? '#3f84af' : undefined
                }}>
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