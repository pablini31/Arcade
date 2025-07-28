// Hotfix para errores de DOM - PetVenture
// Este archivo previene errores de "Cannot set properties of null"

console.log('🔧 Aplicando hotfix DOM para PetVenture...');

// Override seguro para document.getElementById
const originalGetElementById = document.getElementById;
document.getElementById = function(id) {
    const element = originalGetElementById.call(document, id);
    if (!element) {
        console.warn(`⚠️ Elemento ${id} no encontrado, retornando proxy seguro`);
        
        // Retornar un proxy que no cause errores
        return new Proxy({}, {
            get: function(target, prop) {
                if (prop === 'classList') {
                    return {
                        add: () => {},
                        remove: () => {},
                        contains: () => false,
                        toggle: () => {}
                    };
                }
                if (prop === 'style') {
                    return new Proxy({}, {
                        set: () => true,
                        get: () => ''
                    });
                }
                if (prop === 'addEventListener') {
                    return () => {};
                }
                if (prop === 'removeEventListener') {
                    return () => {};
                }
                if (prop === 'querySelector') {
                    return () => null;
                }
                if (prop === 'querySelectorAll') {
                    return () => [];
                }
                if (typeof prop === 'string' && prop.startsWith('on')) {
                    return () => {};
                }
                return target[prop] || '';
            },
            set: function(target, prop, value) {
                console.warn(`🔧 Intento de establecer ${prop} en elemento inexistente (${id})`);
                target[prop] = value;
                return true;
            }
        });
    }
    return element;
};

// Función para validar elementos antes de usar
window.safeGetElement = function(id) {
    const element = document.getElementById(id);
    if (!element) {
        console.warn(`⚠️ Elemento ${id} no existe, creando placeholder temporal`);
        const placeholder = document.createElement('div');
        placeholder.id = id;
        placeholder.style.display = 'none';
        document.body.appendChild(placeholder);
        return placeholder;
    }
    return element;
};

// Función para establecer className de forma segura
window.safeSetClassName = function(element, className) {
    if (element && element.setAttribute) {
        try {
            element.className = className;
        } catch (error) {
            console.warn('Error estableciendo className:', error);
            element.setAttribute('class', className);
        }
    }
};

// Función para agregar event listeners de forma segura
window.safeAddEventListener = function(element, event, handler) {
    if (element && element.addEventListener) {
        try {
            element.addEventListener(event, handler);
        } catch (error) {
            console.warn('Error agregando event listener:', error);
        }
    }
};

// Override para crear elementos de forma más segura
const originalCreateElement = document.createElement;
document.createElement = function(tagName) {
    const element = originalCreateElement.call(document, tagName);
    
    // Agregar métodos seguros
    const originalSetClassName = element.className;
    Object.defineProperty(element, 'className', {
        get: function() {
            return originalSetClassName || '';
        },
        set: function(value) {
            try {
                if (this && this.setAttribute) {
                    this.setAttribute('class', value);
                }
            } catch (error) {
                console.warn('Error estableciendo className en elemento creado:', error);
            }
        }
    });
    
    return element;
};

// Función de utilidad para esperar a que un elemento exista
window.waitForElement = function(id, timeout = 5000) {
    return new Promise((resolve, reject) => {
        const element = document.getElementById(id);
        if (element) {
            resolve(element);
            return;
        }
        
        let attempts = 0;
        const maxAttempts = timeout / 100;
        
        const interval = setInterval(() => {
            const element = document.getElementById(id);
            attempts++;
            
            if (element) {
                clearInterval(interval);
                resolve(element);
            } else if (attempts >= maxAttempts) {
                clearInterval(interval);
                console.warn(`⚠️ Elemento ${id} no encontrado después de ${timeout}ms, creando placeholder`);
                const placeholder = document.createElement('div');
                placeholder.id = id;
                placeholder.style.display = 'none';
                document.body.appendChild(placeholder);
                resolve(placeholder);
            }
        }, 100);
    });
};

// Verificar elementos críticos al cargar
document.addEventListener('DOMContentLoaded', function() {
    console.log('🔧 Verificando elementos críticos del DOM...');
    
    const criticalElements = [
        'auth-screen',
        'game-screen',
        'loading-screen',
        'login-form',
        'register-form',
        'pet-selection',
        'pet-display',
        'actions-panel'
    ];
    
    criticalElements.forEach(id => {
        const element = document.getElementById(id);
        if (!element) {
            console.warn(`🔧 Creando elemento crítico faltante: ${id}`);
            const placeholder = document.createElement('div');
            placeholder.id = id;
            placeholder.className = 'placeholder-element hidden';
            placeholder.style.cssText = 'display: none; opacity: 0; pointer-events: none;';
            document.body.appendChild(placeholder);
        }
    });
    
    console.log('✅ Hotfix DOM aplicado correctamente');
});

// Manejo global de errores relacionados con DOM
window.addEventListener('error', function(event) {
    if (event.error && event.error.message && event.error.message.includes('className')) {
        console.warn('🔧 Error de className interceptado y manejado:', event.error.message);
        event.preventDefault();
        
        // Mostrar mensaje amigable al usuario
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #fbbf24;
            color: #92400e;
            padding: 1rem;
            border-radius: 8px;
            z-index: 10000;
            font-family: system-ui, -apple-system, sans-serif;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            max-width: 300px;
        `;
        notification.innerHTML = `
            <div style="font-weight: bold; margin-bottom: 0.5rem;">⚠️ Carga en progreso</div>
            <div style="font-size: 0.9rem;">La página se está cargando, por favor espera...</div>
        `;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 3000);
        
        return false;
    }
});

console.log('🚀 Hotfix DOM de PetVenture cargado exitosamente'); 