import { useState, type SetStateAction } from "react";

interface SelecterOption {
  id: string;
  label: string;
}

interface SelecterProps {
  options: SelecterOption[];
}

/**
 *  - Renders a customizable bottuns select component
 * 
 * @param {SelecterProps} props - Component properties
 * @returns {JSX.Element} - The rendered dropdown component
 */
const Selecter: React.FC<SelecterProps> = ({
  options
}) => {
  const [selectedComponent, setSelectedComponent] = useState("");

  const handleSelect = (componentId: SetStateAction<string>) => {
    setSelectedComponent(componentId);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
        {options.map((component) => (
          <div
            key={component.id}
            onClick={() => handleSelect(component.id)}
            className={`
              p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 hover:shadow-md
              ${selectedComponent === component.id
                ? 'border-blue-500 bg-blue-50 shadow-md transform scale-105'
                : 'border-gray-200 bg-white hover:border-gray-300'
              }
            `}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className={`text-lg font-semibold ${
                  selectedComponent === component.id ? 'text-blue-700' : 'text-gray-800'
                }`}>
                  {component.label}
                </h3>
              </div>
              
              <div className={`
                w-5 h-5 rounded-full border-2 flex items-center justify-center
                ${selectedComponent === component.id
                  ? 'border-blue-500 bg-blue-500'
                  : 'border-gray-300'
                }
              `}>
                {selectedComponent === component.id && (
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                )}
              </div>
            </div>
          </div>
        ))}
    </div>
  );
};

export default Selecter;