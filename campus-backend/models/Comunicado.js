// models/Comunicado.js
const mongoose = require('mongoose');

const ComunicadoSchema = new mongoose.Schema({
    titulo: {
        type: String,
        required: true,
        trim: true
    },
    contenido: {
        type: String,
        required: true,
        trim: true
    },
    fechaPublicacion: {
        type: Date,
        default: Date.now
    },
    autor: { // Quién publicó el comunicado (profesor o directivo)
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Referencia al modelo User
        required: true
    },
    rolDestinatario: { // A quién va dirigido (ej. 'estudiante', 'profesor', 'todos')
        type: String,
        enum: ['estudiante', 'profesor', 'familia', 'directivo', 'todos'],
        default: 'todos'
    },
    cursoDestino: { // Opcional: Si es para un curso específico
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Curso', // Asumimos que tendremos un modelo 'Curso' más adelante
        default: null
    }
});

module.exports = mongoose.model('Comunicado', ComunicadoSchema);