// Sistema de Interfaz de Usuario para PetVenture
class UIManager {
    constructor() {
        this.notifications = [];
        this.activeModals = [];
        this.currentScreen = 'loading';
        
        ConfigUtils.log('info', 'UIManager inicializado');
    }
    
    // Mostrar pantalla de carga
    showLoadingScreen() {
        this.hideAllScreens();
        document.getElementById('loading-screen').classList.remove('hidden');
        this.currentScreen = 'loading';
        
        // Simular progreso de carga
        this.simulateLoading();
    }
    
    // Simular progreso de carga
    simulateLoading() {
        const progressBar = document.querySelector('.loading-progress');
        let progress = 0;
        
        const interval = setInterval(() => {
            progress += Math.random() * 15;
            if (progress >= 100) {
                progress = 100;
                clearInterval(interval);
                
                // Ocultar pantalla de carga después de completar
                setTimeout(() => {
                    this.hideLoadingScreen();
                }, 500);
            }
            
            progressBar.style.width = `${progress}%`;
        }, 200);
    }
    
    // Ocultar pantalla de carga
    hideLoadingScreen() {
        document.getElementById('loading-screen').classList.add('hidden');
    }
    
    // Mostrar pantalla de autenticación
    showAuthScreen() {
        this.hideAllScreens();
        document.getElementById('auth-screen').classList.remove('hidden');
        this.currentScreen = 'auth';
        
        // Configurar tabs
        this.setupAuthTabs();
    }
    
    // Mostrar pantalla del juego
    showGameScreen() {
        this.hideAllScreens();
        document.getElementById('game-screen').classList.remove('hidden');
        this.currentScreen = 'game';
        
        // Inicializar componentes del juego
        this.initializeGameComponents();
    }
    
    // Ocultar todas las pantallas
    hideAllScreens() {
        document.getElementById('loading-screen').classList.add('hidden');
        document.getElementById('auth-screen').classList.add('hidden');
        document.getElementById('game-screen').classList.add('hidden');
    }
    
