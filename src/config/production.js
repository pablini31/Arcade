// Configuración específica para producción (Render)
export const productionConfig = {
    // Render asigna automáticamente el puerto
    port: process.env.PORT || 3000,
    
    // Configuración de CORS para producción
    cors: {
        origin: process.env.ALLOWED_ORIGINS ? 
            process.env.ALLOWED_ORIGINS.split(',') : 
            ['https://tu-frontend.onrender.com', 'http://localhost:3000'],
        credentials: true
    },
    
    // Configuración de MongoDB
    mongodb: {
        uri: process.env.MONGODB_URI,
        options: {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            // Configuraciones adicionales para producción
            maxPoolSize: 10,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        }
    },
    
    // Configuración de JWT
    jwt: {
        secret: process.env.JWT_SECRET,
        expiresIn: '24h'
    },
    
    // Configuración de logging
    logging: {
        level: process.env.LOG_LEVEL || 'info'
    }
};

export default productionConfig; 