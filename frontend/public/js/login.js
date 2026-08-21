const tabLogin = document.getElementById('tab-login');
const tabRegistro = document.getElementById('tab-registro');
const formLogin = document.getElementById('form-login');
const formRegistro = document.getElementById('form-registro');
const mensaje = document.getElementById('mensaje');

function mostrarMensaje(texto, tipo) {
  mensaje.textContent = texto;
  mensaje.className = `mensaje ${tipo}`;
}

function limpiarMensaje() {
  mensaje.className = 'mensaje';
  mensaje.textContent = '';
}

function activarTab(tab) {
  if (tab === 'login') {
    tabLogin.classList.add('activo');
    tabRegistro.classList.remove('activo');
    formLogin.classList.remove('oculto');
    formRegistro.classList.add('oculto');
  } else {
    tabRegistro.classList.add('activo');
    tabLogin.classList.remove('activo');
    formRegistro.classList.remove('oculto');
    formLogin.classList.add('oculto');
  }
}

tabLogin.addEventListener('click', () => {
  activarTab('login');
  limpiarMensaje();
});

tabRegistro.addEventListener('click', () => {
  activarTab('registro');
  limpiarMensaje();
});

formLogin.addEventListener('submit', async (e) => {
  e.preventDefault();
  limpiarMensaje();

  const email = document.getElementById('login-email').value;
  const contrasena = document.getElementById('login-contrasena').value;

  try {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, contrasena }),
    });
    const data = await res.json();

    if (!res.ok) {
      mostrarMensaje(data.error || 'No se pudo iniciar sesión', 'error');
      return;
    }

    localStorage.setItem('usuario', JSON.stringify(data.usuario));
    window.location.href = '/index.html';
  } catch (err) {
    mostrarMensaje('No se pudo conectar con el servidor', 'error');
  }
});

formRegistro.addEventListener('submit', async (e) => {
  e.preventDefault();
  limpiarMensaje();

  const nombre = document.getElementById('reg-nombre').value;
  const apellido = document.getElementById('reg-apellido').value;
  const email = document.getElementById('reg-email').value;
  const contrasena = document.getElementById('reg-contrasena').value;

  try {
    const res = await fetch('/api/auth/registro', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre, apellido, email, contrasena }),
    });
    const data = await res.json();

    if (!res.ok) {
      mostrarMensaje(data.error || 'No se pudo registrar', 'error');
      return;
    }

    mostrarMensaje('Cuenta creada correctamente. Ahora podés iniciar sesión.', 'ok');
    formRegistro.reset();
    document.getElementById('login-email').value = email;
    activarTab('login');
  } catch (err) {
    mostrarMensaje('No se pudo conectar con el servidor', 'error');
  }
});

document.getElementById('link-olvide').addEventListener('click', async () => {
  const email = document.getElementById('login-email').value;
  if (!email) {
    mostrarMensaje('Ingresá tu email arriba y volvé a hacer clic', 'error');
    return;
  }

  try {
    const res = await fetch('/api/auth/pedir-cambio-contrasena', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    const data = await res.json();
    mostrarMensaje(data.mensaje, 'ok');
  } catch (err) {
    mostrarMensaje('No se pudo conectar con el servidor', 'error');
  }
});