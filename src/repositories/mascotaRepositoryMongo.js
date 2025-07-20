import Mascota from '../models/Mascota.js';
import mongoose from 'mongoose';

class MascotaRepositoryMongo {
    async getAllMascotas() {
        try {
            return await Mascota.find();
        } catch (error) {
            throw new Error(`Error obteniendo mascotas: ${error.message}`);
        }
    }

    async getMascotaById(id) {
        try {
            return await Mascota.findOne({ id });
        } catch (error) {
            throw new Error(`Error obteniendo mascota con ID ${id}: ${error.message}`);
        }
    }

    async getMascotasDisponibles() {
        try {
            return await Mascota.getDisponibles();
        } catch (error) {
            throw new Error(`Error obteniendo mascotas disponibles: ${error.message}`);
        }
    }

    async getMascotasByHeroe(heroId) {
        try {
            return await Mascota.find({ adoptadoPor: heroId });
        } catch (error) {
            throw new Error(`Error obteniendo mascotas del héroe ${heroId}: ${error.message}`);
        }
    }

    async getMascotasByUsuario(usuarioId) {
        try {
            // Usar ObjectId para que coincida con el tipo de propietario en la base de datos
            return await Mascota.find({ propietario: new mongoose.Types.ObjectId(usuarioId) });
        } catch (error) {
            throw new Error(`Error obteniendo mascotas del usuario ${usuarioId}: ${error.message}`);
        }
    }

    async getMascotasByTipo(tipo) {
        try {
            return await Mascota.getByTipo(tipo);
        } catch (error) {
            throw new Error(`Error obteniendo mascotas de tipo ${tipo}: ${error.message}`);
        }
    }

    async getMascotasByPersonalidad(personalidad) {
        try {
            return await Mascota.getByPersonalidad(personalidad);
        } catch (error) {
            throw new Error(`Error obteniendo mascotas con personalidad ${personalidad}: ${error.message}`);
        }
    }

    async createMascota(mascotaData) {
        try {
            const newMascota = new Mascota(mascotaData);
            return await newMascota.save();
        } catch (error) {
            throw new Error(`Error creando mascota: ${error.message}`);
        }
    }

    async updateMascota(id, updateData) {
        try {
            return await Mascota.findOneAndUpdate(
                { id },
                updateData,
                { new: true, runValidators: true }
            );
        } catch (error) {
            throw new Error(`Error actualizando mascota con ID ${id}: ${error.message}`);
        }
    }

    async deleteMascota(id) {
        try {
            return await Mascota.findOneAndDelete({ id });
        } catch (error) {
            throw new Error(`Error eliminando mascota con ID ${id}: ${error.message}`);
        }
    }

    async adoptarMascota(mascotaId, heroId, heroAlias) {
        try {
            const mascota = await Mascota.findOne({ id: mascotaId });
            if (!mascota) {
                throw new Error(`Mascota con ID ${mascotaId} no encontrada`);
            }
            
            if (mascota.adoptadoPor !== null) {
                throw new Error(`La mascota ${mascota.nombre} ya ha sido adoptada`);
            }
            
            mascota.adoptadoPor = heroId;
            // No cambiar el propietario - mantener el usuario como propietario
            return await mascota.save();
        } catch (error) {
            throw new Error(`Error adoptando mascota: ${error.message}`);
        }
    }

    async liberarMascota(mascotaId) {
        try {
            const mascota = await Mascota.findOne({ id: mascotaId });
            if (!mascota) {
                throw new Error(`Mascota con ID ${mascotaId} no encontrada`);
            }
            
            mascota.adoptadoPor = null;
            mascota.propietario = null; // Limpiar propietario cuando se libera
            return await mascota.save();
        } catch (error) {
            throw new Error(`Error liberando mascota: ${error.message}`);
        }
    }

    async alimentarMascota(mascotaId, tipoAlimento = 'normal') {
        try {
            const mascota = await Mascota.findOne({ id: mascotaId });
            if (!mascota) {
                throw new Error(`Mascota con ID ${mascotaId} no encontrada`);
            }
            
            mascota.alimentar(tipoAlimento);
            return await mascota.save();
        } catch (error) {
            throw new Error(`Error alimentando mascota: ${error.message}`);
        }
    }

    async pasearMascota(mascotaId, duracion = 30) {
        try {
            const mascota = await Mascota.findOne({ id: mascotaId });
            if (!mascota) {
                throw new Error(`Mascota con ID ${mascotaId} no encontrada`);
            }
            
            mascota.pasear(duracion);
            return await mascota.save();
        } catch (error) {
            throw new Error(`Error paseando mascota: ${error.message}`);
        }
    }

    async agregarItemMascota(mascotaId, item) {
        try {
            const mascota = await Mascota.findOne({ id: mascotaId });
            if (!mascota) {
                throw new Error(`Mascota con ID ${mascotaId} no encontrada`);
            }
            
            mascota.items.push(item);
            return await mascota.save();
        } catch (error) {
            throw new Error(`Error agregando item a mascota: ${error.message}`);
        }
    }

    async quitarItemMascota(mascotaId, itemId) {
        try {
            const mascota = await Mascota.findOne({ id: mascotaId });
            if (!mascota) {
                throw new Error(`Mascota con ID ${mascotaId} no encontrada`);
            }
            
            mascota.items = mascota.items.filter(item => item.id !== itemId);
            return await mascota.save();
        } catch (error) {
            throw new Error(`Error quitando item de mascota: ${error.message}`);
        }
    }

    async cambiarPersonalidadMascota(mascotaId, personalidad) {
        try {
            const mascota = await Mascota.findOne({ id: mascotaId });
            if (!mascota) {
                throw new Error(`Mascota con ID ${mascotaId} no encontrada`);
            }
            
            mascota.personalidad = personalidad;
            return await mascota.save();
        } catch (error) {
            throw new Error(`Error cambiando personalidad de mascota: ${error.message}`);
        }
    }

    async getMascotasEnfermas() {
        try {
            return await Mascota.find({ enfermedad: { $ne: null } });
        } catch (error) {
            throw new Error(`Error obteniendo mascotas enfermas: ${error.message}`);
        }
    }

    async getMascotasPorEnergia(minEnergia, maxEnergia) {
        try {
            return await Mascota.find({
                energia: { $gte: minEnergia, $lte: maxEnergia }
            });
        } catch (error) {
            throw new Error(`Error obteniendo mascotas por energía: ${error.message}`);
        }
    }

    async getMascotasPorSalud(minSalud, maxSalud) {
        try {
            return await Mascota.find({
                salud: { $gte: minSalud, $lte: maxSalud }
            });
        } catch (error) {
            throw new Error(`Error obteniendo mascotas por salud: ${error.message}`);
        }
    }

    async getMascotasPorFelicidad(minFelicidad, maxFelicidad) {
        try {
            return await Mascota.find({
                felicidad: { $gte: minFelicidad, $lte: maxFelicidad }
            });
        } catch (error) {
            throw new Error(`Error obteniendo mascotas por felicidad: ${error.message}`);
        }
    }
}

export default new MascotaRepositoryMongo(); 