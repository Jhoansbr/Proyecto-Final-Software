// Función para mostrar el formulario según el rol
function mostrarFormulario() {
    var rol = document.getElementById('rol').value;
    console.log(rol);
    // Ocultar ambos formularios inicialmente
    document.getElementById('form-cliente').style.display = 'none';
    document.getElementById('form-repartidor').style.display = 'none';
    
    // Mostrar el formulario correspondiente según el rol seleccionado
    if (rol === 'cliente') {
        document.getElementById('form-cliente').style.display = 'block';
    } else if (rol === 'repartidor') {
        document.getElementById('form-repartidor').style.display = 'block';
    }
}

// Función para registrar los usuarios en localStorage
function registrarUsuario(event, rol) {
    console.log('Formulario de ' + rol + ' enviado'); 
    event.preventDefault();  // Evita que el formulario se envíe normalmente
    

    // Recoger datos del formulario
    var nombre = document.getElementById(rol === 'cliente' ? 'nombre-completo' : 'nombre-completo-rep').value;
    var documento = document.getElementById(rol === 'cliente' ? 'documento' : 'documento-rep').value;
    var correo = document.getElementById(rol === 'cliente' ? 'correo' : 'correo-rep').value;
    var telefono = document.getElementById(rol === 'cliente' ? 'telefono' : 'telefono-rep').value;
    var direccion = document.getElementById(rol === 'cliente' ? 'direccion' : 'placa').value;
    var usuario = document.getElementById(rol === 'cliente' ? 'usuario' : 'usuario-rep').value;
    var contrasena = document.getElementById(rol === 'cliente' ? 'contrasena' : 'contrasena-rep').value;
    var foto = document.getElementById(rol === 'cliente' ? 'foto' : 'foto-rep').files[0];

    // Leer la imagen como base64 si existe
    var fotoBase64 = '';
    if (foto) {
        var reader = new FileReader();
        reader.onloadend = function () {
            fotoBase64 = reader.result;  // Almacena la imagen en base64
            guardarUsuario(fotoBase64);  // Llama a la función para guardar el usuario después de leer la imagen
        };
        reader.readAsDataURL(foto);  // Lee el archivo de la imagen
    } else {
        guardarUsuario(fotoBase64);  // Si no hay foto, se guarda el usuario sin imagen
    }
}

// Función para guardar el usuario en localStorage
function guardarUsuario(fotoBase64) {
    var rol = document.getElementById('rol').value;
    var nombre = document.getElementById(rol === 'cliente' ? 'nombre-completo' : 'nombre-completo-rep').value;
    var documento = document.getElementById(rol === 'cliente' ? 'documento' : 'documento-rep').value;
    var correo = document.getElementById(rol === 'cliente' ? 'correo' : 'correo-rep').value;
    var telefono = document.getElementById(rol === 'cliente' ? 'telefono' : 'telefono-rep').value;
    var direccion = document.getElementById(rol === 'cliente' ? 'direccion' : 'placa').value;
    var usuario = document.getElementById(rol === 'cliente' ? 'usuario' : 'usuario-rep').value;
    var contrasena = document.getElementById(rol === 'cliente' ? 'contrasena' : 'contrasena-rep').value;

    // Crear el objeto del nuevo usuario
    var nuevoUsuario = {
        rol: rol,
        nombre: nombre,
        documento: documento,
        correo: correo,
        telefono: telefono,
        direccion: direccion,
        usuario: usuario,
        contrasena: contrasena,
        foto: fotoBase64  // Guardamos la imagen en base64
    };

    // Verifica si el objeto nuevoUsuario se crea correctamente
    console.log(nuevoUsuario);

    // Recuperar usuarios almacenados en localStorage
    var usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];

    // Agregar el nuevo usuario al array
    usuarios.push(nuevoUsuario);

    // Guardar el array actualizado de usuarios en localStorage
    localStorage.setItem('usuarios', JSON.stringify(usuarios));

    alert('Usuario registrado exitosamente');
    document.getElementById(rol === 'cliente' ? 'formulario-cliente' : 'formulario-repartidor').reset();  // Limpiar el formulario
}

// Asociar el evento de envío del formulario
document.getElementById('formulario-cliente')?.addEventListener('submit', function (e) {
    registrarUsuario(e, 'cliente');
});

document.getElementById('formulario-repartidor')?.addEventListener('submit', function (e) {
    registrarUsuario(e, 'repartidor');
});
