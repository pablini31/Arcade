// Aplicación Principal de PetVenture
// Este archivo se ejecuta al final y coordina todos los sistemas

console.log('🐾 PetVenture - Inicializando aplicación...');

// Verificar que todos los módulos estén disponibles
if (typeof CONFIG === 'undefined') {
    console.error('❌ Error: CONFIG no está disponible');
}

if (typeof authManager === 'undefined') {
    console.error('❌ Error: authManager no está disponible');
}

if (typeof petManager === 'undefined') {
    console.error('❌ Error: petManager no está disponible');
}

if (typeof uiManager === 'undefined') {
    console.error('❌ Error: uiManager no está disponible');
}

if (typeof gameManager === 'undefined') {
    console.error('❌ Error: gameManager no está disponible');
}

// Fix para elementos DOM críticos - prevenir errores de className null
function ensureCriticalDOMElements() {
    const criticalElements = [
        'auth-screen',
        'game-screen', 
        'loading-screen',
        'login-form',
        'register-form',
        'login-username',
        'login-password',
        'register-name',
        'register-username', 
        'register-email',
        'register-password',
        'register-confirm-password'
    ];
    
    criticalElements.forEach(elementId => {
        if (!document.getElementById(elementId)) {
            console.warn(`🔧 Elemento crítico ${elementId} no encontrado, creando placeholder...`);
            const placeholder = document.createElement('div');
            placeholder.id = elementId;
            placeholder.style.display = 'none';
            document.body.appendChild(placeholder);
        }
    });
}

// Función de inicialización principal con validación DOM mejorada
async function initializePetVenture() {
    try {
        console.log('🚀 Iniciando PetVenture...');
        
        // Verificar que estamos en el entorno correcto
        if (typeof window === 'undefined') {
            throw new Error('PetVenture debe ejecutarse en un navegador');
        }
        
        // Función para esperar a que el DOM esté completamente cargado
        function waitForDOM() {
            return new Promise((resolve) => {
                if (document.readyState === 'loading') {
                    document.addEventListener('DOMContentLoaded', resolve);
                } else {
                    resolve();
                }
            });
        }
        
        // Esperar a que el DOM esté listo
        await waitForDOM();
        
        // Asegurar elementos DOM críticos existan
        ensureCriticalDOMElements();
        
        // Esperar un poco más para asegurar que todos los scripts se carguen
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Verificar que gameManager esté disponible
        if (typeof gameManager === 'undefined') {
            throw new Error('gameManager no está disponible después de la inicialización');
        }
        
        // Inicializar el juego
        await gameManager.initialize();
        
        console.log('✅ PetVenture inicializado correctamente');
        
    } catch (error) {
        console.error('❌ Error al inicializar PetVenture:', error);
        
        // Mostrar error al usuario con validación DOM
        try {
            const errorMessage = document.createElement('div');
            if (errorMessage) {
                errorMessage.style.cssText = `
                    position: fixed;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    background: #ef4444;
                    color: white;
                    padding: 2rem;
                    border-radius: 12px;
                    text-align: center;
                    z-index: 10000;
                    font-family: 'Poppins', sans-serif;
                    max-width: 90vw;
                    box-shadow: 0 4px 20px rgba(0,0,0,0.3);
                `;
                errorMessage.innerHTML = `
                    <h2>🐾 Error en PetVenture</h2>
                    <p style="margin: 1rem 0;">${error.message}</p>
                    <button onclick="location.reload()" style="
                        background: white;
                        color: #ef4444;
                        border: none;
                        padding: 0.75rem 1.5rem;
                        border-radius: 8px;
                        cursor: pointer;
                        margin-top: 1rem;
                        font-weight: bold;
                        transition: all 0.3s ease;
                    " onmouseover="this.style.background='#f3f4f6'" onmouseout="this.style.background='white'">
                        🔄 Recargar página
                    </button>
                    <div style="margin-top: 1rem; font-size: 0.8rem; opacity: 0.8;">
                        Si el problema persiste, contacta al soporte.
                    </div>
                `;
                
                if (document.body) {
                    document.body.appendChild(errorMessage);
                } else {
                    console.error('No se puede mostrar mensaje de error: document.body no disponible');
                }
            }
        } catch (displayError) {
            console.error('Error mostrando mensaje de error:', displayError);
        }
    }
}

// Inicializar cuando la página esté lista
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializePetVenture);
} else {
    // El DOM ya está cargado, esperar un poco antes de inicializar
    setTimeout(initializePetVenture, 100);
}

// Función para manejar errores globales
function handleGlobalError(error) {
    console.error('❌ Error global en PetVenture:', error);
    
    // Enviar error a un servicio de monitoreo (si está configurado)
    if (CONFIG.DEBUG.ENABLED) {
        console.error('Stack trace:', error.stack);
    }
}

// Función para manejar promesas rechazadas
function handleUnhandledRejection(event) {
    console.error('❌ Promesa rechazada en PetVenture:', event.reason);
}

