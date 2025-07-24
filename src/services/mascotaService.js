import mascotaRepo from '../repositories/mascotaRepositoryMongo.js';
import heroRepo from '../repositories/heroRepositoryMongo.js';

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

// Catálogo de items con efectos
const ITEMS_CATALOGO = {
    1: { 
        id: 1, 
        nombre: "Sombrero básico", 
        tipo: "cabeza", 
        esPremium: false,
        efecto: { felicidad: 5 },
        descripcion: "Un sombrero simple que hace feliz a tu mascota"
    },
    2: { 
        id: 2, 
        nombre: "Gafas de sol", 
        tipo: "ojos", 
        esPremium: false,
        efecto: { felicidad: 3, energia: 2 },
        descripcion: "Gafas que protegen del sol y dan energía"
    },
    3: { 
        id: 3, 
        nombre: "Collar básico", 
        tipo: "cuello", 
        esPremium: false,
        efecto: { salud: 5 },
        descripcion: "Un collar que mejora la salud"
    },
    4: { 
        id: 4, 
        nombre: "Corona dorada", 
        tipo: "cabeza", 
        esPremium: true,
        efecto: { felicidad: 15, salud: 10, energia: 10 },
        descripcion: "Una corona real que mejora todas las estadísticas"
    },
    5: { 
        id: 5, 
        nombre: "Alas de ángel", 
        tipo: "espalda", 
        esPremium: true,
        efecto: { energia: 20, felicidad: 10 },
        descripcion: "Alas mágicas que dan mucha energía"
    },
    6: { 
        id: 6, 
        nombre: "Capa de superhéroe", 
        tipo: "espalda", 
        esPremium: false,
        efecto: { felicidad: 8, salud: 5 },
        descripcion: "Una capa que hace sentir especial a tu mascota"
    },
    7: { 
        id: 7, 
        nombre: "Collar de protección", 
        tipo: "cuello", 
        esPremium: true,
        efecto: { salud: 15, inmunidad: ["resfriado"] },
        descripcion: "Un collar mágico que protege de enfermedades"
    },
    8: { 
        id: 8, 
        nombre: "Gafas de visión nocturna", 
        tipo: "ojos", 
        esPremium: true,
        efecto: { energia: 10, felicidad: 5, visionNocturna: true },
        descripcion: "Gafas especiales para ver en la oscuridad"
    },
    9: { 
        id: 9, 
        nombre: "Casco de batalla", 
        tipo: "cabeza", 
        esPremium: true,
        efecto: { salud: 20, proteccion: true },
        descripcion: "Un casco que protege de daños"
    },
    10: { 
        id: 10, 
        nombre: "Collar de telepatía", 
        tipo: "cuello", 
        esPremium: true,
        efecto: { felicidad: 12, telepatia: true },
        descripcion: "Un collar que permite comunicación telepática"
    }
};

// Función auxiliar para actualizar el estado de una mascota
async function actualizarEstadoMascota(mascota) {
    let huboCambios = false;
    
    // Inicializar atributos si no existen
    if (mascota.salud === undefined) { mascota.salud = 100; huboCambios = true; }
    if (mascota.felicidad === undefined) { mascota.felicidad = 100; huboCambios = true; }
    if (mascota.energia === undefined) { mascota.energia = 100; huboCambios = true; }
    if (mascota.ultimaAlimentacion === undefined) { mascota.ultimaAlimentacion = null; huboCambios = true; }
    if (mascota.ultimoPaseo === undefined) { mascota.ultimoPaseo = new Date(); huboCambios = true; }
    if (mascota.inmunidades === undefined) { mascota.inmunidades = {}; huboCambios = true; }

    const ahora = new Date();
    const ultimoPaseo = new Date(mascota.ultimoPaseo);
    const horasSinPasear = (ahora - ultimoPaseo) / (1000 * 60 * 60);
    
    // Calcular horas sin comer solo si la mascota ya se ha alimentado antes
    let horasSinComer = 0;
    if (mascota.ultimaAlimentacion) {
        const ultimaAlimentacion = new Date(mascota.ultimaAlimentacion);
        horasSinComer = (ahora - ultimaAlimentacion) / (1000 * 60 * 60);
    }

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
        await mascota.save();
    }
    
    return { ahora, horasSinComer, horasSinPasear };
}

