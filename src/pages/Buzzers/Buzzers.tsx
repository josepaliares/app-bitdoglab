import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/Header";

export default function Buzzers() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col bg-background min-h-screen">
      <Header title="Buzzers" showIdeaButton={false} />
      <main className="h-screen flex flex-col items-center justify-center gap-3.5">
        <div className="h-screen flex flex-col items-center justify-center gap-3.5">
          <Button variant="secondary" onClick={() => navigate("/components/buzzers/tocar")}>Tocar em tempo real</Button>
          <Button variant="secondary" onClick={() => navigate("/components/buzzers/gravar")}>Gravar uma musica</Button>
        </div>
      </main>
    </div>
  );
}