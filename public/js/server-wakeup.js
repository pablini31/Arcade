// Script para despertar servidor de Render - PetVenture
console.log('🌅 Iniciando sistema de activación del servidor...');

class ServerWakeupManager {
    constructor() {
        this.serverUrl = window.location.origin;
        this.wakeupInProgress = false;
        this.maxRetries = 10;
        this.retryDelay = 3000; // 3 segundos
        this.currentRetry = 0;
        
        this.init();
    }
    
    init() {
        // Intentar despertar el servidor inmediatamente
        this.wakeupServer();
        
        // Interceptar todos los fetch para manejar errores 502/503
        this.interceptFetch();
        
        // Mostrar indicador de estado
        this.createStatusIndicator();
    }
    
    async wakeupServer() {
        if (this.wakeupInProgress) return;
        
        this.wakeupInProgress = true;
        this.currentRetry = 0;
        
        console.log('🚀 Despertando servidor...');
        this.updateStatus('Activando servidor...', 'warning');
        
        while (this.currentRetry < this.maxRetries) {
            try {
                console.log(`⏳ Intento ${this.currentRetry + 1}/${this.maxRetries}`);
                
                // Hacer ping simple al servidor
                const response = await fetch(`${this.serverUrl}/api/health`, {
                    method: 'GET',
                    cache: 'no-cache',
                    headers: {
                        'Cache-Control': 'no-cache'
                    }
                });
                
                if (response.ok || response.status === 404) {
                    // Servidor está despierto (404 es OK si no existe /health)
                    console.log('✅ Servidor activado exitosamente');
                    this.updateStatus('Servidor activo', 'success');
                    this.hideStatus();
                    this.wakeupInProgress = false;
                    return true;
                }
                
                if (response.status === 502 || response.status === 503) {
                    throw new Error('Servidor aún iniciando...');
                }
                
            } catch (error) {
                console.log(`⚠️ Intento ${this.currentRetry + 1} falló:`, error.message);
                this.updateStatus(`Activando servidor... (${this.currentRetry + 1}/${this.maxRetries})`, 'warning');
            }
            
            this.currentRetry++;
            
            if (this.currentRetry < this.maxRetries) {
                await new Promise(resolve => setTimeout(resolve, this.retryDelay));
            }
        }
        
        // Si llegamos aquí, el servidor no respondió
        console.error('❌ No se pudo activar el servidor después de todos los intentos');
        this.updateStatus('Error de conexión. Recarga la página.', 'error');
        this.wakeupInProgress = false;
        return false;
    }
    
    interceptFetch() {
        const originalFetch = window.fetch;
        
        window.fetch = async (...args) => {
            try {
                const response = await originalFetch(...args);
                
                // Si obtenemos 502/503, intentar despertar el servidor
                if (response.status === 502 || response.status === 503) {
                    console.log('🔄 Error 502/503 detectado, activando servidor...');
                    
                    if (!this.wakeupInProgress) {
                        // Intentar despertar servidor en segundo plano
                        this.wakeupServer().then(success => {
                            if (success) {
                                // Reintentar la request original después de despertar
                                setTimeout(() => {
                                    console.log('🔄 Reintentando request original...');
                                    originalFetch(...args);
                                }, 2000);
                            }
                        });
                    }
                }
                
                return response;
            } catch (error) {
                console.warn('🌐 Error de red:', error.message);
                return Promise.reject(error);
            }
        };
    }
    
    createStatusIndicator() {
        const indicator = document.createElement('div');
        indicator.id = 'server-status';
        indicator.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: #3b82f6;
            color: white;
            padding: 0.75rem 1.5rem;
            border-radius: 25px;
            z-index: 10000;
            font-family: system-ui, -apple-system, sans-serif;
            font-size: 0.9rem;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            display: flex;
            align-items: center;
            gap: 0.5rem;
            transition: all 0.3s ease;
            opacity: 0;
            pointer-events: none;
        `;
        
        indicator.innerHTML = `
            <div class="spinner" style="
                width: 16px;
                height: 16px;
                border: 2px solid rgba(255,255,255,0.3);
                border-top: 2px solid white;
                border-radius: 50%;
                animation: spin 1s linear infinite;
            "></div>
            <span>Verificando servidor...</span>
        `;
        
        // Agregar estilos de animación
        const style = document.createElement('style');
        style.textContent = `
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        `;
        document.head.appendChild(style);
        
        document.body.appendChild(indicator);
        this.statusIndicator = indicator;
        
        // Mostrar inmediatamente
        setTimeout(() => {
            indicator.style.opacity = '1';
        }, 100);
    }
    
    updateStatus(message, type = 'info') {
        if (!this.statusIndicator) return;
        
        const colors = {
            info: '#3b82f6',
            warning: '#f59e0b', 
            success: '#10b981',
            error: '#ef4444'
        };
        
        this.statusIndicator.style.background = colors[type];
        this.statusIndicator.querySelector('span').textContent = message;
        
        if (type === 'success') {
            this.statusIndicator.querySelector('.spinner').style.display = 'none';
        }
    }
    
    hideStatus() {
        if (this.statusIndicator) {
            setTimeout(() => {
                this.statusIndicator.style.opacity = '0';
                setTimeout(() => {
                    if (this.statusIndicator.parentNode) {
                        this.statusIndicator.parentNode.removeChild(this.statusIndicator);
                    }
                }, 300);
            }, 2000);
        }
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    new ServerWakeupManager();
});

console.log('🌅 Sistema de activación del servidor cargado'); 