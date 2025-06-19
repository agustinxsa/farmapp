# 🏥 Farmapp API - Sistema de Gestión de Turnos Médicos

API REST para la gestión de turnos médicos en farmacias, desarrollada por **Agustín** para **saltoit.com**.

## 📋 Descripción

Farmapp es un sistema de gestión de turnos médicos que permite:
- Crear turnos automáticamente
- Llamar turnos para atención
- Saltar turnos cuando sea necesario
- Marcar turnos como atendidos
- Consultar turnos pendientes

## 🏗️ Arquitectura

El proyecto está organizado como un **monorepo** con arquitectura modular:

```
backend/
├── turnero-domain/     # Núcleo del dominio (Turn, TurnStatus)
├── turnero-application/ # Lógica de negocio (TurnService)
├── turnero-api/        # API REST (TurnController)
├── turnero-persistence/ # Persistencia (pendiente)
└── turnero-websocket/  # WebSocket (pendiente)
```

## 🚀 Tecnologías

- **Java 20** con **Spring Boot 3.5.0**
- **Maven** multi-módulo
- **Lombok** para reducción de boilerplate
- **REST API** con JSON

## 📦 Instalación

### Prerrequisitos

- Java 20 o superior
- Maven 3.6+
- Git

### Pasos de instalación

1. **Clonar el repositorio**
   ```bash
   git clone <url-del-repositorio>
   cd farmapp
   ```

2. **Compilar el proyecto**
   ```bash
   cd backend
   mvn clean install
   ```

3. **Ejecutar la aplicación**
   ```bash
   cd turnero-api
   mvn spring-boot:run
   ```

La API estará disponible en: `http://localhost:8080`

## 📚 Endpoints de la API

### Base URL
```
http://localhost:8080/api/turns
```

### 1. Crear Turno
**POST** `/api/turns`

Crea un nuevo turno automáticamente.

**Respuesta:**
```json
{
  "id": 1,
  "code": "A001",
  "status": "CREATED",
  "createdAt": "2024-01-15T10:30:00",
  "calledAt": null,
  "attendedAt": null
}
```

**Ejemplo con cURL:**
```bash
curl -X POST http://localhost:8080/api/turns
```

### 2. Obtener Turnos Pendientes
**GET** `/api/turns/pending`

Retorna todos los turnos que están en estado `CREATED` (pendientes).

**Respuesta:**
```json
[
  {
    "id": 1,
    "code": "A001",
    "status": "CREATED",
    "createdAt": "2024-01-15T10:30:00",
    "calledAt": null,
    "attendedAt": null
  },
  {
    "id": 2,
    "code": "A002",
    "status": "CREATED",
    "createdAt": "2024-01-15T10:35:00",
    "calledAt": null,
    "attendedAt": null
  }
]
```

**Ejemplo con cURL:**
```bash
curl -X GET http://localhost:8080/api/turns/pending
```

### 3. Llamar Turno
**PATCH** `/api/turns/{id}/call`

Cambia el estado del turno a `CALLED` y registra el timestamp.

**Parámetros:**
- `id` (Long): ID del turno

**Respuesta:**
```json
{
  "id": 1,
  "code": "A001",
  "status": "CALLED",
  "createdAt": "2024-01-15T10:30:00",
  "calledAt": "2024-01-15T10:45:00",
  "attendedAt": null
}
```

**Ejemplo con cURL:**
```bash
curl -X PATCH http://localhost:8080/api/turns/1/call
```

### 4. Saltar Turno
**PATCH** `/api/turns/{id}/skip`

Cambia el estado del turno a `SKIPPED`.

**Parámetros:**
- `id` (Long): ID del turno

**Respuesta:**
```json
{
  "id": 1,
  "code": "A001",
  "status": "SKIPPED",
  "createdAt": "2024-01-15T10:30:00",
  "calledAt": null,
  "attendedAt": null
}
```

**Ejemplo con cURL:**
```bash
curl -X PATCH http://localhost:8080/api/turns/1/skip
```

