# 🎮 Instrucciones para Probar PetVenture

## 🚀 Inicio Rápido

### 1. Preparar el Entorno
```bash
# Clonar el repositorio (si no lo has hecho)
git clone <tu-repositorio>
cd api-superheroes

# Instalar dependencias
npm install

# Copiar archivo de configuración
cp config.env.example config.env
```

### 2. Configurar Base de Datos
```bash
# Opción A: MongoDB Local
# Asegúrate de que MongoDB esté corriendo en tu máquina

# Opción B: MongoDB Atlas (Recomendado para pruebas)
# 1. Ve a https://cloud.mongodb.com
# 2. Crea un cluster gratuito
# 3. Obtén la URL de conexión
# 4. Actualiza MONGODB_URI en config.env
```

### 3. Configurar Variables de Entorno
Edita el archivo `config.env`:
```env
PORT=3000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/petventure
JWT_SECRET=mi_secret_super_seguro_123
```

### 4. Iniciar el Servidor
```bash
# Desarrollo
npm run dev

# O producción
npm start
```

### 5. Acceder al Juego
Abre tu navegador y ve a: `http://localhost:3000`

## 🎯 Pruebas del Juego

### Prueba 1: Registro de Usuario
1. **Abrir el juego** en `http://localhost:3000`
2. **Hacer clic en "Registrarse"**
3. **Completar el formulario**:
   - Usuario: `testuser`
   - Email: `test@example.com`
   - Nombre: `Usuario de Prueba`
   - Contraseña: `123456`
4. **Hacer clic en "Registrarse"**
5. **Verificar** que aparezca el mensaje de bienvenida

### Prueba 2: Crear Primera Mascota
1. **Hacer clic en "Nueva Mascota"**
2. **Completar el formulario**:
   - Nombre: `Luna`
   - Tipo: `Gato`
   - Poder: `Invisibilidad`
   - Edad: `2`
   - Descripción: `Una gatita muy traviesa`
3. **Hacer clic en "Crear Mascota"**
4. **Verificar** que la mascota aparezca en la lista

### Prueba 3: Alimentar la Mascota
1. **Seleccionar la mascota** en la lista
2. **Hacer clic en "Comida Normal"**
3. **Verificar** que aumenten las estadísticas de energía y salud
4. **Probar comida Premium y Especial**

### Prueba 4: Pasear la Mascota
1. **Hacer clic en "Paseo Normal"**
2. **Verificar** que aumente la felicidad y disminuya la energía
3. **Probar paseos cortos y largos**

### Prueba 5: Cambiar Personalidad
1. **Hacer clic en "Amigable"** en la sección de personalidad
2. **Verificar** que cambie la personalidad de la mascota

### Prueba 6: Simular Enfermedad (Opcional)
1. **Usar la consola del navegador** (F12)
2. **Ejecutar**:
```javascript
// Hacer enfermar a la mascota actual
const currentPet = petManager.getCurrentPet();
if (currentPet) {
    petManager.makePetSick(currentPet.id, 'resfriado')
        .then(result => {
            console.log('Mascota enferma:', result);
            uiManager.updateUI();
        });
}
```
3. **Verificar** que aparezca el indicador de enfermedad
4. **Curar** usando "Vitamina C"

### Prueba 7: Crear Múltiples Mascotas
1. **Crear una segunda mascota**:
   - Nombre: `Max`
   - Tipo: `Perro`
   - Poder: `Super Fuerza`
   - Personalidad: `Juguetón`
2. **Alternar entre mascotas** y verificar que cada una mantenga sus estadísticas

### Prueba 8: Probar Responsive
1. **Cambiar el tamaño de la ventana** del navegador
2. **Verificar** que la interfaz se adapte correctamente
3. **Probar en móvil** usando las herramientas de desarrollador

## 🔧 Funciones de Debug (Solo en Desarrollo)

