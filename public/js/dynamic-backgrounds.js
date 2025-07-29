// 🌦️ Sistema de Fondos Climáticos Dinámicos
class DynamicWeatherBackgrounds {
    constructor() {
        this.currentWeather = 0;
        this.isTransitioning = false;
        this.weatherPatterns = [
            'sunrise', 'sunny', 'rainy', 'starry', 'snowy', 'rainbow', 'spring', 'autumn'
        ];
        this.transitionInterval = null;
        this.backgroundContainer = null;
        this.currentElements = [];
        
        this.init();
    }
    
    init() {
        this.createBackgroundContainer();
        this.startWeatherCycle();
        this.applyWeather(this.weatherPatterns[0]);
        
        console.log('Sistema de clima dinámico iniciado');
    }
    
    createBackgroundContainer() {
        const container = document.createElement('div');
        container.id = 'weather-backgrounds';
        container.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: -1;
            overflow: hidden;
            pointer-events: none;
            opacity: 0.45;
        `;
        
        document.body.insertBefore(container, document.body.firstChild);
        this.backgroundContainer = container;
    }
    
    startWeatherCycle() {
        // Cambiar clima cada 45 segundos
        this.transitionInterval = setInterval(() => {
            if (!this.isTransitioning) {
                this.nextWeather();
            }
        }, 45000);
    }
    
    nextWeather() {
        this.currentWeather = (this.currentWeather + 1) % this.weatherPatterns.length;
        this.applyWeather(this.weatherPatterns[this.currentWeather]);
    }
    
    applyWeather(weather) {
        if (this.isTransitioning) return;
        
        this.isTransitioning = true;
        
        // Fade out elementos actuales
        this.fadeOutCurrentElements();
        
        // Aplicar nuevo clima después de fade out
        setTimeout(() => {
            this.clearWeather();
            this.createWeatherEffects(weather);
            this.isTransitioning = false;
        }, 2000);
    }
    
    fadeOutCurrentElements() {
        this.currentElements.forEach(element => {
            if (element && element.parentNode) {
                element.style.transition = 'opacity 2s ease-out';
                element.style.opacity = '0';
            }
        });
    }
    
    clearWeather() {
        this.currentElements.forEach(element => {
            if (element && element.parentNode) {
                element.remove();
            }
        });
        this.currentElements = [];
    }
    
    createWeatherEffects(weather) {
        switch (weather) {
            case 'sunrise':
                this.createSunrise();
                break;
            case 'sunny':
                this.createSunnyDay();
                break;
            case 'rainy':
                this.createRainyWeather();
                break;
            case 'starry':
                this.createStarryNight();
                break;
            case 'snowy':
                this.createSnowyWeather();
                break;
            case 'rainbow':
                this.createRainbowWeather();
                break;
            case 'spring':
                this.createSpringWeather();
                break;
            case 'autumn':
                this.createAutumnWeather();
                break;
        }
    }
    
    createSunrise() {
        // Gradiente de amanecer
        const gradient = this.createElement('div', {
            position: 'absolute',
            top: '0',
            left: '0',
            width: '100%',
            height: '100%',
            background: 'linear-gradient(to bottom, #ff7e5f 0%, #feb47b 50%, #86a8e7 100%)',
            opacity: '0',
            transition: 'opacity 3s ease-in'
        });
        
        // Rayos de sol
        for (let i = 0; i < 5; i++) {
            const ray = this.createElement('div', {
                position: 'absolute',
                top: '20%',
                left: `${20 + i * 15}%`,
                width: '2px',
                height: '40%',
                background: 'linear-gradient(to bottom, rgba(255, 215, 0, 0.4), transparent)',
                transform: `rotate(${-20 + i * 10}deg)`,
                animation: 'sunRays 8s ease-in-out infinite',
                animationDelay: `${i * 0.5}s`
            });
            this.currentElements.push(ray);
        }
        
        // Nubes doradas
        this.createFloatingClouds('#ffd700', 0.3);
        
        setTimeout(() => gradient.style.opacity = '1', 100);
        this.currentElements.push(gradient);
    }
    
    createSunnyDay() {
        // Cielo azul
        const sky = this.createElement('div', {
            position: 'absolute',
            top: '0',
            left: '0',
            width: '100%',
            height: '100%',
            background: 'linear-gradient(to bottom, #87CEEB 0%, #98D8E8 100%)',
            opacity: '0',
            transition: 'opacity 3s ease-in'
        });
        
        // Sol brillante
        const sun = this.createElement('div', {
            position: 'absolute',
            top: '15%',
            right: '20%',
            width: '80px',
            height: '80px',
            background: 'radial-gradient(circle, #FFD700 30%, #FFA500 70%)',
            borderRadius: '50%',
            boxShadow: '0 0 30px rgba(255, 215, 0, 0.6)',
            animation: 'sunGlow 4s ease-in-out infinite'
        });
        
        // Nubes blancas
        this.createFloatingClouds('#ffffff', 0.8);
        
        setTimeout(() => sky.style.opacity = '1', 100);
        this.currentElements.push(sky, sun);
    }
    
    createRainyWeather() {
        // Cielo gris
        const sky = this.createElement('div', {
            position: 'absolute',
            top: '0',
            left: '0',
            width: '100%',
            height: '100%',
            background: 'linear-gradient(to bottom, #708090 0%, #2F4F4F 100%)',
            opacity: '0',
            transition: 'opacity 3s ease-in'
        });
        
        // Gotas de lluvia
        for (let i = 0; i < 50; i++) {
            const drop = this.createElement('div', {
                position: 'absolute',
                top: '-10px',
                left: `${Math.random() * 100}%`,
                width: '2px',
                height: '15px',
                background: 'linear-gradient(to bottom, rgba(173, 216, 230, 0.8), rgba(135, 206, 235, 0.6))',
                borderRadius: '50%',
                animation: `rainDrop ${2 + Math.random() * 2}s linear infinite`,
                animationDelay: `${Math.random() * 3}s`
            });
            this.currentElements.push(drop);
        }
        
        // Nubes oscuras
        this.createFloatingClouds('#696969', 0.7);
        
        setTimeout(() => sky.style.opacity = '1', 100);
        this.currentElements.push(sky);
    }
    
    createStarryNight() {
        // Cielo nocturno
        const sky = this.createElement('div', {
            position: 'absolute',
            top: '0',
            left: '0',
            width: '100%',
            height: '100%',
            background: 'linear-gradient(to bottom, #191970 0%, #000000 100%)',
            opacity: '0',
            transition: 'opacity 3s ease-in'
        });
        
        // Estrellas
        for (let i = 0; i < 100; i++) {
            const star = this.createElement('div', {
                position: 'absolute',
                top: `${Math.random() * 70}%`,
                left: `${Math.random() * 100}%`,
                width: '2px',
                height: '2px',
                background: '#FFFFFF',
                borderRadius: '50%',
                boxShadow: '0 0 4px #FFFFFF',
                animation: `starTwinkle ${2 + Math.random() * 3}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 2}s`
            });
            this.currentElements.push(star);
        }
        
        // Luna
        const moon = this.createElement('div', {
            position: 'absolute',
            top: '10%',
            right: '15%',
            width: '60px',
            height: '60px',
            background: 'radial-gradient(circle, #F5F5DC 30%, #E6E6FA 70%)',
            borderRadius: '50%',
            boxShadow: '0 0 20px rgba(245, 245, 220, 0.5)',
            animation: 'moonGlow 6s ease-in-out infinite'
        });
        
        setTimeout(() => sky.style.opacity = '1', 100);
        this.currentElements.push(sky, moon);
    }
    
    createSnowyWeather() {
        // Cielo invernal
        const sky = this.createElement('div', {
            position: 'absolute',
            top: '0',
            left: '0',
            width: '100%',
            height: '100%',
            background: 'linear-gradient(to bottom, #E6E6FA 0%, #B0C4DE 100%)',
            opacity: '0',
            transition: 'opacity 3s ease-in'
        });
        
        // Copos de nieve
        for (let i = 0; i < 60; i++) {
            const snowflake = this.createElement('div', {
                position: 'absolute',
                top: '-10px',
                left: `${Math.random() * 100}%`,
                width: '4px',
                height: '4px',
                background: '#FFFFFF',
                borderRadius: '50%',
                boxShadow: '0 0 3px rgba(255, 255, 255, 0.8)',
                animation: `snowFall ${4 + Math.random() * 4}s linear infinite`,
                animationDelay: `${Math.random() * 4}s`
            });
            this.currentElements.push(snowflake);
        }
        
        setTimeout(() => sky.style.opacity = '1', 100);
        this.currentElements.push(sky);
    }
    
    createRainbowWeather() {
        // Cielo después de tormenta
        const sky = this.createElement('div', {
            position: 'absolute',
            top: '0',
            left: '0',
            width: '100%',
            height: '100%',
            background: 'linear-gradient(to bottom, #87CEEB 0%, #E0F6FF 100%)',
            opacity: '0',
            transition: 'opacity 3s ease-in'
        });
        
        // Arcoíris
        const rainbow = this.createElement('div', {
            position: 'absolute',
            top: '30%',
            left: '10%',
            width: '80%',
            height: '40%',
            background: 'linear-gradient(90deg, red 0%, orange 16.66%, yellow 33.33%, green 50%, blue 66.66%, indigo 83.33%, violet 100%)',
            borderRadius: '200px 200px 0 0',
            opacity: '0.4',
            animation: 'rainbowShimmer 8s ease-in-out infinite'
        });
        
        // Partículas brillantes
        for (let i = 0; i < 20; i++) {
            const sparkle = this.createElement('div', {
                position: 'absolute',
                top: `${40 + Math.random() * 30}%`,
                left: `${Math.random() * 100}%`,
                width: '3px',
                height: '3px',
                background: '#FFD700',
                borderRadius: '50%',
                animation: `sparkle ${2 + Math.random() * 2}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 2}s`
            });
            this.currentElements.push(sparkle);
        }
        
        setTimeout(() => sky.style.opacity = '1', 100);
        this.currentElements.push(sky, rainbow);
    }
    
    createSpringWeather() {
        // Cielo primaveral
        const sky = this.createElement('div', {
            position: 'absolute',
            top: '0',
            left: '0',
            width: '100%',
            height: '100%',
            background: 'linear-gradient(to bottom, #FFB6C1 0%, #98FB98 100%)',
            opacity: '0',
            transition: 'opacity 3s ease-in'
        });
        
        // Pétalos volando
        for (let i = 0; i < 30; i++) {
            const petal = this.createElement('div', {
                position: 'absolute',
                top: `${Math.random() * 100}%`,
                left: '-10px',
                width: '8px',
                height: '6px',
                background: '#FF69B4',
                borderRadius: '50% 0',
                animation: `petalFloat ${6 + Math.random() * 4}s linear infinite`,
                animationDelay: `${Math.random() * 3}s`,
                transform: `rotate(${Math.random() * 360}deg)`
            });
            this.currentElements.push(petal);
        }
        
        setTimeout(() => sky.style.opacity = '1', 100);
        this.currentElements.push(sky);
    }
    
    createAutumnWeather() {
        // Cielo otoñal
        const sky = this.createElement('div', {
            position: 'absolute',
            top: '0',
            left: '0',
            width: '100%',
            height: '100%',
            background: 'linear-gradient(to bottom, #DEB887 0%, #CD853F 100%)',
            opacity: '0',
            transition: 'opacity 3s ease-in'
        });
        
        // Hojas cayendo
        const leafColors = ['#FF8C00', '#FF4500', '#B22222', '#8B4513'];
        for (let i = 0; i < 25; i++) {
            const leaf = this.createElement('div', {
                position: 'absolute',
                top: '-10px',
                left: `${Math.random() * 100}%`,
                width: '12px',
                height: '10px',
                background: leafColors[Math.floor(Math.random() * leafColors.length)],
                clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
                animation: `leafFall ${4 + Math.random() * 3}s linear infinite`,
                animationDelay: `${Math.random() * 3}s`
            });
            this.currentElements.push(leaf);
        }
        
        setTimeout(() => sky.style.opacity = '1', 100);
        this.currentElements.push(sky);
    }
    
    createFloatingClouds(color, opacity) {
        for (let i = 0; i < 3; i++) {
            const cloud = this.createElement('div', {
                position: 'absolute',
                top: `${10 + i * 15}%`,
                left: '-200px',
                width: '150px',
                height: '60px',
                background: color,
                borderRadius: '50px',
                opacity: opacity,
                animation: `cloudFloat ${15 + i * 5}s linear infinite`,
                animationDelay: `${i * 2}s`
            });
            
            // Agregar formas de nube adicionales
            const cloudPart1 = this.createElement('div', {
                position: 'absolute',
                top: '-20px',
                left: '30px',
                width: '70px',
                height: '70px',
                background: color,
                borderRadius: '50%',
                opacity: opacity
            });
            
            const cloudPart2 = this.createElement('div', {
                position: 'absolute',
                top: '-10px',
                left: '80px',
                width: '50px',
                height: '50px',
                background: color,
                borderRadius: '50%',
                opacity: opacity
            });
            
            cloud.appendChild(cloudPart1);
            cloud.appendChild(cloudPart2);
            this.currentElements.push(cloud);
        }
    }
    
    createElement(tag, styles) {
        const element = document.createElement(tag);
        Object.assign(element.style, styles);
        this.backgroundContainer.appendChild(element);
        return element;
    }
    
    destroy() {
        if (this.transitionInterval) {
            clearInterval(this.transitionInterval);
        }
        this.clearWeather();
        if (this.backgroundContainer && this.backgroundContainer.parentNode) {
            this.backgroundContainer.parentNode.removeChild(this.backgroundContainer);
        }
    }
}

// CSS adicional para animaciones
const style = document.createElement('style');
style.textContent = `
@keyframes sunRays {
    0%, 100% { opacity: 0.2; transform: translateY(0) rotate(var(--rotation)); }
    50% { opacity: 0.6; transform: translateY(-10px) rotate(var(--rotation)); }
}