    // Configurar tabs de autenticación
    setupAuthTabs() {
        const tabBtns = document.querySelectorAll('.tab-btn');
        const loginForm = document.getElementById('login-form');
        const registerForm = document.getElementById('register-form');
        
        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Remover clase active de todos los tabs
                tabBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                // Mostrar formulario correspondiente
                const tab = btn.dataset.tab;
                if (tab === 'login') {
                    loginForm.classList.remove('hidden');
                    registerForm.classList.add('hidden');
                } else {
                    registerForm.classList.remove('hidden');
                    loginForm.classList.add('hidden');
                }
            });
        });
    }
    
    // Inicializar componentes del juego
    initializeGameComponents() {
        this.setupGameHeader();
        this.setupPetList();
        this.setupActionButtons();
        this.setupCreatePetModal();
        this.setupInventory();
    }
    
    // Configurar header del juego
    setupGameHeader() {
        const userInfo = authManager.getCurrentUser();
        const userNameElement = document.getElementById('user-name');
        const userAvatarElement = document.getElementById('user-avatar');
        const logoutBtn = document.getElementById('logout-btn');
        
        if (userInfo) {
            userNameElement.textContent = userInfo.nombre || userInfo.username;
            // userAvatarElement.src = userInfo.avatar || 'assets/default-avatar.png';
        }
        
        // Configurar botón de logout
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                this.showConfirmDialog('¿Estás seguro de que quieres cerrar sesión?', () => {
                    authManager.logout();
                    this.showAuthScreen();
                    this.showNotification('Sesión cerrada exitosamente', 'info');
                });
            });
        } else {
            console.error('Botón de logout no encontrado');
        }
    }
    
    // Configurar lista de mascotas
    setupPetList() {
        this.updatePetList();
    }
    
    // Actualizar lista de mascotas
    updatePetList() {
        const petsList = document.getElementById('pets-list');
        const pets = petManager.getAllPets();
        
        petsList.innerHTML = '';
        
        if (pets.length === 0) {
            petsList.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-paw"></i>
                    <p>No tienes mascotas aún</p>
                    <button class="create-pet-btn" onclick="uiManager.showCreatePetModal()">
                        <i class="fas fa-plus"></i>
                        Crear tu primera mascota
                    </button>
                </div>
            `;
            return;
        }
        
        pets.forEach(pet => {
            const petCard = this.createPetCard(pet);
            petsList.appendChild(petCard);
        });
    }
    
    // Crear tarjeta de mascota
    createPetCard(pet) {
        const card = document.createElement('div');
        if (card) {
            card.className = 'pet-card';
        }
        card.dataset.petId = pet.id;
        
        const isActive = petManager.getCurrentPet()?.id === pet.id;
        if (isActive) {
            card.classList.add('active');
        }
        
        const petEmoji = petManager.getPetEmoji(pet);
        const status = petManager.calculatePetStatus(pet);
        const needsAttention = petManager.needsAttention(pet);
        
        card.innerHTML = `
            <div class="pet-card-header">
                <div class="pet-avatar ${needsAttention ? 'needs-attention' : ''}">
                    ${petEmoji}
                </div>
                <div class="pet-info">
                    <h4>${pet.nombre}</h4>
                    <p>${pet.tipo} • ${PetUtils.formatAge(pet.edad)}</p>
                </div>
            </div>
            <div class="pet-stats-mini">
                <div class="stat-mini">
                    <div class="stat-mini-fill health" style="width: ${pet.salud}%"></div>
                </div>
                <div class="stat-mini">
                    <div class="stat-mini-fill energy" style="width: ${pet.energia}%"></div>
                </div>
                <div class="stat-mini">
                    <div class="stat-mini-fill happiness" style="width: ${pet.felicidad}%"></div>
                </div>
            </div>
            ${petManager.isPetSick(pet) ? '<div class="sick-indicator">🤒</div>' : ''}
        `;
        
        // Agregar evento de clic
        card.addEventListener('click', () => {
            this.selectPet(pet.id);
        });
        
        return card;
    }
    
    // Seleccionar mascota
    selectPet(petId) {
        const pet = petManager.selectPet(petId);
        if (!pet) return;
        
        // Actualizar tarjetas activas
        document.querySelectorAll('.pet-card').forEach(card => {
            card.classList.remove('active');
        });
        
        const activeCard = document.querySelector(`[data-pet-id="${petId}"]`);
        if (activeCard) {
            activeCard.classList.add('active');
        }
        
        // Actualizar display de la mascota
        this.updatePetDisplay(pet);
        
        // Iniciar actualización automática
        petManager.startAutoUpdate();
    }
    
    // Actualizar display de la mascota
    updatePetDisplay(pet) {
        const petSprite = document.getElementById('pet-sprite');
        const petName = document.getElementById('pet-name');
        const petEmoji = document.getElementById('pet-emoji');
        const healthBar = document.getElementById('health-bar');
        const energyBar = document.getElementById('energy-bar');
        const happinessBar = document.getElementById('happiness-bar');
        const healthValue = document.getElementById('health-value');
        const energyValue = document.getElementById('energy-value');
        const happinessValue = document.getElementById('happiness-value');
        
        // Actualizar sprite y nombre
        if (petEmoji) {
            petEmoji.textContent = petManager.getPetEmoji(pet);
        } else {
            petSprite.innerHTML = petManager.getPetEmoji(pet);
        }
        petName.textContent = pet.nombre;
        
        // Actualizar barras de estadísticas
        healthBar.style.width = `${pet.salud}%`;
        energyBar.style.width = `${pet.energia}%`;
        happinessBar.style.width = `${pet.felicidad}%`;
        
        // Actualizar valores numéricos
        healthValue.textContent = Math.round(pet.salud);
        energyValue.textContent = Math.round(pet.energia);
        happinessValue.textContent = Math.round(pet.felicidad);
        
        // Aplicar clases de estado
        if (petSprite) {
            petSprite.className = `pet-sprite pet-avatar ${petManager.calculatePetStatus(pet)}`;
        }
        if (petManager.isPetSick(pet)) {
            if (petSprite) {
                petSprite.classList.add('sick');
            }
        }
        
        // Aplicar efectos visuales según el estado de la mascota
        if (typeof effectsManager !== 'undefined') {
            if (pet.salud < 30 || pet.energia < 30 || pet.felicidad < 30) {
                effectsManager.lowStatsEffect(petSprite);
            } else if (pet.salud > 80 && pet.energia > 80 && pet.felicidad > 80) {
                effectsManager.highStatsEffect(petSprite);
            } else {
                // Remover efectos si las estadísticas están normales
                if (petSprite) {
                    petSprite.classList.remove('pet-sick', 'pet-happy');
                }
                petSprite.style.animation = '';
            }
        }
    }
    
    // Configurar botones de acción
    setupActionButtons() {
        const actionButtons = document.querySelectorAll('.action-btn');
        
        actionButtons.forEach(btn => {
            btn.addEventListener('click', async (e) => {
                e.preventDefault();
                
                const action = btn.dataset.action;
                const currentPet = petManager.getCurrentPet();
                
                if (!currentPet) {
                    this.showNotification('Selecciona una mascota primero', 'warning');
                    return;
                }
                
                // Deshabilitar botón temporalmente
                btn.disabled = true;
                btn.style.opacity = '0.5';
                
                try {
                    await this.executeAction(action, btn.dataset, currentPet.id);
                } catch (error) {
                    this.showNotification(error.message, 'error');
                } finally {
                    // Rehabilitar botón
                    btn.disabled = false;
                    btn.style.opacity = '1';
                }
            });
        });
    }
    
    // Ejecutar acción
    async executeAction(action, data, petId) {
        // Obtener elemento de la mascota para efectos visuales
        const petElement = document.querySelector('.pet-avatar') || document.querySelector('.pet-card');
        
        let result;
        
        switch (action) {
            case 'feed':
                result = await petManager.feedPet(petId, data.type);
                this.showNotification(`${result.mensaje}`, 'success');
                // Efecto de alimentación
                if (typeof effectsManager !== 'undefined' && petElement) {
                    effectsManager.feedEffect(petElement);
                }
                break;
                
            case 'walk':
                result = await petManager.walkPet(petId, parseInt(data.duration));
                this.showNotification(`${result.mensaje}`, 'success');
                // Efecto de paseo
                if (typeof effectsManager !== 'undefined' && petElement) {
                    effectsManager.walkEffect(petElement);
                }
                break;
                
            case 'cure':
                result = await petManager.curePet(petId, data.medicine);
                this.showNotification(`${result.mensaje}`, 'success');
                // Efecto de curación
                if (typeof effectsManager !== 'undefined' && petElement) {
                    effectsManager.cureEffect(petElement);
                }
                break;
                
            case 'personality':
                result = await petManager.changePersonality(petId, data.type);
                this.showNotification(`Personalidad cambiada a ${data.type}`, 'success');
                // Efecto de cambio de personalidad
                if (typeof effectsManager !== 'undefined' && petElement) {
                    effectsManager.personalityEffect(petElement, data.type);
                }
                break;
                
            default:
                throw new Error('Acción no reconocida');
        }
        
        // Actualizar interfaz
        this.updatePetDisplay(result.mascota);
        this.updatePetList();
        
        // Verificar si las estadísticas están altas para efectos especiales
        if (typeof effectsManager !== 'undefined' && petElement && result.mascota) {
            if (result.mascota.salud > 80 && result.mascota.energia > 80 && result.mascota.felicidad > 80) {
                effectsManager.highStatsEffect(petElement);
            } else if (result.mascota.salud < 30 || result.mascota.energia < 30 || result.mascota.felicidad < 30) {
                effectsManager.lowStatsEffect(petElement);
            }
        }
    }
    
    // Configurar modal de crear mascota
    setupCreatePetModal() {
        const createPetBtn = document.getElementById('create-pet-btn');
        const modal = document.getElementById('create-pet-modal');
        const closeBtn = modal.querySelector('.close-btn');
        const cancelBtn = modal.querySelector('.cancel-btn');
        const form = document.getElementById('create-pet-form');
        
        // Mostrar modal
        createPetBtn.addEventListener('click', () => {
            this.showCreatePetModal();
        });
        
        // Cerrar modal
        closeBtn.addEventListener('click', () => {
            this.hideCreatePetModal();
        });
        
        cancelBtn.addEventListener('click', () => {
            this.hideCreatePetModal();
        });
        
        // Cerrar modal al hacer clic fuera
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.hideCreatePetModal();
            }
        });
        
        // Manejar envío del formulario
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const formData = new FormData(form);
            const petData = {
                nombre: formData.get('pet-name-input'),
                tipo: formData.get('pet-type-input'),
                poder: formData.get('pet-power-input'),
                edad: parseInt(formData.get('pet-age-input')),
                descripcion: formData.get('pet-description-input') || 'Una mascota muy especial'
            };
            
            // Validar datos
            const validation = PetUtils.validatePetData(petData);
            if (!validation.isValid) {
                this.showNotification(validation.errors.join('\n'), 'error');
                return;
            }
            
            try {
                const newPet = await petManager.createPet(petData);
                this.hideCreatePetModal();
                this.updatePetList();
                this.selectPet(newPet.id);
                this.showNotification(`¡${newPet.nombre} ha sido creado exitosamente!`, 'success');
                form.reset();
            } catch (error) {
                this.showNotification(error.message, 'error');
            }
        });
    }
    
    // Mostrar modal de crear mascota
    showCreatePetModal() {
        const modal = document.getElementById('create-pet-modal');
        modal.classList.remove('hidden');
        this.activeModals.push(modal);
    }
    
    // Ocultar modal de crear mascota
    hideCreatePetModal() {
        const modal = document.getElementById('create-pet-modal');
        modal.classList.add('hidden');
        this.activeModals = this.activeModals.filter(m => m !== modal);
    }
    
    // Configurar inventario
    setupInventory() {
        this.updateInventory();
    }
    
    // Actualizar inventario
    updateInventory() {
        const inventoryList = document.getElementById('inventory-list');
        
        // Por ahora, mostrar items de ejemplo
        const sampleItems = [
            { id: 1, nombre: 'Vitamina C', tipo: 'medicamento', descripcion: 'Cura resfriados' },
            { id: 2, nombre: 'Antibiótico', tipo: 'medicamento', descripcion: 'Cura enfermedades' },
            { id: 3, nombre: 'Juguete', tipo: 'entretenimiento', descripcion: 'Aumenta felicidad' }
        ];
        
        inventoryList.innerHTML = '';
        
        sampleItems.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.className = 'inventory-item';
            itemElement.innerHTML = `
                <div class="item-icon">${this.getItemIcon(item.tipo)}</div>
                <div class="item-info">
                    <h5>${item.nombre}</h5>
                    <p>${item.descripcion}</p>
                </div>
            `;
            
            itemElement.addEventListener('click', () => {
                this.useItem(item);
            });
            
            inventoryList.appendChild(itemElement);
        });
    }
    
    // Obtener icono del item
    getItemIcon(type) {
        const icons = {
            medicamento: '💊',
            entretenimiento: '🎮',
            alimento: '🍎',
            accesorio: '🎀'
        };
        return icons[type] || '📦';
    }
    
    // Usar item
    useItem(item) {
        const currentPet = petManager.getCurrentPet();
        if (!currentPet) {
            this.showNotification('Selecciona una mascota primero', 'warning');
            return;
        }
        
        this.showNotification(`Usando ${item.nombre} en ${currentPet.nombre}`, 'info');
    }
    
    // Mostrar notificación
    showNotification(message, type = 'info') {
        // Usar el sistema de efectos mejorado si está disponible
        if (typeof effectsManager !== 'undefined') {
            effectsManager.enhancedNotification(message, type);
        } else {
            // Fallback al sistema original
            const notificationsContainer = document.getElementById('notifications');
            const notification = document.createElement('div');
            notification.className = `notification ${type}`;
            
            notification.innerHTML = `
                <div class="notification-content">
                    <i class="fas ${this.getNotificationIcon(type)}"></i>
                    <span>${message}</span>
                </div>
                <button class="notification-close" onclick="this.parentElement.remove()">
                    <i class="fas fa-times"></i>
                </button>
            `;
            
            notificationsContainer.appendChild(notification);
            
            // Auto-remover después del tiempo configurado
            setTimeout(() => {
                if (notification.parentElement) {
                    notification.remove();
                }
            }, CONFIG.NOTIFICATIONS.DURATION);
            
            // Agregar a la lista de notificaciones
            this.notifications.push(notification);
        }
    }
    
    // Obtener icono de notificación
    getNotificationIcon(type) {
        const icons = {
            success: 'fa-check-circle',
            error: 'fa-exclamation-circle',
            warning: 'fa-exclamation-triangle',
            info: 'fa-info-circle'
        };
        return icons[type] || icons.info;
    }
    
    // Mostrar diálogo de confirmación
    showConfirmDialog(message, onConfirm) {
        const dialog = document.createElement('div');
        dialog.className = 'modal';
        dialog.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Confirmar acción</h3>
                </div>
                <div class="modal-body">
                    <p>${message}</p>
                </div>
                <div class="form-actions">
                    <button class="cancel-btn">Cancelar</button>
                    <button class="submit-btn">Confirmar</button>
                </div>
            </div>
        `;
        
        // Configurar eventos de los botones
        const cancelBtn = dialog.querySelector('.cancel-btn');
        const confirmBtn = dialog.querySelector('.submit-btn');
        
        cancelBtn.addEventListener('click', () => {
            dialog.remove();
        });
        
        confirmBtn.addEventListener('click', () => {
            dialog.remove();
            onConfirm();
        });
        
        document.body.appendChild(dialog);
        this.activeModals.push(dialog);
    }
    
    // Mostrar error
    showError(message) {
        this.showNotification(message, 'error');
    }
    
    // Mostrar éxito
    showSuccess(message) {
        this.showNotification(message, 'success');
    }
    
    // Mostrar advertencia
    showWarning(message) {
        this.showNotification(message, 'warning');
    }
    
    // Mostrar información
    showInfo(message) {
        this.showNotification(message, 'info');
    }
    
    // Limpiar todas las notificaciones
    clearNotifications() {
        const notificationsContainer = document.getElementById('notifications');
        notificationsContainer.innerHTML = '';
        this.notifications = [];
    }
    
    // Cerrar todos los modales
    closeAllModals() {
        this.activeModals.forEach(modal => {
            modal.remove();
        });
        this.activeModals = [];
    }
    
    // Actualizar toda la interfaz
    updateUI() {
        this.updatePetList();
        this.updateInventory();
        
        const currentPet = petManager.getCurrentPet();
        if (currentPet) {
            this.updatePetDisplay(currentPet);
        }
    }
}

