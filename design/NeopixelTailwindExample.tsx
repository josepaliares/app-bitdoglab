// Exemplo de tela Neopixel estilizada com Tailwind, para estudos de design
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { ChevronLeft, Lightbulb } from "lucide-react";
import React, { useState } from "react";
import "./design-tokens.css";

export default function NeoPixelTailwindExample() {
  const [selectedLed, setSelectedLed] = useState<{x:number, y:number}|null>(null);
  const [rgbValues, setRgbValues] = useState({ r: 50, g: 150, b: 150 });
  const gridSize = 5;
  const gridData = Array.from({ length: gridSize }, (_, y) =>
    Array.from({ length: gridSize }, (_, x) => ({ x, y }))
  ).reverse();

  const handleLedSelect = (x:number, y:number) => setSelectedLed({ x, y });
  const handleColorChange = (color:string, value:number[]) => setRgbValues((prev) => ({ ...prev, [color]: value[0] }));
  const handleClear = () => {
    setSelectedLed(null);
    setRgbValues({ r: 0, g: 0, b: 0 });
  };

  return (
    <div className="bg-transparent flex flex-row justify-center w-full min-h-screen items-center">
      <Card className="w-[400px] overflow-hidden border-none shadow-none">
        <CardContent className="p-0">
          {/* Header */}
          <div className="flex items-center p-4 relative">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full bg-primary-30 text-white h-10 w-10"
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
            <h1 className="text-center font-bold text-2xl absolute left-0 right-0" style={{fontFamily:'var(--fonte-principal-font-family)', fontWeight:700}}>
              NeoPixel
            </h1>
            <div className="ml-auto">
              <Lightbulb className="h-6 w-6" />
            </div>
          </div>

          {/* Subtitle */}
          <div className="text-center px-4 mb-6">
            <p className="font-fonte-texto text-lg" style={{fontFamily:'var(--fonte-texto-font-family)'}}>
              Selecione um dos 25 LEDS<br />e regule a cor conforme desejar
            </p>
          </div>

          {/* LED Grid */}
          <div className="px-4 mb-6">
            <div className="flex">
              {/* Y-axis labels */}
              <div className="flex flex-col justify-around mr-2 h-[250px]">
                {[4, 3, 2, 1, 0].map((y) => (
                  <span key={"y-"+y} className="text-xl font-medium">{y}</span>
                ))}
              </div>
              {/* LED Grid */}
              <div className="flex-1">
                {gridData.map((row, rowIndex) => (
                  <div key={"row-"+rowIndex} className="flex mb-1">
                    {row.map((cell) => (
                      <button
                        key={`cell-${cell.x}-${cell.y}`}
                        className={`w-12 h-12 m-1 rounded-full bg-neutral-40 border ${selectedLed && selectedLed.x === cell.x && selectedLed.y === cell.y ? "ring-2 ring-secondary-30" : ""}`}
                        style={selectedLed && selectedLed.x === cell.x && selectedLed.y === cell.y ? {boxShadow:'0 0 0 4px var(--secondary-30)'} : {}}
                        onClick={() => handleLedSelect(cell.x, cell.y)}
                      />
                    ))}
                  </div>
                ))}
              </div>
            </div>
            {/* X-axis labels */}
            <div className="flex justify-around ml-8 mt-2">
              {[0, 1, 2, 3, 4].map((x) => (
                <span key={"x-"+x} className="text-xl font-medium">{x}</span>
              ))}
            </div>
            <div className="text-center mt-2">
              <span className="text-xl font-medium">X</span>
            </div>
          </div>

          {/* Selected LED info */}
          <div className="px-4 mb-4">
            <p className="text-xl font-bold" style={{fontFamily:'var(--fonte-texto-font-family)'}}>
              LED selecionado: {selectedLed ? `(${selectedLed.x}, ${selectedLed.y})` : ""}
            </p>
          </div>

          {/* RGB Sliders */}
          <div className="px-4 space-y-6 mb-6">
            {/* Red Slider */}
            <div className="flex items-center">
              <span className="w-6 font-bold">R</span>
              <Slider
                defaultValue={[rgbValues.r]}
                max={255}
                step={1}
                className="flex-1 mx-2"
                onValueChange={(value) => handleColorChange("r", value)}
                trackClassName="bg-red-500 h-2"
              />
              <span className="w-10 text-right">255</span>
            </div>
            {/* Green Slider */}
            <div className="flex items-center">
              <span className="w-6 font-bold">G</span>
              <Slider
                defaultValue={[rgbValues.g]}
                max={255}
                step={1}
                className="flex-1 mx-2"
                onValueChange={(value) => handleColorChange("g", value)}
                trackClassName="bg-green-500 h-2"
              />
              <span className="w-10 text-right">255</span>
            </div>
            {/* Blue Slider */}
            <div className="flex items-center">
              <span className="w-6 font-bold">B</span>
              <Slider
                defaultValue={[rgbValues.b]}
                max={255}
                step={1}
                className="flex-1 mx-2"
                onValueChange={(value) => handleColorChange("b", value)}
                trackClassName="bg-blue-500 h-2"
              />
              <span className="w-10 text-right">255</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="px-4 flex justify-between mb-6">
            <Button
              variant="outline"
              className="border-2 border-secondary-30 text-secondary-30 font-bold text-xl px-8 py-6 rounded-xl"
              onClick={handleClear}
            >
              Limpar
            </Button>
            <Button className="bg-secondary-30 text-white font-bold text-xl px-8 py-6 rounded-xl">
              Enviar
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
