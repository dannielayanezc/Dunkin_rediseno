/* =========================================================
   DUNKIN' · Pantalla Combos
   1. Sucursal de recolección
   2. Pedido grupal (copia el enlace)
   3. Programar hora de recolección
   Los botones + usan el carrito compartido (js/main.js + js/carrito.js)
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- 1. Sucursal ---------- */
  const sucursal = document.getElementById('sucursal');
  try {
    const guardada = localStorage.getItem('dunkin-sucursal');
    if (guardada) sucursal.value = guardada;
  } catch (e) { /* sin almacenamiento */ }

  sucursal.addEventListener('change', () => {
    try { localStorage.setItem('dunkin-sucursal', sucursal.value); } catch (e) { /* nada */ }
    avisar(`Recogerás en ${sucursal.value}`);
  });


  /* ---------- 2. Pedido grupal ---------- */
  document.getElementById('pedido-grupal').addEventListener('click', async () => {
    const enlace = window.location.href.split('#')[0];
    try {
      await navigator.clipboard.writeText(enlace);
      avisar('Enlace copiado: compártelo con tu equipo');
    } catch (e) {
      avisar('Comparte este enlace: ' + enlace);
    }
  });


  /* ---------- 3. Programar recolección ---------- */
  const btnProgramar = document.getElementById('programar');
  const panel = document.getElementById('programar-panel');
  const hora = document.getElementById('hora');

  btnProgramar.addEventListener('click', () => {
    const abrir = panel.hidden;
    panel.hidden = !abrir;
    btnProgramar.setAttribute('aria-expanded', abrir);
    if (abrir) hora.focus();
  });

  panel.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!hora.checkValidity()) {
      avisar('Elige una hora entre 7:00 y 22:00');
      hora.focus();
      return;
    }
    try { localStorage.setItem('dunkin-hora', hora.value); } catch (err) { /* nada */ }
    btnProgramar.textContent = `Recolección a las ${hora.value}`;
    panel.hidden = true;
    btnProgramar.setAttribute('aria-expanded', false);
    avisar(`Listo, tu pedido estará a las ${hora.value} en ${sucursal.value}`);
  });
});
