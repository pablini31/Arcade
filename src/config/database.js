import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config({ path: './config.env' });

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI);

        console.log(`✅ MongoDB conectado: ${conn.connection.host}`);
        
        // Manejar eventos de conexión
        mongoose.connection.on('error', (err) => {
            console.error('❌ Error de conexión MongoDB:', err);
        });

        mongoose.connection.on('disconnected', () => {
            console.log('⚠️ MongoDB desconectado');
        });

        // Manejar cierre graceful
        process.on('SIGINT', async () => {
            await mongoose.connection.close();
            console.log('🔌 Conexión MongoDB cerrada por terminación de la aplicación');
            process.exit(0);
        });

    } catch (error) {
        console.error('❌ Error conectando a MongoDB:', error.message);
        process.exit(1);
    }
};

export default connectDB; 