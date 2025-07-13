// models/User.js
const mongoose = require('mongoose');

// Definimos el esquema (estructura) de cómo se verán los datos de un usuario en MongoDB
const UserSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true, // El nombre es obligatorio
        trim: true // Elimina espacios en blanco al inicio y final
    },
    email: {
        type: String,
        required: true,
        unique: true, // El email debe ser único (no puede haber dos usuarios con el mismo email)
        trim: true,
        lowercase: true, // Guarda el email en minúsculas
        match: [/.+@.+\..+/, 'Por favor, introduce un email válido'] // Validación de formato de email
    },
    password: {
        type: String,
        required: true
    },
    rol: {
        type: String,
        // Los roles permitidos, coincidiendo con tu especificación detallada
        enum: ['estudiante', 'profesor', 'familia', 'admin_sitio', 'directivo'],
        default: 'estudiante' // Rol por defecto al registrarse (si no se especifica)
    },
    // Este campo lo añadiremos más adelante si implementamos la lógica de asociación de hijos para el rol "familia"
    // hijosAsociados: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Estudiante' }],
    fechaCreacion: {
        type: Date,
        default: Date.now // Guarda la fecha y hora de creación del usuario
    }
});

// Creamos el modelo a partir del esquema. Este modelo es lo que usaremos para interactuar con la colección de usuarios.
module.exports = mongoose.model('User', UserSchema);