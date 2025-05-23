import { Header } from "@/components/Header";

export default function Display() {
  return (
    <div className="flex flex-col">
      <Header title="Display" showIdeaButton={false} />
      <main className="h-screen flex flex-col items-center justify-center gap-3.5">
        <h2 className="text-ubuntu font-bold text-md mb-5">Em construção!</h2>
      </main>
    </div>
  );
}
