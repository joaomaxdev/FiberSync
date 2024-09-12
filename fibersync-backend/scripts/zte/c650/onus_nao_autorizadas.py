import paramiko
import time
import sys
import os
import re
from prettytable import PrettyTable

# Adiciona o caminho para o módulo de configuração
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '../../../src'))
from config import hostname, port, username, password

def list_unauthorized_onus():
    try:
        client = paramiko.SSHClient()
        client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
        
        client.connect(hostname, port=port, username=username, password=password, timeout=10)
        
        channel = client.invoke_shell()
        time.sleep(1)
        
        command = "show pon onu uncfg"
        channel.send(command + "\n")
        time.sleep(2)
        
        output = channel.recv(65535).decode('utf-8')

        onu_lines = [line for line in output.splitlines() if re.search(r'^\S+.*ONU', line)]
        return onu_lines if onu_lines else []

    except Exception as e:
        return {"error": str(e)}
    finally:
        client.close()

if __name__ == "__main__":
    onus = list_unauthorized_onus()
    print(onus)