# 🚀 Configuración de MongoDB Atlas - Guía Paso a Paso

## 📋 Problema Detectado
El cluster actual `cluster0.mgmc2cjd.mongodb.net` no se puede encontrar. Necesitamos crear un nuevo cluster.

## 🔧 Pasos para Configurar MongoDB Atlas

### 1️⃣ Crear cuenta en MongoDB Atlas
1. Ve a [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Haz clic en "Try Free" o "Get Started Free"
3. Completa el formulario de registro
4. Selecciona "Create a free account"

### 2️⃣ Crear nuevo clúster
1. Selecciona "Build a Database"
2. Elige "FREE" tier (M0)
3. Selecciona un proveedor (AWS, Google Cloud, o Azure) y una región cercana
4. Haz clic en "Create"

### 3️⃣ Configurar seguridad
1. **Database Access**: Ve a "Database Access" en el menú lateral
   - Haz clic en "Add New Database User"
   - Username: `superheroes_user`
   - Password: Genera una contraseña segura (guárdala)
   - Database User Privileges: "Read and write to any database"
   - Haz clic en "Add User"

2. **Network Access**: Ve a "Network Access"
   - Haz clic en "Add IP Address"
   - Selecciona "Allow Access from Anywhere" (0.0.0.0/0) para desarrollo
   - Haz clic en "Confirm"

### 4️⃣ Obtener connection string
1. Ve a "Database" en el menú lateral
2. Haz clic en "Connect"
3. Selecciona "Connect your application"
4. Copia el connection string

### 5️⃣ Actualizar configuración
Una vez que tengas el nuevo connection string, actualiza el archivo `config.env`:

```env
# MongoDB Atlas Configuration
MONGODB_URI=mongodb+srv://superheroes_user:TU_NUEVA_PASSWORD@TU_NUEVO_CLUSTER.mongodb.net/api-superheroes?retryWrites=true&w=majority

# Server Configuration
PORT=3000
NODE_ENV=development
```

### 6️⃣ Verificar conexión
Ejecuta el script de prueba:
```bash
node test_connection.js
```

### 7️⃣ Ejecutar migración
Una vez que la conexión funcione:
```bash
npm run migrate
```

## 🔍 Verificación Final
Después de la migración, ejecuta:
```bash
node verify_migration.js
```

## 📞 ¿Necesitas ayuda?
Si tienes problemas con alguno de estos pasos, puedes:
1. Revisar la documentación oficial de MongoDB Atlas
2. Verificar que el cluster esté activo
3. Confirmar que las credenciales sean correctas
4. Asegurarte de que la IP esté permitida

¡Una vez configurado correctamente, tu API estará lista para usar MongoDB Atlas! 🎉 