import mascotaRepo from '../repositories/mascotaRepository.js';
import heroRepo from '../repositories/heroRepository.js';

// Catálogo de alimentos y sus efectos
const ALIMENTOS = {
    normal: { energiaBoost: 20, saludBoost: 5, felicidadBoost: 10 },
    premium: { energiaBoost: 40, saludBoost: 15, felicidadBoost: 25 },
    especial: { energiaBoost: 60, saludBoost: 30, felicidadBoost: 40, curaEnfermedad: true }
};

// Catálogo de enfermedades
const ENFERMEDADES = {
    resfriado: { nombre: "Resfriado", impactoSalud: -5, impactoFelicidad: -10, duracion: 3 },
    estomacal: { nombre: "Problema estomacal", impactoSalud: -10, impactoFelicidad: -15, duracion: 2 },
    tristeza: { nombre: "Tristeza", impactoSalud: -2, impactoFelicidad: -30, duracion: 4 }
};

// Catálogo de medicamentos
const MEDICAMENTOS = {
    vitaminaC: { cura: ["resfriado"], efectividad: 100 },
    antibiotico: { cura: ["estomacal"], efectividad: 90 },
    antidepresivo: { cura: ["tristeza"], efectividad: 85 },
    medicamentoGeneral: { cura: ["resfriado", "estomacal", "tristeza"], efectividad: 70 }
};

// Función auxiliar para actualizar el estado de una mascota
async function actualizarEstadoMascota(mascota) {
    let huboCambios = false;
    
    // Inicializar atributos si no existen
    if (mascota.salud === undefined) { mascota.salud = 100; huboCambios = true; }
    if (mascota.felicidad === undefined) { mascota.felicidad = 100; huboCambios = true; }
    if (mascota.energia === undefined) { mascota.energia = 100; huboCambios = true; }
    if (mascota.ultimaAlimentacion === undefined) { mascota.ultimaAlimentacion = new Date().toISOString(); huboCambios = true; }
    if (mascota.ultimoPaseo === undefined) { mascota.ultimoPaseo = new Date().toISOString(); huboCambios = true; }
    if (mascota.inmunidades === undefined) { mascota.inmunidades = {}; huboCambios = true; }

    const ahora = new Date();
    const ultimaAlimentacion = new Date(mascota.ultimaAlimentacion);
    const ultimoPaseo = new Date(mascota.ultimoPaseo);
    const horasSinComer = (ahora - ultimaAlimentacion) / (1000 * 60 * 60);
    const horasSinPasear = (ahora - ultimoPaseo) / (1000 * 60 * 60);

    // Aplicar efectos de enfermedad activa
    if (mascota.enfermedad) {
        const enfermedad = ENFERMEDADES[mascota.enfermedad.tipo];
        if (enfermedad) {
            const inicioEnfermedad = new Date(mascota.enfermedad.inicio);
            const horasEnfermo = (ahora - inicioEnfermedad) / (1000 * 60 * 60);
            
            // Efecto continuo cada 6 horas
            if (horasEnfermo > 0 && horasEnfermo % 6 < 1) {
                mascota.salud = Math.max(0, mascota.salud + enfermedad.impactoSalud);
                mascota.felicidad = Math.max(0, mascota.felicidad + enfermedad.impactoFelicidad);
                huboCambios = true;
            }
        }
    }

    // Guardar si hubo cambios
    if (huboCambios) {
        const mascotas = await mascotaRepo.getMascotas();
        const index = mascotas.findIndex(m => m.id === mascota.id);
        if (index !== -1) {
            mascotas[index] = mascota;
            await mascotaRepo.saveMascotas(mascotas);
        }
    }
    
    return { ahora, horasSinComer, horasSinPasear };
}

