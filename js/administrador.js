
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
   
// Función para mostrar la tabla seleccionada
function showTable(tableId) {
  // Ocultar todas las tablas
  const tables = document.querySelectorAll('.table-container');
  tables.forEach(table => {
    table.style.display = 'none';
  });

  // Ocultar el mensaje de bienvenida
  const welcome = document.getElementById('welcomeMessage');
  if (welcome) {
    welcome.style.display = 'none';
  }

  // Mostrar la tabla seleccionada
  const selectedTable = document.getElementById(tableId);
  if (selectedTable) {
    selectedTable.style.display = 'block';
  }

  // Opcional: Lógica adicional para tablas específicas
  if (tableId === 'pedidosTable') {
    loadPedidos();
  } else if (tableId === 'menuTable') {
    updateMenuTable();
  }
}


// Función para cerrar sesión
function cerrarSesion() {
  // Redirigir a la página de login
  window.location.href = 'login.html';  // Cambia la URL según tu página de login
}
function changeOrderStatus(pedidoId) {
  console.log("Función: ", pedidoId);
  const pedidos = JSON.parse(localStorage.getItem('pedidosConfirmados')) || [];
  
  // Convertir el pedidoId a número para hacer la comparación con el id numérico de los pedidos
  const pedido = pedidos.find(p => p.id === parseInt(pedidoId)); // Buscar el pedido por id
  
  if (!pedido) {
      alert('Pedido no encontrado.');
      return;
  }

  // Verificamos si el estado es "Entregado"
  if (pedido.estado === "Entregado") {
      alert('El pedido ya está entregado. No se puede modificar el estado.');
      return;  // Salir de la función si el estado es "Entregado"
  }

  // Cambiar el estado del pedido si no está "Entregado"
  const newState = prompt('Ingrese el nuevo estado del pedido (En preparación / Enviado):', pedido.estado);

  if (newState && (newState === 'En preparación' || newState === 'Enviado')) {
      // Actualizamos el estado del pedido
      pedido.estado = newState;

      // Guardamos los cambios en el localStorage
      localStorage.setItem('pedidosConfirmados', JSON.stringify(pedidos));

      // Actualizamos la tabla
      loadPedidos();
      alert(`Estado del pedido actualizado a: ${newState}`);
  } else {
      alert('Estado no válido.');
  }
}
// Función para cargar los pedidos confirmados
function loadPedidos() {
  const pedidosTableBody = document.getElementById('pedidosTableBody');
  const pedidos = JSON.parse(localStorage.getItem('pedidosConfirmados')) || [];
  pedidosTableBody.innerHTML = '';  // Limpiar la tabla antes de agregar nuevos pedidos

  if (pedidos.length === 0) {
      pedidosTableBody.innerHTML = `<tr><td colspan="7">No hay pedidos confirmados</td></tr>`;
  } else {
      pedidos.forEach(pedido => {
          const cliente = pedido.usuario ? pedido.usuario.nombre : 'Desconocido';
          const direccion = pedido.direccion || 'No disponible';
          const estado = pedido.estado || 'No disponible';
          const fecha = pedido.fecha || 'No disponible';
          const total = pedido.total || 0;
          const items = pedido.items ? pedido.items.map(item => `${item.nombre} (x${item.cantidad})`).join(', ') : 'Sin items';
          const id = pedido.id;  // Asegurarse de que el id existe y es válido

          // Asegurarse de que el id está siendo asignado correctamente
          console.log('ID del pedido:', id);

          pedidosTableBody.innerHTML += `
              <tr>
                  <td>${id}</td>
                  <td>${cliente}</td>
                  <td>${direccion}</td>
                  <td>${items}</td>
                  <td>${fecha}</td>
                  <td>${estado}</td>
                  <td>${total.toLocaleString()} $</td>
                  <td>
                      <button class="btn edit" data-pedido-id="${id}">Cambiar Estado</button>
                  </td>
              </tr>
          `;
      });
  }
  pedidosTableBody.addEventListener('click', function(event) {
    // Verificamos si el clic fue en un botón con la clase 'btn.edit'
    if (event.target && event.target.classList.contains('btn') && event.target.classList.contains('edit')) {
      const pedidoId = event.target.getAttribute('data-pedido-id');
      console.log(pedidoId)
      changeOrderStatus(pedidoId); // Llamar a la función cambiarEstado con el ID del pedido
    }
  });

}

