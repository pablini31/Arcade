// Sistema Principal del Juego PetVenture
class GameManager {
    constructor() {
        this.isInitialized = false;
        this.gameState = 'loading';
        this.gameLoop = null;
        
        ConfigUtils.log('info', 'GameManager inicializado');
    }
    
    // Inicializar el juego
    async initialize() {
        try {
            ConfigUtils.log('info', 'Inicializando PetVenture...');
            
            // Validar configuración
            if (!ConfigUtils.validate()) {
                throw new Error('Configuración inválida');
            }
            
            // Mostrar pantalla de carga
            uiManager.showLoadingScreen();
            
            // Verificar autenticación
            const isAuthenticated = await this.checkAuthentication();
            
            if (isAuthenticated) {
                // Usuario autenticado, cargar juego
                await this.loadGame();
            } else {
                // Usuario no autenticado, mostrar pantalla de login
                uiManager.showAuthScreen();
                this.setupAuthHandlers();
            }
            
            this.isInitialized = true;
            ConfigUtils.log('info', 'PetVenture inicializado correctamente');
            
        } catch (error) {
            ConfigUtils.log('error', 'Error al inicializar el juego', error);
            uiManager.showError('Error al inicializar el juego: ' + error.message);
        }
    }
    
    // Verificar autenticación
    async checkAuthentication() {
        try {
            if (!authManager.isLoggedIn()) {
                return false;
            }
            
            // Validar token
            const isValid = await authManager.validateToken();
            return isValid;
            
        } catch (error) {
            ConfigUtils.log('error', 'Error al verificar autenticación', error);
            return false;
        }
    }
    
    // Cargar el juego
    async loadGame() {
        try {
            ConfigUtils.log('info', 'Cargando juego...');
            
            // Cargar mascotas del usuario
            await petManager.loadPets();
            
            // Mostrar pantalla del juego
            uiManager.showGameScreen();
            
            // Inicializar sistema de efectos visuales
            if (typeof effectsManager !== 'undefined') {
                effectsManager.init();
            }
            
            // Iniciar bucle del juego
            this.startGameLoop();
            
            // Mostrar mensaje de bienvenida
            const user = authManager.getCurrentUser();
            uiManager.showSuccess(`¡Bienvenido de vuelta, ${user.name}!`);
            
            this.gameState = 'playing';
            
        } catch (error) {
            ConfigUtils.log('error', 'Error al cargar el juego', error);
            uiManager.showError('Error al cargar el juego: ' + error.message);
            
            // Si hay error, mostrar pantalla de autenticación
            uiManager.showAuthScreen();
            this.setupAuthHandlers();
        }
    }
    