// Configurar manejadores de errores globales
window.addEventListener('error', handleGlobalError);
window.addEventListener('unhandledrejection', handleUnhandledRejection);

// Función para verificar el estado de la aplicación
function checkAppStatus() {
    const status = {
        config: !!CONFIG,
        authManager: !!authManager,
        petManager: !!petManager,
        uiManager: !!uiManager,
        gameManager: !!gameManager,
        domReady: document.readyState === 'complete',
        online: navigator.onLine
    };
    
    console.log('📊 Estado de PetVenture:', status);
    return status;
}

// Función para obtener información de debug
function getDebugInfo() {
    return {
        userAgent: navigator.userAgent,
        screenSize: `${window.innerWidth}x${window.innerHeight}`,
        timestamp: new Date().toISOString(),
        config: CONFIG,
        authStatus: authManager ? {
            isAuthenticated: authManager.isAuthenticated,
            hasUser: !!authManager.user
        } : null,
        petsCount: petManager ? petManager.pets.length : 0,
        currentPet: petManager ? petManager.currentPet : null,
        gameState: gameManager ? gameManager.gameState : null
    };
}

// Función para limpiar datos del juego
function clearGameData() {
    try {
        localStorage.removeItem(CONFIG.STORAGE.KEYS.TOKEN);
        localStorage.removeItem(CONFIG.STORAGE.KEYS.USER);
        localStorage.removeItem(CONFIG.STORAGE.KEYS.SETTINGS);
        localStorage.removeItem(CONFIG.STORAGE.KEYS.GAME_STATE);
        
        console.log('🧹 Datos del juego limpiados');
        
        // Recargar página
        location.reload();
        
    } catch (error) {
        console.error('❌ Error al limpiar datos:', error);
    }
}

