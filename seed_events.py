import requests
import json
import time

BASE_URL = "http://localhost:8080/api"

# Datos de usuario para pruebas
USER_DATA = {
    "nombre": "Admin",
    "apellidos": "Test",
    "email": "admin@test.com",
    "password": "Password123!",
    "rol": "ADMIN" # Intentamos registrar como admin si el backend lo permite en registro abierto, sino será USER por defecto
}

# Eventos a crear
EVENTS = [
    {
        "nombre": "Concierto Solidario de Primavera",
        "descripcion": "Un evento musical único para celebrar la llegada de la primavera y recaudar fondos para nuestros cuidados paliativos. Contaremos con artistas locales e internacionales.",
        "fechaInicio": "2026-04-15T20:00:00Z",
        "fechaFin": "2026-04-15T23:00:00Z",
        "lugar": "Auditorio Municipal de Benalmádena",
        "objetivoRecaudacion": 5000.0,
        "imagenUrl": "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80"
    },
    {
        "nombre": "Cena de Gala Benéfica",
        "descripcion": "Disfruta de una velada elegante con cena de tres platos, música en vivo y subasta silenciosa. Todo lo recaudado irá destinado a la Fundación Cudeca.",
        "fechaInicio": "2026-05-20T21:00:00Z",
        "fechaFin": "2026-05-21T01:00:00Z",
        "lugar": "Hotel Puente Romano, Marbella",
        "objetivoRecaudacion": 15000.0,
        "imagenUrl": "https://images.unsplash.com/photo-1519671902512-35c37c3a0931?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80"
    },
    {
        "nombre": "XI Marcha por la Vida",
        "descripcion": "Únete a nuestra caminata anual solidaria. Recorrido familiar de 5km por el paseo marítimo. Camiseta y avituallamiento incluidos con la inscripción.",
        "fechaInicio": "2026-06-10T10:00:00Z",
        "fechaFin": "2026-06-10T14:00:00Z",
        "lugar": "Paseo Marítimo de Fuengirola",
        "objetivoRecaudacion": 8000.0,
        "imagenUrl": "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80"
    }
]

def register_and_login():
    print(f"Intentando registrar usuario {USER_DATA['email']}...")
    try:
        # Registro
        reg_response = requests.post(f"{BASE_URL}/auth/register", json=USER_DATA)
        if reg_response.status_code in [200, 201]:
             print("Registro exitoso.")
        else:
             print(f"Registro: {reg_response.status_code} - {reg_response.text}")

        # Login
        print("Intentando login...")
        login_response = requests.post(f"{BASE_URL}/auth/login", json={
            "email": USER_DATA["email"],
            "password": USER_DATA["password"]
        })

        if login_response.status_code == 200:
            data = login_response.json()
            token = data.get("token") or data.get("access_token")
            print("Login exitoso. Token obtenido.")
            return token
        else:
            print(f"Error Login: {login_response.status_code} - {login_response.text}")
            return None

    except Exception as e:
        print(f"Excepción en auth: {e}")
        return None

def create_events(token):
    if not token:
        print("No hay token, abortando creación de eventos.")
        return

    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }

    for event in EVENTS:
        print(f"Creando evento: {event['nombre']}...")
        try:
            response = requests.post(f"{BASE_URL}/eventos", json=event, headers=headers)
            if response.status_code in [200, 201]:
                print(f"Evento '{event['nombre']}' creado correctamente.")
                # Publicar el evento para que se vea
                evt_data = response.json()
                evt_id = evt_data.get("id")
                if evt_id:
                    print(f"Publicando evento ID {evt_id}...")
                    pub_response = requests.patch(f"{BASE_URL}/eventos/{evt_id}/publicar", headers=headers)
                    if pub_response.status_code == 200:
                        print("Evento publicado.")
                    else:
                        print(f"Error publicando: {pub_response.status_code}")
            else:
                 print(f"Error creando evento: {response.status_code} - {response.text}")
        except Exception as e:
            print(f"Excepción creando evento: {e}")

if __name__ == "__main__":
    token = register_and_login()
    create_events(token)
