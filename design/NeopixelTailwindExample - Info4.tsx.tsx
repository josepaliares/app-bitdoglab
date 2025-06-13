import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Bluetooth, ChevronLeft, Smartphone, Usb } from "lucide-react";
import React from "react";

const LgicaPlaca = () => {
  // Data for connection methods
  const connectionMethods = [
    {
      id: 1,
      icon: <Usb className="w-12 h-12" />,
      label: "(via cabo USB)",
    },
    {
      id: 2,
      icon: <Bluetooth className="w-12 h-12" />,
      label: "(via Bluetooth)",
    },
  ];

  // Code example data
  const codeExample = `SE conexao == "USB"
  enviar_pelo_cabo(comando)
SENÃO SE conexao == "Bluetooth"
  enviar_via_bluetooth(comando)`;

  return (
    <div className="flex justify-center w-full bg-white">
      <div className="relative w-[400px] h-[866px] bg-themelightsurface rounded-[16px] shadow-lg">
        {/* Header section with back button and title */}
        <div className="flex items-start mt-12">
          <Button variant="default" size="icon" className="w-[50px] h-[50px] rounded-full bg-themelighthover">
            <ChevronLeft className="h-8 w-8" />
          </Button>
          <h1 className="ml-4 mt-7 font-fonte-principal font-bold text-[32px]">
            Como a placa <br /> recebe o comando?
          </h1>
        </div>

        {/* Main content */}
        <div className="mt-8 font-fonte-texto text-[25px] text-themelighttext px-8">
          Você pode enviar o comando de duas formas:
        </div>

        {/* Connection methods with icons */}
        <div className="mt-8 space-y-12 px-8">
          {connectionMethods.map((method) => (
            <div key={method.id} className="flex items-center">
              <Smartphone className="w-16 h-16" />
              <div className="flex-1 flex items-center justify-center">
                <div className="flex-1 border-2 border-black h-0 mx-2"></div>
                <div className="flex flex-col items-center">
                  {method.icon}
                  <span className="mt-2 font-fonte-texto text-[25px]">{method.label}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Code example card */}
        <Card className="mt-8 bg-themelightsurface rounded-[10px] mx-8">
          <CardContent className="p-4">
            <pre className="font-['Ubuntu-Regular'] text-[22px]">{codeExample}</pre>
          </CardContent>
        </Card>

        {/* Footer text */}
        <div className="absolute bottom-8 left-0 right-0 text-center text-fonte-texto text-[20px] text-themelighttext">
          Assim, o comando chega até a placa!
        </div>
      </div>
    </div>
  );
};

export default LgicaPlaca;
