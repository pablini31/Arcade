# 🐾 Asignación Automática de Mascotas - PetVenture

## 📋 Descripción

Se ha implementado una funcionalidad que asigna automáticamente una mascota a cada usuario que se registra en el sistema. Esto asegura que todos los usuarios tengan una mascota desde el momento de su registro y puedan comenzar a jugar inmediatamente.

## ✨ Características Principales

### 1. Asignación Automática
- **Cuándo**: Al momento del registro de usuario
- **Qué**: Se asigna una mascota disponible automáticamente
- **Dónde**: Se guarda en MongoDB con el usuario como propietario

### 2. Mascotas por Defecto
- **Luna**: Gato con poder de "Visión nocturna"
- **Max**: Perro con poder de "Super velocidad"
- **Sparky**: Conejo con poder de "Salto súper alto"
- **Rex**: Dinosaurio con poder de "Fuerza bruta"
- **Nebula**: Dragón con poder de "Aliento de fuego"

### 3. Información en MongoDB
- **Campo `propietario`**: ID del usuario que registró la cuenta
- **Campo `adoptadoPor`**: ID del héroe (por defecto 1)
- **Estadísticas**: Se actualiza el contador de mascotas adoptadas

## 🔧 Implementación Técnica

### Archivos Modificados
- `src/controllers/usuarioController.js`: Lógica de asignación automática
- `src/models/Usuario.js`: Referencias a mascotas
- `src/models/Mascota.js`: Campos de propietario y adopción
- `public/js/auth.js`: Manejo de respuesta con mascota asignada
- `public/js/game.js`: Mostrar información de mascota asignada

### Nuevas Funciones
```javascript
// Controlador de usuarios
asignarMascotaAutomatica(usuarioId) // Asigna mascota al usuario
crearMascotasPorDefecto() // Crea mascotas si no hay disponibles

// Endpoints
POST /api/usuarios/registro // Ahora incluye mascota asignada
GET /api/usuarios/mascotas-asignadas // Ver mascotas del usuario
GET /api/usuarios/perfil // Incluye mascotas asignadas
```

## 🗄️ Estructura en MongoDB

### Documento de Usuario
```json
{
  "_id": "ObjectId",
  "username": "usuario123",
  "email": "usuario@email.com",
  "nombre": "Usuario",
  "mascotas": ["ObjectId_mascota1", "ObjectId_mascota2"],
  "estadisticas": {
    "mascotasAdoptadas": 1
  }
}
```

### Documento de Mascota
```json
{
  "_id": "ObjectId",
  "id": 1001,
  "nombre": "Luna",
  "tipo": "Gato",
  "poder": "Visión nocturna",
  "propietario": "ObjectId_usuario",
  "adoptadoPor": 1,
  "salud": 100,
  "energia": 100,
  "felicidad": 100,
  "personalidad": "amigable"
}
```

## 🚀 Flujo de Registro

### 1. Usuario se Registra
```
POST /api/usuarios/registro
{
  "username": "nuevo_usuario",
  "email": "nuevo@email.com",
  "password": "123456",
  "nombre": "Nuevo Usuario"
}
```

### 2. Sistema Verifica Mascotas Disponibles
- Busca mascotas con `adoptadoPor: null` y `propietario: null`
- Si no hay, crea mascotas por defecto automáticamente

### 3. Asigna Mascota al Usuario
- Actualiza la mascota con `propietario: usuarioId`
- Actualiza el usuario con la referencia a la mascota
- Incrementa contador de mascotas adoptadas

### 4. Respuesta del Sistema
```json
{
  "mensaje": "¡Usuario registrado exitosamente! Se te ha asignado automáticamente la mascota Luna",
  "usuario": { ... },
  "mascotaAsignada": {
    "id": 1001,
    "nombre": "Luna",
    "tipo": "Gato",
    "poder": "Visión nocturna",
    "personalidad": "amigable",
    "salud": 100,
    "energia": 100,
    "felicidad": 100
  },
  "token": "jwt_token"
}
```

## 🎯 Casos de Uso

### Para Estudiantes
- Al registrarse, automáticamente tienen una mascota
- Pueden comenzar a jugar inmediatamente
- La mascota aparece en su perfil desde el primer momento

