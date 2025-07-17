import express from 'express';
import mascotaService from '../services/mascotaService.js';
import heroService from '../services/heroService.js';
import { verificarToken, actualizarUltimoAcceso, verificarPropietario } from '../middleware/auth.js';

const router = express.Router();

// GET /api/mascotas - Obtener listado de mascotas del usuario autenticado (PROTEGIDO)
router.get('/', verificarToken, actualizarUltimoAcceso, async (req, res) => {
    console.log('GET /api/mascotas llamado');
    try {
        const mascotas = await mascotaService.getMascotasByUsuario(req.usuario._id);
        res.json(mascotas);
    } catch (error) {
        console.error('Error en GET /api/mascotas:', error);
        res.status(500).json({ error: error.message });
    }
});

// Nota: La ruta /disponibles se ha movido a app.js

router.get('/heroe/:idHeroe', async (req, res) => {
    console.log('GET /api/mascotas/heroe/:idHeroe llamado', req.params.idHeroe);
    try {
        const mascotas = await mascotaService.getMascotasByHeroe(req.params.idHeroe);
        res.json(mascotas);
    } catch (error) {
        console.error('Error en GET /api/mascotas/heroe/:idHeroe:', error);
        res.status(500).json({ error: error.message });
    }
});

// Ruta para adopción aleatoria
router.post('/adoptar/aleatorio', async (req, res) => {
    console.log('POST /api/mascotas/adoptar/aleatorio llamado', req.body);
    try {
        const { idHeroe } = req.body;
        if (!idHeroe) {
            return res.status(400).json({ error: 'Se requiere el ID del héroe' });
        }

        // Verificar que el héroe existe
        const heroe = await heroService.getHeroById(idHeroe);
        if (!heroe) {
            return res.status(404).json({ error: 'Héroe no encontrado' });
        }

        const mascota = await mascotaService.adoptarMascota('aleatorio', idHeroe);
        res.json({
            mensaje: `${heroe.alias} ha adoptado a ${mascota.nombre}`,
            mascota
        });
    } catch (error) {
        console.error('Error en POST /api/mascotas/adoptar/aleatorio:', error);
        res.status(400).json({ error: error.message });
    }
});

// Listar items disponibles (gratuitos y premium)
router.get('/items', async (req, res) => {
    console.log('GET /api/mascotas/items llamado', req.query);
    try {
        const { tipo } = req.query; // 'free', 'premium' o undefined para todos
        const items = await mascotaService.getItemsDisponibles(tipo);
        res.json(items);
    } catch (error) {
        console.error('Error en GET /api/mascotas/items:', error);
        res.status(500).json({ error: error.message });
    }
});

// Rutas con parámetro ID al final (PROTEGIDO)
router.get('/:id', verificarToken, actualizarUltimoAcceso, async (req, res) => {
    console.log('GET /api/mascotas/:id llamado', req.params.id);
    try {
        const mascota = await mascotaService.getMascotaById(req.params.id);
        if (!mascota) return res.status(404).json({ error: 'Mascota no encontrada' });
        
        // Verificar que la mascota pertenece al usuario autenticado
        if (mascota.usuarioId && mascota.usuarioId.toString() !== req.usuario._id.toString()) {
            return res.status(403).json({ 
                error: 'No tienes permisos para ver esta mascota' 
            });
        }
        
        res.json(mascota);
    } catch (error) {
        console.error('Error en GET /api/mascotas/:id:', error);
        res.status(500).json({ error: error.message });
    }
});