// Alimentar mascota
async function alimentarMascota(id, tipoAlimento) {
    const mascotas = await mascotaRepo.getMascotas();
    const index = mascotas.findIndex(m => m.id === parseInt(id));
    if (index === -1) throw new Error('Mascota no encontrada');
    
    const mascota = mascotas[index];
    const { ahora } = await actualizarEstadoMascota(mascota);
    
    // Verificar si la mascota ya está muy alimentada
    const ultimaAlimentacion = new Date(mascota.ultimaAlimentacion);
    const horasDesdeUltimaAlimentacion = (ahora - ultimaAlimentacion) / (1000 * 60 * 60);
    
    // Si se alimenta demasiado seguido, puede enfermarse
    if (horasDesdeUltimaAlimentacion < 2) {
        let probabilidadEnfermedad = 0.3; // 30% base
        
        // Verificar si se enferma
        if (Math.random() < probabilidadEnfermedad) {
            mascota.enfermedad = {
                tipo: 'estomacal',
                ...ENFERMEDADES.estomacal,
                inicio: new Date().toISOString(),
                causa: 'sobrealimentación'
            };
            mascota.salud = Math.max(0, mascota.salud - 15);
            mascota.felicidad = Math.max(0, mascota.felicidad - 20);
            
            // Guardar inmediatamente
            mascotas[index] = mascota;
            await mascotaRepo.saveMascotas(mascotas);
            
            const error = new Error(`¡${mascota.nombre} se ha enfermado del estómago por comer demasiado!`);
            error.sugerencias = {
                curar: "Usa el endpoint POST /api/mascotas/:id/curar con medicamento 'antibiotico'",
                prevenir: "Espera al menos 2 horas entre cada alimentación"
            };
            throw error;
        }
    }
    
    const alimento = ALIMENTOS[tipoAlimento] || ALIMENTOS.normal;
    
    // Actualizar estadísticas
    mascota.energia = Math.min(100, mascota.energia + alimento.energiaBoost);
    mascota.salud = Math.min(100, mascota.salud + alimento.saludBoost);
    mascota.felicidad = Math.min(100, mascota.felicidad + alimento.felicidadBoost);
    mascota.ultimaAlimentacion = new Date().toISOString();
    
    // Guardar cambios
    mascotas[index] = mascota;
    await mascotaRepo.saveMascotas(mascotas);
    
    return {
        ...mascota,
        sugerencias: {
            proximaAlimentacion: `Espera al menos 2 horas antes de volver a alimentar`,
            actividades: `Puedes pasear a tu mascota para aumentar su felicidad`
        }
    };
}

// Verificar estado de la mascota
async function verificarEstadoMascota(id) {
    const mascotas = await mascotaRepo.getMascotas();
    const mascota = mascotas.find(m => m.id === parseInt(id));
    if (!mascota) throw new Error('Mascota no encontrada');
    
    await actualizarEstadoMascota(mascota);
    
    return {
        id: mascota.id,
        nombre: mascota.nombre,
        tipo: mascota.tipo,
        estadoGeneral: calcularEstadoGeneral(mascota),
        estadisticas: {
            salud: mascota.salud,
            felicidad: mascota.felicidad,
            energia: mascota.energia
        },
        personalidad: mascota.personalidad,
        enfermedad: mascota.enfermedad,
        inmunidades: mascota.inmunidades || {},
        necesidades: {
            hambre: false,
            paseo: false,
            descanso: mascota.energia < 30
        },
        items: mascota.items || [],
        tiempoSinComer: "0 horas",
        tiempoSinPasear: "0 horas",
        sugerencias: {
            personalidad: "Las mascotas necesitan cuidado regular"
        }
    };
}

// Función auxiliar para calcular estado general
function calcularEstadoGeneral(mascota) {
    const promedio = (mascota.salud + mascota.felicidad + mascota.energia) / 3;
    
    if (promedio >= 80) return "Excelente";
    if (promedio >= 60) return "Bien";
    if (promedio >= 40) return "Regular";
    if (promedio >= 20) return "Mal";
    return "Crítico";
}

// Otras funciones básicas
async function getMascotas() {
    return await mascotaRepo.getMascotas();
}

async function getAllMascotas() {
    const mascotas = await mascotaRepo.getMascotas();
    const heroes = await heroRepo.getHeroes();
    
    return mascotas.map(mascota => {
        const mascotaConDueno = { ...mascota };
        if (mascota.adoptadoPor) {
            const dueno = heroes.find(h => h.id === mascota.adoptadoPor);
            if (dueno) {
                mascotaConDueno.dueno = {
                    id: dueno.id,
                    name: dueno.name,
                    alias: dueno.alias
                };
            }
        }
        return mascotaConDueno;
    });
}

async function getMascotaById(id) {
    const mascotas = await mascotaRepo.getMascotas();
    const mascota = mascotas.find(m => m.id === parseInt(id));
    if (mascota) {
        await actualizarEstadoMascota(mascota);
    }
    return mascota;
}

async function addMascota(mascota) {
    if (!mascota.nombre) throw new Error('El nombre de la mascota es obligatorio');
    if (!mascota.tipo) throw new Error('El tipo de mascota es obligatorio');

    const mascotas = await mascotaRepo.getMascotas();
    const newId = mascotas.length > 0 ? Math.max(...mascotas.map(m => m.id)) + 1 : 1;
    
    const nuevaMascota = { 
        ...mascota, 
        id: newId, 
        adoptadoPor: null,
        edad: mascota.edad || 1,
        energia: mascota.energia || 50,
        salud: mascota.salud || 100,
        felicidad: mascota.felicidad || 100,
        personalidad: mascota.personalidad || "amigable",
        ultimaAlimentacion: new Date().toISOString(),
        ultimoPaseo: new Date().toISOString(),
        enfermedad: null,
        items: []
    };
    
    mascotas.push(nuevaMascota);
    await mascotaRepo.saveMascotas(mascotas);
    return nuevaMascota;
}

