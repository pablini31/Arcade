import fs from 'fs-extra';
import Mascota from '../models/mascotaModel.js';

const filePath = './src/data/mascotas.json';

async function getMascotas() {
    try {
        const data = await fs.readJson(filePath);
        // Pasar todos los campos usando spread operator
        return data.map(m => new Mascota(
            m.id, m.nombre, m.tipo, m.poder, m.edad, m.energia, m.descripcion, m.idLugar, m.adoptadoPor,
            m.salud, m.felicidad, m.personalidad, m.ultimaAlimentacion, m.ultimoPaseo, m.enfermedad, m.items, m.inmunidades
        ));
    } catch (error) {
        console.error(error);
        return [];
    }
}

async function saveMascotas(mascotas) {
    try {
        await fs.writeJson(filePath, mascotas);
    } catch (error) {
        console.error(error);
    }
}

export default {
    getMascotas,
    saveMascotas
}; 