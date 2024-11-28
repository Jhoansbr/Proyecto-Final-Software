
function cerrarSesion() {
    // Mostrar un cuadro de confirmación antes de cerrar sesión
    const confirmar = window.confirm("¿Deseas cerrar sesión?");
    
    // Si el usuario confirma, redirigir a la página de inicio de sesión
    if (confirmar) {
      window.location.href = "login.html"; // Cambia la URL según la ruta de tu página de inicio de sesión
    }
    // Si el usuario cancela, no hacer nada
    else {
      console.log("La sesión no se cerró.");
    }
  }
   

  function showTable(tableId) {
    // Oculta todos los contenedores de tablas
    const tables = document.querySelectorAll('.table-container');
    tables.forEach(table => {
      table.style.display = 'none';
    });

    // Muestra el contenedor de la tabla seleccionada
    const selectedTable = document.getElementById(tableId);
    if (selectedTable) {
      selectedTable.style.display = 'block';
    }
  }
  window.onload = () => {
    // Obtener el nombre del usuario desde localStorage
    const userName = localStorage.getItem('usuarioLogueado');
    
    // Si hay un nombre guardado, actualizar el contenido
    if (userName) {
        const usuario = JSON.parse(userName);
        document.getElementById("userName").textContent = usuario.nombre;
        document.getElementById("welcomeUserName").textContent = usuario.nombre;
    }

    // Simulación del rol de repartidor
    const user = {
        name: userName, // Nombre del repartidor
        role: "repartidor" // Rol del usuario
    };

    // Asignar el nombre y el rol dinámicamente
    if (user.role === "repartidor") {
        document.getElementById("welcomeSection").classList.add('active');
    }

    // Inicializamos las secciones
    document.getElementById('assignedTable').style.display = 'none';
    document.getElementById('deliveredTable').style.display = 'none';
    document.getElementById('assignedMessage').innerHTML = '';
    document.getElementById('deliveredMessage').innerHTML = '';
    
    // Cargar los pedidos asignados
    cargarPedidosAsignados();
    // Cargar los pedidos entregados
    cargarPedidosEntregados();
};

// Función para cargar los pedidos asignados desde localStorage
function cargarPedidosAsignados() {
    const pedidosConfirmados = JSON.parse(localStorage.getItem("pedidosConfirmados")) || [];
    const assignedTable = document.getElementById('assignedTable').getElementsByTagName('tbody')[0];

    if (pedidosConfirmados.length === 0) {
        document.getElementById('assignedMessage').innerHTML = "<p>No hay pedidos asignados aún.</p>";
    } else {
        pedidosConfirmados.forEach(pedido => {
            if (pedido.estado === "Pendiente") {
                // Crear una nueva fila para la tabla
                const row = assignedTable.insertRow();

                // Insertar celdas en la fila
                row.insertCell(0).textContent = pedido.id; // ID del pedido
                row.insertCell(1).textContent = pedido.usuario.nombre; // Nombre del cliente
                row.insertCell(2).textContent = pedido.direccion; // Dirección del cliente
                row.insertCell(3).textContent = pedido.telefono; // Teléfono del cliente
                row.insertCell(4).textContent = pedido.total.toLocaleString() + ' $'; // Precio total del pedido

                // Estado con un botón "Entregado"
                const estadoCell = row.insertCell(5);
                const entregadoButton = document.createElement("button");
                entregadoButton.textContent = "Entregado";
                entregadoButton.classList.add("btn", "green");
                entregadoButton.onclick = () => marcarComoEntregado(pedido.id);
                estadoCell.appendChild(entregadoButton);
            }
        });
    }

    // Mostrar la tabla
    document.getElementById('assignedTable').style.display = 'table';
}

