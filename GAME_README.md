# 🐾 PetVenture - Juego de Mascotas Virtuales

## 🎮 Descripción

**PetVenture** es un juego de mascotas virtuales tipo Tamagotchi/Pou desarrollado como parte de un proyecto académico. Los usuarios pueden crear, cuidar y jugar con sus propias mascotas virtuales con personalidades únicas y poderes especiales.

## ✨ Características Principales

### 🏠 Sistema de Autenticación
- Registro de usuarios con validación
- Inicio de sesión seguro con JWT
- Perfiles de usuario personalizables
- Sistema de sesiones persistentes

### 🐕 Gestión de Mascotas
- **5 tipos de mascotas**: Perros, Gatos, Conejos, Hámsters y Pájaros
- **Poderes especiales**: Vuelo, Super Fuerza, Invisibilidad, Telepatía, Regeneración
- **Personalidades**: Amigable, Tímido, Agresivo, Juguetón
- **Estadísticas dinámicas**: Salud, Energía, Felicidad

### 🍽️ Sistema de Cuidados
- **Alimentación**: Comida Normal, Premium y Especial
- **Paseos**: Cortos (15 min), Normales (30 min), Largos (60 min)
- **Medicamentos**: Vitamina C, Antibióticos, Antidepresivos
- **Sistema de enfermedades**: Resfriados, Problemas estomacales, Tristeza, Heridas

### 🎯 Características Avanzadas
- **Inventario de items**: Colección de objetos para mascotas
- **Sistema de inmunidades**: Prevención de enfermedades
- **Decay natural**: Las estadísticas disminuyen con el tiempo
- **Notificaciones inteligentes**: Alertas cuando las mascotas necesitan atención
- **Interfaz responsive**: Funciona en desktop y móviles

## 🚀 Tecnologías Utilizadas

### Frontend
- **HTML5**: Estructura semántica
- **CSS3**: Estilos modernos con variables CSS, Grid y Flexbox
- **JavaScript ES6+**: Programación orientada a objetos, async/await
- **Font Awesome**: Iconografía
- **Google Fonts**: Tipografía Poppins

### Backend
- **Node.js**: Runtime de JavaScript
- **Express.js**: Framework web
- **MongoDB**: Base de datos NoSQL
- **Mongoose**: ODM para MongoDB
- **JWT**: Autenticación segura
- **bcryptjs**: Encriptación de contraseñas

### APIs Externas (Recomendadas)
- **Pixabay API**: Imágenes de mascotas y fondos
- **Giphy API**: Animaciones y GIFs
- **OpenWeather API**: Efectos climáticos
- **TinyPNG API**: Optimización de imágenes

## 🎨 Diseño y UX

### Paleta de Colores
- **Primario**: `#6366f1` (Índigo)
- **Secundario**: `#8b5cf6` (Púrpura)
- **Acento**: `#f59e0b` (Ámbar)
- **Éxito**: `#10b981` (Verde)
- **Peligro**: `#ef4444` (Rojo)
- **Fondo**: `#0f172a` (Azul oscuro)

### Características de Diseño
- **Modo oscuro**: Interfaz elegante y moderna
- **Animaciones suaves**: Transiciones CSS y JavaScript
- **Gradientes**: Efectos visuales atractivos
- **Responsive**: Adaptable a todos los dispositivos
- **Accesibilidad**: Navegación por teclado y lectores de pantalla

## 🎯 Funcionalidades del Juego

### Creación de Mascotas
1. Seleccionar tipo de mascota
2. Elegir poder especial
3. Definir personalidad
4. Establecer edad y descripción
5. Personalizar nombre

### Cuidado Diario
- **Alimentar**: Mantener energía y salud
- **Pasear**: Aumentar felicidad y ejercicio
- **Curar**: Tratar enfermedades específicas
- **Jugar**: Interactuar con la mascota

### Sistema de Progresión
- **Estadísticas dinámicas**: Cambian con el tiempo
- **Enfermedades**: Requieren atención médica
- **Inmunidades**: Se desarrollan después de curar enfermedades
- **Recomendaciones**: Sugerencias inteligentes para el cuidado

## 🔧 Instalación y Configuración

### Prerrequisitos
- Node.js (v14 o superior)
- MongoDB (local o Atlas)
- NPM o Yarn

### Pasos de Instalación

1. **Clonar el repositorio**
```bash
git clone <tu-repositorio>
cd api-superheroes
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**
```bash
cp config.env.example config.env
# Editar config.env con tus credenciales
```

4. **Configurar MongoDB**
```bash
# Asegúrate de que MongoDB esté corriendo
# O configura la URL de MongoDB Atlas en config.env
```

5. **Ejecutar migraciones (opcional)**
```bash
npm run migrate
```

6. **Iniciar el servidor**
```bash
# Desarrollo
npm run dev

# Producción
npm start
```

### Variables de Entorno

```env
# Servidor
PORT=3000
NODE_ENV=development

# Base de Datos
MONGODB_URI=mongodb://localhost:27017/petventure

# JWT
JWT_SECRET=tu_jwt_secret_super_seguro

