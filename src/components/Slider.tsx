import React from "react";

export type SliderVariant =
  | "red"
  | "green"
  | "blue"
  | "default"
  | "pianoTones";

interface SliderProps {
  value: number;
  onChange: (value: number) => void;
  label?: string;
  variant?: SliderVariant;
  min?: number;
  max?: number;
  step?: number;
  width?: string;
  showValue?: boolean;
  customTrackClass?: string;
  customThumbClass?: string;
}

const Slider: React.FC<SliderProps> = ({
  value,
  onChange,
  label,
  variant = "default",
  min,
  max,
  step,
  width = "w-[250px]",
  showValue = true,
  customThumbClass,
  customTrackClass,
}) => {
  if (variant === "pianoTones") {
    const minVal = 1;
    const maxVal = 7;
    const stepVal = 1;
    const labels = ["1", "2", "3", "4", "5", "6", "7"];


    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange(parseInt(e.target.value));
    };

    return (
      <div className="flex flex-col items-center w-full max-w-[250px]">
        {/* Labels alinhadas com o slider */}
        <div className="flex justify-between w-full mb-1 text-sm text-muted-foreground">
          {labels.map((label, index) => (
            <span key={index} className="text-center w-4">
              {label}
            </span>
          ))}
        </div>

        {/* Slider com texto Grave e Agudo */}
        <div className="flex flex-row items-center gap-2">
          <span className="text-ubuntu font-medium text-md">Grave</span>

          <input
            type="range"
            min={minVal}
            max={maxVal}
            step={stepVal}
            value={value}
            onChange={handleChange}
            className={`${width} h-[10px] rounded-lg appearance-none outline-none cursor-pointer ${
              customTrackClass ?? "bg-gray-300"
            } ${customThumbClass ?? ""}`}
            aria-label="Buzzer 7 steps slider"
          />

          <span className="text-ubuntu font-medium text-md">Agudo</span>

          {/* Valor numérico */}
          {showValue && (
            <span className="ml-2 font-ubuntu text-md">{value}</span>
          )}
        </div>
      </div>
    );
  }

  const finalMin = min ?? 0;
  const finalMax = max ?? 255;
  const finalStep = step ?? 1;

  const getDefaultLabel = () => {
    switch (variant) {
      case "red":
        return "R";
      case "green":
        return "G";
      case "blue":
        return "B";
      default:
        return "";
    }
  };

  const displayLabel = label ?? getDefaultLabel();

  const getTrackGradient = () => {
    switch (variant) {
      case "red":
        return "bg-gradient-to-r from-black to-rgb-red";
      case "green":
        return "bg-gradient-to-r from-black to-rgb-green";
      case "blue":
        return "bg-gradient-to-r from-black to-rgb-blue";
      default:
        return "bg-gray-30";
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(parseFloat(event.target.value));
  };

  const getAriaLabel = () => {
    if (label) return `${label} slider`;
    return `${variant} slider`;
  };

  return (
    <div className="flex items-center gap-3 mt-2">
      {displayLabel && (
        <label className="w-6 text-right font-medium font-ubuntu text-md">
          {displayLabel}:
        </label>
      )}
      <input
        type="range"
        value={value}
        onChange={handleChange}
        min={finalMin}
        max={finalMax}
        step={finalStep}
        className={`${width} h-[10px] rounded-lg appearance-none outline-none cursor-pointer ${getTrackGradient()} ${
          customThumbClass ?? ""
        }`}
        aria-label={getAriaLabel()}
      />
      {showValue && <span className="w-8 text-left">{value}</span>}
    </div>
  );
};

export default Slider;
