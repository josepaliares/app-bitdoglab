import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft } from "lucide-react";
import React from "react";

// Data for the LED grid
const gridSize = 5;
const selectedLed = { x: 3, y: 1 };

// Create arrays for X and Y coordinates
const xCoordinates = Array.from({ length: gridSize }, (_, i) => i);
const yCoordinates = Array.from(
  { length: gridSize },
  (_, i) => gridSize - i - 1,
);

export default function LgicaSeleoNoLed() {
  return (
    <div className="bg-white flex flex-row justify-center w-full">
      <div className="bg-themelighton-primary w-[400px] h-[866px] relative">
        {/* Header section */}
        <header className="absolute w-[329px] h-[110px] top-[25px] left-[25px]">
          <h1 className="absolute top-7 left-[35px] font-fonte-principal font-[number:var(--fonte-principal-font-weight)] text-themelightheading text-[length:var(--fonte-principal-font-size)] text-center tracking-[var(--fonte-principal-letter-spacing)] leading-[var(--fonte-principal-line-height)] [font-style:var(--fonte-principal-font-style)]">
            Entendendo <br />
            posição e pintura
          </h1>

          <Button
            variant="default"
            className="absolute w-[50px] h-[50px] top-0 left-0 p-0 bg-themelightprimary rounded-[25px]"
          >
            <ChevronLeft className="h-8 w-8 text-themelightbackground" />
          </Button>
        </header>

        {/* LED Selection Label */}
        <div className="absolute top-[217px] left-[238px] font-fonte-texto font-[number:var(--fonte-texto-font-weight)] text-black text-[length:var(--fonte-texto-font-size)] text-center tracking-[var(--fonte-texto-letter-spacing)] leading-[var(--fonte-texto-line-height)] [font-style:var(--fonte-texto-font-style)]">
          LED
          <br />
          &nbsp;&nbsp;selecionado <br />
          (3,1)
        </div>

        {/* LED Grid */}
        <div className="absolute w-[188px] h-[199px] top-[157px] left-[49px]">
          {yCoordinates.map((y, rowIndex) => (
            <div
              key={`row-${y}`}
              className="absolute w-[188px] h-[33px] top-[${rowIndex * 41}px] left-0"
            >
              {xCoordinates.map((x) => (
                <div
                  key={`led-${x}-${y}`}
                  className={`w-[31px] h-[33px] left-[${x * 39}px] absolute top-0 ${
                    x === selectedLed.x && y === selectedLed.y
                      ? "bg-themedarksecondary"
                      : "bg-themedarkon-surface"
                  }`}
                />
              ))}
            </div>
          ))}
        </div>

        {/* Y-axis labels */}
        {yCoordinates.map((y, index) => (
          <div
            key={`y-label-${y}`}
            className="absolute w-[9px] top-[${162 + (index * 41)}px] left-[35px] font-fonte-texto font-[number:var(--fonte-texto-font-weight)] text-themelighton-surface text-[length:var(--fonte-texto-font-size)] text-center tracking-[var(--fonte-texto-letter-spacing)] leading-[var(--fonte-texto-line-height)] whitespace-nowrap [font-style:var(--fonte-texto-font-style)]"
          >
            {y}
          </div>
        ))}

        {/* X-axis labels */}
        {xCoordinates.map((x) => (
          <div
            key={`x-label-${x}`}
            className="w-[9px] top-[357px] left-[${61 + (x * 39)}px] absolute font-fonte-texto font-[number:var(--fonte-texto-font-weight)] text-themelighton-surface text-[length:var(--fonte-texto-font-size)] text-center tracking-[var(--fonte-texto-letter-spacing)] leading-[var(--fonte-texto-line-height)] whitespace-nowrap [font-style:var(--fonte-texto-font-style)]"
          >
            {x}
          </div>
        ))}

        {/* Axis labels */}
        <div className="absolute w-2.5 top-[378px] left-[137px] font-fonte-texto font-[number:var(--fonte-texto-font-weight)] text-themelighton-surface text-[length:var(--fonte-texto-font-size)] text-center tracking-[var(--fonte-texto-letter-spacing)] leading-[var(--fonte-texto-line-height)] whitespace-nowrap [font-style:var(--fonte-texto-font-style)]">
          X
        </div>

        <div className="absolute w-[9px] top-[245px] left-[17px] font-fonte-texto font-[number:var(--fonte-texto-font-weight)] text-themelighton-surface text-[length:var(--fonte-texto-font-size)] text-center tracking-[var(--fonte-texto-letter-spacing)] leading-[var(--fonte-texto-line-height)] whitespace-nowrap [font-style:var(--fonte-texto-font-style)]">
          Y
        </div>

        {/* Explanation text */}
        <p className="absolute w-[355px] top-[421px] left-[17px] font-fonte-texto font-[number:var(--fonte-texto-font-weight)] text-black text-[length:var(--fonte-texto-font-size)] text-justify tracking-[var(--fonte-texto-letter-spacing)] leading-[var(--fonte-texto-line-height)] [font-style:var(--fonte-texto-font-style)]">
          Cada LED é como um célula em <br />
          uma matriz. Ao tocá-lo você escolhe a posição (x,y) para controlar a
          cor desse LED.
        </p>

        {/* Code example card */}
        <Card className="absolute w-[363px] h-56 top-[572px] left-[17px] rounded-[10px] bg-themelightsurface border-none">
          <CardContent className="p-0">
            <pre className="absolute top-2.5 left-[11px] font-fonte-texto font-[number:var(--fonte-texto-font-weight)] text-black text-[length:var(--fonte-texto-font-size)] tracking-[var(--fonte-texto-letter-spacing)] leading-[var(--fonte-texto-line-height)] [font-style:var(--fonte-texto-font-style)]">
              leds = matriz(5,5)
              <br />
              <br />x = 3<br />y = 1<br />
              <br />
              leds[x][y] = rgb(227,26,139)
            </pre>
          </CardContent>
        </Card>

        {/* Call to action text */}
        <div className="absolute w-[323px] top-[767px] left-[38px] font-text-xl font-[number:var(--text-xl-font-weight)] text-themelighton-primary text-[length:var(--text-xl-font-size)] text-center tracking-[var(--text-xl-letter-spacing)] leading-[var(--text-xl-line-height)] [font-style:var(--text-xl-font-style)]">
          Teste você mesmo!
        </div>
      </div>
    </div>
  );
}
