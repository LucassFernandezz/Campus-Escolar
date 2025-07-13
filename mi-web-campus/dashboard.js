document.addEventListener('DOMContentLoaded', () => {
    const userNameDisplay = document.getElementById('userNameDisplay');
    const logoutButton = document.getElementById('logoutButton');

    // Elementos para el menú colapsable
    // El menuToggle ahora está en el top-header, pero su clase sigue siendo la misma.
    const menuToggle = document.querySelector('.menu-toggle');
    const sidebar = document.querySelector('.sidebar');
    // Renombramos dashboardLayout a dashboardWrapper para que coincida con el HTML
    const dashboardWrapper = document.querySelector('.dashboard-wrapper'); 

    // Función para mostrar el nombre del usuario si está en localStorage
    const displayUserName = () => {
        const userRol = localStorage.getItem('userRol'); // OBTENIENDO EL ROL
        if (userNameDisplay && userRol) {
            userNameDisplay.textContent = userRol; // MOSTRANDO EL ROL
        } else if (userNameDisplay) {
            userNameDisplay.textContent = 'Usuario'; // Rol por defecto si no se encuentra
        }
    };

    // Lógica para cerrar sesión
    if (logoutButton) {
        logoutButton.addEventListener('click', (e) => {
            e.preventDefault();
            // Limpiar localStorage
            localStorage.removeItem('token');
            localStorage.removeItem('userRol');
            localStorage.removeItem('userName');
            alert('Sesión cerrada. ¡Hasta pronto!');
            // Redirigir a la página de inicio o login
            window.location.href = 'inicioRegistro.html'; // O 'index.html'
        });
    }

    // --- Lógica para el menú lateral colapsable ---
    // Verificamos que los elementos existan antes de añadir el event listener
    // Ahora, el dashboardWrapper es el que alterna la clase 'sidebar-collapsed'
    if (menuToggle && sidebar && dashboardWrapper) {
        menuToggle.addEventListener('click', () => {
            sidebar.classList.toggle('collapsed'); // Alterna la clase 'collapsed' en el sidebar
            dashboardWrapper.classList.toggle('sidebar-collapsed'); // Alterna esta clase en el nuevo layout principal
        });
    }

    // Llama a la función para mostrar el nombre al cargar la página
    displayUserName();

    // Implementación futura: Lógica para cargar las clases dinámicamente, etc.
});