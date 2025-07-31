// Sistema de Autenticación para PetVenture
class AuthManager {
    constructor() {
        this.token = localStorage.getItem(CONFIG.STORAGE.KEYS.TOKEN);
        this.user = JSON.parse(localStorage.getItem(CONFIG.STORAGE.KEYS.USER) || 'null');
        this.isAuthenticated = !!this.token;
        
        ConfigUtils.log('info', 'AuthManager inicializado', {
            isAuthenticated: this.isAuthenticated,
            hasUser: !!this.user
        });
    }
    
    // Validar elementos DOM
    validateElement(id) {
        const element = document.getElementById(id);
        if (!element) {
            ConfigUtils.log('warn', `Elemento ${id} no encontrado`);
            return null;
        }
        return element;
    }
    
    // Iniciar sesión
    async login(usernameOrEmail, password) {
        try {
            // Validación en frontend
            if (!usernameOrEmail || !usernameOrEmail.trim()) {
                throw new Error('Por favor ingresa tu usuario o email');
            }
            
            if (!password || !password.trim()) {
                throw new Error('Por favor ingresa tu contraseña');
            }
            
            if (password.length < 6) {
                throw new Error('La contraseña debe tener al menos 6 caracteres');
            }
            
            ConfigUtils.log('info', 'Iniciando sesión', { usernameOrEmail });
            
            const response = await fetch(ConfigUtils.getApiUrl(CONFIG.ENDPOINTS.LOGIN), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    usernameOrEmail: usernameOrEmail.trim(),
                    password: password
                })
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || data.mensaje || 'Error al iniciar sesión');
            }
            
            // Validar respuesta del servidor
            if (!data.token || !data.usuario) {
                throw new Error('Respuesta del servidor inválida');
            }
            
            // Guardar datos de autenticación
            this.token = data.token;
            this.user = data.usuario;
            this.isAuthenticated = true;
            
            localStorage.setItem(CONFIG.STORAGE.KEYS.TOKEN, data.token);
            localStorage.setItem(CONFIG.STORAGE.KEYS.USER, JSON.stringify(data.usuario));
            
            ConfigUtils.log('info', 'Sesión iniciada exitosamente', { 
                userId: data.usuario._id,
                username: data.usuario.username 
            });
            
            return {
                success: true,
                message: data.mensaje || '¡Bienvenido de vuelta!',
                user: data.usuario,
                token: data.token
            };
            
        } catch (error) {
            ConfigUtils.log('error', 'Error en login', error);
            // Limpiar datos en caso de error
            this.logout();
            throw error;
        }
    }
    
    // Registrar usuario
    async register(userData) {
        try {
            // Validación robusta en frontend
            if (!userData.nombre || !userData.nombre.trim()) {
                throw new Error('El nombre completo es requerido');
            }
            
            if (!userData.username || !userData.username.trim()) {
                throw new Error('El nombre de usuario es requerido');
            }
            
            if (userData.username.length < 3) {
                throw new Error('El nombre de usuario debe tener al menos 3 caracteres');
            }
            
            if (!userData.email || !userData.email.trim()) {
                throw new Error('El email es requerido');
            }
            
            // Validar formato de email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(userData.email)) {
                throw new Error('Por favor ingresa un email válido');
            }
            
            if (!userData.password || !userData.password.trim()) {
                throw new Error('La contraseña es requerida');
            }
            
            if (userData.password.length < 6) {
                throw new Error('La contraseña debe tener al menos 6 caracteres');
            }
            
            ConfigUtils.log('info', 'Registrando usuario', { 
                username: userData.username,
                email: userData.email 
            });
            
            const response = await fetch(ConfigUtils.getApiUrl(CONFIG.ENDPOINTS.REGISTER), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    nombre: userData.nombre.trim(),
                    username: userData.username.trim(),
                    email: userData.email.trim(),
                    password: userData.password
                })
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || data.mensaje || 'Error al registrar usuario');
            }
            
            ConfigUtils.log('info', 'Usuario registrado exitosamente', { 
                userId: data.usuario._id,
                username: data.usuario.username 
            });
            
            return {
                success: true,
                message: data.mensaje || '¡Registro exitoso! Ahora puedes iniciar sesión.',
                user: data.usuario,
                mascotaAsignada: data.mascotaAsignada || null
            };
            
        } catch (error) {
            ConfigUtils.log('error', 'Error en registro', error);
            throw error;
        }
    }
    
    // Registrar usuario adicional (sin cerrar sesión actual)
    async registerAdditionalUser(userData) {
        try {
            // Usar la misma lógica de registro pero sin afectar la sesión actual
            const result = await this.register(userData);
            
            // Agregar información adicional para indicar que es un registro adicional
            result.isAdditionalRegistration = true;
            result.message = '¡Cuenta adicional registrada exitosamente! Puedes iniciar sesión con esta cuenta en cualquier momento.';
            
            return result;
            
        } catch (error) {
            ConfigUtils.log('error', 'Error en registro adicional', error);
            throw error;
        }
    }
    
    // Cerrar sesión
    logout() {
        ConfigUtils.log('info', 'Cerrando sesión');
        
        this.token = null;
        this.user = null;
        this.isAuthenticated = false;
        
        localStorage.removeItem(CONFIG.STORAGE.KEYS.TOKEN);
        localStorage.removeItem(CONFIG.STORAGE.KEYS.USER);
        
        return {
            success: true,
            message: 'Sesión cerrada exitosamente'
        };
    }
    
    // Obtener perfil del usuario
    async getProfile() {
        try {
            if (!this.isAuthenticated) {
                throw new Error('No autenticado');
            }
            
            const response = await fetch(ConfigUtils.getApiUrl(CONFIG.ENDPOINTS.PROFILE), {
                headers: {
                    'Authorization': `Bearer ${this.token}`
                }
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || 'Error al obtener perfil');
            }
            
            // Actualizar datos del usuario
            this.user = data.usuario;
            localStorage.setItem(CONFIG.STORAGE.KEYS.USER, JSON.stringify(this.user));
            
            return data.usuario;
            
        } catch (error) {
            ConfigUtils.log('error', 'Error al obtener perfil', error);
            throw error;
        }
    }
    
    // Verificar si el token es válido
    async validateToken() {
        try {
            if (!this.token) {
                return false;
            }
            
            const response = await fetch(ConfigUtils.getApiUrl(CONFIG.ENDPOINTS.PROFILE), {
                headers: {
                    'Authorization': `Bearer ${this.token}`
                }
            });
            
            if (response.ok) {
                const data = await response.json();
                this.user = data.usuario;
                localStorage.setItem(CONFIG.STORAGE.KEYS.USER, JSON.stringify(this.user));
                return true;
            } else {
                // Token inválido, limpiar datos
                this.logout();
                return false;
            }
            
        } catch (error) {
            ConfigUtils.log('error', 'Error al validar token', error);
            this.logout();
            return false;
        }
    }
    
    // Obtener headers de autorización
    getAuthHeaders() {
        if (!this.isAuthenticated) {
            return {};
        }
        
        return {
            'Authorization': `Bearer ${this.token}`,
            'Content-Type': 'application/json'
        };
    }
    
    // Obtener usuario actual
    getCurrentUser() {
        return this.user;
    }
    
    // Verificar si está autenticado
    isLoggedIn() {
        return this.isAuthenticated;
    }
    
    // Obtener token
    getToken() {
        return this.token;
    }
}

