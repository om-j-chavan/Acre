// Acre — full-stack ecom server (zero deps, Node built-ins only)
const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const url = require('url');

const PORT = process.env.PORT || 8080;
const ROOT = __dirname;
const DB_FILE = path.join(ROOT, 'db.json');

// ---------- DB ----------
function seed(){
  const seedProducts = require('./js/seed-products.js');
  return {
    users: [
      // Default admin: admin@acre.local / admin123 (please change after first login)
      makeUser({ email:'admin@acre.local', name:'Admin', password:'admin123', role:'admin' })
    ],
    products: seedProducts,
    orders: [],
    sessions: {},
    nextProductId: seedProducts.length + 1,
    nextUserId: 2,
    nextOrderId: 1
  };
}
function loadDB(){
  if(!fs.existsSync(DB_FILE)){
    const db = seed();
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
    return db;
  }
  return JSON.parse(fs.readFileSync(DB_FILE,'utf8'));
}
function saveDB(db){ fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2)); }

// ---------- Auth helpers ----------
function hashPassword(pw, salt){
  salt = salt || crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(pw, salt, 64).toString('hex');
  return { salt, hash };
}
function verifyPassword(pw, salt, hash){
  const { hash: h2 } = hashPassword(pw, salt);
  const a = Buffer.from(hash,'hex'), b = Buffer.from(h2,'hex');
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}
function makeUser({email,name,password,role='customer'}){
  const { salt, hash } = hashPassword(password);
  return {
    id: 1, email: email.toLowerCase(), name, salt, hash,
    role, disabled:false, createdAt:new Date().toISOString()
  };
}
function newSession(db, userId){
  const token = crypto.randomBytes(32).toString('hex');
  db.sessions[token] = { userId, expires: Date.now() + 1000*60*60*24*30 }; // 30d
  return token;
}
function userFromReq(db, req){
  const cookie = req.headers.cookie || '';
  const m = /(?:^|; )acre_session=([^;]+)/.exec(cookie);
  if(!m) return null;
  const sess = db.sessions[m[1]];
  if(!sess || sess.expires < Date.now()) return null;
  return db.users.find(u => u.id === sess.userId) || null;
}

// ---------- HTTP helpers ----------
function readJSON(req){
  return new Promise((resolve, reject)=>{
    let data=''; req.on('data', c => data += c);
    req.on('end', ()=>{
      if(!data) return resolve({});
      try { resolve(JSON.parse(data)); } catch(e){ reject(e); }
    });
    req.on('error', reject);
  });
}
function send(res, status, body, headers={}){
  const isJSON = typeof body === 'object' && body !== null && !Buffer.isBuffer(body);
  const payload = isJSON ? JSON.stringify(body) : body;
  res.writeHead(status, Object.assign({
    'Content-Type': isJSON ? 'application/json' : (headers['Content-Type'] || 'text/plain'),
    'Cache-Control': 'no-store'
  }, headers));
  res.end(payload);
}
const MIME = {
  '.html':'text/html; charset=utf-8','.css':'text/css','.js':'application/javascript',
  '.json':'application/json','.svg':'image/svg+xml','.png':'image/png',
  '.jpg':'image/jpeg','.jpeg':'image/jpeg','.ico':'image/x-icon'
};
function serveStatic(req, res){
  let p = decodeURIComponent(url.parse(req.url).pathname);
  if(p === '/' || p === '') p = '/index.html';
  // prevent path traversal
  const safe = path.normalize(path.join(ROOT, p));
  if(!safe.startsWith(ROOT)) return send(res, 403, 'Forbidden');
  if(!fs.existsSync(safe) || fs.statSync(safe).isDirectory()) return send(res, 404, 'Not found');
  const ext = path.extname(safe).toLowerCase();
  res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
  fs.createReadStream(safe).pipe(res);
}

// Strip secrets from user payloads before sending to clients
function publicUser(u){
  if(!u) return null;
  const { salt, hash, ...rest } = u; return rest;
}

// ---------- API routes ----------
const routes = [];
function route(method, pattern, handler){
  routes.push({ method, pattern: new RegExp('^' + pattern.replace(/:[a-z]+/g,'([^/]+)') + '$'), handler });
}

