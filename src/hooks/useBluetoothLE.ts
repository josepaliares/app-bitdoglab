import { useState, useEffect, useCallback, useRef } from 'react';
import { BleClient, textToDataView, type BleDevice } from '@capacitor-community/bluetooth-le';

// UUIDs que estão no firmware da placa
const PICO_SERVICE_UUID = "71153466-1910-4388-A310-000B17D061AB";
const COMMAND_CHAR_UUID = "834E4EDC-2012-42AB-B3D7-001B17D061AB";

export function useBluetoothLE() {
  // Estados reativos do hook
  const [devices, setDevices] = useState<BleDevice[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [connectedDevice, setConnectedDevice] = useState<BleDevice | undefined>();
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // useRef para manter referências que não precisam causar re-render
  const deviceObjectRef = useRef<BleDevice | undefined>(undefined);
  const scanTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  // Função de callback para desconexão
  const onDisconnect = useCallback((deviceId: string) => {
    console.log(`device ${deviceId} disconnected`);
    setIsConnected(false);
    setConnectedDevice(undefined);
    deviceObjectRef.current = undefined;
  }, []);

  // Função de scan
  const scan = useCallback(async () => {
    if (isScanning) {
      console.log('Scan já está em andamento');
      return;
    }

    try {
      setError(null);
      setIsScanning(true);
      setDevices([]); // Limpa a lista anterior

      await BleClient.initialize({ androidNeverForLocation: true });
      console.log('Requesting BLE scan...');

      await BleClient.requestLEScan(
        {
            // Filtra por BitDogLab
            namePrefix: 'BitDogLab'
        },
        (result) => {
          console.log('Received new scan result: ', result.device.name);
          
          // Adiciona o dispositivo à lista, evitando duplicatas
          setDevices(prevDevices => {
            const exists = prevDevices.find(d => d.deviceId === result.device.deviceId);
            if (exists) return prevDevices;
            return [...prevDevices, result.device];
          });
        }
      );

      // Para o scan após 5 segundos
      scanTimeoutRef.current = setTimeout(async () => {
        try {
          await BleClient.stopLEScan();
          console.log('Stopped scanning');
          setIsScanning(false);
        } catch (error) {
          console.error('Erro ao parar o scan:', error);
          setIsScanning(false);
        }
      }, 5000);

    } catch (error) {
      console.error('Erro no scan:', error);
      setError(error instanceof Error ? error.message : 'Erro desconhecido no scan');
      setIsScanning(false);
    }
  }, [isScanning]);

  // Função de conexão
  const connect = useCallback(async (device: BleDevice): Promise<boolean> => {
    try {
      setError(null);
      
      await BleClient.connect(device.deviceId, (deviceId) => onDisconnect(deviceId));
      console.log('connected to device', device.name);
      setConnectedDevice(device);
      setIsConnected(true);
      deviceObjectRef.current = device;
      
      
      return true;
    } catch (error) {
      console.error('Erro na conexão:', error);
      setError(error instanceof Error ? error.message : 'Erro desconhecido na conexão');
      setIsConnected(false);
      setConnectedDevice(undefined);
      deviceObjectRef.current = undefined;
      return false;
    }
  }, [onDisconnect]);

  // Função de desconexão manual
  const disconnect = useCallback(async (): Promise<boolean> => {
    if (!deviceObjectRef.current) {
      console.log('Nenhum dispositivo conectado para desconectar');
      return false;
    }

    try {
      await BleClient.disconnect(deviceObjectRef.current.deviceId);
      console.log('Dispositivo desconectado');
      return true;
    } catch (error) {
      console.error('Erro ao desconectar:', error);
      setError(error instanceof Error ? error.message : 'Erro desconhecido na desconexão');
      return false;
    }
  }, []);

  // Função de envio de dados
  const writeData = useCallback(async (data: string): Promise<boolean> => {
    if (!deviceObjectRef.current || !isConnected) {
      const errorMsg = "Nenhum dispositivo conectado para enviar dados.";
      console.error(errorMsg);
      setError(errorMsg);
      return false;
    }

    // Define o tamanho máximo de cada pedaço e o sinal de fim de transmissão
    const CHUNK_SIZE = 20;
    const END_OF_TRANSMISSION_SIGNAL = "_EOT_";

    try {
      setError(null);
      console.log(`Enviando comando (${data.length} bytes)...`);

      // Loop para enviar a string em pedaços
      for (let i = 0; i < data.length; i += CHUNK_SIZE) {
        const chunk = data.substring(i, i + CHUNK_SIZE);
        const dataToSend = textToDataView(chunk);

        await BleClient.write(
          deviceObjectRef.current.deviceId,
          PICO_SERVICE_UUID,
          COMMAND_CHAR_UUID,
          dataToSend
        );
        
        // Pequena pausa para garantir a entrega do pacote
        await new Promise(resolve => setTimeout(resolve, 20));
      }

      // Após enviar todos os pedaços, envia o sinal de que a transmissão acabou
      const finalSignal = textToDataView(END_OF_TRANSMISSION_SIGNAL);
      await BleClient.write(
        deviceObjectRef.current.deviceId,
        PICO_SERVICE_UUID,
        COMMAND_CHAR_UUID,
        finalSignal
      );

      console.log('Comando enviado com sucesso.');
      return true;
    } catch (error) {
      console.error('Falha ao enviar comando', error);
      setError(error instanceof Error ? error.message : 'Erro desconhecido no envio');
      return false;
    }
  }, [isConnected]);

  // 🧹 Cleanup quando o componente é desmontado
  useEffect(() => {
    return () => {
      // Para o scan se estiver rodando
      if (scanTimeoutRef.current) {
        clearTimeout(scanTimeoutRef.current);
      }
      
      // Para o scan BLE se estiver ativo
      if (isScanning) {
        BleClient.stopLEScan().catch(console.error);
      }
      
      // Desconecta se estiver conectado
      if (deviceObjectRef.current && isConnected) {
        BleClient.disconnect(deviceObjectRef.current.deviceId).catch(console.error);
      }
    };
  }, [isScanning, isConnected]);

  // 🎯 Retorna o estado e as funções para o componente
  return {
    // Estados
    devices,
    isConnected,
    connectedDevice,
    isScanning,
    error,
    
    // Funções
    scan,
    connect,
    disconnect,
    writeData,
    
    // Função utilitária para limpar erros
    clearError: useCallback(() => setError(null), [])
  };
}