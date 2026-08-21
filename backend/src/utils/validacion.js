// Mínimo 8 caracteres, al menos 1 mayúscula, 1 minúscula, 1 número y 1 carácter especial.
const REGEX_CONTRASENA = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

function validarContrasena(contrasena) {
  if (!contrasena || !REGEX_CONTRASENA.test(contrasena)) {
    return 'La contraseña debe tener mínimo 8 caracteres, con al menos 1 mayúscula, 1 minúscula, 1 número y 1 carácter especial';
  }
  return null;
}

module.exports = { validarContrasena, REGEX_CONTRASENA };