// Auth
route('POST', '/api/auth/signup', async (req, res, db) => {
  const body = await readJSON(req);
  const { email, name, password } = body;
  if(!email || !password || password.length < 6)
    return send(res, 400, { error:'Email and password (min 6 chars) required' });
  if(db.users.find(u => u.email === email.toLowerCase()))
    return send(res, 409, { error:'An account with that email already exists' });
  const { salt, hash } = hashPassword(password);
  const user = {
    id: db.nextUserId++,
    email: email.toLowerCase(),
    name: name || email.split('@')[0],
    salt, hash,
    role: 'customer',
    disabled: false,
    createdAt: new Date().toISOString()
  };
  db.users.push(user);
  const token = newSession(db, user.id);
  saveDB(db);
  send(res, 200, { user: publicUser(user) }, {
    'Set-Cookie': `acre_session=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${60*60*24*30}`
  });
});

route('POST', '/api/auth/login', async (req, res, db) => {
  const { email, password } = await readJSON(req);
  const user = db.users.find(u => u.email === (email||'').toLowerCase());
  if(!user || user.disabled || !verifyPassword(password||'', user.salt, user.hash))
    return send(res, 401, { error:'Invalid credentials' });
  const token = newSession(db, user.id);
  saveDB(db);
  send(res, 200, { user: publicUser(user) }, {
    'Set-Cookie': `acre_session=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${60*60*24*30}`
  });
});

route('POST', '/api/auth/logout', async (req, res, db) => {
  const cookie = req.headers.cookie || '';
  const m = /(?:^|; )acre_session=([^;]+)/.exec(cookie);
  if(m) delete db.sessions[m[1]];
  saveDB(db);
  send(res, 200, { ok: true }, {
    'Set-Cookie': 'acre_session=; Path=/; HttpOnly; Max-Age=0'
  });
});

route('GET', '/api/auth/me', async (req, res, db) => {
  send(res, 200, { user: publicUser(userFromReq(db, req)) });
});

// Products (public list, admin-only mutations)
route('GET', '/api/products', async (req, res, db) => {
  send(res, 200, { products: db.products });
});
route('GET', '/api/products/:id', async (req, res, db, [id]) => {
  const p = db.products.find(p => p.id === id);
  if(!p) return send(res, 404, { error:'Not found' });
  send(res, 200, { product: p });
});
route('POST', '/api/products', async (req, res, db) => {
  const u = userFromReq(db, req);
  if(!u || u.role !== 'admin') return send(res, 403, { error:'Forbidden' });
  const body = await readJSON(req);
  const id = 'p' + String(db.nextProductId++).padStart(2,'0');
  const product = {
    id,
    name: body.name || 'Untitled',
    price: Number(body.price) || 0,
    cat: body.cat || 'Home',
    desc: body.desc || '',
    badge: body.badge || '',
    options: body.options || {},
    specs: body.specs || {},
    palette: body.palette || ['#bfa987','#7a6a4f'],
    image: body.image || ''
  };
  db.products.push(product);
  saveDB(db);
  send(res, 200, { product });
});
route('PUT', '/api/products/:id', async (req, res, db, [id]) => {
  const u = userFromReq(db, req);
  if(!u || u.role !== 'admin') return send(res, 403, { error:'Forbidden' });
  const body = await readJSON(req);
  const p = db.products.find(p => p.id === id);
  if(!p) return send(res, 404, { error:'Not found' });
  Object.assign(p, body, { id: p.id });
  if(body.price !== undefined) p.price = Number(body.price);
  saveDB(db);
  send(res, 200, { product: p });
});
route('DELETE', '/api/products/:id', async (req, res, db, [id]) => {
  const u = userFromReq(db, req);
  if(!u || u.role !== 'admin') return send(res, 403, { error:'Forbidden' });
  const i = db.products.findIndex(p => p.id === id);
  if(i < 0) return send(res, 404, { error:'Not found' });
  db.products.splice(i, 1);
  saveDB(db);
  send(res, 200, { ok: true });
});

