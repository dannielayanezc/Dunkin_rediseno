/* =========================================================
   DUNKIN' · Pantalla Bebidas
   1. Datos de las bebidas (edita aquí nombres, textos y fotos)
   2. Selector de tamaño por sección (S · M · XL)
   3. Lista de bebidas con botón + y contador
   4. Ventana "Personalizar"
   El carrito (lista + barra fija) vive en js/carrito.js
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- 1. Datos ---------- */
  const TAMANOS = [
    { t: 'S',  precio: 69 },
    { t: 'M',  precio: 79 },
    { t: 'XL', precio: 89 }
  ];

  const BEBIDAS = {
    cafe: [
      { id: 'latte',              nombre: 'Latte',              desc: 'Café espresso combinado con leche cremosa.',                img: 'img/bebidas/latte.jpg' },
      { id: 'caramel-macchiato',  nombre: 'Caramel Macchiato',  desc: 'Espresso con leche cremosa y un delicioso toque de caramelo.', img: 'img/bebidas/caramel_macchiato.jpg' },
      { id: 'mocha',              nombre: 'Mocha',              desc: 'Bebida dulce y cremosa con espresso, leche y chocolate.',   img: 'img/bebidas/mocha.jpg' },
      { id: 'cappuccino',         nombre: 'Cappuccino',         desc: 'Espresso con leche vaporizada y espuma.',                   img: 'img/bebidas/cappuccino.jpg' },
      { id: 'cafe-del-dia', nombre: 'Café del día', desc: 'Café de grano recién preparado, caliente y aromático.', img: 'img/bebidas/espresso_americano.jpg' },
      { id: 'cafe-americano',     nombre: 'Café Americano',     desc: 'Espresso combinado con agua caliente.',                     img: 'img/bebidas/cafe_americano.jpg' },
      { id: 'espresso-americano', nombre: 'Espresso Americano', desc: 'Café de sabor intenso y carácter tostado.',                 img: 'img/bebidas/espresso_americano.jpg' }
    ],
    sin: [
      { id: 'vanilla-pink-cloud',  nombre: 'Vanilla Pink Cloud Latte',   desc: 'Bebida cremosa con un delicado sabor a vainilla y un toque dulce.', img: 'img/bebidas/vanilla_pink_cloud.jpg' },
      { id: 'banana-puddin-cloud', nombre: 'Banana Puddin’ Cloud Latte', desc: 'Una combinación cremosa con notas dulces de plátano y pudín.',     img: 'img/bebidas/banana_puddin_cloud.jpg' },
      { id: 'cocoa-cloud',         nombre: 'Cocoa Cloud Latte',          desc: 'Bebida cremosa con un delicioso sabor a cocoa y notas de chocolate.', img: 'img/bebidas/cocoa_cloud.jpg' },
      { id: 'matcha-iced-latte',   nombre: 'Matcha Iced Latte',          desc: 'Té matcha con leche y un sabor herbal ligeramente dulce.',        img: 'img/bebidas/matcha_iced_latte.jpg' },
      { id: 'iced-latte-fresa',    nombre: 'Iced Latte Fresa',           desc: 'Bebida fría y cremosa con un delicioso toque de fresa.',          img: 'img/bebidas/iced_latte_fresa.jpg' }
    ]
  };

  // Opciones de la ventana Personalizar (precios del menú Dunkin')
  const LECHES = [
    { v: 'Leche entera', extra: 0 },
    { v: 'Avena',        extra: 5 },
    { v: 'Soya',         extra: 5 },
    { v: 'Almendra',     extra: 5 },
    { v: 'Coco',         extra: 5 }
  ];
  const SABORES = [
    { v: 'Sin sabor',          extra: 0 },
    { v: 'Caramelo',           extra: 10 },
    { v: 'Vainilla',           extra: 10 },
    { v: 'Vainilla sugar free', extra: 10 }
  ];
  const EXTRAS = [
    { v: 'Espresso',     extra: 10 },
    { v: 'Cold foam',    extra: 10 },
    { v: 'Crema batida', extra: 10 }
  ];

  const buscar = (id) => [...BEBIDAS.cafe, ...BEBIDAS.sin].find((b) => b.id === id);
  const seccionDe = (id) => (BEBIDAS.cafe.some((b) => b.id === id) ? 'cafe' : 'sin');
  const ICONO_MAS = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>';
  const ICONO_MENOS = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14"/></svg>';


  /* ---------- 2. Tamaño por sección (M por defecto) ---------- */
  const tamanoActivo = { cafe: 1, sin: 1 };

  function pintarTamanos() {
    document.querySelectorAll('.sizes').forEach((grupo) => {
      const sec = grupo.dataset.seccion;
      grupo.innerHTML = TAMANOS.map((s, i) => `
        <button type="button" class="size${i === tamanoActivo[sec] ? ' is-active' : ''}" data-i="${i}"
                aria-pressed="${i === tamanoActivo[sec]}" aria-label="Tamaño ${s.t}, $${s.precio}">
          <span class="size__t">${s.t}</span>
          <span class="size__p">$${s.precio}</span>
        </button>`).join('');
    });
  }

  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.size');
    if (!btn) return;
    const sec = btn.closest('.sizes').dataset.seccion;
    tamanoActivo[sec] = Number(btn.dataset.i);
    pintarTamanos();
  });


  /* ---------- 3. Listas de bebidas ---------- */
  function acciones(b) {
    const n = Carrito.cantidadDe(b.id);
    const control = n === 0
      ? `<button type="button" class="round-btn" data-accion="sumar" aria-label="Agregar ${b.nombre}">${ICONO_MAS}</button>`
      : `<div class="stepper">
           <button type="button" class="stepper__btn" data-accion="sumar" aria-label="Agregar otro ${b.nombre}">${ICONO_MAS}</button>
           <span class="stepper__num" aria-label="${n} en el carrito">${n}</span>
           <button type="button" class="stepper__btn" data-accion="restar" aria-label="Quitar un ${b.nombre}">${ICONO_MENOS}</button>
         </div>`;
    // Bebidas con precio fijo (p. ej. Americano CH): muestran su precio en lugar de "Personalizar"
    const izquierda = b.fijo
      ? `<span class="fixed-price">${b.fijo.t} · $${b.fijo.precio}</span>`
      : '<button type="button" class="pill-btn" data-accion="personalizar">Personalizar</button>';
    return `
      <div class="bev-item__actions">
        ${izquierda}
        ${control}
      </div>`;
  }

  function item(b) {
    return `
      <li class="bev-item" data-id="${b.id}">
        <img class="bev-item__img" src="${b.img}" alt="${b.nombre}" loading="lazy">
        <div class="bev-item__body">
          <h3 class="bev-item__name">${b.nombre}</h3>
          <p class="bev-item__desc">${b.desc}</p>
          ${acciones(b)}
        </div>
      </li>`;
  }

  const listas = { cafe: document.getElementById('lista-cafe'), sin: document.getElementById('lista-sin') };

  function pintarListas() {
    listas.cafe.innerHTML = BEBIDAS.cafe.map(item).join('');
    listas.sin.innerHTML = BEBIDAS.sin.map(item).join('');
  }

  // Solo se repintan los botones de una bebida, así no se pierde el foco
  function actualizarAcciones() {
    document.querySelectorAll('.bev-item').forEach((li) => {
      const b = buscar(li.dataset.id);
      const actual = li.querySelector('.bev-item__actions');
      const enfocado = actual.contains(document.activeElement) ? document.activeElement.dataset.accion : null;
      actual.outerHTML = acciones(b);
      if (enfocado) {
        const nuevo = li.querySelector(`[data-accion="${enfocado}"]`) || li.querySelector('[data-accion="sumar"]');
        if (nuevo) nuevo.focus();
      }
    });
  }

  function agregarRapido(b) {
    if (b.fijo) {
      Carrito.agregar({ id: b.id, nombre: b.nombre, precio: b.fijo.precio, detalle: `Tamaño ${b.fijo.t}` });
      avisar(`${b.nombre} se agregó a tu pedido`);
      return;
    }
    const s = TAMANOS[tamanoActivo[seccionDe(b.id)]];
    Carrito.agregar({ id: b.id, nombre: b.nombre, precio: s.precio, detalle: `Tamaño ${s.t}` });
    avisar(`${b.nombre} (${s.t}) se agregó a tu pedido`);
  }

  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.bev-item [data-accion]');
    if (!btn) return;
    const b = buscar(btn.closest('.bev-item').dataset.id);
    const accion = btn.dataset.accion;
    if (accion === 'sumar') agregarRapido(b);
    if (accion === 'restar') Carrito.quitarUno(b.id);
    if (accion === 'personalizar') abrirPersonalizar(b, btn);
  });


  /* ---------- 4. Personalizar ---------- */
  const dialogo = document.getElementById('personalizar');
  const form = document.getElementById('custom-form');
  const titulo = document.getElementById('custom-titulo');
  const numCantidad = document.getElementById('custom-cantidad');
  const btnAgregar = document.getElementById('custom-agregar');
  let bebidaActual = null;
  let botonOrigen = null;
  let cantidad = 1;

  const chip = (tipo, name, o, checked, etiqueta) => `
    <label class="choice">
      <input type="${tipo}" name="${name}" value="${o.v}" data-extra="${o.extra}" ${checked ? 'checked' : ''}>
      <span>${etiqueta || o.v}</span>
    </label>`;

  function abrirPersonalizar(b, origen) {
    bebidaActual = b;
    botonOrigen = origen;
    cantidad = 1;
    titulo.textContent = b.nombre;
    const tActivo = tamanoActivo[seccionDe(b.id)];
    document.getElementById('opc-tamano').innerHTML =
      TAMANOS.map((s, i) => chip('radio', 'tamano', { v: s.t, extra: s.precio }, i === tActivo, `${s.t} · $${s.precio}`)).join('');
    document.getElementById('opc-leche').innerHTML = LECHES.map((o, i) => chip('radio', 'leche', o, i === 0)).join('');
    document.getElementById('opc-sabor').innerHTML = SABORES.map((o, i) => chip('radio', 'sabor', o, i === 0)).join('');
    document.getElementById('opc-extras').innerHTML = EXTRAS.map((o) => chip('checkbox', 'extra', o, false)).join('');
    actualizarTotal();
    dialogo.showModal();
  }

  function leerSeleccion() {
    const tam = form.querySelector('[name="tamano"]:checked');
    const leche = form.querySelector('[name="leche"]:checked');
    const sabor = form.querySelector('[name="sabor"]:checked');
    const extras = [...form.querySelectorAll('[name="extra"]:checked')];
    const unitario = Number(tam.dataset.extra) + Number(leche.dataset.extra) + Number(sabor.dataset.extra)
      + extras.reduce((s, x) => s + Number(x.dataset.extra), 0);
    const detalle = [`Tamaño ${tam.value}`,
      leche.value !== 'Leche entera' ? leche.value : '',
      sabor.value !== 'Sin sabor' ? sabor.value : '',
      ...extras.map((x) => x.value)].filter(Boolean).join(' · ');
    return { unitario, detalle };
  }

  function actualizarTotal() {
    const { unitario } = leerSeleccion();
    numCantidad.textContent = cantidad;
    btnAgregar.textContent = `Agregar · $${unitario * cantidad}`;
  }

  form.addEventListener('change', actualizarTotal);
  document.getElementById('custom-mas').addEventListener('click', () => { cantidad++; actualizarTotal(); });
  document.getElementById('custom-menos').addEventListener('click', () => { if (cantidad > 1) { cantidad--; actualizarTotal(); } });

  function cerrarDialogo() {
    dialogo.close();
    if (botonOrigen) botonOrigen.focus();
  }
  document.getElementById('custom-cerrar').addEventListener('click', cerrarDialogo);
  dialogo.addEventListener('click', (e) => { if (e.target === dialogo) cerrarDialogo(); });   // clic fuera

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const { unitario, detalle } = leerSeleccion();
    Carrito.agregar({ id: bebidaActual.id, nombre: bebidaActual.nombre, precio: unitario, detalle }, cantidad);
    avisar(`${bebidaActual.nombre} se agregó a tu pedido`);
    cerrarDialogo();
  });


  /* ---------- Inicio ---------- */
  pintarTamanos();
  pintarListas();
  Carrito.alCambiar(() => actualizarAcciones());
});
