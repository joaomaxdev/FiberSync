import paramiko
import time
import sys
import os

# Adicione o caminho para o módulo de configuração
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '../../../src'))
from config import hostname, port, username, password

def execute_command(channel, command):
    """Executa um comando na OLT e retorna a saída."""
    channel.send(command + '\n')
    time.sleep(1)  # Aguarde um momento para o comando ser processado
    output = channel.recv(65536).decode('utf-8')
    return output

def format_onu_result(result):
    """Formata o resultado da busca da ONU em uma tabela."""
    parts = result.split(':')
    if len(parts) == 2:
        onu_info = parts[0].split('/')
        slot = onu_info[1]  # Posição do Slot
        pon = onu_info[2]   # Posição do PON
        id_onu = parts[1]   # ID da ONU
        return (
            "\nSUA ONU ESTÁ EM:\n"
            "+------+-----+---------+\n"
            "| Slot | Pon | ID Onu |\n"
            "+------+-----+---------+\n"
            f"|  {slot}  | {pon}  |   {id_onu.strip()}   |\n"
            "+------+-----+---------+"
        )
    return "Formato de resultado inválido."

def search_onu_by_sn(serial):
    """Busca a ONU pelo número de série."""
    command = f"show gpon onu by sn {serial}"

    # Conexão SSH
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    
    try:
        client.connect(hostname, port=port, username=username, password=password, timeout=10)
        channel = client.invoke_shell()
        time.sleep(1)

        result = execute_command(channel, command)

        if "SearchResult" in result:
            lines = result.splitlines()
            for line in lines:
                if line.startswith("gpon_onu"):
                    formatted_result = format_onu_result(line.strip())
                    return formatted_result  # Retorna o resultado formatado
        return f"ONU com serial {serial} não encontrada."
    except Exception as e:
        return f"Erro ao conectar ou executar o comando: {e}"
    finally:
        client.close()

if __name__ == "__main__":
    if len(sys.argv) > 1:
        serial_number = sys.argv[1]
        print(search_onu_by_sn(serial_number))
    else:
        print("Número de série não fornecido.")