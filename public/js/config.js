// Configuración del juego PetVenture
const CONFIG = {
    // URLs de la API
    API_BASE_URL: window.location.hostname === 'localhost' 
        ? 'http://localhost:3000' 
        : 'https://api-mascotas-7sj9.onrender.com',
    
    // Endpoints de la API
    ENDPOINTS: {
        // Autenticación
        LOGIN: '/api/usuarios/login',
        REGISTER: '/api/usuarios/registro',
        PROFILE: '/api/usuarios/perfil',
        
        // Mascotas
        PETS: '/api/mascotas',
        CREATE_PET: '/api/mascotas/crear',
        PET_BY_ID: (id) => `/api/mascotas/${id}`,
        FEED_PET: (id) => `/api/mascotas/${id}/alimentar`,
        WALK_PET: (id) => `/api/mascotas/${id}/pasear`,
        CURE_PET: (id) => `/api/mascotas/${id}/curar`,
        PET_STATUS: (id) => `/api/mascotas/${id}/estado`,
        PET_PERSONALITY: (id) => `/api/mascotas/${id}/personalidad`,
        PET_ITEMS: (id) => `/api/mascotas/${id}/items`,
        PET_ITEMS_REMOVE: (id, itemId) => `/api/mascotas/${id}/items/${itemId}`,
        PET_SICK: (id) => `/api/mascotas/${id}/enfermar`,
        PET_UPDATE_STATUS: (id) => `/api/mascotas/${id}/actualizar-estado`,
        
        // Items
        ITEMS: '/api/mascotas/items',
        
        // Inventario
        INVENTORY: '/api/usuarios/inventario',
        
        // Ranking
        RANKING: '/api/usuarios/ranking'
    },
    
    // Configuración del juego
    GAME: {
        // Intervalos de actualización (en milisegundos)
        UPDATE_INTERVAL: 30000, // 30 segundos
        STATS_DECAY_INTERVAL: 60000, // 1 minuto
        
        // Configuración de estadísticas
        STATS: {
            MAX_HEALTH: 100,
            MAX_ENERGY: 100,
            MAX_HAPPINESS: 100,
            
            // Decay por minuto
            HEALTH_DECAY: 1,
            ENERGY_DECAY: 2,
            HAPPINESS_DECAY: 1.5
        },
        
        // Configuración de alimentación
        FEEDING: {
            NORMAL: {
                energy: 10,
                health: 5,
                cost: 0
            },
            PREMIUM: {
                energy: 20,
                health: 10,
                cost: 5
            },
            ESPECIAL: {
                energy: 30,
                health: 15,
                cost: 10
            }
        },
        
        // Configuración de paseos
        WALKING: {
            SHORT: {
                duration: 15,
                happiness: 5,
                energy: -10
            },
            NORMAL: {
                duration: 30,
                happiness: 10,
                energy: -20
            },
            LONG: {
                duration: 60,
                happiness: 15,
                energy: -30
            }
        },
        
        // Configuración de medicamentos
        MEDICINES: {
            vitaminaC: {
                name: 'Vitamina C',
                icon: '💊',
                effect: 'Cura resfriados',
                cost: 3
            },
            antibiotico: {
                name: 'Antibiótico',
                icon: '💉',
                effect: 'Cura enfermedades estomacales',
                cost: 5
            },
            antidepresivo: {
                name: 'Antidepresivo',
                icon: '💝',
                effect: 'Cura la tristeza',
                cost: 4
            },
            medicamentoGeneral: {
                name: 'Medicamento General',
                icon: '🏥',
                effect: 'Cura heridas generales',
                cost: 6
            }
        },
        
        // Configuración de personalidades
        PERSONALITIES: {
            amigable: {
                name: 'Amigable',
                icon: '🤝',
                description: 'Muy sociable y cariñoso',
                bonus: 'Aumenta felicidad más rápido'
            },
            tímido: {
                name: 'Tímido',
                icon: '😐',
                description: 'Reservado pero leal',
                bonus: 'Menor decay de felicidad'
            },
            agresivo: {
                name: 'Agresivo',
                icon: '😠',
                description: 'Protector y territorial',
                bonus: 'Mayor energía para actividades'
            },
            juguetón: {
                name: 'Juguetón',
                icon: '🎮',
                description: 'Siempre listo para jugar',
                bonus: 'Mejores resultados en paseos'
            }
        },
        
        // Configuración de tipos de mascotas
        PET_TYPES: {
            perro: {
                name: 'Perro',
                emoji: '🐕',
                baseStats: {
                    health: 100,
                    energy: 90,
                    happiness: 95
                }
            },
            gato: {
                name: 'Gato',
                emoji: '🐱',
                baseStats: {
                    health: 85,
                    energy: 95,
                    happiness: 80
                }
            },
            conejo: {
                name: 'Conejo',
                emoji: '🐰',
                baseStats: {
                    health: 90,
                    energy: 85,
                    happiness: 90
                }
            },
            hamster: {
                name: 'Hámster',
                emoji: '🐹',
                baseStats: {
                    health: 80,
                    energy: 100,
                    happiness: 85
                }
            },
            pajaro: {
                name: 'Pájaro',
                emoji: '🐦',
                baseStats: {
                    health: 75,
                    energy: 95,
                    happiness: 100
                }
            }
        },
        
        // Configuración de poderes
        POWERS: {
            vuelo: {
                name: 'Vuelo',
                emoji: '🦅',
                description: 'Puede volar y explorar lugares altos',
                effect: 'Aumenta felicidad en paseos'
            },
            superfuerza: {
                name: 'Super Fuerza',
                emoji: '💪',
                description: 'Increíblemente fuerte',
                effect: 'Reduce el consumo de energía'
            },
            invisibilidad: {
                name: 'Invisibilidad',
                emoji: '👻',
                description: 'Puede volverse invisible',
                effect: 'Menor probabilidad de enfermarse'
            },
            telepatia: {
                name: 'Telepatía',
                emoji: '🧠',
                description: 'Puede leer mentes',
                effect: 'Mejor comunicación con el dueño'
            },
            regeneracion: {
                name: 'Regeneración',
                emoji: '🔄',
                description: 'Se cura automáticamente',
                effect: 'Recuperación natural de salud'
            }
        }
    },
    
    // Configuración de animaciones
    ANIMATIONS: {
        DURATION: {
            FAST: 150,
            NORMAL: 300,
            SLOW: 500
        },
        EASING: {
            BOUNCE: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
            SMOOTH: 'cubic-bezier(0.4, 0, 0.2, 1)',
            ELASTIC: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)'
        }
    },
    
    // Configuración de sonidos
    SOUNDS: {
        ENABLED: true,
        VOLUME: 0.5,
        EFFECTS: {
            FEED: 'sounds/feed.mp3',
            WALK: 'sounds/walk.mp3',
            CURE: 'sounds/cure.mp3',
            NOTIFICATION: 'sounds/notification.mp3',
            SUCCESS: 'sounds/success.mp3',
            ERROR: 'sounds/error.mp3'
        }
    },
    
    // Configuración de notificaciones
    NOTIFICATIONS: {
        DURATION: 5000,
        POSITION: 'top-right',
        TYPES: {
            SUCCESS: 'success',
            ERROR: 'error',
            WARNING: 'warning',
            INFO: 'info'
        }
    },
    
    // Configuración de almacenamiento local
    STORAGE: {
        KEYS: {
            TOKEN: 'petventure_token',
            USER: 'petventure_user',
            SETTINGS: 'petventure_settings',
            GAME_STATE: 'petventure_game_state'
        }
    },
    
    // Configuración de desarrollo
    DEBUG: {
        ENABLED: window.location.hostname === 'localhost',
        LOG_LEVEL: 'info', // 'debug', 'info', 'warn', 'error'
        SHOW_API_CALLS: true,
        SHOW_PERFORMANCE: false
    }
};

