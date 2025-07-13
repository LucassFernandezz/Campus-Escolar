document.addEventListener('DOMContentLoaded', () => {
    // Referencias a elementos del DOM
    const flipCard = document.querySelector('.flip-card');
    const showRegisterLink = document.getElementById('showRegister');
    const showLoginLink = document.getElementById('showLogin');
    const passwordToggleIcons = document.querySelectorAll('.password-toggle-icon');

    // Funcionalidad de "Flip" entre formularios
    if (showRegisterLink && showLoginLink && flipCard) {
        showRegisterLink.addEventListener('click', (e) => {
            e.preventDefault(); // Evita que el enlace recargue la página
            flipCard.classList.add('flipped');
        });

        showLoginLink.addEventListener('click', (e) => {
            e.preventDefault(); // Evita que el enlace recargue la página
            flipCard.classList.remove('flipped');
        });
    }

    // Funcionalidad de alternar visibilidad de contraseña/código
    passwordToggleIcons.forEach(icon => {
        icon.addEventListener('click', () => {
            const targetId = icon.dataset.target; // Obtiene el ID del input asociado
            const targetInput = document.getElementById(targetId);

            if (targetInput) {
                if (targetInput.type === 'password') {
                    targetInput.type = 'text';
                    icon.textContent = 'visibility_off'; // Cambia el ícono a ojo cerrado
                } else {
                    targetInput.type = 'password';
                    icon.textContent = 'visibility'; // Cambia el ícono a ojo abierto
                }
            }
        });
    });

});

// script.js

document.addEventListener('DOMContentLoaded', () => {
    // Código para el acordeón en la página de Inscripciones
    const accordionHeaders = document.querySelectorAll('.accordion-header');

    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            // Encuentra el padre '.accordion-item'
            const accordionItem = header.closest('.accordion-item');

            // Alterna la clase 'active' en el '.accordion-item'
            accordionItem.classList.toggle('active');

            // Ajusta la altura del contenido del acordeón para la transición
            const accordionContent = accordionItem.querySelector('.accordion-content');
            if (accordionItem.classList.contains('active')) {
                // Cuando se abre, establece max-height a la altura real del scroll para una transición suave
                accordionContent.style.maxHeight = accordionContent.scrollHeight + 'px';
            } else {
                // Cuando se cierra, vuelve a 0
                accordionContent.style.maxHeight = '0';
            }
        });
    });

    // Código para el enlace 'active' en el navbar (si es necesario)
    const currentPath = window.location.pathname.split('/').pop();
    const navLinks = document.querySelectorAll('.nav-links a');

    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentPath) {
            link.classList.add('active');
        } else {
            link.classList.remove('active'); // Asegura que solo uno esté activo
        }
    });

    // Asegúrate de que el logo link no tenga la clase 'active' a menos que sea index.html
    const logoLink = document.querySelector('.logo-link');
    if (logoLink && currentPath !== 'index.html' && logoLink.querySelector('a')) {
        logoLink.querySelector('a').classList.remove('active');
    }
});