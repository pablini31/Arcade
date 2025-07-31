import express from 'express';
import jwt from 'jsonwebtoken';
import Usuario from '../models/Usuario.js';
import Mascota from '../models/Mascota.js';
import { verificarToken, verificarPropietario, actualizarUltimoAcceso } from '../middleware/auth.js';

const router = express.Router();

// Función para generar token JWT
const generarToken = (usuarioId) => {
    return jwt.sign(
        { usuarioId },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
    );
};

// Función para crear mascotas por defecto si no hay disponibles
const crearMascotasPorDefecto = async () => {
    const mascotasDisponibles = await Mascota.countDocuments({ 
        adoptadoPor: null,
        propietario: null 
    });
    
    if (mascotasDisponibles === 0) {
        console.log('Creando mascotas por defecto...');
        
        const mascotasPorDefecto = [
            {
                id: 1001,
                nombre: "Luna",
                tipo: "Gato",
                poder: "Visión nocturna",
                edad: 2,
                energia: 100,
                descripcion: "Un gato misterioso con ojos brillantes",
                idLugar: 1,
                adoptadoPor: null,
                propietario: null,
                salud: 100,
                felicidad: 100,
                personalidad: "amigable",
                ultimaAlimentacion: new Date(),
                ultimoPaseo: new Date()
            },
            {
                id: 1002,
                nombre: "Max",
                tipo: "Perro",
                poder: "Super velocidad",
                edad: 3,
                energia: 100,
                descripcion: "Un perro energético y leal",
                idLugar: 1,
                adoptadoPor: null,
                propietario: null,
                salud: 100,
                felicidad: 100,
                personalidad: "juguetón",
                ultimaAlimentacion: new Date(),
                ultimoPaseo: new Date()
            },
            {
                id: 1003,
                nombre: "Sparky",
                tipo: "Conejo",
                poder: "Salto súper alto",
                edad: 1,
                energia: 100,
                descripcion: "Un conejo saltarín y curioso",
                idLugar: 1,
                adoptadoPor: null,
                propietario: null,
                salud: 100,
                felicidad: 100,
                personalidad: "tímido",
                ultimaAlimentacion: new Date(),
                ultimoPaseo: new Date()
            },
            {
                id: 1004,
                nombre: "Rex",
                tipo: "Dinosaurio",
                poder: "Fuerza bruta",
                edad: 5,
                energia: 100,
                descripcion: "Un dinosaurio amigable y fuerte",
                idLugar: 1,
                adoptadoPor: null,
                propietario: null,
                salud: 100,
                felicidad: 100,
                personalidad: "agresivo",
                ultimaAlimentacion: new Date(),
                ultimoPaseo: new Date()
            },
            {
                id: 1005,
                nombre: "Nebula",
                tipo: "Dragón",
                poder: "Aliento de fuego",
                edad: 10,
                energia: 100,
                descripcion: "Un dragón bebé adorable",
                idLugar: 1,
                adoptadoPor: null,
                propietario: null,
                salud: 100,
                felicidad: 100,
                personalidad: "amigable",
                ultimaAlimentacion: new Date(),
                ultimoPaseo: new Date()
            }
        ];
        
        try {
            await Mascota.insertMany(mascotasPorDefecto);
            console.log('Mascotas por defecto creadas exitosamente');
        } catch (error) {
            console.error('Error creando mascotas por defecto:', error);
        }
    }
};

