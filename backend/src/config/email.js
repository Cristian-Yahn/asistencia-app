const nodemailer = require('nodemailer');

// En desarrollo, si no configurás SMTP_HOST en el .env, los emails
// no se envían de verdad: se imprimen por consola para poder probar
// el flujo sin necesitar credenciales reales todavía.
const modoDesarrollo = !process.env.SMTP_HOST;

let transporter = null;
if (!modoDesarrollo) {
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

async function enviarEmailIntentosFallidos({ email, nombre, token }) {
  const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
  const urlConfirmar = `${baseUrl}/api/auth/confirmar-actividad/${token}`;
  const urlReportar = `${baseUrl}/api/auth/reportar-fraude/${token}`;

  const asunto = 'Detectamos varios intentos fallidos de inicio de sesión';
  const cuerpo = `
    Hola ${nombre},

    Detectamos 5 intentos fallidos seguidos para iniciar sesión en tu cuenta.

    Si fuiste vos: ${urlConfirmar}
    Si NO fuiste vos: ${urlReportar}

    Este enlace vence en 1 hora.
  `;

  if (modoDesarrollo) {
    console.log('\n--- EMAIL (modo desarrollo, no enviado de verdad) ---');
    console.log(`Para: ${email}`);
    console.log(`Asunto: ${asunto}`);
    console.log(cuerpo);
    console.log('------------------------------------------------------\n');
    return;
  }

  await transporter.sendMail({
    from: process.env.EMAIL_FROM || process.env.SMTP_USER,
    to: email,
    subject: asunto,
    text: cuerpo,
  });
}

async function solicitarCambioContrasena({ email, nombre, token }) {
  const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
  const urlCambio = `${baseUrl}/reset-password.html?token=${token}`;

  const asunto = 'Cambio de contraseña solicitado';
  const cuerpo = `
    Hola ${nombre},

    Solicitaste cambiar tu contraseña. Ingresá al siguiente enlace para hacerlo:
    ${urlCambio}

    Este enlace vence en 1 hora. Si no fuiste vos, ignorá este email.
  `;

  if (modoDesarrollo) {
    console.log('\n--- EMAIL (modo desarrollo, no enviado de verdad) ---');
    console.log(`Para: ${email}`);
    console.log(`Asunto: ${asunto}`);
    console.log(cuerpo);
    console.log('------------------------------------------------------\n');
    return;
  }

  await transporter.sendMail({
    from: process.env.EMAIL_FROM || process.env.SMTP_USER,
    to: email,
    subject: asunto,
    text: cuerpo,
  });
}

module.exports = { enviarEmailIntentosFallidos, solicitarCambioContrasena };