// Función para mostrar el modal
function showModal(isEdit = false, dishName = null) {
  const modalTitle = document.getElementById('modalTitle');
  const dishNameField = document.getElementById('dishName');
  const dishPriceField = document.getElementById('dishPrice');
  const dishDescriptionField = document.getElementById('dishDescription');
  const dishIngredientsField = document.getElementById('dishIngredients');

  if (isEdit && dishName) {
      // Si es para editar, buscamos el platillo en el menú
      const menu = JSON.parse(localStorage.getItem('menu')) || [];
      const dish = menu.find(d => d.name === dishName);

      if (dish) {
          // Rellenamos el formulario con los datos del platillo a editar
          dishNameField.value = dish.name;
          dishPriceField.value = dish.price;
          dishDescriptionField.value = dish.description;
          dishIngredientsField.value = dish.ingredients;
          currentDishName = dishName;

          // Cambiar el título del modal
          modalTitle.textContent = 'Editar Platillo';
      }
  } else {
      // Si es para agregar, limpiar los campos
      dishNameField.value = '';
      dishPriceField.value = '';
      dishDescriptionField.value = '';
      dishIngredientsField.value = '';
      currentDishName = null;

      // Cambiar el título del modal
      modalTitle.textContent = 'Agregar Nuevo Platillo';
  }

  // Mostrar el modal
  document.getElementById('modalOverlay').style.display = 'block';
  document.getElementById('addDishModal').style.display = 'block';
}
// Función para cerrar el modal
function closeModal() {
  document.getElementById('modalOverlay').style.display = 'none';
  document.getElementById('addDishModal').style.display = 'none';
  currentDishName = null;
}

// Función para agregar o editar un platillo
document.getElementById('addDishForm').addEventListener('submit', function (e) {
  e.preventDefault(); // Prevenir la recarga de la página

  // Obtener los valores del formulario
  const dishName = document.getElementById('dishName').value.trim();
  const dishPrice = parseFloat(document.getElementById('dishPrice').value);
  const dishDescription = document.getElementById('dishDescription').value.trim();
  const dishIngredients = document.getElementById('dishIngredients').value.trim();

  const menu = JSON.parse(localStorage.getItem('menu')) || [];

  if (currentDishName) {
      // Si estamos editando, actualizamos el platillo
      const dishIndex = menu.findIndex(d => d.name === currentDishName);

      if (dishIndex !== -1) {
          menu[dishIndex] = {
              name: dishName,
              price: dishPrice,
              description: dishDescription,
              ingredients: dishIngredients
          };
      }

  } else {
      // Si estamos agregando, agregamos un nuevo platillo
      menu.push({
          name: dishName,
          price: dishPrice,
          description: dishDescription,
          ingredients: dishIngredients
      });
  }

  // Guardar el menú actualizado en el localStorage
  localStorage.setItem('menu', JSON.stringify(menu));

  // Actualizar la tabla del menú
  updateMenuTable();

  // Cerrar el modal
  closeModal();

  alert(currentDishName ? 'Platillo editado correctamente.' : 'Platillo agregado correctamente.');
});
// Función para eliminar un platillo del menú
// Función para actualizar la tabla del menú
function updateMenuTable() {
  const menuTableBody = document.getElementById('menuTableBody');
  const menu = JSON.parse(localStorage.getItem('menu')) || [];
  menuTableBody.innerHTML = '';

  menu.forEach(dish => {
      menuTableBody.innerHTML += `
          <tr>
              <td>${dish.name}</td>
              <td>${dish.price.toLocaleString()} $</td>
              <td>
                  <button class="btn edit" onclick="showModal(true, '${dish.name}')">Editar</button>
                  <button class="btn delete" onclick="deleteDish('${dish.name}')">Eliminar</button>
              </td>
          </tr>
      `;
  });
}

