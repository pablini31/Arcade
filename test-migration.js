import dotenv from 'dotenv';
import connectDB from './src/config/database.js';
import Hero from './src/models/Hero.js';
import Mascota from './src/models/Mascota.js';

// Cargar variables de entorno
dotenv.config({ path: './config.env' });

async function testMigration() {
    try {
        console.log('🧪 Iniciando pruebas de migración...');
        
        // Conectar a MongoDB
        await connectDB();
        console.log('✅ Conexión establecida');
        
        // Contar documentos
        const heroCount = await Hero.countDocuments();
        const mascotaCount = await Mascota.countDocuments();
        
        console.log(`\n📊 Estadísticas de la base de datos:`);
        console.log(`   👥 Héroes: ${heroCount}`);
        console.log(`   🐾 Mascotas: ${mascotaCount}`);
        
        // Obtener algunos ejemplos
        const heroes = await Hero.find().limit(3);
        const mascotas = await Mascota.find().limit(3);
        
        console.log(`\n👥 Primeros 3 héroes:`);
        heroes.forEach(hero => {
            console.log(`   - ${hero.alias} (${hero.nombre}) de ${hero.ciudad}`);
        });
        
        console.log(`\n🐾 Primeras 3 mascotas:`);
        mascotas.forEach(mascota => {
            console.log(`   - ${mascota.nombre} (${mascota.tipo}) - ${mascota.disponible ? 'Disponible' : 'Adoptada'}`);
        });
        
        // Probar consultas específicas
        const mascotasDisponibles = await Mascota.getDisponibles();
        const mascotasAdoptadas = await Mascota.find({ adoptadoPor: { $ne: null } });
        
        console.log(`\n🏠 Mascotas disponibles: ${mascotasDisponibles.length}`);
        console.log(`👤 Mascotas adoptadas: ${mascotasAdoptadas.length}`);
        
        // Probar búsquedas
        const perros = await Mascota.getByTipo('Perro');
        const gatos = await Mascota.getByTipo('Gato');
        
        console.log(`\n🐕 Perros: ${perros.length}`);
        console.log(`🐱 Gatos: ${gatos.length}`);
        
        // Probar personalidades
        const amigables = await Mascota.getByPersonalidad('amigable');
        console.log(`😊 Mascotas amigables: ${amigables.length}`);
        
        // Probar búsqueda de héroes
        const heroesConMascotas = await Hero.find().populate('mascotas');
        const heroesConMascotasCount = heroesConMascotas.filter(h => h.mascotas.length > 0).length;
        
        console.log(`\n👥 Héroes con mascotas: ${heroesConMascotasCount}`);
        
        // Verificar integridad
        console.log(`\n🔍 Verificando integridad de datos...`);
        
        const mascotasSinHeroe = await Mascota.find({
            adoptadoPor: { $ne: null }
        });
        
        let erroresIntegridad = 0;
        for (const mascota of mascotasSinHeroe) {
            const hero = await Hero.findOne({ id: mascota.adoptadoPor });
            if (!hero) {
                console.log(`⚠️ Mascota ${mascota.nombre} tiene adoptadoPor=${mascota.adoptadoPor} pero el héroe no existe`);
                erroresIntegridad++;
            }
        }
        
        if (erroresIntegridad === 0) {
            console.log(`✅ Integridad de datos verificada - Sin errores`);
        } else {
            console.log(`❌ Se encontraron ${erroresIntegridad} errores de integridad`);
        }
        
        console.log(`\n🎉 Pruebas completadas exitosamente!`);
        
    } catch (error) {
        console.error('❌ Error en las pruebas:', error.message);
    } finally {
        // Cerrar conexión
        await mongoose.connection.close();
        console.log('🔌 Conexión cerrada');
        process.exit(0);
    }
}

// Ejecutar pruebas
testMigration(); 