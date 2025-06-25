import { Header } from "@/components/Header";

export default function BuzzersInfo4(): React.ReactElement {
  return(
    <>
      <Header
        title=""
        showIdeaButton={false}
      />
      <div className="h-screen flex flex-col items-center gap-3.5">
        <h2 className="text-ubuntu tx-bl font-medium text-lg mb-1"> Ao soltar a tecla do piano</h2>
        <p className="text-ubuntu font-small text-lg mb-1 mx-2 text-start">O app detecta o evento de soltura da tecla e envia para a placa o comando para interromper a emissão do som.</p>
        <p className="text-ubuntu font-small text-lg mb-1 mx-2 text-start">Esse processo garante que o buzzer pare imediatamente após o usuário soltar a tecla.</p>
        <div className="items-center p-4 rounded-lg bg-gray-300">
            <p>soltar_tecla():</p>
            <p className="mx-2">enviar_para_placa("parar")</p>
        </div>
      </div>
    </>
  );
}