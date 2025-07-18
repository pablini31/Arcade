import express from 'express'
import morgan from 'morgan'
import cors from 'cors'
import dotenv from 'dotenv'
import swaggerUi from 'swagger-ui-express'
import connectDB from './config/database.js'
import heroController from './controllers/heroController.js'
import mascotaController from './controllers/mascotaController.js'
import usuarioController from './controllers/usuarioController.js'
import mascotaService from './services/mascotaService.js'
import productionConfig from './config/production.js'
import healthRoutes from './routes/health.js'
import { specs } from './config/swagger.js'

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

// Ruta de inicio que redirige a la documentación
app.get('/', (req, res) => {
  res.json({
    message: 'API de Superhéroes funcionando correctamente',
    version: '1.0.0',
    baseUrl: process.env.NODE_ENV === 'production' 
      ? 'https://api-mascotas-7sj9.onrender.com' 
      : `http://localhost:${PORT}`,
    documentation: {
      swagger: '/api-docs',
      postman: 'Todos los endpoints están documentados en tu colección de Postman',
      authentication: 'La mayoría de endpoints requieren Bearer Token (excepto login y registro)',
      cors: 'CORS habilitado para desarrollo y producción',
      totalEndpoints: 'Más de 25 endpoints implementados'
    },
    endpoints: {
      health: {
        method: 'GET',
        path: '/health',
        description: 'Verificar estado de salud de la API'
      },
      usuarios: {
        registro: {
          method: 'POST',
          path: '/api/usuarios/registro',
          body: ['username', 'email', 'password', 'name']
        },
        login: {
          method: 'POST',
          path: '/api/usuarios/login',
          body: ['usernameOrEmail', 'password']
        },
        perfil: {
          method: 'GET',
          path: '/api/usuarios/perfil',
          auth: 'Bearer Token'
        },
        actualizarPerfil: {
          method: 'PUT',
          path: '/api/usuarios/perfil',
          auth: 'Bearer Token'
        },
        inventario: {
          method: 'GET',
          path: '/api/usuarios/inventario',
          auth: 'Bearer Token'
        },
        ranking: {
          method: 'GET',
          path: '/api/usuarios/ranking',
          query: 'limite (opcional)'
        }
      },
      mascotas: {
        obtenerTodas: {
          method: 'GET',
          path: '/api/mascotas',
          auth: 'Bearer Token'
        },
        crear: {
          method: 'POST',
          path: '/api/mascotas',
          body: ['name', 'type', 'age'],
          auth: 'Bearer Token'
        },
        obtenerPorId: {
          method: 'GET',
          path: '/api/mascotas/:id'
        },
        actualizar: {
          method: 'PUT',
          path: '/api/mascotas/:id',
          body: ['name', 'type', 'age']
        },
        eliminar: {
          method: 'DELETE',
          path: '/api/mascotas/:id'
        },
        disponibles: {
          method: 'GET',
          path: '/api/mascotas/disponibles'
        },
        adoptar: {
          method: 'POST',
          path: '/api/mascotas/:id/adoptar',
          body: ['idHeroe'],
          auth: 'Bearer Token'
        },
        adoptarAleatorio: {
          method: 'POST',
          path: '/api/mascotas/adoptar/aleatorio',
          body: ['idHeroe'],
          auth: 'Bearer Token'
        },
        alimentar: {
          method: 'POST',
          path: '/api/mascotas/:id/alimentar',
          body: ['tipoAlimento'],
          auth: 'Bearer Token'
        },
        pasear: {
          method: 'POST',
          path: '/api/mascotas/:id/pasear',
          body: ['duracion'],
          auth: 'Bearer Token'
        },
        curar: {
          method: 'POST',
          path: '/api/mascotas/:id/curar',
          body: ['medicamento'],
          auth: 'Bearer Token'
        },
        estado: {
          method: 'GET',
          path: '/api/mascotas/:id/estado'
        },
        agregarItem: {
          method: 'POST',
          path: '/api/mascotas/:id/items',
          body: ['item'],
          auth: 'Bearer Token'
        },
        quitarItem: {
          method: 'DELETE',
          path: '/api/mascotas/:id/items/:itemId',
          auth: 'Bearer Token'
        },
        personalidad: {
          method: 'PUT',
          path: '/api/mascotas/:id/personalidad',
          body: ['personalidad'],
          auth: 'Bearer Token'
        },
        enfermar: {
          method: 'POST',
          path: '/api/mascotas/:id/enfermar',
          body: ['enfermedad'],
          auth: 'Bearer Token'
        },
        actualizarEstado: {
          method: 'POST',
          path: '/api/mascotas/:id/actualizar-estado',
          auth: 'Bearer Token'
        },
        items: {
          method: 'GET',
          path: '/api/mascotas/items',
          query: 'tipo=free|premium'
        },
        porHeroe: {
          method: 'GET',
          path: '/api/mascotas/heroe/:idHeroe'
        }
      },
      superheroes: {
        obtenerTodos: {
          method: 'GET',
          path: '/api/heroes'
        },
        obtenerPorId: {
          method: 'GET',
          path: '/api/heroes/:id'
        },
        crear: {
          method: 'POST',
          path: '/api/heroes',
          body: ['nombre', 'alias', 'poder', 'edad', 'ciudad']
        },
        actualizar: {
          method: 'PUT',
          path: '/api/heroes/:id',
          body: ['nombre', 'alias', 'poder', 'edad', 'ciudad']
        },
        eliminar: {
          method: 'DELETE',
          path: '/api/heroes/:id'
        },
        buscarPorCiudad: {
          method: 'GET',
          path: '/api/heroes/city/:city'
        },
        enfrentarVillano: {
          method: 'POST',
          path: '/api/heroes/:id/enfrentar',
          body: ['villain']
        },
        asignarMascota: {
          method: 'POST',
          path: '/api/heroes/:id/asignar-mascota'
        }
      }
    }
  })
})

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

// Configuración de Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'API de Superhéroes - Documentación',
  customfavIcon: '/favicon.ico',
  swaggerOptions: {
    docExpansion: 'list',
    filter: true,
    showRequestHeaders: true,
    tryItOutEnabled: true
  }
}))

// Ruta para obtener la documentación en formato JSON
app.get('/api-docs.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json')
  res.send(specs)
})

app.use('/api/usuarios', usuarioController)
app.use('/api/mascotas', mascotaController)
app.use('/api', heroController)

const PORT = productionConfig.port
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en el puerto ${PORT}`)
    console.log(`📊 Entorno: ${process.env.NODE_ENV || 'development'}`)
    console.log(`🌐 URL: ${process.env.NODE_ENV === 'production' ? 'https://tu-app-name.onrender.com' : `http://localhost:${PORT}`}`)
}) 