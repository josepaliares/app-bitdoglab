import React, { createContext, useState, useContext, useEffect } from "react";

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
  connectBluetooth: (deviceAddress: string) => Promise<void>;
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

  // Cleanup on unmount
  useEffect(() => {
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

      // Start reading from the port
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
      if (!window.bluetoothSerial) {
        throw new Error("Bluetooth Serial not available");
      }

      // Check if Bluetooth is enabled
      try {
        await window.bluetoothSerial.isEnabled();
      } catch (error) {
        // If not enabled, try to enable it
        await window.bluetoothSerial.enable();
      }

      const { devices } = await window.bluetoothSerial.list();
      setAvailableDevices(
        devices.map(
          (device: { id: string; name: string; address: string }) => ({
            id: device.id,
            name: device.name,
            address: device.address,
          })
        )
      );
    } catch (error) {
      console.error("Bluetooth scan error:", error);
      throw error;
    }
  };

  const connectBluetooth = async (deviceAddress: string) => {
    try {
      if (!window.bluetoothSerial) {
        throw new Error("Bluetooth Serial not available");
      }

      // Disconnect if already connected
      if (isConnected) {
        await disconnect();
      }

      await window.bluetoothSerial.connect(deviceAddress);
      setConnectionType(ConnectionType.BLUETOOTH);
      setIsConnected(true);

      // Subscribe to receive data
      await window.bluetoothSerial.subscribe("\n", (data: string) => {
        console.log("Received from Bluetooth:", data);
      });
    } catch (error) {
      console.error("Bluetooth connection error:", error);
      setIsConnected(false);
      throw error;
    }
  };

  // Disconnect from any connection type
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
        if (window.bluetoothSerial) {
          await window.bluetoothSerial.disconnect();
        }
      }

      setIsConnected(false);
      setConnectionType(ConnectionType.NONE);
    } catch (error) {
      console.error("Disconnection error:", error);
      throw error;
    }
  };

  // Unified command sending function
  const sendCommand = async (command: string) => {
    if (!isConnected) {
      throw new Error("Not connected to any device");
    }

    try {
      if (connectionType === ConnectionType.CABLE) {
        // Send command via serial
        const writer = serialPort.writable.getWriter();
        const encoder = new TextEncoder();

        try {
          await writer.write(encoder.encode(command + "\r\n"));
        } finally {
          writer.releaseLock();
        }
      } else if (connectionType === ConnectionType.BLUETOOTH) {
        // Send command via Bluetooth
        if (!window.bluetoothSerial) {
          throw new Error("Bluetooth Serial not available");
        }
        await window.bluetoothSerial.write(command + "\r\n");
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
