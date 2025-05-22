import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useRef,
} from "react";
import { BleClient } from "@capacitor-community/bluetooth-le";

// Tipagem para o navigator.serial
declare global {
  interface Navigator {
    serial?: {
      requestPort: () => Promise<any>;
    };
  }
}

export enum ConnectionType {
  CABLE = "cable",
  BLUETOOTH = "bluetooth",
  NONE = "none",
}

interface BluetoothDevice {
  id: string;
  name: string;
  address: string;
}

interface ConnectionContextType {
  isConnected: boolean;
  connectionType: ConnectionType;
  serialPort: any;
  availableDevices: BluetoothDevice[];
  connectCable: () => Promise<void>;
  connectBluetooth: (deviceId: string) => Promise<void>;
  disconnect: () => Promise<void>;
  sendCommand: (command: string) => Promise<void>;
  scanBluetoothDevices: () => Promise<void>;
}

const ConnectionContext = createContext<ConnectionContextType | undefined>(
  undefined
);

// UUID do serviço Bluetooth Serial Port Profile (SPP)
const SPP_SERVICE_UUID = "00001101-0000-1000-8000-00805F9B34FB";

export const ConnectionProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isConnected, setIsConnected] = useState(false);
  const [connectionType, setConnectionType] = useState<ConnectionType>(
    ConnectionType.NONE
  );
  const [serialPort, setSerialPort] = useState<any>(null);
  const [reader, setReader] = useState<any>(null);
  const [availableDevices, setAvailableDevices] = useState<BluetoothDevice[]>(
    []
  );
  const [connectedDeviceId, setConnectedDeviceId] = useState<string | null>(
    null
  );
  const [bleInitialized, setBleInitialized] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);
  const initializePromise = useRef<Promise<void> | null>(null);

  const initializeBLE = async () => {
    if (bleInitialized) return;
    if (isInitializing) {
      await initializePromise.current;
      return;
    }

    setIsInitializing(true);
    initializePromise.current = (async () => {
      try {
        console.log("Iniciando BLE...");
        await BleClient.initialize();
        console.log("BLE inicializado com sucesso!");
        setBleInitialized(true);
      } catch (error) {
        console.error("Erro ao inicializar BLE:", error);
        setBleInitialized(false);
        throw error;
      } finally {
        setIsInitializing(false);
      }
    })();

    await initializePromise.current;
  };

  // Initialize BLE on component mount
  useEffect(() => {
    initializeBLE();

    return () => {
      if (isConnected) {
        disconnect();
      }
    };
  }, []);

  // Serial connection (via cable)
  const connectCable = async () => {
    try {
      if (!navigator.serial) {
        throw new Error("Web Serial API not supported in this browser");
      }

      const port = await navigator.serial.requestPort();
      await port.open({ baudRate: 115200 });

      setSerialPort(port);
      setConnectionType(ConnectionType.CABLE);
      setIsConnected(true);

      readFromSerial(port);
    } catch (error) {
      console.error("Cable connection error:", error);
      setIsConnected(false);
      throw error;
    }
  };

  const readFromSerial = async (port: any) => {
    if (!port) return;

    const reader = port.readable.getReader();
    setReader(reader);
    const decoder = new TextDecoder();

    try {
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        console.log("Received from serial:", decoder.decode(value));
      }
    } catch (error) {
      console.error("Serial read error:", error);
    } finally {
      reader.releaseLock();
    }
  };

  // Bluetooth functions
  const scanBluetoothDevices = async () => {
    try {
      await initializeBLE();

      // Limpa a lista de dispositivos antes de iniciar nova busca
      setAvailableDevices([]);

      console.log("Iniciando busca por dispositivos...");
      // Removendo a restrição de services para encontrar mais dispositivos inicialmente
      await BleClient.requestLEScan(
        {
          allowDuplicates: false,
          // Removido o filtro de services para encontrar todos os dispositivos
          namePrefix: "", // Aceita qualquer prefixo de nome
        },
        (result) => {
          console.log("Dispositivo encontrado:", result);
          if (result.device && result.device.deviceId) {
            const newDevice = {
              id: result.device.deviceId,
              name: result.device.name || "Dispositivo Desconhecido",
              address: result.device.deviceId,
            };

            setAvailableDevices((prev) => {
              const exists = prev.some((device) => device.id === newDevice.id);
              if (!exists) {
                console.log("Adicionando novo dispositivo:", newDevice);
                return [...prev, newDevice];
              }
              return prev;
            });
          }
        }
      );

      // Aumentando o tempo de scan para 10 segundos
      setTimeout(async () => {
        try {
          await BleClient.stopLEScan();
          console.log("Busca por dispositivos finalizada");
        } catch (stopError) {
          console.error("Erro ao parar busca:", stopError);
        }
      }, 10000);
    } catch (error) {
      console.error("Erro na busca Bluetooth:", error);
      throw error;
    }
  };

  const connectBluetooth = async (deviceId: string) => {
    try {
      await initializeBLE();

      // Disconnect if already connected
      if (isConnected) {
        await disconnect();
      }

      console.log("Conectando ao dispositivo:", deviceId);
      await BleClient.connect(deviceId);
      console.log("Conexão estabelecida!");

      // Descobrir serviços disponíveis
      console.log("Descobrindo serviços...");
      const services = await BleClient.getServices(deviceId);
      console.log("Serviços disponíveis:", services);

      // Tenta usar o serviço SPP se disponível
      const hasSppService = services.some(
        (service) =>
          service.uuid.toLowerCase() === SPP_SERVICE_UUID.toLowerCase()
      );

      if (!hasSppService) {
        console.log(
          "Aviso: Serviço SPP não encontrado. UUIDs disponíveis:",
          services.map((s) => s.uuid)
        );
      }

      // Se encontrou o serviço, considera conectado
      setConnectedDeviceId(deviceId);
      setConnectionType(ConnectionType.BLUETOOTH);
      setIsConnected(true);
    } catch (error) {
      console.error("Erro na conexão Bluetooth:", error);
      setIsConnected(false);
      throw error;
    }
  };

  const disconnect = async () => {
    try {
      if (connectionType === ConnectionType.CABLE) {
        if (reader) {
          await reader.cancel();
          reader.releaseLock();
        }

        if (serialPort) {
          await serialPort.close();
        }

        setSerialPort(null);
        setReader(null);
      } else if (connectionType === ConnectionType.BLUETOOTH) {
        if (connectedDeviceId) {
          await BleClient.disconnect(connectedDeviceId);
          setConnectedDeviceId(null);
        }
      }

      setIsConnected(false);
      setConnectionType(ConnectionType.NONE);
    } catch (error) {
      console.error("Disconnection error:", error);
      throw error;
    }
  };

  const sendCommand = async (command: string) => {
    if (!isConnected) {
      throw new Error("Not connected to any device");
    }

    try {
      if (connectionType === ConnectionType.CABLE) {
        const writer = serialPort.writable.getWriter();
        const encoder = new TextEncoder();

        try {
          await writer.write(encoder.encode(command + "\r\n"));
        } finally {
          writer.releaseLock();
        }
      } else if (
        connectionType === ConnectionType.BLUETOOTH &&
        connectedDeviceId
      ) {
        console.log("Enviando comando via Bluetooth:", command);
        const encoder = new TextEncoder();
        const data = encoder.encode(command + "\r\n");

        // Tenta enviar direto pelo serviço SPP
        await BleClient.write(
          connectedDeviceId,
          SPP_SERVICE_UUID,
          SPP_SERVICE_UUID, // Usando o mesmo UUID como característica
          new DataView(data.buffer)
        );
      }
    } catch (error) {
      console.error("Command send error:", error);
      throw error;
    }
  };

  return (
    <ConnectionContext.Provider
      value={{
        isConnected,
        connectionType,
        serialPort,
        availableDevices,
        connectCable,
        connectBluetooth,
        disconnect,
        sendCommand,
        scanBluetoothDevices,
      }}
    >
      {children}
    </ConnectionContext.Provider>
  );
};

export const useConnection = () => {
  const context = useContext(ConnectionContext);
  if (context === undefined) {
    throw new Error("useConnection must be used within a ConnectionProvider");
  }
  return context;
};
