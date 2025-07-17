# 🚀 Guía de Swagger UI - API de Superhéroes

## 📖 ¿Qué es Swagger UI?

Swagger UI es una interfaz web interactiva que te permite:
- **Ver toda la documentación** de tu API de forma visual y organizada
- **Probar endpoints** directamente desde el navegador
- **Ver ejemplos** de requests y responses
- **Autenticarte** fácilmente con tokens JWT
- **Exportar** la documentación para Postman

## 🌐 Cómo acceder a la interfaz

### En Producción:
```
https://api-mascotas-7sj9.onrender.com/api-docs
```

### En Desarrollo Local:
```
http://localhost:3000/api-docs
```

## 🎯 Características principales

### 1. **Interfaz Visual Profesional**
- Diseño moderno y responsive
- Organización por categorías (Usuarios, Mascotas, Superhéroes, Health)
- Navegación intuitiva

### 2. **Pruebas Interactivas**
- Botón "Try it out" en cada endpoint
- Campos de entrada automáticos
- Ejemplos predefinidos
- Respuestas en tiempo real

### 3. **Autenticación Integrada**
- Botón "Authorize" en la parte superior
- Soporte para Bearer Token JWT
- Tokens persistentes durante la sesión

### 4. **Documentación Completa**
- Descripción detallada de cada endpoint
- Parámetros requeridos y opcionales
- Códigos de respuesta HTTP
- Esquemas de datos (Usuario, Mascota, Hero)

## 🔧 Cómo usar Swagger UI

### Paso 1: Acceder a la documentación
1. Abre tu navegador
2. Ve a `https://api-mascotas-7sj9.onrender.com/api-docs`
3. Verás la interfaz de Swagger con todos tus endpoints

### Paso 2: Autenticarte (para endpoints protegidos)
1. Haz clic en el botón **"Authorize"** (🔒) en la parte superior
2. En el campo "bearerAuth", ingresa tu token JWT:
   ```
   eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```
3. Haz clic en **"Authorize"**
4. Cierra el modal

### Paso 3: Probar un endpoint
1. Expande la categoría que quieras probar (ej: "Usuarios")
2. Haz clic en el endpoint que quieras probar
3. Haz clic en **"Try it out"**
4. Completa los campos requeridos
5. Haz clic en **"Execute"**
6. Verás la respuesta en tiempo real

## 📋 Ejemplos de uso

### Crear un usuario nuevo:
1. Ve a **Usuarios** → **POST /api/usuarios/registro**
2. Haz clic en **"Try it out"**
3. Completa el JSON:
```json
{
  "username": "spiderman",
  "email": "peter@example.com",
  "password": "password123",
  "name": "Peter Parker"
}
```
4. Haz clic en **"Execute"**

### Hacer login:
1. Ve a **Usuarios** → **POST /api/usuarios/login**
2. Haz clic en **"Try it out"**
3. Completa el JSON:
```json
{
  "usernameOrEmail": "spiderman",
  "password": "password123"
}
```
4. Haz clic en **"Execute"**
5. Copia el token de la respuesta

### Usar el token para endpoints protegidos:
1. Haz clic en **"Authorize"**
2. Pega el token en el campo
3. Ahora puedes probar endpoints como:
   - GET /api/usuarios/perfil
   - GET /api/mascotas
   - POST /api/mascotas

## 🔄 Integración con Postman

### Exportar para Postman:
1. En Swagger UI, haz clic en el botón **"Export"**
2. Selecciona **"Postman Collection"**
3. Descarga el archivo JSON
4. En Postman: Import → File → Selecciona el archivo

### Variables de entorno en Postman:
```json
{
  "baseUrl": "https://api-mascotas-7sj9.onrender.com",
  "token": "tu-jwt-token-aqui"
}
```

## 🎨 Personalización

La interfaz está personalizada con:
- **Título personalizado**: "API de Superhéroes - Documentación"
- **Sin barra superior**: Interfaz más limpia
- **Expansión automática**: Todos los endpoints visibles
- **Filtros habilitados**: Búsqueda rápida de endpoints
- **Try it out habilitado**: Pruebas directas activadas

## 📱 Responsive Design

