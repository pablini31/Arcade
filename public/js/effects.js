// Sistema de Efectos Visuales para PetVenture
class EffectsManager {
    constructor() {
        this.particles = [];
        this.achievements = [];
        this.currentTheme = 'night';
        this.currentSeason = 'spring';
        this.soundEnabled = false;
        
        ConfigUtils.log('info', 'EffectsManager inicializado');
    }
    
    // Crear efecto de partículas
    createParticles(x, y, count = 10, color = '#ffffff') {
        const container = document.querySelector('.game-container') || document.body;
        
        for (let i = 0; i < count; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = x + 'px';
            particle.style.top = y + 'px';
            particle.style.background = color;
            
            // Posición aleatoria
            const angle = (Math.PI * 2 * i) / count;
            const velocity = 50 + Math.random() * 50;
            const vx = Math.cos(angle) * velocity;
            const vy = Math.sin(angle) * velocity;
            
            container.appendChild(particle);
            
            // Animar partícula
            this.animateParticle(particle, vx, vy);
        }
    }
    
    // Animar partícula individual
    animateParticle(particle, vx, vy) {
        let x = parseFloat(particle.style.left);
        let y = parseFloat(particle.style.top);
        let opacity = 1;
        let scale = 1;
        
        const animate = () => {
            x += vx * 0.1;
            y += vy * 0.1;
            opacity -= 0.02;
            scale -= 0.01;
            
            particle.style.left = x + 'px';
            particle.style.top = y + 'px';
            particle.style.opacity = opacity;
            particle.style.transform = `scale(${scale})`;
            
            if (opacity > 0 && scale > 0) {
                requestAnimationFrame(animate);
            } else {
                particle.remove();
            }
        };
        
        requestAnimationFrame(animate);
    }
    
    // Efecto de brillo en barras de progreso
    addGlowEffect(element, type) {
        element.classList.add('high');
        
        setTimeout(() => {
            element.classList.remove('high');
        }, 2000);
    }
    
    // Efecto de éxito en botones
    addSuccessEffect(button) {
        button.style.transform = 'scale(1.1)';
        button.style.boxShadow = '0 0 20px var(--success-color)';
        
        setTimeout(() => {
            button.style.transform = '';
            button.style.boxShadow = '';
        }, 300);
    }
    
    // Crear logro visual
    createAchievement(icon, title, description) {
        const achievement = {
            icon,
            title,
            description,
            timestamp: Date.now()
        };
        
        this.achievements.push(achievement);
        this.showAchievementNotification(achievement);
    }
    
