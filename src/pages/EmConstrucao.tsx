import { Header } from "@/components/Header";

export default function EmConstrucao() {
  return (
    <div className="flex flex-col">
      <Header title="Em construção" showIdeaButton={false} />
      <main className="h-screen flex flex-col items-center justify-center gap-3.5">
        <h2 className="text-ubuntu font-bold text-md mb-5">Essa função estará disponível em breve!</h2>
      </main>
    </div>
  );
}