// Curar enfermedad
async function curarMascota(id, medicamento) {
    const mascotas = await mascotaRepo.getMascotas();
    const index = mascotas.findIndex(m => m.id === parseInt(id));
    if (index === -1) throw new Error('Mascota no encontrada');
    
    const mascota = mascotas[index];
    await actualizarEstadoMascota(mascota);
    
    if (!mascota.enfermedad) {
        throw new Error('La mascota no está enferma');
    }
    
    const med = MEDICAMENTOS[medicamento];
    if (!med) {
        throw new Error(`Medicamento no reconocido. Medicamentos disponibles: ${Object.keys(MEDICAMENTOS).join(', ')}`);
    }
    
    if (med.cura.includes(mascota.enfermedad.tipo)) {
        mascota.enfermedad = null;
        mascota.salud = Math.min(100, mascota.salud + 10);
        mascota.felicidad = Math.min(100, mascota.felicidad + 15);
        
        mascotas[index] = mascota;
        await mascotaRepo.saveMascotas(mascotas);
        
        return {
            ...mascota,
            mensaje: `${mascota.nombre} ha sido curado exitosamente`
        };
    } else {
        throw new Error(`Este medicamento no es adecuado para ${mascota.enfermedad.nombre}`);
    }
}

// Simular enfermedad (para pruebas)
async function enfermarMascota(id, enfermedadTipo) {
    const mascotas = await mascotaRepo.getMascotas();
    const index = mascotas.findIndex(m => m.id === parseInt(id));
    if (index === -1) throw new Error('Mascota no encontrada');
    
    if (!enfermedadTipo) {
        const enfermedadesPosibles = Object.keys(ENFERMEDADES);
        enfermedadTipo = enfermedadesPosibles[Math.floor(Math.random() * enfermedadesPosibles.length)];
    } else if (!ENFERMEDADES[enfermedadTipo]) {
        throw new Error('Tipo de enfermedad no reconocido');
    }
    
    const mascota = mascotas[index];
    mascota.enfermedad = {
        tipo: enfermedadTipo,
        ...ENFERMEDADES[enfermedadTipo],
        inicio: new Date().toISOString()
    };
    
    mascota.salud = Math.max(0, mascota.salud + ENFERMEDADES[enfermedadTipo].impactoSalud);
    mascota.felicidad = Math.max(0, mascota.felicidad + ENFERMEDADES[enfermedadTipo].impactoFelicidad);
    
    mascotas[index] = mascota;
    await mascotaRepo.saveMascotas(mascotas);
    return mascota;
}

// Funciones placeholder para compatibilidad
async function getMascotasDisponibles() {
    const mascotas = await mascotaRepo.getMascotas();
    return mascotas.filter(m => m.adoptadoPor === null);
}

async function updateMascota(id, updatedMascota) {
    const mascotas = await mascotaRepo.getMascotas();
    const index = mascotas.findIndex(m => m.id === parseInt(id));
    if (index === -1) throw new Error('Mascota no encontrada');
    
    mascotas[index] = { ...mascotas[index], ...updatedMascota };
    await mascotaRepo.saveMascotas(mascotas);
    return mascotas[index];
}

async function deleteMascota(id) {
    const mascotas = await mascotaRepo.getMascotas();
    const index = mascotas.findIndex(m => m.id === parseInt(id));
    if (index === -1) throw new Error('Mascota no encontrada');
    
    const filtered = mascotas.filter(m => m.id !== parseInt(id));
    await mascotaRepo.saveMascotas(filtered);
    return { message: 'Mascota eliminada exitosamente' };
}

async function getMascotasByHeroe(idHeroe) {
    const mascotas = await mascotaRepo.getMascotas();
    return mascotas.filter(m => m.adoptadoPor === parseInt(idHeroe));
}

