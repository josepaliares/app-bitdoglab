import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft } from "lucide-react";
import React from "react";

const colorData = {
  title: "Como o LED recebe a cor?",
  description: "Você define três valores de cor",
  colorChannels: [
    { name: "R = Vermelho", range: "(0 a 255)" },
    { name: "G = Verde", range: "(0 a 255)" },
    { name: "B = Azul", range: "(0 a 255)" },
  ],
  example: {
    r: 227,
    g: 26,
    b: 139,
    code: "matriz_led[y][x] = (RGB)",
  },
  conclusion: "Assim, você programa a cor do LED!",
  callToAction: "Teste você mesmo!",
};

export default function LgicaSeleoCor() {
  return (
    <div className="flex justify-center w-full bg-white">
      <div className="relative w-[400px] h-[866px] bg-themelighton-primary flex flex-col items-center">
        {/* Back button */}
        <Button
          variant="ghost"
          className="absolute top-6 left-6 w-[50px] h-[50px] p-0 rounded-full bg-themelightprimary"
        >
          <ChevronLeft className="text-themelightbackground text-4xl" />
        </Button>

        {/* Title */}
        <h1 className="mt-[53px] font-fonte-principal text-[length:var(--fonte-principal-font-size)] font-[number:var(--fonte-principal-font-weight)] text-themelightheading text-center tracking-[var(--fonte-principal-letter-spacing)] leading-[var(--fonte-principal-line-height)]">
          Como o LED <br />
          recebe a cor?
        </h1>

        {/* Main content */}
        <div className="mt-[120px] mx-4 w-[363px]">
          <p className="font-fonte-texto text-[length:var(--fonte-texto-font-size)] font-[number:var(--fonte-texto-font-weight)] text-black tracking-[var(--fonte-texto-letter-spacing)] leading-[var(--fonte-texto-line-height)]">
            {colorData.description}
            <br />
            <br />
            {colorData.colorChannels.map((channel, index) => (
              <React.Fragment key={index}>
                {channel.name}
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                {index === 0
                  ? ""
                  : index === 1
                    ? "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"
                    : "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"}
                {channel.range}
                <br />
              </React.Fragment>
            ))}
          </p>

          {/* Example card */}
          <Card className="mt-8 bg-themelightsurface rounded-[10px]">
            <CardContent className="pt-5">
              <p className="font-fonte-texto text-[length:var(--fonte-texto-font-size)] font-[number:var(--fonte-texto-font-weight)] text-black tracking-[var(--fonte-texto-letter-spacing)] leading-[var(--fonte-texto-line-height)]">
                R = {colorData.example.r}
                <br />G = {colorData.example.g}
                <br />B = {colorData.example.b}
                <br />
                <br />
                {colorData.example.code}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Color sample */}
        <div
          className="w-[60px] h-[60px] mt-8 bg-themelightsecondary rounded-[10px]"
          style={{
            backgroundColor: `rgb(${colorData.example.r}, ${colorData.example.g}, ${colorData.example.b})`,
          }}
        />

        {/* Conclusion */}
        <p className="mt-5 font-fonte-texto text-[length:var(--fonte-texto-font-size)] font-[number:var(--fonte-texto-font-weight)] text-black text-center tracking-[var(--fonte-texto-letter-spacing)] leading-[var(--fonte-texto-line-height)]">
          {colorData.conclusion}
        </p>

        {/* Call to action */}
        <p className="mt-16 font-text-xl text-[length:var(--text-xl-font-size)] font-[number:var(--text-xl-font-weight)] text-themelighton-primary text-center tracking-[var(--text-xl-letter-spacing)] leading-[var(--text-xl-line-height)]">
          {colorData.callToAction}
        </p>
      </div>
    </div>
  );
}
