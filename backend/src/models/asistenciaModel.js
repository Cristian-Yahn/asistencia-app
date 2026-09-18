const db = require('../config/db');

const AsistenciaModel = {
  crear({ id_clase, id_usuario, estado, metodo, id_codigo_qr = null }) {
    const stmt = db.prepare(`
      INSERT INTO Asistencia (id_clase, id_usuario, estado, metodo, id_codigo_qr)
      VALUES (?, ?, ?, ?, ?)
    `);
    const info = stmt.run(id_clase, id_usuario, estado, metodo, id_codigo_qr);
    return this.buscarPorId(info.lastInsertRowid);
  },

  buscarPorId(id_asistencia) {
    return db.prepare('SELECT * FROM Asistencia WHERE id_asistencia = ?').get(id_asistencia);
  },

  // Un alumno solo puede tener un registro de asistencia por clase
  buscar(id_clase, id_usuario) {
    return db.prepare('SELECT * FROM Asistencia WHERE id_clase = ? AND id_usuario = ?').get(id_clase, id_usuario);
  },

  listarPorClase(id_clase) {
    return db.prepare(`
      SELECT Asistencia.*, Usuario.nombre, Usuario.apellido
      FROM Asistencia
      JOIN Usuario ON Usuario.id_usuario = Asistencia.id_usuario
      WHERE id_clase = ?
      ORDER BY fecha_hora_registro ASC
    `).all(id_clase);
  },

  // Historial de un alumno puntual, a través de todas las clases de un curso
  listarPorUsuarioYCurso(id_curso, id_usuario) {
    return db.prepare(`
      SELECT Asistencia.*, Clase.fecha
      FROM Asistencia
      JOIN Clase ON Clase.id_clase = Asistencia.id_clase
      WHERE Clase.id_curso = ? AND Asistencia.id_usuario = ?
      ORDER BY Clase.fecha ASC
    `).all(id_curso, id_usuario);
  },
};

module.exports = AsistenciaModel;