import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback,
} from "react";

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
  lastHeartbeat: number;
  startPeriodicRead: () => void;
  stopPeriodicRead: () => void;
  isPeriodicReadActive: boolean;
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
  const [lastHeartbeat, setLastHeartbeat] = useState<number>(Date.now());
  const [pendingCommands, setPendingCommands] = useState<
    Map<string, PendingCommand>
  >(new Map());
  const [isPeriodicReadActive, setIsPeriodicReadActive] = useState(false);
  const [periodicInterval, setPeriodicInterval] =
    useState<NodeJS.Timeout | null>(null);

  interface PendingCommand {
    id: string;
    command: string;
    timestamp: number;
    resolve: (value: void | PromiseLike<void>) => void;
    reject: (reason?: any) => void;
  }

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

  // Função para processar as respostas recebidas
  const processResponse = (response: string) => {
    // Verifica se é uma resposta numérica do print(1)
    if (response.trim() === "1") {
      console.log("Recebido resposta do print(1):", response);
      updateHeartbeat();
      return;
    }

    // Formato esperado da resposta: "ACK:id" ou "NACK:id"
    const parts = response.trim().split(":");
    if (parts.length !== 2) return;

    const [type, id] = parts;
    if (!id) return;

    setPendingCommands((prev) => {
      const newMap = new Map(prev);
      const command = newMap.get(id);

      if (command) {
        if (type === "ACK") {
          command.resolve();
        } else {
          command.reject(new Error("Comando rejeitado pelo dispositivo"));
        }
        newMap.delete(id);
      }

      return newMap;
    });

    // Se for um ACK de heartbeat, atualiza o timestamp
    if (type === "ACK") {
      updateHeartbeat();
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
        if (done) {
          console.log("Conexão Serial encerrada");
          await disconnect();
          break;
        }
        const response = decoder.decode(value);
        console.log("Recebido da Serial:", response);
        processResponse(response);
      }
    } catch (error) {
      console.error("Erro na leitura Serial:", error);
      await disconnect();
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
          processResponse(data);
        },
        async (error: any) => {
          console.error("Erro ao receber dados Bluetooth:", error);
          await disconnect();
        }
      );

      console.log("Conexão estabelecida!");
      setConnectionType(ConnectionType.BLUETOOTH);
      setIsConnected(true);
    } catch (error) {
      console.error("Erro na conexão Bluetooth:", error);
      setIsConnected(false);
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

    return new Promise<void>(async (resolve, reject) => {
      try {
        const commandId = generateCommandId();
        const commandWithId = `${commandId}:${command}`; // Formato: "id:comando"

        // Registra o comando pendente
        setPendingCommands((prev) => {
          const newMap = new Map(prev);
          newMap.set(commandId, {
            id: commandId,
            command,
            timestamp: Date.now(),
            resolve,
            reject,
          });
          return newMap;
        });

        // Envia o comando com ID
        if (connectionType === ConnectionType.CABLE) {
          const writer = serialPort.writable.getWriter();
          const encoder = new TextEncoder();
          try {
            await writer.write(encoder.encode(commandWithId + "\r\n"));
          } finally {
            writer.releaseLock();
          }
        } else if (connectionType === ConnectionType.BLUETOOTH) {
          await promisifyBluetoothCall(
            window.bluetoothSerial.write,
            commandWithId + "\r\n"
          );
        }
      } catch (error) {
        console.error("Erro ao enviar comando:", error);
        reject(new Error("Falha ao enviar comando ao dispositivo"));
      }
    });
  };

  // Função para gerar ID único para cada comando
  const generateCommandId = () => {
    return Math.random().toString(36).substring(2, 15);
  };

  // Função para limpar comandos antigos que não receberam ACK
  const cleanupOldCommands = useCallback(() => {
    const now = Date.now();
    let hasTimedOutCommands = false;

    setPendingCommands((prev) => {
      const newMap = new Map(prev);
      for (const [id, command] of newMap) {
        if (now - command.timestamp > 3000) {
          // Reduzido para 3 segundos
          hasTimedOutCommands = true;
          command.reject(new Error("Timeout: Comando não confirmado"));
          newMap.delete(id);
        }
      }
      return newMap;
    });

    // Se houver comandos que não receberam resposta, provavelmente perdemos a conexão
    if (hasTimedOutCommands) {
      console.log(
        "Detectados comandos sem resposta - possível perda de conexão"
      );
      disconnect();
    }
  }, []);

  // Efeito para limpar comandos antigos periodicamente
  useEffect(() => {
    if (!isConnected) return;

    const intervalId = setInterval(cleanupOldCommands, 1000);
    return () => clearInterval(intervalId);
  }, [isConnected, cleanupOldCommands]);

  // Função para atualizar o heartbeat
  const updateHeartbeat = useCallback(() => {
    setLastHeartbeat(Date.now());
  }, []);

  // Efeito para verificar o heartbeat periodicamente
  useEffect(() => {
    if (!isConnected) return;

    const checkConnection = () => {
      const now = Date.now();
      const heartbeatAge = now - lastHeartbeat;

      // Se o último heartbeat foi há mais de 3 segundos, consideramos que a conexão caiu
      if (heartbeatAge > 3000) {
        console.log(
          "Conexão perdida: sem confirmação de heartbeat por mais de 3 segundos"
        );
        disconnect();
      }
    };

    const intervalId = setInterval(checkConnection, 1000);
    return () => clearInterval(intervalId);
  }, [isConnected, lastHeartbeat]);

  // Efeito para atualizar o heartbeat periodicamente enquanto houver conexão
  useEffect(() => {
    if (!isConnected) return;

    const sendHeartbeat = async () => {
      try {
        // Tenta enviar um comando vazio para verificar a conexão
        // O heartbeat só será atualizado quando receber o ACK
        await sendCommand("");
      } catch (error) {
        console.log("Erro ao enviar heartbeat:", error);
      }
    };

    // Configura heartbeat inicial
    const initialHeartbeat = async () => {
      try {
        await sendCommand("");
      } catch (error) {
        console.log("Erro ao enviar heartbeat inicial:", error);
      }
    };
    initialHeartbeat();

    // Configura o intervalo para enviar heartbeats mais frequentemente
    const intervalId = setInterval(sendHeartbeat, 1000);
    return () => clearInterval(intervalId);
  }, [isConnected]);

  // Função para iniciar a leitura periódica
  const startPeriodicRead = useCallback(() => {
    if (!isConnected || isPeriodicReadActive) return;

    setIsPeriodicReadActive(true);
    const interval = setInterval(async () => {
      try {
        // Envia o comando de interrupção seguido do print
        await sendCommand("\x03\r");
        await sendCommand("print(1)\r");
      } catch (error) {
        console.error("Erro na comunicação periódica:", error);
        stopPeriodicRead();
      }
    }, 5000);

    setPeriodicInterval(interval);
  }, [isConnected, isPeriodicReadActive]);

  // Função para parar a leitura periódica
  const stopPeriodicRead = useCallback(() => {
    if (periodicInterval) {
      clearInterval(periodicInterval);
      setPeriodicInterval(null);
    }
    setIsPeriodicReadActive(false);
  }, [periodicInterval]);

  // Efeito para limpar o intervalo quando desconectar
  useEffect(() => {
    if (!isConnected) {
      stopPeriodicRead();
    }
  }, [isConnected, stopPeriodicRead]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (isConnected) {
        disconnect();
      }
    };
  }, []);

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
        lastHeartbeat,
        startPeriodicRead,
        stopPeriodicRead,
        isPeriodicReadActive,
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