// Orders
route('POST', '/api/orders', async (req, res, db) => {
  const body = await readJSON(req);
  const u = userFromReq(db, req);
  if(!body.items || !body.items.length) return send(res, 400, { error:'Cart is empty' });
  // Recompute server-side for safety
  let subtotal = 0;
  const items = body.items.map(it => {
    const p = db.products.find(p => p.id === it.id);
    if(!p) throw new Error('Unknown product '+it.id);
    const qty = Math.max(1, Number(it.qty)||1);
    subtotal += p.price * qty;
    return { id: p.id, name: p.name, price: p.price, qty, opts: it.opts || {} };
  });
  const SHIP = { standard:{cost:12,freeOver:150}, express:{cost:24,freeOver:250}, pickup:{cost:0,freeOver:0} };
  const m = SHIP[body.method] || SHIP.standard;
  const shipping = m.freeOver && subtotal >= m.freeOver ? 0 : m.cost;
  const order = {
    id: 'ACRE-' + String(100000 + db.nextOrderId++).padStart(6,'0'),
    userId: u ? u.id : null,
    email: body.email || (u && u.email) || '',
    name: body.name || (u && u.name) || '',
    items,
    method: body.method || 'standard',
    address: body.address || {},
    subtotal,
    shipping,
    total: subtotal + shipping,
    status: 'paid',
    createdAt: new Date().toISOString()
  };
  db.orders.push(order);
  saveDB(db);
  send(res, 200, { order });
});

route('GET', '/api/orders', async (req, res, db) => {
  const u = userFromReq(db, req);
  if(!u) return send(res, 401, { error:'Sign in required' });
  const orders = u.role === 'admin' ? db.orders : db.orders.filter(o => o.userId === u.id);
  send(res, 200, { orders });
});

route('PUT', '/api/orders/:id', async (req, res, db, [id]) => {
  const u = userFromReq(db, req);
  if(!u || u.role !== 'admin') return send(res, 403, { error:'Forbidden' });
  const body = await readJSON(req);
  const o = db.orders.find(o => o.id === id);
  if(!o) return send(res, 404, { error:'Not found' });
  if(body.status) o.status = body.status;
  saveDB(db);
  send(res, 200, { order: o });
});

// User management (admin)
route('GET', '/api/users', async (req, res, db) => {
  const u = userFromReq(db, req);
  if(!u || u.role !== 'admin') return send(res, 403, { error:'Forbidden' });
  send(res, 200, { users: db.users.map(publicUser) });
});
route('PUT', '/api/users/:id', async (req, res, db, [id]) => {
  const u = userFromReq(db, req);
  if(!u || u.role !== 'admin') return send(res, 403, { error:'Forbidden' });
  const body = await readJSON(req);
  const target = db.users.find(x => x.id === Number(id));
  if(!target) return send(res, 404, { error:'Not found' });
  if(body.role) target.role = body.role;
  if(typeof body.disabled === 'boolean') target.disabled = body.disabled;
  if(body.name) target.name = body.name;
  saveDB(db);
  send(res, 200, { user: publicUser(target) });
});
route('DELETE', '/api/users/:id', async (req, res, db, [id]) => {
  const u = userFromReq(db, req);
  if(!u || u.role !== 'admin') return send(res, 403, { error:'Forbidden' });
  if(Number(id) === u.id) return send(res, 400, { error:'You cannot delete yourself' });
  const i = db.users.findIndex(x => x.id === Number(id));
  if(i < 0) return send(res, 404, { error:'Not found' });
  db.users.splice(i, 1);
  saveDB(db);
  send(res, 200, { ok: true });
});

// Account update (own profile)
route('PUT', '/api/account', async (req, res, db) => {
  const u = userFromReq(db, req);
  if(!u) return send(res, 401, { error:'Sign in required' });
  const body = await readJSON(req);
  if(body.name) u.name = body.name;
  if(body.password && body.password.length >= 6){
    const { salt, hash } = hashPassword(body.password);
    u.salt = salt; u.hash = hash;
  }
  saveDB(db);
  send(res, 200, { user: publicUser(u) });
});

// ---------- Server ----------
const server = http.createServer(async (req, res) => {
  try {
    const db = loadDB();
    const pathname = url.parse(req.url).pathname;
    if(pathname.startsWith('/api/')){
      for(const r of routes){
        if(r.method !== req.method) continue;
        const m = r.pattern.exec(pathname);
        if(m){
          return await r.handler(req, res, db, m.slice(1));
        }
      }
      return send(res, 404, { error:'API route not found' });
    }
    serveStatic(req, res);
  } catch(err){
    console.error(err);
    send(res, 500, { error: String(err.message || err) });
  }
});

server.listen(PORT, () => {
  // Ensure DB exists on startup so seed runs once.
  loadDB();
  console.log(`Acre running → http://localhost:${PORT}`);
  console.log(`Default admin: admin@acre.local / admin123`);
});
