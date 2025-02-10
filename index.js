require('./config/conexion');

const express = require('express');

//instancia de express
const app = express();

// Habilitar el uso de JSON en las solicitudes
app.use(express.json());

//puerto
const port = process.env.port || 3000;
app.set('port', port);

//rutas
app.use(require('./rutas'));

//Escuchar el puerto
app.listen(app.get('port'), (error) => {
   if (error) {
      console.log('Error al iniciar el servidor: ' + error);
   } else {
      console.log('Servidor iniciado en el puerto: ' + port);
   }
});