### Para Profesores
- Pueden verificar que cada usuario registrado tiene una mascota
- Pueden consultar las mascotas asignadas en MongoDB
- Pueden verificar la relación usuario-mascota en la base de datos

## 🔍 Verificación en MongoDB

### Consulta para Ver Mascotas Asignadas
```javascript
// Ver todas las mascotas con propietario
db.mascotas.find({ propietario: { $exists: true, $ne: null } })

// Ver mascotas de un usuario específico
db.mascotas.find({ propietario: ObjectId("usuario_id") })

// Ver usuarios con mascotas
db.usuarios.find({ "mascotas.0": { $exists: true } })
```

### Consulta para Ver Estadísticas
```javascript
// Ver usuarios con contador de mascotas adoptadas
db.usuarios.find({ "estadisticas.mascotasAdoptadas": { $gt: 0 } })

// Contar total de mascotas adoptadas
db.usuarios.aggregate([
  { $group: { _id: null, total: { $sum: "$estadisticas.mascotasAdoptadas" } } }
])
```

## 📊 Endpoints de Verificación

### 1. Ver Mascotas del Usuario
```
GET /api/usuarios/mascotas-asignadas
Authorization: Bearer <token>
```

**Respuesta:**
```json
{
  "usuario": {
    "username": "usuario123",
    "nombre": "Usuario",
    "mascotasAdoptadas": 1
  },
  "mascotasAsignadas": [
    {
      "id": 1001,
      "nombre": "Luna",
      "tipo": "Gato",
      "poder": "Visión nocturna",
      "personalidad": "amigable",
      "salud": 100,
      "energia": 100,
      "felicidad": 100,
      "adoptadoPor": 1,
      "fechaCreacion": "2024-01-01T00:00:00.000Z"
    }
  ],
  "totalMascotas": 1,
  "mensaje": "Mascotas asignadas obtenidas exitosamente"
}
```

### 2. Ver Perfil Completo
```
GET /api/usuarios/perfil
Authorization: Bearer <token>
```

**Incluye:**
- Información del usuario
- Mascotas asignadas
- Estadísticas

## 🎨 Interfaz de Usuario

### Mensaje de Registro Exitoso
- Muestra nombre de la mascota asignada
- Información del poder de la mascota
- Notificación adicional con detalles

### Pantalla del Juego
- La mascota aparece automáticamente en el panel de mascotas
- Estadísticas actualizadas
- Contador de mascotas adoptadas visible

## 🔒 Seguridad y Validación

- **Validación de datos**: Todos los campos requeridos
- **Verificación de unicidad**: Username y email únicos
- **Encriptación**: Contraseñas hasheadas con bcrypt
- **Tokens JWT**: Autenticación segura
- **Relaciones**: Referencias válidas en MongoDB

## 🐛 Solución de Problemas

### No se asigna mascota
- Verificar que hay mascotas disponibles en la base de datos
- Revisar logs del servidor para errores
- Verificar conexión a MongoDB

### Error en asignación
- Verificar que el usuario se creó correctamente
- Revisar permisos de escritura en MongoDB
- Verificar que los modelos están correctamente definidos

### Mascota no aparece en el juego
- Verificar que el frontend está actualizado
- Revisar la respuesta del endpoint de perfil
- Verificar que el token es válido

## 📈 Métricas y Monitoreo

### Logs del Servidor
```
Mascota Luna asignada automáticamente al usuario 507f1f77bcf86cd799439011
Mascotas por defecto creadas exitosamente
```

### Métricas Importantes
- Total de usuarios registrados
- Total de mascotas asignadas
- Promedio de mascotas por usuario
- Mascotas más populares

## 🔮 Mejoras Futuras

- [ ] Selección de mascota preferida durante el registro
- [ ] Mascotas especiales para usuarios premium
- [ ] Sistema de regalo de mascotas entre usuarios
- [ ] Mascotas temporales por eventos
- [ ] Estadísticas avanzadas de adopción

## 📞 Soporte

Para verificar que la funcionalidad funciona correctamente:

1. **Registrar un nuevo usuario**
2. **Verificar en MongoDB** que la mascota tiene el campo `propietario`
3. **Consultar el endpoint** `/api/usuarios/mascotas-asignadas`
4. **Verificar en el juego** que la mascota aparece

---

**Desarrollado con ❤️ para PetVenture** 