import React, { createContext, useState, useContext, useEffect } from "react";

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
  const promisifyBluetoothCall = <T,>(
    fn: (...args: any[]) => void,
    ...args: any[]
  ): Promise<T> => {
    return new Promise((resolve, reject) => {
      fn(...args, resolve, reject);
    });
  };

  // Função para verificar se o Bluetooth está ativo
  const ensureBluetoothEnabled = async () => {
    try {
      await promisifyBluetoothCall(window.bluetoothSerial.isEnabled);
    } catch (error) {
      try {
        await promisifyBluetoothCall(window.bluetoothSerial.enable);
      } catch (error) {
        throw new Error("Por favor, ative o Bluetooth do dispositivo");
      }
    }
  };

  // Cable connection functions
  const connectCable = async () => {
    try {
      if (!navigator.serial) {
        throw new Error("Web Serial API não é suportada neste navegador");
      }

      const port = await navigator.serial.requestPort();
      await port.open({ baudRate: 9600 }); // HC-05 geralmente usa 9600 baud rate por padrão

      setSerialPort(port);
      setConnectionType(ConnectionType.CABLE);
      setIsConnected(true);

      readFromSerial(port);
    } catch (error) {
      console.error("Erro na conexão Serial:", error);
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
        // Process received data if needed
        console.log("Recebido da Serial:", decoder.decode(value));
      }
    } catch (error) {
      setIsConnected(false);
      console.error("Erro na leitura Serial:", error);
    } finally {
      reader.releaseLock();
    }
  };

  const scanBluetoothDevices = async () => {
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
  };

  // Função para tratar desconexões inesperadas do Bluetooth
  const handleBluetoothDisconnection = (error: any) => {
    console.error("Tratando desconexão Bluetooth:", error);

    // Verifica se é um erro de socket fechado ou desconexão
    const errorString = error?.toString?.() || JSON.stringify(error) || "";
    const isDisconnectionError =
      errorString.includes("bt socket closed") ||
      errorString.includes("read return: -1") ||
      errorString.includes("IOException") ||
      errorString.includes("disconnected") ||
      errorString.includes("Connection lost") ||
      errorString.includes("Device not connected");

    if (isDisconnectionError) {
      console.log("Desconexão detectada, atualizando estado...");
      setIsConnected(false);
      setConnectionType(ConnectionType.NONE);

      // Tenta limpar a subscrição silenciosamente
      try {
        window.bluetoothSerial.unsubscribe().catch(() => {
          // Ignora erros na limpeza
        });
      } catch (cleanupError) {
        // Ignora erros na limpeza
      }
    } else {
      // Para outros tipos de erro, apenas marca como desconectado
      setIsConnected(false);
    }
  };

  const connectBluetooth = async (deviceId: string) => {
    try {
      if (isConnected) {
        await disconnect();
      }

      await ensureBluetoothEnabled();

      console.log("Conectando ao dispositivo:", deviceId);
      await promisifyBluetoothCall(window.bluetoothSerial.connect, deviceId);

      // Configurar recebimento de dados
      window.bluetoothSerial.subscribe(
        "\n",
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
        try {
          // Primeiro tenta cancelar a subscrição
          await promisifyBluetoothCall(window.bluetoothSerial.unsubscribe);
        } catch (error) {
          console.warn("Erro ao cancelar subscrição:", error);
        }

        // Então desconecta
        await promisifyBluetoothCall(window.bluetoothSerial.disconnect);
      }

      setIsConnected(false);
      setConnectionType(ConnectionType.NONE);
    } catch (error) {
      console.error("Erro ao desconectar:", error);
      throw new Error("Falha ao desconectar do dispositivo");
    }
  };

  const sendCommand = async (command: string) => {
    if (!isConnected) {
      throw new Error("Não conectado a nenhum dispositivo");
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
      } else if (connectionType === ConnectionType.BLUETOOTH) {
        await promisifyBluetoothCall(
          window.bluetoothSerial.write,
          command + "\r\n"
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
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (isConnected) {
        disconnect();
      }
    };
  }, []);

  // Verificação periódica do status da conexão Bluetooth
  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (isConnected && connectionType === ConnectionType.BLUETOOTH) {
      // Verifica o status da conexão a cada 5 segundos
      intervalId = setInterval(async () => {
        try {
          await promisifyBluetoothCall(window.bluetoothSerial.isConnected);
        } catch (error) {
          console.log(
            "Conexão Bluetooth perdida detectada via verificação periódica"
          );
          handleBluetoothDisconnection(error);
        }
      }, 5000);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isConnected, connectionType]);

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
