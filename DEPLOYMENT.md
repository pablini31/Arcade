# 🚀 Despliegue en Render

## Configuración del Proyecto

Este proyecto está configurado para desplegarse en Render. Los siguientes archivos son necesarios:

- `render.yaml` - Configuración del servicio
- `Procfile` - Comando de inicio
- `.nvmrc` - Versión de Node.js
- `package.json` - Dependencias y scripts

## Variables de Entorno Requeridas

En Render, necesitas configurar las siguientes variables de entorno:

### Obligatorias:
- `MONGODB_URI` - URL de conexión a MongoDB Atlas (ej: `mongodb+srv://usuario:password@cluster.mongodb.net/superheroes`)
- `JWT_SECRET` - Clave secreta para JWT (ej: `pabloelchato31`)

### Opcionales:
- `NODE_ENV` - Entorno (production/development) - Render lo configura automáticamente
- `PORT` - Puerto (Render lo configura automáticamente)
- `ALLOWED_ORIGINS` - Orígenes permitidos para CORS (ej: `https://tu-frontend.onrender.com,http://localhost:3000`)

## Pasos para el Despliegue

1. **Conectar GitHub**: En Render, selecciona tu repositorio de GitHub
2. **Configurar Variables**: Agrega las variables de entorno mencionadas arriba
3. **Desplegar**: Render detectará automáticamente la configuración y desplegará

## Estructura de la API

Una vez desplegada, tu API estará disponible en:
- `https://tu-app-name.onrender.com/`

### Endpoints principales:
- `/` - Información de la API y estado
- `/health` - Verificación de salud del servicio
- `/api/usuarios` - Gestión de usuarios
- `/api/mascotas` - Gestión de mascotas  
- `/api/superheroes` - Gestión de superhéroes

### Verificación de funcionamiento:
- Visita `https://tu-app-name.onrender.com/health` para verificar que todo funciona
- Visita `https://tu-app-name.onrender.com/` para ver información de la API

## Notas Importantes

- El puerto se configura automáticamente por Render
- MongoDB Atlas debe estar configurado y accesible
- Las variables de entorno son sensibles, no las compartas 