import { Header } from "@/components/Header";
import cel_placa_musica from "@/assets/imgs/cel_placa_musica.png";

export default function BuzzersTocarInfo3(): React.ReactElement {
  return(
    <>
      <Header
        title=""
        showIdeaButton={false}
      />
      <div className="h-screen flex flex-col items-center gap-3.5">
        <h2 className="text-ubuntu tx-bl font-medium text-lg mb-1"> Placa começa a tocar a nota</h2>
        <p className="text-ubuntu font-small text-lg mb-1 mx-2 text-start">Ao receber o comando do app com a nota a ser tocada, a placa interpreta a informação recebida e aciona o buzzer.</p>
        <img src={cel_placa_musica} alt="imagem cel_placa_musica"/>,
        <p className="text-ubuntu font-small text-lg mb-1 mx-2 text-start">O firmware da placa utiliza a frequência correspondente à nota musical e ativa um sinal PWM (modulação por largura de pulso) na saída conectada ao buzzer, gerando o som da nota em tempo real.</p>
        <div className="items-center p-4 rounded-lg bg-gray-300">
            <p>enviar_para_placa("tocar", nota)</p>
            <p># Na placa</p>
            <p className="mx-2">tocar_buzzer(nota)</p>
        </div>
      </div>
    </>
  );
}