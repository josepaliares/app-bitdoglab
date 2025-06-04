from machine import UART

# Configuração do UART para HC-05
uart = UART(0, baudrate=9600)
uart.init(9600, bits=8, parity=None, stop=1)

def process_command(cmd):
    """Processa os comandos recebidos no formato 'id:comando'"""
    try:
        # Remove caracteres extras
        cmd = cmd.strip()
        if not cmd:
            return
            
        # Extrai o ID e o comando
        if ':' in cmd:
            cmd_id, command = cmd.split(':', 1)
        else:
            # Se não tiver ID, é um comando legado ou inválido
            uart.write("NACK:INVALID\r\n")
            return
            
        # Se for um comando vazio (heartbeat), responde imediatamente
        if not command.strip():
            uart.write(f"ACK:{cmd_id}\r\n")
            return
            
        # Executa o comando
        exec(command)
        # Envia confirmação de sucesso
        uart.write(f"ACK:{cmd_id}\r\n")
            
    except Exception as e:
        # Em caso de erro, envia NACK com o ID
        if 'cmd_id' in locals():
            uart.write(f"NACK:{cmd_id}\r\n")
        else:
            uart.write("NACK:ERROR\r\n")

def main():
    """Loop principal"""
    print("Sistema iniciado")
    uart.write("Sistema iniciado - Esperando comandos...\r\n")
    buffer = ''
    
    while True:
        if uart.any():
            try:
                char = uart.read(1).decode('utf-8')
                
                # Se encontrar uma nova linha, processa o comando
                if char in ('\n', '\r'):
                    if buffer.strip():
                        print("Recebido:", buffer)  # Debug
                        process_command(buffer)
                    buffer = ''
                else:
                    # Evita buffer overflow
                    if len(buffer) < 256:  # Limite máximo do buffer
                        buffer += char
                    else:
                        print("Buffer overflow - limpando")
                        buffer = ''
                        uart.write("NACK:OVERFLOW\r\n")
                    
            except Exception as e:
                print("Erro:", str(e))  # Debug
                uart.write("NACK:ERROR\r\n")
                buffer = ''

if __name__ == '__main__':
    main()