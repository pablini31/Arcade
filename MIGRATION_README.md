# 🚀 Migración a MongoDB Atlas - API Superhéroes

## 📋 Pasos para migrar tu proyecto a MongoDB Atlas

### 1️⃣ Crear cuenta en MongoDB Atlas

#### Paso 1: Registro
1. Ve a [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Haz clic en "Try Free" o "Get Started Free"
3. Completa el formulario de registro
4. Selecciona "Create a free account"

#### Paso 2: Crear clúster
1. Selecciona "Build a Database"
2. Elige "FREE" tier (M0)
3. Selecciona un proveedor (AWS, Google Cloud, o Azure) y una región cercana
4. Haz clic en "Create"

#### Paso 3: Configurar seguridad
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

#### Paso 4: Obtener connection string
1. Ve a "Database" en el menú lateral
2. Haz clic en "Connect"
3. Selecciona "Connect your application"
4. Copia el connection string

### 2️⃣ Configurar el proyecto

#### Instalar dependencias
```bash
npm install
```

#### Configurar variables de entorno
1. Edita el archivo `config.env`
2. Reemplaza `<password>` con tu contraseña real
3. Reemplaza `cluster0.xxxxx` con tu cluster real

```env
MONGODB_URI=mongodb+srv://superheroes_user:TU_PASSWORD@TU_CLUSTER.mongodb.net/superheroesDB?retryWrites=true&w=majority
PORT=3000
NODE_ENV=development
```

### 3️⃣ Ejecutar la migración

#### Ejecutar el script de migración
```bash
npm run migrate
```

Este comando:
- ✅ Conecta a MongoDB Atlas
- 📋 Lee los archivos JSON de héroes y mascotas
- 🐾 Migra todos los datos a las colecciones correspondientes
- 🔗 Establece las referencias entre héroes y mascotas
- 🔍 Valida la integridad de los datos
- 📊 Muestra estadísticas detalladas

### 4️⃣ Verificar la migración

#### Conectar a MongoDB Atlas
1. Ve a tu cluster en MongoDB Atlas
2. Haz clic en "Browse Collections"
3. Verifica que existan las colecciones:
   - `heroes` - Contiene todos los héroes
   - `mascotas` - Contiene todas las mascotas

#### Ejecutar la aplicación
```bash
npm run dev
```

La aplicación ahora usará MongoDB en lugar de archivos JSON.

### 5️⃣ Características del script de migración

#### ✅ Funcionalidades
- **Detección de duplicados**: No crea registros duplicados
- **Actualización inteligente**: Actualiza registros existentes
- **Validación de datos**: Verifica la integridad de los datos
- **Manejo de errores**: Continúa aunque algunos registros fallen
- **Estadísticas detalladas**: Muestra el progreso y resultados
- **Referencias automáticas**: Vincula héroes con sus mascotas

#### 🔄 Re-ejecución segura
El script puede ejecutarse múltiples veces sin problemas:
- Actualiza registros existentes
- Crea solo registros nuevos
- Mantiene la integridad de los datos

#### 📊 Validaciones incluidas
- Verifica que todos los héroes existan
- Valida que las mascotas tengan héroes válidos
- Comprueba la integridad de las referencias
- Muestra estadísticas de la base de datos

### 6️⃣ Estructura de la base de datos

#### Colección: `heroes`
```javascript
{
  id: Number,           // ID único del héroe
  nombre: String,       // Nombre real
  alias: String,        // Nombre de superhéroe
  poder: String,        // Poder principal
  edad: Number,         // Edad del héroe
  ciudad: String,       // Ciudad de origen
  mascotas: [ObjectId], // Referencias a mascotas
  createdAt: Date,      // Timestamp de creación
  updatedAt: Date       // Timestamp de actualización
}
```

#### Colección: `mascotas`
```javascript
{
  id: Number,                    // ID único de la mascota
  nombre: String,                // Nombre de la mascota
  tipo: String,                  // Tipo de animal
  poder: String,                 // Poder de la mascota
  edad: Number,                  // Edad de la mascota
  energia: Number,               // Nivel de energía (0-100)
  descripcion: String,           // Descripción
  idLugar: Number,               // ID del lugar
  adoptadoPor: Number,           // ID del héroe que la adoptó
  salud: Number,                 // Nivel de salud (0-100)
  felicidad: Number,             // Nivel de felicidad (0-100)
  personalidad: String,          // Tipo de personalidad
  ultimaAlimentacion: Date,      // Última vez que comió
  ultimoPaseo: Date,             // Último paseo
  enfermedad: Object,            // Información de enfermedad
  items: [Object],               // Items que tiene
  inmunidades: Map,              // Inmunidades a enfermedades
  createdAt: Date,               // Timestamp de creación
  updatedAt: Date                // Timestamp de actualización
}
```

### 7️⃣ Comandos útiles

```bash
# Instalar dependencias
npm install

# Ejecutar migración
npm run migrate

# Ejecutar en modo desarrollo
npm run dev

# Ejecutar en producción
npm start
```

### 8️⃣ Solución de problemas

#### Error de conexión
- Verifica que el connection string sea correcto
- Asegúrate de que la IP esté permitida en Network Access
- Confirma que el usuario y contraseña sean correctos

#### Error de migración
- Verifica que los archivos JSON existan
- Asegúrate de que el formato de los JSON sea válido
- Revisa los logs para identificar el problema específico

#### Datos faltantes
- El script muestra estadísticas detalladas
- Revisa los errores en la consola
- Ejecuta el script nuevamente para completar la migración

### 9️⃣ Próximos pasos

Una vez completada la migración:
1. ✅ Tu API ahora usa MongoDB Atlas
2. ✅ Los datos están en la nube
3. ✅ Puedes acceder desde cualquier lugar
4. ✅ Escalabilidad automática
5. ✅ Backup automático

¡Tu API de superhéroes está lista para producción! 🎉 