// Función para cargar los pedidos entregados desde localStorage
function cargarPedidosEntregados() {
    const pedidosConfirmados = JSON.parse(localStorage.getItem("pedidosConfirmados")) || [];
    const deliveredTable = document.getElementById('deliveredTable').getElementsByTagName('tbody')[0];

    if (pedidosConfirmados.length === 0) {
        document.getElementById('deliveredMessage').innerHTML = "<p>No hay pedidos entregados aún.</p>";
    } else {
        pedidosConfirmados.forEach(pedido => {
            if (pedido.estado === "Entregado") {
                // Crear una nueva fila para la tabla
                const row = deliveredTable.insertRow();

                // Insertar celdas en la fila
                row.insertCell(0).textContent = pedido.id; // ID del pedido
                row.insertCell(1).textContent = pedido.usuario.nombre; // Nombre del cliente
                row.insertCell(2).textContent = pedido.direccion; // Dirección del cliente
                row.insertCell(3).textContent = pedido.telefono; // Teléfono del cliente
                row.insertCell(4).textContent = pedido.total.toLocaleString() + ' $'; // Precio total del pedido

                // Estado: texto "Entregado"
                row.insertCell(5).textContent = "Entregado"; // Estado solo texto
            }
        });
    }

    // Mostrar la tabla
    document.getElementById('deliveredTable').style.display = 'table';
}

// Función para marcar un pedido como entregado
function marcarComoEntregado(pedidoId) {
    const pedidosConfirmados = JSON.parse(localStorage.getItem("pedidosConfirmados")) || [];
    const pedidoIndex = pedidosConfirmados.findIndex(pedido => pedido.id === pedidoId);

    if (pedidoIndex !== -1) {
        // Cambiar el estado del pedido a "Entregado"
        pedidosConfirmados[pedidoIndex].estado = "Entregado";
        
        // Guardar los cambios en localStorage
        localStorage.setItem("pedidosConfirmados", JSON.stringify(pedidosConfirmados));
        location.reload();

        // Volver a cargar los pedidos
        cargarPedidosAsignados();
        cargarPedidosEntregados();  // También recargar los pedidos entregados
    }
}

// Función para mostrar secciones específicas de pedidos
function showSection(sectionId) {
    // Oculta todas las secciones
    const sections = document.querySelectorAll('.orders-section');
    sections.forEach(section => section.classList.remove('active'));

    // Muestra solo la sección seleccionada
    const targetSection = document.getElementById(sectionId);
    targetSection.classList.add('active');

    // Lógica para verificar pedidos asignados
    if (sectionId === 'assignedOrders') {
        handleAssignedOrders();
    }

    // Lógica para verificar pedidos entregados
    if (sectionId === 'deliveredOrders') {
        handleDeliveredOrders();
    }
}

// Maneja la lógica de los pedidos asignados
function handleAssignedOrders() {
    const assignedOrders = document.querySelectorAll('#assignedTable tbody tr');
    const assignedMessage = document.getElementById('assignedMessage');
    const assignedTable = document.getElementById('assignedTable');

    if (assignedOrders.length === 0) {
        assignedMessage.innerHTML = '<p>No hay pedidos asignados aún.</p>';
        assignedTable.style.display = 'none'; // Oculta la tabla
    } else {
        assignedMessage.innerHTML = ''; // Limpia el mensaje
        assignedTable.style.display = 'table'; // Muestra la tabla
    }
}

// Maneja la lógica de los pedidos entregados
function handleDeliveredOrders() {
    const deliveredOrders = document.querySelectorAll('#deliveredTable tbody tr');
    const deliveredMessage = document.getElementById('deliveredMessage');
    const deliveredTable = document.getElementById('deliveredTable');

    if (deliveredOrders.length === 0) {
        deliveredMessage.innerHTML = '<p>No hay pedidos entregados aún.</p>';
        deliveredTable.style.display = 'none'; // Oculta la tabla
    } else {
        deliveredMessage.innerHTML = ''; // Limpia el mensaje
        deliveredTable.style.display = 'table'; // Muestra la tabla
    }
}

