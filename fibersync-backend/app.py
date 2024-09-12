from flask import Flask, jsonify, request
from flask_cors import CORS  # Import CORS
import subprocess
import os
import paramiko
from scripts.zte.c650.sinal_de_retorno import search_onu_by_sn, get_return_signal
from config import hostname, port, username, password

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

def run_script(script_name, *args):
    """Executa um script Python e retorna a saída."""
    try:
        command = ['python3', os.path.join('scripts', 'zte', 'c650', script_name)] + list(args)
        result = subprocess.run(command, capture_output=True, text=True)
        return result.stdout, result.stderr
    except Exception as e:
        return str(e), None

@app.route('/api/sinal-retorno', methods=['POST'])
def sinal_retorno():
    data = request.json
    slot = data.get('slot')
    pon = data.get('pon')
    onu = data.get('onu')
    serial = data.get('serial')

    if serial:
        result = search_onu_by_sn(serial)
        if result:
            slot, pon, id_onu = result
            return_signal = get_return_signal(slot, pon, id_onu)
            return jsonify(return_signal)
    elif slot and pon and onu:
        return_signal = get_return_signal(slot, pon, onu)
        return jsonify(return_signal)
    
    return jsonify({'error': 'Dados insuficientes fornecidos.'}), 400

@app.route('/api/pesquisar-onu', methods=['POST'])
def pesquisar_onu():
    sn = request.json.get('sn')
    
    if not sn:
        return jsonify({'error': 'Serial Number (sn) is required'}), 400
    
    stdout, stderr = run_script('pesquisar_onu_por_sn.py', sn)
    
    if stderr:
        return jsonify({'output': stdout, 'error': stderr}), 500
    
    output_lines = stdout.strip().split('\n')[3:]  # Ignora as primeiras 3 linhas da tabela
    result_array = []

    for line in output_lines:
        if line.strip():  # Ignora linhas vazias
            parts = line.split('|')
            if len(parts) == 5:  # Espera 5 partes (incluindo espaços)
                slot, pon, id_onu = [part.strip() for part in parts[1:4]]  # Pega Slot, Pon e ID Onu
                result_array.append({
                    'slot': slot,
                    'pon': pon,
                    'id_onu': id_onu
                })
    
    return jsonify({'output': result_array, 'error': None})

@app.route('/api/autorizar_onu', methods=['POST'])
def autorizar_onu():
    data = request.json
    slot = data.get('slot')
    pon = data.get('pon')
    vlan = data.get('vlan')

    if not slot or not pon or not vlan:
        return jsonify({"error": "slot, pon, and vlan are required"}), 400

    client = None

    try:
        client = paramiko.SSHClient()
        client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
        client.connect(hostname, port=port, username=username, password=password)
        channel = client.invoke_shell()

        serial_number = get_serial_number(channel, slot, pon)  # Defina a função get_serial_number
        if not serial_number:
            return jsonify({"error": "Unable to retrieve serial number."}), 500

        occupied_numbers = parse_occupied_slots(execute_command(channel, f"show interface gpon_onu-1/{slot}/{pon}:?"))  # Defina parse_occupied_slots

        total_slots = set(range(1, 129))
        available_slots = total_slots - set(occupied_numbers)

        if available_slots:
            position = min(available_slots)

            provision_onu(channel, slot, pon, position, serial_number, vlan)  # Defina provision_onu

            signals = get_return_signal(slot, pon, serial_number)
            return jsonify({
                "message": f"ONU {serial_number} provisionada com sucesso!",
                "signals": signals,
                "slot": slot,
                "pon": pon,
                "vlan": vlan
            })
        else:
            return jsonify({"error": "No available slots for provisioning."}), 400

    except paramiko.SSHException as e:
        return jsonify({"error": f"SSH connection error: {str(e)}"}), 500
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        if client:
            client.close()

@app.route('/autorizar-onu-em-massa', methods=['POST'])
def autorizar_onu_em_massa():
    onus_data = request.json
    stdout, stderr = run_script('autorizar_onu_em_massa.py')
    return jsonify({'output': stdout, 'error': stderr})

@app.route('/api/onus-nao-autorizadas', methods=['GET'])
def get_unauthorized_onus():
    try:
        from scripts.zte.c650.onus_nao_autorizadas import list_unauthorized_onus
        onus = list_unauthorized_onus()
        
        if isinstance(onus, dict) and "error" in onus:
            return jsonify(onus), 500
        
        return jsonify({"onus nao autorizadas": onus})
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)