// Función para asignar mascota automáticamente al usuario registrado
const asignarMascotaAutomatica = async (usuarioId) => {
    try {
        // Primero, asegurar que hay mascotas disponibles
        await crearMascotasPorDefecto();
        
        // Buscar una mascota disponible (no adoptada)
        const mascotaDisponible = await Mascota.findOne({ 
            adoptadoPor: null,
            propietario: null 
        });
        
        if (!mascotaDisponible) {
            console.log('No hay mascotas disponibles para asignar automáticamente');
            return null;
        }
        
        // Asignar la mascota al usuario
        mascotaDisponible.propietario = usuarioId;
        mascotaDisponible.adoptadoPor = 1; // ID del héroe por defecto
        await mascotaDisponible.save();
        
        // Actualizar el usuario con la mascota asignada
        await Usuario.findByIdAndUpdate(
            usuarioId,
            { 
                $push: { mascotas: mascotaDisponible._id },
                $inc: { 'estadisticas.mascotasAdoptadas': 1 }
            }
        );
        
        console.log(`Mascota ${mascotaDisponible.nombre} asignada automáticamente al usuario ${usuarioId}`);
        return mascotaDisponible;
        
    } catch (error) {
        console.error('Error asignando mascota automática:', error);
        return null;
    }
};

// POST /api/usuarios/registro - Registrar nuevo usuario
router.post('/registro', async (req, res) => {
    console.log('POST /api/usuarios/registro llamado', req.body);
    try {
        const { username, email, password, nombre, apellido, fechaNacimiento } = req.body;

        // Validaciones básicas
        if (!username || !email || !password || !nombre) {
            return res.status(400).json({
                error: 'Todos los campos obligatorios deben estar presentes'
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                error: 'La contraseña debe tener al menos 6 caracteres'
            });
        }

        // Verificar si el username ya existe
        const usuarioExistente = await Usuario.findOne({ username });
        if (usuarioExistente) {
            return res.status(400).json({
                error: 'El username ya está en uso'
            });
        }

        // Verificar si el email ya existe
        const emailExistente = await Usuario.findOne({ email });
        if (emailExistente) {
            return res.status(400).json({
                error: 'El email ya está registrado'
            });
        }

        // Crear nuevo usuario
        const nuevoUsuario = new Usuario({
            username,
            email,
            password,
            nombre,
            apellido,
            fechaNacimiento: fechaNacimiento ? new Date(fechaNacimiento) : null
        });

        await nuevoUsuario.save();

        // Asignar mascota automáticamente al usuario registrado
        const mascotaAsignada = await asignarMascotaAutomatica(nuevoUsuario._id);

        // Generar token JWT
        const token = generarToken(nuevoUsuario._id);

        // Respuesta con información básica y token
        const usuarioResponse = {
            _id: nuevoUsuario._id,
            username: nuevoUsuario.username,
            email: nuevoUsuario.email,
            nombre: nuevoUsuario.nombre,
            apellido: nuevoUsuario.apellido,
            nivel: nuevoUsuario.nivel,
            experiencia: nuevoUsuario.experiencia,
            monedas: nuevoUsuario.monedas,
            gemas: nuevoUsuario.gemas,
            ultimoAcceso: nuevoUsuario.ultimoAcceso,
            esPremium: nuevoUsuario.esPremium,
            estadisticas: nuevoUsuario.estadisticas
        };

        // Preparar respuesta con información de la mascota asignada
        let mensaje = 'Usuario registrado exitosamente';
        let mascotaInfo = null;

        if (mascotaAsignada) {
            mensaje = `¡Usuario registrado exitosamente! Se te ha asignado automáticamente la mascota ${mascotaAsignada.nombre}`;
            mascotaInfo = {
                id: mascotaAsignada.id,
                nombre: mascotaAsignada.nombre,
                tipo: mascotaAsignada.tipo,
                poder: mascotaAsignada.poder,
                personalidad: mascotaAsignada.personalidad,
                salud: mascotaAsignada.salud,
                energia: mascotaAsignada.energia,
                felicidad: mascotaAsignada.felicidad
            };
        }

        res.status(201).json({
            mensaje: mensaje,
            usuario: usuarioResponse,
            mascotaAsignada: mascotaInfo,
            token
        });

    } catch (error) {
        console.error('Error en POST /api/usuarios/registro:', error);
        
        if (error.code === 11000) {
            const campo = Object.keys(error.keyPattern)[0];
            return res.status(400).json({
                error: `El ${campo} ya está en uso`
            });
        }

        res.status(500).json({
            error: 'Error interno del servidor',
            detalles: error.message
        });
    }
});

