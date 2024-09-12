from flask import Flask, jsonify, request
import paramiko
import re
import os
import sys
import time

# Adicione o caminho para o arquivo de configuração
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '../../../src'))
from config import hostname, port, username, password

app = Flask(__name__)

def execute_command(channel, command):
    """Executa um comando na OLT e retorna a saída."""
    channel.send(command + '\n')
    output = ''
    start_time = time.time()
    
    while True:
        if channel.recv_ready():
            output += channel.recv(65536).decode('utf-8')
        if time.time() - start_time > 10:
            break
        if output and output.endswith('> '):
            break
            
    return output.strip()

def get_unconfigured_onus(channel):
    """Obtém a lista de ONUs não configuradas."""
    command = "show pon onu uncfg"
    output = execute_command(channel, command)
    
    unconfigured_onus = []
    for line in output.splitlines():
        match = re.match(r'gpon_olt-(\d+)/(\d+)\s+(\w+)\s+(\w+)', line)
        if match:
            slot, pon, serial, _ = match.groups()
            unconfigured_onus.append({
                "slot": int(slot),
                "pon": int(pon),
                "serial": serial
            })
    
    return unconfigured_onus

@app.route('/api/autorizar_onu', methods=['POST'])
def autorizar_onu():
    data = request.json
    vlan = data.get('vlan')
    slot = data.get('slot')
    pon = data.get('pon')

    if not vlan or slot is None or pon is None:
        return jsonify({"error": "vlan, slot e pon são obrigatórios"}), 400

    try:
        client = paramiko.SSHClient()
        client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
        client.connect(hostname, port=port, username=username, password=password)
        channel = client.invoke_shell()

        unconfigured_onus = get_unconfigured_onus(channel)
        matched_onu = next((onu for onu in unconfigured_onus if onu['slot'] == slot and onu['pon'] == pon), None)

        if not matched_onu:
            return jsonify({"error": "Nenhuma ONU não autorizada encontrada para o slot e PON informados."}), 404

        serial_number = matched_onu['serial']

        # Aqui você pode adicionar a lógica de provisionamento se necessário
        print(f"ONU {serial_number} encontrada no slot {slot} e PON {pon}.")  # Mensagem de log

        return jsonify({
            "message": "ONU encontrada.",
            "slot": slot,
            "pon": pon,
            "serial": serial_number,
            "vlan": vlan
        }), 200

    except paramiko.SSHException as ssh_exception:
        return jsonify({"error": "Erro de conexão SSH: " + str(ssh_exception)}), 500
    except Exception as e:
        return jsonify({"error": "Erro inesperado: " + str(e)}), 500
    finally:
        client.close()

if __name__ == '__main__':
    app.run(debug=True)