@keyframes sunGlow {
    0%, 100% { box-shadow: 0 0 30px rgba(255, 215, 0, 0.6); }
    50% { box-shadow: 0 0 50px rgba(255, 215, 0, 0.9); }
}

@keyframes moonGlow {
    0%, 100% { box-shadow: 0 0 20px rgba(245, 245, 220, 0.5); }
    50% { box-shadow: 0 0 40px rgba(245, 245, 220, 0.8); }
}

@keyframes rainDrop {
    0% { transform: translateY(-10px); opacity: 1; }
    100% { transform: translateY(100vh); opacity: 0; }
}

@keyframes snowFall {
    0% { transform: translateY(-10px) translateX(0); opacity: 1; }
    100% { transform: translateY(100vh) translateX(50px); opacity: 0; }
}

@keyframes starTwinkle {
    0%, 100% { opacity: 0.3; transform: scale(1); }
    50% { opacity: 1; transform: scale(1.2); }
}

@keyframes cloudFloat {
    0% { transform: translateX(-200px); }
    100% { transform: translateX(calc(100vw + 200px)); }
}

@keyframes petalFloat {
    0% { transform: translateX(-10px) translateY(0) rotate(0deg); opacity: 1; }
    100% { transform: translateX(100vw) translateY(50px) rotate(360deg); opacity: 0; }
}

@keyframes leafFall {
    0% { transform: translateY(-10px) translateX(0) rotate(0deg); opacity: 1; }
    100% { transform: translateY(100vh) translateX(100px) rotate(360deg); opacity: 0; }
}

@keyframes rainbowShimmer {
    0%, 100% { opacity: 0.4; }
    50% { opacity: 0.7; }
}

@keyframes sparkle {
    0%, 100% { opacity: 0; transform: scale(0.5); }
    50% { opacity: 1; transform: scale(1.5); }
}
`;
document.head.appendChild(style);

// Instancia global
window.dynamicWeatherBackgrounds = new DynamicWeatherBackgrounds(); 