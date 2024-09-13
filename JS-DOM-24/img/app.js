// Simulación de datos de productos con categorías
const productos = [
    { id: 1, nombre: "Arroz", precio: 2.99, valoracion: 4, imagen: "./img/arrozxd.jpg", categoria: "abarrotes" },
    { id: 2, nombre: "Fideos", precio: 1.99, valoracion: 5, imagen: "./img/spagetti.jpg", categoria: "pastas" },
    { id: 3, nombre: "Gaseosa", precio: 1.50, valoracion: 3, imagen: "./img/gaseosa.jpg", categoria: "bebidas" },
    { id: 4, nombre: "Whisky", precio: 29.99, valoracion: 4, imagen: "./img/whisky.jpg", categoria: "licores" },
    { id: 5, nombre: "Chocolate", precio: 0.99, valoracion: 5, imagen: "./img/chocolatexd.jpg", categoria: "golosinas" },
    { id: 6, nombre: "Aceite", precio: 4.99, valoracion: 4, imagen: "./img/aceite.jpg", categoria: "abarrotes" },
    { id: 7, nombre: "Harina", precio: 3.99, valoracion: 4, imagen: "./img/file.jpg", categoria: "pastas" },
    { id: 8, nombre: "Leche", precio: 2.50, valoracion: 3, imagen: "./img/leche.png", categoria: "bebidas" },
    { id: 9, nombre: "lejia", precio: 19.99, valoracion: 4, imagen: "./img/lejia.jpg", categoria: "licores" },
    { id: 10, nombre: "Caramelos", precio: 0.50, valoracion: 3, imagen: "./img/halls.jpg", categoria: "golosinas" },
    { id: 11, nombre: "Detergente", precio: 0.50, valoracion: 3, imagen: "./img/detergente.png", categoria: "golosinas" },
];

let carrito = [];
let productosFiltrados = [...productos];

function mostrarProductos() {
    const contenedor = document.getElementById('productos');
    contenedor.innerHTML = '';

    productosFiltrados.forEach(producto => {
        const productoElement = document.createElement('div');
        productoElement.className = 'producto';
        productoElement.innerHTML = `
            <img src="${producto.imagen}" alt="${producto.nombre}">
            <h3>${producto.nombre}</h3>
            <p class="precio">$${producto.precio.toFixed(2)}</p>
            <p class="valoracion">${'★'.repeat(producto.valoracion)}${'☆'.repeat(5 - producto.valoracion)}</p>
            <button onclick="agregarAlCarrito(${producto.id})">Agregar al Carrito</button>
        `;
        contenedor.appendChild(productoElement);
    });
}

function mostrarCategorias() {
    const categorias = [...new Set(productos.map(p => p.categoria))];
    const listaCategorias = document.getElementById('lista-categorias');
    listaCategorias.innerHTML = '<li><a href="#" data-categoria="todas">Todas</a></li>';
    categorias.forEach(categoria => {
        listaCategorias.innerHTML += `<li><a href="#" data-categoria="${categoria}">${categoria.charAt(0).toUpperCase() + categoria.slice(1)}</a></li>`;
    });

    listaCategorias.addEventListener('click', (e) => {
        e.preventDefault();
        if (e.target.tagName === 'A') {
            const categoriaSeleccionada = e.target.dataset.categoria;
            filtrarPorCategoria(categoriaSeleccionada);
        }
    });
}

function filtrarPorCategoria(categoria) {
    productosFiltrados = categoria === 'todas' ? productos : productos.filter(p => p.categoria === categoria);
    mostrarProductos();
}

function buscarProductos() {
    const busqueda = document.getElementById('buscar-productos').value.toLowerCase();
    productosFiltrados = productos.filter(p => p.nombre.toLowerCase().includes(busqueda));
    mostrarProductos();
}

function agregarAlCarrito(id) {
    const producto = productos.find(p => p.id === id);
    const item = carrito.find(i => i.id === id);

    if (item) {
        item.cantidad++;
    } else {
        carrito.push({ ...producto, cantidad: 1 });
    }

    actualizarCarrito();
}

