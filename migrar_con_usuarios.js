import fs from 'fs-extra';
import dotenv from 'dotenv';
import connectDB from './src/config/database.js';
import Mascota from './src/models/Mascota.js';
import Hero from './src/models/Hero.js';
import Usuario from './src/models/Usuario.js';

// Cargar variables de entorno
dotenv.config({ path: './config.env' });

async function migrarConUsuarios() {
    try {
        console.log('🔄 Iniciando migración con sistema de usuarios...');
        
        // Conectar a MongoDB
        await connectDB();
        
        // Crear usuario de prueba
        console.log('👤 Creando usuario de prueba...');
        const usuarioPrueba = new Usuario({
            username: 'jugador1',
            email: 'jugador1@test.com',
            password: '123456',
            nombre: 'Jugador',
            apellido: 'Uno',
            nivel: 5,
            experiencia: 2500,
            monedas: 500,
            gemas: 25
        });
        
        await usuarioPrueba.save();
        console.log(`✅ Usuario creado: ${usuarioPrueba.username} (ID: ${usuarioPrueba._id})`);
        
        // Leer datos del archivo JSON
        const filePath = './src/data/mascotas.json';
        const mascotasData = await fs.readJson(filePath);
        
        console.log(`📊 Encontradas ${mascotasData.length} mascotas para migrar`);
        
        // Limpiar colección existente
        await Mascota.deleteMany({});
        console.log('🗑️ Colección de mascotas limpiada');
        
        // Migrar cada mascota asignándola al usuario de prueba
        const mascotasMigradas = [];
        for (const mascotaData of mascotasData) {
            try {
                // Solo migrar mascotas que tengan idLugar (las que fallaron antes)
                if (!mascotaData.idLugar) {
                    console.log(`⚠️ Saltando mascota ${mascotaData.nombre} - falta idLugar`);
                    continue;
                }
                
                // Convertir fechas de string a Date
                const mascotaParaMigrar = {
                    ...mascotaData,
                    propietario: usuarioPrueba._id, // Asignar al usuario de prueba
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
        
        // Crear algunos héroes de prueba
        console.log('🦸 Creando héroes de prueba...');
        await Hero.deleteMany({});
        
        const heroesPrueba = [
            {
                id: 1,
                nombre: 'Bruce Wayne',
                alias: 'Batman',
                poder: 'Inteligencia y tecnología',
                edad: 35,
                ciudad: 'Gotham',
                propietario: usuarioPrueba._id
            },
            {
                id: 2,
                nombre: 'Clark Kent',
                alias: 'Superman',
                poder: 'Super fuerza y vuelo',
                edad: 30,
                ciudad: 'Metropolis',
                propietario: usuarioPrueba._id
            },
            {
                id: 3,
                nombre: 'Diana Prince',
                alias: 'Wonder Woman',
                poder: 'Fuerza amazónica',
                edad: 5000,
                ciudad: 'Themyscira',
                propietario: usuarioPrueba._id
            }
        ];
        
        for (const heroData of heroesPrueba) {
            const nuevoHero = new Hero(heroData);
            await nuevoHero.save();
            console.log(`✅ Héroe creado: ${heroData.alias}`);
        }
        
        // Actualizar usuario con las mascotas y héroes
        const mascotasIds = mascotasMigradas.map(m => m._id);
        const heroesIds = heroesPrueba.map(h => h._id);
        
        usuarioPrueba.mascotas = mascotasIds;
        usuarioPrueba.heroes = heroesIds;
        usuarioPrueba.estadisticas.mascotasAdoptadas = mascotasMigradas.length;
        await usuarioPrueba.save();
        
        console.log(`🎉 Migración completada. ${mascotasMigradas.length} mascotas migradas exitosamente`);
        console.log(`📈 Total de mascotas en MongoDB: ${await Mascota.countDocuments()}`);
        console.log(`📈 Total de héroes en MongoDB: ${await Hero.countDocuments()}`);
        console.log(`📈 Total de usuarios en MongoDB: ${await Usuario.countDocuments()}`);
        
        // Mostrar credenciales de prueba
        console.log('\n🔑 Credenciales de prueba:');
        console.log('Username: jugador1');
        console.log('Email: jugador1@test.com');
        console.log('Password: 123456');
        
        process.exit(0);
    } catch (error) {
        console.error('❌ Error durante la migración:', error);
        process.exit(1);
    }
}

// Ejecutar migración
migrarConUsuarios(); 