async function adoptarMascota(idMascota, idHeroe) {
    const heroes = await heroRepo.getHeroes();
    const heroe = heroes.find(h => h.id === parseInt(idHeroe));
    if (!heroe) throw new Error(`Héroe con ID ${idHeroe} no encontrado`);

    const mascotas = await mascotaRepo.getMascotas();
    let index;
    
    if (idMascota === 'aleatorio') {
        const disponibles = mascotas.filter(m => m.adoptadoPor === null);
        if (disponibles.length === 0) {
            throw new Error('No hay mascotas disponibles para adopción');
        }
        const mascotaAleatoria = disponibles[Math.floor(Math.random() * disponibles.length)];
        index = mascotas.findIndex(m => m.id === mascotaAleatoria.id);
    } else {
        index = mascotas.findIndex(m => m.id === parseInt(idMascota));
        if (index === -1) throw new Error(`Mascota con ID ${idMascota} no encontrada`);
        if (mascotas[index].adoptadoPor !== null) {
            throw new Error(`La mascota ya ha sido adoptada`);
        }
    }
    
    mascotas[index].adoptadoPor = parseInt(idHeroe);
    await mascotaRepo.saveMascotas(mascotas);
    return mascotas[index];
}

// Funciones placeholder para las demás funcionalidades
async function pasearMascota(id, duracion) {
    const mascotas = await mascotaRepo.getMascotas();
    const index = mascotas.findIndex(m => m.id === parseInt(id));
    if (index === -1) throw new Error('Mascota no encontrada');
    
    const mascota = mascotas[index];
    await actualizarEstadoMascota(mascota);
    
    // Lógica básica de paseo
    mascota.energia = Math.max(5, mascota.energia - Math.ceil(duracion / 3));
    mascota.felicidad = Math.min(100, mascota.felicidad + Math.min(30, duracion / 2));
    mascota.salud = Math.min(100, mascota.salud + Math.min(15, duracion / 4));
    mascota.ultimoPaseo = new Date().toISOString();
    
    mascotas[index] = mascota;
    await mascotaRepo.saveMascotas(mascotas);
    
    return {
        ...mascota,
        sugerencias: {
            energia: `${mascota.nombre} ha gastado energía durante el paseo`,
            descanso: mascota.energia < 30 ? "Se recomienda descansar" : "Aún tiene buena energía"
        }
    };
}

async function actualizarEstadoMascota(id) {
    const mascotas = await mascotaRepo.getMascotas();
    const mascota = mascotas.find(m => m.id === parseInt(id));
    if (mascota) {
        await actualizarEstadoMascota(mascota);
    }
}

async function agregarItemMascota(id, itemId) {
    const mascotas = await mascotaRepo.getMascotas();
    const index = mascotas.findIndex(m => m.id === parseInt(id));
    if (index === -1) throw new Error('Mascota no encontrada');
    
    if (!mascotas[index].items) mascotas[index].items = [];
    mascotas[index].items.push({ id: parseInt(itemId), nombre: `Item ${itemId}` });
    
    await mascotaRepo.saveMascotas(mascotas);
    return mascotas[index];
}

async function quitarItemMascota(id, itemId) {
    const mascotas = await mascotaRepo.getMascotas();
    const index = mascotas.findIndex(m => m.id === parseInt(id));
    if (index === -1) throw new Error('Mascota no encontrada');
    
    if (!mascotas[index].items) throw new Error('La mascota no tiene items');
    mascotas[index].items = mascotas[index].items.filter(i => i.id !== parseInt(itemId));
    
    await mascotaRepo.saveMascotas(mascotas);
    return mascotas[index];
}

async function getItemsDisponibles(tipo) {
    return [
        { id: 1, nombre: "Sombrero básico", tipo: "cabeza", esPremium: false },
        { id: 2, nombre: "Gafas de sol", tipo: "ojos", esPremium: false },
        { id: 3, nombre: "Collar básico", tipo: "cuello", esPremium: false },
        { id: 4, nombre: "Corona dorada", tipo: "cabeza", esPremium: true },
        { id: 5, nombre: "Alas de ángel", tipo: "espalda", esPremium: true }
    ];
}

async function cambiarPersonalidadMascota(id, personalidad) {
    const mascotas = await mascotaRepo.getMascotas();
    const index = mascotas.findIndex(m => m.id === parseInt(id));
    if (index === -1) throw new Error('Mascota no encontrada');
    
    mascotas[index].personalidad = personalidad;
    await mascotaRepo.saveMascotas(mascotas);
    
    return {
        ...mascotas[index],
        mensaje: `La personalidad de ${mascotas[index].nombre} ha cambiado a ${personalidad}`
    };
}

export default {
    getAllMascotas,
    getMascotasDisponibles,
    getMascotaById,
    addMascota,
    updateMascota,
    deleteMascota,
    getMascotasByHeroe,
    adoptarMascota,
    getMascotas,
    alimentarMascota,
    pasearMascota,
    curarMascota,
    verificarEstadoMascota,
    actualizarEstadoMascota,
    agregarItemMascota,
    quitarItemMascota,
    getItemsDisponibles,
    cambiarPersonalidadMascota,
    enfermarMascota
}; 