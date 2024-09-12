import paramiko
from config import hostname, port, username, password

def test_ssh_connection():
    try:
        client = paramiko.SSHClient()
        client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
        
        print(f"Tentando conectar em {hostname}:{port} como {username}...")
        client.connect(hostname, port=port, username=username, password=password, timeout=10)
        
        print("Conexão bem-sucedida!")

        # Fechar a conexão
        client.close()
    except Exception as e:
        print(f"Ocorreu um erro ao tentar conectar: {e}")

if __name__ == "__main__":
    test_ssh_connection()