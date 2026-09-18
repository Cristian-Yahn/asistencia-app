const bcrypt = require('bcrypt');
const crypto = require('crypto');
const UsuarioModel = require('../models/usuarioModel');
const { enviarEmailIntentosFallidos, solicitarCambioContrasena } = require('../config/email');
const { validarContrasena } = require('../utils/validacion');
const { fechaSqliteEnSegundos } = require('../utils/fechas');

const SALT_ROUNDS = 10;
const LIMITE_INTENTOS_FALLIDOS = 5;

async function registrar(req, res) {
  const { nombre, apellido, email, contrasena } = req.body;
  if (!nombre || !apellido || !email || !contrasena) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios' });
  }
  const existente = UsuarioModel.buscarPorEmail(email);
  if (existente) {
    return res.status(409).json({ error: 'Ya existe un usuario con ese email' });
  }
  const errorContrasena = validarContrasena(contrasena);
  if (errorContrasena) {
    return res.status(400).json({ error: errorContrasena });
  }
  const contrasena_hash = await bcrypt.hash(contrasena, SALT_ROUNDS);
  const id_usuario = UsuarioModel.crear({ nombre, apellido, email, contrasena_hash });
  res.status(201).json({ mensaje: 'Usuario registrado correctamente', id_usuario });
}

async function login(req, res) {
  const { email, contrasena } = req.body;
  if (!email || !contrasena) {
    return res.status(400).json({ error: 'Email y contraseña son obligatorios' });
  }
  const usuario = UsuarioModel.buscarPorEmail(email);
  if (!usuario) return res.status(401).json({ error: 'Credenciales inválidas' });
  if (!usuario.activo) return res.status(403).json({ error: 'Cuenta bloqueada por seguridad. Revisá tu email.' });

  const coincide = await bcrypt.compare(contrasena, usuario.contrasena_hash);
  if (!coincide) {
    UsuarioModel.incrementarIntentosFallidos(usuario.id_usuario);
    const actualizado = UsuarioModel.buscarPorId(usuario.id_usuario);
    if (actualizado.intentos_fallidos >= LIMITE_INTENTOS_FALLIDOS) {
      const token = crypto.randomBytes(32).toString('hex');
      const expiracion = fechaSqliteEnSegundos(60 * 60);
      UsuarioModel.guardarTokenSeguridad(usuario.id_usuario, token, expiracion);
      await enviarEmailIntentosFallidos({ email: usuario.email, nombre: usuario.nombre, token });
      return res.status(401).json({ error: 'Demasiados intentos fallidos. Te enviamos un email para verificar tu cuenta.' });
    }
    return res.status(401).json({ error: 'Credenciales inválidas' });
  }
  UsuarioModel.resetearIntentosFallidos(usuario.id_usuario);
  res.json({ mensaje: 'Login exitoso', usuario: { id_usuario: usuario.id_usuario, nombre: usuario.nombre, apellido: usuario.apellido, email: usuario.email } });
}

async function confirmarActividad(req, res) {
  const { token } = req.params;
  const usuario = UsuarioModel.buscarPorTokenSeguridad(token);
  if (!usuario) return res.status(400).send('Enlace inválido o vencido.');
  UsuarioModel.resetearIntentosFallidos(usuario.id_usuario);
  res.send('Gracias por confirmar.');
}

async function reportarFraude(req, res) {
  const { token } = req.params;
  const usuario = UsuarioModel.buscarPorTokenSeguridad(token);
  if (!usuario) return res.status(400).send('Enlace inválido o vencido.');
  UsuarioModel.bloquearCuenta(usuario.id_usuario);
  res.send('Cuenta bloqueada por seguridad.');
}

async function pedirCambioContrasena(req, res) {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'El email es obligatorio' });
  const usuario = UsuarioModel.buscarPorEmail(email);
  if (usuario) {
    const token = crypto.randomBytes(32).toString('hex');
    const expiracion = fechaSqliteEnSegundos(60 * 60);
    UsuarioModel.guardarTokenSeguridad(usuario.id_usuario, token, expiracion);
    await solicitarCambioContrasena({ email: usuario.email, nombre: usuario.nombre, token });
  }
  res.json({ mensaje: 'Si el email existe, te enviamos un enlace para cambiar la contraseña' });
}

async function cambiarContrasena(req, res) {
  const { token, contrasena_nueva } = req.body;
  if (!token || !contrasena_nueva) return res.status(400).json({ error: 'Token y contraseña nueva son obligatorios' });
  const usuario = UsuarioModel.buscarPorTokenSeguridad(token);
  if (!usuario) return res.status(400).json({ error: 'Enlace inválido o vencido' });
  const errorContrasena = validarContrasena(contrasena_nueva);
  if (errorContrasena) return res.status(400).json({ error: errorContrasena });
  const contrasena_hash = await bcrypt.hash(contrasena_nueva, SALT_ROUNDS);
  UsuarioModel.actualizarContrasena(usuario.id_usuario, contrasena_hash);
  UsuarioModel.reactivarCuenta(usuario.id_usuario);
  res.json({ mensaje: 'Contraseña actualizada correctamente. Ya podés iniciar sesión.' });
}

module.exports = { registrar, login, confirmarActividad, reportarFraude, pedirCambioContrasena, cambiarContrasena };