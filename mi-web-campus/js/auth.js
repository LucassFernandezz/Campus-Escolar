document.addEventListener('DOMContentLoaded', () => {
    // Obtenemos una referencia al formulario de registro y al formulario de login
    const registerForm = document.getElementById('registerForm');
    const loginForm = document.getElementById('loginForm');

    // --- Lógica para el Registro ---
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault(); // Evita que el formulario recargue la página

            const nombre = document.getElementById('register-name').value;
            const email = document.getElementById('register-email').value;
            const password = document.getElementById('register-password').value;
            const confirmPassword = document.getElementById('register-confirm-password').value;
            const dni = document.getElementById('register-dni').value;

            // Obtenemos el rol del selector. Si no hay selector (o está vacío), usamos 'estudiante' por defecto.
            const rolElement = document.getElementById('register-rol');
            const rol = rolElement && rolElement.value ? rolElement.value : 'estudiante';

            // Obtenemos el código de alumno/profesor. Lo enviaremos si está presente.
            const codigoAlumnoElement = document.getElementById('register-codigo-alumno');
            const codigoAlumno = codigoAlumnoElement ? codigoAlumnoElement.value : '';

            // Validaciones básicas del lado del cliente
            if (password !== confirmPassword) {
                alert('Las contraseñas no coinciden.');
                return;
            }

            try {
                const response = await fetch('http://localhost:5000/api/auth/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        nombre,
                        email,
                        password,
                        dni,
                        rol,
                        codigoAlumno
                    })
                });

                const data = await response.json(); // Parsea la respuesta JSON del servidor

                if (response.ok) { // Si la respuesta HTTP es 2xx (ej. 200 OK, 201 Created)
                    alert(data.msg + '\nBienvenido, ' + data.nombre + '!');
                    // Guardar el token y el rol en localStorage para mantener la sesión
                    localStorage.setItem('token', data.token);
                    localStorage.setItem('userRol', data.rol);
                    localStorage.setItem('userName', data.nombre);

                    console.log('Usuario registrado con éxito. Redirigiendo según rol: ' + data.rol);

                    // --- Lógica de redirección AQUI después del REGISTRO ---
                    const userRol = localStorage.getItem('userRol');
                    if (userRol === 'estudiante') {
                        window.location.href = 'dashboardEstudiante.html';
                    } else if (userRol === 'profesor') { // <-- ¡ESTA ES LA LÍNEA AÑADIDA/MODIFICADA!
                        window.location.href = 'dashboardProfesor.html';
                    }
                    else {
                        // Si hay otros roles, podrías redirigirlos a otras páginas.
                        // Por ahora, si no es estudiante/profesor, los mandamos al index o a una página genérica.
                        alert('Registro exitoso para rol ' + userRol + '. Redirigiendo a la página principal por ahora.');
                        window.location.href = 'index.html'; // O una página genérica de "Esperando aprobación"
                    }
                } else { // Si la respuesta HTTP es un error (ej. 400 Bad Request, 500 Internal Server Error)
                    alert('Error al registrar: ' + (data.msg || 'Ha ocurrido un error desconocido.'));
                }
            } catch (error) {
                console.error('Error de red o del servidor al registrar:', error);
                alert('Hubo un problema al conectar con el servidor. Inténtalo más tarde.');
            }
        });
    }

    // --- Lógica para el Login ---
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault(); // Evita que el formulario recargue la página

            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;

            try {
                const response = await fetch('http://localhost:5000/api/auth/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email, password })
                });

                const data = await response.json(); // Parsea la respuesta JSON del servidor

                if (response.ok) { // Si la respuesta HTTP es 2xx (ej. 200 OK)
                    alert(data.msg + '\nBienvenido de nuevo, ' + data.nombre + '!');
                    // Guardar el token y el rol en localStorage
                    localStorage.setItem('token', data.token);
                    localStorage.setItem('userRol', data.rol);
                    localStorage.setItem('userName', data.nombre);

                    console.log('Inicio de sesión exitoso. Redirigiendo según rol: ' + data.rol);

                    // --- Lógica de redirección AQUI después del LOGIN ---
                    const userRol = localStorage.getItem('userRol');
                    if (userRol === 'estudiante') {
                        window.location.href = 'dashboardEstudiante.html';
                    } else if (userRol === 'profesor') { // <-- ¡ESTA ES LA LÍNEA AÑADIDA/MODIFICADA!
                        window.location.href = 'dashboardProfesor.html';
                    }
                    else {
                        // Redirección para otros roles.
                        alert('Inicio de sesión exitoso para rol ' + userRol + '. Redirigiendo a la página principal por ahora.');
                        window.location.href = 'index.html'; // O una página genérica de "Esperando aprobación"
                    }
                } else { // Si la respuesta HTTP es un error (ej. 400 Bad Request, 500 Internal Server Error)
                    alert('Error al iniciar sesión: ' + (data.msg || 'Credenciales inválidas.'));
                }
            } catch (error) {
                console.error('Error de red o del servidor al iniciar sesión:', error);
                alert('Hubo un problema al conectar con el servidor. Inténtalo más tarde.');
            }
        });
    }
});