router.post('/:id/adoptar', verificarToken, actualizarUltimoAcceso, async (req, res) => {
    console.log('POST /api/mascotas/:id/adoptar llamado', req.params.id, req.body);
    try {
        const { idHeroe } = req.body;
        if (!idHeroe) {
            return res.status(400).json({ error: 'Se requiere el ID del héroe' });
        }

        // Verificar que el héroe existe
        const heroe = await heroService.getHeroById(idHeroe);
        if (!heroe) {
            return res.status(404).json({ error: 'Héroe no encontrado' });
        }

        // Verificar que la mascota existe y no está adoptada
        const mascota = await mascotaService.getMascotaById(req.params.id);
        if (!mascota) {
            return res.status(404).json({ error: 'Mascota no encontrada' });
        }
        if (mascota.adoptadoPor !== null) {
            return res.status(400).json({ 
                error: 'Esta mascota ya ha sido adoptada',
                mascotaInfo: mascota
            });
        }

        // Verificar que la mascota pertenece al usuario autenticado
        if (mascota.usuarioId && mascota.usuarioId.toString() !== req.usuario._id.toString()) {
            return res.status(403).json({ 
                error: 'No tienes permisos para adoptar esta mascota' 
            });
        }

        const mascotaAdoptada = await mascotaService.adoptarMascota(req.params.id, idHeroe);
        res.json({
            mensaje: `${heroe.alias} ha adoptado a ${mascotaAdoptada.nombre}`,
            mascota: mascotaAdoptada
        });
    } catch (error) {
        console.error('Error en POST /api/mascotas/:id/adoptar:', error);
        res.status(400).json({ error: error.message });
    }
});

// POST /api/mascotas - Crear una mascota (PROTEGIDO)
router.post('/', verificarToken, actualizarUltimoAcceso, async (req, res) => {
    console.log('POST /api/mascotas llamado', req.body);
    try {
        // Asignar el usuario autenticado como propietario de la mascota
        const mascotaData = {
            ...req.body,
            usuarioId: req.usuario._id
        };
        const nuevaMascota = await mascotaService.addMascota(mascotaData);
        res.status(201).json(nuevaMascota);
    } catch (error) {
        console.error('Error en POST /api/mascotas:', error);
        res.status(400).json({ error: error.message });
    }
});

router.put('/:id', verificarToken, actualizarUltimoAcceso, async (req, res) => {
    console.log('PUT /api/mascotas/:id llamado', req.params.id, req.body);
    try {
        // Verificar que la mascota existe y pertenece al usuario
        const mascota = await mascotaService.getMascotaById(req.params.id);
        if (!mascota) {
            return res.status(404).json({ error: 'Mascota no encontrada' });
        }

        // Verificar que la mascota pertenece al usuario autenticado
        if (mascota.usuarioId && mascota.usuarioId.toString() !== req.usuario._id.toString()) {
            return res.status(403).json({ 
                error: 'No tienes permisos para modificar esta mascota' 
            });
        }

        const updated = await mascotaService.updateMascota(req.params.id, req.body);
        res.json(updated);
    } catch (error) {
        console.error('Error en PUT /api/mascotas/:id:', error);
        res.status(404).json({ error: error.message });
    }
});

router.delete('/:id', verificarToken, actualizarUltimoAcceso, async (req, res) => {
    console.log('DELETE /api/mascotas/:id llamado', req.params.id);
    try {
        // Verificar que la mascota existe y pertenece al usuario
        const mascota = await mascotaService.getMascotaById(req.params.id);
        if (!mascota) {
            return res.status(404).json({ error: 'Mascota no encontrada' });
        }

        // Verificar que la mascota pertenece al usuario autenticado
        if (mascota.usuarioId && mascota.usuarioId.toString() !== req.usuario._id.toString()) {
            return res.status(403).json({ 
                error: 'No tienes permisos para eliminar esta mascota' 
            });
        }
        
        // Verificar si la mascota ya ha sido adoptada (esta validación también está en el servicio)
        if (mascota.adoptadoPor !== null) {
            return res.status(400).json({ 
                error: 'No se puede eliminar una mascota que ya ha sido adoptada',
                mascotaInfo: mascota
            });
        }

        const result = await mascotaService.deleteMascota(req.params.id);
        res.json(result);
    } catch (error) {
        console.error('Error en DELETE /api/mascotas/:id:', error);
        res.status(404).json({ error: error.message });
    }
});

// NUEVOS ENDPOINTS