// POST /api/usuarios/login - Iniciar sesión
router.post('/login', async (req, res) => {
    console.log('POST /api/usuarios/login llamado');
    try {
        const { usernameOrEmail, password } = req.body;

        if (!usernameOrEmail || !password) {
            return res.status(400).json({
                error: 'Username/email y contraseña son requeridos'
            });
        }

        // Buscar usuario
        const usuario = await Usuario.buscarPorCredenciales(usernameOrEmail);
        if (!usuario) {
            return res.status(401).json({
                error: 'Credenciales inválidas'
            });
        }

        // Verificar contraseña
        const passwordValida = await usuario.compararPassword(password);
        if (!passwordValida) {
            return res.status(401).json({
                error: 'Credenciales inválidas'
            });
        }

        // Actualizar último acceso
        await usuario.actualizarUltimoAcceso();

        // Generar token
        const token = generarToken(usuario._id);

        // Respuesta sin contraseña
        const usuarioResponse = {
            _id: usuario._id,
            username: usuario.username,
            email: usuario.email,
            nombre: usuario.nombre,
            apellido: usuario.apellido,
            nivel: usuario.nivel,
            experiencia: usuario.experiencia,
            monedas: usuario.monedas,
            gemas: usuario.gemas,
            ultimoAcceso: usuario.ultimoAcceso,
            esPremium: usuario.esPremium,
            estadisticas: usuario.estadisticas
        };

        res.json({
            mensaje: 'Inicio de sesión exitoso',
            usuario: usuarioResponse,
            token
        });

    } catch (error) {
        console.error('Error en POST /api/usuarios/login:', error);
        res.status(500).json({
            error: 'Error interno del servidor'
        });
    }
});

// GET /api/usuarios/perfil - Obtener perfil del usuario autenticado
router.get('/perfil', verificarToken, actualizarUltimoAcceso, async (req, res) => {
    console.log('GET /api/usuarios/perfil llamado');
    try {
        const usuario = await Usuario.findById(req.usuario._id)
            .select('-password')
            .populate('mascotas', 'id nombre tipo energia salud felicidad')
            .populate('heroes', 'id name alias');

        // Obtener mascotas asignadas al usuario
        const mascotasAsignadas = await Mascota.find({ 
            propietario: req.usuario._id 
        }).select('id nombre tipo poder personalidad salud energia felicidad adoptadoPor');

        res.json({
            usuario,
            mascotasAsignadas: mascotasAsignadas,
            mensaje: 'Perfil obtenido exitosamente'
        });

    } catch (error) {
        console.error('Error en GET /api/usuarios/perfil:', error);
        res.status(500).json({
            error: 'Error interno del servidor'
        });
    }
});

// PUT /api/usuarios/perfil - Actualizar perfil del usuario
router.put('/perfil', verificarToken, actualizarUltimoAcceso, async (req, res) => {
    console.log('PUT /api/usuarios/perfil llamado', req.body);
    try {
        const { nombre, apellido, fechaNacimiento, avatar, configuracion } = req.body;

        // Campos permitidos para actualizar
        const camposPermitidos = ['nombre', 'apellido', 'fechaNacimiento', 'avatar', 'configuracion'];
        const actualizacion = {};

        camposPermitidos.forEach(campo => {
            if (req.body[campo] !== undefined) {
                if (campo === 'fechaNacimiento' && req.body[campo]) {
                    actualizacion[campo] = new Date(req.body[campo]);
                } else {
                    actualizacion[campo] = req.body[campo];
                }
            }
        });

        const usuarioActualizado = await Usuario.findByIdAndUpdate(
            req.usuario._id,
            actualizacion,
            { new: true, runValidators: true }
        ).select('-password');

        res.json({
            mensaje: 'Perfil actualizado exitosamente',
            usuario: usuarioActualizado
        });

    } catch (error) {
        console.error('Error en PUT /api/usuarios/perfil:', error);
        res.status(500).json({
            error: 'Error interno del servidor'
        });
    }
});

