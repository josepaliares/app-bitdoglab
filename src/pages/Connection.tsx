import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/Header";
import { useNavigate } from "react-router-dom";
import { useConnection } from "../contexts/ConnectionContext";

type ConnectionType = "cable" | "bluetooth";

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
  const [selectedConnectionType, setSelectedConnectionType] = useState<ConnectionType>("cable");
  const [scanning, setScanning] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState<string | null>(null);

  const clearError = () => setError(null);

  const handleScan = async () => {
    try {
      setScanning(true);
      clearError();
      await scanBluetoothDevices();
    } catch (err: any) {
      setError(err.message || "Falha ao buscar dispositivos Bluetooth");
    } finally {
      setScanning(false);
    }
  };

  const handleDisconnect = async () => {
    try {
      setLoading(true);
      await disconnect();
      clearError();
    } catch (err: any) {
      setError(err.message || "Falha ao desconectar");
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = async () => {
    try {
      setLoading(true);
      clearError();

      if (selectedConnectionType === "cable") {
        await connectCable();
      } else {
        if (!selectedDevice) {
          setError("Selecione um dispositivo Bluetooth");
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
  };

  const handleConnection = () => {
    return isConnected ? handleDisconnect() : handleConnect();
  };

  const isConnectDisabled = () => {
    return loading || (selectedConnectionType === "bluetooth" && !selectedDevice && !isConnected);
  };

  const getConnectButtonText = () => {
    if (loading) return "Processando...";
    if (isConnected) return "Desconectar";
    return `Conectar via ${selectedConnectionType === "cable" ? "cabo" : "Bluetooth"}`;
  };

  const renderConnectionTypeSelector = () => (
    <div className="mb-4">
      <h2 className="text-ubuntu font-medium mb-2">Escolha o método de conexão:</h2>
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
  );

  const renderBluetoothDeviceList = () => (
    <div className="mt-2 border rounded-md p-2 max-h-32 overflow-y-auto">
      <h3 className="text-sm font-semibold mb-1">Dispositivos disponíveis:</h3>
      {availableDevices.length === 0 ? (
        <p className="text-sm text-gray-500">Nenhum dispositivo encontrado</p>
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
  );

  const renderBluetoothSection = () => (
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
      {renderBluetoothDeviceList()}
    </div>
  );

  const renderErrorMessage = () => error && (
    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
      {error}
    </div>
  );

  const renderConnectionForm = () => !isConnected && (
    <div className="w-full max-w-md">
      {renderConnectionTypeSelector()}
      {selectedConnectionType === "bluetooth" && renderBluetoothSection()}
    </div>
  );

  const renderContinueButton = () => isConnected && (
    <Button onClick={() => navigate("/components")} className="mt-2">
      Continuar para Componentes
    </Button>
  );

  return (
    <div className="h-screen flex flex-col">
      <Header title="" showIdeaButton={false} />
      <div className="h-screen flex flex-col items-center justify-center gap-3.5 p-4">
        <h1 className="text-ubuntu px-8 font-medium text-lg text-center">
          {isConnected
            ? "Você está conectado à placa"
            : "Antes de começar, primeiro conecte-se com a placa"}
        </h1>

        {renderErrorMessage()}
        {renderConnectionForm()}

        <Button
          onClick={handleConnection}
          disabled={isConnectDisabled()}
          variant={isConnected ? "destructive" : "default"}
        >
          {getConnectButtonText()}
        </Button>

        {renderContinueButton()}
      </div>
    </div>
  );
}