### 5. Atender Turno
**PATCH** `/api/turns/{id}/attend`

Cambia el estado del turno a `ATTENDED` y registra el timestamp.

**Parámetros:**
- `id` (Long): ID del turno

**Respuesta:**
```json
{
  "id": 1,
  "code": "A001",
  "status": "ATTENDED",
  "createdAt": "2024-01-15T10:30:00",
  "calledAt": "2024-01-15T10:45:00",
  "attendedAt": "2024-01-15T11:00:00"
}
```

**Ejemplo con cURL:**
```bash
curl -X PATCH http://localhost:8080/api/turns/1/attend
```

## 📊 Modelo de Datos

### Turn (Turno)
```json
{
  "id": "Long",
  "code": "String (formato: A001, A002, ...)",
  "status": "TurnStatus",
  "createdAt": "LocalDateTime",
  "calledAt": "LocalDateTime (nullable)",
  "attendedAt": "LocalDateTime (nullable)"
}
```

### TurnStatus (Estados del Turno)
- `CREATED` - Turno creado, pendiente de llamada
- `CALLED` - Turno llamado para atención
- `SKIPPED` - Turno saltado
- `ATTENDED` - Turno atendido

## 🔄 Flujo de Estados

```
CREATED → CALLED → ATTENDED
    ↓
  SKIPPED
```

1. **CREATED**: Turno recién creado
2. **CALLED**: Turno llamado para atención
3. **ATTENDED**: Turno atendido exitosamente
4. **SKIPPED**: Turno saltado (desde cualquier estado)

## ⚠️ Códigos de Error

- **404 Not Found**: Turno no encontrado
- **500 Internal Server Error**: Error interno del servidor

## 🧪 Ejemplos de Uso

### Flujo completo de un turno

```bash
# 1. Crear turno
curl -X POST http://localhost:8080/api/turns

# 2. Ver turnos pendientes
curl -X GET http://localhost:8080/api/turns/pending

# 3. Llamar turno
curl -X PATCH http://localhost:8080/api/turns/1/call

# 4. Atender turno
curl -X PATCH http://localhost:8080/api/turns/1/attend
```

### Con JavaScript/Fetch

```javascript
// Crear turno
const createTurn = async () => {
  const response = await fetch('http://localhost:8080/api/turns', {
    method: 'POST'
  });
  return await response.json();
};

// Obtener turnos pendientes
const getPendingTurns = async () => {
  const response = await fetch('http://localhost:8080/api/turns/pending');
  return await response.json();
};

// Llamar turno
const callTurn = async (id) => {
  const response = await fetch(`http://localhost:8080/api/turns/${id}/call`, {
    method: 'PATCH'
  });
  return await response.json();
};
```

## 🔧 Configuración

### Variables de Entorno
```properties
# Puerto del servidor (por defecto: 8080)
server.port=8080

# Contexto de la aplicación
server.servlet.context-path=/
```

### Logs
Los logs se muestran en la consola con el formato estándar de Spring Boot.

## 🚧 Estado Actual

### ✅ Implementado
- ✅ API REST completa
- ✅ Gestión de turnos en memoria
- ✅ Endpoints para todas las operaciones
- ✅ Validación de estados
- ✅ Timestamps automáticos

### 🔄 En Desarrollo
- 🔄 Persistencia con base de datos
- 🔄 WebSocket para actualizaciones en tiempo real
- 🔄 Autenticación y autorización
- 🔄 Logs estructurados

### 📋 Pendiente
- 📋 Tests unitarios y de integración
- 📋 Documentación con Swagger/OpenAPI
- 📋 Docker y Docker Compose
- 📋 CI/CD pipeline

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto es desarrollado por **Agustín** para **saltoit.com**.

## 📞 Contacto

- **Desarrollador**: Agustín
- **Empresa**: saltoit.com
- **Proyecto**: Farmapp - Sistema de Gestión de Turnos Médicos

---

**Nota**: Esta API actualmente funciona con datos en memoria. Los datos se pierden al reiniciar la aplicación. La persistencia será implementada en futuras versiones. 