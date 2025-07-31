// Efectos visuales para PetVenture
// Este archivo contiene animaciones y efectos visuales para mejorar la experiencia

console.log('🎨 Cargando efectos visuales...');

// Objeto para gestionar los efectos visuales
const effectsManager = {
    // Inicializar todos los efectos
    initialize: function() {
        this.setupLoadingEffects();
        this.setupParticles();
    },
    
    // Alias para compatibilidad con código existente
    init: function() {
        this.initialize();
    },
    
    // Efectos para la pantalla de carga
    setupLoadingEffects: function() {
        // Verificar si estamos en la pantalla de carga
        const loadingScreen = document.getElementById('loading-screen');
        if (!loadingScreen) return;
        
        // Añadir partículas adicionales dinámicamente
        const particlesContainer = document.querySelector('.loading-particles');
        if (particlesContainer) {
            for (let i = 0; i < 10; i++) {
            const particle = document.createElement('div');
                particle.className = 'particle dynamic-particle';
            
            // Posición aleatoria
                const top = Math.random() * 100;
                const left = Math.random() * 100;
                
                // Tamaño aleatorio
                const size = 2 + Math.random() * 6;
                
                // Velocidad aleatoria
                const duration = 5 + Math.random() * 10;
                const delay = Math.random() * 5;
                
                // Aplicar estilos
                particle.style.cssText = `
                    top: ${top}%;
                    left: ${left}%;
                    width: ${size}px;
                    height: ${size}px;
                    opacity: ${Math.random() * 0.7 + 0.3};
                    animation: floatParticle ${duration}s infinite linear ${delay}s;
                `;
                
                particlesContainer.appendChild(particle);
            }
        }
    },
    
    // Configurar partículas y efectos visuales
    setupParticles: function() {
        // Crear partículas para efectos especiales
        const createParticleEffect = (x, y, count = 10) => {
            const colors = ['#ffffff', '#e0e7ff', '#a5b4fc', '#6366f1'];
            
            for (let i = 0; i < count; i++) {
                const particle = document.createElement('div');
                particle.className = 'effect-particle';
                
                // Estilos de la partícula
                particle.style.cssText = `
                    position: absolute;
                    width: ${2 + Math.random() * 4}px;
                    height: ${2 + Math.random() * 4}px;
                    background: ${colors[Math.floor(Math.random() * colors.length)]};
                    border-radius: 50%;
                    top: ${y}px;
                    left: ${x}px;
                    pointer-events: none;
                    z-index: 10000;
                    opacity: ${0.7 + Math.random() * 0.3};
                    transform: translate(-50%, -50%);
                `;
                
                // Añadir al body
                document.body.appendChild(particle);
                
                // Animación
                const angle = Math.random() * Math.PI * 2;
                const velocity = 1 + Math.random() * 3;
                const tx = Math.cos(angle) * 100 * Math.random();
                const ty = Math.sin(angle) * 100 * Math.random();
                
                // Aplicar animación
                particle.animate([
                    { transform: 'translate(-50%, -50%) scale(1)', opacity: 0.8 },
                    { transform: `translate(calc(-50% + ${tx}px), calc(-50% + ${ty}px)) scale(0)`, opacity: 0 }
                ], {
                    duration: 1000 + Math.random() * 1000,
                    easing: 'cubic-bezier(0.1, 0.8, 0.2, 1)'
                }).onfinish = () => {
                    if (particle.parentNode) {
                        particle.parentNode.removeChild(particle);
                    }
                };
            }
        };
        
        // Añadir efecto de partículas al hacer clic
        document.addEventListener('click', function(event) {
            // Solo crear partículas si estamos en la pantalla de carga o en el juego
            if (!document.getElementById('loading-screen').classList.contains('hidden') || 
                !document.getElementById('game-screen').classList.contains('hidden')) {
                createParticleEffect(event.clientX, event.clientY, 15);
            }
        });
    },
    
    // Método para notificaciones mejoradas (compatibilidad con código existente)
    enhancedNotification: function(message, type = 'info') {
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
    },
    
    // Obtener icono de notificación
    getNotificationIcon: function(type) {
        const icons = {
            success: '✅',
            error: '❌',
            warning: '⚠️',
            info: 'ℹ️'
        };
        return icons[type] || icons.info;
    },
    
    // Métodos adicionales para compatibilidad
    createParticles: function(x, y, count = 10, color = '#ffffff') {
        const colors = [color];
        this.createParticleEffect(x, y, count, colors);
    },
    
    createParticleEffect: function(x, y, count = 10, colors = ['#ffffff', '#e0e7ff', '#a5b4fc', '#6366f1']) {
        for (let i = 0; i < count; i++) {
            const particle = document.createElement('div');
            particle.className = 'effect-particle';
            
            // Estilos de la partícula
            particle.style.cssText = `
                position: absolute;
                width: ${2 + Math.random() * 4}px;
                height: ${2 + Math.random() * 4}px;
                background: ${colors[Math.floor(Math.random() * colors.length)]};
                border-radius: 50%;
                top: ${y}px;
                left: ${x}px;
                pointer-events: none;
                z-index: 10000;
                opacity: ${0.7 + Math.random() * 0.3};
                transform: translate(-50%, -50%);
            `;
            
            // Añadir al body
            document.body.appendChild(particle);
            
            // Animación
            const angle = Math.random() * Math.PI * 2;
            const velocity = 1 + Math.random() * 3;
            const tx = Math.cos(angle) * 100 * Math.random();
            const ty = Math.sin(angle) * 100 * Math.random();
            
            // Aplicar animación
            particle.animate([
                { transform: 'translate(-50%, -50%) scale(1)', opacity: 0.8 },
                { transform: `translate(calc(-50% + ${tx}px), calc(-50% + ${ty}px)) scale(0)`, opacity: 0 }
            ], {
                duration: 1000 + Math.random() * 1000,
                easing: 'cubic-bezier(0.1, 0.8, 0.2, 1)'
            }).onfinish = () => {
                if (particle.parentNode) {
                    particle.parentNode.removeChild(particle);
                }
            };
        }
    },
    
    // Otros métodos requeridos por la aplicación
    addGlowEffect: function(element, type) {
        element.classList.add('high');
        setTimeout(() => { element.classList.remove('high'); }, 2000);
    },
    
    addSuccessEffect: function(button) {
        button.style.transform = 'scale(1.1)';
        button.style.boxShadow = '0 0 20px var(--success-color)';
        setTimeout(() => {
            button.style.transform = '';
            button.style.boxShadow = '';
        }, 300);
    },
    
    feedEffect: function(petElement) {
        const rect = petElement.getBoundingClientRect();
        this.createParticleEffect(rect.left + rect.width / 2, rect.top + rect.height / 2, 15, ['#10b981']);
        petElement.style.transform = 'scale(1.1)';
        setTimeout(() => { petElement.style.transform = 'scale(1)'; }, 300);
    },
    
    walkEffect: function(petElement) {
        petElement.style.animation = 'bounce 0.6s ease-out';
        setTimeout(() => { petElement.style.animation = ''; }, 600);
        const rect = petElement.getBoundingClientRect();
        this.createParticleEffect(rect.left + rect.width / 2, rect.top + rect.height / 2, 12, ['#06b6d4']);
    },
    
    cureEffect: function(petElement) {
        petElement.style.filter = 'brightness(1.5)';
        petElement.style.boxShadow = '0 0 30px var(--success-color)';
            setTimeout(() => {
            petElement.style.filter = '';
            petElement.style.boxShadow = '';
        }, 1000);
        const rect = petElement.getBoundingClientRect();
        this.createParticleEffect(rect.left + rect.width / 2, rect.top + rect.height / 2, 20, ['#fbbf24']);
    },
    
    personalityEffect: function(petElement, personality) {
        petElement.style.transform = 'rotateY(180deg)';
        setTimeout(() => { petElement.style.transform = 'rotateY(0deg)'; }, 500);
        const rect = petElement.getBoundingClientRect();
        this.createParticleEffect(rect.left + rect.width / 2, rect.top + rect.height / 2, 10, ['#8b5cf6']);
    },
    
    lowStatsEffect: function(petElement) {
        petElement.classList.add('pet-sick');
        petElement.style.animation = 'pulse 2s ease-in-out infinite';
    },
    
    highStatsEffect: function(petElement) {
        petElement.classList.remove('pet-sick');
        petElement.classList.add('pet-happy');
        petElement.style.animation = 'bounce 1s ease-in-out infinite';
    },
    
    levelUpEffect: function() {
        for (let i = 0; i < 50; i++) {
            setTimeout(() => {
                this.createParticleEffect(
                    Math.random() * window.innerWidth,
                    Math.random() * window.innerHeight,
                    1,
                    ['#fbbf24', '#10b981', '#06b6d4', '#8b5cf6']
                );
            }, i * 50);
        }
        this.showLevelUpNotification();
    },
    
    showLevelUpNotification: function() {
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
        
        setTimeout(() => { notification.remove(); }, 4000);
    }
};

// Inicializar efectos cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    effectsManager.initialize();
    console.log('✨ Efectos visuales inicializados');
});

// Exportar para uso en otros módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = effectsManager;
} 