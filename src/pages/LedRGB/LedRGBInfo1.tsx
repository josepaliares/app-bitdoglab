import { Header } from "@/components/Header";
import Led from "@/assets/imgs/Led.png";

export default function LedRGBInfo1(): React.ReactElement {
  return(
    <>
      <Header
        title=""
        showIdeaButton={false}
      />
      <div className="h-screen flex flex-col items-center gap-3.5">
        <h2 className="text-ubuntu tx-bl font-medium text-lg mb-1">Como o LED recebe a cor?</h2>
        <p className="text-ubuntu font-small text-lg mb-1 text-center">Você define 3 valores de cor.</p>
        <p className="text-ubuntu font-small text-lg mb-1 text-center">R = Vermelho(Red)  (0 a 255)</p>
        <p className="text-ubuntu font-small text-lg mb-1 text-center">G = Verde(Green)  (0 a 255)</p>
        <p className="text-ubuntu font-small text-lg mb-1 text-center">B = Azul(Bluer)  (0 a 255)</p>
        <div className="items-center p-4 rounded-lg bg-gray-300">
            <p>R = 227</p>
            <p>G = 26</p>
            <p>B = 139</p>
            <p>ledRGB = rgb(R, G, B)</p>
        </div>
        <p className="text-ubuntu font-small text-lg mb-1 text-center">Assim você programa a cor do LED!</p>
        <img
            src={Led} 
            alt="imagem Led"
            className="block mx-auto "
        />
      </div>
    </>
  );
}