import mongoose from 'mongoose';

const heroSchema = new mongoose.Schema({
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
    alias: {
        type: String,
        required: true,
        unique: true,
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
    ciudad: {
        type: String,
        required: true,
        trim: true
    },
    mascotas: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Mascota'
    }],
    propietario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario',
        required: false
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Índices para mejorar el rendimiento
heroSchema.index({ alias: 1 });
heroSchema.index({ ciudad: 1 });
heroSchema.index({ poder: 1 });

// Método estático para buscar por alias
heroSchema.statics.findByAlias = function(alias) {
    return this.findOne({ alias: new RegExp(alias, 'i') });
};

// Método para obtener héroes por ciudad
heroSchema.statics.findByCity = function(ciudad) {
    return this.find({ ciudad: new RegExp(ciudad, 'i') });
};

const Hero = mongoose.model('Hero', heroSchema);

export default Hero; 