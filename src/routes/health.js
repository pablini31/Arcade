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
        endpoints: {
            health: '/health',
            usuarios: '/api/usuarios',
            mascotas: '/api/mascotas',
            superheroes: '/api/superheroes'
        }
    });
});

export default router; 