    // Mostrar notificación de logro
    showAchievementNotification(achievement) {
        const notification = document.createElement('div');
        notification.className = 'achievement-notification fade-in';
        notification.innerHTML = `
            <div class="achievement-icon">${achievement.icon}</div>
            <div class="achievement-content">
                <h4>¡Logro Desbloqueado!</h4>
                <p>${achievement.title}</p>
                <small>${achievement.description}</small>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 5000);
    }
    
    // Cambiar tema (día/noche)
    toggleTheme() {
        const container = document.querySelector('.game-container');
        this.currentTheme = this.currentTheme === 'night' ? 'day' : 'night';
        
        // FIX: Verificar que el contenedor existe antes de cambiar className
        if (container) {
            container.className = `game-container theme-${this.currentTheme}`;
            
            // Efecto de transición
            this.createParticles(window.innerWidth / 2, window.innerHeight / 2, 20, '#ffffff');
        } else {
            console.warn('⚠️ Container no encontrado en toggleTheme');
        }
    }
    
    // Cambiar estación
    changeSeason(season) {
        const container = document.querySelector('.game-container');
        this.currentSeason = season;
        
        // FIX: Verificar que el contenedor existe
        if (container) {
            // Remover clases de estación anteriores
            container.classList.remove('season-spring', 'season-summer', 'season-autumn', 'season-winter');
            container.classList.add(`season-${season}`);
            
            // Efecto de transición
            this.createParticles(window.innerWidth / 2, 0, 15, '#ffffff');
        } else {
            console.warn('⚠️ Container no encontrado en changeSeason');
        }
    }
    
    // Efecto de alimentación
    feedEffect(petElement) {
        // Crear partículas de comida
        const rect = petElement.getBoundingClientRect();
        this.createParticles(rect.left + rect.width / 2, rect.top + rect.height / 2, 15, '#10b981');
        
        // Efecto de escala en la mascota
        petElement.style.transform = 'scale(1.1)';
        setTimeout(() => {
            petElement.style.transform = 'scale(1)';
        }, 300);
        
        // Sonido de alimentación (si está habilitado)
        if (this.soundEnabled) {
            this.playSound('feed');
        }
    }
    
    // Efecto de paseo
    walkEffect(petElement) {
        // Animación de movimiento
        petElement.style.animation = 'bounce 0.6s ease-out';
        setTimeout(() => {
            petElement.style.animation = '';
        }, 600);
        
        // Partículas de felicidad
        const rect = petElement.getBoundingClientRect();
        this.createParticles(rect.left + rect.width / 2, rect.top + rect.height / 2, 12, '#06b6d4');
    }
    
    // Efecto de curación
    cureEffect(petElement) {
        // Efecto de brillo curativo
        petElement.style.filter = 'brightness(1.5)';
        petElement.style.boxShadow = '0 0 30px var(--success-color)';
        
        setTimeout(() => {
            petElement.style.filter = '';
            petElement.style.boxShadow = '';
        }, 1000);
        
        // Partículas de curación
        const rect = petElement.getBoundingClientRect();
        this.createParticles(rect.left + rect.width / 2, rect.top + rect.height / 2, 20, '#fbbf24');
    }
    
    // Efecto de cambio de personalidad
    personalityEffect(petElement, personality) {
        // Efecto de transformación
        petElement.style.transform = 'rotateY(180deg)';
        
        setTimeout(() => {
            petElement.style.transform = 'rotateY(0deg)';
        }, 500);
        
        // Partículas de personalidad
        const rect = petElement.getBoundingClientRect();
        this.createParticles(rect.left + rect.width / 2, rect.top + rect.height / 2, 10, '#8b5cf6');
    }
    
    // Efecto de estadísticas bajas
    lowStatsEffect(petElement) {
        petElement.classList.add('pet-sick');
        
        // Efecto de pulso de advertencia
        petElement.style.animation = 'pulse 2s ease-in-out infinite';
    }
    
    // Efecto de estadísticas altas
    highStatsEffect(petElement) {
        petElement.classList.remove('pet-sick');
        petElement.classList.add('pet-happy');
        petElement.style.animation = 'bounce 1s ease-in-out infinite';
    }
    
    // Efecto de nivel subido
    levelUpEffect() {
        // Crear confeti
        for (let i = 0; i < 50; i++) {
            setTimeout(() => {
                this.createParticles(
                    Math.random() * window.innerWidth,
                    Math.random() * window.innerHeight,
                    1,
                    ['#fbbf24', '#10b981', '#06b6d4', '#8b5cf6'][Math.floor(Math.random() * 4)]
                );
            }, i * 50);
        }
        
        // Mostrar notificación de nivel
        this.showLevelUpNotification();
    }
    
    // Mostrar notificación de subida de nivel
    showLevelUpNotification() {
        const notification = document.createElement('div');
        notification.className = 'level-up-notification fade-in';
        notification.innerHTML = `
            <div class="level-up-icon">⭐</div>
            <div class="level-up-content">
                <h3>¡Nivel Subido!</h3>
                <p>Tu mascota ha crecido más fuerte</p>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 4000);
    }
    
    // Efecto de notificación mejorada
    enhancedNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `enhanced-notification ${type} slide-in`;
        notification.innerHTML = `
            <div class="notification-icon">${this.getNotificationIcon(type)}</div>
            <div class="notification-message">${message}</div>
            <button class="notification-close">&times;</button>
        `;
        
        document.body.appendChild(notification);
        
        // Auto-remover después de 5 segundos
        setTimeout(() => {
            notification.classList.add('fade-out');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 5000);
        
        // Botón de cerrar
        notification.querySelector('.notification-close').addEventListener('click', () => {
            notification.classList.add('fade-out');
            setTimeout(() => {
                notification.remove();
            }, 300);
        });
    }
    
    // Obtener icono de notificación
    getNotificationIcon(type) {
        const icons = {
            success: '✅',
            error: '❌',
            warning: '⚠️',
            info: 'ℹ️'
        };
        return icons[type] || icons.info;
    }
    
    // Efecto de carga mejorado
    showLoadingEffect(element) {
        element.style.position = 'relative';
        element.style.overflow = 'hidden';
        
        const loader = document.createElement('div');
        loader.className = 'loading-effect';
        loader.innerHTML = `
            <div class="loading-spinner"></div>
            <div class="loading-text">Cargando...</div>
        `;
        
        element.appendChild(loader);
        
        return () => {
            loader.remove();
        };
    }
    
    // Efecto de hover mejorado
    addHoverEffect(element) {
        element.addEventListener('mouseenter', () => {
            element.style.transform = 'translateY(-5px) scale(1.02)';
            element.style.boxShadow = '0 10px 25px rgba(0,0,0,0.3)';
        });
        
        element.addEventListener('mouseleave', () => {
            element.style.transform = '';
            element.style.boxShadow = '';
        });
    }
    
    // Efecto de click
    addClickEffect(element) {
        element.addEventListener('click', () => {
            element.style.transform = 'scale(0.95)';
            setTimeout(() => {
                element.style.transform = '';
            }, 150);
        });
    }
    
    // Inicializar efectos
    init() {
        try {
            // Verificar si estamos en la pantalla de juego
            const gameScreen = document.getElementById('game-screen');
            if (!gameScreen || gameScreen.classList.contains('hidden')) {
                console.warn('⚠️ Pantalla de juego no visible, posponiendo efectos visuales');
                return; // No inicializar efectos si no estamos en la pantalla de juego
            }
            
            // Agregar efectos a elementos existentes
            const cards = document.querySelectorAll('.card');
            const actionBtns = document.querySelectorAll('.action-btn');
            
            // Verificar que los elementos existen antes de agregar efectos
            if (cards && cards.length > 0) {
                cards.forEach(card => {
                    if (card && typeof card.addEventListener === 'function') {
                        this.addHoverEffect(card);
                    }
                });
            }
            
            if (actionBtns && actionBtns.length > 0) {
                actionBtns.forEach(btn => {
                    if (btn && typeof btn.addEventListener === 'function') {
                        this.addClickEffect(btn);
                    }
                });
            }
            
            // Configurar tema automático basado en hora
            const hour = new Date().getHours();
            if (hour >= 6 && hour < 18) {
                this.toggleTheme(); // Cambiar a tema día
            }
            
            // Configurar estación automática
            const month = new Date().getMonth();
            if (month >= 2 && month <= 4) this.changeSeason('spring');
            else if (month >= 5 && month <= 7) this.changeSeason('summer');
            else if (month >= 8 && month <= 10) this.changeSeason('autumn');
            else this.changeSeason('winter');
            
            ConfigUtils.log('info', 'Efectos visuales inicializados');
        } catch (error) {
            console.warn('⚠️ Error al inicializar efectos visuales:', error);
        }
    }
}

// Instancia global
const effectsManager = new EffectsManager();

// Exportar para uso en otros módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { EffectsManager, effectsManager };
} 