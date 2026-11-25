/* =========================================================
   DUNKIN' · Pantalla Sándwiches & Snacks
   1. Datos (precios del menú: combo / individual)
   2. Interruptor "En combo / Solo sándwich"
   3. Lista con botón + y contador
   4. Extra bites con dip
   El carrito (lista + barra fija) vive en js/carrito.js
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- 1. Datos ---------- */
  const EXTRA_COMBO = 39 + 29;   // hash brown 6 pzs + Americano CH (para calcular el ahorro)

  const SANDWICHES = [
    { n: 3,  id: 'em-jamon',      nombre: 'English Muffin',      desc: 'Jamón, huevo y queso',                 combo: 89,  solo: 69, img: 'sw_em_jamon' },
    { n: 4,  id: 'em-salchicha',  nombre: 'English Muffin',      desc: 'Salchicha, huevo y queso',             combo: 89,  solo: 69, img: 'sw_em_salchicha' },
    { n: 5,  id: 'em-tocino',     nombre: 'English Muffin',      desc: 'Tocino, huevo y queso',                combo: 89,  solo: 69, img: 'sw_em_tocino' },
    { n: 6,  id: 'croissant',     nombre: 'Croissant Francés',   desc: 'Con jamón o tocino y queso',           combo: 99,  solo: 79, img: 'sw_croissant' },
    { n: 7,  id: 'dkin-em',       nombre: 'D-KIN English Muffin', desc: 'Huevo, tocino, salchicha y queso',    combo: 119, solo: 79, img: 'sw_dkin_em' },
    { n: 8,  id: 'bagel-jamon',   nombre: 'Bagel',               desc: 'Jamón y queso',                        combo: 89,  solo: 69, img: 'sw_bagel_jamon' },
    { n: 9,  id: 'grilled-queso', nombre: 'Grilled Cheese',      desc: 'Con queso',                            combo: 85,  solo: 65, img: 'sw_grilled_queso' },
    { n: 10, id: 'grilled-jamon', nombre: 'Grilled Cheese',      desc: 'Con jamón y queso',                    combo: 105, solo: 85, img: 'sw_grilled_jamon' },
    { n: 11, id: 'bagel-crema',   nombre: 'Bagel',               desc: 'Queso crema y mermelada',              combo: 85,  solo: 65, img: 'sw_bagel_crema' }
  ];
  const DIPS = ['Creamy Chipotle', 'Spicy Avocado'];

  const ICONO_MAS = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>';
  const ICONO_MENOS = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14"/></svg>';
  const buscar = (id) => SANDWICHES.find((s) => s.id === id);


  /* ---------- 2. En combo / Solo sándwich ---------- */
  let modo = 'combo';
  const grupoModo = document.getElementById('modo');

  function seg(grupo, opciones, activa) {
    grupo.innerHTML = opciones.map(([v, txt]) =>
      `<button type="button" class="seg__btn${v === activa ? ' is-active' : ''}" data-v="${v}" aria-pressed="${v === activa}">${txt}</button>`).join('');
  }
  const pintarModo = () => seg(grupoModo, [['combo', 'En combo'], ['solo', 'Solo sándwich']], modo);

  grupoModo.addEventListener('click', (e) => {
    const b = e.target.closest('.seg__btn');
    if (!b) return;
    modo = b.dataset.v;
    pintarModo();
    pintarPrecios();
  });


  /* ---------- 3. Lista ---------- */
  const idCarrito = (s) => `${s.id}-${modo}`;
  const precio = (s) => (modo === 'combo' ? s.combo : s.solo);
  const nota = (s) => (modo === 'combo'
    ? `Combo · ahorras $${s.solo + EXTRA_COMBO - s.combo}`
    : `Solo sándwich · en combo $${s.combo}`);

  function acciones(s) {
    const n = Carrito.cantidadDe(idCarrito(s));
    return n === 0
      ? `<button type="button" class="round-btn" data-accion="sumar" aria-label="Agregar ${s.nombre} ${s.desc}">${ICONO_MAS}</button>`
      : `<div class="stepper">
           <button type="button" class="stepper__btn" data-accion="sumar" aria-label="Agregar otro">${ICONO_MAS}</button>
           <span class="stepper__num">${n}</span>
           <button type="button" class="stepper__btn" data-accion="restar" aria-label="Quitar uno">${ICONO_MENOS}</button>
         </div>`;
  }

  function item(s) {
    return `
      <li class="bev-item sw-item" data-id="${s.id}">
        <div class="sw-item__media">
          <span class="sw-num" aria-hidden="true">${s.n}</span>
          <img class="bev-item__img" src="img/sandwiches/${s.img}.jpg" alt="${s.nombre} ${s.desc.toLowerCase()}" loading="lazy">
        </div>
        <div class="bev-item__body">
          <h3 class="bev-item__name">${s.nombre}</h3>
          <p class="bev-item__desc">${s.desc}</p>
          <div class="bev-item__actions">
            <p class="sw-price"><span class="sw-price__n">$${precio(s)}</span> <span class="sw-price__note">${nota(s)}</span></p>
            <span class="sw-actions">${acciones(s)}</span>
          </div>
        </div>
      </li>`;
  }

  const lista = document.getElementById('lista-sw');
  const pintarLista = () => { lista.innerHTML = SANDWICHES.map(item).join(''); };

  function pintarPrecios() {
    lista.querySelectorAll('.sw-item').forEach((li) => {
      const s = buscar(li.dataset.id);
      li.querySelector('.sw-price__n').textContent = `$${precio(s)}`;
      li.querySelector('.sw-price__note').textContent = nota(s);
      li.querySelector('.sw-actions').innerHTML = acciones(s);
    });
  }

  function actualizarAcciones() {
    lista.querySelectorAll('.sw-item').forEach((li) => {
      const cont = li.querySelector('.sw-actions');
      const enfocado = cont.contains(document.activeElement) ? document.activeElement.dataset.accion : null;
      cont.innerHTML = acciones(buscar(li.dataset.id));
      if (enfocado) (cont.querySelector(`[data-accion="${enfocado}"]`) || cont.querySelector('[data-accion="sumar"]')).focus();
    });
  }

  lista.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-accion]');
    if (!btn) return;
    const s = buscar(btn.closest('.sw-item').dataset.id);
    if (btn.dataset.accion === 'sumar') {
      const detalle = modo === 'combo' ? `${s.desc} · Combo` : `${s.desc} · Individual`;
      Carrito.agregar({ id: idCarrito(s), nombre: s.nombre, precio: precio(s), detalle });
      avisar(`${s.nombre} se agregó a tu pedido`);
    }
    if (btn.dataset.accion === 'restar') Carrito.quitarUno(idCarrito(s));
  });


  /* ---------- 4. Extra bites ---------- */
  let dip = DIPS[0];
  const grupoDips = document.getElementById('dips');
  const pintarDips = () => seg(grupoDips, DIPS.map((d) => [d, d]), dip);
  grupoDips.addEventListener('click', (e) => {
    const b = e.target.closest('.seg__btn');
    if (b) { dip = b.dataset.v; pintarDips(); }
  });

  document.querySelectorAll('.pack').forEach((btn) => {
    btn.setAttribute('aria-label', `Agregar hash brown ${btn.dataset.piezas} piezas, $${btn.dataset.precio}`);
    btn.addEventListener('click', () => {
      Carrito.agregar({ id: `hashbrown-${btn.dataset.piezas}`, nombre: 'Hash brown', precio: Number(btn.dataset.precio),
        detalle: `${btn.dataset.piezas} piezas · Dip ${dip}` });
      avisar(`Hash brown ${btn.dataset.piezas} pzs se agregó a tu pedido`);
    });
  });


  /* ---------- Inicio ---------- */
  pintarModo();
  pintarDips();
  pintarLista();
  Carrito.alCambiar(() => actualizarAcciones());
});
