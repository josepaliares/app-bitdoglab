import { Header } from "@/components/Header";
import Conexão from "@/assets/imgs/Conexão.png";

export default function NeopixelInfo3(): React.ReactElement {
  return(
    <>
      <Header
        title=""
        showIdeaButton={false}
      />
      <div className="h-screen flex flex-col items-center gap-3.5">
        <h2 className="text-ubuntu tx-bl font-medium text-lg mb-1">Como a placa recebe o comando?</h2>
        <p className="text-ubuntu font-small text-lg mb-1 text-center">Você pode recebe o comando de duas formas:</p>
        <img 
          src={Conexão} 
          alt="imagem conexao"
          className="block mx-auto "
        />
        <div className="items-center p-4 rounded-lg bg-gray-300">
          <p className="text-ubuntu font-small text-lg mb-1">Se conexao == "USB" então: </p>
          <p className="ml-3 text-ubuntu font-small text-lg mb-1">enviar_pelo_cabo(comando)</p>
          <p className="text-ubuntu font-small text-lg mb-1">Se conexao == "Bluettoth" então:</p>
          <p className="ml-3 text-ubuntu font-small text-lg mb-1">enviar_pelo_bluetooth(comando)</p>
        </div>
      </div>
    </>
  );
}