# APIs Externas (Opcionales)
PIXABAY_API_KEY=tu_pixabay_key
GIPHY_API_KEY=tu_giphy_key
OPENWEATHER_API_KEY=tu_openweather_key
TINYPNG_API_KEY=tu_tinypng_key
```

## 🎮 Cómo Jugar

### Primeros Pasos
1. **Registrarse**: Crear una cuenta nueva
2. **Iniciar sesión**: Acceder con tus credenciales
3. **Crear mascota**: Seleccionar tipo y personalidad
4. **Comenzar a jugar**: Alimentar, pasear y cuidar

### Consejos de Juego
- **Mantén las estadísticas altas**: Salud, energía y felicidad
- **Observa las notificaciones**: Te avisan cuando algo necesita atención
- **Experimenta con personalidades**: Cada una tiene ventajas diferentes
- **Usa medicamentos específicos**: Para cada tipo de enfermedad
- **Pasea regularmente**: Aumenta la felicidad de tu mascota

### Estrategias Avanzadas
- **Rotación de mascotas**: Cuida múltiples mascotas
- **Gestión de inventario**: Usa items estratégicamente
- **Prevención**: Mantén inmunidades activas
- **Optimización**: Maximiza el uso de recursos

## 🔍 Estructura del Proyecto

```
api-superheroes/
├── public/                 # Archivos del frontend
│   ├── index.html         # Página principal del juego
│   ├── styles.css         # Estilos del juego
│   └── js/               # JavaScript del juego
│       ├── config.js     # Configuración
│       ├── auth.js       # Sistema de autenticación
│       ├── pets.js       # Gestión de mascotas
│       ├── game.js       # Lógica del juego
│       ├── ui.js         # Interfaz de usuario
│       └── app.js        # Aplicación principal
├── src/                   # Backend
│   ├── app.js           # Servidor principal
│   ├── controllers/     # Controladores
│   ├── models/         # Modelos de datos
│   ├── services/       # Lógica de negocio
│   ├── middleware/     # Middleware
│   └── config/         # Configuración
├── package.json
└── README.md
```

## 🧪 Testing

### Pruebas Manuales
1. **Registro de usuario**: Verificar validaciones
2. **Creación de mascotas**: Probar todos los tipos
3. **Sistema de cuidados**: Alimentar, pasear, curar
4. **Enfermedades**: Simular y curar diferentes tipos
5. **Responsive**: Probar en diferentes dispositivos

### Pruebas Automatizadas (Futuro)
```bash
# Instalar dependencias de testing
npm install --save-dev jest supertest

# Ejecutar tests
npm test
```

## 🚀 Despliegue

### Render.com
1. Conectar repositorio de GitHub
2. Configurar variables de entorno
3. Establecer comando de build: `npm install`
4. Comando de start: `npm start`

### Variables de Producción
```env
NODE_ENV=production
MONGODB_URI=mongodb+srv://...
JWT_SECRET=secret_produccion_muy_seguro
```

## 📊 Métricas y Analytics

### Estadísticas del Juego
- Usuarios registrados
- Mascotas creadas
- Actividades realizadas
- Tiempo de juego promedio
- Mascotas más populares

### Monitoreo
- Logs de errores
- Performance de la API
- Uso de recursos
- Métricas de usuario

## 🔮 Futuras Mejoras

### Funcionalidades Planificadas
- **Sistema de logros**: Badges y recompensas
- **Multiplayer**: Interacción entre usuarios
- **Tienda virtual**: Comprar items con monedas
- **Eventos especiales**: Temporadas y festividades
- **Sistema de amigos**: Red social de mascotas
- **Mini-juegos**: Actividades adicionales

### Mejoras Técnicas
- **PWA**: Aplicación web progresiva
- **Offline mode**: Funcionalidad sin conexión
- **Push notifications**: Alertas en tiempo real
- **WebSockets**: Comunicación en tiempo real
- **Machine Learning**: IA para recomendaciones

## 🤝 Contribución

### Guías de Contribución
1. Fork el proyecto
2. Crear rama feature: `git checkout -b feature/nueva-funcionalidad`
3. Commit cambios: `git commit -m 'Agregar nueva funcionalidad'`
4. Push a la rama: `git push origin feature/nueva-funcionalidad`
5. Abrir Pull Request

### Estándares de Código
- **ESLint**: Linting de JavaScript
- **Prettier**: Formateo de código
- **Conventional Commits**: Estándar de commits
- **Code Review**: Revisión obligatoria

## 📞 Soporte

### Contacto
- **Email**: tu-email@ejemplo.com
- **GitHub Issues**: Reportar bugs y solicitar features
- **Documentación**: `/api-docs` para la API

### Recursos Adicionales
- **API Documentation**: Swagger UI en `/api-docs`
- **Postman Collection**: Endpoints documentados
- **Video Tutorial**: Guía paso a paso
- **FAQ**: Preguntas frecuentes

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 🙏 Agradecimientos

- **Profesores**: Por la guía académica
- **Compañeros**: Por el feedback y testing
- **Comunidad**: Por las librerías open source
- **Familia**: Por el apoyo durante el desarrollo

---

**¡Disfruta cuidando de tus mascotas virtuales en PetVenture! 🐾✨** 