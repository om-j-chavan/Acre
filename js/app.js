// Acre — app logic
const fmt = n => '$' + n.toFixed(2);

const Cart = {
  key:'acre_cart_v1',
  read(){ try{return JSON.parse(localStorage.getItem(this.key))||[]}catch{return []} },
  write(items){ localStorage.setItem(this.key, JSON.stringify(items)); this.updateCount(); },
  add(id, qty=1, opts={}){
    const items = this.read();
    const k = id + '::' + JSON.stringify(opts);
    const found = items.find(i => i.k===k);
    if(found) found.qty += qty;
    else items.push({k,id,qty,opts});
    this.write(items);
    toast('Added to cart');
  },
  remove(k){ this.write(this.read().filter(i=>i.k!==k)); },
  setQty(k, qty){
    const items = this.read();
    const it = items.find(i=>i.k===k);
    if(it){ it.qty = Math.max(1, qty); this.write(items); }
  },
  clear(){ this.write([]); },
  count(){ return this.read().reduce((s,i)=>s+i.qty,0); },
  subtotal(){
    return this.read().reduce((s,i)=>{
      const p = PRODUCTS.find(p=>p.id===i.id);
      return s + (p? p.price * i.qty : 0);
    },0);
  },
  updateCount(){
    const el = document.querySelector('.cart-count');
    if(el) el.textContent = this.count();
  }
};

function toast(msg){
  let t = document.querySelector('.toast');
  if(!t){ t = document.createElement('div'); t.className='toast'; document.body.appendChild(t); }
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(t._tm);
  t._tm = setTimeout(()=>t.classList.remove('show'), 2200);
}

function renderHeader(active){
  return `
  <div class="topbar">Free shipping on orders over $150 · Australia-wide</div>
  <header class="site">
    <div class="nav">
      <a href="index.html" class="brand">Acre</a>
      <ul>
        <li><a href="shop.html" class="${active==='shop'?'active':''}">Shop</a></li>
        <li><a href="shop.html?cat=Planters">Planters</a></li>
        <li><a href="shop.html?cat=Tools">Tools</a></li>
        <li><a href="shop.html?cat=Home">Home</a></li>
        <li><a href="about.html" class="${active==='about'?'active':''}">Journal</a></li>
      </ul>
      <div class="nav-actions">
        <a href="cart.html" class="cart-link">Cart<span class="cart-count">0</span></a>
      </div>
    </div>
  </header>`;
}

function renderFooter(){
  return `
  <footer class="site">
    <div class="container">
      <div class="cols">
        <div>
          <h4>Acre</h4>
          <p style="font-size:.85rem;max-width:34ch;color:#a89e85">Considered objects for the garden and home, made by hand in small batches.</p>
        </div>
        <div>
          <h4>Shop</h4>
          <ul>
            <li><a href="shop.html">All products</a></li>
            <li><a href="shop.html?cat=Planters">Planters</a></li>
            <li><a href="shop.html?cat=Tools">Tools</a></li>
            <li><a href="shop.html?cat=Home">Home</a></li>
          </ul>
        </div>
        <div>
          <h4>Help</h4>
          <ul>
            <li><a href="#">Shipping</a></li>
            <li><a href="#">Returns</a></li>
            <li><a href="#">Contact</a></li>
            <li><a href="#">FAQ</a></li>
          </ul>
        </div>
        <div>
          <h4>Studio</h4>
          <ul>
            <li><a href="about.html">Our story</a></li>
            <li><a href="#">Makers</a></li>
            <li><a href="#">Journal</a></li>
            <li><a href="#">Stockists</a></li>
          </ul>
        </div>
      </div>
      <div class="copy">
        <span>© 2026 Acre Studio. All rights reserved.</span>
        <span>Made slowly in Melbourne</span>
      </div>
    </div>
  </footer>`;
}

function mountChrome(active){
  const h = document.getElementById('header-mount');
  const f = document.getElementById('footer-mount');
  if(h) h.innerHTML = renderHeader(active);
  if(f) f.innerHTML = renderFooter();
  Cart.updateCount();
}

function productCard(p){
  return `
  <a href="product.html?id=${p.id}" class="product">
    <div class="thumb">
      ${p.badge?`<span class="badge">${p.badge}</span>`:''}
      ${productImage(p)}
    </div>
    <div class="meta">
      <h3>${p.name}</h3>
      <span class="price">${fmt(p.price)}</span>
    </div>
    <div class="muted" style="font-size:.78rem;letter-spacing:.18em;text-transform:uppercase;margin-top:4px">${p.cat}</div>
  </a>`;
}

// Shipping logic
const SHIPPING = {
  standard:{ label:'Standard — 5-8 business days', cost:12, freeOver:150 },
  express :{ label:'Express — 2-3 business days', cost:24, freeOver:250 },
  pickup  :{ label:'Studio pickup — Melbourne', cost:0, freeOver:0 }
};

function shippingCost(method, subtotal){
  const m = SHIPPING[method];
  if(!m) return 0;
  if(m.freeOver && subtotal >= m.freeOver) return 0;
  return m.cost;
}

function gst(amount){ return amount * 0.10; } // 10% AU GST already-included display

// URL helpers
function qs(name){ return new URLSearchParams(location.search).get(name); }