    // Configurar manejadores de autenticación
    setupAuthHandlers() {
        // Validar que los elementos existan antes de agregar listeners
        const loginForm = document.getElementById('login-form');
        const registerForm = document.getElementById('register-form');
        
        if (!loginForm || !registerForm) {
            ConfigUtils.log('warn', 'Elementos de autenticación no encontrados, reintentando...');
            // Reintentar después de un breve delay
            setTimeout(() => this.setupAuthHandlers(), 100);
            return;
        }
        
        // Login form
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Prevenir doble envío
            const submitBtn = e.target.querySelector('button[type="submit"]');
            if (!submitBtn || submitBtn.disabled) return;
            
            const originalHTML = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Iniciando...';
            
            try {
                const usernameInput = document.getElementById('login-username');
                const passwordInput = document.getElementById('login-password');
                
                if (!usernameInput || !passwordInput) {
                    throw new Error('Elementos de formulario no encontrados');
                }
                
                const username = usernameInput.value.trim();
                const password = passwordInput.value;
                
                if (!username || !password) {
                    throw new Error('Por favor completa todos los campos');
                }
                
                const result = await authManager.login(username, password);
                uiManager.showSuccess(result.message);
                
                // Cargar juego después del login
                await this.loadGame();
                
            } catch (error) {
                ConfigUtils.log('error', 'Error en login', error);
                uiManager.showError(error.message);
            } finally {
                // Restaurar botón
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalHTML;
                }
            }
        });
        
        // Register form
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Prevenir doble envío
            const submitBtn = e.target.querySelector('button[type="submit"]');
            if (!submitBtn || submitBtn.disabled) return;
            
            const originalHTML = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Registrando...';
            
            try {
                // Validar elementos del formulario
                const nameInput = document.getElementById('register-name');
                const usernameInput = document.getElementById('register-username');
                const emailInput = document.getElementById('register-email');
                const passwordInput = document.getElementById('register-password');
                const confirmPasswordInput = document.getElementById('register-confirm-password');
                
                // Verificar que los elementos básicos existan
                if (!nameInput || !usernameInput || !emailInput || !passwordInput) {
                    throw new Error('Elementos de formulario no encontrados');
                }
                
                const name = nameInput.value.trim();
                const username = usernameInput.value.trim();
                const email = emailInput.value.trim();
                const password = passwordInput.value;
                
                // Validar campos básicos
                if (!name || !username || !email || !password) {
                    throw new Error('Por favor completa todos los campos obligatorios');
                }
                
                // Solo validar confirmación si el campo existe
                let confirmPassword = password; // Por defecto, asumir que coincide
                if (confirmPasswordInput && confirmPasswordInput.value) {
                    confirmPassword = confirmPasswordInput.value;
                    if (password !== confirmPassword) {
                        throw new Error('Las contraseñas no coinciden');
                    }
                }
                
                if (password.length < 6) {
                    throw new Error('La contraseña debe tener al menos 6 caracteres');
                }
                
                const userData = { name, username, email, password };
                const result = await authManager.register(userData);
                uiManager.showSuccess(result.message);
                
                // Cargar juego después del registro
                await this.loadGame();
                
            } catch (error) {
                ConfigUtils.log('error', 'Error en registro', error);
                uiManager.showError(error.message);
            } finally {
                // Restaurar botón
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalHTML;
                }
            }
        });
        
        // Configurar botones de cambio de vista
        this.setupAuthViewToggle();
    }
    
    // Configurar cambio entre login y registro
    setupAuthViewToggle() {
        const tabs = document.querySelectorAll('.tab-btn');
        const loginForm = document.getElementById('login-form');
        const registerForm = document.getElementById('register-form');
        
        if (!tabs.length || !loginForm || !registerForm) {
            console.warn('Elementos de tabs no encontrados');
            return;
        }
        
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const targetTab = tab.dataset.tab;
                
                // Remover clase active de todos los tabs
                tabs.forEach(t => t.classList.remove('active'));
                // Agregar clase active al tab clickeado
                tab.classList.add('active');
                
                // Mostrar/ocultar formularios
                if (targetTab === 'login') {
                    loginForm.classList.remove('hidden');
                    registerForm.classList.add('hidden');
                } else if (targetTab === 'register') {
                    loginForm.classList.add('hidden');
                    registerForm.classList.remove('hidden');
                }
            });
        });
    }
    
    // Iniciar bucle del juego
    startGameLoop() {
        if (this.gameLoop) {
            clearInterval(this.gameLoop);
        }
        
        this.gameLoop = setInterval(() => {
            this.updateGame();
        }, 30000); // Actualizar cada 30 segundos (como Pou)
        
        ConfigUtils.log('info', 'Bucle del juego iniciado');
    }
    
    // Detener bucle del juego
    stopGameLoop() {
        if (this.gameLoop) {
            clearInterval(this.gameLoop);
            this.gameLoop = null;
            ConfigUtils.log('info', 'Bucle del juego detenido');
        }
    }
    
    // Actualizar el juego
    updateGame() {
        try {
            const currentPet = petManager.getCurrentPet();
            if (!currentPet) return;
            
            // Verificar si la mascota necesita atención
            if (petManager.needsAttention(currentPet)) {
                this.handlePetNeedsAttention(currentPet);
            }
            
            // Actualizar estadísticas automáticamente
            this.updatePetStats(currentPet);
            
        } catch (error) {
            ConfigUtils.log('error', 'Error en bucle del juego', error);
        }
    }
    
    // Manejar cuando la mascota necesita atención
    handlePetNeedsAttention(pet) {
        // NO mostrar alertas molestas - solo cambiar visualmente la mascota
        // Las alertas constantes son muy molestas, mejor usar indicadores visuales
        const currentTime = Date.now();
        const lastAlert = this.lastAttentionAlert || 0;
        
        // Solo mostrar una alerta cada 10 minutos máximo
        if (currentTime - lastAlert > 600000) { // 10 minutos
            const recommendations = petManager.getPetRecommendations(pet);
            if (recommendations.length > 0 && pet.salud < 15) { // Solo si está muy crítico
                const message = recommendations[0];
                uiManager.showWarning(message);
                this.lastAttentionAlert = currentTime;
            }
        }
    }
    
    // Actualizar estadísticas de la mascota
    updatePetStats(pet) {
        // Simular decay natural de estadísticas
        const now = new Date();
        const lastUpdate = new Date(pet.updatedAt || pet.createdAt);
        const minutesSinceUpdate = (now - lastUpdate) / (1000 * 60);
        
        if (minutesSinceUpdate >= 1) {
            // Actualizar estadísticas cada minuto
            this.applyNaturalDecay(pet);
        }
    }
    
    // Aplicar decay natural a las estadísticas (como Pou - MUY lento)
    applyNaturalDecay(pet) {
        // Solo aplicar decay si la mascota no está siendo cuidada activamente
        const timeSinceLastAction = this.getTimeSinceLastAction(pet);
        
        if (timeSinceLastAction > 30) { // 30 minutos sin acción (mucho más tiempo)
            // Decay MUCHO más lento - como Pou
            const decayRate = 0.01; // Solo 0.01 puntos cada 30 segundos
            
            pet.salud = Math.max(0, pet.salud - decayRate * 0.5); // Salud baja muy lento
            pet.energia = Math.max(0, pet.energia - decayRate * 1.2); // Energía un poco más rápido
            pet.felicidad = Math.max(0, pet.felicidad - decayRate * 0.8); // Felicidad intermedio
            
            // Actualizar display solo si hay cambios significativos
            if (Math.random() < 0.1) { // Solo 10% de las veces para evitar updates constantes
                uiManager.updatePetDisplay(pet);
            }
        }
    }
    
    // Obtener tiempo desde la última acción
    getTimeSinceLastAction(pet) {
        const now = new Date();
        const lastFeeding = new Date(pet.ultimaAlimentacion);
        const lastWalk = new Date(pet.ultimoPaseo);
        
        const timeSinceFeeding = (now - lastFeeding) / (1000 * 60);
        const timeSinceWalk = (now - lastWalk) / (1000 * 60);
        
        return Math.min(timeSinceFeeding, timeSinceWalk);
    }
    
    // Pausar el juego
    pauseGame() {
        this.stopGameLoop();
        petManager.stopAutoUpdate();
        this.gameState = 'paused';
        
        ConfigUtils.log('info', 'Juego pausado');
    }
    
    // Reanudar el juego
    resumeGame() {
        this.startGameLoop();
        petManager.startAutoUpdate();
        this.gameState = 'playing';
        
        ConfigUtils.log('info', 'Juego reanudado');
    }
    
    // Guardar estado del juego
    saveGameState() {
        try {
            const gameState = {
                currentPet: petManager.getCurrentPet(),
                pets: petManager.getAllPets(),
                user: authManager.getCurrentUser(),
                timestamp: new Date().toISOString()
            };
            
            localStorage.setItem(CONFIG.STORAGE.KEYS.GAME_STATE, JSON.stringify(gameState));
            
            ConfigUtils.log('info', 'Estado del juego guardado');
            
        } catch (error) {
            ConfigUtils.log('error', 'Error al guardar estado del juego', error);
        }
    }
    
    // Cargar estado del juego
    loadGameState() {
        try {
            const savedState = localStorage.getItem(CONFIG.STORAGE.KEYS.GAME_STATE);
            if (!savedState) return null;
            
            const gameState = JSON.parse(savedState);
            
            // Verificar si el estado no es muy antiguo (máximo 1 día)
            const savedTime = new Date(gameState.timestamp);
            const now = new Date();
            const hoursDiff = (now - savedTime) / (1000 * 60 * 60);
            
            if (hoursDiff > 24) {
                ConfigUtils.log('info', 'Estado del juego muy antiguo, descartando');
                return null;
            }
            
            ConfigUtils.log('info', 'Estado del juego cargado');
            return gameState;
            
        } catch (error) {
            ConfigUtils.log('error', 'Error al cargar estado del juego', error);
            return null;
        }
    }
    
    // Obtener estadísticas del juego
    getGameStats() {
        const pets = petManager.getAllPets();
        const currentPet = petManager.getCurrentPet();
        
        return {
            totalPets: pets.length,
            currentPet: currentPet ? {
                id: currentPet.id,
                name: currentPet.nombre,
                type: currentPet.tipo,
                status: petManager.calculatePetStatus(currentPet)
            } : null,
            averageHealth: pets.length > 0 ? 
                pets.reduce((sum, pet) => sum + (pet.salud || 0), 0) / pets.length : 0,
            averageEnergy: pets.length > 0 ? 
                pets.reduce((sum, pet) => sum + (pet.energia || 0), 0) / pets.length : 0,
            averageHappiness: pets.length > 0 ? 
                pets.reduce((sum, pet) => sum + (pet.felicidad || 0), 0) / pets.length : 0,
            sickPets: pets.filter(pet => petManager.isPetSick(pet)).length,
            needsAttention: pets.filter(pet => petManager.needsAttention(pet)).length
        };
    }
    
    // Limpiar datos del juego
    cleanup() {
        this.stopGameLoop();
        petManager.stopAutoUpdate();
        uiManager.clearNotifications();
        uiManager.closeAllModals();
        
        ConfigUtils.log('info', 'Limpieza del juego completada');
    }
    
    // Manejar eventos de visibilidad de la página
    handleVisibilityChange() {
        if (document.hidden) {
            // Página oculta, pausar actualizaciones automáticas
            this.pauseGame();
        } else {
            // Página visible, reanudar
            this.resumeGame();
        }
    }
    
    // Configurar eventos del navegador
    setupBrowserEvents() {
        // Evento de visibilidad
        document.addEventListener('visibilitychange', () => {
            this.handleVisibilityChange();
        });
        
        // Evento antes de cerrar la página
        window.addEventListener('beforeunload', () => {
            this.saveGameState();
            this.cleanup();
        });
        
        // Evento de error
        window.addEventListener('error', (event) => {
            ConfigUtils.log('error', 'Error del navegador', event.error);
        });
        
        // Evento de rechazo de promesa
        window.addEventListener('unhandledrejection', (event) => {
            ConfigUtils.log('error', 'Promesa rechazada', event.reason);
        });
    }
}

// Instancia global del GameManager
const gameManager = new GameManager();

// Utilidades del juego
const GameUtils = {
    // Generar ID único
    generateId: () => {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    },
    
    // Formatear tiempo
    formatTime: (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    },
    
    // Calcular diferencia de tiempo
    timeDiff: (date1, date2) => {
        return Math.abs(new Date(date1) - new Date(date2));
    },
    
    // Verificar si es móvil
    isMobile: () => {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    },
    
    // Verificar conexión a internet
    isOnline: () => {
        return navigator.onLine;
    },
    
    // Debounce function
    debounce: (func, wait) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },
    
    // Throttle function
    throttle: (func, limit) => {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
};

// Inicializar el juego cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    ConfigUtils.log('info', 'DOM cargado, inicializando PetVenture...');
    
    // Configurar eventos del navegador
    gameManager.setupBrowserEvents();
    
    // Inicializar el juego
    gameManager.initialize();
});

// Exportar para uso en otros módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { GameManager, GameUtils, gameManager };
} 