// Alimentar mascota
async function alimentarMascota(id, tipoAlimento) {
    const mascota = await mascotaRepo.getMascotaById(id);
    if (!mascota) throw new Error('Mascota no encontrada');
    
    const { ahora } = await actualizarEstadoMascota(mascota);
    
    // Verificar si la mascota ya está muy alimentada
    let horasDesdeUltimaAlimentacion = 0;
    
    if (mascota.ultimaAlimentacion) {
        const ultimaAlimentacion = new Date(mascota.ultimaAlimentacion);
        horasDesdeUltimaAlimentacion = (ahora - ultimaAlimentacion) / (1000 * 60 * 60);
    }
    
    // Solo verificar sobrealimentación si han pasado menos de 2 horas Y no es la primera comida
    // La primera comida se detecta cuando ultimaAlimentacion es null o la diferencia es muy pequeña
    if (mascota.ultimaAlimentacion && horasDesdeUltimaAlimentacion < 2 && horasDesdeUltimaAlimentacion > 0.016) { // 0.016 horas = ~1 minuto
        let probabilidadEnfermedad = 0.3; // 30% base
        
        // Verificar si se enferma
        if (Math.random() < probabilidadEnfermedad) {
            mascota.enfermedad = {
                tipo: 'estomacal',
                ...ENFERMEDADES.estomacal,
                inicio: new Date(),
                causa: 'sobrealimentación'
            };
            mascota.salud = Math.max(0, mascota.salud - 15);
            mascota.felicidad = Math.max(0, mascota.felicidad - 20);
            
            // Guardar inmediatamente
            await mascota.save();
            
            const error = new Error(`¡${mascota.nombre} se ha enfermado del estómago por comer demasiado!`);
            error.sugerencias = {
                curar: "Usa el endpoint POST /api/mascotas/:id/curar con medicamento 'antibiotico'",
                prevenir: "Espera al menos 2 horas entre cada alimentación"
            };
            error.estadoMascota = mascota;
            throw error;
        }
    }
    
    const alimento = ALIMENTOS[tipoAlimento] || ALIMENTOS.normal;
    
    // Actualizar estadísticas
    mascota.energia = Math.min(100, mascota.energia + alimento.energiaBoost);
    mascota.salud = Math.min(100, mascota.salud + alimento.saludBoost);
    mascota.felicidad = Math.min(100, mascota.felicidad + alimento.felicidadBoost);
    mascota.ultimaAlimentacion = new Date();
    
    // Guardar cambios
    await mascota.save();
    
    return {
        ...mascota.toObject(),
        sugerencias: {
            proximaAlimentacion: `Espera al menos 2 horas antes de volver a alimentar`,
            actividades: `Puedes pasear a tu mascota para aumentar su felicidad`
        }
    };
}

// Verificar estado de la mascota
async function verificarEstadoMascota(id) {
    let mascota = await mascotaRepo.getMascotaById(id);
    if (!mascota) throw new Error('Mascota no encontrada');
    
    await actualizarEstadoMascota(mascota);
    // Esperar 50ms para asegurar que el guardado se complete
    await new Promise(resolve => setTimeout(resolve, 50));
    // Volver a leer la mascota actualizada
    mascota = await mascotaRepo.getMascotaById(id);
    
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
    return await mascotaRepo.getAllMascotas();
}

