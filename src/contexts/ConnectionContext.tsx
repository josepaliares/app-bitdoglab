import React, { createContext, useState, useContext, useEffect } from "react";

// Extend the Navigator type to include the serial property
declare global {
  interface Navigator {
    serial?: {
      requestPort: () => Promise<any>;
    };
  }
}

interface ConnectionContextType {
  isConnected: boolean;
  serialPort: any;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  sendCommand: (command: string) => Promise<void>;
}

const ConnectionContext = createContext<ConnectionContextType | undefined>(
  undefined
);

export const ConnectionProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isConnected, setIsConnected] = useState(false);
  const [serialPort, setSerialPort] = useState<any>(null);
  const [reader, setReader] = useState<any>(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (serialPort) {
        disconnect();
      }
    };
  }, []);

  const connect = async () => {
    try {
      if (!navigator.serial) {
        throw new Error("Web Serial API not supported in this browser");
      }

      const port = await navigator.serial.requestPort();
      await port.open({ baudRate: 115200 });

      setSerialPort(port);
      setIsConnected(true);

      // Start reading from the port
      readFromSerial(port);
    } catch (error) {
      console.error("Connection error:", error);
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
        console.log("Received:", decoder.decode(value));
      }
    } catch (error) {
      console.error("Read error:", error);
    } finally {
      reader.releaseLock();
    }
  };

  const disconnect = async () => {
    try {
      if (reader) {
        await reader.cancel();
        reader.releaseLock();
      }

      if (serialPort) {
        await serialPort.close();
      }

      setSerialPort(null);
      setReader(null);
      setIsConnected(false);
    } catch (error) {
      console.error("Disconnection error:", error);
    }
  };

  const sendCommand = async (command: string) => {
    if (!serialPort) {
      throw new Error("Not connected to any device");
    }

    const writer = serialPort.writable.getWriter();
    const encoder = new TextEncoder();

    try {
      await writer.write(encoder.encode(command + "\r\n"));
    } catch (error) {
      console.error("Write error:", error);
      throw error;
    } finally {
      writer.releaseLock();
    }
  };

  return (
    <ConnectionContext.Provider
      value={{
        isConnected,
        serialPort,
        connect,
        disconnect,
        sendCommand,
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
