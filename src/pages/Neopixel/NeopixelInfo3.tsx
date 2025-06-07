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
        <h3 className="text-ubuntu font-small text-lg mb-1 text-center">Você pode recebe o comando de duas formas:</h3>
        <img 
          src={Conexão} 
          alt="imagem conexao"
          className="block mx-auto "
        />
        <div className="items-center p-4 rounded-lg bg-gray-300">
            <h3>Se conexao == "USB" então:</h3>
            <h3>   enviar_pelo_cabo(comando)</h3>
            <h3>Se conexao == "Bluettoth" então:</h3>
            <h3>   enviar_pelo_bluetooth(comando)</h3>
        </div>
      </div>
    </>
  );
}