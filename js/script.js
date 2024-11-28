document.addEventListener('DOMContentLoaded', function() {
    let index = 0;

    // Función para cambiar las imágenes del carrusel
    function cambiarImagen(n) {
        const imagenes = document.querySelector('.imagenes');
        if (imagenes) {  // Verifica que el contenedor exista
            const imagenesArray = Array.from(imagenes.children);
            const totalGrupos = imagenesArray.length;  // Ajustar para que dependa del número real de imágenes
            
            index = (index + n + totalGrupos) % totalGrupos;
            const desplazamiento = -index * 100;
            imagenes.style.transition = 'transform 1s ease'; // Añadir transición suave
            imagenes.style.transform = `translateX(${desplazamiento}%)`;
        } else {
            console.error("No se encontró el contenedor .imagenes");
        }
    }

    // Función para el carrusel automático
    function carruselAutomatico() {
        cambiarImagen(1);  // Mueve una imagen a la derecha cada vez
    }

    // Llama a la función carruselAutomatico cada 3 segundos (3000 ms)
    setInterval(carruselAutomatico, 3000);    
});
// Al cargar la página, verificamos si hay un usuario logueado
window.onload = function() {
    var usuario = JSON.parse(localStorage.getItem('usuarioLogueado'));

    if (usuario) {
        // Si hay un usuario logueado, mostrar su foto y nombre
        document.getElementById('foto-perfil').src = usuario.foto || 'images/default-avatar.png'; // Usar foto del usuario, o una predeterminada
        document.getElementById('acceder-enlace').textContent = usuario.nombre; // Mostrar el nombre del usuario
        document.getElementById('acceder-enlace').href = '#'; // El enlace no redirige a login.html
        document.getElementById('cerrar-sesion').style.display = 'none'; // Asegúrate de ocultarlo inicialmente

        // Cuando el usuario hace clic en su nombre, alternar la visibilidad de la opción de "Cerrar sesión"
        document.getElementById('acceder-enlace').addEventListener('click', function() {
            var cerrarSesionDiv = document.getElementById('cerrar-sesion');
            // Alterna entre mostrar/ocultar el div de "Cerrar sesión"
            if (cerrarSesionDiv.style.display === 'none' || cerrarSesionDiv.style.display === '') {
                cerrarSesionDiv.style.display = 'block'; // Muestra el enlace de cerrar sesión
            } else {
                cerrarSesionDiv.style.display = 'none'; // Oculta el enlace de cerrar sesión
            }
        });

        // Cuando el usuario hace clic en "Cerrar sesión"
        document.getElementById('cerrar-enlace').addEventListener('click', function() {
            // Eliminar el usuario logueado de localStorage
            localStorage.removeItem('usuarioLogueado');
            
            // Redirigir al usuario a la página de inicio (o login)
            window.location.href = 'index.html';  // O a otra página, según tu flujo
        });
    }
};
