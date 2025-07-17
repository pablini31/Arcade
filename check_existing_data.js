import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config({ path: './config.env' });

const checkExistingData = async () => {
    console.log('🔍 Verificando datos existentes en MongoDB Atlas...\n');
    
    try {
        // Intentar conectar con el connection string actual
        console.log('📡 Intentando conectar con la configuración actual...');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Conexión exitosa!\n');
        
        // Verificar si existen colecciones
        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log('📋 Colecciones encontradas:', collections.map(c => c.name));
        
        if (collections.length === 0) {
            console.log('\n📭 No hay colecciones en la base de datos');
            console.log('💡 Esto significa que aún no se han migrado datos');
        } else {
            console.log('\n📊 Verificando datos en las colecciones...');
            
            // Verificar datos en cada colección
            for (const collection of collections) {
                const count = await mongoose.connection.db.collection(collection.name).countDocuments();
                console.log(`   - ${collection.name}: ${count} documentos`);
            }
            
            // Verificar específicamente héroes y mascotas
            const heroesCollection = collections.find(c => c.name === 'heroes');
            const mascotasCollection = collections.find(c => c.name === 'mascotas');
            
            if (heroesCollection) {
                const heroesCount = await mongoose.connection.db.collection('heroes').countDocuments();
                console.log(`\n👥 Héroes migrados: ${heroesCount}`);
                
                if (heroesCount > 0) {
                    const sampleHero = await mongoose.connection.db.collection('heroes').findOne();
                    console.log(`   Ejemplo: ${sampleHero.alias} (${sampleHero.nombre})`);
                }
            }
            
            if (mascotasCollection) {
                const mascotasCount = await mongoose.connection.db.collection('mascotas').countDocuments();
                console.log(`🐾 Mascotas migradas: ${mascotasCount}`);
                
                if (mascotasCount > 0) {
                    const sampleMascota = await mongoose.connection.db.collection('mascotas').findOne();
                    console.log(`   Ejemplo: ${sampleMascota.nombre} (${sampleMascota.tipo})`);
                }
            }
        }
        
        console.log('\n📊 RESUMEN:');
        console.log('========================');
        console.log(`✅ Conexión MongoDB: ACTIVA`);
        console.log(`📋 Colecciones: ${collections.length}`);
        
        const heroesCount = collections.find(c => c.name === 'heroes') ? 
            await mongoose.connection.db.collection('heroes').countDocuments() : 0;
        const mascotasCount = collections.find(c => c.name === 'mascotas') ? 
            await mongoose.connection.db.collection('mascotas').countDocuments() : 0;
            
        console.log(`👥 Héroes: ${heroesCount}`);
        console.log(`🐾 Mascotas: ${mascotasCount}`);
        
        if (heroesCount > 0 || mascotasCount > 0) {
            console.log('\n🎉 ¡DATOS YA MIGRADOS! La migración ya se realizó anteriormente.');
        } else {
            console.log('\n📝 No hay datos migrados. Ejecuta: npm run migrate');
        }
        
    } catch (error) {
        console.error('❌ Error de conexión:', error.message);
        console.log('\n💡 El cluster actual no está disponible o la configuración es incorrecta.');
        console.log('📋 Sigue la guía en setup_mongodb_atlas.md para configurar un nuevo cluster.');
    } finally {
        if (mongoose.connection.readyState === 1) {
            await mongoose.connection.close();
            console.log('\n🔌 Conexión cerrada');
        }
    }
};

checkExistingData(); 