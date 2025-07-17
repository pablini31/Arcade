import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API de Superhéroes y Mascotas',
      version: '1.0.0',
      description: 'API completa para gestión de superhéroes, mascotas y usuarios con sistema de autenticación',
      contact: {
        name: 'API Support',
        email: 'support@api-superheroes.com'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: 'https://api-mascotas-7sj9.onrender.com',
        description: 'Servidor de Producción'
      },
      {
        url: 'http://localhost:3000',
        description: 'Servidor de Desarrollo'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Para usar la autenticación: 1) Haz clic en "Authorize" (🔒), 2) Ingresa SOLO el token JWT (sin "Bearer"), 3) Haz clic en "Authorize"'
        }
      },
      schemas: {
        Usuario: {
          type: 'object',
          properties: {
            username: { type: 'string', example: 'spiderman' },
            email: { type: 'string', format: 'email', example: 'peter@example.com' },
            name: { type: 'string', example: 'Peter Parker' },
            password: { type: 'string', example: 'password123' }
          }
        },
        Mascota: {
          type: 'object',
          required: ['nombre', 'tipo', 'poder', 'edad', 'descripcion', 'idLugar'],
          properties: {
            nombre: { 
              type: 'string', 
              example: 'Luna',
              description: 'Nombre de la mascota (requerido)'
            },
            tipo: { 
              type: 'string', 
              example: 'Perro',
              description: 'Tipo de mascota (requerido)'
            },
            poder: { 
              type: 'string', 
              example: 'Volar',
              description: 'Poder especial de la mascota (requerido)'
            },
            edad: { 
              type: 'number', 
              example: 3,
              description: 'Edad de la mascota en años (requerido)'
            },
            descripcion: { 
              type: 'string', 
              example: 'Una mascota muy amigable y juguetona',
              description: 'Descripción de la mascota (requerido)'
            },
            idLugar: { 
              type: 'number', 
              example: 1,
              description: 'ID del lugar donde vive la mascota (requerido)'
            },
            personalidad: { 
              type: 'string', 
              enum: ['amigable', 'tímido', 'agresivo', 'juguetón'],
              example: 'amigable',
              description: 'Personalidad de la mascota (opcional, por defecto: amigable)'
            },
            adoptadoPor: { 
              type: 'string', 
              example: '507f1f77bcf86cd799439011',
              description: 'ID del héroe que adoptó la mascota (opcional)'
            },
            salud: { 
              type: 'number', 
              example: 100,
              description: 'Nivel de salud (0-100, se asigna automáticamente)'
            },
            energia: { 
              type: 'number', 
              example: 100,
              description: 'Nivel de energía (0-100, se asigna automáticamente)'
            },
            felicidad: { 
              type: 'number', 
              example: 100,
              description: 'Nivel de felicidad (0-100, se asigna automáticamente)'
            }
          }
        },
        Hero: {
          type: 'object',
          required: ['nombre', 'alias', 'poder', 'edad', 'ciudad'],
          properties: {
            nombre: { 
              type: 'string', 
              example: 'Spider-Man',
              description: 'Nombre del superhéroe'
            },
            alias: { 
              type: 'string', 
              example: 'Peter Parker',
              description: 'Alias o identidad secreta'
            },
            poder: { 
              type: 'string', 
              example: 'Sentido arácnido',
              description: 'Poder principal del superhéroe'
            },
            edad: { 
              type: 'number', 
              example: 25,
              description: 'Edad del superhéroe'
            },
            ciudad: { 
              type: 'string', 
              example: 'Nueva York',
              description: 'Ciudad donde opera el superhéroe'
            },
            propietario: { 
              type: 'string', 
              example: '507f1f77bcf86cd799439011',
              description: 'ID del usuario propietario (se asigna automáticamente)'
            }
          }
        }
      }
    }
  },
  apis: ['./src/routes/*.js', './src/controllers/*.js', './src/app.js', './src/docs/*.js']
};

export const specs = swaggerJsdoc(options); 