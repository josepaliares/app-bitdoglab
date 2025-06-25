import { Header } from "@/components/Header";

export default function BuzzersInfo0(): React.ReactElement {
  return(
    <>
      <Header
        title=""
        showIdeaButton={false}
      />
      <div className="h-screen flex flex-col items-center gap-3.5">
        <h2 className="text-ubuntu tx-bl font-medium text-lg mb-1"> Gravar uma música</h2>
        <p className="text-ubuntu font-small text-lg mb-1 mx-2 text-start">Você pede para o app começar a gravar tudo o que for tocado!</p>
        <div className="items-center p-4 rounded-lg bg-gray-300">
            <p>gravando = verdadeiro</p>
            <p>lista_de_notas = []</p>
        </div>
        <p className="text-ubuntu font-small text-lg mb-1 mx-2 text-start">Quando uma tecla do piano é pressionada, o app detecta e identifica qual nota foi tocada.</p>
        <p className="text-ubuntu font-small text-lg mb-1 mx-2 text-start">Cada vez que você toca uma tecla, uma nova entrada (nota + tempo) é adicionada na lista da música.</p>
        <p className="text-ubuntu font-small text-lg mb-1 mx-2 text-start">Dessa forma, todas as ações do teclado ficam salvas para que a música seja reproduzida exatamente igual depois.</p>
        <div className="items-center p-4 rounded-lg bg-gray-300">
            <p>se gravando:</p>
            <p className="mx-2">ao pressionar_tecla(nota):</p>
            <p className="mx-4">tempo = obter_tempo()</p>
            <p className="mx-4">adicionar_na_lista(nota, tempo)</p>
        </div>
      </div>
    </>
  );
}