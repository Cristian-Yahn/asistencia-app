const express = require('express');
const router = express.Router();
const {
  crear,
  listarMisCursos,
  actualizarNombre,
  regenerarCodigo,
  unirse,
} = require('../controllers/cursoController');

router.post('/', crear);
router.get('/', listarMisCursos);
router.post('/unirse', unirse);
router.put('/:id_curso', actualizarNombre);
router.post('/:id_curso/regenerar-codigo', regenerarCodigo);

module.exports = router;