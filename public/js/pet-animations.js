// Sistema de Animaciones Realistas para Mascotas - PetVenture
class PetAnimationManager {
    constructor() {
        this.currentPet = null;
        this.animationState = 'idle';
        this.animationInterval = null;
        this.breathingInterval = null;
        this.movementInterval = null;
        this.interactionCooldown = false;
        
        // APIs para recursos
        this.imageAPIs = {
            unsplash: 'https://source.unsplash.com',
            pixabay: 'https://pixabay.com/api',
            giphy: 'https://api.giphy.com/v1/gifs'
        };
        
        // Configuración de animaciones
        this.animations = {
            idle: { duration: 3000, intensity: 'low' },
            happy: { duration: 2000, intensity: 'high' },
            eating: { duration: 4000, intensity: 'medium' },
            playing: { duration: 5000, intensity: 'high' },
            sleeping: { duration: 8000, intensity: 'minimal' },
            sick: { duration: 1500, intensity: 'low' },
            walking: { duration: 3000, intensity: 'medium' },
            excited: { duration: 1500, intensity: 'very-high' }
        };
        
        // Sonidos por acción (URLs de ejemplo - puedes usar APIs como Freesound)
        this.sounds = {
            eat: '/sounds/eating.mp3',
            play: '/sounds/playful.mp3',
            happy: '/sounds/happy.mp3',
            sick: '/sounds/sick.mp3',
            sleep: '/sounds/sleeping.mp3'
        };
        
        this.init();
    }
    
    init() {
        ConfigUtils.log('info', 'Inicializando sistema de animaciones de mascotas');
        this.setupKeyboardControls();
        this.setupMouseControls();
    }
    
    // Configurar controles de teclado
    setupKeyboardControls() {
        document.addEventListener('keydown', (e) => {
            if (!this.currentPet || this.interactionCooldown) return;
            
            switch(e.key.toLowerCase()) {
                case 'f': // Feed
                    this.triggerAnimation('eating');
                    this.playSound('eat');
                    break;
                case 'p': // Play
                    this.triggerAnimation('playing');
                    this.playSound('play');
                    break;
                case 'w': // Walk
                    this.triggerAnimation('walking');
                    break;
                case 'h': // Happy
                    this.triggerAnimation('happy');
                    this.playSound('happy');
                    break;
                case 's': // Sleep
                    this.triggerAnimation('sleeping');
                    this.playSound('sleep');
                    break;
                case ' ': // Space - Interact
                    e.preventDefault();
                    this.triggerRandomInteraction();
                    break;
            }
        });
    }
    
    // Configurar controles de mouse
    setupMouseControls() {
        document.addEventListener('click', (e) => {
            const petElement = e.target.closest('.pet-sprite, .pet-avatar');
            if (petElement && !this.interactionCooldown) {
                this.triggerClickInteraction(e.clientX, e.clientY);
            }
        });
        
        // Hover effects
        document.addEventListener('mouseover', (e) => {
            const petElement = e.target.closest('.pet-sprite, .pet-avatar');
            if (petElement) {
                this.triggerHoverEffect(petElement);
            }
        });
    }
    
    // Establecer mascota actual
    setPet(pet) {
        this.currentPet = pet;
        this.resetAnimations();
        this.startIdleAnimation();
        this.startBreathingAnimation();
        this.loadRealisticImage(pet);
    }
    
    // Cargar imagen realista desde APIs
    async loadRealisticImage(pet) {
        try {
            const petElement = document.querySelector('.pet-sprite, .pet-avatar');
            if (!petElement) return;
            
            // Determinar tipo de animal y obtener imagen
            const animalType = this.getPetAnimalType(pet.tipo);
            const imageUrl = await this.getRealisticPetImage(animalType);
            
            if (imageUrl) {
                petElement.style.backgroundImage = `url(${imageUrl})`;
                petElement.style.backgroundSize = 'cover';
                petElement.style.backgroundPosition = 'center';
                petElement.style.borderRadius = '50%';
                petElement.style.transition = 'all 0.3s ease';
            }
            
        } catch (error) {
            ConfigUtils.log('warn', 'No se pudo cargar imagen realista', error);
        }
    }
    
