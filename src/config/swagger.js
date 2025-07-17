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
          bearerFormat: 'JWT'
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
          properties: {
            name: { type: 'string', example: 'Luna' },
            type: { type: 'string', example: 'Perro' },
            age: { type: 'number', example: 3 },
            adoptadoPor: { type: 'string', example: '507f1f77bcf86cd799439011' },
            salud: { type: 'number', example: 100 },
            energia: { type: 'number', example: 100 },
            felicidad: { type: 'number', example: 100 },
            personalidad: { type: 'string', example: 'amigable' }
          }
        },
        Hero: {
          type: 'object',
          properties: {
            name: { type: 'string', example: 'Spider-Man' },
            alias: { type: 'string', example: 'Peter Parker' },
            city: { type: 'string', example: 'New York' },
            team: { type: 'string', example: 'Avengers' }
          }
        }
      }
    }
  },
  apis: ['./src/routes/*.js', './src/controllers/*.js', './src/app.js', './src/docs/*.js']
};

export const specs = swaggerJsdoc(options); 