La interfaz funciona perfectamente en:
- ✅ Desktop (Chrome, Firefox, Safari, Edge)
- ✅ Tablet (iPad, Android)
- ✅ Móvil (iPhone, Android)

## 🔍 Búsqueda y Filtros

- **Filtro por texto**: Escribe en el campo de búsqueda
- **Filtro por tag**: Haz clic en las categorías
- **Filtro por método**: GET, POST, PUT, DELETE

## 📊 Endpoints Documentados

### Health (1 endpoint)
- `GET /health` - Verificar estado de la API

### Usuarios (6 endpoints)
- `POST /api/usuarios/registro` - Registrar usuario
- `POST /api/usuarios/login` - Iniciar sesión
- `GET /api/usuarios/perfil` - Obtener perfil
- `PUT /api/usuarios/perfil` - Actualizar perfil
- `GET /api/usuarios/inventario` - Ver inventario
- `GET /api/usuarios/ranking` - Ver ranking

### Mascotas (18 endpoints)
- `GET /api/mascotas` - Obtener todas
- `POST /api/mascotas` - Crear mascota
- `GET /api/mascotas/:id` - Obtener por ID
- `PUT /api/mascotas/:id` - Actualizar mascota
- `DELETE /api/mascotas/:id` - Eliminar mascota
- `GET /api/mascotas/disponibles` - Mascotas disponibles
- `POST /api/mascotas/:id/adoptar` - Adoptar mascota
- `POST /api/mascotas/adoptar/aleatorio` - Adopción aleatoria
- `POST /api/mascotas/:id/alimentar` - Alimentar mascota
- `POST /api/mascotas/:id/pasear` - Pasear mascota
- `POST /api/mascotas/:id/curar` - Curar mascota
- `GET /api/mascotas/:id/estado` - Ver estado
- `POST /api/mascotas/:id/items` - Agregar item
- `DELETE /api/mascotas/:id/items/:itemId` - Quitar item
- `PUT /api/mascotas/:id/personalidad` - Cambiar personalidad
- `POST /api/mascotas/:id/enfermar` - Enfermar mascota
- `POST /api/mascotas/:id/actualizar-estado` - Actualizar estado
- `GET /api/mascotas/items` - Ver items disponibles
- `GET /api/mascotas/heroe/:idHeroe` - Mascotas por héroe

### Superhéroes (8 endpoints)
- `GET /api/heroes` - Obtener todos
- `POST /api/heroes` - Crear héroe
- `GET /api/heroes/:id` - Obtener por ID
- `PUT /api/heroes/:id` - Actualizar héroe
- `DELETE /api/heroes/:id` - Eliminar héroe
- `GET /api/heroes/city/:city` - Buscar por ciudad
- `POST /api/heroes/:id/enfrentar` - Enfrentar villano
- `POST /api/heroes/:id/asignar-mascota` - Asignar mascota

## 🚀 Ventajas sobre Postman

### Para desarrollo:
- ✅ **Documentación integrada**: No necesitas archivos separados
- ✅ **Ejemplos automáticos**: Campos pre-rellenados
- ✅ **Validación en tiempo real**: Errores inmediatos
- ✅ **Interfaz web**: No necesitas instalar nada

### Para pruebas:
- ✅ **Pruebas rápidas**: Un clic para probar
- ✅ **Respuestas visuales**: JSON formateado
- ✅ **Historial de pruebas**: En el navegador
- ✅ **Compartir fácil**: Solo una URL

## 🔧 Troubleshooting

### Error 404 en /api-docs:
- Verifica que el servidor esté corriendo
- Revisa que las dependencias estén instaladas
- Comprueba que no haya errores en la consola

### Token no funciona:
- Asegúrate de incluir "Bearer " antes del token
- Verifica que el token no haya expirado
- Comprueba que el token sea válido

### Endpoints no aparecen:
- Verifica que los archivos de documentación estén en `/src/docs/`
- Revisa que las rutas estén correctamente definidas
- Comprueba que no haya errores de sintaxis

## 📞 Soporte

Si tienes problemas:
1. Revisa la consola del navegador (F12)
2. Verifica los logs del servidor
3. Comprueba que todas las dependencias estén instaladas
4. Asegúrate de que el servidor esté corriendo

---

**¡Disfruta de tu nueva interfaz profesional de API! 🎉** 