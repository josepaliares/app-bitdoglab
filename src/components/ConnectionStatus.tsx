import { useConnection } from "../contexts/ConnectionContext";

export const ConnectionStatus = () => {
  const { isConnected } = useConnection();

  return (
    <div
      className="fixed top-2 right-2 px-2 py-1 rounded-full text-xs font-medium z-50"
      style={{
        backgroundColor: isConnected
          ? "rgba(0, 200, 0, 0.2)"
          : "rgba(200, 0, 0, 0.2)",
        color: isConnected ? "rgb(0, 100, 0)" : "rgb(100, 0, 0)",
      }}
    >
      {isConnected ? "Conectado" : "Desconectado"}
    </div>
  );
};