// Alimentar a la mascota (PROTEGIDO)
router.post('/:id/alimentar', verificarToken, actualizarUltimoAcceso, async (req, res) => {
    console.log('POST /api/mascotas/:id/alimentar llamado', req.params.id, req.body);
    try {
        const { tipoAlimento = 'normal' } = req.body; // normal, premium, especial
        
        // Verificar que la mascota existe y pertenece al usuario
        const mascota = await mascotaService.getMascotaById(req.params.id);
        if (!mascota) {
            return res.status(404).json({ error: 'Mascota no encontrada' });
        }

        // Verificar que la mascota pertenece al usuario autenticado
        if (mascota.usuarioId && mascota.usuarioId.toString() !== req.usuario._id.toString()) {
            return res.status(403).json({ 
                error: 'No tienes permisos para alimentar esta mascota' 
            });
        }
        
        const mascotaAlimentada = await mascotaService.alimentarMascota(req.params.id, tipoAlimento);
        res.json({
            mensaje: `${mascota.nombre} ha sido alimentado con éxito con alimento ${tipoAlimento}`,
            mascota: mascotaAlimentada,
            sugerencias: mascotaAlimentada.sugerencias
        });
    } catch (error) {
        console.error('Error en POST /api/mascotas/:id/alimentar:', error);
        
        // Verificar si el error contiene el estado actualizado de la mascota
        if (error.estadoMascota) {
            return res.status(400).json({
                error: error.message,
                sugerencias: error.sugerencias,
                estadoMascota: error.estadoMascota
            });
        }
        // Verificar si el error contiene sugerencias (caso de enfermedad por sobrealimentación)
        if (error.sugerencias || error.enfermedad) {
            return res.status(400).json({
                error: error.message,
                sugerencias: error.sugerencias,
                enfermedad: error.enfermedad,
                recomendacion: "Usa el endpoint POST /api/mascotas/:id/curar con el medicamento adecuado"
            });
        }
        
        res.status(400).json({ error: error.message });
    }
});

// Pasear a la mascota (PROTEGIDO)
router.post('/:id/pasear', verificarToken, actualizarUltimoAcceso, async (req, res) => {
    console.log('POST /api/mascotas/:id/pasear llamado', req.params.id, req.body);
    try {
        const { duracion = 30 } = req.body; // duración en minutos
        
        // Validar que la duración sea un número
        if (isNaN(parseInt(duracion))) {
            return res.status(400).json({ error: 'La duración debe ser un número en minutos' });
        }
        
        // Verificar que la mascota existe y pertenece al usuario
        const mascota = await mascotaService.getMascotaById(req.params.id);
        if (!mascota) {
            return res.status(404).json({ error: 'Mascota no encontrada' });
        }

        // Verificar que la mascota pertenece al usuario autenticado
        if (mascota.usuarioId && mascota.usuarioId.toString() !== req.usuario._id.toString()) {
            return res.status(403).json({ 
                error: 'No tienes permisos para pasear esta mascota' 
            });
        }
        
        const resultado = await mascotaService.pasearMascota(req.params.id, parseInt(duracion));
        
        // Mensaje personalizado según la duración del paseo
        let mensaje = `${mascota.nombre} ha disfrutado del paseo`;
        if (duracion < 15) {
            mensaje += " (aunque fue un poco corto)";
        } else if (duracion > 60) {
            mensaje += " y se ha ejercitado bastante";
        }
        
        // Construir respuesta con todos los elementos disponibles
        const respuesta = {
            mensaje,
            mascota: resultado,
            sugerencias: resultado.sugerencias
        };
        
        // Añadir información sobre el item encontrado si corresponde
        if (resultado.itemEncontrado) {
            respuesta.itemEncontrado = resultado.itemEncontrado;
        }
        
        // Añadir información sobre curación si ocurrió
        if (resultado.curacion) {
            respuesta.curacion = resultado.curacion;
        }
        
        res.json(respuesta);
    } catch (error) {
        console.error('Error en POST /api/mascotas/:id/pasear:', error);
        
        // Verificar si el error contiene sugerencias (caso de energía insuficiente o enfermedad)
        if (error.sugerencias || error.enfermedad) {
            return res.status(400).json({
                error: error.message,
                sugerencias: error.sugerencias,
                enfermedad: error.enfermedad
            });
        }
        
        res.status(400).json({ error: error.message });
    }
});

