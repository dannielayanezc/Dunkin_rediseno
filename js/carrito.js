/* =========================================================
   DUNKIN' · Carrito compartido entre páginas
   Guarda el pedido en el navegador (localStorage) para que
   lo que agregas en la landing siga ahí en Bebidas, etc.
   Uso:  Carrito.agregar({ id, nombre, precio, detalle })
         Carrito.quitarUno(id) · Carrito.eliminar(clave)
         Carrito.items() · Carrito.total() · Carrito.cantidad()
   ========================================================= */

const Carrito = (() => {
  const CLAVE = 'dunkin-carrito';
  let items = leer();
  const oyentes = [];

  function leer() {
    try { return JSON.parse(localStorage.getItem(CLAVE)) || []; }
    catch (e) { return []; }
  }

  function guardar() {
    try { localStorage.setItem(CLAVE, JSON.stringify(items)); } catch (e) { /* sin almacenamiento: solo en memoria */ }
    oyentes.forEach((fn) => fn(items));
  }

  // Dos bebidas iguales (mismo producto y misma personalización) se juntan en una fila
  const claveDe = (p) => `${p.id}|${p.detalle || ''}|${p.precio}`;

  return {
    items: () => items.slice(),
    cantidad: () => items.reduce((s, i) => s + i.cantidad, 0),
    total: () => items.reduce((s, i) => s + i.precio * i.cantidad, 0),
    cantidadDe: (id) => items.filter((i) => i.id === id).reduce((s, i) => s + i.cantidad, 0),

    agregar(p, cantidad = 1) {
      const clave = claveDe(p);
      const existente = items.find((i) => i.clave === clave);
      if (existente) existente.cantidad += cantidad;
      else items.push({ ...p, clave, cantidad });
      guardar();
    },

    // Resta una unidad del último producto agregado con ese id
    quitarUno(id) {
      for (let k = items.length - 1; k >= 0; k--) {
        if (items[k].id === id) {
          items[k].cantidad--;
          if (items[k].cantidad <= 0) items.splice(k, 1);
          break;
        }
      }
      guardar();
    },

    eliminar(clave) {
      items = items.filter((i) => i.clave !== clave);
      guardar();
    },

    alCambiar(fn) { oyentes.push(fn); fn(items); }
  };
})();


/* ---------- Contador del ícono, sección Carrito y barra fija ---------- */
document.addEventListener('DOMContentLoaded', () => {
  const badge = document.getElementById('cart-badge');
  const lista = document.getElementById('cart-list');        // solo en pantallas de menú
  const vacio = document.getElementById('cart-empty');
  const resumen = document.getElementById('cart-summary');
  const total = document.getElementById('cart-total');
  const barra = document.getElementById('cart-bar');
  const seccion = document.getElementById('carrito');
  let carritoVisible = false;

  const plural = (n) => `${n} ${n === 1 ? 'artículo' : 'artículos'}`;

  function pintarLista() {
    const items = Carrito.items();
    lista.innerHTML = items.map((i) => `
      <li class="cart-item">
        <div class="cart-item__info">
          <h3 class="cart-item__name">${i.nombre}</h3>
          <p class="cart-item__detail">${[i.detalle, `x${i.cantidad}`, `$${i.precio * i.cantidad}`].filter(Boolean).join(' · ')}</p>
        </div>
        <button type="button" class="cart-item__remove" data-clave="${i.clave}" aria-label="Eliminar ${i.nombre} del carrito">Eliminar</button>
      </li>`).join('');
    vacio.hidden = items.length > 0;
    resumen.hidden = items.length === 0;
    total.textContent = `$${Carrito.total()}`;
  }

  // La barra se muestra si hay algo en la orden y el carrito no está a la vista
  function pintarBarra() {
    const n = Carrito.cantidad();
    document.getElementById('cart-bar-count').textContent = plural(n);
    document.getElementById('cart-bar-total').textContent = `$${Carrito.total()}`;
    const mostrar = n > 0 && !carritoVisible;
    barra.hidden = !mostrar;
    document.body.classList.toggle('has-cart-bar', mostrar);
  }

  if (lista) {
    lista.addEventListener('click', (e) => {
      const btn = e.target.closest('.cart-item__remove');
      if (btn) Carrito.eliminar(btn.dataset.clave);
    });
  }

  if (barra && seccion && 'IntersectionObserver' in window) {
    new IntersectionObserver(([entrada]) => {
      carritoVisible = entrada.isIntersecting;
      pintarBarra();
    }, { rootMargin: '0px 0px -80px 0px' }).observe(seccion);
  }

  Carrito.alCambiar(() => {
    const n = Carrito.cantidad();
    if (badge) { badge.textContent = n; badge.hidden = n === 0; }
    if (lista) pintarLista();
    if (barra) pintarBarra();
  });
});

function avisar(texto) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = texto;
  toast.classList.add('is-visible');
  clearTimeout(avisar.timer);
  avisar.timer = setTimeout(() => toast.classList.remove('is-visible'), 2200);
}
