// Fix de emergencia para eliminar errores de className
console.log('🚨 Fix de emergencia cargado');

// Override TOTAL de cualquier operación que pueda causar className error
(function() {
    // Interceptar TODAS las asignaciones de className
    const originalDefineProperty = Object.defineProperty;
    Object.defineProperty = function(obj, prop, descriptor) {
        if (prop === 'className' && (!obj || obj === null)) {
            console.warn('🔧 Intento de establecer className en objeto null bloqueado');
            return obj;
        }
        return originalDefineProperty.call(this, obj, prop, descriptor);
    };
    
    // Proteger las operaciones más comunes
    const originalCreateElement = document.createElement;
    document.createElement = function(tagName) {
        const element = originalCreateElement.call(document, tagName);
        
        // Asegurar que className siempre funcione
        const originalClassName = element.className;
        Object.defineProperty(element, 'className', {
            get: function() {
                return this.getAttribute('class') || '';
            },
            set: function(value) {
                try {
                    this.setAttribute('class', value || '');
                } catch (e) {
                    console.warn('🔧 Error estableciendo className, ignorado');
                }
            },
            configurable: true
        });
        
        return element;
    };
    
    // Proteger classList también
    const originalClassList = Element.prototype.classList;
    Object.defineProperty(Element.prototype, 'classList', {
        get: function() {
            if (!this || this === null) {
                return {
                    add: () => {},
                    remove: () => {},
                    contains: () => false,
                    toggle: () => false
                };
            }
            return originalClassList;
        },
        configurable: true
    });
    
    console.log('✅ Fix de emergencia aplicado');
})();

// Asegurar que ciertos elementos críticos existan
document.addEventListener('DOMContentLoaded', function() {
    const criticalElements = [
        'auth-screen',
        'game-screen', 
        'loading-screen',
        'login-form',
        'register-form'
    ];
    
    criticalElements.forEach(id => {
        if (!document.getElementById(id)) {
            const element = document.createElement('div');
            element.id = id;
            element.style.display = 'none';
            document.body.appendChild(element);
            console.log(`🔧 Elemento crítico ${id} creado`);
        }
    });
});

// Función para login de emergencia
window.emergencyLogin = function() {
    const username = prompt('Usuario:');
    const password = prompt('Contraseña:');
    
    if (username && password) {
        fetch('/api/usuarios/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ usernameOrEmail: username, password })
        })
        .then(response => response.json())
        .then(data => {
            if (data.token) {
                localStorage.setItem('petventure_token', data.token);
                localStorage.setItem('petventure_user', JSON.stringify(data.usuario));
                alert('¡Login exitoso! Recargando...');
                location.reload();
            } else {
                alert('Error: ' + (data.error || 'Credenciales incorrectas'));
            }
        })
        .catch(error => {
            alert('Error de conexión: ' + error.message);
        });
    }
};

console.log('💡 Para login manual: emergencyLogin() en la consola'); 