// Función para eliminar un platillo
function deleteDish(dishName) {
  let menu = JSON.parse(localStorage.getItem('menu')) || [];
  menu = menu.filter(d => d.name !== dishName);
  localStorage.setItem('menu', JSON.stringify(menu));
  updateMenuTable();
}

// Función para editar un platillo (si es necesario)
function editDish(dishName) {
  // Obtener el menú desde el localStorage
  const menu = JSON.parse(localStorage.getItem('menu')) || [];
  
  // Buscar el platillo en el menú
  const dish = menu.find(d => d.name === dishName);

  if (!dish) {
      alert("Platillo no encontrado.");
      return;
  }

  // Rellenar los campos del modal con los datos del platillo
  document.getElementById('editDishName').value = dish.name;
  document.getElementById('editDishPrice').value = dish.price;
  document.getElementById('editDishDescription').value = dish.description;
  document.getElementById('editDishIngredients').value = dish.ingredients;

  // Mostrar el modal de edición
  document.getElementById('editDishModalOverlay').style.display = 'block';
  document.getElementById('editDishModal').style.display = 'block';

  // Guardar el nombre del platillo que se está editando
  currentDishName = dishName;
}
document.getElementById('editDishForm').addEventListener('submit', function (e) {
  e.preventDefault(); // Prevenir el comportamiento por defecto del formulario

  // Obtener los valores del formulario
  const editedName = document.getElementById('editDishName').value.trim();
  const editedPrice = parseFloat(document.getElementById('editDishPrice').value);
  const editedDescription = document.getElementById('editDishDescription').value.trim();
  const editedIngredients = document.getElementById('editDishIngredients').value.trim();

  // Obtener el menú desde el localStorage
  let menu = JSON.parse(localStorage.getItem('menu')) || [];

  // Buscar el índice del platillo que se está editando
  const dishIndex = menu.findIndex(d => d.name === currentDishName);

  if (dishIndex === -1) {
      alert("No se encontró el platillo en el menú.");
      closeEditModal();
      return;
  }

  // Actualizar los datos del platillo
  menu[dishIndex] = {
      name: editedName,
      price: editedPrice,
      description: editedDescription,
      ingredients: editedIngredients
  };

  // Guardar el menú actualizado en el localStorage
  localStorage.setItem('menu', JSON.stringify(menu));

  // Actualizar la tabla del menú
  updateMenuTable();

  // Cerrar el modal de edición
  closeEditModal();

  alert("Platillo actualizado correctamente.");
});
// Cerrar el modal de edición
function closeEditModal() {
  document.getElementById('editDishModalOverlay').style.display = 'none';
  document.getElementById('editDishModal').style.display = 'none';
  currentDishName = null; // Restablecer el platillo que se está editando
}
document.addEventListener('DOMContentLoaded', function() {
  alert("entra")
  // Seleccionar todos los botones de "Cambiar Estado" por su clase
  const buttons = document.querySelectorAll('.btn.edit');
  
  // Iterar sobre todos los botones y asignarles un eventListener
  buttons.forEach(button => {
      const pedidoId = button.getAttribute('data-pedido-id'); // Obtener el ID del pedido desde el atributo

      // Agregar el eventListener al botón
      button.addEventListener('click', function() {
          changeOrderStatus(pedidoId);  // Llamar a la función con el ID del pedido
      });
  });
});// Función para mostrar el modal de agregar ingrediente (si usas uno)
function showAddIngredientModal() {
  document.getElementById("addIngredientModal").style.display = "block";
}