function cerrarSesion() {
    // Mostrar un cuadro de confirmación antes de cerrar sesión
    const confirmar = window.confirm("¿Deseas cerrar sesión?");
    
    // Si el usuario confirma, redirigir a la página de inicio de sesión
    if (confirmar) {
      window.location.href = "login.html"; // Cambia la URL según la ruta de tu página de inicio de sesión
    }
    // Si el usuario cancela, no hacer nada
    else {
      console.log("La sesión no se cerró.");
    }
  }
   

  function showTable(tableId) {
    // Oculta todos los contenedores de tablas
    const tables = document.querySelectorAll('.table-container');
    tables.forEach(table => {
      table.style.display = 'none';
    });

    // Muestra el contenedor de la tabla seleccionada
    const selectedTable = document.getElementById(tableId);
    if (selectedTable) {
      selectedTable.style.display = 'block';
    }
  }
  window.onload = () => {
    // Obtener el nombre del usuario desde localStorage
    const userName = localStorage.getItem('usuarioLogueado');
    
    // Si hay un nombre guardado, actualizar el contenido
    if (userName) {
        const usuario = JSON.parse(userName);
        document.getElementById("userName").textContent = usuario.nombre;
        document.getElementById("welcomeUserName").textContent = usuario.nombre;
    }

    // Simulación del rol de repartidor
    const user = {
        name: userName, // Nombre del repartidor
        role: "repartidor" // Rol del usuario
    };

    // Asignar el nombre y el rol dinámicamente
    if (user.role === "repartidor") {
        document.getElementById("welcomeSection").classList.add('active');
    }

    // Inicializamos las secciones
    document.getElementById('assignedTable').style.display = 'none';
    document.getElementById('deliveredTable').style.display = 'none';
    document.getElementById('assignedMessage').innerHTML = '';
    document.getElementById('deliveredMessage').innerHTML = '';
    
    // Cargar los pedidos asignados
    cargarPedidosAsignados();
    // Cargar los pedidos entregados
    cargarPedidosEntregados();
};

// Función para cargar los pedidos asignados desde localStorage
function cargarPedidosAsignados() {
    const pedidosConfirmados = JSON.parse(localStorage.getItem("pedidosConfirmados")) || [];
    const assignedTable = document.getElementById('assignedTable').getElementsByTagName('tbody')[0];

    if (pedidosConfirmados.length === 0) {
        document.getElementById('assignedMessage').innerHTML = "<p>No hay pedidos asignados aún.</p>";
    } else {
        pedidosConfirmados.forEach(pedido => {
            if (pedido.estado !== "Entregado") {
                // Crear una nueva fila para la tabla
                const row = assignedTable.insertRow();

                // Insertar celdas en la fila
                row.insertCell(0).textContent = pedido.id; // ID del pedido
                row.insertCell(1).textContent = pedido.usuario.nombre; // Nombre del cliente
                row.insertCell(2).textContent = pedido.direccion; // Dirección del cliente
                row.insertCell(3).textContent = pedido.telefono; // Teléfono del cliente
                row.insertCell(4).textContent = pedido.total.toLocaleString() + ' $'; // Precio total del pedido

                // Estado con un botón "Entregado"
                const estadoCell = row.insertCell(5);
                const entregadoButton = document.createElement("button");
                entregadoButton.textContent = "Entregado";
                entregadoButton.classList.add("btn", "green");
                entregadoButton.onclick = () => marcarComoEntregado(pedido.id);
                estadoCell.appendChild(entregadoButton);
            }
        });
    }

    // Mostrar la tabla
    document.getElementById('assignedTable').style.display = 'table';
}

