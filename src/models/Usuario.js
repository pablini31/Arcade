import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const usuarioSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 3,
        maxlength: 30
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Por favor ingresa un email válido']
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    nombre: {
        type: String,
        required: true,
        trim: true,
        maxlength: 50
    },
    apellido: {
        type: String,
        required: false,
        trim: true,
        maxlength: 50
    },
    fechaNacimiento: {
        type: Date,
        required: false
    },
    avatar: {
        type: String,
        default: 'default-avatar.png'
    },
    nivel: {
        type: Number,
        default: 1,
        min: 1
    },
    experiencia: {
        type: Number,
        default: 0,
        min: 0
    },
    monedas: {
        type: Number,
        default: 100,
        min: 0
    },
    gemas: {
        type: Number,
        default: 10,
        min: 0
    },
    fechaCreacion: {
        type: Date,
        default: Date.now
    },
    ultimoAcceso: {
        type: Date,
        default: Date.now
    },
    activo: {
        type: Boolean,
        default: true
    },
    mascotas: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Mascota'
    }],
    heroes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Hero'
    }],
    inventario: {
        items: [{
            itemId: Number,
            cantidad: {
                type: Number,
                default: 1,
                min: 1
            },
            fechaObtencion: {
                type: Date,
                default: Date.now
            }
        }],
        alimentos: [{
            tipo: {
                type: String,
                enum: ['normal', 'premium', 'especial'],
                default: 'normal'
            },
            cantidad: {
                type: Number,
                default: 1,
                min: 1
            }
        }],
        medicamentos: [{
            tipo: {
                type: String,
                enum: ['vitaminaC', 'antibiotico', 'antidepresivo', 'medicamentoGeneral'],
                default: 'medicamentoGeneral'
            },
            cantidad: {
                type: Number,
                default: 1,
                min: 1
            }
        }]
    },
    configuracion: {
        notificaciones: {
            type: Boolean,
            default: true
        },
        sonido: {
            type: Boolean,
            default: true
        },
        idioma: {
            type: String,
            default: 'es',
            enum: ['es', 'en']
        }
    },
    estadisticas: {
        mascotasAdoptadas: {
            type: Number,
            default: 0
        },
        mascotasCuidadas: {
            type: Number,
            default: 0
        },
        tiempoJugado: {
            type: Number,
            default: 0 // en minutos
        },
        logrosDesbloqueados: [{
            type: String
        }]
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Índices para mejorar el rendimiento
usuarioSchema.index({ username: 1 });
usuarioSchema.index({ email: 1 });
usuarioSchema.index({ nivel: -1, experiencia: -1 });

// Virtual para el nombre completo
usuarioSchema.virtual('nombreCompleto').get(function() {
    return `${this.nombre} ${this.apellido || ''}`.trim();
});

// Virtual para verificar si es usuario premium
usuarioSchema.virtual('esPremium').get(function() {
    return this.nivel >= 10 || this.gemas >= 50;
});

// Método para encriptar contraseña antes de guardar
usuarioSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Método para comparar contraseñas
usuarioSchema.methods.compararPassword = async function(passwordCandidata) {
    return await bcrypt.compare(passwordCandidata, this.password);
};

// Método para actualizar último acceso
usuarioSchema.methods.actualizarUltimoAcceso = function() {
    this.ultimoAcceso = new Date();
    return this.save();
};

// Método para agregar experiencia
usuarioSchema.methods.agregarExperiencia = function(cantidad) {
    this.experiencia += cantidad;
    
    // Calcular si sube de nivel (cada 1000 puntos de experiencia)
    const nuevoNivel = Math.floor(this.experiencia / 1000) + 1;
    if (nuevoNivel > this.nivel) {
        this.nivel = nuevoNivel;
        // Dar recompensas por subir de nivel
        this.monedas += nuevoNivel * 50;
        this.gemas += Math.floor(nuevoNivel / 5) + 1;
    }
    
    return this.save();
};

// Método para agregar monedas
usuarioSchema.methods.agregarMonedas = function(cantidad) {
    this.monedas += cantidad;
    return this.save();
};

// Método para gastar monedas
usuarioSchema.methods.gastarMonedas = function(cantidad) {
    if (this.monedas < cantidad) {
        throw new Error('Monedas insuficientes');
    }
    this.monedas -= cantidad;
    return this.save();
};

// Método para agregar gemas
usuarioSchema.methods.agregarGemas = function(cantidad) {
    this.gemas += cantidad;
    return this.save();
};

// Método para gastar gemas
usuarioSchema.methods.gastarGemas = function(cantidad) {
    if (this.gemas < cantidad) {
        throw new Error('Gemas insuficientes');
    }
    this.gemas -= cantidad;
    return this.save();
};

// Método estático para buscar por username o email
usuarioSchema.statics.buscarPorCredenciales = function(usernameOrEmail) {
    return this.findOne({
        $or: [
            { username: usernameOrEmail },
            { email: usernameOrEmail }
        ],
        activo: true
    });
};

// Método estático para obtener ranking de usuarios
usuarioSchema.statics.obtenerRanking = function(limite = 10) {
    return this.find({ activo: true })
        .sort({ nivel: -1, experiencia: -1 })
        .limit(limite)
        .select('username nombre nivel experiencia');
};

const Usuario = mongoose.model('Usuario', usuarioSchema);

export default Usuario; 