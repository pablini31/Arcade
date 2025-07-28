// Debug temporal para el registro - PetVenture
console.log('🔧 Script de debug del registro cargado');

// Agregar debug al formulario de registro
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        const registerForm = document.getElementById('register-form');
        if (registerForm) {
            console.log('📝 Formulario de registro encontrado');
            
            // Interceptar el envío del formulario para debug
            registerForm.addEventListener('submit', function(e) {
                console.log('🚀 Intento de registro detectado');
                
                // Verificar todos los campos
                const campos = {
                    name: document.getElementById('register-name'),
                    username: document.getElementById('register-username'),
                    email: document.getElementById('register-email'),
                    password: document.getElementById('register-password'),
                    confirmPassword: document.getElementById('register-confirm-password')
                };
                
                console.log('🔍 Estado de los campos:');
                Object.keys(campos).forEach(key => {
                    const campo = campos[key];
                    if (campo) {
                        console.log(`✅ ${key}: "${campo.value}" (length: ${campo.value.length})`);
                    } else {
                        console.log(`❌ ${key}: NO ENCONTRADO`);
                    }
                });
                
                // Verificar si hay campos vacíos
                const camposVacios = Object.keys(campos).filter(key => {
                    const campo = campos[key];
                    return campo && (!campo.value || campo.value.trim() === '');
                });
                
                if (camposVacios.length > 0) {
                    console.warn('⚠️ Campos vacíos detectados:', camposVacios);
                } else {
                    console.log('✅ Todos los campos tienen valores');
                }
                
                // No prevenir el envío, solo debuggear
            });
            
            // También debug en tiempo real cuando se escriba en los campos
            ['register-name', 'register-username', 'register-email', 'register-password', 'register-confirm-password'].forEach(id => {
                const campo = document.getElementById(id);
                if (campo) {
                    campo.addEventListener('input', function() {
                        console.log(`📝 ${id}: "${this.value}"`);
                    });
                }
            });
            
        } else {
            console.warn('❌ Formulario de registro NO encontrado');
        }
    }, 1000);
});

// Función para mostrar estado actual
window.debugRegistro = function() {
    console.log('🔍 ESTADO ACTUAL DEL REGISTRO:');
    
    const form = document.getElementById('register-form');
    console.log('Formulario:', form);
    
    const campos = ['register-name', 'register-username', 'register-email', 'register-password', 'register-confirm-password'];
    campos.forEach(id => {
        const campo = document.getElementById(id);
        if (campo) {
            console.log(`${id}: "${campo.value}" (existe: SÍ)`);
        } else {
            console.log(`${id}: NO EXISTE`);
        }
    });
};

console.log('💡 Para debug manual, escribe: debugRegistro() en la consola'); 