// Instancia global del UIManager
const uiManager = new UIManager();

// Utilidades de UI
const UIUtils = {
    // Animar elemento
    animate: (element, animation, duration = 300) => {
        element.style.animation = `${animation} ${duration}ms ease-in-out`;
        
        setTimeout(() => {
            element.style.animation = '';
        }, duration);
    },
    
    // Fade in
    fadeIn: (element, duration = 300) => {
        element.style.opacity = '0';
        element.style.display = 'block';
        
        setTimeout(() => {
            element.style.opacity = '1';
            element.style.transition = `opacity ${duration}ms ease-in-out`;
        }, 10);
    },
    
    // Fade out
    fadeOut: (element, duration = 300) => {
        element.style.transition = `opacity ${duration}ms ease-in-out`;
        element.style.opacity = '0';
        
        setTimeout(() => {
            element.style.display = 'none';
        }, duration);
    },
    
    // Slide down
    slideDown: (element, duration = 300) => {
        element.style.height = '0';
        element.style.overflow = 'hidden';
        element.style.display = 'block';
        
        const height = element.scrollHeight;
        element.style.transition = `height ${duration}ms ease-in-out`;
        element.style.height = height + 'px';
        
        setTimeout(() => {
            element.style.height = 'auto';
        }, duration);
    },
    
    // Slide up
    slideUp: (element, duration = 300) => {
        element.style.height = element.scrollHeight + 'px';
        element.style.overflow = 'hidden';
        
        setTimeout(() => {
            element.style.transition = `height ${duration}ms ease-in-out`;
            element.style.height = '0';
        }, 10);
        
        setTimeout(() => {
            element.style.display = 'none';
        }, duration);
    }
};

// Exportar para uso en otros módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { UIManager, UIUtils, uiManager };
} 