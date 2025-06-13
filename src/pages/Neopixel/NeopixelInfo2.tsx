import { Header } from "@/components/Header";

export default function NeopixelInfo2(): React.ReactElement {
  return(
    <>
      <Header
        title=""
        showIdeaButton={false}
      />
      <div className="h-screen flex flex-col items-center gap-3.5 bg-background">
        <h2 className="text-ubuntu font-medium text-lg mb-1 text-heading">O que acontece ao clicar em "Enviar"?</h2>
        <p className="text-ubuntu text-text text-lg mb-1 mx-2 text-start">O app reúne tudo o que você escolheu:</p>
        <p className="text-ubuntu text-text text-lg mb-1 mx-2 text-start">- Qual LED</p>
        <p className="text-ubuntu text-text text-lg mb-1 mx-2 text-start">- Qual cor</p>
        <p className="text-ubuntu text-text text-lg mb-1 mx-2 text-start">Monta uma mensagem de controle e envia para a placa via cabo ou Bluetooth.</p>
        <div className="items-center p-4 rounded-lg bg-surface">
            <p className="text-text">x = 3</p>
            <p className="text-text">y = 1</p>
            <p className="text-text">cor = (227,26,139)</p>
            <p className="text-text">comando = pintar_LED(x,y,cor)</p>
            <p className="text-text">enviar_para_placa(comando)</p>
        </div>
        <p className="text-ubuntu text-text text-lg mb-1 text-start">Assim, o LED recebe o comando e acende!</p>
      </div>
    </>
  );
}