// Sistema de Fondos Dinámicos - PetVenture 
class DynamicBackgroundManager {
    constructor() {
        console.log('🌍 Dynamic Background Manager inicializado');
        // TEMPORALMENTE DESACTIVADO
        // this.init();
    }
    
    init() {
        // DESACTIVADO TEMPORALMENTE
        console.log('⚠️ Dynamic Backgrounds desactivado temporalmente');
        return;
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
window.dynamicWeatherBackgrounds = new DynamicBackgroundManager(); 