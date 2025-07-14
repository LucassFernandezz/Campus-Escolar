document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('registerForm');
    const loginForm = document.getElementById('loginForm');

    // REFERENCIAS A LOS NUEVOS DIVS DE MENSAJES
    const messageDivLogin = document.getElementById('message'); 
    const messageDivRegister = document.getElementById('message-register'); 

    // Funciones para cambiar entre formularios y mostrar/ocultar contraseña (mantener estas)
    const showRegisterLink = document.getElementById('showRegister');
    const showLoginLink = document.getElementById('showLogin');
    const flipCardInner = document.querySelector('.flip-card-inner');

    if (showRegisterLink) {
        showRegisterLink.addEventListener('click', (e) => {
            e.preventDefault();
            flipCardInner.style.transform = 'rotateY(-180deg)';
            if (messageDivLogin) messageDivLogin.textContent = ''; // Limpiar mensajes al cambiar
            if (messageDivRegister) messageDivRegister.textContent = ''; // Limpiar mensajes al cambiar
        });
    }

    if (showLoginLink) {
        showLoginLink.addEventListener('click', (e) => {
            e.preventDefault();
            flipCardInner.style.transform = 'rotateY(0deg)';
            if (messageDivLogin) messageDivLogin.textContent = ''; // Limpiar mensajes al cambiar
            if (messageDivRegister) messageDivRegister.textContent = ''; // Limpiar mensajes al cambiar
        });
    }

    document.querySelectorAll('.password-toggle-icon').forEach(icon => {
        icon.addEventListener('click', () => {
            const targetId = icon.dataset.target;
            const targetInput = document.getElementById(targetId);
            if (targetInput.type === 'password') {
                targetInput.type = 'text';
                icon.textContent = 'visibility_off';
            } else {
                targetInput.type = 'password';
                icon.textContent = 'visibility';
            }
        });
    });

    // --- Lógica para el Registro (TU CÓDIGO ACTUAL, CON USO DE messageDivRegister) ---
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const nombre = document.getElementById('register-name').value;
            const email = document.getElementById('register-email').value;
            const password = document.getElementById('register-password').value;
            const confirmPassword = document.getElementById('register-confirm-password').value;
            const dni = document.getElementById('register-dni').value;

            const rolElement = document.getElementById('register-rol');
            const rol = rolElement && rolElement.value ? rolElement.value : 'estudiante';

            const codigoAlumnoElement = document.getElementById('register-codigo-alumno');
            const codigoAlumno = codigoAlumnoElement ? codigoAlumnoElement.value : '';

            // Restablecer mensaje
            if (messageDivRegister) messageDivRegister.textContent = '';

            // Validaciones básicas del lado del cliente
            if (password !== confirmPassword) {
                if (messageDivRegister) {
                    messageDivRegister.style.color = 'red';
                    messageDivRegister.textContent = 'Las contraseñas no coinciden.';
                }
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

                const data = await response.json();

                if (response.ok) {
                    localStorage.setItem('token', data.token);
                    localStorage.setItem('userRol', data.rol);
                    localStorage.setItem('userName', data.nombre);

                    if (messageDivRegister) {
                        messageDivRegister.style.color = 'green';
                        messageDivRegister.textContent = data.msg + ' Bienvenido, ' + data.nombre + '! Redirigiendo...';
                    }

                    console.log('Usuario registrado con éxito. Redirigiendo según rol: ' + data.rol);

                    // Lógica de redirección después del REGISTRO
                    if (data.rol === 'estudiante' || data.rol === 'familia') {
                        window.location.href = 'dashboardEstudiante.html';
                    } else if (data.rol === 'profesor' || data.rol === 'directivo' || data.rol === 'admin_sitio') {
                        window.location.href = 'dashboardProfesor.html';
                    } else {
                        if (messageDivRegister) {
                            messageDivRegister.style.color = 'orange';
                            messageDivRegister.textContent = 'Registro exitoso para rol ' + data.rol + '. Redirigiendo a la página principal por ahora.';
                        }
                        window.location.href = 'index.html';
                    }
                } else {
                    if (messageDivRegister) {
                        messageDivRegister.style.color = 'red';
                        messageDivRegister.textContent = 'Error al registrar: ' + (data.msg || 'Ha ocurrido un error desconocido.');
                    }
                }
            } catch (error) {
                console.error('Error de red o del servidor al registrar:', error);
                if (messageDivRegister) {
                    messageDivRegister.style.color = 'red';
                    messageDivRegister.textContent = 'Hubo un problema al conectar con el servidor. Inténtalo más tarde.';
                }
            }
        });
    }

    // --- Lógica para el Login (MODIFICADA, USANDO messageDivLogin) ---
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;
            const codigo = document.getElementById('login-code').value; // <-- CAPTURAMOS EL CÓDIGO

            // Restablecer mensaje
            if (messageDivLogin) messageDivLogin.textContent = '';

            // Validación de campos requeridos (ahora incluye el código)
            if (!email || !password || !codigo) {
                if (messageDivLogin) {
                    messageDivLogin.style.color = 'red';
                    messageDivLogin.textContent = 'Por favor, completa todos los campos (email, contraseña y código).';
                }
                return;
            }

            try {
                const response = await fetch('http://localhost:5000/api/auth/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email, password, codigo }) // <-- ENVIAMOS EL CÓDIGO
                });

                const data = await response.json();

                if (response.ok) {
                    localStorage.setItem('token', data.token);
                    localStorage.setItem('userRol', data.rol);
                    localStorage.setItem('userName', data.nombre);

                    if (messageDivLogin) {
                        messageDivLogin.style.color = 'green';
                        messageDivLogin.textContent = data.msg + ' Bienvenido de nuevo, ' + data.nombre + '! Redirigiendo...';
                    }

                    console.log('Inicio de sesión exitoso. Redirigiendo según rol: ' + data.rol);

                    // Lógica de redirección después del LOGIN
                    if (data.rol === 'estudiante' || data.rol === 'familia') {
                        window.location.href = 'dashboardEstudiante.html';
                    } else if (data.rol === 'profesor' || data.rol === 'directivo' || data.rol === 'admin_sitio') {
                        window.location.href = 'dashboardProfesor.html';
                    } else {
                        if (messageDivLogin) {
                            messageDivLogin.style.color = 'orange';
                            messageDivLogin.textContent = 'Inicio de sesión exitoso para rol ' + data.rol + '. Redirigiendo a la página principal por ahora.';
                        }
                        window.location.href = 'index.html';
                    }
                } else {
                    if (messageDivLogin) {
                        messageDivLogin.style.color = 'red';
                        messageDivLogin.textContent = 'Error al iniciar sesión: ' + (data.msg || 'Credenciales inválidas.');
                    }
                }
            } catch (error) {
                console.error('Error de red o del servidor al iniciar sesión:', error);
                if (messageDivLogin) {
                    messageDivLogin.style.color = 'red';
                    messageDivLogin.textContent = 'Hubo un problema al conectar con el servidor. Inténtalo más tarde.';
                }
            }
        });
    }
});