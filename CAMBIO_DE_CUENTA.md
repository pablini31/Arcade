# 🔄 Funcionalidad de Cambio de Cuenta - PetVenture

## 📋 Descripción

Se ha implementado una nueva funcionalidad que permite a los usuarios cambiar entre cuentas y registrar múltiples cuentas desde la misma sesión. Esto es especialmente útil para que los profesores puedan verificar el sistema de registro sin necesidad de cerrar sesión.

## ✨ Características Principales

### 1. Botón "Cambiar Cuenta"
- **Ubicación**: Header del juego, junto al botón de "Cerrar Sesión"
- **Icono**: 🔄 (exchange-alt)
- **Funcionalidad**: Permite cambiar de cuenta o registrar nuevas cuentas

### 2. Opciones Disponibles

#### Opción 1: Cambiar de Cuenta
- Cierra la sesión actual
- Muestra la pantalla de autenticación
- Permite iniciar sesión con otra cuenta existente

#### Opción 2: Registrar Nueva Cuenta
- Mantiene la sesión actual activa
- Abre un modal de registro rápido
- Permite crear una nueva cuenta sin cerrar sesión

#### Opción 3: Cancelar
- No realiza ninguna acción
- Mantiene la sesión actual

## 🎯 Casos de Uso

### Para Estudiantes
- Crear múltiples cuentas para probar diferentes funcionalidades
- Cambiar entre cuentas de prueba
- Mantener una cuenta principal mientras experimenta con otras

### Para Profesores
- Verificar el sistema de registro sin perder la sesión actual
- Crear múltiples cuentas de prueba para evaluar
- Probar diferentes escenarios de usuario

## 🚀 Cómo Usar

### Cambiar de Cuenta
1. Haz clic en el botón "🔄 Cambiar Cuenta" en el header
2. Selecciona la opción "1" (Cambiar de cuenta)
3. Confirma que quieres cerrar la sesión actual
4. Se mostrará la pantalla de login/registro
5. Inicia sesión con otra cuenta o registra una nueva

### Registrar Nueva Cuenta (Sin Cerrar Sesión)
1. Haz clic en el botón "🔄 Cambiar Cuenta" en el header
2. Selecciona la opción "2" (Registrar nueva cuenta)
3. Completa el formulario del modal:
   - Nombre completo
   - Nombre de usuario
   - Email
   - Contraseña
   - Confirmar contraseña
4. Haz clic en "Registrar"
5. La nueva cuenta se creará y podrás usarla más tarde

## 🔧 Implementación Técnica

### Archivos Modificados
- `public/js/game.js`: Agregada función `switchAccount()`
- `public/js/ui.js`: Agregado botón y modal de registro rápido
- `public/js/auth.js`: Agregada función `registerAdditionalUser()`
- `public/styles.css`: Estilos para el botón de cambiar cuenta

### Nuevas Funciones
```javascript
// GameManager
switchAccount() // Cambia de cuenta cerrando sesión actual

// UIManager
addSwitchAccountButton() // Agrega el botón al header
showQuickRegisterModal() // Muestra modal de registro rápido

// AuthManager
registerAdditionalUser() // Registra cuenta sin afectar sesión actual
```

## 🎨 Diseño Visual

### Botón de Cambiar Cuenta
- **Color**: Gradiente púrpura (#8b5cf6 → #6366f1)
- **Efectos**: Hover con elevación y sombra
- **Icono**: FontAwesome exchange-alt
- **Posición**: Header del juego, antes del botón de logout

### Modal de Registro Rápido
- **Estilo**: Consistente con el tema de la aplicación
- **Fondo**: Gradiente oscuro con blur
- **Formulario**: Campos con iconos y validación
- **Responsive**: Adaptable a diferentes tamaños de pantalla

## 🔒 Seguridad

- Las contraseñas se validan en frontend y backend
- Los emails se validan con regex
- Los nombres de usuario deben tener al menos 3 caracteres
- Las contraseñas deben tener al menos 6 caracteres
- Confirmación de contraseña obligatoria

## 📱 Compatibilidad

- **Desktop**: Funcionalidad completa
- **Tablet**: Modal responsive
- **Móvil**: Optimizado para pantallas táctiles
- **Navegadores**: Chrome, Firefox, Safari, Edge

## 🐛 Solución de Problemas

### El botón no aparece
- Verifica que estés en la pantalla del juego
- Recarga la página si es necesario
- Revisa la consola del navegador para errores

### Error al registrar
- Verifica que todos los campos estén completos
- Asegúrate de que las contraseñas coincidan
- El email debe tener formato válido
- El nombre de usuario debe ser único

### Modal no se cierra
- Haz clic en "Cancelar" o "X"
- Haz clic fuera del modal
- Presiona ESC (funcionalidad futura)

## 🔮 Mejoras Futuras

- [ ] Atajos de teclado (ESC para cerrar modal)
- [ ] Lista de cuentas recientes
- [ ] Cambio rápido entre cuentas frecuentes
- [ ] Exportar/importar datos de cuenta
- [ ] Sincronización entre dispositivos

## 📞 Soporte

Si encuentras algún problema con esta funcionalidad:
1. Revisa la consola del navegador para errores
2. Intenta recargar la página
3. Limpia el caché del navegador
4. Contacta al desarrollador con los detalles del error

---

**Desarrollado con ❤️ para PetVenture** 