const db = require('../config/db');

const UsuarioModel = {
  crear({ nombre, apellido, email, contrasena_hash }) {
    const stmt = db.prepare(`
      INSERT INTO Usuario (nombre, apellido, email, contrasena_hash)
      VALUES (?, ?, ?, ?)
    `);
    const info = stmt.run(nombre, apellido, email, contrasena_hash);
    return info.lastInsertRowid;
  },

  buscarPorEmail(email) {
    return db.prepare('SELECT * FROM Usuario WHERE email = ?').get(email);
  },

  buscarPorId(id_usuario) {
    return db.prepare('SELECT * FROM Usuario WHERE id_usuario = ?').get(id_usuario);
  },

  incrementarIntentosFallidos(id_usuario) {
    db.prepare(`
      UPDATE Usuario
      SET intentos_fallidos = intentos_fallidos + 1,
          fecha_ultimo_intento_fallido = CURRENT_TIMESTAMP
      WHERE id_usuario = ?
    `).run(id_usuario);
  },

  resetearIntentosFallidos(id_usuario) {
    db.prepare(`
      UPDATE Usuario
      SET intentos_fallidos = 0, fecha_ultimo_intento_fallido = NULL,
          token_seguridad = NULL, token_seguridad_expiracion = NULL
      WHERE id_usuario = ?
    `).run(id_usuario);
  },

  guardarTokenSeguridad(id_usuario, token, expiracion) {
    db.prepare(`
      UPDATE Usuario
      SET token_seguridad = ?, token_seguridad_expiracion = ?
      WHERE id_usuario = ?
    `).run(token, expiracion, id_usuario);
  },

  buscarPorTokenSeguridad(token) {
    return db.prepare(`
      SELECT * FROM Usuario
      WHERE token_seguridad = ? AND token_seguridad_expiracion > CURRENT_TIMESTAMP
    `).get(token);
  },

  bloquearCuenta(id_usuario) {
    db.prepare(`
      UPDATE Usuario
      SET activo = 0, token_seguridad = NULL, token_seguridad_expiracion = NULL
      WHERE id_usuario = ?
    `).run(id_usuario);
  },

  actualizarContrasena(id_usuario, contrasena_hash) {
    db.prepare(`
      UPDATE Usuario SET contrasena_hash = ? WHERE id_usuario = ?
    `).run(contrasena_hash, id_usuario);
  },

  reactivarCuenta(id_usuario) {
    db.prepare(`
      UPDATE Usuario
      SET activo = 1, intentos_fallidos = 0, fecha_ultimo_intento_fallido = NULL,
          token_seguridad = NULL, token_seguridad_expiracion = NULL
      WHERE id_usuario = ?
    `).run(id_usuario);
  },
};

module.exports = UsuarioModel;