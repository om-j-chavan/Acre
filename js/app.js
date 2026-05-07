// Acre — frontend app logic
const fmt = n => '$' + Number(n).toFixed(2);

// ---------- API helper ----------
async function api(path, opts={}){
  const r = await fetch(path, Object.assign({
    credentials: 'same-origin',
    headers: { 'Content-Type':'application/json' }
  }, opts, opts.body ? { body: typeof opts.body === 'string' ? opts.body : JSON.stringify(opts.body) } : {}));
  const ct = r.headers.get('content-type') || '';
  const data = ct.includes('application/json') ? await r.json() : await r.text();
  if(!r.ok) throw new Error((data && data.error) || ('HTTP '+r.status));
  return data;
}

// ---------- Auth ----------
const Auth = {
  user: null,
  async refresh(){
    try {
      const { user } = await api('/api/auth/me');
      this.user = user;
    } catch { this.user = null; }
    return this.user;
  },
  async signup(email, name, password){
    const { user } = await api('/api/auth/signup', { method:'POST', body:{ email, name, password } });
    this.user = user; return user;
  },
  async login(email, password){
    const { user } = await api('/api/auth/login', { method:'POST', body:{ email, password } });
    this.user = user; return user;
  },
  async logout(){
    await api('/api/auth/logout', { method:'POST' });
    this.user = null;
  }
};

// ---------- Cart (local storage; sent to server only at checkout) ----------
const Cart = {
  key:'acre_cart_v2',
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
    document.querySelectorAll('.cart-count').forEach(el => el.textContent = this.count());
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

// ---------- Chrome ----------
function renderHeader(active){
  const u = Auth.user;
  const accountLink = u
    ? `<a href="account.html" class="${active==='account'?'active':''}">${u.name || 'Account'}</a>`
    : `<a href="login.html" class="${active==='login'?'active':''}">Sign in</a>`;
  const adminLink = u && u.role === 'admin'
    ? `<a href="admin.html" class="${active==='admin'?'active':''}" style="color:#a44a3f">Admin</a>` : '';
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
        ${adminLink}
        ${accountLink}
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
          <h4>Account</h4>
          <ul>
            <li><a href="login.html">Sign in</a></li>
            <li><a href="signup.html">Create account</a></li>
            <li><a href="account.html">Orders</a></li>
          </ul>
        </div>
        <div>
          <h4>Studio</h4>
          <ul>
            <li><a href="about.html">Our story</a></li>
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

async function mountChrome(active){
  await Auth.refresh();
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

const SHIPPING = {
  standard:{ label:'Standard — 5-8 business days', cost:12, freeOver:150 },
  express :{ label:'Express — 2-3 business days', cost:24, freeOver:250 },
  pickup  :{ label:'Studio pickup — Melbourne', cost:0, freeOver:0 }
};
function shippingCost(method, subtotal){
  const m = SHIPPING[method]; if(!m) return 0;
  if(m.freeOver && subtotal >= m.freeOver) return 0;
  return m.cost;
}
function gst(amount){ return amount * 0.10; }

function qs(name){ return new URLSearchParams(location.search).get(name); }

async function bootstrap(active){
  await loadProducts();
  await mountChrome(active);
}
