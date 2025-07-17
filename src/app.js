import express from 'express'
import morgan from 'morgan'
import cors from 'cors'
import dotenv from 'dotenv'
import connectDB from './config/database.js'
import heroController from './controllers/heroController.js'
import mascotaController from './controllers/mascotaController.js'
import usuarioController from './controllers/usuarioController.js'
import mascotaService from './services/mascotaService.js'
import productionConfig from './config/production.js'
import healthRoutes from './routes/health.js'

// Cargar variables de entorno
dotenv.config({ path: './config.env' });

const app = express()

// Conectar a MongoDB
connectDB();

console.log('Registrando rutas...')

app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`)
    next()
})

app.use(morgan('dev'))
app.use(cors(productionConfig.cors))
app.use(express.json())

// Ruta específica para mascotas disponibles definida directamente en app.js
app.get('/api/mascotas/disponibles', async (req, res) => {
    console.log('GET /api/mascotas/disponibles llamado - RUTA DIRECTA');
    try {
        const mascotas = await mascotaService.getMascotas();
        const disponibles = mascotas.filter(m => m.adoptadoPor === null);
        console.log(`Encontradas ${disponibles.length} mascotas disponibles`);
        res.json(disponibles);
    } catch (error) {
        console.error('Error en GET /api/mascotas/disponibles:', error);
        res.status(500).json({ error: error.message });
    }
});

// Ruta de depuración para verificar mascotas disponibles
app.get('/api/debug/disponibles', async (req, res) => {
    try {
        const disponibles = await mascotaService.getMascotasDisponibles();
        res.json({ 
            mensaje: 'Ruta de depuración',
            cantidadDisponibles: disponibles.length,
            mascotas: disponibles
        });
    } catch (error) {
        console.error('Error en ruta de depuración:', error);
        res.status(500).json({ error: error.message, stack: error.stack });
    }
});

// Rutas de verificación de salud
app.use('/', healthRoutes)

app.use('/api/usuarios', usuarioController)
app.use('/api/mascotas', mascotaController)
app.use('/api', heroController)

const PORT = productionConfig.port
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en el puerto ${PORT}`)
    console.log(`📊 Entorno: ${process.env.NODE_ENV || 'development'}`)
    console.log(`🌐 URL: ${process.env.NODE_ENV === 'production' ? 'https://tu-app-name.onrender.com' : `http://localhost:${PORT}`}`)
}) 