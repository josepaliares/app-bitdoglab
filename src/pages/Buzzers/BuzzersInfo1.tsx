import { Header } from "@/components/Header";

export default function BuzzersInfo1(): React.ReactElement {
  return(
    <>
      <Header
        title=""
        showIdeaButton={false}
      />
      <div className="h-screen flex flex-col items-center gap-3.5">
        <h2 className="text-ubuntu tx-bl font-medium text-lg mb-1"> Usuário escolhe uma oitava</h2>
        <p className="text-ubuntu font-small text-lg mb-1 mx-2 text-start">Ao selecionar a oitava o app ajusta o valor base para o cálculo das notas.</p>
        <p className="text-ubuntu font-small text-lg mb-1 mx-2 text-start">Esse valor determina a frequência das notas que serão enviadas para a placa quando o usuário precionar as teclas do piano.</p>
        <div className="items-center p-4 rounded-lg bg-gray-300">
            <p>oitava = escolher_oitava()</p>
        </div>
      </div>
    </>
  );
}