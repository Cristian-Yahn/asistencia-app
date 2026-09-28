const express = require("express");
const router = express.Router();
const {
    crear,
    listarMisCursos,
    actualizarNombre,
    regenerarCodigo,
    unirse,
    obtenerUno,
    listarAlumnos,
} = require("../controllers/cursoController");

router.post("/", crear);
router.get("/", listarMisCursos);
router.post("/unirse", unirse);
router.put("/:id_curso", actualizarNombre);
router.post("/:id_curso/regenerar-codigo", regenerarCodigo);
router.get("/:id_curso", obtenerUno);
router.get("/:id_curso/alumnos", listarAlumnos);

module.exports = router;
