import express from 'express';
import mongoose from 'mongoose';

const router = express.Router();

// Ruta de verificación de salud
router.get('/health', async (req, res) => {
    try {
        // Verificar conexión a MongoDB
        const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
        
        res.json({
            status: 'OK',
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
            environment: process.env.NODE_ENV || 'development',
            database: dbStatus,
            version: '1.0.0'
        });
    } catch (error) {
        res.status(500).json({
            status: 'ERROR',
            timestamp: new Date().toISOString(),
            error: error.message
        });
    }
});

// Ruta raíz para verificar que la API está funcionando
router.get('/', (req, res) => {
    res.json({
        message: '🚀 API de Superhéroes funcionando correctamente',
        version: '1.0.0',
        baseUrl: 'https://api-mascotas-7sj9.onrender.com',
        endpoints: {
            health: {
                description: 'Verificación de salud del servicio',
                method: 'GET',
                url: '/health'
            },
            usuarios: {
                description: 'Gestión de usuarios',
                methods: {
                    registro: {
                        method: 'POST',
                        url: '/api/usuarios/registro',
                        body: '{ "username": "string", "email": "string", "password": "string", "nombre": "string" }'
                    },
                    login: {
                        method: 'POST',
                        url: '/api/usuarios/login',
                        body: '{ "usernameOrEmail": "string", "password": "string" }'
                    },
                    perfil: {
                        method: 'GET',
                        url: '/api/usuarios/perfil',
                        auth: 'Bearer Token requerido'
                    },
                    actualizarPerfil: {
                        method: 'PUT',
                        url: '/api/usuarios/perfil',
                        auth: 'Bearer Token requerido'
                    },
                    inventario: {
                        method: 'GET',
                        url: '/api/usuarios/inventario',
                        auth: 'Bearer Token requerido'
                    },
                    ranking: {
                        method: 'GET',
                        url: '/api/usuarios/ranking',
                        query: '?limite=10'
                    }
                }
            },
            mascotas: {
                description: 'Gestión completa de mascotas',
                methods: {
                    obtenerTodas: {
                        method: 'GET',
                        url: '/api/mascotas',
                        auth: 'Bearer Token requerido'
                    },
                    crear: {
                        method: 'POST',
                        url: '/api/mascotas',
                        body: '{ "nombre": "string", "tipo": "string", "edad": "number" }'
                    },
                    obtenerPorId: {
                        method: 'GET',
                        url: '/api/mascotas/:id'
                    },
                    actualizar: {
                        method: 'PUT',
                        url: '/api/mascotas/:id',
                        body: '{ "nombre": "string", "tipo": "string", "edad": "number" }'
                    },
                    eliminar: {
                        method: 'DELETE',
                        url: '/api/mascotas/:id'
                    },
                    disponibles: {
                        method: 'GET',
                        url: '/api/mascotas/disponibles',
                        description: 'Obtener mascotas no adoptadas'
                    },
                    adoptar: {
                        method: 'POST',
                        url: '/api/mascotas/:id/adoptar',
                        body: '{ "idHeroe": "number" }'
                    },
                    adoptarAleatorio: {
                        method: 'POST',
                        url: '/api/mascotas/adoptar/aleatorio',
                        body: '{ "idHeroe": "number" }'
                    },
                    alimentar: {
                        method: 'POST',
                        url: '/api/mascotas/:id/alimentar',
                        body: '{ "tipoAlimento": "normal|premium|especial" }'
                    },
                    pasear: {
                        method: 'POST',
                        url: '/api/mascotas/:id/pasear',
                        body: '{ "duracion": "number" }'
                    },
                    curar: {
                        method: 'POST',
                        url: '/api/mascotas/:id/curar',
                        body: '{ "medicamento": "string" }'
                    },
                    estado: {
                        method: 'GET',
                        url: '/api/mascotas/:id/estado',
                        description: 'Verificar estado de salud'
                    },
                    agregarItem: {
                        method: 'POST',
                        url: '/api/mascotas/:id/items',
                        body: '{ "item": "object" }'
                    },
                    quitarItem: {
                        method: 'DELETE',
                        url: '/api/mascotas/:id/items/:itemId'
                    },
                    personalidad: {
                        method: 'PUT',
                        url: '/api/mascotas/:id/personalidad',
                        body: '{ "personalidad": "amigable|tímido|agresivo|juguetón" }'
                    },
                    enfermar: {
                        method: 'POST',
                        url: '/api/mascotas/:id/enfermar',
                        body: '{ "enfermedad": "string" }'
                    },
                    actualizarEstado: {
                        method: 'POST',
                        url: '/api/mascotas/:id/actualizar-estado',
                        description: 'Forzar actualización del estado'
                    },
                    items: {
                        method: 'GET',
                        url: '/api/mascotas/items',
                        query: '?tipo=free|premium'
                    },
                    porHeroe: {
                        method: 'GET',
                        url: '/api/mascotas/heroe/:idHeroe'
                    }
                }
            },
            superheroes: {
                description: 'Gestión de superhéroes',
                methods: {
                    obtenerTodos: {
                        method: 'GET',
                        url: '/api/heroes'
                    },
                    obtenerPorId: {
                        method: 'GET',
                        url: '/api/heroes/:id'
                    },
                    crear: {
                        method: 'POST',
                        url: '/api/heroes',
                        body: '{ "name": "string", "alias": "string", "city": "string", "team": "string" }'
                    },
                    actualizar: {
                        method: 'PUT',
                        url: '/api/heroes/:id',
                        body: '{ "name": "string", "alias": "string", "city": "string", "team": "string" }'
                    },
                    eliminar: {
                        method: 'DELETE',
                        url: '/api/heroes/:id'
                    },
                    buscarPorCiudad: {
                        method: 'GET',
                        url: '/api/heroes/city/:city'
                    },
                    enfrentarVillano: {
                        method: 'POST',
                        url: '/api/heroes/:id/enfrentar',
                        body: '{ "villain": "string" }'
                    },
                    asignarMascota: {
                        method: 'POST',
                        url: '/api/heroes/:id/asignar-mascota',
                        description: 'Asignar mascota aleatoria al héroe'
                    }
                }
            }
        },
        documentation: {
            postman: 'Todos los endpoints están documentados en tu colección de Postman',
            authentication: 'La mayoría de endpoints requieren Bearer Token (excepto login y registro)',
            cors: 'CORS habilitado para desarrollo y producción',
            totalEndpoints: 'Más de 25 endpoints implementados'
        }
    });
});

export default router; 