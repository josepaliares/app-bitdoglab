import React, { createContext, useState, useContext, useEffect, useCallback } from "react";

export enum ConnectionType {
  CABLE = "cable",
  BLUETOOTH = "bluetooth", 
  BLE = "ble", // Nova opção BLE
  NONE = "none",
}

interface BluetoothDevice {
  id: string;
  name: string;
  address: string;
}

// Nova interface para dispositivos BLE
interface BLEDevice {
  id: string;
  name: string;
  device?: any; // Referência ao dispositivo nativo (tipo genérico para compatibilidade)
}

interface ConnectionContextType {
  isConnected: boolean;
  connectionType: ConnectionType;
  serialPort: any;
  availableDevices: BluetoothDevice[];
  availableBLEDevices: BLEDevice[]; // Nova propriedade
  connectCable: () => Promise<void>;
  connectBluetooth: (deviceId: string) => Promise<void>;
  connectBLE: (deviceId: string) => Promise<void>; // Nova função
  disconnect: () => Promise<void>;
  sendCommand: (command: string) => Promise<void>;
  scanBluetoothDevices: () => Promise<void>;
  scanBLEDevices: () => Promise<void>; // Nova função
}

const BAUD_RATE = 9600;
const COMMAND_TERMINATOR = "\r\n";
const BLUETOOTH_DELIMITER = "\n";
const CONNECTION_CHECK_INTERVAL = 5000;
const BLUETOOTH_ERRORS = ["bt socket closed", "read return: -1", "IOException", "disconnected", "Connection lost", "Device not connected"];

// UUIDs para o serviço BLE customizado da Pico 2 W
const BLE_SERVICE_UUID = "12345678-1234-1234-1234-123456789abc";
const BLE_CHARACTERISTIC_UUID = "87654321-4321-4321-4321-cba987654321";

const ConnectionContext = createContext<ConnectionContextType | undefined>(undefined);