// Utilidades de configuración
const ConfigUtils = {
    // Obtener URL completa de un endpoint
    getApiUrl: (endpoint) => {
        return CONFIG.API_BASE_URL + endpoint;
    },
    
    // Verificar si estamos en desarrollo
    isDevelopment: () => {
        return CONFIG.DEBUG.ENABLED;
    },
    
    // Logging condicional
    log: (level, message, data = null) => {
        if (!CONFIG.DEBUG.ENABLED) return;
        
        const levels = ['debug', 'info', 'warn', 'error'];
        const currentLevel = levels.indexOf(CONFIG.DEBUG.LOG_LEVEL);
        const messageLevel = levels.indexOf(level);
        
        if (messageLevel >= currentLevel) {
            const timestamp = new Date().toISOString();
            const prefix = `[PetVenture ${level.toUpperCase()}] ${timestamp}`;
            
            switch (level) {
                case 'debug':
                    console.debug(prefix, message, data);
                    break;
                case 'info':
                    console.info(prefix, message, data);
                    break;
                case 'warn':
                    console.warn(prefix, message, data);
                    break;
                case 'error':
                    console.error(prefix, message, data);
                    break;
            }
        }
    },
    
    // Validar configuración
    validate: () => {
        const required = ['API_BASE_URL', 'ENDPOINTS', 'GAME'];
        const missing = required.filter(key => !CONFIG[key]);
        
        if (missing.length > 0) {
            console.error('Configuración incompleta:', missing);
            return false;
        }
        
        ConfigUtils.log('info', 'Configuración validada correctamente');
        return true;
    }
};

// Exportar configuración
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { CONFIG, ConfigUtils };
} 