import { Header } from "@/components/Header";

export default function BuzzersTocarInfo5(): React.ReactElement {
  return(
    <>
      <Header
        title=""
        showIdeaButton={false}
      />
      <div className="h-screen flex flex-col items-center gap-3.5">
        <h2 className="text-ubuntu tx-bl font-medium text-lg mb-1"> Ao soltar a tecla do piano</h2>
        <p className="text-ubuntu font-small text-lg mb-1 mx-2 text-start">A placa recebe o comando para parar o som e desativa o sinal enviado ao buzzer, interrompendo o som da nota de forma instantânea.</p>
        <div className="items-center p-4 rounded-lg bg-gray-300">
            <p># Na placa</p>
            <p>parar_buzzer()</p>
        </div>
      </div>
    </>
  );
}