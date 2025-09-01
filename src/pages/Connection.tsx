import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/Header";
import { useNavigate } from "react-router-dom";
import { useConnection } from "../contexts/ConnectionContext";
import type { BleDevice } from '@capacitor-community/bluetooth-le';

// 🔄 Tipos de conexão expandidos
type ConnectionType = "cable" | "bluetooth_classic" | "bluetooth_le";

interface ConnectionState {
  loading: boolean;
  error: string | null;
  selectedConnectionType: ConnectionType;
  scanning: boolean;
  selectedDevice: string | null;           // Para Bluetooth Clássico
  selectedBleDevice: BleDevice | null;     // 🆕 Para BLE
}

const INITIAL_STATE: ConnectionState = {
  loading: false,
  error: null,
  selectedConnectionType: "cable",
  scanning: false,
  selectedDevice: null,
  selectedBleDevice: null,  // 🆕
};

// 📝 Mensagens expandidas
const MESSAGES = {
  connected: "Você está conectado à placa",
  disconnected: "Antes de começar, primeiro conecte-se com a placa",
  selectDevice: "Selecione um dispositivo Bluetooth",
  selectBleDevice: "Selecione um dispositivo BLE",           // 🆕
  scanningHint: "Isso pode levar alguns segundos...",
  noDevices: "Nenhum dispositivo encontrado",
  availableDevices: "Dispositivos disponíveis:",
  connectionMethod: "Escolha o método de conexão:",
  continue: "Continuar para Componentes",
  errors: {
    scanFailed: "Falha ao buscar dispositivos Bluetooth",
    bleScanFailed: "Falha ao buscar dispositivos BLE",      // 🆕
    disconnectFailed: "Falha ao desconectar",
    connectFailed: "Falha ao conectar",
  },
  buttons: {
    processing: "Processando...",
    disconnect: "Desconectar",
    scanning: "Buscando...",
    scan: "Buscar dispositivos",
    scanBle: "Buscar dispositivos BLE",                     // 🆕
    connectCable: "Conectar via cabo",
    connectBluetoothClassic: "Conectar via Bluetooth Clássico",  // Renomeado
    connectBluetoothLE: "Conectar via Bluetooth LE",       // 🆕
  },
  connectionTypes: {
    cable: "Conexão via cabo",
    bluetooth_classic: "Conexão Bluetooth Clássico",       // Renomeado
    bluetooth_le: "Conexão Bluetooth LE (BLE)",            // 🆕
  },
} as const;

