import express from "express"
import { check, validationResult } from 'express-validator'
import heroService from "../services/heroService.js"
import mascotaService from "../services/mascotaService.js"
import Hero from "../models/heroModel.js"
import { verificarToken, actualizarUltimoAcceso } from '../middleware/auth.js'

const router = express.Router()

router.get("/heroes", async (req, res) => {
    try {
        const heroes = await heroService.getAllHeroes()
        res.json(heroes)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

router.get("/heroes/:id", async (req, res) => {
    try {
        const heroe = await heroService.getHeroById(req.params.id);
        if (!heroe) {
            return res.status(404).json({ error: 'Héroe no encontrado' });
        }
        res.json(heroe);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post("/heroes",
    verificarToken, 
    actualizarUltimoAcceso,
    [
        check('name').not().isEmpty().withMessage('El nombre es requerido'),
        check('alias').not().isEmpty().withMessage('El alias es requerido')
    ], 
    async (req, res) => {
        const errors = validationResult(req)
        if(!errors.isEmpty()){
            return res.status(400).json({ error: errors.array() })
        }

        try {
            const { name, alias, city, team } = req.body
            const newHero = new Hero(null, name, alias, city, team)
            const addedHero = await heroService.addHero(newHero)

            res.status(201).json(addedHero)
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
})

// Endpoint para asignar automáticamente una mascota a un héroe (PROTEGIDO)
router.post('/heroes/:id/asignar-mascota', verificarToken, actualizarUltimoAcceso, async (req, res) => {
    console.log('POST /api/heroes/:id/asignar-mascota llamado', req.params.id);
    try {
        const idHeroe = parseInt(req.params.id);
        
        // Verificar que el héroe existe
        const heroe = await heroService.getHeroById(idHeroe);
        if (!heroe) {
            return res.status(404).json({ error: 'Héroe no encontrado' });
        }
        
        // Verificar si hay mascotas disponibles
        const disponibles = await mascotaService.getMascotasDisponibles();
        if (disponibles.length === 0) {
            return res.status(400).json({ 
                error: 'No hay mascotas disponibles para adopción',
                mensaje: 'Todas las mascotas ya han sido adoptadas'
            });
        }
        
        // Asignar una mascota aleatoria al héroe
        try {
            const mascota = await mascotaService.adoptarMascota('aleatorio', idHeroe);
            res.json({
                mensaje: `${heroe.alias} ha adoptado a ${mascota.nombre}`,
                mascota
            });
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    } catch (error) {
        console.error('Error en POST /api/heroes/:id/asignar-mascota:', error);
        res.status(400).json({ error: error.message });
    }
})

router.put("/heroes/:id", verificarToken, actualizarUltimoAcceso, async (req, res) => {
    try {
        // Verificar que el héroe existe
        const heroe = await heroService.getHeroById(req.params.id);
        if (!heroe) {
            return res.status(404).json({ error: 'Héroe no encontrado' });
        }
        
        const updatedHero = await heroService.updateHero(req.params.id, req.body)
        res.json(updatedHero)
    } catch (error) {
        res.status(404).json({ error: error.message })
    }
})

router.delete('/heroes/:id', verificarToken, actualizarUltimoAcceso, async (req, res) => {
    try {
        // Verificar que el héroe existe
        const heroe = await heroService.getHeroById(req.params.id);
        if (!heroe) {
            return res.status(404).json({ error: 'Héroe no encontrado' });
        }
        
        // Verificar si el héroe tiene mascotas adoptadas
        const mascotasDelHeroe = await mascotaService.getMascotasByHeroe(req.params.id);
        if (mascotasDelHeroe.length > 0) {
            return res.status(400).json({ 
                error: 'No se puede eliminar un héroe que tiene mascotas adoptadas',
                mascotasAdoptadas: mascotasDelHeroe
            });
        }
        
        const result = await heroService.deleteHero(req.params.id)
        res.json(result)
    } catch (error) {
        res.status(404).json({ error: error.message })
    }
})

router.get('/heroes/city/:city', async (req, res) => {
    try {
        const heroes = await heroService.findHeroesByCity(req.params.city)
        res.json(heroes)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

router.post('/heroes/:id/enfrentar', verificarToken, actualizarUltimoAcceso, async (req, res) => {
    try {
        // Verificar que el héroe existe
        const heroe = await heroService.getHeroById(req.params.id);
        if (!heroe) {
            return res.status(404).json({ error: 'Héroe no encontrado' });
        }
        
        if (!req.body.villain) {
            return res.status(400).json({ error: 'Se requiere especificar un villano' });
        }
        
        const result = await heroService.faceVillain(req.params.id, req.body.villain)
        res.json({ message: result })
    } catch (error) {
        res.status(404).json({ error: error.message })
    }
})

export default router 