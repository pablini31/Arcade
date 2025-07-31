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
        const authScreen = document.getElementById('auth-screen');
        if (authScreen) {
            authScreen.classList.remove('hidden');
            this.currentScreen = 'auth';
            console.log('🔧 Pantalla de auth mostrada');
        } else {
            console.error('❌ Pantalla de auth no encontrada');
        }
        
        // Resetear flag de inicialización para la próxima vez
        this._componentsInitialized = false;
        
        // Configurar tabs
        this.setupAuthTabs();
    }
    
    // Mostrar pantalla del juego
    showGameScreen() {
        this.hideAllScreens();
        const gameScreen = document.getElementById('game-screen');
        if (gameScreen) {
            gameScreen.classList.remove('hidden');
            this.currentScreen = 'game';
            console.log('🔧 Pantalla del juego mostrada');
        } else {
            console.error('❌ Pantalla del juego no encontrada');
        }
        
        // Inicializar componentes del juego
        this.initializeGameComponents();
        
        // Verificar que elementos críticos existen
        setTimeout(() => {
            const logoutBtn = document.getElementById('logout-btn');
            console.log('🔍 Verificación post-inicialización:');
            console.log('   - Botón logout existe:', !!logoutBtn);
            console.log('   - Botón logout visible:', logoutBtn ? !logoutBtn.hidden : false);
            console.log('   - Pantalla actual:', this.currentScreen);
        }, 500);
    }
    
    // Ocultar todas las pantallas
    hideAllScreens() {
        const loadingScreen = document.getElementById('loading-screen');
        const authScreen = document.getElementById('auth-screen');
        const gameScreen = document.getElementById('game-screen');
        
        if (loadingScreen) loadingScreen.classList.add('hidden');
        if (authScreen) authScreen.classList.add('hidden');
        if (gameScreen) gameScreen.classList.add('hidden');
        
        console.log('🔧 Pantallas ocultadas:', {
            loading: loadingScreen?.classList.contains('hidden'),
            auth: authScreen?.classList.contains('hidden'),
            game: gameScreen?.classList.contains('hidden')
        });
    }
    
    // Configurar tabs de autenticación
    setupAuthTabs() {
        const tabBtns = document.querySelectorAll('.tab-btn');
        const loginForm = document.getElementById('login-form');
        const registerForm = document.getElementById('register-form');
        
        // Función para cambiar tab
        const switchTab = (tabName) => {
            // Remover clase active de todos los tabs
            tabBtns.forEach(b => b.classList.remove('active'));
            
            // Ocultar todos los formularios
            if (loginForm) loginForm.classList.add('hidden');
            if (registerForm) registerForm.classList.add('hidden');
            
            // Activar tab correspondiente
            const activeTab = document.querySelector(`[data-tab="${tabName}"]`);
            if (activeTab) {
                activeTab.classList.add('active');
            }
            
            // Mostrar formulario correspondiente
            if (tabName === 'login' && loginForm) {
                loginForm.classList.remove('hidden');
            } else if (tabName === 'register' && registerForm) {
                registerForm.classList.remove('hidden');
            }
            
            console.log(`🔧 Tab cambiado a: ${tabName}`);
        };
        
        // Configurar event listeners
        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const tab = btn.dataset.tab;
                switchTab(tab);
            });
        });
        
        // Configurar estado inicial basado en el tab activo
        const activeTab = document.querySelector('.tab-btn.active');
        if (activeTab) {
            const tabName = activeTab.dataset.tab;
            switchTab(tabName);
        }
    }
    
    // Inicializar componentes del juego
    initializeGameComponents() {
        // Prevenir inicialización múltiple
        if (this._componentsInitialized) {
            console.warn('⚠️ Componentes ya inicializados, saltando...');
            return;
        }
        
        this.setupGameHeader();
        this.setupPetList();
        this.setupActionButtons();
        this.setupCreatePetModal();
        this.setupInventory();
        
        this._componentsInitialized = true;
        console.log('✅ Componentes del juego inicializados');
    }
    
    // Configurar header del juego
    setupGameHeader() {
        const userInfo = authManager.getCurrentUser();
        const userNameElement = document.getElementById('user-name');
        const logoutBtn = document.getElementById('logout-btn');
        
        console.log('🔧 Configurando header del juego...');
        console.log('👤 Usuario:', userInfo?.nombre || userInfo?.username);
        console.log('🚪 Botón logout encontrado:', !!logoutBtn);
        
        // Configurar nombre de usuario
        if (userInfo && userNameElement) {
            userNameElement.textContent = userInfo.nombre || userInfo.username;
            console.log('✅ Nombre de usuario configurado');
        }
        
        // Agregar botón de "Cambiar Cuenta" si no existe
        this.addSwitchAccountButton();
        
        // Configurar botón de logout - MÉTODO SIMPLE Y DIRECTO
        if (logoutBtn) {
            // Limpiar cualquier listener anterior
            logoutBtn.onclick = null;
            logoutBtn.removeEventListener('click', this.handleLogout);
            
            // Crear función de logout con referencias directas (sin this)
            const handleLogout = () => {
                console.log('🚪 LOGOUT CLICKEADO');
                
                // Confirmar logout
                if (confirm('¿Estás seguro de que quieres cerrar sesión?')) {
                    console.log('✅ Usuario confirmó logout');
                    
                    try {
                        // Ejecutar logout
                    authManager.logout();
                        console.log('🔓 Logout ejecutado');
                        
                        // Limpiar mascota actual
                        petManager.currentPet = null;
                        localStorage.removeItem('petventure_current_pet');
                        
                        // Mostrar pantalla de autenticación directamente
                        const authScreen = document.getElementById('auth-screen');
                        const gameScreen = document.getElementById('game-screen');
                        
                        if (authScreen && gameScreen) {
                            // Ocultar juego
                            gameScreen.classList.add('hidden');
                            // Mostrar auth
                            authScreen.classList.remove('hidden');
                            
                            // Resetear flag de inicialización
                            uiManager._componentsInitialized = false;
                            
                            console.log('🔄 Pantalla de auth mostrada');
                        }
                        
                        // Configurar handlers de auth
                        if (typeof gameManager !== 'undefined' && gameManager.setupAuthHandlers) {
                            setTimeout(() => {
                                gameManager.setupAuthHandlers();
                            }, 100);
                        }
                        
                        // Mostrar notificación
                        uiManager.showNotification('Sesión cerrada exitosamente', 'info');
                        
                        // Como último recurso, recargar en 2 segundos
                        setTimeout(() => {
                            console.log('🔄 Recargando página como backup...');
                            window.location.reload();
                        }, 2000);
                        
                    } catch (error) {
                        console.error('❌ Error durante logout:', error);
                        // Fallback: recargar página directamente
                        window.location.reload();
                    }
                } else {
                    console.log('❌ Usuario canceló logout');
                }
            };
            
            // Asignar el evento
            logoutBtn.onclick = handleLogout;
            logoutBtn.addEventListener('click', handleLogout);
            
            console.log('✅ Botón de logout configurado (método simple)');
            
        } else {
            console.error('❌ Botón de logout NO encontrado');
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
        
        if (!petsList) {
            console.error('❌ Elemento pets-list no encontrado');
            return;
        }
        
        // PREVENIR DUPLICACIÓN: Limpiar completamente la lista
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
        
        console.log(`📋 Renderizando ${pets.length} mascotas`);
        
        pets.forEach((pet, index) => {
            const petCard = this.createPetCard(pet);
            petsList.appendChild(petCard);
            console.log(`🐾 Mascota ${index + 1}: ${pet.nombre} (ID: ${pet._id})`);
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
        if (!pet) {
            console.warn('updatePetDisplay: No pet data provided');
            return;
        }

        const petSprite = document.getElementById('pet-sprite');
        const petName = document.getElementById('pet-name');
        const petEmoji = document.getElementById('pet-emoji');
        const healthBar = document.getElementById('health-bar');
        const energyBar = document.getElementById('energy-bar');
        const happinessBar = document.getElementById('happiness-bar');
        const healthValue = document.getElementById('health-value');
        const energyValue = document.getElementById('energy-value');
        const happinessValue = document.getElementById('happiness-value');
        
        // Verificar que todos los elementos necesarios existen
        if (!petSprite || !petName || !healthBar || !energyBar || !happinessBar || 
            !healthValue || !energyValue || !happinessValue) {
            console.error('updatePetDisplay: Required DOM elements not found');
            return;
        }
        
        // Actualizar sprite y nombre
        if (petEmoji) {
            petEmoji.textContent = petManager.getPetEmoji(pet);
        } else if (petSprite) {
            petSprite.innerHTML = petManager.getPetEmoji(pet);
        }
        
        if (petName) {
            petName.textContent = pet.nombre || 'Mascota sin nombre';
        }
        
        // Actualizar barras de estadísticas con valores seguros
        const salud = Math.max(0, Math.min(100, pet.salud || 0));
        const energia = Math.max(0, Math.min(100, pet.energia || 0));
        const felicidad = Math.max(0, Math.min(100, pet.felicidad || 0));
        
        healthBar.style.width = `${salud}%`;
        energyBar.style.width = `${energia}%`;
        happinessBar.style.width = `${felicidad}%`;
        
        // Actualizar valores numéricos
        healthValue.textContent = Math.round(salud);
        energyValue.textContent = Math.round(energia);
        happinessValue.textContent = Math.round(felicidad);
        
        // Aplicar clases de estado
        if (petSprite) {
            petSprite.className = `pet-sprite pet-avatar ${petManager.calculatePetStatus(pet)}`;
            
            // Remover clases de estado previas
            petSprite.classList.remove('sick', 'pet-sick', 'pet-happy');
            petSprite.style.animation = '';
            
            // Aplicar clases según el estado
            if (petManager.isPetSick(pet)) {
                petSprite.classList.add('sick');
            }
        }
        
        // Aplicar efectos visuales según el estado de la mascota
        if (typeof effectsManager !== 'undefined' && petSprite) {
            try {
                if (salud < 30 || energia < 30 || felicidad < 30) {
                    effectsManager.lowStatsEffect(petSprite);
                } else if (salud > 80 && energia > 80 && felicidad > 80) {
                    effectsManager.highStatsEffect(petSprite);
                }
            } catch (error) {
                console.warn('Error applying visual effects:', error);
            }
        }
        
        // Debug info removed for production
    }
    
    // Alias para updatePetStats (para compatibilidad)
    updatePetStats(pet) {
        this.updatePetDisplay(pet);
    }
    
    // Generar mensajes por defecto para acciones
    getDefaultMessage(action) {
        const currentPet = petManager.getCurrentPet();
        const petName = currentPet ? currentPet.nombre : 'tu mascota';
        
        switch (action) {
            case 'feed':
                return `¡${petName} ha sido alimentado exitosamente! 🍽️`;
            case 'walk':
                return `¡${petName} ha disfrutado del paseo! 🐕`;
            case 'cure':
                return `¡${petName} se siente mejor ahora! 💊`;
            case 'personality':
                return `¡La personalidad de ${petName} ha cambiado! ✨`;
            default:
                return `¡Acción completada con éxito! 🎉`;
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
                const foodType = data.type || 'normal';
                result = await petManager.feedPet(petId, foodType);
                // Efecto de alimentación
                if (typeof effectsManager !== 'undefined' && petElement) {
                    effectsManager.feedEffect(petElement);
                }
                break;
                
            case 'walk':
                const duration = parseInt(data.duration) || 30;
                result = await petManager.walkPet(petId, duration);
                // Efecto de paseo
                if (typeof effectsManager !== 'undefined' && petElement) {
                    effectsManager.walkEffect(petElement);
                }
                break;
                
            case 'cure':
                const medicine = data.medicine || 'vitaminaC';
                result = await petManager.curePet(petId, medicine);
                // Efecto de curación
                if (typeof effectsManager !== 'undefined' && petElement) {
                    effectsManager.cureEffect(petElement);
                }
                break;
                
            case 'personality':
                const personality = data.type || 'amigable';
                result = await petManager.changePersonality(petId, personality);
                // Efecto de cambio de personalidad
                if (typeof effectsManager !== 'undefined' && petElement) {
                    effectsManager.personalityEffect(petElement, personality);
                }
                break;
                
            case 'memory-game':
                if (typeof minigameManager !== 'undefined') {
                    minigameManager.startMemoryGame();
                    return; // No necesitamos actualizar UI para minijuegos
                }
                break;
                
            case 'reaction-game':
                if (typeof minigameManager !== 'undefined') {
                    minigameManager.startReactionGame();
                    return; // No necesitamos actualizar UI para minijuegos
                }
                break;
                
            case 'puzzle-game':
                if (typeof minigameManager !== 'undefined') {
                    minigameManager.startPuzzleGame();
                    return; // No necesitamos actualizar UI para minijuegos
                }
                break;
                
            default:
                throw new Error('Acción no reconocida');
        }
        
        // Actualizar interfaz con verificación de datos
        const petData = result.mascota || result.pet;
        const message = result.mensaje || result.message || this.getDefaultMessage(action);
        
        if (petData) {
            this.updatePetDisplay(petData);
            this.updatePetList();
            this.showNotification(message, 'success');
            
            // Verificar si las estadísticas están altas para efectos especiales
            if (typeof effectsManager !== 'undefined' && petElement) {
                try {
                    if (petData.salud > 80 && petData.energia > 80 && petData.felicidad > 80) {
                        effectsManager.highStatsEffect(petElement);
                    } else if (petData.salud < 30 || petData.energia < 30 || petData.felicidad < 30) {
                        effectsManager.lowStatsEffect(petElement);
                    }
                } catch (error) {
                    console.warn('Error applying post-action effects:', error);
                }
            }
        } else {
            console.error('No pet data received from action:', action, result);
            this.showNotification('No se pudo actualizar la mascota', 'error');
            // Intentar actualizar con la mascota actual como fallback
            const currentPet = petManager.getCurrentPet();
            if (currentPet) {
                this.updatePetDisplay(currentPet);
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
                <div class="item-icon">${this.getItemIcon(item.tipo || 'default')}</div>
                <div class="item-info">
                    <h5>${item.nombre || 'Item'}</h5>
                    <p>${item.descripcion || 'Sin descripción'}</p>
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
    
    // Función de debug para verificar estado de pantallas
    debugScreenState() {
        const loadingScreen = document.getElementById('loading-screen');
        const authScreen = document.getElementById('auth-screen');
        const gameScreen = document.getElementById('game-screen');
        
        console.log('🔍 Estado actual de pantallas:');
        console.log('   - Loading screen:', loadingScreen?.classList.contains('hidden') ? 'OCULTA' : 'VISIBLE');
        console.log('   - Auth screen:', authScreen?.classList.contains('hidden') ? 'OCULTA' : 'VISIBLE');
        console.log('   - Game screen:', gameScreen?.classList.contains('hidden') ? 'OCULTA' : 'VISIBLE');
        console.log('   - Pantalla actual (UI):', this.currentScreen);
        console.log('   - Usuario autenticado:', authManager.isLoggedIn());
        console.log('   - Token existe:', !!authManager.getToken());
        console.log('   - Usuario actual:', authManager.getCurrentUser());
        
        // Forzar pantalla correcta si hay conflicto
        if (!authScreen?.classList.contains('hidden') && !gameScreen?.classList.contains('hidden')) {
            console.log('⚠️ CONFLICTO: Ambas pantallas visibles, forzando corrección...');
            if (authManager.isLoggedIn()) {
                this.showGameScreen();
            } else {
                this.showAuthScreen();
            }
        }
        
        // Si está autenticado pero ve la pantalla de auth, forzar pantalla del juego
        if (authManager.isLoggedIn() && !authScreen?.classList.contains('hidden')) {
            console.log('⚠️ Usuario autenticado viendo pantalla de auth, forzando pantalla del juego...');
            this.showGameScreen();
        }
        
        // Si NO está autenticado pero ve la pantalla del juego, forzar pantalla de auth
        if (!authManager.isLoggedIn() && !gameScreen?.classList.contains('hidden')) {
            console.log('⚠️ Usuario NO autenticado viendo pantalla del juego, forzando pantalla de auth...');
            this.showAuthScreen();
        }
    }
    
    // Función para forzar logout desde consola
    forceLogout() {
        console.log('🔓 Forzando logout...');
        authManager.logout();
        petManager.currentPet = null;
        localStorage.removeItem('petventure_current_pet');
        this._componentsInitialized = false;
        this.showAuthScreen();
        console.log('✅ Logout forzado completado');
    }
    
    // Agregar botón de "Cambiar Cuenta" al header
    addSwitchAccountButton() {
        const gameHeader = document.querySelector('.game-header');
        if (!gameHeader) {
            console.warn('⚠️ Header del juego no encontrado');
            return;
        }
        
        // Verificar si ya existe el botón
        const existingSwitchBtn = document.getElementById('switch-account-btn');
        if (existingSwitchBtn) {
            console.log('✅ Botón de cambiar cuenta ya existe');
            return;
        }
        
        // Crear el botón
        const switchAccountBtn = document.createElement('button');
        switchAccountBtn.id = 'switch-account-btn';
        switchAccountBtn.className = 'switch-account-btn';
        switchAccountBtn.innerHTML = '<i class="fas fa-exchange-alt"></i> Cambiar Cuenta';
        switchAccountBtn.title = 'Cambiar de cuenta o registrar nueva cuenta';
        
        // Agregar estilos CSS inline para el botón
        switchAccountBtn.style.cssText = `
            background: linear-gradient(135deg, #8b5cf6, #6366f1);
            border: none;
            color: white;
            padding: 0.75rem 1rem;
            border-radius: 8px;
            cursor: pointer;
            font-size: 0.9rem;
            font-weight: 600;
            margin-right: 1rem;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            gap: 0.5rem;
        `;
        
        // Agregar efectos hover
        switchAccountBtn.addEventListener('mouseenter', () => {
            switchAccountBtn.style.transform = 'translateY(-2px)';
            switchAccountBtn.style.boxShadow = '0 8px 20px rgba(139, 92, 246, 0.4)';
        });
        
        switchAccountBtn.addEventListener('mouseleave', () => {
            switchAccountBtn.style.transform = 'translateY(0)';
            switchAccountBtn.style.boxShadow = 'none';
        });
        
        // Agregar event listener
        switchAccountBtn.addEventListener('click', () => {
            console.log('🔄 Botón de cambiar cuenta clickeado');
            
            // Mostrar opciones al usuario
            const options = [
                'Cambiar de cuenta (cerrar sesión actual)',
                'Registrar nueva cuenta (mantener sesión actual)',
                'Cancelar'
            ];
            
            const choice = prompt(
                '¿Qué quieres hacer?\n\n' +
                '1. Cambiar de cuenta (cerrar sesión actual)\n' +
                '2. Registrarse nueva cuenta (mantener sesión actual)\n' +
                '3. Cancelar\n\n' +
                'Escribe 1, 2 o 3:'
            );
            
            if (choice === '1') {
                // Cambiar de cuenta
                if (confirm('¿Estás seguro de que quieres cerrar tu sesión actual?')) {
                    if (typeof gameManager !== 'undefined' && gameManager.switchAccount) {
                        gameManager.switchAccount();
                    } else {
                        console.log('⚠️ GameManager no disponible, usando logout normal');
                        authManager.logout();
                        this.showAuthScreen();
                        this.showNotification('Puedes iniciar sesión con otra cuenta o registrar una nueva', 'info');
                    }
                }
            } else if (choice === '2') {
                // Registrar nueva cuenta
                this.showQuickRegisterModal();
            } else {
                console.log('❌ Usuario canceló la operación');
            }
        });
        
        // Insertar el botón antes del botón de logout
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn && logoutBtn.parentNode) {
            logoutBtn.parentNode.insertBefore(switchAccountBtn, logoutBtn);
            console.log('✅ Botón de cambiar cuenta agregado al header');
        } else {
            // Si no hay botón de logout, agregar al final del header
            gameHeader.appendChild(switchAccountBtn);
            console.log('✅ Botón de cambiar cuenta agregado al final del header');
        }
    }
    
    // Mostrar modal de registro rápido
    showQuickRegisterModal() {
        // Crear el modal
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.id = 'quick-register-modal';
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
            backdrop-filter: blur(5px);
        `;
        
        // Crear el contenido del modal
        const modalContent = document.createElement('div');
        modalContent.className = 'modal-content';
        modalContent.style.cssText = `
            background: linear-gradient(145deg, #1e293b, #2d3748);
            border-radius: 20px;
            padding: 2rem;
            width: 90%;
            max-width: 500px;
            box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5);
            border: 1px solid #334155;
            color: white;
        `;
        
        modalContent.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; padding-bottom: 1rem; border-bottom: 1px solid #334155;">
                <h3 style="margin: 0; color: #8b5cf6; font-size: 1.5rem;">
                    <i class="fas fa-user-plus"></i> Registrar Nueva Cuenta
                </h3>
                <button id="close-quick-register" style="background: none; border: none; color: #cbd5e1; font-size: 1.5rem; cursor: pointer; padding: 0.5rem;">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            
            <form id="quick-register-form" style="display: flex; flex-direction: column; gap: 1rem;">
                <div style="position: relative;">
                    <i class="fas fa-user-circle" style="position: absolute; left: 1rem; top: 50%; transform: translateY(-50%); color: #8b5cf6;"></i>
                    <input type="text" id="quick-register-name" placeholder="Nombre completo" required 
                           style="width: 100%; padding: 0.75rem 0.75rem 0.75rem 2.5rem; border: 2px solid #334155; border-radius: 8px; background: #1e293b; color: white; font-size: 1rem;">
                </div>
                
                <div style="position: relative;">
                    <i class="fas fa-user" style="position: absolute; left: 1rem; top: 50%; transform: translateY(-50%); color: #8b5cf6;"></i>
                    <input type="text" id="quick-register-username" placeholder="Nombre de usuario" required 
                           style="width: 100%; padding: 0.75rem 0.75rem 0.75rem 2.5rem; border: 2px solid #334155; border-radius: 8px; background: #1e293b; color: white; font-size: 1rem;">
                </div>
                
                <div style="position: relative;">
                    <i class="fas fa-envelope" style="position: absolute; left: 1rem; top: 50%; transform: translateY(-50%); color: #8b5cf6;"></i>
                    <input type="email" id="quick-register-email" placeholder="Email" required 
                           style="width: 100%; padding: 0.75rem 0.75rem 0.75rem 2.5rem; border: 2px solid #334155; border-radius: 8px; background: #1e293b; color: white; font-size: 1rem;">
                </div>
                
                <div style="position: relative;">
                    <i class="fas fa-lock" style="position: absolute; left: 1rem; top: 50%; transform: translateY(-50%); color: #8b5cf6;"></i>
                    <input type="password" id="quick-register-password" placeholder="Contraseña" required 
                           style="width: 100%; padding: 0.75rem 0.75rem 0.75rem 2.5rem; border: 2px solid #334155; border-radius: 8px; background: #1e293b; color: white; font-size: 1rem;">
                </div>
                
                <div style="position: relative;">
                    <i class="fas fa-check-circle" style="position: absolute; left: 1rem; top: 50%; transform: translateY(-50%); color: #8b5cf6;"></i>
                    <input type="password" id="quick-register-confirm-password" placeholder="Confirmar contraseña" required 
                           style="width: 100%; padding: 0.75rem 0.75rem 0.75rem 2.5rem; border: 2px solid #334155; border-radius: 8px; background: #1e293b; color: white; font-size: 1rem;">
                </div>
                
                <div style="display: flex; gap: 1rem; margin-top: 1rem;">
                    <button type="button" id="cancel-quick-register" 
                            style="flex: 1; padding: 0.75rem; border: 2px solid #334155; border-radius: 8px; background: #1e293b; color: #cbd5e1; cursor: pointer; font-weight: 600;">
                        Cancelar
                    </button>
                    <button type="submit" id="submit-quick-register" 
                            style="flex: 1; padding: 0.75rem; border: none; border-radius: 8px; background: linear-gradient(135deg, #8b5cf6, #6366f1); color: white; cursor: pointer; font-weight: 600;">
                        <i class="fas fa-user-plus"></i> Registrar
                    </button>
                </div>
            </form>
            
            <div style="margin-top: 1rem; padding: 1rem; background: rgba(139, 92, 246, 0.1); border-radius: 8px; border: 1px solid rgba(139, 92, 246, 0.3);">
                <p style="margin: 0; font-size: 0.9rem; color: #cbd5e1;">
                    <i class="fas fa-info-circle"></i> 
                    Esta cuenta se registrará independientemente de tu sesión actual. 
                    Podrás iniciar sesión con ella en cualquier momento.
                </p>
            </div>
        `;
        
        modal.appendChild(modalContent);
        document.body.appendChild(modal);
        
        // Configurar event listeners
        const closeBtn = document.getElementById('close-quick-register');
        const cancelBtn = document.getElementById('cancel-quick-register');
        const form = document.getElementById('quick-register-form');
        
        // Cerrar modal
        const closeModal = () => {
            document.body.removeChild(modal);
        };
        
        closeBtn.addEventListener('click', closeModal);
        cancelBtn.addEventListener('click', closeModal);
        
        // Cerrar al hacer clic fuera del modal
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });
        
        // Manejar envío del formulario
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const submitBtn = document.getElementById('submit-quick-register');
            const originalText = submitBtn.innerHTML;
            
            try {
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Registrando...';
                
                const userData = {
                    nombre: document.getElementById('quick-register-name').value.trim(),
                    username: document.getElementById('quick-register-username').value.trim(),
                    email: document.getElementById('quick-register-email').value.trim(),
                    password: document.getElementById('quick-register-password').value,
                    confirmPassword: document.getElementById('quick-register-confirm-password').value
                };
                
                // Validaciones
                if (!userData.nombre || !userData.username || !userData.email || !userData.password) {
                    throw new Error('Por favor completa todos los campos');
                }
                
                if (userData.username.length < 3) {
                    throw new Error('El nombre de usuario debe tener al menos 3 caracteres');
                }
                
                if (userData.password.length < 6) {
                    throw new Error('La contraseña debe tener al menos 6 caracteres');
                }
                
                if (userData.password !== userData.confirmPassword) {
                    throw new Error('Las contraseñas no coinciden');
                }
                
                // Validar email
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(userData.email)) {
                    throw new Error('Por favor ingresa un email válido');
                }
                
                // Registrar usando el método adicional
                const result = await authManager.registerAdditionalUser(userData);
                
                this.showSuccess(result.message);
                closeModal();
                
                // Mostrar información adicional
                setTimeout(() => {
                    this.showNotification(
                        `Cuenta "${userData.username}" registrada exitosamente. ` +
                        'Puedes cambiar de cuenta usando el botón "Cambiar Cuenta" en cualquier momento.',
                        'info'
                    );
                }, 1000);
                
            } catch (error) {
                console.error('Error en registro rápido:', error);
                this.showError(error.message);
            } finally {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalText;
            }
        });
        
        // Efectos de focus en los inputs
        const inputs = modal.querySelectorAll('input');
        inputs.forEach(input => {
            input.addEventListener('focus', () => {
                input.style.borderColor = '#8b5cf6';
                input.style.boxShadow = '0 0 0 3px rgba(139, 92, 246, 0.1)';
            });
            
            input.addEventListener('blur', () => {
                input.style.borderColor = '#334155';
                input.style.boxShadow = 'none';
            });
        });
        
        console.log('✅ Modal de registro rápido mostrado');
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