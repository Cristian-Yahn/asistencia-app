const CursoModel = require('../models/cursoModel');
const InscripcionModel = require('../models/inscripcionModel');

// Nota importante: todavía no armamos sesiones/tokens de autenticación
// (eso lo dejamos pendiente como mejora). Por ahora, el frontend manda
// el id_usuario del usuario logueado (guardado en localStorage tras el
// login) en cada petición, y acá validamos los permisos contra eso.

async function crear(req, res) {
  const { nombre_curso, id_usuario } = req.body;

  if (!nombre_curso || !id_usuario) {
    return res.status(400).json({ error: 'nombre_curso e id_usuario son obligatorios' });
  }

  const curso = CursoModel.crear({ nombre_curso, id_creador: id_usuario });

  // El creador queda inscripto automáticamente como profesor de su propio curso
  InscripcionModel.crear({
    id_curso: curso.id_curso,
    id_usuario,
    rol_en_curso: 'profesor',
  });

  res.status(201).json({ mensaje: 'Curso creado correctamente', curso });
}

async function listarMisCursos(req, res) {
  const { id_usuario } = req.query;

  if (!id_usuario) {
    return res.status(400).json({ error: 'id_usuario es obligatorio' });
  }

  const cursos = CursoModel.listarPorUsuario(id_usuario);
  res.json({ cursos });
}

async function actualizarNombre(req, res) {
  const { id_curso } = req.params;
  const { nombre_curso, id_usuario } = req.body;

  if (!nombre_curso || !id_usuario) {
    return res.status(400).json({ error: 'nombre_curso e id_usuario son obligatorios' });
  }

  const inscripcion = InscripcionModel.buscar(id_curso, id_usuario);
  if (!inscripcion || inscripcion.rol_en_curso !== 'profesor') {
    return res.status(403).json({ error: 'Solo un profesor del curso puede editarlo' });
  }

  CursoModel.actualizarNombre(id_curso, nombre_curso);
  res.json({ mensaje: 'Curso actualizado correctamente' });
}

async function regenerarCodigo(req, res) {
  const { id_curso } = req.params;
  const { id_usuario } = req.body;

  if (!id_usuario) {
    return res.status(400).json({ error: 'id_usuario es obligatorio' });
  }

  const inscripcion = InscripcionModel.buscar(id_curso, id_usuario);
  if (!inscripcion || inscripcion.rol_en_curso !== 'profesor') {
    return res.status(403).json({ error: 'Solo un profesor del curso puede regenerar el código' });
  }

  const codigo_acceso = CursoModel.regenerarCodigoAcceso(id_curso);
  res.json({ mensaje: 'Código regenerado correctamente', codigo_acceso });
}

module.exports = { crear, listarMisCursos, actualizarNombre, regenerarCodigo };