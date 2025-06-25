import { Header } from "@/components/Header";

export default function BuzzersInfo2(): React.ReactElement {
  return(
    <>
      <Header
        title=""
        showIdeaButton={false}
      />
      <div className="h-screen flex flex-col items-center gap-3.5">
        <h2 className="text-ubuntu tx-bl font-medium text-lg mb-1"> Preciona uma tecla do piano</h2>
        <p className="text-ubuntu font-small text-lg mb-1 mx-2 text-start">Quando o usuário pressiona uma tecla do piano virtual o app registra imediatamente esse en=vento de entrada (input).</p>
        <p className="text-ubuntu font-small text-lg mb-1 mx-2 text-start">Ele identifica qual tecla foi pressionada e qual oitava está ativa, calculando a nota musical exata correspondente.</p>
        <p className="text-ubuntu font-small text-lg mb-1 mx-2 text-start">O app então prepara um comando digital que contém a informação da nota e o envia para a placa, iniciando o processo de tocar a nota em tempo real.</p>
        <div className="items-center p-4 rounded-lg bg-gray-300">
            <p>ao precionar_tecla(tecla)</p>
            <p className="mx-2">nota = calcular_nota(tecla,oitava)</p>
        </div>
      </div>
    </>
  );
}