/* =========================================================
   DUNKIN' · Pantalla Refreshers
   1. Datos (precios por tamaño del menú Dunkin')
   2. Selector de tamaño S · M · XL
   3. Lista con sabores, botón + y contador
   4. Tarjetas de favoritos
   El carrito (lista + barra fija) vive en js/carrito.js
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- 1. Datos ---------- */
  const TAMANOS = [
    { t: 'S',  oz: '12 oz' },
    { t: 'M',  oz: '16 oz' },
    { t: 'XL', oz: '24 oz' }
  ];

  // precios: [S, M, XL] · sabores: el primero es el que viene marcado
  // fotos: foto por sabor (si un sabor no tiene, se usa img)
  const ICED = [
    { id: 'refreshers',     nombre: 'Refreshers',     precios: [59, 69, 79], img: 'img/refreshers/mango_pineapple.jpg',
      desc: 'Bebida fría y frutal con hielo.', sabores: ['Mango Pineapple', 'Strawberry Dragon Fruit'],
      fotos: { 'Mango Pineapple': 'img/refreshers/mango_pineapple.jpg', 'Strawberry Dragon Fruit': 'img/refreshers/strawberry_dragon_fruit.jpg' } },
    { id: 'iced-green-tea', nombre: 'Iced Green Tea', precios: [34, 39, 45], img: 'img/refreshers/iced_green_tea.jpg',
      desc: 'Té verde frío, ligero y refrescante.' },
    { id: 'lemonade',       nombre: 'Lemonade',       precios: [59, 69, 79], img: 'img/refreshers/lemonade.jpg',
      desc: 'Limonada fría con hielo.' },
    { id: 'iced-bubble',    nombre: 'Iced Bubble',    precios: [65, 75, 81], img: 'img/refreshers/iced_bubble_maracuya_fresa.jpg',
      desc: 'Bebida fría con perlas de sabor.', sabores: ['Maracuyá fresa', 'Mandarina lychee'],
      fotos: { 'Maracuyá fresa': 'img/refreshers/iced_bubble_maracuya_fresa.jpg', 'Mandarina lychee': 'img/refreshers/iced_bubble_mandarina_lychee.jpg' } },
    { id: 'dunkin-sodas',   nombre: 'Dunkin’ Sodas',  precios: [65, 75, 81], img: 'img/refreshers/dunkin_sodas_maracuya.jpg',
      desc: 'Soda burbujeante con sabor frutal.', sabores: ['Maracuyá', 'Mandarina'],
      fotos: { 'Maracuyá': 'img/refreshers/dunkin_sodas_maracuya.jpg', 'Mandarina': 'img/refreshers/dunkin_sodas_mandarina.jpg' } }
  ];

  const ICONO_MAS = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>';
  const ICONO_MENOS = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14"/></svg>';
  const buscar = (id) => ICED.find((b) => b.id === id);
  const foto = (b) => (b.fotos && b.fotos[saborElegido[b.id]]) || b.img;


  /* ---------- 2. Tamaño (M por defecto) ---------- */
  let tamano = 1;
  const grupoTamanos = document.querySelector('.sizes[data-seccion="iced"]');

  function pintarTamanos() {
    grupoTamanos.innerHTML = TAMANOS.map((s, i) => `
      <button type="button" class="size${i === tamano ? ' is-active' : ''}" data-i="${i}"
              aria-pressed="${i === tamano}" aria-label="Tamaño ${s.t}, ${s.oz}">
        <span class="size__t">${s.t}</span>
        <span class="size__p">${s.oz}</span>
      </button>`).join('');
  }

  grupoTamanos.addEventListener('click', (e) => {
    const btn = e.target.closest('.size');
    if (!btn) return;
    tamano = Number(btn.dataset.i);
    pintarTamanos();
    pintarPrecios();
  });


  /* ---------- 3. Lista ---------- */
  const saborElegido = {};
  ICED.forEach((b) => { if (b.sabores) saborElegido[b.id] = b.sabores[0]; });

  function acciones(b) {
    const n = Carrito.cantidadDe(b.id);
    return n === 0
      ? `<button type="button" class="round-btn" data-accion="sumar" aria-label="Agregar ${b.nombre}">${ICONO_MAS}</button>`
      : `<div class="stepper">
           <button type="button" class="stepper__btn" data-accion="sumar" aria-label="Agregar otro ${b.nombre}">${ICONO_MAS}</button>
           <span class="stepper__num" aria-label="${n} en el carrito">${n}</span>
           <button type="button" class="stepper__btn" data-accion="restar" aria-label="Quitar un ${b.nombre}">${ICONO_MENOS}</button>
         </div>`;
  }

  function sabores(b) {
    if (!b.sabores) return '';
    return `
      <div class="flavors" role="radiogroup" aria-label="Sabor de ${b.nombre}">
        ${b.sabores.map((s) => `
          <button type="button" class="flavor${saborElegido[b.id] === s ? ' is-active' : ''}" role="radio"
                  aria-checked="${saborElegido[b.id] === s}" data-sabor="${s}">${s}</button>`).join('')}
      </div>`;
  }

  function item(b) {
    return `
      <li class="bev-item" data-id="${b.id}">
        <img class="bev-item__img" src="${foto(b)}" alt="${b.nombre}" loading="lazy" data-placeholder>
        <div class="bev-item__body">
          <h3 class="bev-item__name">${b.nombre}</h3>
          <p class="bev-item__desc">${b.desc}</p>
          ${sabores(b)}
          <div class="bev-item__actions">
            <p class="rf-price" aria-live="polite">$${b.precios[tamano]}</p>
            <span class="rf-actions">${acciones(b)}</span>
          </div>
        </div>
      </li>`;
  }

  const lista = document.getElementById('lista-iced');
  function pintarLista() {
    lista.innerHTML = ICED.map(item).join('');
    activarPlaceholders(lista);
  }

  function pintarPrecios() {
    lista.querySelectorAll('.bev-item').forEach((li) => {
      li.querySelector('.rf-price').textContent = `$${buscar(li.dataset.id).precios[tamano]}`;
    });
  }

  function actualizarAcciones() {
    lista.querySelectorAll('.bev-item').forEach((li) => {
      const cont = li.querySelector('.rf-actions');
      const enfocado = cont.contains(document.activeElement) ? document.activeElement.dataset.accion : null;
      cont.innerHTML = acciones(buscar(li.dataset.id));
      if (enfocado) (cont.querySelector(`[data-accion="${enfocado}"]`) || cont.querySelector('[data-accion="sumar"]')).focus();
    });
  }

  function agregar(b, sabor) {
    const s = TAMANOS[tamano];
    const detalle = [`Tamaño ${s.t}`, sabor].filter(Boolean).join(' · ');
    Carrito.agregar({ id: b.id, nombre: b.nombre, precio: b.precios[tamano], detalle });
    avisar(`${sabor || b.nombre} (${s.t}) se agregó a tu pedido`);
  }

  lista.addEventListener('click', (e) => {
    const li = e.target.closest('.bev-item');
    if (!li) return;
    const b = buscar(li.dataset.id);

    const flavor = e.target.closest('.flavor');
    if (flavor) {
      saborElegido[b.id] = flavor.dataset.sabor;
      const img = li.querySelector('img.bev-item__img');
      if (img) img.src = foto(b);          // cambia la foto según el sabor
      li.querySelectorAll('.flavor').forEach((f) => {
        const on = f === flavor;
        f.classList.toggle('is-active', on);
        f.setAttribute('aria-checked', on);
      });
      return;
    }

    const btn = e.target.closest('[data-accion]');
    if (!btn) return;
    if (btn.dataset.accion === 'sumar') agregar(b, saborElegido[b.id]);
    if (btn.dataset.accion === 'restar') Carrito.quitarUno(b.id);
  });


  /* ---------- 4. Favoritos: agregan un Refresher del sabor de la tarjeta ---------- */
  document.querySelectorAll('[data-fav-sabor]').forEach((btn) => {
    btn.addEventListener('click', () => agregar(buscar('refreshers'), btn.dataset.favSabor));
  });


  /* ---------- Inicio ---------- */
  pintarTamanos();
  pintarLista();
  Carrito.alCambiar(() => actualizarAcciones());
});