// Función para cerrar el modal de agregar ingrediente
function closeAddIngredientModal() {
  document.getElementById("addIngredientModal").style.display = "none";
}
// Función para agregar un ingrediente al localStorage y la tabla
document.getElementById("addIngredientForm").addEventListener("submit", function(event) {
  event.preventDefault(); // Prevenir el envío del formulario y recarga
  console.log("Formulario enviado"); // Verifica que se llama al evento

  // Obtener los valores del formulario
  const ingredientName = document.getElementById("ingredientName").value.trim();
  const quantity = parseFloat(document.getElementById("quantity").value);
  const unit = document.getElementById("unit").value;
  const expiryDate = document.getElementById("expiryDate").value;
  const stockStatus = document.getElementById("stockStatus").value;

  console.log("Datos obtenidos:", { ingredientName, quantity, unit, expiryDate, stockStatus }); // Verificar datos

  // Validar que todos los campos estén completos
  if (!ingredientName || isNaN(quantity) || quantity <= 0 || !unit || !expiryDate || !stockStatus) {
    alert("Por favor, completa todos los campos correctamente.");
    console.error("Validación fallida");
    return;
  }

  // Crear el objeto del ingrediente
  const ingredient = {
    name: ingredientName,
    quantity: quantity,
    unit: unit,
    expiryDate: expiryDate,
    stockStatus: stockStatus,
  };

  // Obtener los ingredientes desde localStorage
  const ingredients = JSON.parse(localStorage.getItem("ingredients")) || [];
  console.log("Ingredientes actuales:", ingredients);

  // Agregar el nuevo ingrediente al array
  ingredients.push(ingredient);

  // Guardar el array actualizado en localStorage
  localStorage.setItem("ingredients", JSON.stringify(ingredients));
  console.log("Ingrediente guardado:", ingredient);

  // Agregar el ingrediente a la tabla
  addIngredientToTable(ingredient);

  // Limpiar el formulario
  document.getElementById("addIngredientForm").reset();
  console.log("Formulario reseteado");

  alert("Ingrediente agregado correctamente.");
});

// Función para agregar un ingrediente a la tabla
function addIngredientToTable(ingredient) {
  const tableBody = document.getElementById("inventoryBody");
  console.log("Elemento de la tabla encontrado:", tableBody); // Verifica que existe

  if (!tableBody) {
    console.error("No se encontró el elemento con id 'inventoryBody'");
    return;
  }

  const newRow = tableBody.insertRow();
  console.log("Fila añadida a la tabla");

  // Crear las celdas y llenarlas con los datos del ingrediente
  newRow.insertCell(0).textContent = ingredient.name;
  newRow.insertCell(1).textContent = ingredient.quantity;
  newRow.insertCell(2).textContent = ingredient.unit;
  newRow.insertCell(3).textContent = ingredient.expiryDate;
  newRow.insertCell(4).textContent = ingredient.stockStatus;

  // Crear y agregar el botón de eliminar
  const deleteCell = newRow.insertCell(5);
  deleteCell.innerHTML = `<button onclick="showDeleteDialog(this)">Eliminar</button>`;

  console.log("Ingrediente agregado a la tabla:", ingredient);
}
// Función para eliminar un ingrediente de la tabla y el localStorage
function showDeleteDialog(button) {
  if (confirm("¿Estás seguro de que deseas eliminar este ingrediente?")) {
    const row = button.parentElement.parentElement;
    const ingredientName = row.cells[0].textContent;

    // Obtener los ingredientes desde localStorage
    let ingredients = JSON.parse(localStorage.getItem("ingredients")) || [];

    // Filtrar el ingrediente que se va a eliminar
    ingredients = ingredients.filter(ingredient => ingredient.name !== ingredientName);

    // Guardar la lista actualizada en localStorage
    localStorage.setItem("ingredients", JSON.stringify(ingredients));

    // Eliminar la fila de la tabla
    row.remove();

    alert("Ingrediente eliminado correctamente.");
  }
}

// Función para cargar los ingredientes desde localStorage al cargar la página
window.onload = function() {
  const ingredients = JSON.parse(localStorage.getItem("ingredients")) || [];

  // Agregar los ingredientes a la tabla
  ingredients.forEach(addIngredientToTable);
};