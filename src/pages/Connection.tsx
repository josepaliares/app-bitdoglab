import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/Header";
import { useNavigate } from "react-router-dom";
import { useConnection } from "../contexts/ConnectionContext";

type ConnectionType = "cable" | "bluetooth" | "ble"; // Adiciona "ble"

interface ConnectionState {
  loading: boolean;
  error: string | null;
  selectedConnectionType: ConnectionType;
  scanning: boolean;
  selectedDevice: string | null;
}

const INITIAL_STATE: ConnectionState = {
  loading: false,
  error: null,
  selectedConnectionType: "cable",
  scanning: false,
  selectedDevice: null,
};

const MESSAGES = {
  connected: "Você está conectado à placa",
  disconnected: "Antes de começar, primeiro conecte-se com a placa",
  selectDevice: "Selecione um dispositivo",
  scanningHint: "Isso pode levar alguns segundos...",
  noDevices: "Nenhum dispositivo encontrado",
  availableDevices: "Dispositivos disponíveis:",
  connectionMethod: "Escolha o método de conexão:",
  continue: "Continuar para Componentes",
  errors: {
    scanFailed: "Falha ao buscar dispositivos",
    disconnectFailed: "Falha ao desconectar",
    connectFailed: "Falha ao conectar",
  },
  buttons: {
    processing: "Processando...",
    disconnect: "Desconectar",
    scanning: "Buscando...",
    scan: "Buscar dispositivos",
    connectCable: "Conectar via cabo",
    connectBluetooth: "Conectar via Bluetooth",
    connectBLE: "Conectar via BLE", // Nova opção
  },
  connectionTypes: {
    cable: "Conexão via cabo",
    bluetooth: "Conexão Bluetooth (HC-05)",
    ble: "Conexão BLE (Pico 2W)", // Nova opção
  },
  instructions: {
    bluetooth: "Antes de você clicar em buscar dispositivo, você deve ter pareado o bluetooth com o celular, só assim a opção aparecera aqui",
    ble: "Para conectar via BLE, certifique-se que a Raspberry Pi Pico 2W está ligada e executando o código BLE. O dispositivo deve aparecer como 'Pico2W' nas opções.", // Nova instrução
  }
} as const;