// Instancia global del AuthManager
const authManager = new AuthManager();

// Utilidades de autenticación
const AuthUtils = {
    // Validar formulario de login
    validateLoginForm: (usernameOrEmail, password) => {
        const errors = [];
        
        if (!usernameOrEmail || usernameOrEmail.trim() === '') {
            errors.push('El usuario o email es requerido');
        }
        
        if (!password || password.trim() === '') {
            errors.push('La contraseña es requerida');
        }
        
        if (password && password.length < 6) {
            errors.push('La contraseña debe tener al menos 6 caracteres');
        }
        
        return {
            isValid: errors.length === 0,
            errors
        };
    },
    
    // Validar formulario de registro
    validateRegisterForm: (userData) => {
        const errors = [];
        
        if (!userData.username || userData.username.trim() === '') {
            errors.push('El nombre de usuario es requerido');
        } else if (userData.username.length < 3) {
            errors.push('El nombre de usuario debe tener al menos 3 caracteres');
        }
        
        if (!userData.email || userData.email.trim() === '') {
            errors.push('El email es requerido');
        } else if (!isValidEmail(userData.email)) {
            errors.push('El email no es válido');
        }
        
        if (!userData.name || userData.name.trim() === '') {
            errors.push('El nombre completo es requerido');
        }
        
        if (!userData.password || userData.password.trim() === '') {
            errors.push('La contraseña es requerida');
        } else if (userData.password.length < 6) {
            errors.push('La contraseña debe tener al menos 6 caracteres');
        }
        
        return {
            isValid: errors.length === 0,
            errors
        };
    },
    
    // Validar email
    isValidEmail: (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    },
    
    // Formatear errores de validación
    formatValidationErrors: (errors) => {
        return errors.join('\n');
    }
};

// Función auxiliar para validar email
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Exportar para uso en otros módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { AuthManager, AuthUtils, authManager };
} 