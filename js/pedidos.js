// Función para verificar si hay un usuario logueado
function verificarSesion() {
    const usuario = JSON.parse(localStorage.getItem("usuarioLogueado"));
    return usuario && usuario.nombre; // Retorna true si hay un usuario con nombre
}

// Función de inicialización
window.onload = function () {
    const usuario = JSON.parse(localStorage.getItem("usuarioLogueado"));

    if (usuario) {
        configurarUsuarioLogueado(usuario);
    }
};

// Configura los datos del usuario logueado
function configurarUsuarioLogueado(usuario) {
    document.getElementById("foto-perfil").src = usuario.foto || "images/default-avatar.png";
    document.getElementById("acceder-enlace").textContent = usuario.nombre;
    document.getElementById("acceder-enlace").href = "#";
    document.getElementById("cerrar-sesion").style.display = "none";

    document.getElementById("acceder-enlace").addEventListener("click", alternarCerrarSesion);
    document.getElementById("cerrar-enlace").addEventListener("click", cerrarSesion);
}

// Alterna la visibilidad de la opción "Cerrar sesión"
function alternarCerrarSesion() {
    const cerrarSesionDiv = document.getElementById("cerrar-sesion");
    cerrarSesionDiv.style.display =
        cerrarSesionDiv.style.display === "none" || cerrarSesionDiv.style.display === ""
            ? "block"
            : "none";
}

// Cierra la sesión y redirige al inicio
function cerrarSesion() {
    localStorage.removeItem("usuarioLogueado");
    window.location.href = "index.html";
}

// Datos de los platos
const platosData = {
    entradas: [
        { nombre: "Bruschetta", precio: "7.000 $", descripcion: "Tostadas de pan rústico untadas con ajo y aceite de oliva, cubiertas con tomate picado, albahaca fresca, y queso parmesano.", imagen: "images/primera1.jpg" },
        { nombre: "Rollo Primavera", precio: "10.000 $", descripcion: "Rollos de papel de arroz rellenos de vegetales frescos, camarones o carne, servidos con salsa agridulce o de soya.", imagen: "images/segunda.jpg" },
        { nombre: "Ceviche", precio: "13.000 $", descripcion: "Pescado o mariscos marinados en jugo de limón, mezclados con cebolla, ají, cilantro y camote.", imagen: "images/tercera.jpg" },
        { nombre: "Hummus con Pan Pita", precio: "8.000 $", descripcion: "Crema hecha a base de garbanzos, tahini, ajo, jugo de limón, aceite de oliva y pan pita tibio.", imagen: "images/quinta.jpg" },
        { nombre: "Caprese", precio: "6.000 $", descripcion: "Rodajas de tomate, mozzarella fresca, albahaca, sal, pimienta y aceite de oliva.", imagen: "images/sexta.jpg" },
        { nombre: "Tostones con Guacamole", precio: "7.000 $", descripcion: "Rodajas de plátano verde fritas, acompañadas de guacamole fresco preparado con aguacate, cebolla, tomate, cilantro, y jugo de limón.", imagen: "images/cuarta.jpg" }
    ],
    principales: [
        { nombre: "Pollo en Salsa de Champiñones", precio: "40.000 $", descripcion: "Pechuga de pollo jugosa, cocinada a la perfección en una cremosa salsa de champiñones, acompañada de arroz blanco y vegetales al vapor.", imagen: "images/p1.jpg" },
        { nombre: "Lomito a la Parrilla", precio: "55.000 $", descripcion: "Filete de res marinado con especias, servido con papas al horno y una ensalada fresca de arúgula y tomate cherry.", imagen: "images/p2.jpg" },
        { nombre: "Pasta Alfredo con Camarones", precio: "65.000 $", descripcion: "Pasta fettuccine bañada en una cremosa salsa Alfredo con ajo, queso parmesano y camarones salteados.", imagen: "images/p3.jpg" },
        { nombre: "Pescado Tropical", precio: "58.000 $", descripcion: "Filete de pescado a la plancha, cubierto con una salsa de mango y piña, acompañado de arroz con coco y ensalada mixta.", imagen: "images/p4.jpg" },
        { nombre: "Costillas BBQ", precio: "36.000 $", descripcion: "Costillas de cerdo bañadas en salsa BBQ casera, servidas con puré de papas cremoso y mazorca a la parrilla.", imagen: "images/p5.jpg" },
        { nombre: "Enchiladas Mexicanas", precio: "47.000 $", descripcion: "Tortillas rellenas de pollo desmenuzado, bañadas en salsa roja y gratinadas con queso, servidas con frijoles refritos y guacamole.", imagen: "images/p6.jpg" }
    ],
    postres: [
        { nombre: "Tiramisú", precio: "20.000 $", descripcion: "Capas de bizcochos empapados en café espresso y licor (amaretto o marsala), queso mascarpone y cacao en polvo.", imagen: "images/po1.jpg" },
        { nombre: "Macarons", precio: "15.000 $", descripcion: "Merengue de almendra, relleno con ganache, mermelada o crema.", imagen: "images/po2.jpg" },
        { nombre: "Torta de queso", precio: "22.000 $", descripcion: "Pastel cremoso hecho de queso crema, sobre una base de galleta triturada y una cobertura (mermelada, chocolate o caramelo).", imagen: "images/po3.jpg" },
        { nombre: "Churros con chocolate", precio: "18.000 $", descripcion: "Bastones fritos de masa, cubiertos con azúcar acompañado con una taza de chocolate.", imagen: "images/po4.jpg" },
        { nombre: "Baklava", precio: "26.000 $", descripcion: "Capas de masa fina rellenas de nueces picadas (pistachos o almendras) y bañadas en jarabe de miel.", imagen: "images/po5.jpg" },
        { nombre: "Mousse de chocolate", precio: "17.000 $", descripcion: "Suave mousse de chocolate.", imagen: "images/po6.jpg" }
    ]
};