// Curar enfermedad (PROTEGIDO)
router.post('/:id/curar', verificarToken, actualizarUltimoAcceso, async (req, res) => {
    console.log('POST /api/mascotas/:id/curar llamado', req.params.id, req.body);
    try {
        const { medicamento } = req.body;
        if (!medicamento) {
            return res.status(400).json({ error: 'Se requiere especificar un medicamento' });
        }
        
        // Verificar que la mascota existe y pertenece al usuario
        const mascota = await mascotaService.getMascotaById(req.params.id);
        if (!mascota) {
            return res.status(404).json({ error: 'Mascota no encontrada' });
        }

        // Verificar que la mascota pertenece al usuario autenticado
        if (mascota.usuarioId && mascota.usuarioId.toString() !== req.usuario._id.toString()) {
            return res.status(403).json({ 
                error: 'No tienes permisos para curar esta mascota' 
            });
        }
        
        // Verificar si la mascota está enferma
        if (!mascota.enfermedad) {
            return res.status(400).json({ 
                error: `${mascota.nombre} no está enfermo actualmente`,
                sugerencias: {
                    verificar: `Usa el endpoint GET /api/mascotas/${mascota.id}/estado para verificar el estado actual`,
                    prevencion: "Mantén la salud y felicidad de tu mascota alta para prevenir enfermedades"
                }
            });
        }
        
        const resultado = await mascotaService.curarMascota(req.params.id, medicamento);
        
        res.json({
            mensaje: `${mascota.nombre} ha sido curado exitosamente de ${mascota.enfermedad.nombre}`,
            mascota: resultado,
            mensajeAdicional: resultado.mensajeAdicional,
            sugerencias: resultado.sugerencias,
            estadisticasRecuperadas: resultado.estadisticasRecuperadas
        });
    } catch (error) {
        console.error('Error en POST /api/mascotas/:id/curar:', error);
        
        // Verificar si el error contiene sugerencias (caso de tratamiento inefectivo o medicamento incorrecto)
        if (error.sugerencias) {
            return res.status(400).json({
                error: error.message,
                sugerencias: error.sugerencias
            });
        }
        
        res.status(400).json({ error: error.message });
    }
});

// Verificar estado de salud (PROTEGIDO)
router.get('/:id/estado', verificarToken, actualizarUltimoAcceso, async (req, res) => {
    console.log('GET /api/mascotas/:id/estado llamado', req.params.id);
    try {
        // Verificar que la mascota existe y pertenece al usuario
        const mascota = await mascotaService.getMascotaById(req.params.id);
        if (!mascota) {
            return res.status(404).json({ error: 'Mascota no encontrada' });
        }

        // Verificar que la mascota pertenece al usuario autenticado
        if (mascota.usuarioId && mascota.usuarioId.toString() !== req.usuario._id.toString()) {
            return res.status(403).json({ 
                error: 'No tienes permisos para ver el estado de esta mascota' 
            });
        }

        const estado = await mascotaService.verificarEstadoMascota(req.params.id);
        res.json(estado);
    } catch (error) {
        console.error('Error en GET /api/mascotas/:id/estado:', error);
        res.status(404).json({ error: error.message });
    }
});

