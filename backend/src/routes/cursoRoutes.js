const express = require('express');
const router = express.Router();
const {
  crear,
  listarMisCursos,
  actualizarNombre,
  regenerarCodigo,
} = require('../controllers/cursoController');

router.post('/', crear);
router.get('/', listarMisCursos);
router.put('/:id_curso', actualizarNombre);
router.post('/:id_curso/regenerar-codigo', regenerarCodigo);

module.exports = router;