import os
import sys
import paramiko
import time
import re

# Adicione o caminho para o módulo de configuração
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '../../../src'))
from config import hostname, port, username, password

def execute_command(channel, command):
    """Executa um comando na OLT e retorna a saída."""
    channel.send(command + '\n')
    time.sleep(1)
    output = channel.recv(65536).decode('utf-8')
    return output

def format_onu_result(result):
    """Formata o resultado da busca da ONU em uma estrutura de dados."""
    parts = result.split(':')
    if len(parts) == 2:
        onu_info = parts[0].split('/')
        slot = onu_info[1]
        pon = onu_info[2]
        id_onu = parts[1]
        return (slot, pon, id_onu.strip())
    return None

def search_onu_by_sn(serial):
    """Busca a ONU pelo número de série."""
    command = f"show gpon onu by sn {serial}"

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
                    onu_info = format_onu_result(line.strip())
                    if onu_info:
                        return onu_info  # Retorna slot, pon e id_onu
        print(f"ONU com serial {serial} não encontrada.")
    except Exception as e:
        print(f"Erro ao conectar ou executar o comando: {e}")
    finally:
        client.close()
    return None

def get_return_signal(slot, pon, onu):
    command_power = f"show pon power attenuation gpon_onu-1/{slot}/{pon}:{onu}"
    command_serial = f"show gpon onu detail-info gpon_onu-1/{slot}/{pon}:{onu}"
    
    try:
        client = paramiko.SSHClient()
        client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
        client.connect(hostname, port=port, username=username, password=password, timeout=10)
        channel = client.invoke_shell()
        time.sleep(1)

        power_output = execute_command(channel, command_power)
        serial_output = execute_command(channel, command_serial)

        return_signal = parse_output(power_output)
        serial_number = parse_serial_output(serial_output)
        
        return {
            "Return Signal": return_signal,
            "Serial Number": serial_number,
            "Slot": slot,
            "PON": pon,
            "ONU": onu
        }

    except Exception as e:
        print(f"An error occurred: {e}")
        return None
    finally:
        client.close()

def parse_output(output):
    sfp_output_signal = ""
    cto_expected_signal = ""
    un_power = ""
    return_signal = ""

    up_pattern = re.compile(r'up\s+Rx\s+:\s*([-+]?\d*\.\d+|\d+)\(dbm\)\s+Tx:\s*([-+]?\d*\.\d+|\d+)\(dbm\)')
    down_pattern = re.compile(r'down\s+Tx\s*:\s*([-+]?\d*\.\d+|\d+)\(dbm\)\s+Rx:\s*([-+]?\d*\.\d+|\d+)\(dbm\)')

    for line in output.splitlines():
        up_match = up_pattern.search(line)
        down_match = down_pattern.search(line)

        if up_match:
            return_signal = up_match.group(1)
            un_power = up_match.group(2)

        if down_match:
            sfp_output_signal = down_match.group(1)
            cto_expected_signal = down_match.group(2)

    return {
        "SFP Output Signal": sfp_output_signal,
        "CTO Expected Signal": cto_expected_signal,
        "UN Power": un_power,
        "Return Signal": return_signal,
    }

def parse_serial_output(output):
    serial_pattern = re.compile(r'Serial number:\s*(\S+)')
    match = serial_pattern.search(output)
    return match.group(1) if match else "N/A"

# Função principal removida, pois não é mais necessária ao usar a API