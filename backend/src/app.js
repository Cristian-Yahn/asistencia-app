const express = require('express');
const path = require('path');
const app = express();

app.use(express.json());
app.use(express.static(path.resolve(__dirname, '../../frontend/public')));

app.get('/api/ping', (req, res) => {
  res.json({ mensaje: 'Servidor funcionando correctamente' });
});

const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

const cursoRoutes = require('./routes/cursoRoutes');
app.use('/api/cursos', cursoRoutes);

const claseRoutes = require('./routes/claseRoutes');
app.use('/api/cursos/:id_curso/clases', claseRoutes);

const codigoQrRoutes = require('./routes/codigoQrRoutes');
app.use('/api/cursos/:id_curso/clases/:id_clase/qr', codigoQrRoutes);

const asistenciaRoutes = require('./routes/asistenciaRoutes');
app.use('/api/cursos/:id_curso/clases/:id_clase/asistencia', asistenciaRoutes);

module.exports = app;