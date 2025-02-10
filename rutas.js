//Router
const rutas = require('express').Router();

//Conexión bd
const conexion = require('./config/conexion');

//Probar ruta
rutas.get('/', function (req, res) {
   res.send('Hola desde la ruta raíz: /');
});

// Ruta para insertar un solo rol
rutas.post('/roles/insertarUnRol', (req, res) => {
   const { nombre_rol } = req.body; // Obtener el nombre del rol desde el cuerpo de la solicitud (Objeto)

   //Validar si viene dicha KEY
   if (!nombre_rol) {
      return res
         .status(400)
         .json({ mensaje: 'El campo nombre_rol es requerido' });
   }

   // Consulta SQL para insertar un solo registro
   const query = 'INSERT INTO roles (nombre_rol) VALUES (?)';

   // Ejecutar la consulta
   conexion.query(query, [nombre_rol], (err, result) => {
      if (err) {
         console.error('Error al insertar el rol:', err);
         return res
            .status(500)
            .json({ mensaje: 'Error al insertar el rol', error: err });
      }

      res.status(201).json({ mensaje: 'Rol insertado correctamente', result });
   });
});

// Ruta para insertar varios roles
rutas.post('/roles/insertarMultiplesRoles', (req, res) => {
   const roles = req.body; // Obtener los roles desde el cuerpo de la solicitud (Array)

   //Validar si es Array y no está vacío
   if (!Array.isArray(roles)) {
      return res
         .status(400)
         .json({ mensaje: 'Se esperaba un arreglo de roles' });
   }

   // Consulta SQL para insertar múltiples registros
   const query = 'INSERT INTO roles (nombre_rol) VALUES ?';

   // Preparar los datos para la inserción
   const valores = roles.map((rol) => [rol.nombre_rol]);

   // Ejecutar la consulta
   conexion.query(query, [valores], (err, result) => {
      if (err) {
         console.error('Error al insertar roles:', err);
         return res
            .status(500)
            .json({ mensaje: 'Error al insertar roles', error: err });
      }

      res.status(201).json({
         mensaje: 'Roles insertados correctamente',
         result,
      });
   });
});

module.exports = rutas;