export default function Connection() {
  const navigate = useNavigate();
  const {
    isConnected,
    connectCable,
    connectBluetooth,
    connectBLE, // Nova função
    disconnect,
    scanBluetoothDevices,
    scanBLEDevices, // Nova função
    availableDevices,
    availableBLEDevices, // Nova lista
  } = useConnection();

  const [state, setState] = useState<ConnectionState>(INITIAL_STATE);

  const updateState = useCallback((updates: Partial<ConnectionState>) => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  const clearError = useCallback(() => {
    updateState({ error: null });
  }, [updateState]);

  // **FUNÇÃO UNIFICADA DE ESCANEAMENTO**
  const handleScan = useCallback(async () => {
    try {
      updateState({ scanning: true, error: null });
      
      // Chama a função de escaneamento apropriada baseada no tipo selecionado
      if (state.selectedConnectionType === "bluetooth") {
        await scanBluetoothDevices();
      } else if (state.selectedConnectionType === "ble") {
        await scanBLEDevices();
      }
      
    } catch (err: any) {
      updateState({ error: err.message || MESSAGES.errors.scanFailed });
    } finally {
      updateState({ scanning: false });
    }
  }, [state.selectedConnectionType, scanBluetoothDevices, scanBLEDevices, updateState]);

  const handleDisconnect = useCallback(async () => {
    try {
      updateState({ loading: true });
      await disconnect();
      clearError();
    } catch (err: any) {
      updateState({ error: err.message || MESSAGES.errors.disconnectFailed });
    } finally {
      updateState({ loading: false });
    }
  }, [disconnect, clearError, updateState]);

  // **FUNÇÃO UNIFICADA DE CONEXÃO**
  const handleConnect = useCallback(async () => {
    try {
      updateState({ loading: true, error: null });

      if (state.selectedConnectionType === "cable") {
        await connectCable();
        
      } else if (state.selectedConnectionType === "bluetooth") {
        if (!state.selectedDevice) {
          updateState({ error: MESSAGES.selectDevice, loading: false });
          return;
        }
        await connectBluetooth(state.selectedDevice);
        
      } else if (state.selectedConnectionType === "ble") {
        // **NOVA LÓGICA PARA BLE**
        if (!state.selectedDevice) {
          updateState({ error: MESSAGES.selectDevice, loading: false });
          return;
        }
        await connectBLE(state.selectedDevice);
      }

      navigate("/components");
    } catch (err: any) {
      updateState({ error: err.message || MESSAGES.errors.connectFailed });
    } finally {
      updateState({ loading: false });
    }
  }, [state.selectedConnectionType, state.selectedDevice, connectCable, connectBluetooth, connectBLE, navigate, updateState]);

  const handleConnection = useCallback(() => {
    return isConnected ? handleDisconnect() : handleConnect();
  }, [isConnected, handleDisconnect, handleConnect]);

  const handleConnectionTypeChange = useCallback((type: ConnectionType) => {
    updateState({ selectedConnectionType: type, selectedDevice: null });
  }, [updateState]);

  const handleDeviceSelect = useCallback((deviceAddress: string) => {
    updateState({ selectedDevice: deviceAddress });
  }, [updateState]);

  const isConnectDisabled = useCallback(() => {
    const requiresDevice = state.selectedConnectionType === "bluetooth" || state.selectedConnectionType === "ble";
    return state.loading || (requiresDevice && !state.selectedDevice && !isConnected);
  }, [state.loading, state.selectedConnectionType, state.selectedDevice, isConnected]);

  const getConnectButtonText = useCallback(() => {
    if (state.loading) return MESSAGES.buttons.processing;
    if (isConnected) return MESSAGES.buttons.disconnect;
    
    // Retorna o texto apropriado baseado no tipo de conexão
    switch (state.selectedConnectionType) {
      case "cable": return MESSAGES.buttons.connectCable;
      case "bluetooth": return MESSAGES.buttons.connectBluetooth;
      case "ble": return MESSAGES.buttons.connectBLE;
      default: return MESSAGES.buttons.connectCable;
    }
  }, [state.loading, state.selectedConnectionType, isConnected]);

  // **SELETOR DE TIPO DE CONEXÃO ATUALIZADO**
  const renderConnectionTypeSelector = () => (
    <div className="mb-4 my-2">
      <h2 className="text-ubuntu font-medium mb-2">{MESSAGES.connectionMethod}</h2>
      <div className="flex flex-col gap-2">
        <label className="flex items-center">
          <input
            type="radio"
            name="connectionType"
            checked={state.selectedConnectionType === "cable"}
            onChange={() => handleConnectionTypeChange("cable")}
            className="mr-2"
          />
          {MESSAGES.connectionTypes.cable}
        </label>
        <label className="flex items-center">
          <input
            type="radio"
            name="connectionType"
            checked={state.selectedConnectionType === "bluetooth"}
            onChange={() => handleConnectionTypeChange("bluetooth")}
            className="mr-2"
          />
          {MESSAGES.connectionTypes.bluetooth}
        </label>
        {/* **NOVA OPÇÃO BLE** */}
        <label className="flex items-center">
          <input
            type="radio"
            name="connectionType"
            checked={state.selectedConnectionType === "ble"}
            onChange={() => handleConnectionTypeChange("ble")}
            className="mr-2"
          />
          {MESSAGES.connectionTypes.ble}
        </label>
      </div>
    </div>
  );

  // **LISTA DE DISPOSITIVOS UNIFICADA**
  const renderDeviceList = () => {
    // Escolhe a lista de dispositivos baseada no tipo selecionado
    const devices = state.selectedConnectionType === "ble" 
      ? availableBLEDevices.map(d => ({ address: d.id, name: d.name, id: d.id }))
      : availableDevices;
      
    return (
      <div className="mt-2 border rounded-md p-2 max-h-32 overflow-y-auto">
        <h3 className="text-sm font-semibold mb-1">{MESSAGES.availableDevices}</h3>
        {devices.length === 0 ? (
          <p className="text-sm text-gray-500">{MESSAGES.noDevices}</p>
        ) : (
          <ul className="space-y-1">
            {devices.map((device) => (
              <li key={device.address} className="flex items-center">
                <label className="flex items-center text-sm">
                  <input
                    type="radio"
                    name="device"
                    value={device.address}
                    checked={state.selectedDevice === device.address}
                    onChange={() => handleDeviceSelect(device.address)}
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
  };

  // **SEÇÃO UNIFICADA PARA BLUETOOTH E BLE**
  const renderWirelessSection = () => (
    <div className="mb-4 gap-2">
      {/* Instrução específica baseada no tipo */}
      <p className="text-ubuntu text-text justify-center font-medium text-md mb-1 mx-2">
        {state.selectedConnectionType === "bluetooth" 
          ? MESSAGES.instructions.bluetooth
          : MESSAGES.instructions.ble
        }
      </p>
      
      <div className="flex items-center justify-center gap-2 mb-2">
        <Button
          onClick={handleScan}
          disabled={state.scanning}
          variant="outline"
          className="text-sm my-2"
        >
          {state.scanning ? MESSAGES.buttons.scanning : MESSAGES.buttons.scan}
        </Button>
        {state.scanning && (
          <span className="text-ubuntu text-sm text-gray-500 my-2">
            {MESSAGES.scanningHint}
          </span>
        )}
      </div>
      {renderDeviceList()}
    </div>
  );

  const renderErrorMessage = () => state.error && (
    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
      {state.error}
    </div>
  );

  const renderConnectionForm = () => !isConnected && (
    <div className="w-full max-w-md">
      {renderConnectionTypeSelector()}
      {/* Mostra seção wireless para bluetooth ou ble */}
      {(state.selectedConnectionType === "bluetooth" || state.selectedConnectionType === "ble") && 
        renderWirelessSection()
      }
    </div>
  );

  const renderContinueButton = () => isConnected && (
    <Button onClick={() => navigate("/components")} className="mt-2">
      {MESSAGES.continue}
    </Button>
  );

  return (
    <div className="h-screen flex flex-col bg-background">
      <Header title="" showIdeaButton={false} />
      <div className="h-screen flex flex-col items-center justify-center gap-3.5 p-4">
        <h1 className="text-ubuntu px-8 font-medium text-lg text-center my-2">
          {isConnected ? MESSAGES.connected : MESSAGES.disconnected}
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