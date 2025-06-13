import React, { createContext, useState, useContext } from "react";

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
  const [availableDevices, setAvailableDevices] = useState<BluetoothDevice[]>([]);

  // Simula a busca de dispositivos Bluetooth
  const scanBluetoothDevices = async () => {
    // Simula alguns dispositivos para teste
    setAvailableDevices([
      { id: "1", name: "BitDogLab-1", address: "00:11:22:33:44:55" },
      { id: "2", name: "BitDogLab-2", address: "66:77:88:99:AA:BB" },
    ]);
  };

  // Simula conexão via cabo
  const connectCable = async () => {
    setIsConnected(true);
    setConnectionType(ConnectionType.CABLE);
  };

  // Simula conexão Bluetooth
  const connectBluetooth = async (deviceId: string) => {
    setIsConnected(true);
    setConnectionType(ConnectionType.BLUETOOTH);
  };

  // Simula desconexão
  const disconnect = async () => {
    setIsConnected(false);
    setConnectionType(ConnectionType.NONE);
  };

  // Simula envio de comando
  const sendCommand = async (command: string) => {
    console.log("Comando simulado:", command);
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