// Carga los platos de una categoría
function cargarPlatos(categoria) {
    const platosContainer = document.getElementById("platos-container");
    platosContainer.innerHTML = ""; // Limpia los platos previos

    const platos = platosData[categoria];
    platos.forEach(plato => crearPlatoHTML(plato, platosContainer));
}

// Crea el HTML de un plato y lo agrega al contenedor
function crearPlatoHTML(plato, container) {
    const platoDiv = document.createElement("div");
    platoDiv.classList.add("menu-item");
    platoDiv.innerHTML = `
        <img src="${plato.imagen}" alt="${plato.nombre}">
        <p class="title">${plato.nombre}</p>
        <p class="description">${plato.descripcion}</p>
        <p class="price">Precio por persona: ${plato.precio}</p>
        <div class="cantidad-container">
            <label for="cantidad-${plato.nombre}">Cantidad:</label>
            <input type="number" id="cantidad-${plato.nombre}" class="cantidad-input" min="0" value="0">
        </div>
        <button id="agregar-${plato.nombre}" class="agregar-al-carrito" onclick="agregarAlCarrito('${plato.nombre}', '${plato.precio}', 'cantidad-${plato.nombre}')">Agregar al carrito</button>
    `;
    container.appendChild(platoDiv);

    configurarBotonAgregar(plato.nombre);
}

// Configura el botón "Agregar al carrito" para un plato
function configurarBotonAgregar(nombrePlato) {
    const cantidadInput = document.getElementById(`cantidad-${nombrePlato}`);
    const botonAgregar = document.getElementById(`agregar-${nombrePlato}`);

    cantidadInput.addEventListener("input", () => {
        const cantidad = parseInt(cantidadInput.value);
        botonAgregar.disabled = isNaN(cantidad) || cantidad < 1;
    });
}

// Variables globales
let carrito = [];
let pagoRealizado = false;

// Agrega un plato al carrito
function agregarAlCarrito(nombre, precio, cantidadId) {
    const cantidadInput = document.getElementById(cantidadId);
    const cantidad = parseInt(cantidadInput.value);

    if (isNaN(cantidad) || cantidad <= 0) {
        alert("La cantidad debe ser mayor que 0.");
        return;
    }

    if (pagoRealizado) {
        alert("El pago ya fue realizado. No puedes agregar más platos al carrito.");
        return;
    }

    const precioNumerico = parseInt(precio.replace(/[^\d]/g, ""));
    carrito.push({ nombre, precio: precioNumerico, cantidad });
    actualizarCarrito();
}

// Actualiza el contenido del carrito
function actualizarCarrito() {
    const listaCarrito = document.getElementById("lista-carrito");
    const totalElement = document.getElementById("total");
    const botonConfirmar = document.getElementById("boton-confirmar");

    listaCarrito.innerHTML = ""; // Limpia el carrito
    let total = 0;

    // Si la tabla no tiene los encabezados ya en el HTML, puedes agregar los encabezados aquí
    if (!listaCarrito.querySelector("thead")) {
        const encabezado = document.createElement("thead");
        encabezado.innerHTML = `
            <tr>
                <th>Producto</th>
                <th>Precio</th>
                <th>Cantidad</th>
                <th>Subtotal</th>
                <th>Acción</th>
            </tr>
        `;
        listaCarrito.appendChild(encabezado);
    }

    // Cuerpo de la tabla (donde se agregarán las filas)
    const cuerpoTabla = document.createElement("tbody");

    carrito.forEach((item, index) => {
        const subtotal = item.precio * item.cantidad;
        total += subtotal;

        const fila = document.createElement("tr");
        
        fila.innerHTML = `
            <td>${item.nombre}</td>
            <td>${item.precio.toLocaleString()} $</td>
            <td>${item.cantidad}</td>
            <td>${subtotal.toLocaleString()} $</td>
            <td><button class="eliminar" onclick="eliminarDelCarrito(${index})">Eliminar</button></td>
        `;
        cuerpoTabla.appendChild(fila);
    });

    listaCarrito.appendChild(cuerpoTabla);

    totalElement.textContent = `Total: ${total.toLocaleString()} $`;
    botonConfirmar.disabled = carrito.length === 0;
}
// Elimina un plato del carrito
function eliminarDelCarrito(index) {
    carrito.splice(index, 1);
    actualizarCarrito();
}

