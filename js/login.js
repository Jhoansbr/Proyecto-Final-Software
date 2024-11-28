document.getElementById('login-form').addEventListener('submit', function(event) {
    event.preventDefault();  // Evitar el envío del formulario

    // Obtener los datos del formulario
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Verificar si el usuario es "admin" y la contraseña es "admin"
    if (username === "admin" && password === "admin") {
        // Redirigir al panel de administración
        window.location.href = "administrador.html";
        return; // Detener el código adicional
    }

    // Recuperar usuarios desde localStorage
    const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
    
    // Buscar el usuario que coincida con el nombre de usuario ingresado
    const usuario = usuarios.find(user => user.usuario === username);

    // Verificar si el usuario existe y si la contraseña es correcta
    if (usuario && usuario.contrasena === password) {
        // Si el login es exitoso, guardar el usuario en localStorage
        localStorage.setItem('usuarioLogueado', JSON.stringify({
            nombre: usuario.nombre,
            foto: usuario.foto // Aquí guardamos también la foto
        }));

        // Redirigir según el rol del usuario
        if (usuario.rol === 'cliente') {
            window.location.href = 'index.html';
        } else if (usuario.rol === 'repartidor') {
            window.location.href = 'Repartidor.html';
        } else if (usuario.rol === 'administrador') {
            window.location.href = 'administrador-dashboard.html';
        } else {
            alert('Rol no reconocido');
        }
    } else {
        // Si el usuario no existe o la contraseña es incorrecta, mostrar un error
        alert('Usuario o contraseña incorrectos');
    }
});
