import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useConnection } from "../contexts/ConnectionContext";

export default function Connection() {
  const navigate = useNavigate();
  const { isConnected, connect, disconnect } = useConnection();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleConnection = async () => {
    if (isConnected) {
      try {
        setLoading(true);
        await disconnect();
        setError(null);
      } catch (err) {
        setError("Falha ao desconectar");
      } finally {
        setLoading(false);
      }
    } else {
      try {
        setLoading(true);
        setError(null);
        await connect();
        navigate("/components");
      } catch (err: any) {
        setError(err.message || "Falha ao conectar");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center gap-3.5">
      <h1 className="text-ubuntu px-8 font-medium text-lg">
        {isConnected
          ? "Você está conectado à placa"
          : "Antes de começar, primeiro conecte-se com a placa"}
      </h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <Button
        onClick={handleConnection}
        disabled={loading}
        variant={isConnected ? "destructive" : "default"}
      >
        {loading ? "Processando..." : isConnected ? "Desconectar" : "Conectar"}
      </Button>

      {isConnected && (
        <Button onClick={() => navigate("/components")} className="mt-2">
          Continuar para Componentes
        </Button>
      )}
    </div>
  );
}