async function getAllMascotas() {
    const mascotas = await mascotaRepo.getAllMascotas();
    const heroes = await heroRepo.getAllHeroes();
    
    return mascotas.map(mascota => {
        const mascotaConDueno = { ...mascota.toObject() };
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
    const mascota = await mascotaRepo.getMascotaById(id);
    if (mascota) {
        await actualizarEstadoMascota(mascota);
    }
    return mascota;
}

async function addMascota(mascota) {
    // Validar campos requeridos
    if (!mascota.nombre) throw new Error('El nombre de la mascota es obligatorio');
    if (!mascota.tipo) throw new Error('El tipo de mascota es obligatorio');
    if (!mascota.poder) throw new Error('El poder de la mascota es obligatorio');
    if (!mascota.edad) throw new Error('La edad de la mascota es obligatoria');
    if (!mascota.descripcion) throw new Error('La descripción de la mascota es obligatoria');
    if (!mascota.idLugar) throw new Error('El ID del lugar es obligatorio');
    // El propietario es opcional - las mascotas pueden crearse sin propietario inicialmente

    const mascotas = await mascotaRepo.getAllMascotas();
    const newId = mascotas.length > 0 ? Math.max(...mascotas.map(m => m.id)) + 1 : 1;
    
    const nuevaMascota = { 
        ...mascota, 
        id: newId, 
        propietario: mascota.usuarioId || null, // El propietario es opcional
        adoptadoPor: null,
        energia: 20,         // Valor bajo inicial
        salud: 30,           // Valor bajo inicial
        felicidad: 15,       // Valor bajo inicial
        personalidad: mascota.personalidad || "amigable",
        ultimaAlimentacion: null, // Se establecerá en la primera alimentación
        ultimoPaseo: new Date(),
        enfermedad: null,
        items: []
    };
    
    return await mascotaRepo.createMascota(nuevaMascota);
}

// Curar enfermedad
async function curarMascota(id, medicamento) {
    const mascota = await mascotaRepo.getMascotaById(id);
    if (!mascota) throw new Error('Mascota no encontrada');
    
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
        
        await mascota.save();
        
        return {
            ...mascota.toObject(),
            mensaje: `${mascota.nombre} ha sido curado exitosamente`
        };
    } else {
        throw new Error(`Este medicamento no es adecuado para ${mascota.enfermedad.nombre}`);
    }
}

// Simular enfermedad (para pruebas)
async function enfermarMascota(id, enfermedadTipo) {
    const mascota = await mascotaRepo.getMascotaById(id);
    if (!mascota) throw new Error('Mascota no encontrada');
    
    if (!enfermedadTipo) {
        const enfermedadesPosibles = Object.keys(ENFERMEDADES);
        enfermedadTipo = enfermedadesPosibles[Math.floor(Math.random() * enfermedadesPosibles.length)];
    } else if (!ENFERMEDADES[enfermedadTipo]) {
        throw new Error('Tipo de enfermedad no reconocido');
    }
    
    mascota.enfermedad = {
        tipo: enfermedadTipo,
        ...ENFERMEDADES[enfermedadTipo],
        inicio: new Date()
    };
    
    mascota.salud = Math.max(0, mascota.salud + ENFERMEDADES[enfermedadTipo].impactoSalud);
    mascota.felicidad = Math.max(0, mascota.felicidad + ENFERMEDADES[enfermedadTipo].impactoFelicidad);
    
    await mascota.save();
    return mascota;
}

// Funciones placeholder para compatibilidad
async function getMascotasDisponibles() {
    return await mascotaRepo.getMascotasDisponibles();
}

async function updateMascota(id, updatedMascota) {
    const mascota = await mascotaRepo.updateMascota(id, updatedMascota);
    if (!mascota) throw new Error('Mascota no encontrada');
    return mascota;
}

async function deleteMascota(id) {
    const mascota = await mascotaRepo.deleteMascota(id);
    if (!mascota) throw new Error('Mascota no encontrada');
    return { message: 'Mascota eliminada exitosamente' };
}

async function getMascotasByHeroe(idHeroe) {
    return await mascotaRepo.getMascotasByHeroe(idHeroe);
}

async function getMascotasByUsuario(usuarioId) {
    return await mascotaRepo.getMascotasByUsuario(usuarioId);
}

async function adoptarMascota(idMascota, idHeroe) {
    const heroes = await heroRepo.getAllHeroes();
    const heroe = heroes.find(h => h.id === parseInt(idHeroe));
    if (!heroe) throw new Error(`Héroe con ID ${idHeroe} no encontrado`);

    if (idMascota === 'aleatorio') {
        const disponibles = await mascotaRepo.getMascotasDisponibles();
        if (disponibles.length === 0) {
            throw new Error('No hay mascotas disponibles para adopción');
        }
        const mascotaAleatoria = disponibles[Math.floor(Math.random() * disponibles.length)];
        return await mascotaRepo.adoptarMascota(mascotaAleatoria.id, idHeroe, heroe.alias);
    } else {
        return await mascotaRepo.adoptarMascota(idMascota, idHeroe, heroe.alias);
    }
}

// Funciones placeholder para las demás funcionalidades
async function pasearMascota(id, duracion) {
    const mascota = await mascotaRepo.getMascotaById(id);
    if (!mascota) throw new Error('Mascota no encontrada');
    
    await actualizarEstadoMascota(mascota);
    
    // Lógica básica de paseo
    mascota.energia = Math.max(5, mascota.energia - Math.ceil(duracion / 3));
    mascota.felicidad = Math.min(100, mascota.felicidad + Math.min(30, duracion / 2));
    mascota.salud = Math.min(100, mascota.salud + Math.min(15, duracion / 4));
    mascota.ultimoPaseo = new Date();
    
    await mascota.save();
    
    return {
        ...mascota.toObject(),
        sugerencias: {
            energia: `${mascota.nombre} ha gastado energía durante el paseo`,
            descanso: mascota.energia < 30 ? "Se recomienda descansar" : "Aún tiene buena energía"
        }
    };
}

async function actualizarEstadoMascotaPorId(id) {
    const mascota = await mascotaRepo.getMascotaById(id);
    if (mascota) {
        await actualizarEstadoMascota(mascota);
    }
}

async function agregarItemMascota(id, itemOrId) {
    const mascota = await mascotaRepo.getMascotaById(id);
    if (!mascota) throw new Error('Mascota no encontrada');
    
    if (!mascota.items) mascota.items = [];

    // Si itemOrId es un objeto, lo agregamos tal cual
    if (typeof itemOrId === 'object' && itemOrId !== null && !Array.isArray(itemOrId)) {
        mascota.items.push(itemOrId);
    } else {
        // Si es un id, mantenemos compatibilidad agregando un item genérico
        mascota.items.push({ id: itemOrId, nombre: `Item ${itemOrId}` });
    }
    
    await mascota.save();
    
    return {
        ...mascota.toObject(),
        mensajeAdicional: `¡Item personalizado agregado!` 
    };
}

async function quitarItemMascota(id, itemId) {
    const mascota = await mascotaRepo.getMascotaById(id);
    if (!mascota) throw new Error('Mascota no encontrada');
    
    if (!mascota.items) throw new Error('La mascota no tiene items');
    
    // Buscar el item a quitar
    const itemAQuitar = mascota.items.find(i => i.id === parseInt(itemId));
    if (!itemAQuitar) {
        throw new Error(`Item con ID ${itemId} no encontrado en la mascota`);
    }
    
    // Obtener información del catálogo para revertir efectos
    const itemCatalogo = ITEMS_CATALOGO[parseInt(itemId)];
    
    // Remover el item
    mascota.items = mascota.items.filter(i => i.id !== parseInt(itemId));
    
    // Revertir efectos del item (solo si existe en el catálogo)
    if (itemCatalogo && itemCatalogo.efecto) {
        if (itemCatalogo.efecto.felicidad) {
            mascota.felicidad = Math.max(0, mascota.felicidad - itemCatalogo.efecto.felicidad);
        }
        if (itemCatalogo.efecto.salud) {
            mascota.salud = Math.max(0, mascota.salud - itemCatalogo.efecto.salud);
        }
        if (itemCatalogo.efecto.energia) {
            mascota.energia = Math.max(0, mascota.energia - itemCatalogo.efecto.energia);
        }
        if (itemCatalogo.efecto.inmunidad && mascota.inmunidades) {
            itemCatalogo.efecto.inmunidad.forEach(enfermedad => {
                delete mascota.inmunidades[enfermedad];
            });
        }
    }
    
    await mascota.save();
    
    return {
        ...mascota.toObject(),
        mensajeAdicional: itemCatalogo ? 
            `¡${itemCatalogo.nombre} ha sido removido! Efectos revertidos.` : 
            `Item removido exitosamente.`
    };
}

async function getItemsDisponibles(tipo) {
    let items = Object.values(ITEMS_CATALOGO);
    
    // Filtrar por tipo si se especifica
    if (tipo) {
        if (tipo === 'free') {
            items = items.filter(item => !item.esPremium);
        } else if (tipo === 'premium') {
            items = items.filter(item => item.esPremium);
        } else {
            // Filtrar por tipo específico (cabeza, ojos, cuello, espalda)
            items = items.filter(item => item.tipo === tipo);
        }
    }
    
    return items.map(item => ({
        id: item.id,
        nombre: item.nombre,
        tipo: item.tipo,
        esPremium: item.esPremium,
        descripcion: item.descripcion,
        efecto: item.efecto
    }));
}

async function cambiarPersonalidadMascota(id, personalidad) {
    const mascota = await mascotaRepo.getMascotaById(id);
    if (!mascota) throw new Error('Mascota no encontrada');
    
    mascota.personalidad = personalidad;
    await mascota.save();
    
    return {
        ...mascota.toObject(),
        mensaje: `La personalidad de ${mascota.nombre} ha cambiado a ${personalidad}`
    };
}

async function asignarPropietario(id, usuarioId) {
    const mascota = await mascotaRepo.getMascotaById(id);
    if (!mascota) throw new Error('Mascota no encontrada');
    
    mascota.propietario = usuarioId;
    await mascota.save();
    
    return mascota;
}

export default {
    getAllMascotas,
    getMascotasDisponibles,
    getMascotaById,
    addMascota,
    updateMascota,
    deleteMascota,
    getMascotasByHeroe,
    getMascotasByUsuario,
    adoptarMascota,
    getMascotas,
    alimentarMascota,
    pasearMascota,
    curarMascota,
    verificarEstadoMascota,
    actualizarEstadoMascota: actualizarEstadoMascotaPorId,
    agregarItemMascota,
    quitarItemMascota,
    getItemsDisponibles,
    cambiarPersonalidadMascota,
    enfermarMascota,
    asignarPropietario
}; 