const express = require('express');
const router = express.Router();
const User = require('../models/User'); 
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// --- RUTA DE REGISTRO DE USUARIO ---
router.post('/register', async (req, res) => {
    try {
        const { nombre, email, password, rol, codigoAlumno, dni } = req.body;

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

        let userRol = rol || 'estudiante';

        // Validamos código especial para roles de alto privilegio (profesor, admin_sitio, directivo)
        if (userRol !== 'estudiante' && userRol !== 'familia') {
            if (!codigoAlumno || codigoAlumno !== process.env.REGISTRO_ADMIN_SECRET) {
                return res.status(403).json({ msg: 'Código de registro especial inválido para este rol.' });
            }
        }
        
        // Si es estudiante, tu código anterior validaba que el código de alumno esté presente.
        // Esto es para el REGISTRO. Para el LOGIN, usaremos los CODIGO_ESTUDIANTE_GLOBAL / CODIGO_FAMILIA_GLOBAL
        if (userRol === 'estudiante' && !codigoAlumno) {
            // Este mensaje puede ser redundante si el frontend ya lo hace obligatorio, pero es una buena salvaguarda
            return res.status(400).json({ msg: 'Los estudiantes deben proporcionar un código de alumno al registrarse.' });
        }

        user = new User({
            nombre,
            email,
            password, // Esto se encriptará a continuación
            rol: userRol,
            dni,
        });

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        await user.save();

        const payload = {
            user: {
                id: user.id,
                rol: user.rol,
                userName: user.nombre 
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


// --- RUTA DE INICIO DE SESIÓN DE USUARIO (MODIFICADA) ---
router.post('/login', async (req, res) => {
    try {
        const { email, password, codigo } = req.body; 

        if (!email || !password || !codigo) {
            return res.status(400).json({ msg: 'Por favor, ingrese email, contraseña y código.' });
        }

        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: 'Credenciales inválidas.' }); 
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Credenciales inválidas.' });
        }

        // --- Lógica de validación del 'codigo' según el rol del usuario ---
        let codigoValido = false;

        switch (user.rol) {
            case 'profesor':
            case 'directivo':
            case 'admin_sitio':
                if (codigo === process.env.REGISTRO_ADMIN_SECRET) {
                    codigoValido = true;
                }
                break;
            case 'estudiante':
                if (codigo === process.env.CODIGO_ESTUDIANTE_GLOBAL) {
                    codigoValido = true;
                }
                break;
            case 'familia':
                if (codigo === process.env.CODIGO_FAMILIA_GLOBAL) {
                    codigoValido = true;
                }
                break;
            default:
                codigoValido = false;
                break;
        }

        if (!codigoValido) {
            return res.status(400).json({ msg: 'Código de acceso incorrecto para su rol.' });
        }

        const payload = {
            user: {
                id: user.id,
                rol: user.rol,
                userName: user.nombre 
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