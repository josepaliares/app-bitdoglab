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
        <h3 className="text-ubuntu font-small text-lg mb-1 text-start">O app reúne tudo o que você escolheu:</h3>
        <h3 className="text-ubuntu font-small text-lg mb-1 text-start">- Qual LED</h3>
        <h3 className="text-ubuntu font-small text-lg mb-1 text-start">- Qual cor</h3>
        <h3 className="text-ubuntu font-small text-lg mb-1 text-start">Monta uma mensagem de controle e envia para a placa via cabo ou Bluetooth.</h3>
        <div className="items-center p-4 rounded-lg bg-gray-300">
            <h3>x = 3</h3>
            <h3>y = 1</h3>
            <h3>cor = (227,26,139)</h3>
            <h3>comando = pintar_LED(x,y,cor)</h3>
            <h3>enviar_para_placa(comando)</h3>
        </div>
        <h3 className="text-ubuntu font-small text-lg mb-1 text-start">Assim, o LED recebe o comando e acende!</h3>
      </div>
    </>
  );
}