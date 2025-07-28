// 🎨 Sistema de Mejoras Visuales Avanzadas para PetVenture
class EnhancedVisualsManager {
    constructor() {
        this.currentTheme = 'auto';
        this.currentSeason = this.getCurrentSeason();
        this.backgroundAnimations = [];
        this.petAnimations = [];
        this.weatherEffects = [];
        
        this.init();
    }
    
    init() {
        // DESACTIVADO - causaba división visual molesta
        ConfigUtils.log('info', 'EnhancedVisualsManager DESACTIVADO');
        return;
        
        this.setupThemeSystem();
        this.setupBackgroundEffects();
        this.setupPetVisualEnhancements();
        this.setupWeatherEffects();
        this.startAnimationLoop();
        
        ConfigUtils.log('info', 'EnhancedVisualsManager inicializado');
    }
    
    // 🌟 SISTEMA DE TEMAS DINÁMICOS
    setupThemeSystem() {
        // Detectar tema automático basado en la hora
        this.updateThemeBasedOnTime();
        
        // Actualizar tema cada minuto
        setInterval(() => {
            this.updateThemeBasedOnTime();
        }, 60000);
        
        // Aplicar estación actual
        this.applySeasonalTheme();
    }
    
    updateThemeBasedOnTime() {
        const hour = new Date().getHours();
        const isDayTime = hour >= 6 && hour < 18;
        const newTheme = isDayTime ? 'day' : 'night';
        
        if (this.currentTheme !== newTheme) {
            this.currentTheme = newTheme;
            this.applyTheme(newTheme);
        }
    }
    
    getCurrentSeason() {
        const month = new Date().getMonth();
        if (month >= 2 && month <= 4) return 'spring';
        if (month >= 5 && month <= 7) return 'summer';
        if (month >= 8 && month <= 10) return 'autumn';
        return 'winter';
    }
    
    applyTheme(theme) {
        const root = document.documentElement;
        
        if (theme === 'day') {
            root.style.setProperty('--bg-gradient-start', '#87CEEB');
            root.style.setProperty('--bg-gradient-end', '#98D8E8');
            root.style.setProperty('--ambient-light', 'rgba(255, 255, 255, 0.1)');
        } else {
            root.style.setProperty('--bg-gradient-start', '#0F172A');
            root.style.setProperty('--bg-gradient-end', '#1E293B');
            root.style.setProperty('--ambient-light', 'rgba(30, 41, 59, 0.3)');
        }
        
        // Crear efectos de transición
        this.createThemeTransitionEffect();
    }
    
    applySeasonalTheme() {
        const root = document.documentElement;
        
        switch (this.currentSeason) {
            case 'spring':
                root.style.setProperty('--seasonal-color-1', '#FFB6C1');
                root.style.setProperty('--seasonal-color-2', '#DDA0DD');
                this.addSeasonalElements('🌸', '🌺', '🦋');
                break;
            case 'summer':
                root.style.setProperty('--seasonal-color-1', '#87CEEB');
                root.style.setProperty('--seasonal-color-2', '#98D8E8');
                this.addSeasonalElements('☀️', '🌞', '🏖️');
                break;
            case 'autumn':
                root.style.setProperty('--seasonal-color-1', '#FF8C00');
                root.style.setProperty('--seasonal-color-2', '#DC143C');
                this.addSeasonalElements('🍂', '🍁', '🎃');
                break;
            case 'winter':
                root.style.setProperty('--seasonal-color-1', '#87CEEB');
                root.style.setProperty('--seasonal-color-2', '#00CED1');
                this.addSeasonalElements('❄️', '⛄', '🏔️');
                break;
        }
    }
    
