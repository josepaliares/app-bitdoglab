import { Header } from "@/components/Header";
import MatrizLed from "@/assets/imgs/MatrizLed.png";

export default function NeopixelInfo1(): React.ReactElement {
  return(
    <>
      <Header
        title=""
        showIdeaButton={false}
      />
      <div className="h-screen flex flex-col items-center gap-3.5">
        <h2 className="text-ubuntu tx-bl font-medium text-lg mb-1">Entendendo posição e pintura</h2>
        <p className="text-ubuntu font-small text-lg mb-1 text-center">Cada LED é como um célula em uma matriz.</p>
        <p className="text-ubuntu font-small text-lg mb-1 text-center"> Ao tocá-lo você escolhe a posição (x,y) para controlar a cor desse LED.</p>
        <img 
          src={MatrizLed} 
          alt="imagem matriz led"
          className="block mx-auto "
        />
        <div className="items-center p-4 rounded-lg bg-gray-300">
            <p>leds = matriz(5,5)</p>
            <p>x = 3</p>
            <p>y = 1</p>
            <p>leds[x][y] = rgb(227,26,139)</p>
        </div>
      </div>
    </>
  );
}