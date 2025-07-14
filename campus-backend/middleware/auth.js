// middleware/auth.js
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config(); // Cargar las variables de entorno

module.exports = function (req, res, next) {
    // Obtener el token del header
    const token = req.header('x-auth-token'); // O 'Authorization' si lo envías con 'Bearer '

    // Verificar si no hay token
    if (!token) {
        return res.status(401).json({ msg: 'No hay token, autorización denegada' });
    }

    // Verificar el token
    try {
        // jwt.verify(token, process.env.JWT_SECRET) decodifica el token.
        // El payload que generamos en authRoutes.js es { user: { id: user.id, rol: user.rol } }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Adjuntar el usuario (con su ID y rol) a la solicitud
        req.user = decoded.user;
        next(); // Continuar con la siguiente función middleware o la ruta
    } catch (err) {
        console.error('Error en el middleware de autenticación:', err.message);
        res.status(401).json({ msg: 'Token no válido' });
    }
};