import fs from 'fs/promises';
import path from 'path';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import connectDB from './src/config/database.js';
import Hero from './src/models/Hero.js';
import Mascota from './src/models/Mascota.js';

// Cargar variables de entorno
dotenv.config({ path: './config.env' });

class Migrator {
    constructor() {
        this.stats = {
            heroes: { total: 0, created: 0, updated: 0, errors: 0 },
            mascotas: { total: 0, created: 0, updated: 0, errors: 0 }
        };
    }

    async init() {
        try {
            console.log('🚀 Iniciando migración a MongoDB Atlas...');
            await connectDB();
            console.log('✅ Conexión a MongoDB establecida');
        } catch (error) {
            console.error('❌ Error conectando a MongoDB:', error.message);
            process.exit(1);
        }
    }

    async loadJSONData(filePath) {
        try {
            const data = await fs.readFile(filePath, 'utf8');
            return JSON.parse(data);
        } catch (error) {
            console.error(`❌ Error leyendo archivo ${filePath}:`, error.message);
            return null;
        }
    }

    async migrateHeroes() {
        console.log('\n📋 Migrando héroes...');
        
        const heroesData = await this.loadJSONData('./src/data/superheroes.json');
        if (!heroesData) {
            console.log('⚠️ No se pudieron cargar los datos de héroes');
            return;
        }

        this.stats.heroes.total = heroesData.length;
        console.log(`📊 Total de héroes a migrar: ${this.stats.heroes.total}`);

        for (const heroData of heroesData) {
            try {
                // Verificar si el héroe ya existe
                const existingHero = await Hero.findOne({ id: heroData.id });
                
                // Mapear campos del JSON al modelo
                const heroToSave = {
                    id: heroData.id,
                    nombre: heroData.name || heroData.nombre || 'Sin nombre',
                    alias: heroData.alias,
                    poder: heroData.poder || heroData.team || 'Sin poder específico',
                    edad: heroData.edad || 25, // Edad por defecto
                    ciudad: heroData.city || heroData.ciudad,
                    mascotas: []
                };

                if (existingHero) {
                    // Actualizar héroe existente
                    await Hero.findOneAndUpdate(
                        { id: heroData.id },
                        heroToSave,
                        { new: true, runValidators: true }
                    );
                    this.stats.heroes.updated++;
                    console.log(`🔄 Héroe actualizado: ${heroData.alias}`);
                } else {
                    // Crear nuevo héroe
                    const newHero = new Hero(heroToSave);
                    await newHero.save();
                    this.stats.heroes.created++;
                    console.log(`✅ Héroe creado: ${heroData.alias}`);
                }
            } catch (error) {
                this.stats.heroes.errors++;
                console.error(`❌ Error con héroe ${heroData.alias}:`, error.message);
            }
        }
    }

    async migrateMascotas() {
        console.log('\n🐾 Migrando mascotas...');
        
        const mascotasData = await this.loadJSONData('./src/data/mascotas.json');
        if (!mascotasData) {
            console.log('⚠️ No se pudieron cargar los datos de mascotas');
            return;
        }

        this.stats.mascotas.total = mascotasData.length;
        console.log(`📊 Total de mascotas a migrar: ${this.stats.mascotas.total}`);

        for (const mascotaData of mascotasData) {
            try {
                // Verificar si la mascota ya existe
                const existingMascota = await Mascota.findOne({ id: mascotaData.id });
                
                // Preparar datos de la mascota
                const mascotaToSave = {
                    id: mascotaData.id,
                    nombre: mascotaData.nombre,
                    tipo: mascotaData.tipo,
                    poder: mascotaData.poder,
                    edad: mascotaData.edad,
                    energia: mascotaData.energia || 100,
                    descripcion: mascotaData.descripcion,
                    idLugar: mascotaData.idLugar || 1, // Valor por defecto si no existe
                    adoptadoPor: mascotaData.adoptadoPor,
                    salud: mascotaData.salud || 100,
                    felicidad: mascotaData.felicidad || 100,
                    personalidad: mascotaData.personalidad || 'amigable',
                    ultimaAlimentacion: new Date(mascotaData.ultimaAlimentacion),
                    ultimoPaseo: new Date(mascotaData.ultimoPaseo),
                    items: mascotaData.items || []
                };

                // Manejar enfermedad si existe
                if (mascotaData.enfermedad) {
                    mascotaToSave.enfermedad = {
                        tipo: mascotaData.enfermedad.tipo,
                        nombre: mascotaData.enfermedad.nombre,
                        impactoSalud: mascotaData.enfermedad.impactoSalud,
                        impactoFelicidad: mascotaData.enfermedad.impactoFelicidad,
                        duracion: mascotaData.enfermedad.duracion,
                        inicio: new Date(mascotaData.enfermedad.inicio),
                        causa: mascotaData.enfermedad.causa
                    };
                }

                // Manejar inmunidades si existen
                if (mascotaData.inmunidades) {
                    mascotaToSave.inmunidades = new Map();
                    for (const [enfermedad, inmunidad] of Object.entries(mascotaData.inmunidades)) {
                        mascotaToSave.inmunidades.set(enfermedad, {
                            hasta: new Date(inmunidad.hasta)
                        });
                    }
                }

                if (existingMascota) {
                    // Actualizar mascota existente
                    await Mascota.findOneAndUpdate(
                        { id: mascotaData.id },
                        mascotaToSave,
                        { new: true, runValidators: true }
                    );
                    this.stats.mascotas.updated++;
                    console.log(`🔄 Mascota actualizada: ${mascotaData.nombre}`);
                } else {
                    // Crear nueva mascota
                    const newMascota = new Mascota(mascotaToSave);
                    await newMascota.save();
                    this.stats.mascotas.created++;
                    console.log(`✅ Mascota creada: ${mascotaData.nombre}`);
                }
            } catch (error) {
                this.stats.mascotas.errors++;
                console.error(`❌ Error con mascota ${mascotaData.nombre}:`, error.message);
            }
        }
    }

