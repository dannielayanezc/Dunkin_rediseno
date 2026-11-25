/* =========================================================
   DUNKIN' · Interacciones generales (todas las páginas)
   1. Menú desplegable (hamburguesa)
   2. Pestañas "¿De qué es tu antojo?"  (solo landing)
   3. Botones "+" de las tarjetas → carrito (js/carrito.js)
   4. Buscador de sucursales            (solo landing)
   5. Registro al boletín
   Cada bloque revisa que sus elementos existan en la página.
   ========================================================= */

/* Fotos que todavía no están en la carpeta: se muestra un recuadro con el nombre.
   Basta con poner data-placeholder en el <img>. Al guardar la foto con ese nombre, aparece sola. */
function activarPlaceholders(raiz = document) {
  raiz.querySelectorAll('img[data-placeholder]').forEach((img) => {
    const poner = () => {
      const ph = document.createElement('div');
      ph.className = `${img.className} img-ph`;
      ph.setAttribute('role', 'img');
      ph.setAttribute('aria-label', img.alt);
      ph.innerHTML = `<span>Foto · ${img.alt}</span>`;
      img.replaceWith(ph);
    };
    if (img.complete && img.naturalWidth === 0) poner();
    else img.addEventListener('error', poner, { once: true });
  });
}

document.addEventListener('DOMContentLoaded', () => {

  activarPlaceholders();

  /* En celular: título del hero y botones de antojo en una sola línea.
     Baja el tamaño de letra de 1 en 1 px solo hasta que quepan. */
  const movil = window.matchMedia('(max-width: 900px)');
  function unaLinea(el, minimo) {
    if (!el) return;
    el.style.fontSize = '';
    if (!movil.matches) return;
    let tam = parseFloat(getComputedStyle(el).fontSize);
    while (el.scrollWidth > el.clientWidth + 1 && tam > minimo) {
      tam -= 1;
      el.style.fontSize = tam + 'px';
    }
  }
  function ajustar() {
    unaLinea(document.querySelector('.hero__title'), 22);
    unaLinea(document.querySelector('.tabs'), 13);
  }
  ajustar();
  if (document.fonts) document.fonts.ready.then(ajustar);
  window.addEventListener('resize', ajustar);


  /* ---------- 1. Menú desplegable (botón de 3 líneas) ---------- */
  const burger = document.getElementById('burger');
  const panel = document.getElementById('menu-panel');
  if (burger && panel) {

  function cerrarMenu() {
    panel.hidden = true;
    burger.setAttribute('aria-expanded', false);
    burger.setAttribute('aria-label', 'Abrir menú');
  }

  burger.addEventListener('click', (e) => {
    e.stopPropagation();
    const abrir = panel.hidden;
    panel.hidden = !abrir;
    burger.setAttribute('aria-expanded', abrir);
    burger.setAttribute('aria-label', abrir ? 'Cerrar menú' : 'Abrir menú');
  });

  // Se cierra al elegir una opción, al hacer clic fuera o con Esc
  panel.querySelectorAll('a').forEach((link) => link.addEventListener('click', cerrarMenu));
  document.addEventListener('click', (e) => {
    if (!panel.hidden && !panel.contains(e.target)) cerrarMenu();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !panel.hidden) { cerrarMenu(); burger.focus(); }
  });
  }


  /* ---------- 2. Pestañas del antojo ----------
     Para cambiar productos solo edita este objeto.
     contain: true  → la foto tiene fondo blanco y se muestra completa */
  const productos = {
    bebidas: [
      { nombre: 'Café del día',     desc: 'Frío, con leche y hielo',        precio: 75, img: 'img/cafe_land.jpg',   alt: 'Café helado' },
      { nombre: 'Mango Refresher',  desc: 'Mango y piña con hielo\u00a0·\u00a0M',     precio: 69, img: 'img/rfrshr_land.jpg', alt: 'Mango Refresher con hielo' }
    ],
    donas: [
      { nombre: 'Strawberry Rainbow', desc: 'Glaseado de fresa con chispas', precio: 29, img: 'img/dona_rainbow.jpg',   alt: 'Dona glaseada rosa con chispas de colores', contain: true },
      { nombre: 'Jelly Donut',        desc: 'Rellena de mermelada',          precio: 49, img: 'img/donas/jelly.jpg',    alt: 'Dona rellena de mermelada', contain: true }
    ],
    sandwiches: [
      { nombre: 'D-KIN',          desc: 'Huevo, tocino, salchicha y queso', precio: 99, img: 'img/sandwiches/sw_dkin.jpg',     alt: 'Sándwich D-KIN',                  contain: true },
      { nombre: 'English Muffin', desc: 'Jamón, huevo y queso',             precio: 69, img: 'img/sandwiches/sw_em_jamon.jpg', alt: 'English muffin de jamón y huevo', contain: true }
    ]
  };

  const tabs = document.querySelectorAll('.tab');
  const contenedor = document.getElementById('antojo-cards');

  function tarjeta(p) {
    const media = p.img
      ? `<div class="card__media${p.contain ? ' card__media--contain' : ''}"><img src="${p.img}" alt="${p.alt}"></div>`
      : `<div class="card__media card__media--empty">Foto de ${p.nombre}</div>`;

    return `
      <article class="card card--pink">
        ${media}
        <h3 class="card__title">${p.nombre}</h3>
        <p class="card__desc">${p.desc || ''}</p>
        <div class="card__foot">
          <p class="card__price">$${p.precio}</p>
          <button class="add-btn" data-name="${p.nombre}" data-price="${p.precio}" aria-label="Agregar ${p.nombre}">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>
          </button>
        </div>
      </article>`;
  }

  const PANTALLAS = { bebidas: 'bebidas.html', donas: 'donas.html', sandwiches: 'sandwiches.html' };
  const verTodo = document.getElementById('antojo-ver-todo');

  function mostrarCategoria(cat) {
    contenedor.innerHTML = productos[cat].map(tarjeta).join('');
    if (verTodo) verTodo.href = PANTALLAS[cat];
    tabs.forEach((t) => {
      const activa = t.dataset.cat === cat;
      t.classList.toggle('is-active', activa);
      t.setAttribute('aria-selected', activa);
    });
  }

  if (contenedor) {
    // Las pestañas solo cambian las tarjetas; "Ver todo" abre la pantalla de esa categoría
    tabs.forEach((tab) => {
      tab.addEventListener('click', () => mostrarCategoria(tab.dataset.cat));
    });
    mostrarCategoria('bebidas');
  }


  /* ---------- 3. Botones "+" de las tarjetas ---------- */
  // Delegación: funciona también con las tarjetas creadas por JS
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.add-btn[data-name], .round-btn[data-name]');
    if (!btn) return;
    const nombre = btn.dataset.name;
    Carrito.agregar({ id: nombre.toLowerCase().replace(/\s+/g, '-'), nombre, precio: Number(btn.dataset.price) || 0, detalle: btn.dataset.detail || '' });
    avisar(`${nombre} se agregó a tu pedido`);
  });


  /* ---------- 4. Buscador de sucursales ---------- */
  const buscador = document.getElementById('buscar-sucursal');
  const sucursales = document.querySelectorAll('.store');
  const sinResultados = document.getElementById('stores-empty');

  // Quita acentos para que "coyoacán" encuentre "coyoacan"
  const normalizar = (txt) => txt.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

  if (buscador) buscador.addEventListener('input', () => {
    const q = normalizar(buscador.value.trim());
    let visibles = 0;

    sucursales.forEach((s) => {
      const texto = normalizar(s.dataset.search + ' ' + s.textContent);
      const coincide = !q || texto.includes(q);
      s.hidden = !coincide;
      if (coincide) visibles++;
    });

    sinResultados.hidden = visibles > 0;
  });


  /* ---------- 5. Boletín ---------- */
  const form = document.getElementById('newsletter');
  const correo = document.getElementById('correo');
  const mensaje = document.getElementById('newsletter-msg');

  if (form) form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!correo.checkValidity() || !correo.value.trim()) {
      mensaje.textContent = 'Escribe un correo válido, por ejemplo nombre@correo.com';
      correo.focus();
      return;
    }
    mensaje.textContent = '¡Listo! Te avisaremos de nuevas ofertas.';
    form.reset();
  });

});
