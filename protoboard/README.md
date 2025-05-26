# Código da Placa BitDogLab

Este é o código que deve ser carregado na placa para permitir a comunicação via Bluetooth com o aplicativo BitDogLab.

## 📋 Visão Geral

O código implementa um interpretador MicroPython simples que:

1. Configura a comunicação UART para o módulo HC-05
2. Recebe comandos via Bluetooth
3. Executa os comandos recebidos
4. Retorna o resultado da execução

## 🔧 Configuração do Hardware

### Conexão do HC-05

O módulo Bluetooth HC-05 deve ser conectado à UART0 da placa:

- TX do HC-05 → RX da placa
- RX do HC-05 → TX da placa
- VCC do HC-05 → 3.3V ou 5V (conforme especificação do seu módulo)
- GND do HC-05 → GND

### Configurações da UART

```python
uart = UART(0, baudrate=9600)
uart.init(9600, bits=8, parity=None, stop=1)
```

## 🤔 Como Funciona

1. Ao iniciar, o código imprime "Sistema iniciado" e envia essa mensagem via Bluetooth
2. Entra em um loop infinito aguardando dados na porta serial
3. Quando recebe dados:
   - Acumula os caracteres em um buffer até encontrar uma nova linha (\n ou \r)
   - Remove espaços extras do comando
   - Executa o comando usando `exec()`
   - Retorna "OK" se executou com sucesso ou mensagem de erro se falhou

## 📝 Protocolo de Comunicação

### Formato dos Comandos

- Cada comando deve ser terminado com \n ou \r
- Os comandos são executados exatamente como recebidos
- A placa retorna:
  - "OK\r\n" para execução bem sucedida
  - "Erro: [mensagem]\r\n" em caso de falha

### Exemplo de Comunicação

```
App envia: from machine import Pin\r\n
Placa responde: OK\r\n

App envia: import neopixel\r\n
Placa responde: OK\r\n

App envia: np = neopixel.NeoPixel(Pin(7), 25)\r\n
Placa responde: OK\r\n
```

## ⚠️ Considerações Importantes

1. **Buffer**: O sistema lê caractere por caractere para evitar perda de dados ou comandos corrompidos.

2. **Recuperação de Erros**: Se um comando gerar erro, o sistema continua funcionando e pronto para o próximo comando.

## 🚀 Como Usar

1. Carregue este código na sua placa usando Thonny ou sua ferramenta preferida
2. Conecte o módulo HC-05 conforme as instruções acima
3. Energize a placa
4. Use o aplicativo BitDogLab para se conectar e enviar comandos

## 🔍 Depuração

Se algo não estiver funcionando:

1. Verifique se o LED do HC-05 está piscando continuamente (aguardando conexão) ou em intervalos longos (conectado)
2. Confirme se o baudrate está correto (9600 é o padrão do HC-05)
3. Verifique se os pinos TX/RX estão conectados corretamente
4. Use o monitor serial do Thonny para ver as mensagens de debug da placa
