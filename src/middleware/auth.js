import jwt from 'jsonwebtoken';
import Usuario from '../models/Usuario.js';

// Middleware para verificar token JWT
export const verificarToken = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        
        if (!token) {
            return res.status(401).json({ 
                error: 'Acceso denegado. Token requerido.' 
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const usuario = await Usuario.findById(decoded.usuarioId).select('-password');
        
        if (!usuario || !usuario.activo) {
            return res.status(401).json({ 
                error: 'Token inválido o usuario inactivo.' 
            });
        }

        req.usuario = usuario;
        next();
    } catch (error) {
        console.error('Error en verificarToken:', error);
        res.status(401).json({ 
            error: 'Token inválido.' 
        });
    }
};

// Middleware para verificar que el usuario es propietario del recurso
export const verificarPropietario = (campo = 'usuarioId') => {
    return (req, res, next) => {
        try {
            const recursoUsuarioId = req.params[campo] || req.body[campo];
            
            if (!recursoUsuarioId) {
                return res.status(400).json({ 
                    error: 'ID de usuario requerido.' 
                });
            }

            if (req.usuario._id.toString() !== recursoUsuarioId) {
                return res.status(403).json({ 
                    error: 'No tienes permisos para acceder a este recurso.' 
                });
            }

            next();
        } catch (error) {
            console.error('Error en verificarPropietario:', error);
            res.status(500).json({ 
                error: 'Error interno del servidor.' 
            });
        }
    };
};

// Middleware para verificar roles (futuro uso)
export const verificarRol = (roles = []) => {
    return (req, res, next) => {
        if (!req.usuario) {
            return res.status(401).json({ 
                error: 'Usuario no autenticado.' 
            });
        }

        if (roles.length > 0 && !roles.includes(req.usuario.rol)) {
            return res.status(403).json({ 
                error: 'No tienes permisos suficientes.' 
            });
        }

        next();
    };
};

// Middleware para verificar que el usuario es premium
export const verificarPremium = (req, res, next) => {
    if (!req.usuario.esPremium) {
        return res.status(403).json({ 
            error: 'Esta función requiere cuenta premium.',
            sugerencia: 'Sube de nivel o compra gemas para desbloquear esta función.'
        });
    }
    next();
};

// Middleware para actualizar último acceso
export const actualizarUltimoAcceso = async (req, res, next) => {
    try {
        if (req.usuario) {
            await req.usuario.actualizarUltimoAcceso();
        }
        next();
    } catch (error) {
        console.error('Error actualizando último acceso:', error);
        next(); // No fallar la petición por este error
    }
}; 