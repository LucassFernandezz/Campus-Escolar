const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// --- RUTA DE REGISTRO DE USUARIO ---
router.post('/register', async (req, res) => {
    try {
        const { nombre, email, password, rol, codigoAlumno, dni } = req.body; // Asegúrate de que codigoAlumno esté aquí

        // --- VALIDACIONES INICIALES ---
        if (!nombre || !email || !password || !dni) {
            return res.status(400).json({ msg: 'Por favor, ingrese todos los campos obligatorios: nombre, email, contraseña y DNI.' });
        }

        if (!/.+@.+\..+/.test(email)) {
            return res.status(400).json({ msg: 'Por favor, introduzca un email válido.' });
        }

        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: 'El email ya está registrado.' });
        }

        // --- LÓGICA DE ROLES Y CÓDIGOS ESPECÍFICOS ---
        let userRol = rol || 'estudiante';

        // Aquí es donde validamos roles de alto privilegio (profesor, admin_sitio, directivo)
        if (userRol !== 'estudiante' && userRol !== 'familia') {
            // Ahora usamos 'codigoAlumno' que es lo que el frontend está enviando
            if (!codigoAlumno || codigoAlumno !== process.env.REGISTRO_ADMIN_SECRET) {
                return res.status(403).json({ msg: 'Código de registro especial inválido para este rol.' });
            }
        }

        // Si es estudiante, validamos que el código de alumno esté presente (opcional, tu lo tenías)
        if (userRol === 'estudiante' && !codigoAlumno) {
            return res.status(400).json({ msg: 'Los estudiantes deben proporcionar un código de alumno.' });
        }

        // 4. Crear un nuevo usuario
        user = new User({
            nombre,
            email,
            password,
            rol: userRol,
            dni,
            // Puedes guardar el codigoAlumno en el modelo User si lo necesitas después, por ejemplo:
            // codigoEspecificoRol: codigoAlumno
        });

        // 5. Encriptar la contraseña
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        // 6. Guardar el usuario en la base de datos
        await user.save();

        // 7. Generar un token JWT para la sesión
        const payload = {
            user: {
                id: user.id,
                rol: user.rol
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '1h' },
            (err, token) => {
                if (err) {
                    console.error(err);
                    return res.status(500).json({ msg: 'Error al generar token.' });
                }
                res.status(201).json({ msg: 'Usuario registrado con éxito', token, rol: user.rol, nombre: user.nombre });
            }
        );

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error del servidor al registrar usuario.');
    }
});

// --- RUTA DE INICIO DE SESIÓN DE USUARIO ---
router.post('/login', async (req, res) => {
    // ... (Tu código de login, que no necesita cambios aquí) ...
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ msg: 'Por favor, ingrese email y contraseña.' });
        }

        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: 'Credenciales inválidas.' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Credenciales inválidas.' });
        }

        const payload = {
            user: {
                id: user.id,
                rol: user.rol
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '1h' },
            (err, token) => {
                if (err) {
                    console.error(err);
                    return res.status(500).json({ msg: 'Error al generar token.' });
                }
                res.json({ msg: 'Inicio de sesión exitoso', token, rol: user.rol, nombre: user.nombre });
            }
        );

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error del servidor al iniciar sesión.');
    }
});

module.exports = router;