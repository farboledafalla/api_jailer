//Router
const rutas = require('express').Router();

//Conexión bd
const conexion = require('./config/conexion');

//Probar ruta
rutas.get('/', function (req, res) {
   res.send('Hola desde la ruta raíz: /');
});

module.exports = rutas;