// Añadir item a mascota (PROTEGIDO)
router.post('/:id/items', verificarToken, actualizarUltimoAcceso, async (req, res) => {
    console.log('POST /api/mascotas/:id/items llamado', req.params.id, req.body);
    try {
        const { item, itemId } = req.body;
        if (!item && !itemId) {
            return res.status(400).json({ error: 'Se requiere especificar un item (objeto) o un itemId' });
        }

        // Verificar que la mascota existe y pertenece al usuario
        const mascota = await mascotaService.getMascotaById(req.params.id);
        if (!mascota) {
            return res.status(404).json({ error: 'Mascota no encontrada' });
        }

        // Verificar que la mascota pertenece al usuario autenticado
        if (mascota.usuarioId && mascota.usuarioId.toString() !== req.usuario._id.toString()) {
            return res.status(403).json({ 
                error: 'No tienes permisos para modificar esta mascota' 
            });
        }

        // Ahora pasamos el objeto item si existe, si no el itemId
        const resultado = await mascotaService.agregarItemMascota(req.params.id, item || itemId);

        const respuesta = {
            mensaje: `Item añadido a la mascota con éxito`,
            mascota: resultado
        };
        if (resultado.mensajeAdicional) {
            respuesta.mensajeAdicional = resultado.mensajeAdicional;
        }
        res.json(respuesta);
    } catch (error) {
        console.error('Error en POST /api/mascotas/:id/items:', error);
        res.status(400).json({ error: error.message });
    }
});

// Quitar item de mascota (PROTEGIDO)
router.delete('/:id/items/:itemId', verificarToken, actualizarUltimoAcceso, async (req, res) => {
    console.log('DELETE /api/mascotas/:id/items/:itemId llamado', req.params.id, req.params.itemId);
    try {
        // Verificar que la mascota existe y pertenece al usuario
        const mascota = await mascotaService.getMascotaById(req.params.id);
        if (!mascota) {
            return res.status(404).json({ error: 'Mascota no encontrada' });
        }

        // Verificar que la mascota pertenece al usuario autenticado
        if (mascota.usuarioId && mascota.usuarioId.toString() !== req.usuario._id.toString()) {
            return res.status(403).json({ 
                error: 'No tienes permisos para modificar esta mascota' 
            });
        }

        const mascotaActualizada = await mascotaService.quitarItemMascota(req.params.id, req.params.itemId);
        res.json({
            mensaje: `Item eliminado de ${mascotaActualizada.nombre} con éxito`,
            mascota: mascotaActualizada
        });
    } catch (error) {
        console.error('Error en DELETE /api/mascotas/:id/items/:itemId:', error);
        res.status(400).json({ error: error.message });
    }
});

// Cambiar personalidad (PROTEGIDO)
router.put('/:id/personalidad', verificarToken, actualizarUltimoAcceso, async (req, res) => {
    console.log('PUT /api/mascotas/:id/personalidad llamado', req.params.id, req.body);
    try {
        const { personalidad } = req.body;
        if (!personalidad) {
            return res.status(400).json({ error: 'Se requiere especificar una personalidad' });
        }
        
        // Validar personalidades permitidas
        const personalidadesValidas = ['amigable', 'tímido', 'agresivo', 'juguetón'];
        if (!personalidadesValidas.includes(personalidad)) {
            return res.status(400).json({ 
                error: 'Personalidad no válida',
                personalidadesPermitidas: personalidadesValidas
            });
        }
        
        // Verificar que la mascota existe y pertenece al usuario
        const mascota = await mascotaService.getMascotaById(req.params.id);
        if (!mascota) {
            return res.status(404).json({ error: 'Mascota no encontrada' });
        }

        // Verificar que la mascota pertenece al usuario autenticado
        if (mascota.usuarioId && mascota.usuarioId.toString() !== req.usuario._id.toString()) {
            return res.status(403).json({ 
                error: 'No tienes permisos para modificar esta mascota' 
            });
        }
        
        const resultado = await mascotaService.cambiarPersonalidadMascota(req.params.id, personalidad);
        
        res.json({
            mensaje: resultado.mensaje || `La personalidad de ${mascota.nombre} ha cambiado a ${personalidad}`,
            mascota: resultado
        });
    } catch (error) {
        console.error('Error en PUT /api/mascotas/:id/personalidad:', error);
        res.status(400).json({ error: error.message });
    }
});