### Acceder a Funciones de Debug
```javascript
// En la consola del navegador
window.PetVenture.showDebug(); // Mostrar información de debug
window.PetVenture.checkStatus(); // Verificar estado de la aplicación
window.PetVenture.clearData(); // Limpiar datos del juego
```

### Ver Logs del Juego
```javascript
// Ver logs detallados en la consola
ConfigUtils.log('info', 'Mensaje de prueba');
```

### Simular Acciones Avanzadas
```javascript
// Simular múltiples acciones
const currentPet = petManager.getCurrentPet();
if (currentPet) {
    // Alimentar múltiples veces
    for (let i = 0; i < 5; i++) {
        setTimeout(() => {
            petManager.feedPet(currentPet.id, 'premium');
        }, i * 1000);
    }
}
```

## 🐛 Solución de Problemas

### Error: "No se puede conectar a MongoDB"
```bash
# Verificar que MongoDB esté corriendo
mongod --version

# O usar MongoDB Atlas
# Actualizar MONGODB_URI en config.env
```

### Error: "Puerto 3000 en uso"
```bash
# Cambiar puerto en config.env
PORT=3001

# O matar el proceso que usa el puerto
lsof -ti:3000 | xargs kill -9
```

### Error: "Módulos no encontrados"
```bash
# Reinstalar dependencias
rm -rf node_modules package-lock.json
npm install
```

### Error: "CORS"
```bash
# Verificar configuración de CORS en config.env
CORS_ORIGIN=http://localhost:3000
```

### Error: "JWT Secret"
```bash
# Generar un nuevo JWT secret
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
# Copiar el resultado a JWT_SECRET en config.env
```

## 📊 Verificar Funcionamiento

### Verificar API
```bash
# Probar endpoint de salud
curl http://localhost:3000/health

# Probar endpoint de la API
curl http://localhost:3000/api
```

### Verificar Base de Datos
```bash
# Conectar a MongoDB
mongosh
use petventure
db.usuarios.find()
db.mascotas.find()
```

### Verificar Logs
```bash
# Ver logs del servidor
npm run dev

# Los logs aparecerán en la consola con timestamps
```

## 🎮 Consejos para las Pruebas

### Flujo de Prueba Recomendado
1. **Registro y Login** - Verificar autenticación
2. **Creación de Mascotas** - Probar todos los tipos
3. **Sistema de Cuidados** - Alimentar, pasear, curar
4. **Personalidades** - Cambiar entre diferentes tipos
5. **Enfermedades** - Simular y curar
6. **Múltiples Mascotas** - Gestión de varias mascotas
7. **Responsive** - Probar en diferentes tamaños
8. **Persistencia** - Recargar página y verificar datos

### Datos de Prueba
```javascript
// Usuarios de prueba
{
  username: 'testuser1',
  email: 'test1@example.com',
  name: 'Usuario Prueba 1',
  password: '123456'
}

// Mascotas de prueba
{
  nombre: 'Luna',
  tipo: 'gato',
  poder: 'invisibilidad',
  edad: 2,
  personalidad: 'amigable'
}
```

### Verificaciones Importantes
- ✅ Las estadísticas cambian correctamente
- ✅ Las notificaciones aparecen
- ✅ Los datos se guardan en MongoDB
- ✅ La interfaz es responsive
- ✅ Las animaciones funcionan
- ✅ Los errores se manejan correctamente
- ✅ La autenticación funciona
- ✅ Los datos persisten entre sesiones

## 🚀 Preparación para Producción

### Variables de Producción
```env
NODE_ENV=production
MONGODB_URI=mongodb+srv://...
JWT_SECRET=secret_produccion_muy_seguro_y_largo
CORS_ORIGIN=https://tu-dominio.com
```

### Optimizaciones
- Comprimir imágenes
- Minificar CSS y JS
- Habilitar caché
- Configurar HTTPS
- Monitorear logs

---

**¡Disfruta probando PetVenture! 🐾✨** 