    addSeasonalElements(icon1, icon2, icon3) {
        const gameScreen = document.getElementById('game-screen');
        if (!gameScreen) return;
        
        // Limpiar elementos anteriores
        gameScreen.querySelectorAll('.seasonal-element').forEach(el => el.remove());
        
        // Solo agregar elementos estacionales discretos en esquinas
        const icons = [icon1, icon2, icon3];
        for (let i = 0; i < 2; i++) { // Solo 2 elementos en lugar de 5
            const element = document.createElement('div');
            element.className = 'seasonal-element';
            element.textContent = icons[Math.floor(Math.random() * icons.length)];
            element.style.cssText = `
                position: absolute;
                font-size: 1.2rem;
                opacity: 0.1;
                pointer-events: none;
                z-index: 1;
                left: ${i === 0 ? '5%' : '90%'};
                top: ${i === 0 ? '5%' : '90%'};
                animation: seasonalFloat ${3 + Math.random() * 4}s ease-in-out infinite;
                animation-delay: ${Math.random() * 2}s;
            `;
            gameScreen.appendChild(element);
        }
    }
    
    createThemeTransitionEffect() {
        // Crear efecto de partículas para transición de tema
        if (typeof effectsManager !== 'undefined') {
            effectsManager.createParticles(document.body, 'theme-transition', 50);
        }
    }
    
    // 🎭 FONDOS DINÁMICOS Y ANIMADOS
    setupBackgroundEffects() {
        this.createAnimatedBackground();
        this.setupParallaxEffects();
    }
    
    createAnimatedBackground() {
        const gameScreen = document.getElementById('game-screen');
        if (!gameScreen) return;
        
        // Crear múltiples capas de fondo animado
        const backgroundLayers = [
            { class: 'bg-layer-1', speed: 0.5, opacity: 0.1 },
            { class: 'bg-layer-2', speed: 0.3, opacity: 0.15 },
            { class: 'bg-layer-3', speed: 0.2, opacity: 0.1 }
        ];
        
        backgroundLayers.forEach(layer => {
            const bgElement = document.createElement('div');
            bgElement.className = `animated-background ${layer.class}`;
            bgElement.style.cssText = `
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                opacity: ${layer.opacity};
                pointer-events: none;
                z-index: 0;
                background: linear-gradient(45deg, var(--seasonal-color-1), var(--seasonal-color-2));
                animation: backgroundFlow ${20 / layer.speed}s linear infinite;
            `;
            gameScreen.appendChild(bgElement);
        });
    }
    
    setupParallaxEffects() {
        // Efecto parallax en elementos del juego
        document.addEventListener('mousemove', (e) => {
            const mouseX = e.clientX / window.innerWidth;
            const mouseY = e.clientY / window.innerHeight;
            
            // Aplicar efecto parallax a elementos específicos
            const parallaxElements = document.querySelectorAll('.pet-card, .action-btn');
            parallaxElements.forEach((element, index) => {
                const intensity = (index + 1) * 2;
                const moveX = (mouseX - 0.5) * intensity;
                const moveY = (mouseY - 0.5) * intensity;
                
                element.style.transform = `translate(${moveX}px, ${moveY}px)`;
            });
        });
    }
    
    // 🐾 MEJORAS VISUALES DE MASCOTAS
    setupPetVisualEnhancements() {
        this.enhancePetAnimations();
        this.setupPetInteractions();
        this.addPetEmotions();
    }
    