    // Obtener tipo de animal
    getPetAnimalType(tipo) {
        const typeMap = {
            'perro': 'dog',
            'gato': 'cat', 
            'conejo': 'rabbit',
            'hamster': 'hamster',
            'pajaro': 'bird',
            'pez': 'fish'
        };
        return typeMap[tipo.toLowerCase()] || 'pet';
    }
    
    // Obtener imagen realista de APIs
    async getRealisticPetImage(animalType) {
        try {
            // Usar Unsplash para imágenes de alta calidad
            const queries = {
                dog: 'cute-puppy-face',
                cat: 'cute-kitten-face', 
                rabbit: 'cute-rabbit',
                hamster: 'cute-hamster',
                bird: 'cute-bird',
                fish: 'cute-fish',
                pet: 'cute-animal'
            };
            
            const query = queries[animalType] || 'cute-pet';
            return `${this.imageAPIs.unsplash}/200x200/?${query}`;
            
        } catch (error) {
            ConfigUtils.log('warn', 'Error obteniendo imagen realista', error);
            return null;
        }
    }
    
    // Disparar animación específica
    triggerAnimation(type) {
        if (!this.currentPet || this.interactionCooldown) return;
        
        this.animationState = type;
        this.setCooldown(1000); // 1 segundo de cooldown
        
        const petElement = document.querySelector('.pet-sprite, .pet-avatar');
        if (!petElement) return;
        
        const animation = this.animations[type];
        if (!animation) return;
        
        // Aplicar clases de animación
        petElement.classList.remove(...Object.keys(this.animations).map(k => `pet-${k}`));
        petElement.classList.add(`pet-${type}`);
        
        // Efectos especiales según el tipo
        this.applySpecialEffects(type, petElement);
        
        // Restaurar a idle después de la animación
        setTimeout(() => {
            if (petElement) {
                petElement.classList.remove(`pet-${type}`);
                this.animationState = 'idle';
                this.startIdleAnimation();
            }
        }, animation.duration);
        
        ConfigUtils.log('info', `Animación ${type} activada para ${this.currentPet.nombre}`);
    }
    
    // Aplicar efectos especiales
    applySpecialEffects(type, petElement) {
        switch(type) {
            case 'eating':
                this.createParticleEffect('🍎', petElement);
                break;
            case 'playing':
                this.createParticleEffect('⚽', petElement);
                this.addScreenShake();
                break;
            case 'happy':
                this.createParticleEffect('❤️', petElement);
                this.addGlowEffect(petElement);
                break;
            case 'sleeping':
                this.createParticleEffect('💤', petElement);
                this.dimLighting();
                break;
            case 'sick':
                this.createParticleEffect('🤒', petElement);
                this.addSickFilter(petElement);
                break;
            case 'walking':
                this.addWalkingMotion(petElement);
                break;
            case 'excited':
                this.createConfettiEffect(petElement);
                this.addBounceEffect(petElement);
                break;
        }
    }
    
    // Crear efecto de partículas
    createParticleEffect(emoji, petElement) {
        const rect = petElement.getBoundingClientRect();
        const particle = document.createElement('div');
        
        particle.textContent = emoji;
        particle.style.cssText = `
            position: fixed;
            left: ${rect.left + rect.width/2}px;
            top: ${rect.top}px;
            font-size: 2rem;
            pointer-events: none;
            z-index: 1000;
            animation: particle-float 2s ease-out forwards;
        `;
        
        document.body.appendChild(particle);
        
        setTimeout(() => particle.remove(), 2000);
    }
    
    // Añadir efecto de brillo
    addGlowEffect(petElement) {
        petElement.style.boxShadow = '0 0 20px #ffd700, 0 0 40px #ffd700';
        petElement.style.animation = 'pet-glow 1s ease-in-out infinite alternate';
        
        setTimeout(() => {
            petElement.style.boxShadow = '';
            petElement.style.animation = '';
        }, 2000);
    }
    
