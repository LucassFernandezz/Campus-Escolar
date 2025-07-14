document.addEventListener('DOMContentLoaded', () => {
    const userNameDisplay = document.getElementById('userNameDisplay');
    const userRolDisplay = document.getElementById('userRolDisplay'); // Asegúrate de tener este span en tu HTML si lo usas
    const logoutButton = document.getElementById('logoutButton');

    // Elementos para el menú colapsable
    const menuToggle = document.querySelector('.menu-toggle');
    const sidebar = document.querySelector('.sidebar');
    const dashboardWrapper = document.querySelector('.dashboard-wrapper');

    // Recuperar datos del usuario del localStorage
    const token = localStorage.getItem('token');
    const userRol = localStorage.getItem('userRol');
    const userName = localStorage.getItem('userName'); // Asumo que también guardas el nombre

    // Si no hay token, redirigir al login
    if (!token) {
        window.location.href = 'inicioRegistro.html';
        return; // Detener la ejecución del script
    }

    // Mostrar nombre y rol del usuario
    if (userNameDisplay) {
        userNameDisplay.textContent = userName || 'Usuario'; // Muestra el nombre
    }
    if (userRolDisplay) { // Asegúrate de tener un span con id="userRolDisplay" en tu sidebar
        userRolDisplay.textContent = userRol || 'Rol Desconocido';
    }


    // Función para mostrar una sección de contenido y ocultar las demás
    function showSection(sectionId) {
        // Oculta todas las secciones de contenido
        document.querySelectorAll('.content-section').forEach(section => {
            section.style.display = 'none';
        });
        // Muestra la sección deseada
        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            targetSection.style.display = 'block';
        }
    }

    // Manejadores de eventos para la barra lateral
    const sidebarNavLinks = document.querySelectorAll('.sidebar ul li a.nav-link');
    sidebarNavLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('data-target');
            if (targetId) {
                showSection(targetId);
            }
        });
    });

    // Lógica para cerrar sesión
    if (logoutButton) {
        logoutButton.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.removeItem('token');
            localStorage.removeItem('userRol');
            localStorage.removeItem('userName');
            alert('Sesión cerrada. ¡Hasta pronto!');
            window.location.href = 'inicioRegistro.html';
        });
    }

    // --- Lógica para el menú lateral colapsable ---
    if (menuToggle && sidebar && dashboardWrapper) {
        menuToggle.addEventListener('click', () => {
            sidebar.classList.toggle('collapsed');
            dashboardWrapper.classList.toggle('sidebar-collapsed');
        });
    }

    // --- Lógica para Publicar Comunicados (NUEVO) ---
    const formPublicarComunicado = document.getElementById('formPublicarComunicado');
    const comunicadoMessage = document.getElementById('comunicadoMessage');

    if (formPublicarComunicado) {
        formPublicarComunicado.addEventListener('submit', async (e) => {
            e.preventDefault();

            const titulo = document.getElementById('comunicadoTitulo').value;
            const contenido = document.getElementById('comunicadoContenido').value;
            const rolDestinatario = document.getElementById('comunicadoRolDestinatario').value;
            // const cursoDestino = document.getElementById('comunicadoCurso').value; // Descomentar si usas cursos

            if (!titulo || !contenido) {
                comunicadoMessage.style.color = 'red';
                comunicadoMessage.textContent = 'El título y el contenido son obligatorios.';
                return;
            }

            try {
                const response = await fetch('http://localhost:5000/api/comunicados', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-auth-token': token // Enviamos el token para autenticar
                    },
                    body: JSON.stringify({
                        titulo,
                        contenido,
                        rolDestinatario,
                        // cursoDestino: cursoDestino || null // Descomentar si usas cursos
                    })
                });

                const data = await response.json();

                if (response.ok) {
                    comunicadoMessage.style.color = 'green';
                    comunicadoMessage.textContent = 'Comunicado publicado con éxito!';
                    formPublicarComunicado.reset(); // Limpiar el formulario
                } else {
                    comunicadoMessage.style.color = 'red';
                    comunicadoMessage.textContent = data.msg || 'Error al publicar comunicado.';
                }
            } catch (error) {
                console.error('Error al publicar comunicado:', error);
                comunicadoMessage.style.color = 'red';
                comunicadoMessage.textContent = 'Error de conexión con el servidor.';
            }
        });
    }

    // Mostrar la sección inicial al cargar la página (por ejemplo, Mis Clases)
    showSection('misClasesSection'); // Asegura que "Mis Clases" sea la primera sección visible
});