// Vacía el carrito completamente
function vaciarCarrito() {
    carrito = [];
    actualizarCarrito();
}
function obtenerRepartidores() {
    const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
    // Filtrar los usuarios cuyo rol sea "repartidor"
    return usuarios.filter(usuario => usuario.rol === "repartidor");
}
// Confirma el pedido y muestra el modal de pago
function confirmarPedido() {
    if (carrito.length === 0) {
        alert("El carrito está vacío. Agrega platos antes de confirmar.");
        return;
    }
    if (!verificarSesion()) {
        alert("Debes iniciar sesión para confirmar el pedido.");
        window.location.href = "login.html";
        return;
    }

    bloquearFondo();
    document.getElementById("modalPago").style.display = "block";
}

function enviarPago() {
    // Obtener los valores del formulario
    const nombreCliente = document.getElementById("nombre").value.trim();
    const direccionCliente = document.getElementById("direccion").value.trim();
    const telefonoCliente = document.getElementById("telefono").value.trim();
    
    console.log("nombreClienteElem:", nombreCliente);
    console.log("direccionClienteElem:", direccionCliente);
    console.log("telefonoClienteElem:", telefonoCliente);
    
    if (!nombreCliente || !direccionCliente || !telefonoCliente) {
        console.error("Uno o más elementos no se encontraron en el DOM.");
        return;
    }
    
   
    // Verificar si hay un usuario logueado
    if (!verificarSesion()) {
        alert("Debes iniciar sesión para confirmar el pedido.");
        window.location.href = "login.html"; // Redirige a la página de inicio de sesión
        return;
    }

    // Verificar si el carrito tiene elementos
    if (carrito.length === 0) {
        alert("Tu carrito está vacío. No puedes confirmar el pedido.");
        return;
    }

    // Guardar el pedido con los datos del cliente en localStorage
    guardarPedidoEnLocalStorage(nombreCliente, direccionCliente, telefonoCliente);
    alert("Pago realizado con éxito.");
    // Mostrar mensaje de éxito y cerrar el modal de pago
}

// Función para guardar el pedido con dirección, teléfono y nombre del cliente
function guardarPedidoEnLocalStorage(nombreCliente, direccionCliente, telefonoCliente) {
    const repartidores = obtenerRepartidores();

    if (repartidores.length === 0) {
        alert("No hay repartidores disponibles. Por favor, agrega repartidores.");
        return;
    }

    // Obtener el usuario logueado
    const usuarioLogueado = JSON.parse(localStorage.getItem("usuarioLogueado"));

    // Obtener los pedidos existentes del localStorage o inicializar un array vacío
    let pedidosConfirmados = JSON.parse(localStorage.getItem("pedidosConfirmados")) || [];

    // Seleccionar un repartidor aleatorio
    const repartidorAsignado = repartidores[Math.floor(Math.random() * repartidores.length)];


        // Crear el nuevo pedido
        const nuevoPedido = {
            id: Date.now(), // ID único del pedido
            fecha: new Date().toLocaleString(), // Fecha del pedido
            usuario: {
                id: usuarioLogueado.documento,
                nombre: usuarioLogueado.nombre,
            },
            direccion: direccionCliente, // Dirección del cliente desde el modal
            telefono: telefonoCliente, // Teléfono del cliente desde el modal
            items: [...carrito], // Detalles del carrito
            total: carrito.reduce((total, item) => total + item.precio * item.cantidad, 0), // Calcular total
            estado: "Pendiente", // Estado inicial
            repartidor: repartidorAsignado
        };

        // Agregar el nuevo pedido al array de pedidos confirmados
        pedidosConfirmados.push(nuevoPedido);

        // Guardar los pedidos confirmados en localStorage
        localStorage.setItem("pedidosConfirmados", JSON.stringify(pedidosConfirmados));

        // Limpiar el carrito después de guardar el pedido
        vaciarCarrito();
        habilitarFondo();
        console.log("Pedido guardado con dirección y teléfono:", nuevoPedido);
    } 


// Función para seleccionar un repartidor aleatorio


// Bloquea la interacción con el fondo
function bloquearFondo() {
    document.getElementById("overlay").style.display = "block";
    document.body.style.overflow = "hidden";
}

// Habilita la interacción con el fondo
function habilitarFondo() {
    document.getElementById("overlay").style.display = "none";
    document.body.style.overflow = "auto";
}


