const express = require('express');
const path = require('path');
const fs = require('fs');
const exphbs = require('express-handlebars');
const socketIo = require('socket.io');

// Crear servidor Express
const app = express();
const server = app.listen(8080, () => console.log('Servidor corriendo en http://localhost:8080'));

// Configuración de Handlebars
app.engine('handlebars', exphbs.engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// Configuración de socket.io
const io = socketIo(server);

// Productos de ejemplo
let products = [
    { id: 1, title: "Producto 1", price: 100 },
    { id: 2, title: "Producto 2", price: 200 }
];

// Ruta principal
app.get('/', (req, res) => {
    res.render('home', { products });
});

// Ruta de productos en tiempo real
app.get('/realtimeproducts', (req, res) => {
    res.render('realTimeProducts', { products });
});

// Conexión a WebSocket
io.on('connection', (socket) => {
    console.log('Nuevo cliente conectado');
    
    // Emitir productos al cliente
    socket.emit('products', products);

    // Evento para agregar un producto
    socket.on('addProduct', (product) => {
        products.push(product);
        io.sockets.emit('products', products); // Emitir los productos actualizados a todos los clientes
    });

    // Evento para eliminar un producto
    socket.on('deleteProduct', (productId) => {
        products = products.filter(product => product.id !== productId);
        io.sockets.emit('products', products); // Emitir los productos actualizados a todos los clientes
    });
});