    // Añadir vibración de pantalla
    addScreenShake() {
        document.body.style.animation = 'screen-shake 0.5s ease-in-out';
        setTimeout(() => {
            document.body.style.animation = '';
        }, 500);
    }
    
    // Añadir filtro de enfermedad
    addSickFilter(petElement) {
        petElement.style.filter = 'grayscale(50%) brightness(0.7)';
        petElement.style.animation = 'pet-sick-pulse 1s ease-in-out infinite';
        
        setTimeout(() => {
            petElement.style.filter = '';
            petElement.style.animation = '';
        }, 1500);
    }
    
    // Movimiento de caminar
    addWalkingMotion(petElement) {
        petElement.style.animation = 'pet-walk 0.3s ease-in-out infinite';
        
        setTimeout(() => {
            petElement.style.animation = '';
        }, 3000);
    }
    
    // Efecto de rebote
    addBounceEffect(petElement) {
        petElement.style.animation = 'pet-bounce 0.5s ease-in-out infinite';
        
        setTimeout(() => {
            petElement.style.animation = '';
        }, 1500);
    }
    
    // Crear efecto confetti
    createConfettiEffect(petElement) {
        const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'];
        const rect = petElement.getBoundingClientRect();
        
        for (let i = 0; i < 20; i++) {
            setTimeout(() => {
                const confetti = document.createElement('div');
                confetti.style.cssText = `
                    position: fixed;
                    left: ${rect.left + Math.random() * rect.width}px;
                    top: ${rect.top + Math.random() * rect.height}px;
                    width: 6px;
                    height: 6px;
                    background: ${colors[Math.floor(Math.random() * colors.length)]};
                    border-radius: 50%;
                    pointer-events: none;
                    z-index: 1000;
                    animation: confetti-fall 3s ease-out forwards;
                `;
                
                document.body.appendChild(confetti);
                setTimeout(() => confetti.remove(), 3000);
            }, i * 50);
        }
    }
    
