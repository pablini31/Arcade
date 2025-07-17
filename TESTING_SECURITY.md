# 🔒 Guía de Pruebas de Seguridad - API Superhéroes

Esta guía explica cómo probar que cada usuario vea solo lo que es suyo y que el sistema de autenticación funcione correctamente.

## 📋 Archivos de Prueba

### 1. `test_api.js` - Pruebas Básicas
- **Propósito**: Verificar que los endpoints básicos funcionen
- **Pruebas**:
  - Registro de usuarios
  - Login de usuarios
  - Obtención de perfil
  - Obtención de mascotas
  - Obtención de inventario
  - Obtención de estadísticas
  - Obtención de ranking

### 2. `test_security.js` - Pruebas de Seguridad
- **Propósito**: Verificar aislamiento de datos entre usuarios
- **Pruebas**:
  - Creación de múltiples usuarios
  - Verificación de que cada usuario ve su propio perfil
  - Verificación de que cada usuario ve solo sus propias mascotas
  - Verificación de inventarios únicos por usuario
  - Verificación de estadísticas únicas por usuario
  - Pruebas con tokens inválidos
  - Pruebas sin token de autorización

### 3. `test_edge_cases.js` - Casos Edge
- **Propósito**: Probar situaciones límite y casos especiales
- **Pruebas**:
  - Login con credenciales incorrectas
  - Login con email vs username
  - Tokens manipulados o inválidos
  - Múltiples sesiones simultáneas
  - Headers de autorización malformados
  - Rate limiting (si está implementado)
  - Verificación de que no se expone información sensible

### 4. `test_data_integrity.js` - Integridad de Datos
- **Propósito**: Verificar consistencia y aislamiento completo de datos
- **Pruebas**:
  - Creación de múltiples usuarios de prueba
  - Verificación de consistencia de datos por usuario
  - Verificación de que no hay cross-contamination
  - Verificación de que el ranking muestra información correcta
  - Verificación de aislamiento completo entre usuarios

### 5. `run_all_tests.js` - Script Maestro
- **Propósito**: Ejecutar todas las pruebas en secuencia
- **Características**:
  - Verifica que el servidor esté corriendo
  - Ejecuta todas las pruebas en orden
  - Genera un resumen final
  - Maneja errores y timeouts

## 🚀 Cómo Ejecutar las Pruebas

### Prerrequisitos
1. Asegúrate de que el servidor esté corriendo:
   ```bash
   npm start
   ```

2. Verifica que tienes `node-fetch` instalado:
   ```bash
   npm install node-fetch
   ```

### Ejecutar Todas las Pruebas
```bash
node run_all_tests.js
```

### Ejecutar Pruebas Individuales
```bash
# Pruebas básicas
node test_api.js

# Pruebas de seguridad
node test_security.js

# Casos edge
node test_edge_cases.js

# Integridad de datos
node test_data_integrity.js
```

## 🔍 Qué Verificar en las Pruebas

### ✅ Comportamientos Correctos
1. **Aislamiento de Usuarios**: Cada usuario solo ve sus propios datos
2. **Autenticación**: Solo usuarios autenticados pueden acceder a datos protegidos
3. **Autorización**: Los tokens son válidos y únicos por sesión
4. **Consistencia**: Los datos son consistentes entre diferentes endpoints
5. **Seguridad**: No se expone información sensible

### ❌ Problemas a Detectar
1. **Cross-contamination**: Un usuario puede ver datos de otro
2. **Tokens inválidos**: Se permite acceso con tokens falsos
3. **Falta de autenticación**: Se puede acceder sin token
4. **Inconsistencia**: Los datos no coinciden entre endpoints
5. **Información sensible expuesta**: Contraseñas, tokens, etc.

## 📊 Interpretación de Resultados

### Resultados Exitosos
```
🎉 ¡TODAS LAS PRUEBAS PASARON EXITOSAMENTE!
🔒 El sistema de autenticación y seguridad está funcionando correctamente.
```

### Resultados con Errores
```
⚠️  ALGUNAS PRUEBAS FALLARON
🔍 Revisa los errores anteriores para identificar problemas de seguridad.
```

## 🛠️ Solución de Problemas

### Error: "Servidor no está corriendo"
```bash
# Inicia el servidor
npm start

# En otra terminal, ejecuta las pruebas
node run_all_tests.js
```

### Error: "node-fetch not found"
```bash
npm install node-fetch
```

### Error: "Cannot find module"
```bash
# Asegúrate de estar en el directorio correcto
cd api-superheroes

# Verifica que los archivos de prueba existen
ls test_*.js
```

## 🔧 Personalización de Pruebas

### Modificar Usuarios de Prueba
En `test_security.js` y `test_data_integrity.js`, puedes modificar los usuarios de prueba:

```javascript
const usuarios = [
    { username: 'mi_usuario1', email: 'mi1@test.com', password: '123456', nombre: 'Mi', apellido: 'Usuario1' },
    // Agregar más usuarios...
];
```

### Agregar Nuevas Pruebas
1. Crea un nuevo archivo `test_mi_nueva_prueba.js`
2. Sigue el patrón de los otros archivos de prueba
3. Agrega la nueva prueba a `run_all_tests.js`

## 📝 Logs y Debugging

### Niveles de Log
- `✅` - Prueba exitosa
- `❌` - Prueba fallida
- `⚠️` - Advertencia
- `🔍` - Información de debugging

### Información Detallada
Los logs incluyen:
- Respuestas completas de la API
- Tokens (parcialmente ocultos)
- Números de elementos (mascotas, inventarios, etc.)
- Errores específicos

## 🔄 Mantenimiento

### Actualizar Pruebas
Cuando agregues nuevos endpoints o funcionalidades:
1. Actualiza las pruebas existentes
2. Agrega nuevas pruebas específicas
3. Verifica que todas las pruebas pasen

### Limpieza de Datos
Las pruebas crean usuarios de prueba. Para limpiar:
1. Usa usuarios con prefijos específicos (ej: `test_`)
2. Implementa un endpoint de limpieza si es necesario
3. Considera usar una base de datos de prueba separada

## 🎯 Objetivos de Seguridad

### Principios Verificados
1. **Principio de menor privilegio**: Usuarios solo acceden a sus datos
2. **Aislamiento de datos**: No hay contaminación entre usuarios
3. **Autenticación robusta**: Tokens válidos y seguros
4. **Autorización consistente**: Mismo nivel de acceso en todos los endpoints
5. **Protección de información sensible**: No se expone información privada

### Métricas de Éxito
- ✅ 100% de pruebas pasando
- ✅ 0% de cross-contamination de datos
- ✅ 0% de accesos no autorizados
- ✅ 100% de consistencia de datos 