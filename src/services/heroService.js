import heroRepository from '../repositories/heroRepositoryMongo.js'

async function getAllHeroes() {
    return await heroRepository.getAllHeroes()
}

async function getHeroById(id) {
    return await heroRepository.getHeroById(parseInt(id));
}

async function addHero(hero) {
    if (!hero.name || !hero.alias) {
        throw new Error("El héroe debe tener un nombre y un alias.")
    }

    // Obtener el siguiente ID disponible
    const heroes = await heroRepository.getAllHeroes()
    const newId = heroes.length > 0 ? Math.max(...heroes.map(h => h.id)) + 1 : 1

    // Crear el objeto de datos para MongoDB
    const heroData = {
        id: newId,
        nombre: hero.name,
        alias: hero.alias,
        poder: hero.poder || 'Sin poder específico',
        edad: hero.edad || 25,
        ciudad: hero.city || 'Ciudad desconocida',
        propietario: hero.propietario || null
    }

    return await heroRepository.createHero(heroData)
}

async function updateHero(id, updatedHero) {
    // Mapear los campos del JSON al modelo de MongoDB
    const updateData = {}
    if (updatedHero.name) updateData.nombre = updatedHero.name
    if (updatedHero.alias) updateData.alias = updatedHero.alias
    if (updatedHero.poder) updateData.poder = updatedHero.poder
    if (updatedHero.edad) updateData.edad = updatedHero.edad
    if (updatedHero.city) updateData.ciudad = updatedHero.city

    return await heroRepository.updateHero(parseInt(id), updateData)
}

async function deleteHero(id) {
    const result = await heroRepository.deleteHero(parseInt(id))
    if (!result) {
        throw new Error('Héroe no encontrado')
    }
    return { message: 'Héroe eliminado' }
}

async function findHeroesByCity(city) {
    return await heroRepository.getHeroesByCity(city)
}

async function faceVillain(heroId, villain) {
    const hero = await heroRepository.getHeroById(parseInt(heroId))
    if (!hero) {
        throw new Error('Héroe no encontrado')
    }
    return `${hero.alias} enfrenta a ${villain}`
}

export default {
    getAllHeroes,
    getHeroById,
    addHero,
    updateHero,
    deleteHero,
    findHeroesByCity,
    faceVillain
} 