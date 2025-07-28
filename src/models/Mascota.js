import mongoose from 'mongoose';

const itemSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: false
    },
    nombre: {
        type: String,
        required: true,
        trim: true
    },
    tipo: {
        type: String,
        required: false,
        trim: true
    },
    descripcion: {
        type: String,
        required: false,
        trim: true
    },
    efecto: {
        felicidad: {
            type: Number,
            default: 0
        },
        energia: {
            type: Number,
            default: 0
        },
        salud: {
            type: Number,
            default: 0
        }
    }
}, { _id: false });

const enfermedadSchema = new mongoose.Schema({
    tipo: {
        type: String,
        required: true,
        enum: ['resfriado', 'estomacal', 'tristeza', 'herida']
    },
    nombre: {
        type: String,
        required: true,
        trim: true
    },
    impactoSalud: {
        type: Number,
        required: true
    },
    impactoFelicidad: {
        type: Number,
        required: true
    },
    duracion: {
        type: Number,
        required: true,
        min: 1
    },
    inicio: {
        type: Date,
        required: true,
        default: Date.now
    },
    causa: {
        type: String,
        required: false,
        trim: true
    }
}, { _id: false });

const inmunidadSchema = new mongoose.Schema({
    hasta: {
        type: Date,
        required: true
    }
}, { _id: false });

const mascotaSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true,
        unique: true
    },
    nombre: {
        type: String,
        required: true,
        trim: true
    },
    tipo: {
        type: String,
        required: true,
        trim: true
    },
    poder: {
        type: String,
        required: true,
        trim: true
    },
    edad: {
        type: Number,
        required: true,
        min: 0
    },
    energia: {
        type: Number,
        required: true,
        min: 0,
        max: 100,
        default: 100
    },
    descripcion: {
        type: String,
        required: true,
        trim: true
    },
    idLugar: {
        type: Number,
        required: false,
        default: 1
    },
    adoptadoPor: {
        type: Number,
        required: false,
        default: null
    },
    propietario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario',
        required: false
    },
    salud: {
        type: Number,
        required: true,
        min: 0,
        max: 100,
        default: 100
    },
    felicidad: {
        type: Number,
        required: true,
        min: 0,
        max: 100,
        default: 100
    },
    personalidad: {
        type: String,
        required: true,
        enum: ['amigable', 'tímido', 'agresivo', 'juguetón'],
        default: 'amigable'
    },
    ultimaAlimentacion: {
        type: Date,
        required: true,
        default: Date.now
    },
    ultimoPaseo: {
        type: Date,
        required: true,
        default: Date.now
    },
    enfermedad: {
        type: enfermedadSchema,
        required: false,
        default: null
    },
    items: [itemSchema],
    inmunidades: {
        type: Map,
        of: inmunidadSchema,
        default: {}
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Índices para mejorar el rendimiento
mascotaSchema.index({ nombre: 1 });
mascotaSchema.index({ tipo: 1 });
mascotaSchema.index({ adoptadoPor: 1 });
mascotaSchema.index({ personalidad: 1 });

// Virtual para verificar si está disponible para adopción
mascotaSchema.virtual('disponible').get(function() {
    return this.adoptadoPor === null;
});

// Virtual para verificar si está enfermo
mascotaSchema.virtual('estaEnfermo').get(function() {
    return this.enfermedad !== null;
});

// Método estático para obtener mascotas disponibles
mascotaSchema.statics.getDisponibles = function() {
    return this.find({ adoptadoPor: null });
};

// Método estático para obtener mascotas por tipo
mascotaSchema.statics.getByTipo = function(tipo) {
    return this.find({ tipo: new RegExp(tipo, 'i') });
};

// Método estático para obtener mascotas por personalidad
mascotaSchema.statics.getByPersonalidad = function(personalidad) {
    return this.find({ personalidad });
};

// Método para alimentar mascota
mascotaSchema.methods.alimentar = function(tipoAlimento = 'normal') {
    this.ultimaAlimentacion = new Date();
    
    let incrementoEnergia = 0;
    let incrementoSalud = 0;
    
    switch(tipoAlimento) {
        case 'premium':
            incrementoEnergia = 20;
            incrementoSalud = 10;
            break;
        case 'especial':
            incrementoEnergia = 30;
            incrementoSalud = 15;
            break;
        default: // normal
            incrementoEnergia = 10;
            incrementoSalud = 5;
    }
    
    this.energia = Math.min(100, this.energia + incrementoEnergia);
    this.salud = Math.min(100, this.salud + incrementoSalud);
    
    return this;
};

// Método para pasear mascota
mascotaSchema.methods.pasear = function(duracion = 30) {
    this.ultimoPaseo = new Date();
    
    const incrementoFelicidad = Math.min(duracion / 10, 10);
    const decrementoEnergia = Math.min(duracion / 15, 20);
    
    this.felicidad = Math.min(100, this.felicidad + incrementoFelicidad);
    this.energia = Math.max(0, this.energia - decrementoEnergia);
    
    return this;
};

const Mascota = mongoose.model('Mascota', mascotaSchema);

export default Mascota; 