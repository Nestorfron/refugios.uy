# 🏠 Refugios Uy

Aplicación web progresiva (PWA) para visualizar refugios disponibles y reportar personas en situación de calle de forma rápida y segura.

---

## 🚀 Objetivo

* Mostrar refugios en un mapa con:

  * 📍 ubicación
  * 📞 contacto
  * 🛏️ cupos disponibles
* Permitir a ciudadanos reportar personas durmiendo a la intemperie
* Facilitar la gestión de reportes por parte de administradores

---

## 🧠 Características principales

### 👥 Público general

* Visualización de refugios en mapa
* Consulta de disponibilidad
* Envío de reportes anónimos (mínimos datos)

### 🔐 Administradores

* Acceso a reportes
* Validación / descarte
* Gestión de refugios

---

## 🧱 Stack tecnológico

### Frontend

* React (Vite)
* Tailwind CSS
* PWA (Service Worker + Manifest)
* Fetch API (sin axios)

### Backend

* Flask
* Flask-JWT-Extended
* Flask-SQLAlchemy
* PostgreSQL

### Mapa

* Leaflet / React Leaflet

---

## 📁 Estructura del proyecto

```
refugios.uy/
│
├── backend/
│   ├── api/
│   │   ├── models.py
│   │   ├── routes.py
│   │   └── utils/
│   │       └── email_utils.py
│   │
│   ├── app.py
│   ├── config.py
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   │   ├── services/
│   │   │   └── api.js
│   │   │
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Mapa.jsx
│   │   │   └── Reportar.jsx
│   │   │
│   │   ├── components/
│   │   │   └── RefugioCard.jsx
│   │   │
│   │   ├── hooks/
│   │   │   └── useApi.js
│   │   │
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   ├── public/
│   │   ├── manifest.json
│   │   └── icons/
│   │
│   ├── index.html
│   └── package.json
│
└── README.md
```

---

## ⚙️ Configuración del entorno

### 🔐 Backend `.env`

```
DATABASE_URL=postgresql://usuario:password@localhost:5433/refugios_db
SECRET_KEY=super-secret-key
JWT_SECRET_KEY=jwt-secret-key

MAIL_SERVER=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=tu_email@gmail.com
MAIL_PASSWORD=tu_password
```

---

### 🌍 Frontend `.env`

```
VITE_API_URL=http://localhost:5000/api
```

---

## 🛠️ Instalación

### 1️⃣ Clonar repositorio

```
git clone https://github.com/Nestorfron/PWA-template
cd refugios.uy
```

---

### 2️⃣ Backend

```
cd backend
python -m venv venv
venv\Scripts\activate   # Windows

pip install -r requirements.txt
```

Crear base de datos en PostgreSQL:

```
createdb refugios_db
```

Ejecutar servidor:

```
python app.py
```

---

### 3️⃣ Frontend

```
cd frontend
npm install
npm run dev
```

---

## 📡 API Endpoints

### 👤 Usuarios

* `GET /api/users`
* `POST /api/users`
* `PUT /api/users/:id`
* `DELETE /api/users/:id`

### 🏠 Refugios

* `GET /api/refugios`
* `POST /api/refugios`

### 🚨 Reportes

* `GET /api/reportes` (admin)
* `POST /api/reportes`

---

## 🗺️ Flujo de la aplicación

1. Usuario abre la app
2. Visualiza refugios en el mapa
3. Puede reportar una persona:

   * ubicación automática
   * breve descripción
4. Admin revisa reportes y actúa

---

## 🛡️ Seguridad y anti-spam

* Rate limiting (backend)
* Validación de datos
* Campos mínimos (sin datos sensibles)
* Honeypot en formularios
* JWT para rutas protegidas

---

## 📱 PWA (Instalable)

* Funciona como app móvil
* Instalación desde navegador
* Soporte offline parcial
* Experiencia nativa

---

## 🚀 Roadmap

* [ ] Filtros de refugios
* [ ] Estado en tiempo real de cupos
* [ ] Notificaciones
* [ ] Validación automática de reportes
* [ ] Panel admin avanzado
* [ ] Geolocalización en tiempo real

---

## 🤝 Contribución

Pull requests bienvenidos.
Para cambios grandes, abrir issue primero.

---

## 📄 Licencia

MIT

---

## 💡 Nota

Este proyecto busca ayudar a mejorar la respuesta social ante personas en situación de calle, facilitando la conexión entre ciudadanos y servicios de asistencia.

---
