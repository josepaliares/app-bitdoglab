import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft } from "lucide-react";
import React from "react";

const LgicaEnvio = () => {
  // Data for the code example
  const codeExample = [
    "x = 2",
    "y = 3",
    "cor = (227,26,139)",
    "comando = pintar led (x, y, cor)",
    "",
    "enviar_para_placa(comando)",
  ];

  return (
    <div className="flex justify-center w-full bg-white">
      <div className="relative w-[400px] h-[866px] bg-themelighton-primary">
        {/* Header section with back button and title */}
        <header className="px-5 pt-[25px]">
          <div className="relative flex items-center mb-7">
            <Button
              variant="outline"
              size="icon"
              className="w-[50px] h-[50px] rounded-full bg-themelightprimary p-0 border-none"
            >
              <ChevronLeft className="text-themelightbackground text-4xl" />
            </Button>

            <h1 className="absolute w-full text-center font-fonte-principal font-bold text-themelightheading text-[36px] leading-normal mt-7">
              O que acontece <br />
              ao clicar em Enviar?
            </h1>
          </div>
        </header>

        {/* Main content */}
        <main className="px-5">
          {/* Explanation text */}
          <div className="mb-8 font-fonte-texto text-[25px] text-black text-justify leading-normal">
            O app reúne tudo o que você escolheu:
            <br />
            <span className="ml-6">║</span> <br />- Qual LED{" "}
            <span className="ml-24">║</span> <br />- Qual cor{" "}
            <span className="ml-24">║</span> <span className="ml-24">║</span>{" "}
            <span className="ml-24">║</span> <br />
            Monta uma mensagem de controle e envia para a placa via cabo ou
            Bluetooth.
          </div>

          {/* Code example card */}
          <Card className="w-full bg-themelightsurface rounded-[10px] border-none">
            <CardContent className="p-5">
              <pre className="font-fonte-texto text-[25px] text-black leading-normal">
                {codeExample.map((line, index) => (
                  <React.Fragment key={index}>
                    {line}
                    {line &&
                    line !== "enviar_para_placa(comando)" &&
                    line !== "" ? (
                      <span className="ml-8">║</span>
                    ) : null}
                    {index < codeExample.length - 1 && <br />}
                  </React.Fragment>
                ))}
              </pre>
            </CardContent>
          </Card>

          {/* Footer text */}
          <p className="mt-8 text-center font-fonte-texto text-[25px] text-black leading-normal">
            Assim, o LED recebe o comando e acende!
          </p>
        </main>
      </div>
    </div>
  );
};

export default LgicaEnvio;
