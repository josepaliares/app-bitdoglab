import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowDown, ChevronLeft, Lightbulb } from "lucide-react";
import React from "react";

export default function FluxoNeoPixel() {
  // Data for the steps to improve maintainability
  const steps = [
    {
      id: 1,
      title: "Selecione as cores dos LEDS",
      icon: "hand",
    },
    {
      id: 2,
      title: 'Clica em "Enviar"',
      buttonText: "Enviar",
    },
    {
      id: 3,
      title: "Placa recebe via cabo ou Bluetooth",
      icon: "bluetooth",
    },
    {
      id: 4,
      title: "LED (x, y) muda para a cor selecionada",
      hasGradient: true,
    },
  ];

  return (
    <main className="bg-transparent flex flex-row justify-center w-full">
      <div className="overflow-x-hidden w-[400px] h-[866px]">
        <section className="relative h-[866px] -top-px left-px bg-themelighton-secondary">
          {/* Back button */}
          <Button
            variant="outline"
            className="absolute w-[50px] h-[50px] top-[26px] left-6 p-0 rounded-full bg-themelightprimary border-none"
          >
            <ChevronLeft className="h-8 w-8 text-themelightbackground" />
          </Button>

          {/* Bottom CTA button */}
          <div className="absolute w-[363px] h-[60px] top-[748px] left-[23px]">
            <Button className="absolute w-[348px] h-[60px] top-0 left-[3px] bg-themelightsecondary rounded-[10px] shadow-[0px_4px_4px_#00000040] text-xl">
              <span className="font-text-xl text-themelighton-secondary">
                Como funciona o RGB?
              </span>
            </Button>
          </div>

          {/* Title and icon */}
          <div className="absolute top-[156px] left-[72px] font-fonte-principal text-themelightheading text-[length:var(--fonte-principal-font-size)] text-center tracking-[var(--fonte-principal-letter-spacing)] leading-[var(--fonte-principal-line-height)] whitespace-nowrap">
            Como funciona?
          </div>

          <div className="absolute w-[74px] h-[98px] top-11 left-[157px]">
            <Lightbulb className="w-full h-full text-themelightheading" />
          </div>

          {/* Steps */}
          {steps.map((step, index) => (
            <React.Fragment key={step.id}>
              {/* Step number circle */}
              <div
                className="absolute w-[55px] h-[55px] top-[231px] left-2 translate-y-[100px] md:translate-y-0"
                style={{ top: `${231 + index * 100}px` }}
              >
                <div className="relative w-[55px] h-[55px] bg-[#d9d9d91c] rounded-[27.5px] border-2 border-solid border-themelightborder flex items-center justify-center">
                  <span className="[-webkit-text-stroke:1px_#000000] font-text-xl text-themelighttext text-[length:var(--text-xl-font-size)] tracking-[var(--text-xl-letter-spacing)] leading-[var(--text-xl-line-height)] whitespace-nowrap border-themelighttext">
                    {step.id}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <ArrowDown className="absolute w-[15px] h-[31px] top-[59px] left-[21px]" />
                )}
              </div>

              {/* Step content card */}
              <Card
                className={`absolute w-[312px] h-[86px] rounded-lg border-2 border-solid border-themelightborder`}
                style={{
                  top: `${227 + index * 102}px`,
                  left: index === 0 ? "69px" : "69px",
                }}
              >
                <CardContent className="p-0 h-full flex items-center">
                  {/* Step 1 - Hand icon */}
                  {step.id === 1 && (
                    <div className="w-[69px] h-[69px] ml-[5px] mt-[7px]">
                      <img
                        src=""
                        alt="Hand icon"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  {/* Step 2 - Send button */}
                  {step.id === 2 && (
                    <div className="w-[133px] h-[45px] ml-10 mt-[19px]">
                      <Button className="w-[78px] h-[45px] bg-themelightsecondary rounded-[10px] shadow-[0px_4px_4px_#00000040]">
                        <span className="[font-family:'Ubuntu-Bold',Helvetica] font-bold text-themelighton-secondary text-xl">
                          {step.buttonText}
                        </span>
                      </Button>
                    </div>
                  )}

                  {/* Step 3 - Bluetooth and USB icons */}
                  {step.id === 3 && (
                    <div className="flex ml-[30px]">
                      <img
                        src=""
                        alt="USB cable"
                        className="w-[70px] h-[70px] object-cover"
                      />
                      <img
                        src=""
                        alt="Bluetooth"
                        className="w-[52px] h-[83px] object-cover"
                      />
                    </div>
                  )}

                  {/* Step 4 - Gradient box */}
                  {step.id === 4 && (
                    <div className="w-[60px] h-[60px] ml-[7px] rounded-[10px] [background:linear-gradient(205deg,rgba(227,26,139,1)_0%,rgba(63,132,175,1)_100%)]"></div>
                  )}

                  {/* Step text */}
                  <div
                    className={`font-fonte-texto text-themelighttext text-[length:var(--fonte-texto-font-size)] tracking-[var(--fonte-texto-letter-spacing)] leading-[var(--fonte-texto-line-height)] ${
                      step.id === 1
                        ? "ml-[74px] mt-[18px]"
                        : step.id === 2
                          ? "ml-[153px] mt-[27px]"
                          : step.id === 3
                            ? "ml-[137px] mt-[11px]"
                            : "ml-[79px] mt-[2.5px]"
                    }`}
                  >
                    {step.title}
                  </div>
                </CardContent>
              </Card>
            </React.Fragment>
          ))}
        </section>
      </div>
    </main>
  );
}
