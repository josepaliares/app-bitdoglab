import { Header } from "@/components/Header";
import notas from "@/assets/imgs/NotasSalvas.png";

export default function BuzzersInfo6(): React.ReactElement {
  return(
    <>
      <Header
        title=""
        showIdeaButton={false}
      />
      <div className="h-screen flex flex-col items-center gap-3.5">
        <h2 className="text-ubuntu tx-bl font-medium text-lg mb-1">Reproduz a sequência gravada</h2>
        <p className="text-ubuntu font-small text-lg mb-1 mx-2 text-start">Ao parar a gravação, o app interrompe o registro de novas notas e tempos.</p>
        <div className="items-center p-4 rounded-lg bg-gray-300">
            <p>ao clicar_parar_gravacao():</p>
            <p className="mx-2">gravando = falso</p>
        </div>
        <p className="text-ubuntu font-small text-lg mb-1 mx-2 text-start">A lista com todas as notas tocadas e o tempo exato em que cada uma foi pressionada é armazenada é enviada para a placa.</p>
        <img src={notas} alt="imagem notas salvas"/>
        <p className="text-ubuntu font-small text-lg mb-1 mx-2 text-start">Dessa forma, a placa consegue guardar a ordem e o ritmo da música, permitindo que tudo seja reproduzido exatamente como você tocou depois.</p>
        <div className="items-center p-4 rounded-lg bg-gray-300">
            <p>lista_de_notas = [ (nota, tempo), ... ] </p>
        </div>
        <p className="text-ubuntu font-small text-lg mb-1 mx-2 text-start">Além disso, o aplicativo baixa um arquivo no seu celular com a sequencia e tempo das notas, para poderem serem tocadas novamente.</p>
      </div>
    </>
  );
}