export default function Connection() {
  const navigate = useNavigate();
  
  // 🔄 Contexto expandido com BLE
  const {
    isConnected,
    connectCable,
    connectBluetoothClassic,    // Renomeado
    connectBluetoothLE,         // 🆕
    disconnect,
    scanBluetoothDevices,
    scanBleDevices,             // 🆕
    availableDevices,
    bleDevices,                 // 🆕
    isBleScanning,              // 🆕
    bleError,                   // 🆕
    clearBleError,              // 🆕
  } = useConnection();

  const [state, setState] = useState<ConnectionState>(INITIAL_STATE);

  const updateState = useCallback((updates: Partial<ConnectionState>) => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  const clearError = useCallback(() => {
    updateState({ error: null });
    clearBleError(); // 🆕 Limpa erros BLE também
  }, [updateState, clearBleError]);

  // 🔍 Escaneamento para Bluetooth Clássico
  const handleScanClassic = useCallback(async () => {
    try {
      updateState({ scanning: true, error: null });
      await scanBluetoothDevices();
    } catch (err: any) {
      updateState({ error: err.message || MESSAGES.errors.scanFailed });
    } finally {
      updateState({ scanning: false });
    }
  }, [scanBluetoothDevices, updateState]);

  // 🔵 NOVO: Escaneamento para BLE
  const handleScanBLE = useCallback(async () => {
    try {
      updateState({ error: null });
      await scanBleDevices();
    } catch (err: any) {
      updateState({ error: err.message || MESSAGES.errors.bleScanFailed });
    }
  }, [scanBleDevices, updateState]);

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

  const handleConnect = useCallback(async () => {
    try {
      updateState({ loading: true, error: null });

      if (state.selectedConnectionType === "cable") {
        await connectCable();
      } else if (state.selectedConnectionType === "bluetooth_classic") {
        if (!state.selectedDevice) {
          updateState({ error: MESSAGES.selectDevice, loading: false });
          return;
        }
        await connectBluetoothClassic(state.selectedDevice);
      } else if (state.selectedConnectionType === "bluetooth_le") {
        // 🔵 NOVO: Conexão BLE
        if (!state.selectedBleDevice) {
          updateState({ error: MESSAGES.selectBleDevice, loading: false });
          return;
        }
        await connectBluetoothLE(state.selectedBleDevice);
      }

      navigate("/components");
    } catch (err: any) {
      updateState({ error: err.message || MESSAGES.errors.connectFailed });
    } finally {
      updateState({ loading: false });
    }
  }, [state.selectedConnectionType, state.selectedDevice, state.selectedBleDevice, 
      connectCable, connectBluetoothClassic, connectBluetoothLE, navigate, updateState]);

  const handleConnection = useCallback(() => {
    return isConnected ? handleDisconnect() : handleConnect();
  }, [isConnected, handleDisconnect, handleConnect]);

  const handleConnectionTypeChange = useCallback((type: ConnectionType) => {
    updateState({ 
      selectedConnectionType: type, 
      selectedDevice: null,
      selectedBleDevice: null  // 🆕 Limpa seleção BLE também
    });
  }, [updateState]);

  const handleDeviceSelect = useCallback((deviceAddress: string) => {
    updateState({ selectedDevice: deviceAddress });
  }, [updateState]);

  // 🔵 NOVO: Seleção de dispositivo BLE
  const handleBleDeviceSelect = useCallback((device: BleDevice) => {
    updateState({ selectedBleDevice: device });
  }, [updateState]);

  const isConnectDisabled = useCallback(() => {
    if (state.loading) return true;
    
    if (state.selectedConnectionType === "bluetooth_classic" && !state.selectedDevice && !isConnected) {
      return true;
    }
    
    if (state.selectedConnectionType === "bluetooth_le" && !state.selectedBleDevice && !isConnected) {
      return true;
    }
    
    return false;
  }, [state.loading, state.selectedConnectionType, state.selectedDevice, state.selectedBleDevice, isConnected]);

  const getConnectButtonText = useCallback(() => {
    if (state.loading) return MESSAGES.buttons.processing;
    if (isConnected) return MESSAGES.buttons.disconnect;
    
    switch (state.selectedConnectionType) {
      case "cable": return MESSAGES.buttons.connectCable;
      case "bluetooth_classic": return MESSAGES.buttons.connectBluetoothClassic;
      case "bluetooth_le": return MESSAGES.buttons.connectBluetoothLE;  // 🆕
      default: return MESSAGES.buttons.connectCable;
    }
  }, [state.loading, state.selectedConnectionType, isConnected]);

  // 🎛️ Seletor de tipo de conexão (expandido)
  const renderConnectionTypeSelector = () => (
    <div className="mb-4">
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
            checked={state.selectedConnectionType === "bluetooth_classic"}
            onChange={() => handleConnectionTypeChange("bluetooth_classic")}
            className="mr-2"
          />
          {MESSAGES.connectionTypes.bluetooth_classic}
        </label>
        <label className="flex items-center">
          <input
            type="radio"
            name="connectionType"
            checked={state.selectedConnectionType === "bluetooth_le"}
            onChange={() => handleConnectionTypeChange("bluetooth_le")}
            className="mr-2"
          />
          {MESSAGES.connectionTypes.bluetooth_le} 🆕
        </label>
      </div>
    </div>
  );

  // 📱 Lista de dispositivos Bluetooth Clássico (mantida)
  const renderBluetoothDeviceList = () => (
    <div className="mt-2 border rounded-md p-2 max-h-32 overflow-y-auto">
      <h3 className="text-sm font-semibold mb-1">{MESSAGES.availableDevices}</h3>
      {availableDevices.length === 0 ? (
        <p className="text-sm text-gray-500">{MESSAGES.noDevices}</p>
      ) : (
        <ul className="space-y-1">
          {availableDevices.map((device) => (
            <li key={device.address} className="flex items-center">
              <label className="flex items-center text-sm">
                <input
                  type="radio"
                  name="bluetoothDevice"
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

  // 🔵 NOVA: Lista de dispositivos BLE
  const renderBleDeviceList = () => (
    <div className="mt-2 border rounded-md p-2 max-h-32 overflow-y-auto">
      <h3 className="text-sm font-semibold mb-1">{MESSAGES.availableDevices} BLE</h3>
      {bleDevices.length === 0 ? (
        <p className="text-sm text-gray-500">
          {isBleScanning ? "🔄 Escaneando..." : MESSAGES.noDevices}
        </p>
      ) : (
        <ul className="space-y-1">
          {bleDevices.map((device) => (
            <li key={device.deviceId} className="flex items-center">
              <label className="flex items-center text-sm">
                <input
                  type="radio"
                  name="bleDevice"
                  value={device.deviceId}
                  checked={state.selectedBleDevice?.deviceId === device.deviceId}
                  onChange={() => handleBleDeviceSelect(device)}
                  className="mr-2"
                />
                <span className="flex items-center gap-2">
                  🔵 {device.name || "Dispositivo BLE"}
                  <span className="text-xs text-gray-400 font-mono">
                    {device.deviceId.substring(0, 8)}...
                  </span>
                </span>
              </label>
            </li>
          ))}
        </ul>
      )}
    </div>
  );

  // 📱 Seção Bluetooth Clássico (mantida)
  const renderBluetoothClassicSection = () => (
    <div className="mb-4">
      <div className="flex items-center gap-2 mb-2">
        <Button
          onClick={handleScanClassic}
          disabled={state.scanning}
          variant="outline"
          className="text-sm"
        >
          {state.scanning ? MESSAGES.buttons.scanning : MESSAGES.buttons.scan}
        </Button>
        {state.scanning && (
          <span className="text-sm text-gray-500">
            {MESSAGES.scanningHint}
          </span>
        )}
      </div>
      {renderBluetoothDeviceList()}
    </div>
  );

  // 🔵 NOVA: Seção BLE
  const renderBluetoothLESection = () => (
    <div className="mb-4">
      <div className="flex items-center gap-2 mb-2">
        <Button
          onClick={handleScanBLE}
          disabled={isBleScanning}
          variant="outline"
          className="text-sm bg-blue-50 hover:bg-blue-100"
        >
          {isBleScanning ? "🔄 Escaneando BLE..." : MESSAGES.buttons.scanBle}
        </Button>
        {isBleScanning && (
          <span className="text-sm text-blue-600">
            🔍 Procurando dispositivos BLE...
          </span>
        )}
      </div>
      {renderBleDeviceList()}
      
      {/* 🆕 Mostra erro específico do BLE */}
      {bleError && (
        <div className="mt-2 text-sm text-red-600 bg-red-50 p-2 rounded">
          ⚠️ {bleError}
        </div>
      )}
    </div>
  );

  // ⚠️ Renderização de erros (expandida)
  const renderErrorMessage = () => (state.error || bleError) && (
    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
      {state.error || bleError}
      <button 
        onClick={clearError}
        className="ml-2 text-red-800 hover:text-red-900 font-bold"
      >
        ✕
      </button>
    </div>
  );

  // 🎯 Formulário de conexão (expandido)
  const renderConnectionForm = () => !isConnected && (
    <div className="w-full max-w-md">
      {renderConnectionTypeSelector()}
      
      {/* 📱 Seção específica para cada tipo */}
      {state.selectedConnectionType === "bluetooth_classic" && renderBluetoothClassicSection()}
      {state.selectedConnectionType === "bluetooth_le" && renderBluetoothLESection()}
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
      <div className="h-screen flex flex-col items-center justify-center gap-4 p-4">

        {/* 🎯 Mensagem principal */}
        <h1 className="text-ubuntu px-8 font-medium text-lg text-center mb-4">
          {isConnected ? MESSAGES.connected : MESSAGES.disconnected}
        </h1>

        {/* ⚠️ Erros */}
        {renderErrorMessage()}

        {/* 📋 Formulário de conexão */}
        {renderConnectionForm()}

        {/* 🔌 Botão principal */}
        <Button
          onClick={handleConnection}
          disabled={isConnectDisabled()}
          variant={isConnected ? "destructive" : "default"}
          className="min-w-[200px]"
        >
          {getConnectButtonText()}
        </Button>

        {/* ➡️ Botão continuar */}
        {renderContinueButton()}

        {/* 💡 Dicas de uso */}
        {!isConnected && (
          <div className="mt-6 text-center text-sm text-gray-500 max-w-md">
            <p className="mb-2">💡 <strong>Dicas:</strong></p>
            <ul className="text-xs space-y-1">
              <li>🔌 <strong>Cabo:</strong> Para teste, via Desktop </li>
              <li>📱 <strong>Bluetooth Clássico:</strong> Para placas que não tem BLE embutido, usar HC05</li>
              <li>🔵 <strong>Bluetooth LE:</strong> Para placas com BLE embutido</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}