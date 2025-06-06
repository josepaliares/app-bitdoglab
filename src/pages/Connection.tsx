import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/Header";
import { useNavigate } from "react-router-dom";
import { useConnection } from "../contexts/ConnectionContext";

export default function Connection() {
  const navigate = useNavigate();
  const {
    isConnected,
    connectCable,
    connectBluetooth,
    disconnect,
    scanBluetoothDevices,
    availableDevices,
  } = useConnection();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedConnectionType, setSelectedConnectionType] = useState<
    "cable" | "bluetooth"
  >("cable");
  const [scanning, setScanning] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState<string | null>(null);

  // Handle scan for Bluetooth devices
  const handleScan = async () => {
    try {
      setScanning(true);
      setError(null);
      await scanBluetoothDevices();
    } catch (err: any) {
      setError(err.message || "Falha ao buscar dispositivos Bluetooth");
    } finally {
      setScanning(false);
    }
  };

  // Handle connection
  const handleConnection = async () => {
    if (isConnected) {
      try {
        setLoading(true);
        await disconnect();
        setError(null);
      } catch (err: any) {
        setError(err.message || "Falha ao desconectar");
      } finally {
        setLoading(false);
      }
    } else {
      try {
        setLoading(true);
        setError(null);

        if (selectedConnectionType === "cable") {
          await connectCable();
        } else {
          if (!selectedDevice) {
            setError("Selecione um dispositivo Bluetooth");
            setLoading(false);
            return;
          }
          await connectBluetooth(selectedDevice);
        }

        navigate("/components");
      } catch (err: any) {
        setError(err.message || "Falha ao conectar");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="h-screen flex flex-col">
      <Header title="" showIdeaButton={false} />
      <div className="h-screen flex flex-col items-center justify-center gap-3.5 p-4">
        <h1 className="text-ubuntu px-8 font-medium text-lg text-center">
          {isConnected
            ? "Você está conectado à placa"
            : "Antes de começar, primeiro conecte-se com a placa"}
        </h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {!isConnected && (
          <div className="w-full max-w-md">
            <div className="mb-4">
              <h2 className="text-ubuntu font-medium mb-2">
                Escolha o método de conexão:
              </h2>
              <div className="flex gap-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="connectionType"
                    checked={selectedConnectionType === "cable"}
                    onChange={() => setSelectedConnectionType("cable")}
                    className="mr-2"
                  />
                  Conexão via cabo
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="connectionType"
                    checked={selectedConnectionType === "bluetooth"}
                    onChange={() => setSelectedConnectionType("bluetooth")}
                    className="mr-2"
                  />
                  Conexão Bluetooth
                </label>
              </div>
            </div>

            {selectedConnectionType === "bluetooth" && (
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <Button
                    onClick={handleScan}
                    disabled={scanning}
                    variant="outline"
                    className="text-sm"
                  >
                    {scanning ? "Buscando..." : "Buscar dispositivos"}
                  </Button>
                  {scanning && (
                    <span className="text-sm text-gray-500">
                      Isso pode levar alguns segundos...
                    </span>
                  )}
                </div>

                <div className="mt-2 border rounded-md p-2 max-h-32 overflow-y-auto">
                  <h3 className="text-sm font-semibold mb-1">
                    Dispositivos disponíveis:
                  </h3>
                  {availableDevices.length === 0 ? (
                    <p className="text-sm text-gray-500">
                      Nenhum dispositivo encontrado
                    </p>
                  ) : (
                    <ul className="space-y-1">
                      {availableDevices.map((device) => (
                        <li key={device.address} className="flex items-center">
                          <label className="flex items-center text-sm">
                            <input
                              type="radio"
                              name="bluetoothDevice"
                              value={device.address}
                              checked={selectedDevice === device.address}
                              onChange={() => setSelectedDevice(device.address)}
                              className="mr-2"
                            />
                            {device.name || device.id}
                          </label>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        <Button
          onClick={handleConnection}
          disabled={
            loading ||
            (selectedConnectionType === "bluetooth" &&
              !selectedDevice &&
              !isConnected)
          }
          variant={isConnected ? "destructive" : "default"}
        >
          {loading
            ? "Processando..."
            : isConnected
            ? "Desconectar"
            : `Conectar via ${
                selectedConnectionType === "cable" ? "cabo" : "Bluetooth"
              }`}
        </Button>

        {isConnected && (
          <Button onClick={() => navigate("/components")} className="mt-2">
            Continuar para Componentes
          </Button>
        )}
      </div>
    </div>
  );
}
