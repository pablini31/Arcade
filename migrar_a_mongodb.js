import fs from 'fs-extra';
import dotenv from 'dotenv';
import connectDB from './src/config/database.js';
import Mascota from './src/models/Mascota.js';

// Cargar variables de entorno
dotenv.config({ path: './config.env' });

async function migrarMascotas() {
    try {
        console.log('🔄 Iniciando migración de mascotas a MongoDB...');
        
        // Conectar a MongoDB
        await connectDB();
        
        // Leer datos del archivo JSON
        const filePath = './src/data/mascotas.json';
        const mascotasData = await fs.readJson(filePath);
        
        console.log(`📊 Encontradas ${mascotasData.length} mascotas para migrar`);
        
        // Limpiar colección existente
        await Mascota.deleteMany({});
        console.log('🗑️ Colección de mascotas limpiada');
        
        // Migrar cada mascota
        const mascotasMigradas = [];
        for (const mascotaData of mascotasData) {
            try {
                // Convertir fechas de string a Date
                const mascotaParaMigrar = {
                    ...mascotaData,
                    ultimaAlimentacion: new Date(mascotaData.ultimaAlimentacion),
                    ultimoPaseo: new Date(mascotaData.ultimoPaseo),
                    enfermedad: mascotaData.enfermedad ? {
                        ...mascotaData.enfermedad,
                        inicio: new Date(mascotaData.enfermedad.inicio)
                    } : null
                };
                
                const nuevaMascota = new Mascota(mascotaParaMigrar);
                await nuevaMascota.save();
                mascotasMigradas.push(nuevaMascota);
                
                console.log(`✅ Migrada mascota: ${mascotaData.nombre} (ID: ${mascotaData.id})`);
            } catch (error) {
                console.error(`❌ Error migrando mascota ${mascotaData.nombre}:`, error.message);
            }
        }
        
        console.log(`🎉 Migración completada. ${mascotasMigradas.length} mascotas migradas exitosamente`);
        
        // Verificar migración
        const totalEnMongo = await Mascota.countDocuments();
        console.log(`📈 Total de mascotas en MongoDB: ${totalEnMongo}`);
        
        process.exit(0);
    } catch (error) {
        console.error('❌ Error durante la migración:', error);
        process.exit(1);
    }
}

// Ejecutar migración
migrarMascotas(); 