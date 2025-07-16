const API_URL = 'http://localhost:8080/api/productos';

const form = document.getElementById('producto-form');
const idInput = document.getElementById('producto-id');
const nombreInput = document.getElementById('nombre');
const descripcionInput = document.getElementById('descripcion');
const precioInput = document.getElementById('precio');
const stockInput = document.getElementById('stock');
const guardarBtn = document.getElementById('guardar-btn');
const cancelarBtn = document.getElementById('cancelar-btn');
const tablaBody = document.querySelector('#productos-table tbody');

function limpiarFormulario() {
    idInput.value = '';
    nombreInput.value = '';
    descripcionInput.value = '';
    precioInput.value = '';
    stockInput.value = '';
    guardarBtn.textContent = 'Agregar Producto';
    cancelarBtn.style.display = 'none';
}

function renderProductos(productos) {
    tablaBody.innerHTML = '';
    productos.forEach(producto => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${producto.nombre}</td>
            <td>${producto.descripcion || ''}</td>
            <td>$${producto.precio.toFixed(2)}</td>
            <td>${producto.stock}</td>
            <td>
                <button onclick="editarProducto(${producto.id})">Editar</button>
                <button onclick="eliminarProducto(${producto.id})" style="background:#ffb4a2;">Eliminar</button>
            </td>
        `;
        tablaBody.appendChild(tr);
    });
}

async function cargarProductos() {
    const res = await fetch(API_URL);
    const productos = await res.json();
    renderProductos(productos);
}

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const producto = {
        nombre: nombreInput.value,
        descripcion: descripcionInput.value,
        precio: parseFloat(precioInput.value),
        stock: parseInt(stockInput.value)
    };
    const id = idInput.value;
    if (id) {
        // Modificar
        await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(producto)
        });
    } else {
        // Agregar
        await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(producto)
        });
    }
    limpiarFormulario();
    cargarProductos();
});

cancelarBtn.addEventListener('click', () => {
    limpiarFormulario();
});

window.editarProducto = async function(id) {
    const res = await fetch(`${API_URL}/${id}`);
    const producto = await res.json();
    idInput.value = producto.id;
    nombreInput.value = producto.nombre;
    descripcionInput.value = producto.descripcion;
    precioInput.value = producto.precio;
    stockInput.value = producto.stock;
    guardarBtn.textContent = 'Modificar Producto';
    cancelarBtn.style.display = 'inline-block';
}

window.eliminarProducto = async function(id) {
    if (confirm('¿Seguro que deseas eliminar este producto?')) {
        await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        cargarProductos();
    }
}

// Inicializar
cargarProductos(); 
