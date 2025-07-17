import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

// Cargar variables de entorno
dotenv.config({ path: './config.env' });

// Importar modelos
import Hero from './src/models/Hero.js';
import Mascota from './src/models/Mascota.js';

const verifyMigration = async () => {
    console.log('🔍 Verificando conexión y migración de datos...\n');

    try {
        // 1. Verificar conexión a MongoDB
        console.log('📡 Conectando a MongoDB Atlas...');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Conexión exitosa a MongoDB Atlas\n');

        // 2. Verificar datos en archivos JSON
        console.log('📋 Verificando archivos JSON de origen...');
        
        const heroesPath = path.join(process.cwd(), 'src', 'data', 'heroes.json');
        const mascotasPath = path.join(process.cwd(), 'src', 'data', 'mascotas.json');
        
        let heroesData = [];
        let mascotasData = [];
        
        if (fs.existsSync(heroesPath)) {
            const heroesContent = fs.readFileSync(heroesPath, 'utf8');
            heroesData = JSON.parse(heroesContent);
            console.log(`✅ Archivo heroes.json encontrado: ${heroesData.length} héroes`);
        } else {
            console.log('⚠️ Archivo heroes.json no encontrado');
        }
        
        if (fs.existsSync(mascotasPath)) {
            const mascotasContent = fs.readFileSync(mascotasPath, 'utf8');
            mascotasData = JSON.parse(mascotasContent);
            console.log(`✅ Archivo mascotas.json encontrado: ${mascotasData.length} mascotas`);
        } else {
            console.log('⚠️ Archivo mascotas.json no encontrado');
        }
        
        console.log('');

        // 3. Verificar datos en MongoDB
        console.log('🗄️ Verificando datos en MongoDB...');
        
        const heroesCount = await Hero.countDocuments();
        const mascotasCount = await Mascota.countDocuments();
        
        console.log(`📊 Héroes en MongoDB: ${heroesCount}`);
        console.log(`📊 Mascotas en MongoDB: ${mascotasCount}`);
        console.log('');

        // 4. Comparar datos
        console.log('🔍 Comparando datos...');
        
        if (heroesData.length > 0) {
            if (heroesCount === heroesData.length) {
                console.log('✅ Todos los héroes han sido migrados correctamente');
            } else if (heroesCount > 0) {
                console.log(`⚠️ Migración parcial: ${heroesCount}/${heroesData.length} héroes migrados`);
            } else {
                console.log('❌ No hay héroes migrados en MongoDB');
            }
        }
        
        if (mascotasData.length > 0) {
            if (mascotasCount === mascotasData.length) {
                console.log('✅ Todas las mascotas han sido migradas correctamente');
            } else if (mascotasCount > 0) {
                console.log(`⚠️ Migración parcial: ${mascotasCount}/${mascotasData.length} mascotas migradas`);
            } else {
                console.log('❌ No hay mascotas migradas en MongoDB');
            }
        }
        
        console.log('');

        // 5. Verificar referencias
        console.log('🔗 Verificando referencias entre héroes y mascotas...');
        
        const heroesWithMascotas = await Hero.countDocuments({ mascotas: { $exists: true, $ne: [] } });
        const mascotasWithHeroes = await Mascota.countDocuments({ adoptadoPor: { $exists: true, $ne: null } });
        
        console.log(`👥 Héroes con mascotas: ${heroesWithMascotas}`);
        console.log(`🐾 Mascotas con héroes: ${mascotasWithHeroes}`);
        console.log('');

        // 6. Mostrar algunos ejemplos
        console.log('📝 Ejemplos de datos migrados:');
        
        const sampleHero = await Hero.findOne().populate('mascotas');
        if (sampleHero) {
            console.log(`\n👤 Héroe ejemplo:`);
            console.log(`   - ID: ${sampleHero.id}`);
            console.log(`   - Nombre: ${sampleHero.nombre}`);
            console.log(`   - Alias: ${sampleHero.alias}`);
            console.log(`   - Mascotas: ${sampleHero.mascotas.length}`);
        }
        
        const sampleMascota = await Mascota.findOne();
        if (sampleMascota) {
            console.log(`\n🐕 Mascota ejemplo:`);
            console.log(`   - ID: ${sampleMascota.id}`);
            console.log(`   - Nombre: ${sampleMascota.nombre}`);
            console.log(`   - Tipo: ${sampleMascota.tipo}`);
            console.log(`   - Adoptada por: ${sampleMascota.adoptadoPor || 'Ninguno'}`);
        }
        
        console.log('');

        // 7. Resumen final
        console.log('📊 RESUMEN DE VERIFICACIÓN:');
        console.log('========================');
        console.log(`✅ Conexión MongoDB: ${mongoose.connection.readyState === 1 ? 'ACTIVA' : 'INACTIVA'}`);
        console.log(`📋 Héroes en JSON: ${heroesData.length}`);
        console.log(`🗄️ Héroes en MongoDB: ${heroesCount}`);
        console.log(`📋 Mascotas en JSON: ${mascotasData.length}`);
        console.log(`🗄️ Mascotas en MongoDB: ${mascotasCount}`);
        
        if (heroesCount === heroesData.length && mascotasCount === mascotasData.length) {
            console.log('\n🎉 ¡MIGRACIÓN COMPLETA Y EXITOSA!');
        } else if (heroesCount > 0 || mascotasCount > 0) {
            console.log('\n⚠️ MIGRACIÓN PARCIAL - Algunos datos están migrados');
        } else {
            console.log('\n❌ NO HAY DATOS MIGRADOS - Ejecuta el script de migración');
        }

    } catch (error) {
        console.error('❌ Error durante la verificación:', error.message);
    } finally {
        // Cerrar conexión
        await mongoose.connection.close();
        console.log('\n🔌 Conexión cerrada');
    }
};

// Ejecutar verificación
verifyMigration(); 