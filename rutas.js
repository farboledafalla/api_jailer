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

// Ruta para consultar un solo rol por rol_id
rutas.get('/roles/consultarUnRolPorId/:rol_id', (req, res) => {
   const { rol_id } = req.params; // Obtener el rol_id desde los parámetros de la URL

   // Consulta SQL para obtener un rol por su ID
   const query = 'SELECT * FROM Roles WHERE rol_id = ?';

   // Ejecutar la consulta
   conexion.query(query, [rol_id], (err, result) => {
      if (err) {
         console.error('Error al consultar el rol:', err);
         return res
            .status(500)
            .json({ mensaje: 'Error al consultar el rol', error: err });
      }

      // Verificar si se encontró el rol
      if (result.length === 0) {
         return res.status(404).json({ mensaje: 'Rol no encontrado' });
      }

      // Devolver el rol encontrado
      res.status(200).json({ mensaje: 'Rol encontrado', rol: result[0] });
   });
});

// Ruta para buscar roles por parte del nombre
rutas.get('/roles/consultarRolesParteDelNombre', (req, res) => {
   const { texto } = req.body; // Obtener el texto a buscar desde el cuerpo de la solicitud

   if (!texto) {
      return res.status(400).json({ mensaje: 'El campo texto es requerido' });
   }

   // Consulta SQL para buscar roles que contengan el texto en su nombre
   const query = 'SELECT * FROM Roles WHERE nombre_rol LIKE ?';
   const textoBusqueda = `%${texto}%`; // Agregar comodines para buscar cualquier coincidencia parcial

   // Ejecutar la consulta
   conexion.query(query, [textoBusqueda], (err, result) => {
      if (err) {
         console.error('Error al buscar roles:', err);
         return res
            .status(500)
            .json({ mensaje: 'Error al buscar roles', error: err });
      }

      // Verificar si se encontraron roles
      if (result.length === 0) {
         return res.status(404).json({
            mensaje: 'No se encontraron roles con el texto proporcionado',
         });
      }

      // Devolver los roles encontrados
      res.status(200).json({ mensaje: 'Roles encontrados', roles: result });
   });
});

// Ruta para actualizar un rol por rol_id
rutas.put('/roles/actualizarUnRolPorId/:rol_id', (req, res) => {
   const { rol_id } = req.params;
   const { nombre_rol } = req.body;

   if (!nombre_rol) {
      return res
         .status(400)
         .json({ mensaje: 'El campo nombre_rol es requerido' });
   }

   const query = 'UPDATE Roles SET nombre_rol = ? WHERE rol_id = ?';
   conexion.query(query, [nombre_rol, rol_id], (err, result) => {
      if (err) {
         console.error('Error al actualizar el rol:', err);
         return res
            .status(500)
            .json({ mensaje: 'Error al actualizar el rol', error: err });
      }

      if (result.affectedRows === 0) {
         return res.status(404).json({ mensaje: 'Rol no encontrado' });
      }

      res.status(200).json({
         mensaje: 'Rol actualizado correctamente',
         rol_actualizado: { rol_id, nombre_rol },
      });
   });
});

// Ruta para eliminar un rol por rol_id
rutas.delete('/roles/eliminarUnRolPorId/:rol_id', (req, res) => {
   const { rol_id } = req.params;

   // Primero buscamos el nombre del rol antes de eliminarlo
   const selectQuery = 'SELECT nombre_rol FROM Roles WHERE rol_id = ?';

   conexion.query(selectQuery, [rol_id], (err, result) => {
      if (err) {
         console.error('Error al buscar el rol:', err);
         return res
            .status(500)
            .json({ mensaje: 'Error al buscar el rol', error: err });
      }

      if (result.length === 0) {
         return res.status(404).json({ mensaje: 'Rol no encontrado' });
      }

      const nombre_rol = result[0].nombre_rol; // Guardamos el nombre del rol antes de eliminarlo

      // Ahora eliminamos el rol
      const deleteQuery = 'DELETE FROM Roles WHERE rol_id = ?';
      conexion.query(deleteQuery, [rol_id], (err, deleteResult) => {
         if (err) {
            console.error('Error al eliminar el rol:', err);
            return res
               .status(500)
               .json({ mensaje: 'Error al eliminar el rol', error: err });
         }

         res.status(200).json({
            mensaje: 'Rol eliminado correctamente',
            rol_eliminado: { rol_id, nombre_rol },
         });
      });
   });
});

module.exports = rutas;