// Función para mostrar información de debug (solo en desarrollo)
function showDebugInfo() {
    if (!CONFIG.DEBUG.ENABLED) {
        console.log('🔒 Debug deshabilitado en producción');
        return;
    }
    
    const debugInfo = getDebugInfo();
    console.log('🐛 Información de Debug:', debugInfo);
    
    // Mostrar en una ventana modal
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
    `;
    
    modal.innerHTML = `
        <div style="
            background: #1e293b;
            color: white;
            padding: 2rem;
            border-radius: 12px;
            max-width: 600px;
            max-height: 80vh;
            overflow-y: auto;
            font-family: monospace;
            font-size: 12px;
        ">
            <h3>🐛 Debug Info</h3>
            <pre>${JSON.stringify(debugInfo, null, 2)}</pre>
            <button onclick="this.closest('.modal').remove()" style="
                background: #ef4444;
                color: white;
                border: none;
                padding: 0.5rem 1rem;
                border-radius: 6px;
                cursor: pointer;
                margin-top: 1rem;
            ">Cerrar</button>
        </div>
    `;
    
    document.body.appendChild(modal);
}

// Exponer funciones útiles globalmente (solo en desarrollo)
if (CONFIG.DEBUG.ENABLED) {
    window.PetVenture = {
        checkStatus: checkAppStatus,
        getDebugInfo: getDebugInfo,
        clearData: clearGameData,
        showDebug: showDebugInfo,
        config: CONFIG,
        auth: authManager,
        pets: petManager,
        ui: uiManager,
        game: gameManager
    };
    
    console.log('🔧 Modo debug habilitado. Usa window.PetVenture para acceder a las funciones de debug.');
}

// Función para manejar la conexión a internet
function handleOnlineStatus() {
    if (navigator.onLine) {
        console.log('🌐 Conexión a internet restaurada');
        if (uiManager) {
            uiManager.showSuccess('Conexión a internet restaurada');
        }
    } else {
        console.log('📡 Conexión a internet perdida');
        if (uiManager) {
            uiManager.showWarning('Conexión a internet perdida. Algunas funciones pueden no estar disponibles.');
        }
    }
}

// Configurar eventos de conexión
window.addEventListener('online', handleOnlineStatus);
window.addEventListener('offline', handleOnlineStatus);

// Función para manejar el almacenamiento
function handleStorageChange(event) {
    if (event.key === CONFIG.STORAGE.KEYS.TOKEN) {
        console.log('🔑 Token actualizado');
    } else if (event.key === CONFIG.STORAGE.KEYS.USER) {
        console.log('👤 Datos de usuario actualizados');
    } else if (event.key === CONFIG.STORAGE.KEYS.GAME_STATE) {
        console.log('🎮 Estado del juego actualizado');
    }
}

// Configurar evento de cambio de almacenamiento
window.addEventListener('storage', handleStorageChange);

// Función para manejar la visibilidad de la página
function handleVisibilityChange() {
    if (document.hidden) {
        console.log('👁️ Página oculta');
        if (gameManager) {
            gameManager.pauseGame();
        }
    } else {
        console.log('👁️ Página visible');
        if (gameManager) {
            gameManager.resumeGame();
        }
    }
}

// Configurar evento de visibilidad
document.addEventListener('visibilitychange', handleVisibilityChange);

// Función para manejar el cierre de la página
function handleBeforeUnload() {
    console.log('👋 Cerrando PetVenture...');
    
    if (gameManager) {
        gameManager.saveGameState();
        gameManager.cleanup();
    }
}

// Configurar evento de cierre
window.addEventListener('beforeunload', handleBeforeUnload);

// Función para mostrar información de la aplicación
function showAppInfo() {
    const info = {
        name: 'PetVenture',
        version: '1.0.0',
        description: 'Juego de mascotas virtuales',
        author: 'Tu Nombre',
        apiUrl: CONFIG.API_BASE_URL,
        environment: CONFIG.DEBUG.ENABLED ? 'development' : 'production'
    };
    
    console.log('ℹ️ Información de la aplicación:', info);
    
    if (uiManager) {
        uiManager.showInfo(`
            <strong>PetVenture v${info.version}</strong><br>
            ${info.description}<br>
            API: ${info.apiUrl}<br>
            Entorno: ${info.environment}
        `);
    }
}

// Función para mostrar atajos de teclado
function showKeyboardShortcuts() {
    const shortcuts = {
        'F1': 'Mostrar información de la aplicación',
        'F12': 'Abrir herramientas de desarrollador',
        'Ctrl+R': 'Recargar página',
        'Ctrl+Shift+R': 'Recargar página (sin caché)'
    };
    
    console.log('⌨️ Atajos de teclado:', shortcuts);
    
    if (uiManager) {
        let shortcutsHtml = '<strong>Atajos de teclado:</strong><br>';
        Object.entries(shortcuts).forEach(([key, description]) => {
            shortcutsHtml += `<kbd>${key}</kbd>: ${description}<br>`;
        });
        uiManager.showInfo(shortcutsHtml);
    }
}

// Configurar atajos de teclado
document.addEventListener('keydown', (event) => {
    if (CONFIG.DEBUG.ENABLED) {
        if (event.key === 'F1') {
            event.preventDefault();
            showAppInfo();
        }
    }
    
    if (event.key === 'F12') {
        // Permitir F12 para herramientas de desarrollador
        return;
    }
    
    if (event.ctrlKey && event.key === 'r') {
        console.log('🔄 Recargando página...');
    }
});

// Función para verificar la compatibilidad del navegador
function checkBrowserCompatibility() {
    const features = {
        localStorage: !!window.localStorage,
        fetch: !!window.fetch,
        promises: !!window.Promise,
        asyncAwait: (() => {
            try {
                new Function('async () => {}');
                return true;
            } catch {
                return false;
            }
        })(),
        flexbox: CSS.supports('display', 'flex'),
        grid: CSS.supports('display', 'grid'),
        customProperties: CSS.supports('--custom-property', 'value')
    };
    
    const unsupported = Object.entries(features).filter(([feature, supported]) => !supported);
    
    if (unsupported.length > 0) {
        console.warn('⚠️ Características no soportadas:', unsupported.map(([feature]) => feature));
        
        if (uiManager) {
            uiManager.showWarning(`
                Tu navegador no soporta algunas características modernas:<br>
                ${unsupported.map(([feature]) => `• ${feature}`).join('<br>')}<br>
                Es posible que algunas funciones no funcionen correctamente.
            `);
        }
    } else {
        console.log('✅ Navegador compatible');
    }
    
    return features;
}

// Verificar compatibilidad al cargar
checkBrowserCompatibility();

// Función para mostrar estadísticas de rendimiento
function showPerformanceStats() {
    if (!CONFIG.DEBUG.ENABLED) return;
    
    const stats = {
        loadTime: performance.timing.loadEventEnd - performance.timing.navigationStart,
        domReady: performance.timing.domContentLoadedEventEnd - performance.timing.navigationStart,
        memory: performance.memory ? {
            used: Math.round(performance.memory.usedJSHeapSize / 1024 / 1024),
            total: Math.round(performance.memory.totalJSHeapSize / 1024 / 1024),
            limit: Math.round(performance.memory.jsHeapSizeLimit / 1024 / 1024)
        } : null
    };
    
    console.log('📊 Estadísticas de rendimiento:', stats);
}

// Mostrar estadísticas después de que la página cargue completamente
window.addEventListener('load', () => {
    setTimeout(showPerformanceStats, 1000);
});

// Inicializar la aplicación
console.log('🎮 Inicializando PetVenture...');
initializePetVenture();

// Mensaje de bienvenida
console.log(`
🐾 PetVenture v1.0.0
🎮 ¡Bienvenido al mundo de las mascotas virtuales!
🌟 Creado con ❤️ para tu diversión
📧 Soporte: tu-email@ejemplo.com
🌐 Sitio web: https://petventure.com
`);

// Exportar para uso en otros módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initializePetVenture,
        checkAppStatus,
        getDebugInfo,
        clearGameData,
        showDebugInfo,
        showAppInfo,
        showKeyboardShortcuts,
        checkBrowserCompatibility,
        showPerformanceStats
    };
} 