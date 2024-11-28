
    // Función para verificar si hay un usuario logueado
    function verificarSesion() {
        const usuario = JSON.parse(localStorage.getItem("usuarioLogueado"));
        return usuario && usuario.nombre; // Retorna true si hay un usuario con nombre
    }
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
        