// Simular enfermedad (para pruebas) - PROTEGIDO
router.post('/:id/enfermar', verificarToken, actualizarUltimoAcceso, async (req, res) => {
    console.log('POST /api/mascotas/:id/enfermar llamado', req.params.id, req.body);
    try {
        const { enfermedad } = req.body;
        
        // Verificar que la mascota existe y pertenece al usuario
        const mascota = await mascotaService.getMascotaById(req.params.id);
        if (!mascota) {
            return res.status(404).json({ error: 'Mascota no encontrada' });
        }

        // Verificar que la mascota pertenece al usuario autenticado
        if (mascota.usuarioId && mascota.usuarioId.toString() !== req.usuario._id.toString()) {
            return res.status(403).json({ 
                error: 'No tienes permisos para modificar esta mascota' 
            });
        }
        
        // Verificar si la mascota ya está enferma
        if (mascota.enfermedad) {
            return res.status(400).json({ 
                error: `${mascota.nombre} ya está enfermo de ${mascota.enfermedad.nombre}. Cúralo primero.`,
                enfermedadActual: mascota.enfermedad
            });
        }
        
        // Verificar si la mascota tiene inmunidad a esta enfermedad
        if (mascota.inmunidades && mascota.inmunidades[enfermedad]) {
            const fechaExpiracion = new Date(mascota.inmunidades[enfermedad].hasta);
            return res.status(400).json({ 
                error: `${mascota.nombre} es inmune a ${enfermedad} hasta ${fechaExpiracion.toLocaleString()}.`,
                inmunidad: {
                    enfermedad,
                    expira: fechaExpiracion.toLocaleString()
                }
            });
        }
        
        const mascotaEnferma = await mascotaService.enfermarMascota(req.params.id, enfermedad);
        
        // Mensaje personalizado según la enfermedad
        let mensaje = `${mascota.nombre} ha enfermado de ${mascotaEnferma.enfermedad.nombre}`;
        
        // Añadir recomendación según la enfermedad
        let recomendacion = '';
        switch (mascotaEnferma.enfermedad.tipo) {
            case 'resfriado':
                recomendacion = 'Se recomienda usar vitaminaC para curar esta enfermedad.';
                break;
            case 'estomacal':
                recomendacion = 'Se recomienda usar antibiotico para curar esta enfermedad.';
                break;
            case 'tristeza':
                recomendacion = 'Se recomienda usar antidepresivo o un buen paseo para curar esta enfermedad.';
                break;
            default:
                recomendacion = 'Se recomienda usar medicamentoGeneral para curar esta enfermedad.';
        }
        
        res.json({
            mensaje,
            recomendacion,
            mascota: mascotaEnferma
        });
    } catch (error) {
        console.error('Error en POST /api/mascotas/:id/enfermar:', error);
        res.status(400).json({ error: error.message });
    }
});

// Forzar actualización del estado (para pruebas y debugging) - PROTEGIDO
router.post('/:id/actualizar-estado', verificarToken, actualizarUltimoAcceso, async (req, res) => {
    console.log('POST /api/mascotas/:id/actualizar-estado llamado', req.params.id);
    try {
        // Verificar que la mascota existe y pertenece al usuario
        const mascota = await mascotaService.getMascotaById(req.params.id);
        if (!mascota) {
            return res.status(404).json({ error: 'Mascota no encontrada' });
        }

        // Verificar que la mascota pertenece al usuario autenticado
        if (mascota.usuarioId && mascota.usuarioId.toString() !== req.usuario._id.toString()) {
            return res.status(403).json({ 
                error: 'No tienes permisos para modificar esta mascota' 
            });
        }
        
        // Forzar actualización del estado
        await mascotaService.actualizarEstadoMascota(req.params.id);
        
        // Obtener la mascota actualizada
        const mascotaActualizada = await mascotaService.getMascotaById(req.params.id);
        
        res.json({
            mensaje: `Estado de ${mascota.nombre} actualizado exitosamente`,
            mascota: mascotaActualizada,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Error en POST /api/mascotas/:id/actualizar-estado:', error);
        res.status(400).json({ error: error.message });
    }
});

export default router; 