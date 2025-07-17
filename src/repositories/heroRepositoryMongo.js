import Hero from '../models/Hero.js';

class HeroRepositoryMongo {
    async getAllHeroes() {
        try {
            return await Hero.find().populate('mascotas');
        } catch (error) {
            throw new Error(`Error obteniendo héroes: ${error.message}`);
        }
    }

    async getHeroById(id) {
        try {
            return await Hero.findOne({ id }).populate('mascotas');
        } catch (error) {
            throw new Error(`Error obteniendo héroe con ID ${id}: ${error.message}`);
        }
    }

    async getHeroByAlias(alias) {
        try {
            return await Hero.findByAlias(alias).populate('mascotas');
        } catch (error) {
            throw new Error(`Error obteniendo héroe con alias ${alias}: ${error.message}`);
        }
    }

    async getHeroesByCity(ciudad) {
        try {
            return await Hero.findByCity(ciudad).populate('mascotas');
        } catch (error) {
            throw new Error(`Error obteniendo héroes de ${ciudad}: ${error.message}`);
        }
    }

    async createHero(heroData) {
        try {
            const newHero = new Hero(heroData);
            return await newHero.save();
        } catch (error) {
            throw new Error(`Error creando héroe: ${error.message}`);
        }
    }

    async updateHero(id, updateData) {
        try {
            return await Hero.findOneAndUpdate(
                { id },
                updateData,
                { new: true, runValidators: true }
            ).populate('mascotas');
        } catch (error) {
            throw new Error(`Error actualizando héroe con ID ${id}: ${error.message}`);
        }
    }

    async deleteHero(id) {
        try {
            return await Hero.findOneAndDelete({ id });
        } catch (error) {
            throw new Error(`Error eliminando héroe con ID ${id}: ${error.message}`);
        }
    }

    async addMascotaToHero(heroId, mascotaId) {
        try {
            const hero = await Hero.findOne({ id: heroId });
            if (!hero) {
                throw new Error(`Héroe con ID ${heroId} no encontrado`);
            }
            
            if (!hero.mascotas.includes(mascotaId)) {
                hero.mascotas.push(mascotaId);
                await hero.save();
            }
            
            return await hero.populate('mascotas');
        } catch (error) {
            throw new Error(`Error añadiendo mascota al héroe: ${error.message}`);
        }
    }

    async removeMascotaFromHero(heroId, mascotaId) {
        try {
            const hero = await Hero.findOne({ id: heroId });
            if (!hero) {
                throw new Error(`Héroe con ID ${heroId} no encontrado`);
            }
            
            hero.mascotas = hero.mascotas.filter(id => id.toString() !== mascotaId.toString());
            await hero.save();
            
            return await hero.populate('mascotas');
        } catch (error) {
            throw new Error(`Error removiendo mascota del héroe: ${error.message}`);
        }
    }

    async getHeroesWithMascotas() {
        try {
            return await Hero.find({ mascotas: { $exists: true, $ne: [] } }).populate('mascotas');
        } catch (error) {
            throw new Error(`Error obteniendo héroes con mascotas: ${error.message}`);
        }
    }

    async getHeroesWithoutMascotas() {
        try {
            return await Hero.find({ $or: [{ mascotas: { $exists: false } }, { mascotas: { $size: 0 } }] });
        } catch (error) {
            throw new Error(`Error obteniendo héroes sin mascotas: ${error.message}`);
        }
    }
}

export default new HeroRepositoryMongo(); 