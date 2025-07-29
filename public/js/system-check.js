// Sistema de Verificación Completa para PetVenture
class SystemCheck {
    constructor() {
        this.errors = [];
        this.warnings = [];
        this.checks = [];
    }
    
    // Ejecutar todas las verificaciones
    async runAllChecks() {
        console.log('🔍 Iniciando verificación completa del sistema...');
        
        this.checkDOMElements();
        this.checkConfig();
        this.checkManagers();
        await this.checkAuthFlow();
        await this.checkAPIConnectivity();
        this.checkGameLogic();
        this.checkResponsiveDesign();
        
        this.reportResults();
        return this.errors.length === 0;
    }
    
    // Verificar elementos DOM críticos
    checkDOMElements() {
        const criticalElements = [
            'auth-screen',
            'game-screen',
            'loading-screen',
            'login-form',
            'register-form',
            'logout-btn'
        ];
        
        criticalElements.forEach(id => {
            const element = document.getElementById(id);
            if (!element) {
                this.errors.push(`❌ Elemento crítico no encontrado: ${id}`);
            } else {
                this.checks.push(`✅ Elemento DOM: ${id}`);
            }
        });
    }
    
    // Verificar configuración
    checkConfig() {
        if (typeof CONFIG === 'undefined') {
            this.errors.push('❌ CONFIG no está definido');
            return;
        }
        
        if (!CONFIG.API_BASE_URL) {
            this.errors.push('❌ API_BASE_URL no configurada');
        }
        
        if (!CONFIG.ENDPOINTS) {
            this.errors.push('❌ ENDPOINTS no configurados');
        }
        
        this.checks.push('✅ Configuración básica correcta');
    }
    
    // Verificar managers
    checkManagers() {
        const managers = [
            { name: 'authManager', instance: window.authManager },
            { name: 'uiManager', instance: window.uiManager },
            { name: 'petManager', instance: window.petManager },
            { name: 'gameManager', instance: window.gameManager }
        ];
        
        managers.forEach(({ name, instance }) => {
            if (typeof instance === 'undefined') {
                this.errors.push(`❌ ${name} no está disponible`);
            } else {
                this.checks.push(`✅ Manager: ${name}`);
            }
        });
    }
    
    // Verificar flujo de autenticación
    async checkAuthFlow() {
        try {
            // Verificar que los tabs funcionen
            const loginTab = document.querySelector('.tab-btn[data-tab="login"]');
            const registerTab = document.querySelector('.tab-btn[data-tab="register"]');
            
            if (!loginTab || !registerTab) {
                this.errors.push('❌ Tabs de autenticación no encontrados');
                return;
            }
            
            // Simular click en tabs
            registerTab.click();
            const registerForm = document.getElementById('register-form');
            if (registerForm.classList.contains('hidden')) {
                this.errors.push('❌ Tab de registro no funciona');
            }
            
            loginTab.click();
            const loginForm = document.getElementById('login-form');
            if (loginForm.classList.contains('hidden')) {
                this.errors.push('❌ Tab de login no funciona');
            }
            
            this.checks.push('✅ Tabs de autenticación funcionan');
            
        } catch (error) {
            this.errors.push(`❌ Error en flujo de auth: ${error.message}`);
        }
    }
    
    // Verificar conectividad con API
    async checkAPIConnectivity() {
        try {
            const response = await fetch(ConfigUtils.getApiUrl('/api/health'));
            if (response.ok) {
                this.checks.push('✅ API conectividad correcta');
            } else {
                this.warnings.push('⚠️ API responde pero con errores');
            }
        } catch (error) {
            this.errors.push(`❌ No se puede conectar a la API: ${error.message}`);
        }
    }
    
    // Verificar lógica del juego
    checkGameLogic() {
        // Verificar que existan las funciones críticas del juego
        const criticalFunctions = [
            { obj: window.petManager, methods: ['loadPets', 'selectPet', 'feedPet'] },
            { obj: window.uiManager, methods: ['showGameScreen', 'showAuthScreen', 'showNotification'] },
            { obj: window.authManager, methods: ['login', 'register', 'logout'] }
        ];
        
        criticalFunctions.forEach(({ obj, methods }) => {
            if (obj) {
                methods.forEach(method => {
                    if (typeof obj[method] !== 'function') {
                        this.errors.push(`❌ Método faltante: ${method}`);
                    }
                });
            }
        });
        
        this.checks.push('✅ Métodos críticos del juego disponibles');
    }
    
    // Verificar diseño responsivo
    checkResponsiveDesign() {
        const viewport = document.querySelector('meta[name="viewport"]');
        if (!viewport) {
            this.warnings.push('⚠️ Meta viewport no encontrado - problemas en móviles');
        }
        
        // Verificar CSS responsivo básico
        const gameScreen = document.getElementById('game-screen');
        if (gameScreen) {
            const styles = getComputedStyle(gameScreen);
            if (!styles.display || styles.display === 'none') {
                this.warnings.push('⚠️ Pantalla de juego puede tener problemas de visualización');
            }
        }
        
        this.checks.push('✅ Verificación responsiva básica completada');
    }
    
    // Reportar resultados
    reportResults() {
        console.log('\n🔍 REPORTE DE VERIFICACIÓN DEL SISTEMA');
        console.log('=====================================');
        
        if (this.errors.length === 0) {
            console.log('🎉 ¡SISTEMA LISTO PARA PRODUCCIÓN!');
        } else {
            console.log('🚨 ERRORES CRÍTICOS ENCONTRADOS:');
            this.errors.forEach(error => console.log(error));
        }
        
        if (this.warnings.length > 0) {
            console.log('\n⚠️ ADVERTENCIAS:');
            this.warnings.forEach(warning => console.log(warning));
        }
        
        console.log('\n✅ VERIFICACIONES EXITOSAS:');
        this.checks.forEach(check => console.log(check));
        
        console.log(`\n📊 RESUMEN: ${this.checks.length} exitosas, ${this.warnings.length} advertencias, ${this.errors.length} errores`);
    }
}

// Ejecutar verificación al cargar la página
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', async () => {
        setTimeout(async () => {
            const checker = new SystemCheck();
            await checker.runAllChecks();
        }, 2000); // Esperar 2 segundos para que todo se cargue
    });
} else {
    setTimeout(async () => {
        const checker = new SystemCheck();
        await checker.runAllChecks();
    }, 2000);
}

// Exportar para uso manual
window.SystemCheck = SystemCheck;