// GET /api/usuarios/inventario - Obtener inventario del usuario
router.get('/inventario', verificarToken, actualizarUltimoAcceso, async (req, res) => {
    console.log('GET /api/usuarios/inventario llamado');
    try {
        const usuario = await Usuario.findById(req.usuario._id)
            .select('inventario monedas gemas');

        res.json({
            inventario: usuario.inventario,
            monedas: usuario.monedas,
            gemas: usuario.gemas,
            mensaje: 'Inventario obtenido exitosamente'
        });

    } catch (error) {
        console.error('Error en GET /api/usuarios/inventario:', error);
        res.status(500).json({
            error: 'Error interno del servidor'
        });
    }
});

// GET /api/usuarios/ranking - Obtener ranking de usuarios
router.get('/ranking', async (req, res) => {
    console.log('GET /api/usuarios/ranking llamado');
    try {
        const { limite = 10 } = req.query;
        const ranking = await Usuario.obtenerRanking(parseInt(limite));

        res.json({
            ranking,
            mensaje: 'Ranking obtenido exitosamente'
        });

    } catch (error) {
        console.error('Error en GET /api/usuarios/ranking:', error);
        res.status(500).json({
            error: 'Error interno del servidor'
        });
    }
});

// POST /api/usuarios/logout - Cerrar sesión (opcional, ya que JWT es stateless)
router.post('/logout', verificarToken, async (req, res) => {
    console.log('POST /api/usuarios/logout llamado');
    try {
        // En un sistema JWT stateless, el logout se maneja en el cliente
        // Aquí podríamos implementar una lista negra de tokens si fuera necesario
        res.json({
            mensaje: 'Sesión cerrada exitosamente'
        });

    } catch (error) {
        console.error('Error en POST /api/usuarios/logout:', error);
        res.status(500).json({
            error: 'Error interno del servidor'
        });
    }
});

// GET /api/usuarios/estadisticas - Obtener estadísticas del usuario
router.get('/estadisticas', verificarToken, actualizarUltimoAcceso, async (req, res) => {
    console.log('GET /api/usuarios/estadisticas llamado');
    try {
        const usuario = await Usuario.findById(req.usuario._id)
            .select('estadisticas nivel experiencia monedas gemas');

        res.json({
            estadisticas: usuario.estadisticas,
            nivel: usuario.nivel,
            experiencia: usuario.experiencia,
            monedas: usuario.monedas,
            gemas: usuario.gemas,
            experienciaParaSiguienteNivel: (usuario.nivel * 1000) - usuario.experiencia,
            mensaje: 'Estadísticas obtenidas exitosamente'
        });

    } catch (error) {
        console.error('Error en GET /api/usuarios/estadisticas:', error);
        res.status(500).json({
            error: 'Error interno del servidor'
        });
    }
});

// GET /api/usuarios/mascotas-asignadas - Obtener mascotas asignadas al usuario
router.get('/mascotas-asignadas', verificarToken, actualizarUltimoAcceso, async (req, res) => {
    console.log('GET /api/usuarios/mascotas-asignadas llamado');
    try {
        // Obtener todas las mascotas asignadas al usuario
        const mascotasAsignadas = await Mascota.find({ 
            propietario: req.usuario._id 
        }).select('id nombre tipo poder personalidad salud energia felicidad adoptadoPor fechaCreacion');

        // Obtener información del usuario
        const usuario = await Usuario.findById(req.usuario._id)
            .select('username nombre estadisticas.mascotasAdoptadas');

        res.json({
            usuario: {
                username: usuario.username,
                nombre: usuario.nombre,
                mascotasAdoptadas: usuario.estadisticas.mascotasAdoptadas
            },
            mascotasAsignadas: mascotasAsignadas,
            totalMascotas: mascotasAsignadas.length,
            mensaje: 'Mascotas asignadas obtenidas exitosamente'
        });

    } catch (error) {
        console.error('Error en GET /api/usuarios/mascotas-asignadas:', error);
        res.status(500).json({
            error: 'Error interno del servidor'
        });
    }
});

export default router; 