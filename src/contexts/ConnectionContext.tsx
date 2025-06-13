import React, { createContext, useState, useContext, useEffect, useCallback } from "react";

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

// Constantes para valores mágicos
const BAUD_RATE = 9600;
const COMMAND_TERMINATOR = "\r\n";
const BLUETOOTH_DELIMITER = "\n";
const CONNECTION_CHECK_INTERVAL = 5000;

const ConnectionContext = createContext<ConnectionContextType | undefined>(
  undefined
);

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

  // Função auxiliar para promisificar callbacks do bluetoothSerial
  const promisifyBluetoothCall = useCallback(<T,>(
    fn: (...args: any[]) => void,
    ...args: any[]
  ): Promise<T> => {
    return new Promise((resolve, reject) => {
      fn(...args, resolve, reject);
    });
  }, []);

  // Função para verificar se o Bluetooth está ativo
  const ensureBluetoothEnabled = useCallback(async () => {
    try {
      await promisifyBluetoothCall(window.bluetoothSerial.isEnabled);
    } catch (error) {
      try {
        await promisifyBluetoothCall(window.bluetoothSerial.enable);
      } catch (error) {
        throw new Error("Por favor, ative o Bluetooth do dispositivo");
      }
    }
  }, [promisifyBluetoothCall]);

  // Função centralizada para tratar perda de conexão
  const handleConnectionLoss = useCallback(() => {
    setIsConnected(false);
    setConnectionType(ConnectionType.NONE);
  }, []);

  // Função para verificar se é erro de desconexão Bluetooth
  const isBluetoothDisconnectionError = useCallback((error: any): boolean => {
    const errorString = error?.toString?.() || JSON.stringify(error) || "";
    return [
      "bt socket closed",
      "read return: -1", 
      "IOException",
      "disconnected",
      "Connection lost",
      "Device not connected"
    ].some(keyword => errorString.includes(keyword));
  }, []);

  // Cable connection functions
  const connectCable = useCallback(async () => {
    try {
      if (!navigator.serial) {
        throw new Error("Web Serial API não é suportada neste navegador");
      }

      const port = await navigator.serial.requestPort();
      await port.open({ baudRate: BAUD_RATE });

      setSerialPort(port);
      setConnectionType(ConnectionType.CABLE);
      setIsConnected(true);

      readFromSerial(port);
    } catch (error) {
      console.error("Erro na conexão Serial:", error);
      handleConnectionLoss();
      throw error;
    }
  }, [handleConnectionLoss]);

  const readFromSerial = useCallback(async (port: any) => {
    if (!port) return;

    const reader = port.readable.getReader();
    setReader(reader);
    const decoder = new TextDecoder();

    try {
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        console.log("Recebido da Serial:", decoder.decode(value));
      }
    } catch (error) {
      handleConnectionLoss();
      console.error("Erro na leitura Serial:", error);
    } finally {
      reader.releaseLock();
    }
  }, [handleConnectionLoss]);

  const scanBluetoothDevices = useCallback(async () => {
    try {
      await ensureBluetoothEnabled();

      const devices = await promisifyBluetoothCall<BluetoothDevice[]>(
        window.bluetoothSerial.list
      );

      console.log("Dispositivos encontrados:", devices);
      setAvailableDevices(devices);
    } catch (error) {
      console.error("Erro na busca Bluetooth:", error);
      throw new Error("Falha ao buscar dispositivos Bluetooth");
    }
  }, [ensureBluetoothEnabled, promisifyBluetoothCall]);

  // Função para tratar desconexões inesperadas do Bluetooth
  const handleBluetoothDisconnection = useCallback((error: any) => {
    console.error("Tratando desconexão Bluetooth:", error);

    if (isBluetoothDisconnectionError(error)) {
      console.log("Desconexão detectada, atualizando estado...");
      handleConnectionLoss();

      // Tenta limpar a subscrição silenciosamente
      try {
        window.bluetoothSerial.unsubscribe().catch(() => {});
      } catch (cleanupError) {
        // Ignora erros na limpeza
      }
    } else {
      handleConnectionLoss();
    }
  }, [isBluetoothDisconnectionError, handleConnectionLoss]);

  const connectBluetooth = useCallback(async (deviceId: string) => {
    try {
      if (isConnected) {
        await disconnect();
      }

      await ensureBluetoothEnabled();

      console.log("Conectando ao dispositivo:", deviceId);
      await promisifyBluetoothCall(window.bluetoothSerial.connect, deviceId);

      // Configurar recebimento de dados
      window.bluetoothSerial.subscribe(
        BLUETOOTH_DELIMITER,
        (data: string) => {
          console.log("Recebido do Bluetooth:", data);
        },
        (error: any) => {
          console.error("Erro ao receber dados:", error);
          handleBluetoothDisconnection(error);
        }
      );

      console.log("Conexão estabelecida!");
      setConnectionType(ConnectionType.BLUETOOTH);
      setIsConnected(true);
    } catch (error) {
      console.error("Erro na conexão Bluetooth:", error);
      throw new Error("Falha ao conectar ao dispositivo Bluetooth");
    }
  }, [isConnected, ensureBluetoothEnabled, promisifyBluetoothCall, handleBluetoothDisconnection]);

  const disconnect = useCallback(async () => {
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
        try {
          await promisifyBluetoothCall(window.bluetoothSerial.unsubscribe);
        } catch (error) {
          console.warn("Erro ao cancelar subscrição:", error);
        }

        await promisifyBluetoothCall(window.bluetoothSerial.disconnect);
      }

      handleConnectionLoss();
    } catch (error) {
      console.error("Erro ao desconectar:", error);
      throw new Error("Falha ao desconectar do dispositivo");
    }
  }, [connectionType, reader, serialPort, promisifyBluetoothCall, handleConnectionLoss]);

  const sendCommand = useCallback(async (command: string) => {
    if (!isConnected) {
      throw new Error("Não conectado a nenhum dispositivo");
    }

    const commandWithTerminator = command + COMMAND_TERMINATOR;

    try {
      if (connectionType === ConnectionType.CABLE) {
        const writer = serialPort.writable.getWriter();
        const encoder = new TextEncoder();

        try {
          await writer.write(encoder.encode(commandWithTerminator));
        } finally {
          writer.releaseLock();
        }
      } else if (connectionType === ConnectionType.BLUETOOTH) {
        await promisifyBluetoothCall(
          window.bluetoothSerial.write,
          commandWithTerminator
        );
      }
    } catch (error) {
      console.error("Erro ao enviar comando:", error);

      // Verifica se é um erro de desconexão durante o envio
      if (connectionType === ConnectionType.BLUETOOTH) {
        handleBluetoothDisconnection(error);
      }

      throw new Error("Falha ao enviar comando ao dispositivo");
    }
  }, [isConnected, connectionType, serialPort, promisifyBluetoothCall, handleBluetoothDisconnection]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (isConnected) {
        disconnect().catch(console.error);
      }
    };
  }, [isConnected, disconnect]);

  // Verificação periódica do status da conexão Bluetooth
  useEffect(() => {
    if (!isConnected || connectionType !== ConnectionType.BLUETOOTH) {
      return;
    }

    const intervalId = setInterval(async () => {
      try {
        await promisifyBluetoothCall(window.bluetoothSerial.isConnected);
      } catch (error) {
        console.log("Conexão Bluetooth perdida detectada via verificação periódica");
        handleBluetoothDisconnection(error);
      }
    }, CONNECTION_CHECK_INTERVAL);

    return () => clearInterval(intervalId);
  }, [isConnected, connectionType, promisifyBluetoothCall, handleBluetoothDisconnection]);

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