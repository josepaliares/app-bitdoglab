import { Header } from "@/components/Header";
import binaryCode from "@/assets/imgs/binaryCode.png";
import CorExemplo from "@/assets/imgs/CorExemplo.png";
import Led from "@/assets/imgs/Led.png";
import Leds from "@/assets/imgs/Leds.png";
import Plaquinha from "@/assets/imgs/Plaquinha.png";

export default function NeopixelInfo4(): React.ReactElement {
  return(
    <>
      <Header
        title=""
        showIdeaButton={false}
      />
      <div className="h-screen flex flex-col items-center gap-4">
        <h2 className="text-ubuntu tx-bl font-medium text-lg mb-1">Como os LEDs mudam de cor?</h2>
        <div className="flex itens-center gap-2 mx-2">
           <img 
              src={Leds} 
              alt="imagem conexao"
              className="block mx-auto "
            /> 
            <p className="text-ubuntu font-medium text-md mb-1">O comando enviado contém as coordenadas (x, y) do LED e os valores de cor (R, G, B).</p>
        </div>
        <div className="flex itens-center gap-1 mx-2">
           <img 
              src={binaryCode} 
              alt="imagem conexao"
              className="block mx-auto "
            /> 
            <p className="text-ubuntu font-medium text-md mb-1">Esse comando é transformado em linguagem de máquina, que é um código binário que o hardware da placa entende.</p>
        </div>
        <div className="flex itens-center gap-2 mx-2">
           <img 
              src={Plaquinha} 
              alt="imagem conexao"
              className="block mx-auto "
            /> 
            <p className="text-ubuntu font-medium text-md mb-1">A placa interpreta essa linguagem para saber qual LED deve acender e qual cor ele deve mostrar.</p>
        </div>
        <div className="flex itens-center gap-2 mx-2">
           <img 
              src={CorExemplo} 
              alt="imagem conexao"
              className="block mx-auto "
            /> 
            <p className="text-ubuntu font-medium text-md mb-1">Por exemplo, o comando com cor (227, 26, 139) vira uma sequência de bits que programa o LED para essa cor.</p>
        </div>
        <div className="flex itens-center gap-2 mx-2">
           <img 
              src={Led} 
              alt="imagem conexao"
              className="block mx-auto "
            /> 
            <p className="text-ubuntu font-medium text-md mb-1">Assim, o LED recebe e executa o comando, acendendo na cor desejada.</p>
        </div>
      </div>
    </>
  );
}