// Función para cargar los pedidos entregados desde localStorage
function cargarPedidosEntregados() {
    const pedidosConfirmados = JSON.parse(localStorage.getItem("pedidosConfirmados")) || [];
    const deliveredTable = document.getElementById('deliveredTable').getElementsByTagName('tbody')[0];

    if (pedidosConfirmados.length === 0) {
        document.getElementById('deliveredMessage').innerHTML = "<p>No hay pedidos entregados aún.</p>";
    } else {
        pedidosConfirmados.forEach(pedido => {
            if (pedido.estado === "Entregado") {
                // Crear una nueva fila para la tabla
                const row = deliveredTable.insertRow();

                // Insertar celdas en la fila
                row.insertCell(0).textContent = pedido.id; // ID del pedido
                row.insertCell(1).textContent = pedido.usuario.nombre; // Nombre del cliente
                row.insertCell(2).textContent = pedido.direccion; // Dirección del cliente
                row.insertCell(3).textContent = pedido.telefono; // Teléfono del cliente
                row.insertCell(4).textContent = pedido.total.toLocaleString() + ' $'; // Precio total del pedido

                // Estado: texto "Entregado"
                row.insertCell(5).textContent = "Entregado"; // Estado solo texto
            }
        });
    }

    // Mostrar la tabla
    document.getElementById('deliveredTable').style.display = 'table';
}

// Función para marcar un pedido como entregado
function marcarComoEntregado(pedidoId) {
    const pedidosConfirmados = JSON.parse(localStorage.getItem("pedidosConfirmados")) || [];
    const pedidoIndex = pedidosConfirmados.findIndex(pedido => pedido.id === pedidoId);

    if (pedidoIndex !== -1) {
        // Cambiar el estado del pedido a "Entregado"
        pedidosConfirmados[pedidoIndex].estado = "Entregado";
        
        // Guardar los cambios en localStorage
        localStorage.setItem("pedidosConfirmados", JSON.stringify(pedidosConfirmados));
        location.reload();

        // Volver a cargar los pedidos
        cargarPedidosAsignados();
        cargarPedidosEntregados();  // También recargar los pedidos entregados
    }
}

// Función para mostrar secciones específicas de pedidos
function showSection(sectionId) {
    // Oculta todas las secciones
    const sections = document.querySelectorAll('.orders-section');
    sections.forEach(section => section.classList.remove('active'));

    // Muestra solo la sección seleccionada
    const targetSection = document.getElementById(sectionId);
    targetSection.classList.add('active');

    // Lógica para verificar pedidos asignados
    if (sectionId === 'assignedOrders') {
        handleAssignedOrders();
    }

    // Lógica para verificar pedidos entregados
    if (sectionId === 'deliveredOrders') {
        handleDeliveredOrders();
    }
}

// Maneja la lógica de los pedidos asignados
function handleAssignedOrders() {
    const assignedOrders = document.querySelectorAll('#assignedTable tbody tr');
    const assignedMessage = document.getElementById('assignedMessage');
    const assignedTable = document.getElementById('assignedTable');

    if (assignedOrders.length === 0) {
        assignedMessage.innerHTML = '<p>No hay pedidos asignados aún.</p>';
        assignedTable.style.display = 'none'; // Oculta la tabla
    } else {
        assignedMessage.innerHTML = ''; // Limpia el mensaje
        assignedTable.style.display = 'table'; // Muestra la tabla
    }
}

// Maneja la lógica de los pedidos entregados
function handleDeliveredOrders() {
    const deliveredOrders = document.querySelectorAll('#deliveredTable tbody tr');
    const deliveredMessage = document.getElementById('deliveredMessage');
    const deliveredTable = document.getElementById('deliveredTable');

    if (deliveredOrders.length === 0) {
        deliveredMessage.innerHTML = '<p>No hay pedidos entregados aún.</p>';
        deliveredTable.style.display = 'none'; // Oculta la tabla
    } else {
        deliveredMessage.innerHTML = ''; // Limpia el mensaje
        deliveredTable.style.display = 'table'; // Muestra la tabla
    }
}