export const ConnectionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [connectionType, setConnectionType] = useState<ConnectionType>(ConnectionType.NONE);
  const [serialPort, setSerialPort] = useState<any>(null);
  const [reader, setReader] = useState<any>(null);
  const [availableDevices, setAvailableDevices] = useState<BluetoothDevice[]>([]);
  
  // Estados para BLE
  const [availableBLEDevices, setAvailableBLEDevices] = useState<BLEDevice[]>([]);
  const [bleDevice, setBLEDevice] = useState<any | null>(null);
  const [bleCharacteristic, setBLECharacteristic] = useState<any | null>(null);

  const promisifyBluetooth = useCallback(<T,>(fn: (...args: any[]) => void, ...args: any[]): Promise<T> => 
    new Promise((resolve, reject) => fn(...args, resolve, reject)), []);

  const resetConnection = useCallback(() => {
    setIsConnected(false);
    setConnectionType(ConnectionType.NONE);
    setBLEDevice(null);
    setBLECharacteristic(null);
  }, []);

  const isBluetoothError = useCallback((error: any): boolean => {
    const errorStr = error?.toString?.() || JSON.stringify(error) || "";
    return BLUETOOTH_ERRORS.some(keyword => errorStr.includes(keyword));
  }, []);

  // **NOVA FUNÇÃO: Escaneamento BLE**
  const scanBLEDevices = useCallback(async () => {
    try {
      // Verifica se o navegador suporta Web Bluetooth
      if (!('bluetooth' in navigator)) {
        throw new Error("Web Bluetooth API não é suportada neste navegador");
      }

      console.log("🔍 Iniciando escaneamento BLE...");
      
      // Solicita permissão e escaneia dispositivos BLE
      // Procura por dispositivos que anunciem nosso serviço customizado
      const device = await (navigator as any).bluetooth.requestDevice({
        filters: [
          { services: [BLE_SERVICE_UUID] }, // Procura pelo nosso serviço
          { namePrefix: "Pico2W" } // Ou dispositivos que começam com "Pico2W"
        ],
        optionalServices: [BLE_SERVICE_UUID] // Serviços opcionais
      });

      const bleDevices: BLEDevice[] = [{
        id: device.id || device.name || "unknown",
        name: device.name || "Dispositivo BLE Desconhecido",
        device: device
      }];

      setAvailableBLEDevices(bleDevices);
      console.log("✅ Dispositivos BLE encontrados:", bleDevices.length);
      
    } catch (error: any) {
      console.error("❌ Erro no escaneamento BLE:", error);
      if (error.name === 'NotFoundError') {
        throw new Error("Nenhum dispositivo BLE compatível encontrado");
      }
      throw new Error("Falha ao buscar dispositivos BLE: " + error.message);
    }
  }, []);

  // **NOVA FUNÇÃO: Conexão BLE**
  const connectBLE = useCallback(async (deviceId: string) => {
    try {
      console.log("🔗 Iniciando conexão BLE com dispositivo:", deviceId);
      
      if (isConnected) {
        // Chama disconnect inline para evitar dependência circular
        try {
          if (connectionType === ConnectionType.CABLE) {
            if (reader) {
              await reader.cancel();
              reader.releaseLock();
            }
            if (serialPort) await serialPort.close();
            setSerialPort(null);
            setReader(null);
            
          } else if (connectionType === ConnectionType.BLUETOOTH) {
            try { await promisifyBluetooth(window.bluetoothSerial.unsubscribe); } catch {}
            await promisifyBluetooth(window.bluetoothSerial.disconnect);
            
          } else if (connectionType === ConnectionType.BLE) {
            if (bleCharacteristic) {
              try {
                await bleCharacteristic.stopNotifications();
              } catch (e) {
                console.warn("Erro ao parar notificações BLE:", e);
              }
            }
            if (bleDevice && bleDevice.gatt && bleDevice.gatt.connected) {
              bleDevice.gatt.disconnect();
            }
          }
          resetConnection();
        } catch (error) {
          console.error("Erro ao desconectar:", error);
        }
      }

      // Encontra o dispositivo na lista
      const targetDevice = availableBLEDevices.find(d => d.id === deviceId);
      if (!targetDevice || !targetDevice.device) {
        throw new Error("Dispositivo BLE não encontrado");
      }

      const device = targetDevice.device;
      
      // **PASSO 1: Conecta ao GATT Server**
      console.log("📡 Conectando ao servidor GATT...");
      const server = await device.gatt.connect();
      
      // **PASSO 2: Obtém o serviço primário**
      console.log("🔧 Obtendo serviço primário...");
      const service = await server.getPrimaryService(BLE_SERVICE_UUID);
      
      // **PASSO 3: Obtém a característica de comunicação**
      console.log("📝 Obtendo característica de comunicação...");
      const characteristic = await service.getCharacteristic(BLE_CHARACTERISTIC_UUID);
      
      // **PASSO 4: Configura notificações para receber dados**
      console.log("🔔 Configurando notificações...");
      await characteristic.startNotifications();
      
      // **PASSO 5: Define callback para dados recebidos**
      characteristic.addEventListener('characteristicvaluechanged', (event: any) => {
        const value = event.target.value;
        const decoder = new TextDecoder();
        const receivedData = decoder.decode(value);
        console.log("📩 Dados recebidos via BLE:", receivedData);
      });

      // **PASSO 6: Salva referências e atualiza estado**
      setBLEDevice(device);
      setBLECharacteristic(characteristic);
      setConnectionType(ConnectionType.BLE);
      setIsConnected(true);
      
      console.log("✅ Conexão BLE estabelecida com sucesso!");
      
    } catch (error: any) {
      console.error("❌ Erro na conexão BLE:", error);
      resetConnection();
      throw new Error("Falha ao conectar dispositivo BLE: " + error.message);
    }
  }, [isConnected, availableBLEDevices, resetConnection, connectionType, reader, serialPort, bleCharacteristic, bleDevice, promisifyBluetooth]);

  const ensureBluetoothEnabled = useCallback(async () => {
    try {
      await promisifyBluetooth(window.bluetoothSerial.isEnabled);
    } catch {
      await promisifyBluetooth(window.bluetoothSerial.enable).catch(() => {
        throw new Error("Por favor, ative o Bluetooth do dispositivo");
      });
    }
  }, [promisifyBluetooth]);

  const handleBluetoothError = useCallback((error: any) => {
    console.error("Erro Bluetooth:", error);
    if (isBluetoothError(error)) {
      resetConnection();
      try { window.bluetoothSerial.unsubscribe().catch(() => {}); } catch {}
    } else {
      resetConnection();
    }
  }, [isBluetoothError, resetConnection]);

  const connectCable = useCallback(async () => {
    if (!('serial' in navigator)) throw new Error("Web Serial API não é suportada neste navegador");
    
    try {
      const port = await (navigator as any).serial.requestPort();
      await port.open({ baudRate: BAUD_RATE });
      
      setSerialPort(port);
      setConnectionType(ConnectionType.CABLE);
      setIsConnected(true);
      
      // Leitura assíncrona
      const portReader = port.readable.getReader();
      setReader(portReader);
      const decoder = new TextDecoder();
      
      (async () => {
        try {
          while (true) {
            const { value, done } = await portReader.read();
            if (done) break;
            if (false) {
              console.log("Recebido da Serial:", decoder.decode(value));
            }
            // Dados recebidos podem ser processados aqui se necessário
          }
        } catch (error) {
          resetConnection();
          console.error("Erro na leitura Serial:", error);
        } finally {
          portReader.releaseLock();
        }
      })();
    } catch (error) {
      console.error("Erro na conexão Serial:", error);
      resetConnection();
      throw error;
    }
  }, [resetConnection]);

  const scanBluetoothDevices = useCallback(async () => {
    try {
      await ensureBluetoothEnabled();
      const devices = await promisifyBluetooth<BluetoothDevice[]>(window.bluetoothSerial.list);
      setAvailableDevices(devices);
    } catch (error) {
      console.error("Erro na busca Bluetooth:", error);
      throw new Error("Falha ao buscar dispositivos Bluetooth");
    }
  }, [ensureBluetoothEnabled, promisifyBluetooth]);

  const connectBluetooth = useCallback(async (deviceId: string) => {
    try {
      if (isConnected) {
        // Chama disconnect inline para evitar dependência circular
        try {
          if (connectionType === ConnectionType.CABLE) {
            if (reader) {
              await reader.cancel();
              reader.releaseLock();
            }
            if (serialPort) await serialPort.close();
            setSerialPort(null);
            setReader(null);
            
          } else if (connectionType === ConnectionType.BLUETOOTH) {
            try { await promisifyBluetooth(window.bluetoothSerial.unsubscribe); } catch {}
            await promisifyBluetooth(window.bluetoothSerial.disconnect);
            
          } else if (connectionType === ConnectionType.BLE) {
            if (bleCharacteristic) {
              try {
                await bleCharacteristic.stopNotifications();
              } catch (e) {
                console.warn("Erro ao parar notificações BLE:", e);
              }
            }
            if (bleDevice && bleDevice.gatt && bleDevice.gatt.connected) {
              bleDevice.gatt.disconnect();
            }
          }
          resetConnection();
        } catch (error) {
          console.error("Erro ao desconectar:", error);
        }
      }
      
      await ensureBluetoothEnabled();
      
      await promisifyBluetooth(window.bluetoothSerial.connect, deviceId);
      
      window.bluetoothSerial.subscribe(
        BLUETOOTH_DELIMITER,
        (data: string) => console.log("Recebido do Bluetooth:", data),
        handleBluetoothError
      );
      
      setConnectionType(ConnectionType.BLUETOOTH);
      setIsConnected(true);
    } catch (error) {
      console.error("Erro na conexão Bluetooth:", error);
      throw new Error("Falha ao conectar ao dispositivo Bluetooth");
    }
  }, [isConnected, ensureBluetoothEnabled, promisifyBluetooth, handleBluetoothError, connectionType, reader, serialPort, bleCharacteristic, bleDevice, resetConnection]);

  const disconnect = useCallback(async () => {
    try {
      if (connectionType === ConnectionType.CABLE) {
        if (reader) {
          await reader.cancel();
          reader.releaseLock();
        }
        if (serialPort) await serialPort.close();
        setSerialPort(null);
        setReader(null);
        
      } else if (connectionType === ConnectionType.BLUETOOTH) {
        try { await promisifyBluetooth(window.bluetoothSerial.unsubscribe); } catch {}
        await promisifyBluetooth(window.bluetoothSerial.disconnect);
        
      } else if (connectionType === ConnectionType.BLE) {
        // **DESCONEXÃO BLE**
        if (bleCharacteristic) {
          try {
            await bleCharacteristic.stopNotifications();
          } catch (e) {
            console.warn("Erro ao parar notificações BLE:", e);
          }
        }
        if (bleDevice && bleDevice.gatt && bleDevice.gatt.connected) {
          bleDevice.gatt.disconnect();
        }
      }
      
      resetConnection();
    } catch (error) {
      console.error("Erro ao desconectar:", error);
      throw new Error("Falha ao desconectar do dispositivo");
    }
  }, [connectionType, reader, serialPort, promisifyBluetooth, resetConnection, bleCharacteristic, bleDevice]);

  const sendCommand = useCallback(async (command: string) => {
    if (!isConnected) throw new Error("Não conectado a nenhum dispositivo");
    
    const fullCommand = command + COMMAND_TERMINATOR;
    
    try {
      if (connectionType === ConnectionType.CABLE) {
        const writer = serialPort.writable.getWriter();
        try {
          await writer.write(new TextEncoder().encode(fullCommand));
        } finally {
          writer.releaseLock();
        }
        
      } else if (connectionType === ConnectionType.BLUETOOTH) {
        await promisifyBluetooth(window.bluetoothSerial.write, fullCommand);
        
      } else if (connectionType === ConnectionType.BLE) {
        // **ENVIO DE COMANDO VIA BLE**
        if (!bleCharacteristic) {
          throw new Error("Característica BLE não disponível");
        }
        
        console.log("📤 Enviando comando via BLE:", fullCommand);
        const encoder = new TextEncoder();
        const data = encoder.encode(fullCommand);
        
        // Escreve o comando na característica
        await bleCharacteristic.writeValue(data);
      }
      
    } catch (error) {
      console.error("Erro ao enviar comando:", error);
      if (connectionType === ConnectionType.BLUETOOTH) {
        handleBluetoothError(error);
      } else if (connectionType === ConnectionType.BLE) {
        // Para BLE, reconecta se necessário
        resetConnection();
      }
      throw new Error("Falha ao enviar comando ao dispositivo");
    }
  }, [isConnected, connectionType, serialPort, promisifyBluetooth, handleBluetoothError, bleCharacteristic, resetConnection]);

  // Cleanup e verificação periódica
  useEffect(() => {
    return () => { if (isConnected) disconnect().catch(console.error); };
  }, [isConnected, disconnect]);

  useEffect(() => {
    if (!isConnected) return;
    
    // Verificação específica para Bluetooth clássico
    if (connectionType === ConnectionType.BLUETOOTH) {
      const interval = setInterval(async () => {
        try {
          await promisifyBluetooth(window.bluetoothSerial.isConnected);
        } catch (error) {
          handleBluetoothError(error);
        }
      }, CONNECTION_CHECK_INTERVAL);
      
      return () => clearInterval(interval);
    }
    
    // Verificação para BLE
    if (connectionType === ConnectionType.BLE && bleDevice) {
      const interval = setInterval(() => {
        if (bleDevice.gatt && !bleDevice.gatt.connected) {
          console.warn("⚠️ Conexão BLE perdida");
          resetConnection();
        }
      }, CONNECTION_CHECK_INTERVAL);
      
      return () => clearInterval(interval);
    }
  }, [isConnected, connectionType, promisifyBluetooth, handleBluetoothError, bleDevice, resetConnection]);

  return (
    <ConnectionContext.Provider value={{
      isConnected, 
      connectionType, 
      serialPort, 
      availableDevices,
      availableBLEDevices, // Nova propriedade
      connectCable, 
      connectBluetooth, 
      connectBLE, // Nova função
      disconnect, 
      sendCommand, 
      scanBluetoothDevices,
      scanBLEDevices, // Nova função
    }}>
      {children}
    </ConnectionContext.Provider>
  );
};

export const useConnection = () => {
  const context = useContext(ConnectionContext);
  if (!context) throw new Error("useConnection must be used within a ConnectionProvider");
  return context;
};