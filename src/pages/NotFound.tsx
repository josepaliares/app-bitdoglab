import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <>
      <div className="absolute top-5 left-5">
        <Button variant="primary" onClick={() => navigate(-1)}>
          Voltar
        </Button>
      </div>
      <div className="h-screen flex flex-col items-center justify-center gap-3.5">
        <h1 className="text-ubuntu font-bold text-lg mt-5">Página Não Encontrada</h1>
        <h2 className="text-ubuntu font-medium text-md mb-2">
          A rota <span className="text-blue-500">{location.pathname}</span> não existe.
        </h2>
      </div>
    </>
  );
};

export default NotFound;
