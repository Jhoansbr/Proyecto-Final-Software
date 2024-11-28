document.addEventListener('DOMContentLoaded', () => {
    // Variables principales
    let reservasOcupadas = JSON.parse(localStorage.getItem('reservasOcupadas')) || [];
    let carrito = [];
    let reservaTemporal = null; // Almacena la información preliminar de la reserva

    // Deshabilitar campos inicialmente
    const personasInput = document.getElementById('personas');
    const horaInput = document.getElementById('hora');
    const checkboxes = document.querySelectorAll('.opciones-lista input[type="checkbox"]');
    personasInput.disabled = true;
    horaInput.disabled = true;
    checkboxes.forEach(checkbox => checkbox.disabled = true);

    // Función para actualizar datos en LocalStorage
    function actualizarReservasEnStorage() {
        localStorage.setItem('reservasOcupadas', JSON.stringify(reservasOcupadas));
    }

    // Mostrar un modal con mensaje personalizado
    function mostrarModal(titulo, mensaje) {
        document.getElementById('tituloModal').textContent = titulo;
        document.getElementById('mensajeModal').textContent = mensaje;
        const modal = document.getElementById('modalReserva');
        modal.style.display = 'flex';

        const cerrar = document.querySelector('.cerrar-modal');
        cerrar.onclick = () => (modal.style.display = 'none');
        modal.onclick = (event) => {
            if (event.target === modal) {
                modal.style.display = 'none';
            }
        };
    }

    // Función para obtener días deshabilitados (con 5 reservas o más)
    function obtenerDiasDeshabilitados() {
        const reservasPorFecha = {};

        reservasOcupadas.forEach(reserva => {
            const fecha = reserva.fecha;
            reservasPorFecha[fecha] = (reservasPorFecha[fecha] || 0) + 1;
        });

        return Object.keys(reservasPorFecha).filter(fecha => reservasPorFecha[fecha] >= 5);
    }

    // Inicialización del calendario Flatpickr
    const fechaPicker = flatpickr("#fecha", {
        dateFormat: "Y-m-d",
        minDate: "today",
        disable: obtenerDiasDeshabilitados(),
        onChange: (selectedDates, dateStr, instance) => {
            const diasDeshabilitados = obtenerDiasDeshabilitados();

            if (diasDeshabilitados.includes(dateStr)) {
                alert("Este día no está disponible para reservas. El límite de 5 reservas ya fue alcanzado.");
                instance.clear();
                return;
            }

            // Habilitar campos solo si la fecha es válida
            personasInput.disabled = false;
            horaInput.disabled = false;
            checkboxes.forEach(checkbox => checkbox.disabled = false);
        }
    });

    // Verificar si el usuario ha iniciado sesión
    function verificarSesion() {
        const usuario = JSON.parse(localStorage.getItem('usuarioLogueado'));
        console.log("Usuario logueado:", usuario); // Para depuración
        return usuario && usuario.nombre; // Verifica si el objeto existe y tiene un campo "nombre"
    }

    // Manejar el formulario de reservas
    document.getElementById('formReservas').addEventListener('submit', (event) => {
        event.preventDefault();

        // Verificar si el cliente está logueado
        if (!verificarSesion()) {
            mostrarModal("Error", "Debes iniciar sesión para realizar una reserva.");
            return;
        }

        const fecha = document.getElementById('fecha').value;
        const personas = personasInput.value;
        const hora = horaInput.value;
        const opcionesAdicionales = Array.from(document.querySelectorAll('.opciones-lista input[type="checkbox"]:checked'))
            .map(opcion => opcion.value);

        if (!fecha || !personas || !hora) {
            mostrarModal("Error", "Completa todos los campos.");
            return;
        }

        const fechaReserva = new Date(`${fecha}T${hora}:00`);
        const ahora = new Date();
        const diferenciaHoras = (fechaReserva - ahora) / (1000 * 60 * 60);

        if (diferenciaHoras < 12) {
            mostrarModal("Error", "La reserva debe hacerse con al menos 12 horas de antelación.");
            return;
        }

        // Validar límite de 5 reservas por día
        const reservasDelDia = reservasOcupadas.filter(reserva => reserva.fecha === fecha).length;
        if (reservasDelDia >= 5) {
            mostrarModal("Error", "Este día ya tiene el límite de 5 reservas.");
            return;
        }

        // Guardar los datos preliminares en reservaTemporal
        reservaTemporal = { fecha, hora, personas, opcionesAdicionales, platos: [] };
        document.getElementById('modalPlatos').style.display = 'flex';
    });
    // Mostrar carrito de platos
    document.getElementById('mostrarCarrito').addEventListener('click', () => {
        const carritoPlatos = document.getElementById('carritoPlatos');
        carritoPlatos.style.display = carritoPlatos.style.display === 'block' ? 'none' : 'block';

        const carritoContenido = document.getElementById('carritoContenido');
        if (carrito.length === 0) {
            carritoContenido.innerHTML = '<p>No hay platos en el carrito.</p>';
        } else {
            let total = 0;
            let contenidoCarrito = '<table><thead><tr><th>Plato</th><th>Cantidad</th><th>Precio</th><th>Total</th></tr></thead><tbody>';

            // Recorrer el carrito y mostrar platos, cantidad y precio
            carrito.forEach(item => {
                const totalPlato = item.precio * item.cantidad;
                total += totalPlato;
                contenidoCarrito += `
                    <tr>
                        <td>${item.nombre}</td>
                        <td>${item.cantidad}</td>
                        <td>$${item.precio.toFixed(2)}</td>
                        <td>$${totalPlato.toFixed(2)}</td>
                    </tr>
                `;
            });

            contenidoCarrito += `</tbody></table><h3>Total a Pagar: $${total.toFixed(2)}</h3>`;
            carritoContenido.innerHTML = contenidoCarrito;
        }
    });
    document.querySelectorAll('.agregar-carrito').forEach(button => {
        button.addEventListener('click', (event) => {
            const platoItem = event.target.closest('.plato-item');
            const nombrePlato = platoItem.querySelector('h3').textContent;
            const precioPlato = parseFloat(platoItem.getAttribute('data-precio'));  // Asegúrate de que este valor esté bien extraído
            const cantidad = parseInt(platoItem.querySelector('.cantidad-input').value);
    
            // Verifica si el precio es un número válido
            if (isNaN(precioPlato)) {
                alert("Error: El precio del plato no es válido.");
                return;
            }
    
            if (cantidad > 0) {
                // Verificar si el plato ya está en el carrito
                const platoExistente = carrito.find(item => item.nombre === nombrePlato);
                if (platoExistente) {
                    platoExistente.cantidad += cantidad; // Si existe, agregar la cantidad
                } else {
                    carrito.push({ nombre: nombrePlato, precio: precioPlato, cantidad }); // Agregar plato al carrito
                }
    
                alert(`${nombrePlato} agregado al carrito.`);
            } else {
                alert("Selecciona una cantidad válida.");
            }
        });
    });

    // Confirmar la selección de platos
    document.getElementById('confirmarPlatos').addEventListener('click', () => {
        if (carrito.length === 0) {
            alert("Selecciona al menos un plato antes de confirmar.");
            return;
        }
    
        // Obtener nombre del usuario logueado
        const usuario = JSON.parse(localStorage.getItem('usuarioLogueado'));
        if (!usuario) {
            alert("Error: No se encontró un usuario logueado.");
            return;
        }
    
        // Calcular el total a pagar por los platos seleccionados
        let totalPagar = 0;
        carrito.forEach(item => {
            totalPagar += item.precio * item.cantidad;
        });
    
        // Agregar los detalles del usuario, platos y total a la reserva
        reservaTemporal.platos = carrito; // Guardar platos seleccionados
        reservaTemporal.usuario = usuario.nombre; // Nombre del usuario logueado
        reservaTemporal.totalPagar = totalPagar; // Total a pagar
    
        // Confirmar la reserva
        alert(`Reserva confirmada con éxito por ${usuario.nombre}. Total a pagar: $${totalPagar.toFixed(2)}`);
    
        // Agregar la reserva al historial de reservas
        reservasOcupadas.push(reservaTemporal);
        actualizarReservasEnStorage();
    
        // Limpiar el carrito para nueva selección
        carrito = [];
        document.getElementById('carritoPlatos').style.display = 'none';
        document.getElementById('modalPlatos').style.display = 'none'; // Cerrar modal de platos
    });
});
function reiniciarFormulario() {
    // Vaciar variables
    carrito = [];
    reservaTemporal = null;

    // Limpiar campos del formulario
    document.getElementById('fecha').value = '';
    document.getElementById('personas').value = '';
    document.getElementById('hora').value = '';
    const checkboxes = document.querySelectorAll('.opciones-lista input[type="checkbox"]');
    checkboxes.forEach(checkbox => checkbox.checked = false);

    // Deshabilitar campos nuevamente
    document.getElementById('personas').disabled = true;
    document.getElementById('hora').disabled = true;
    checkboxes.forEach(checkbox => checkbox.disabled = true);

    // Ocultar carrito de platos y limpiar contenido
    const carritoPlatos = document.getElementById('carritoPlatos');
    carritoPlatos.style.display = 'none';
    document.getElementById('carritoContenido').innerHTML = '<p>No hay platos en el carrito.</p>';

    // Cerrar cualquier modal abierto
    document.getElementById('modalPlatos').style.display = 'none';
    const modalReserva = document.getElementById('modalReserva');
    if (modalReserva.style.display === 'flex') {
        modalReserva.style.display = 'none';
    }
}

// Filtrar los platos según la categoría seleccionada
const categoriaBtns = document.querySelectorAll('.categoria-btn'); // Botones de categorías
const platosItems = document.querySelectorAll('.plato-item'); // Elementos de platos

categoriaBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const categoriaSeleccionada = btn.getAttribute('data-categoria');

        // Mostrar solo los platos que coinciden con la categoría seleccionada
        platosItems.forEach(item => {
            if (item.getAttribute('data-categoria') === categoriaSeleccionada || categoriaSeleccionada === "todas") {
                item.style.display = 'block'; // Mostrar el plato
            } else {
                item.style.display = 'none'; // Ocultar el plato
            }
        });
    });
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
