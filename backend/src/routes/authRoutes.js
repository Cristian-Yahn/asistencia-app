const express = require('express');
const router = express.Router();
const {
  registrar,
  login,
  confirmarActividad,
  reportarFraude,
  pedirCambioContrasena,
  cambiarContrasena,
} = require('../controllers/authController');

router.post('/registro', registrar);
router.post('/login', login);
router.get('/confirmar-actividad/:token', confirmarActividad);
router.get('/reportar-fraude/:token', reportarFraude);
router.post('/pedir-cambio-contrasena', pedirCambioContrasena);
router.post('/cambiar-contrasena', cambiarContrasena);

module.exports = router;