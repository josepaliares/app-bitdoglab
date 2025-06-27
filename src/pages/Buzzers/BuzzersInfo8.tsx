import { Header } from "@/components/Header";
import music from "@/assets/imgs/music.png";
import send from "@/assets/imgs/send.png";
import list from "@/assets/imgs/icone_lista.png";

export default function BuzzersInfo8(): React.ReactElement {
  return(
    <>
      <Header
        title=""
        showIdeaButton={false}
      />
      <div className="h-screen flex flex-col items-center gap-3.5">
        <h2 className="text-ubuntu tx-bl font-medium text-lg mb-1"> Placa reproduz sequência gravada</h2>
        <div className="flex items-center gap-2 mx-2">
           <img src={send} alt="imagem Leds" className="block mx-auto "/> 
            <p className="text-ubuntu text-text font-medium text-md mb-1">O app envia para a placa um arquivo  com a lista de notas e tempos gravados.</p>
        </div>
        <div className="flex items-center gap-2 mx-2">
            <img src={list} alt="imagem Leds" className="block mx-auto "/> 
            <p className="text-ubuntu text-text font-medium text-md mb-1">Ela percorre essa lista do começo ao fim: para cada item, a placa envia o comando para o buzzer tocar a nota.</p>
        </div>
        <div className="flex items-center gap-2 mx-2">
            <img src={music} alt="imagem Leds" className="block mx-auto "/> 
            <p className="text-ubuntu text-text font-medium text-md mb-1">Assim, a sequência é tocada com o mesmo ritmo e ordem em que foi gravada.</p>
        </div>
        <div className="items-center p-4 rounded-lg bg-gray-300">
            <p className="text-ubuntu text-text font-medium text-md mb-1">para cada (nota, tempo) em lista_de_notas:</p>
            <p className="text-ubuntu text-text font-medium text-md mb-1 mx-2">tocar(nota)</p>
            <p className="text-ubuntu text-text font-medium text-md mb-1 mx-2">esperar(tempo)</p>
        </div>
      </div>
    </>
  );
}