    // Atenuar iluminación
    dimLighting() {
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 50, 0.3);
            pointer-events: none;
            z-index: 500;
            transition: opacity 1s ease;
        `;
        
        document.body.appendChild(overlay);
        
        setTimeout(() => {
            overlay.style.opacity = '0';
            setTimeout(() => overlay.remove(), 1000);
        }, 8000);
    }
    
    // Interacción al hacer clic
    triggerClickInteraction(x, y) {
        this.triggerAnimation('happy');
        this.createClickRipple(x, y);
        this.playSound('happy');
    }
    
    // Crear ondas de clic
    createClickRipple(x, y) {
        const ripple = document.createElement('div');
        ripple.style.cssText = `
            position: fixed;
            left: ${x - 25}px;
            top: ${y - 25}px;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            background: radial-gradient(circle, rgba(255,215,0,0.6) 0%, transparent 70%);
            pointer-events: none;
            z-index: 1000;
            animation: click-ripple 1s ease-out forwards;
        `;
        
        document.body.appendChild(ripple);
        setTimeout(() => ripple.remove(), 1000);
    }
    
    // Efecto hover
    triggerHoverEffect(petElement) {
        petElement.style.transform = 'scale(1.1)';
        petElement.style.transition = 'transform 0.3s ease';
        
        petElement.addEventListener('mouseleave', () => {
            petElement.style.transform = 'scale(1)';
        }, { once: true });
    }
    
    // Interacción aleatoria
    triggerRandomInteraction() {
        const interactions = ['happy', 'playing', 'excited'];
        const randomInteraction = interactions[Math.floor(Math.random() * interactions.length)];
        this.triggerAnimation(randomInteraction);
    }
    
    // Animación de respiración
    startBreathingAnimation() {
        this.breathingInterval = setInterval(() => {
            const petElement = document.querySelector('.pet-sprite, .pet-avatar');
            if (petElement && this.animationState === 'idle') {
                petElement.style.animation = 'pet-breathing 4s ease-in-out infinite';
            }
        }, 4000);
    }
    
    // Animación idle
    startIdleAnimation() {
        this.animationInterval = setInterval(() => {
            if (this.animationState === 'idle' && Math.random() < 0.3) {
                const idleActions = ['happy', 'excited'];
                const randomAction = idleActions[Math.floor(Math.random() * idleActions.length)];
                this.triggerAnimation(randomAction);
            }
        }, 15000); // Cada 15 segundos
    }
    
    // Reproducir sonido
    playSound(type) {
        try {
            const audio = new Audio(this.sounds[type]);
            audio.volume = 0.3;
            audio.play().catch(e => {
                ConfigUtils.log('warn', 'No se pudo reproducir sonido', e);
            });
        } catch (error) {
            ConfigUtils.log('warn', 'Error reproduciendo sonido', error);
        }
    }
    
    // Establecer cooldown
    setCooldown(duration) {
        this.interactionCooldown = true;
        setTimeout(() => {
            this.interactionCooldown = false;
        }, duration);
    }
    
    // Resetear animaciones
    resetAnimations() {
        if (this.animationInterval) {
            clearInterval(this.animationInterval);
        }
        if (this.breathingInterval) {
            clearInterval(this.breathingInterval);
        }
        if (this.movementInterval) {
            clearInterval(this.movementInterval);
        }
        
        this.animationState = 'idle';
    }
    
    // Actualizar según el estado de la mascota
    updateFromPetStats(pet) {
        if (!pet) return;
        
        this.currentPet = pet;
        
        // Animaciones automáticas basadas en stats
        if (pet.salud < 20) {
            this.triggerAnimation('sick');
        } else if (pet.felicidad > 80) {
            this.triggerAnimation('happy');
        } else if (pet.energia < 30) {
            this.triggerAnimation('sleeping');
        }
    }
    
    // Cleanup
    destroy() {
        this.resetAnimations();
        document.removeEventListener('keydown', this.setupKeyboardControls);
        document.removeEventListener('click', this.setupMouseControls);
    }
}

// Crear instancia global
const petAnimationManager = new PetAnimationManager();

// Agregar estilos CSS para animaciones
const animationStyles = `
<style>
@keyframes pet-breathing {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.05); }
}

@keyframes pet-happy {
    0%, 100% { transform: rotate(0deg) scale(1); }
    25% { transform: rotate(-5deg) scale(1.1); }
    75% { transform: rotate(5deg) scale(1.1); }
}

@keyframes pet-eating {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.2); }
}

@keyframes pet-playing {
    0%, 100% { transform: rotate(0deg); }
    25% { transform: rotate(-10deg); }
    75% { transform: rotate(10deg); }
}

@keyframes pet-sleeping {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.7; }
}

@keyframes pet-sick-pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(0.95); }
}

@keyframes pet-walk {
    0%, 100% { transform: translateX(0px); }
    25% { transform: translateX(-3px); }
    75% { transform: translateX(3px); }
}

@keyframes pet-bounce {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
}

@keyframes pet-glow {
    0% { box-shadow: 0 0 5px #ffd700; }
    100% { box-shadow: 0 0 25px #ffd700; }
}

@keyframes particle-float {
    0% { transform: translateY(0px); opacity: 1; }
    100% { transform: translateY(-50px); opacity: 0; }
}

@keyframes confetti-fall {
    0% { transform: translateY(0px) rotate(0deg); opacity: 1; }
    100% { transform: translateY(100px) rotate(360deg); opacity: 0; }
}

@keyframes click-ripple {
    0% { transform: scale(1); opacity: 0.6; }
    100% { transform: scale(4); opacity: 0; }
}

@keyframes screen-shake {
    0%, 100% { transform: translateX(0px); }
    25% { transform: translateX(-2px); }
    75% { transform: translateX(2px); }
}

.pet-sprite, .pet-avatar {
    cursor: pointer;
    user-select: none;
    transition: all 0.3s ease;
}

.pet-sprite:hover, .pet-avatar:hover {
    filter: brightness(1.1);
}
</style>
`;

// Inyectar estilos
document.head.insertAdjacentHTML('beforeend', animationStyles); 