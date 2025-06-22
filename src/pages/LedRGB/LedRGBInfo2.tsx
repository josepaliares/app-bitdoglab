import { Header } from "@/components/Header";

export default function NeopixelInfo2(): React.ReactElement {
  return(
    <>
      <Header
        title=""
        showIdeaButton={false}
      />
      <div className="h-screen flex flex-col items-center gap-3.5">
        <h2 className="text-ubuntu tx-bl font-medium text-lg mb-1">O que acontece ao clicar em "Enviar"?</h2>
        <p className="text-ubuntu font-small text-lg mb-1 mx-2 text-start">O app reúne o que você escolheu:</p>
        <p className="text-ubuntu font-small text-lg mb-1 mx-2 text-start">- Qual cor</p>
        <p className="text-ubuntu font-small text-lg mb-1 mx-2 text-start">Monta uma mensagem de controle e envia para a placa via cabo ou Bluetooth.</p>
        <div className="items-center p-4 rounded-lg bg-gray-300">
            <p>cor = (227,26,139)</p>
            <p>comando = pintar_LEDRGB(cor)</p>
            <p>enviar_para_placa(comando)</p>
        </div>
        <p className="text-ubuntu font-small text-lg mb-1 mx-2 text-start">Assim, o LED recebe o comando e acende!</p>
      </div>
    </>
  );
}