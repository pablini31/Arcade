# 🦸‍♂️ API de Superhéroes y Mascotas

Una API REST completa para gestionar superhéroes, mascotas y usuarios con sistema de autenticación JWT y aislamiento de datos.

## 🚀 Características

- **Autenticación JWT** con tokens seguros
- **Aislamiento de datos** - cada usuario solo ve su información
- **Gestión de mascotas** con sistema de adopción
- **Sistema de usuarios** con perfiles y estadísticas
- **Base de datos MongoDB Atlas** para persistencia
- **Validación de datos** y manejo de errores
- **Arquitectura modular** con controladores, servicios y repositorios

## 🛠️ Tecnologías

- **Node.js** - Runtime de JavaScript
- **Express.js** - Framework web
- **MongoDB Atlas** - Base de datos en la nube
- **Mongoose** - ODM para MongoDB
- **JWT** - Autenticación con tokens
- **bcryptjs** - Encriptación de contraseñas
- **dotenv** - Variables de entorno

## 📋 Prerrequisitos

- Node.js (versión 16 o superior)
- Cuenta en MongoDB Atlas
- Git

## 🔧 Instalación

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/pablini31/Arcade.git
   cd Arcade
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**
   Crear un archivo `config.env` en la raíz del proyecto:
   ```env
   MONGODB_URI=mongodb+srv://usuario:contraseña@cluster.mongodb.net/nombre-db
   PORT=3000
   NODE_ENV=development
   JWT_SECRET=tu_clave_secreta_super_segura
   ```

4. **Ejecutar el servidor**
   ```bash
   npm start
   ```

## 📚 Endpoints de la API

### 🔐 Autenticación

#### Registro de usuario
```
POST /api/usuarios/registro
Content-Type: application/json

{
  "username": "usuario",
  "email": "usuario@email.com",
  "password": "contraseña",
  "nombre": "Nombre",
  "apellido": "Apellido"
}
```

#### Login
```
POST /api/usuarios/login
Content-Type: application/json

{
  "usernameOrEmail": "usuario",
  "password": "contraseña"
}
```

#### Obtener perfil
```
GET /api/usuarios/perfil
Authorization: Bearer <token>
```

### 🐾 Mascotas

#### Obtener mascotas del usuario
```
GET /api/mascotas
Authorization: Bearer <token>
```

#### Crear mascota
```
POST /api/mascotas
Authorization: Bearer <token>
Content-Type: application/json

{
  "nombre": "Luna",
  "tipo": "Perro",
  "poder": "Ladrar fuerte",
  "edad": 3,
  "descripcion": "Un perro muy amigable",
  "idLugar": 1,
  "propietario": "ID_DEL_USUARIO"
}
```

#### Alimentar mascota
```
POST /api/mascotas/:id/alimentar
Authorization: Bearer <token>
Content-Type: application/json

{
  "tipoAlimento": "premium"
}
```

#### Pasear mascota
```
POST /api/mascotas/:id/pasear
Authorization: Bearer <token>
Content-Type: application/json

{
  "duracion": 30
}
```

### 🦸‍♂️ Superhéroes

#### Obtener todos los héroes
```
GET /api/heroes
```

#### Obtener héroe por ID
```
GET /api/heroes/:id
```

#### Adoptar mascota
```
POST /api/mascotas/:id/adoptar
Content-Type: application/json

{
  "idHeroe": 1
}
```

## 🔒 Seguridad

### Aislamiento de Datos
- Cada usuario solo puede ver sus propias mascotas
- Los tokens JWT contienen el ID del usuario
- Validación de permisos en cada endpoint protegido

### Autenticación
- Tokens JWT con expiración
- Contraseñas encriptadas con bcrypt
- Middleware de verificación de tokens

## 🧪 Pruebas

### Ejecutar pruebas de seguridad
```bash
node test_security_fix.js
```

### Ejecutar todas las pruebas
```bash
node run_all_tests.js
```

## 📁 Estructura del Proyecto

```
api-superheroes/
├── src/
│   ├── app.js                 # Aplicación principal
│   ├── config/
│   │   └── database.js        # Configuración de MongoDB
│   ├── controllers/
│   │   ├── heroController.js  # Controlador de héroes
│   │   ├── mascotaController.js # Controlador de mascotas
│   │   └── usuarioController.js # Controlador de usuarios
│   ├── middleware/
│   │   └── auth.js           # Middleware de autenticación
│   ├── models/
│   │   ├── Hero.js           # Modelo de héroe
│   │   ├── Mascota.js        # Modelo de mascota
│   │   └── Usuario.js        # Modelo de usuario
│   ├── repositories/
│   │   ├── heroRepositoryMongo.js
│   │   └── mascotaRepositoryMongo.js
│   └── services/
│       ├── heroService.js
│       └── mascotaService.js
├── config.env                # Variables de entorno
├── package.json
└── README.md
```

## 🚨 Solución de Problemas

### Error de conexión a MongoDB
- Verificar que la URI de MongoDB Atlas sea correcta
- Asegurar que la IP esté en la lista blanca de MongoDB Atlas

### Error de puerto ocupado
```bash
taskkill /f /im node.exe
npm start
```

### Error de autenticación
- Verificar que el token JWT sea válido
- Asegurar que el token no haya expirado

## 🤝 Contribuir

1. Fork el proyecto
2. Crear una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

## 👨‍💻 Autor

**Pablo** - [GitHub](https://github.com/pablini31)

## 🙏 Agradecimientos

- MongoDB Atlas por la base de datos en la nube
- Express.js por el framework web
- La comunidad de Node.js por las herramientas y librerías 