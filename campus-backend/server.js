// Cargar variables de entorno desde un archivo .env
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); // Para permitir comunicación entre frontend y backend

const app = express();
const PORT = process.env.PORT || 5000; // El puerto en el que correrá tu servidor

// Middlewares
app.use(cors()); // Habilita CORS para todas las rutas
app.use(express.json()); // Permite a Express parsear cuerpos de petición JSON

// --- CONEXIÓN A MONGODB ATLAS ---
mongoose.connect(process.env.MONGO_URI, {
    // useNewUrlParser y useUnifiedTopology ya no son necesarias en Mongoose 6+
    // Puedes dejar los parámetros vacíos si tu versión de Mongoose es reciente
})
.then(() => console.log('Conectado a MongoDB Atlas'))
.catch(err => console.error('Error al conectar a MongoDB Atlas:', err));

// --- RUTAS (endpoints) ---
// Ruta de prueba
app.get('/', (req, res) => {
    res.send('Servidor del Campus ET36 funcionando. ¡Bienvenido!');
});

// Rutas de autenticación (registro e inicio de sesión)
app.use('/api/auth', require('./routes/authRoutes'));

// Rutas para comunicados
const comunicadosRoutes = require('./routes/comunicados'); // Importa las rutas de comunicados
app.use('/api/comunicados', comunicadosRoutes); // Usa las rutas de comunicados en el path /api/comunicados

// --- Iniciar el servidor ---
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
    console.log(`Accede a http://localhost:${PORT}`);
});