    enhancePetAnimations() {
        // Mejorar las animaciones de las mascotas
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === 1 && node.classList?.contains('pet-display')) {
                            this.addAdvancedPetAnimations(node);
                        }
                    });
                }
            });
        });
        
        observer.observe(document.body, { childList: true, subtree: true });
    }
    
    addAdvancedPetAnimations(petElement) {
        // Animación de respiración
        petElement.style.animation = 'petBreathing 3s ease-in-out infinite';
        
        // Animación de parpadeo ocasional
        setInterval(() => {
            if (Math.random() < 0.1) { // 10% probabilidad cada segundo
                this.makePetBlink(petElement);
            }
        }, 1000);
        
        // Movimientos aleatorios sutiles
        setInterval(() => {
            if (Math.random() < 0.15) { // 15% probabilidad cada 2 segundos
                this.addRandomPetMovement(petElement);
            }
        }, 2000);
    }
    
    makePetBlink(petElement) {
        const petIcon = petElement.querySelector('.pet-icon');
        if (petIcon) {
            petIcon.style.animation = 'petBlink 0.3s ease';
            setTimeout(() => {
                petIcon.style.animation = '';
            }, 300);
        }
    }
    
    addRandomPetMovement(petElement) {
        const movements = ['petTiltLeft', 'petTiltRight', 'petNod', 'petWiggle'];
        const randomMovement = movements[Math.floor(Math.random() * movements.length)];
        
        petElement.style.animation = `${randomMovement} 1s ease-in-out`;
        setTimeout(() => {
            petElement.style.animation = 'petBreathing 3s ease-in-out infinite';
        }, 1000);
    }
    
    setupPetInteractions() {
        // Interacciones avanzadas con las mascotas
        document.addEventListener('click', (e) => {
            const petElement = e.target.closest('.pet-display');
            if (petElement) {
                this.triggerPetInteraction(petElement, e);
            }
        });
    }
    
    triggerPetInteraction(petElement, event) {
        // Efecto de click en la mascota
        const clickEffect = document.createElement('div');
        clickEffect.className = 'pet-click-effect';
        clickEffect.style.cssText = `
            position: absolute;
            left: ${event.offsetX}px;
            top: ${event.offsetY}px;
            width: 20px;
            height: 20px;
            border-radius: 50%;
            background: radial-gradient(circle, var(--accent-color), transparent);
            pointer-events: none;
            animation: petClickRipple 0.6s ease-out forwards;
        `;
        
        petElement.style.position = 'relative';
        petElement.appendChild(clickEffect);
        
        // Reacción de la mascota
        this.triggerPetReaction(petElement);
        
        // Limpiar efecto
        setTimeout(() => {
            if (clickEffect.parentNode) {
                clickEffect.remove();
            }
        }, 600);
    }
    
    triggerPetReaction(petElement) {
        const reactions = [
            () => petElement.style.animation = 'petHappy 1s ease-in-out',
            () => petElement.style.animation = 'petExcited 0.8s ease-in-out',
            () => this.showPetEmotion(petElement, '❤️'),
            () => this.showPetEmotion(petElement, '😊'),
            () => this.createHeartParticles(petElement)
        ];
        
        const randomReaction = reactions[Math.floor(Math.random() * reactions.length)];
        randomReaction();
        
        // Volver a animación normal
        setTimeout(() => {
            petElement.style.animation = 'petBreathing 3s ease-in-out infinite';
        }, 1000);
    }
    
    addPetEmotions() {
        // Sistema de emociones basado en estadísticas
        setInterval(() => {
            const currentPet = petManager?.getCurrentPet();
            if (currentPet) {
                this.updatePetEmotionalState(currentPet);
            }
        }, 5000);
    }
    
    updatePetEmotionalState(pet) {
        const petElement = document.querySelector('.pet-display');
        if (!petElement) return;
        
        // Determinar estado emocional
        const avgStats = (pet.salud + pet.energia + pet.felicidad) / 3;
        
        let emotionalState = 'neutral';
        if (avgStats >= 80) emotionalState = 'very-happy';
        else if (avgStats >= 60) emotionalState = 'happy';
        else if (avgStats >= 40) emotionalState = 'neutral';
        else if (avgStats >= 20) emotionalState = 'sad';
        else emotionalState = 'very-sad';
        
        this.applyEmotionalVisuals(petElement, emotionalState);
    }
    
    applyEmotionalVisuals(petElement, state) {
        // Limpiar estados anteriores
        petElement.classList.remove('very-happy', 'happy', 'neutral', 'sad', 'very-sad');
        petElement.classList.add(state);
        
        // Efectos específicos por estado
        switch (state) {
            case 'very-happy':
                this.createJoyParticles(petElement);
                break;
            case 'happy':
                this.showPetEmotion(petElement, '😊');
                break;
            case 'sad':
                this.showPetEmotion(petElement, '😢');
                break;
            case 'very-sad':
                this.applyDepressedEffect(petElement);
                break;
        }
    }
    
    showPetEmotion(petElement, emotion) {
        const emotionElement = document.createElement('div');
        emotionElement.className = 'pet-emotion';
        emotionElement.textContent = emotion;
        emotionElement.style.cssText = `
            position: absolute;
            top: -20px;
            right: -10px;
            font-size: 1.5rem;
            animation: emotionFloat 2s ease-out forwards;
            pointer-events: none;
            z-index: 10;
        `;
        
        petElement.style.position = 'relative';
        petElement.appendChild(emotionElement);
        
        setTimeout(() => {
            if (emotionElement.parentNode) {
                emotionElement.remove();
            }
        }, 2000);
    }
    
    createHeartParticles(petElement) {
        for (let i = 0; i < 5; i++) {
            const heart = document.createElement('div');
            heart.className = 'heart-particle';
            heart.textContent = '💖';
            heart.style.cssText = `
                position: absolute;
                font-size: 1rem;
                animation: heartFloat ${1 + Math.random()}s ease-out forwards;
                animation-delay: ${i * 0.1}s;
                left: ${Math.random() * 100}%;
                top: 100%;
                pointer-events: none;
                z-index: 10;
            `;
            
            petElement.style.position = 'relative';
            petElement.appendChild(heart);
            
            setTimeout(() => {
                if (heart.parentNode) {
                    heart.remove();
                }
            }, 1500);
        }
    }
    
    createJoyParticles(petElement) {
        const joyEmojis = ['✨', '⭐', '🌟', '💫'];
        
        for (let i = 0; i < 8; i++) {
            const particle = document.createElement('div');
            particle.className = 'joy-particle';
            particle.textContent = joyEmojis[Math.floor(Math.random() * joyEmojis.length)];
            particle.style.cssText = `
                position: absolute;
                font-size: 1.2rem;
                animation: joyParticleFloat ${1.5 + Math.random()}s ease-out forwards;
                animation-delay: ${i * 0.05}s;
                left: ${20 + Math.random() * 60}%;
                top: ${20 + Math.random() * 60}%;
                pointer-events: none;
                z-index: 10;
            `;
            
            petElement.style.position = 'relative';
            petElement.appendChild(particle);
            
            setTimeout(() => {
                if (particle.parentNode) {
                    particle.remove();
                }
            }, 2000);
        }
    }
    
    applyDepressedEffect(petElement) {
        // Efecto visual de tristeza
        petElement.style.filter = 'grayscale(30%) brightness(0.8)';
        petElement.style.animation = 'petSad 2s ease-in-out infinite';
        
        setTimeout(() => {
            petElement.style.filter = '';
            petElement.style.animation = 'petBreathing 3s ease-in-out infinite';
        }, 3000);
    }
    
    // 🌦️ EFECTOS CLIMÁTICOS
    setupWeatherEffects() {
        // Efectos climáticos aleatorios
        setInterval(() => {
            if (Math.random() < 0.1) { // 10% probabilidad cada 30 segundos
                this.triggerRandomWeatherEffect();
            }
        }, 30000);
    }
    
    triggerRandomWeatherEffect() {
        const effects = ['rain', 'snow', 'leaves', 'sparkles'];
        const randomEffect = effects[Math.floor(Math.random() * effects.length)];
        this.createWeatherEffect(randomEffect);
    }
    
    createWeatherEffect(type) {
        const gameScreen = document.getElementById('game-screen');
        if (!gameScreen) return;
        
        // Crear contenedor de efectos climáticos
        const weatherContainer = document.createElement('div');
        weatherContainer.className = `weather-effect weather-${type}`;
        weatherContainer.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 5;
            overflow: hidden;
        `;
        
        gameScreen.appendChild(weatherContainer);
        
        // Crear partículas según el tipo
        this.generateWeatherParticles(weatherContainer, type);
        
        // Remover efecto después de un tiempo
        setTimeout(() => {
            if (weatherContainer.parentNode) {
                weatherContainer.remove();
            }
        }, 10000);
    }
    
    generateWeatherParticles(container, type) {
        const particleCount = type === 'rain' ? 50 : 30;
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = `weather-particle ${type}-particle`;
            
            let particleContent = '';
            let animationDuration = '';
            
            switch (type) {
                case 'rain':
                    particleContent = '💧';
                    animationDuration = `${0.5 + Math.random() * 0.5}s`;
                    break;
                case 'snow':
                    particleContent = '❄️';
                    animationDuration = `${2 + Math.random() * 2}s`;
                    break;
                case 'leaves':
                    particleContent = Math.random() < 0.5 ? '🍂' : '🍃';
                    animationDuration = `${1 + Math.random()}s`;
                    break;
                case 'sparkles':
                    particleContent = Math.random() < 0.5 ? '✨' : '⭐';
                    animationDuration = `${1.5 + Math.random()}s`;
                    break;
            }
            
            particle.textContent = particleContent;
            particle.style.cssText = `
                position: absolute;
                left: ${Math.random() * 100}%;
                top: -10%;
                font-size: ${0.8 + Math.random() * 0.7}rem;
                animation: weather${type.charAt(0).toUpperCase() + type.slice(1)}Fall ${animationDuration} linear infinite;
                animation-delay: ${Math.random() * 2}s;
                opacity: ${0.6 + Math.random() * 0.4};
            `;
            
            container.appendChild(particle);
        }
    }
    
    // 🎬 BUCLE DE ANIMACIÓN
    startAnimationLoop() {
        const animate = () => {
            this.updateAnimations();
            requestAnimationFrame(animate);
        };
        animate();
    }
    
    updateAnimations() {
        // Actualizar animaciones de fondo
        this.updateBackgroundAnimations();
        
        // Actualizar efectos de tiempo
        this.updateTimeBasedEffects();
    }
    
    updateBackgroundAnimations() {
        // Actualizar colores de fondo basado en la hora
        const time = new Date();
        const hour = time.getHours();
        const minute = time.getMinutes();
        
        // Calcular intensidad de luz basada en la hora
        const dayProgress = (hour * 60 + minute) / (24 * 60);
        const lightIntensity = Math.sin(dayProgress * Math.PI * 2) * 0.5 + 0.5;
        
        document.documentElement.style.setProperty('--light-intensity', lightIntensity);
    }
    
    updateTimeBasedEffects() {
        // Efectos especiales en momentos específicos del día
        const hour = new Date().getHours();
        
        if (hour === 12 && Math.random() < 0.001) { // Mediodía
            this.createSpecialEffect('sunshine');
        } else if (hour === 0 && Math.random() < 0.001) { // Medianoche
            this.createSpecialEffect('starfall');
        }
    }
    
    createSpecialEffect(type) {
        if (type === 'sunshine') {
            this.createWeatherEffect('sparkles');
            uiManager.showInfo('🌞 ¡Radiante mediodía! Tu mascota se siente especialmente feliz');
        } else if (type === 'starfall') {
            this.createWeatherEffect('sparkles');
            uiManager.showInfo('🌟 ¡Lluvia de estrellas! Momento mágico para tu mascota');
        }
    }
    
    // Métodos de utilidad
    cleanup() {
        // Limpiar animaciones y efectos
        this.backgroundAnimations.forEach(animation => {
            if (animation.cancel) animation.cancel();
        });
        
        this.petAnimations.forEach(animation => {
            if (animation.cancel) animation.cancel();
        });
        
        this.weatherEffects.forEach(effect => {
            if (effect.parentNode) effect.parentNode.removeChild(effect);
        });
        
        ConfigUtils.log('info', 'EnhancedVisualsManager limpiado');
    }
}

// Instancia global
const enhancedVisualsManager = new EnhancedVisualsManager(); 