    async updateHeroMascotas() {
        console.log('\n🔗 Actualizando referencias de mascotas en héroes...');
        
        try {
            const mascotas = await Mascota.find({ adoptadoPor: { $ne: null } });
            
            for (const mascota of mascotas) {
                const hero = await Hero.findOne({ id: mascota.adoptadoPor });
                if (hero && !hero.mascotas.includes(mascota._id)) {
                    hero.mascotas.push(mascota._id);
                    await hero.save();
                    console.log(`🔗 Mascota ${mascota.nombre} vinculada a héroe ${hero.alias}`);
                }
            }
        } catch (error) {
            console.error('❌ Error actualizando referencias:', error.message);
        }
    }

    async validateMigration() {
        console.log('\n🔍 Validando migración...');
        
        try {
            const totalHeroes = await Hero.countDocuments();
            const totalMascotas = await Mascota.countDocuments();
            const mascotasDisponibles = await Mascota.countDocuments({ adoptadoPor: null });
            const mascotasAdoptadas = await Mascota.countDocuments({ adoptadoPor: { $ne: null } });

            console.log('📊 Estadísticas de la base de datos:');
            console.log(`   👥 Héroes: ${totalHeroes}`);
            console.log(`   🐾 Mascotas totales: ${totalMascotas}`);
            console.log(`   🏠 Mascotas disponibles: ${mascotasDisponibles}`);
            console.log(`   👤 Mascotas adoptadas: ${mascotasAdoptadas}`);

            // Verificar integridad
            const mascotasSinHeroe = await Mascota.find({
                adoptadoPor: { $ne: null },
                adoptadoPor: { $exists: true }
            });

            for (const mascota of mascotasSinHeroe) {
                const hero = await Hero.findOne({ id: mascota.adoptadoPor });
                if (!hero) {
                    console.warn(`⚠️ Mascota ${mascota.nombre} tiene adoptadoPor=${mascota.adoptadoPor} pero el héroe no existe`);
                }
            }

        } catch (error) {
            console.error('❌ Error en validación:', error.message);
        }
    }

    printStats() {
        console.log('\n📈 Estadísticas de migración:');
        console.log('\n👥 HÉROES:');
        console.log(`   Total procesados: ${this.stats.heroes.total}`);
        console.log(`   Creados: ${this.stats.heroes.created}`);
        console.log(`   Actualizados: ${this.stats.heroes.updated}`);
        console.log(`   Errores: ${this.stats.heroes.errors}`);

        console.log('\n🐾 MASCOTAS:');
        console.log(`   Total procesados: ${this.stats.mascotas.total}`);
        console.log(`   Creadas: ${this.stats.mascotas.created}`);
        console.log(`   Actualizadas: ${this.stats.mascotas.updated}`);
        console.log(`   Errores: ${this.stats.mascotas.errors}`);
    }

    async run() {
        const startTime = Date.now();
        
        try {
            await this.init();
            await this.migrateHeroes();
            await this.migrateMascotas();
            await this.updateHeroMascotas();
            await this.validateMigration();
            
            const endTime = Date.now();
            const duration = ((endTime - startTime) / 1000).toFixed(2);
            
            this.printStats();
            console.log(`\n🎉 Migración completada en ${duration} segundos`);
            
        } catch (error) {
            console.error('❌ Error durante la migración:', error.message);
            process.exit(1);
        } finally {
            // Cerrar conexión
            await mongoose.connection.close();
            console.log('🔌 Conexión a MongoDB cerrada');
            process.exit(0);
        }
    }
}

// Ejecutar migración
const migrator = new Migrator();
migrator.run(); 