function actualizarCarrito() {
    const itemsCarrito = document.getElementById('items-carrito');
    const totalCarrito = document.getElementById('total-carrito');
    const cantidadCarrito = document.getElementById('cantidad-carrito');

    itemsCarrito.innerHTML = '';
    let total = 0;
    let cantidad = 0;

    carrito.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.className = 'item-carrito';
        itemElement.innerHTML = `
            <span>${item.nombre}</span>
            <div class="cantidad">
                <button onclick="decrementarCantidad(${item.id})">-</button>
                <span>${item.cantidad}</span>
                <button onclick="incrementarCantidad(${item.id})">+</button>
            </div>
            <span>$${(item.precio * item.cantidad).toFixed(2)}</span>
            <button class="eliminar" onclick="eliminarDelCarrito(${item.id})">X</button>
        `;
        itemsCarrito.appendChild(itemElement);

        total += item.precio * item.cantidad;
        cantidad += item.cantidad;
    });

    totalCarrito.textContent = total.toFixed(2);
    cantidadCarrito.textContent = cantidad;
}

function incrementarCantidad(id) {
    const item = carrito.find(i => i.id === id);
    if (item) {
        item.cantidad++;
        actu

alizarCarrito();
    }
}

function decrementarCantidad(id) {
    const item = carrito.find(i => i.id === id);
    if (item) {
        item.cantidad--;
        if (item.cantidad === 0) {
            eliminarDelCarrito(id);
        } else {
            actualizarCarrito();
        }
    }
}

function eliminarDelCarrito(id) {
    carrito = carrito.filter(item => item.id !== id);
    actualizarCarrito();
}

function realizarPedido(event) {
    event.preventDefault();
    if (carrito.length === 0) {
        alert('El carrito está vacío');
        return;
    }

    const formData = new FormData(event.target);
    const clienteData = Object.fromEntries(formData);

    let mensaje = `Hola, me gustaría hacer el siguiente pedido:\n\n`;
    carrito.forEach(item => {
        mensaje += `${item.nombre} x${item.cantidad} - $${(item.precio * item.cantidad).toFixed(2)}\n`;
    });
    mensaje += `\nTotal: $${document.getElementById('total-carrito').textContent}\n\n`;
    mensaje += `Datos del cliente:\n`;
    mensaje += `Nombre: ${clienteData.nombre}\n`;
    mensaje += `Correo: ${clienteData.correo}\n`;
    mensaje += `Teléfono: ${clienteData.telefono}\n`;
    mensaje += `Dirección: ${clienteData.direccion}\n`;
    mensaje += `Método de entrega: ${clienteData.entrega}`;

    // Codificar el mensaje para la URL
    const mensajeCodificado = encodeURIComponent(mensaje);

    // Reemplaza el número de teléfono con el de tu negocio
    const numeroWhatsApp = '1234567890';

    // Crear el enlace de WhatsApp
    const urlWhatsApp = `https://wa.me/${numeroWhatsApp}?text=${mensajeCodificado}`;

    // Abrir WhatsApp en una nueva pestaña
    window.open(urlWhatsApp, '_blank');
}

function toggleCarrito() {
    const carrito = document.getElementById('carrito');
    carrito.style.display = carrito.style.display === 'none' ? 'block' : 'none';
}

function mostrarVistaCliente() {
    document.getElementById('productos').style.display = 'grid';
    document.getElementById('carrito').style.display = 'block';
}

function mostrarVistaAdmin() {
    document.getElementById('productos').style.display = 'none';
    document.getElementById('carrito').style.display = 'none';
    alert('Vista de administración no implementada en este ejemplo');
}

// Event listeners
document.getElementById('vista-cliente').addEventListener('click', mostrarVistaCliente);
document.getElementById('vista-admin').addEventListener('click', mostrarVistaAdmin);
document.getElementById('toggle-carrito').addEventListener('click', toggleCarrito);
document.getElementById('formulario-cliente').addEventListener('submit', realizarPedido);
document.getElementById('buscar-productos').addEventListener('input', buscarProductos);

// Inicialización
window.onload = () => {
    mostrarProductos();
    mostrarCategorias();
    actualizarCarrito();
};