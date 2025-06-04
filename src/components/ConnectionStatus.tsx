import { useConnection, ConnectionType } from "../contexts/ConnectionContext";
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export const ConnectionStatus = () => {
  const { isConnected, connectionType } = useConnection();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Se a conexão cair e não estivermos já na página de conexão, redireciona
    if (!isConnected && !location.pathname.includes("/connection")) {
      navigate("/connection");
    }
  }, [isConnected, navigate, location]);

  // Get connection label based on type
  const getConnectionLabel = () => {
    if (!isConnected) return "Desconectado";
    return connectionType === ConnectionType.BLUETOOTH
      ? "Conectado via Bluetooth"
      : "Conectado via Cabo";
  };

  return (
    <div
      className="fixed top-2 left-1/2 -translate-x-1/2 px-2 py-1 rounded-full text-xs font-medium z-50"
      style={{
        backgroundColor: isConnected
          ? "rgba(0, 200, 0, 0.2)"
          : "rgba(200, 0, 0, 0.2)",
        color: isConnected ? "rgb(0, 100, 0)" : "rgb(100, 0, 0)",
      }}
    >
      {getConnectionLabel()}
    </div>
  );
};
