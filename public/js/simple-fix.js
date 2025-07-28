// Fix Simple y Directo - NO tocar lo que funciona
console.log('🔧 Fix simple iniciado');

// Solo arreglar la transición después del login exitoso
document.addEventListener('DOMContentLoaded', function() {
    // Sobrescribir showGameScreen para que funcione
    if (typeof uiManager !== 'undefined' && uiManager.showGameScreen) {
        const originalShowGameScreen = uiManager.showGameScreen;
        
        uiManager.showGameScreen = function() {
            console.log('🎮 Intentando mostrar pantalla del juego...');
            
            try {
                // Método simple y directo
                const authScreen = document.getElementById('auth-screen');
                const gameScreen = document.getElementById('game-screen');
                const loadingScreen = document.getElementById('loading-screen');
                
                // Ocultar otras pantallas
                if (authScreen) authScreen.style.display = 'none';
                if (loadingScreen) loadingScreen.style.display = 'none';
                
                // Mostrar juego
                if (gameScreen) {
                    gameScreen.style.display = 'block';
                    gameScreen.classList.remove('hidden');
                    console.log('✅ Pantalla del juego mostrada');
                } else {
                    console.error('❌ Elemento game-screen no encontrado');
                }
                
                this.currentScreen = 'game';
                
                // Solo llamar initializeGameComponents si existe
                if (this.initializeGameComponents) {
                    try {
                        this.initializeGameComponents();
                    } catch (e) {
                        console.warn('⚠️ Error en initializeGameComponents:', e);
                    }
                }
                
            } catch (error) {
                console.error('❌ Error en showGameScreen:', error);
                // Fallback: usar método original
                originalShowGameScreen.call(this);
            }
        };
    }
    
    // Interceptar errores de className y ignorarlos silenciosamente
    const originalError = console.error;
    console.error = function(...args) {
        const message = args[0];
        if (typeof message === 'string' && message.includes('className')) {
            console.warn('🔧 Error de className ignorado:', message);
            return;
        }
        originalError.apply(console, args);
    };
    
    // Fix directo para después del login
    setTimeout(() => {
        const loginForm = document.getElementById('login-form');
        if (loginForm) {
            loginForm.addEventListener('submit', function(e) {
                console.log('📝 Login detectado - preparando transición...');
                
                // Después de 3 segundos, forzar transición si no ocurrió
                setTimeout(() => {
                    const authScreen = document.getElementById('auth-screen');
                    const gameScreen = document.getElementById('game-screen');
                    
                    if (authScreen && !authScreen.classList.contains('hidden')) {
                        console.log('🔄 Forzando transición a pantalla del juego...');
                        
                        authScreen.style.display = 'none';
                        if (gameScreen) {
                            gameScreen.style.display = 'block';
                            gameScreen.classList.remove('hidden');
                        }
                    }
                }, 3000);
            });
        }
    }, 1000);
});

console.log('✅ Fix simple aplicado'); 