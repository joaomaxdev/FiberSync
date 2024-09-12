from flask import Flask, jsonify, request
import subprocess
import os

app = Flask(__name__)

def run_script(script_name):
    try:
        result = subprocess.run(['python3', os.path.join('scripts', 'zte', script_name)],
                                capture_output=True, text=True)
        return result.stdout, result.stderr
    except Exception as e:
        return str(e), None

@app.route('/onus-nao-autorizadas', methods=['GET'])
def onus_nao_autorizadas():
    stdout, stderr = run_script('onus_nao_autorizadas.py')
    return jsonify({'output': stdout, 'error': stderr})

@app.route('/pesquisar-onu', methods=['POST'])
def pesquisar_onu():
    sn = request.json.get('sn')
    stdout, stderr = run_script('pesquisar_onu_por_sn.py')
    return jsonify({'output': stdout, 'error': stderr})

@app.route('/sinal-de-retorno', methods=['GET'])
def sinal_de_retorno():
    stdout, stderr = run_script('sinal_de_retorno.py')
    return jsonify({'output': stdout, 'error': stderr})

@app.route('/autorizar-onu', methods=['POST'])
def autorizar_onu():
    onu_data = request.json
    stdout, stderr = run_script('autorizar_onu.py')
    return jsonify({'output': stdout, 'error': stderr})

@app.route('/autorizar-onu-em-massa', methods=['POST'])
def autorizar_onu_em_massa():
    onus_data = request.json
    stdout, stderr = run_script('autorizar_onu_em_massa.py')
    return jsonify({'output': stdout, 'error': stderr})

if __name__ == '__main__':
    app.run(debug=True)