// Browser-side product helpers. PRODUCTS is loaded from /api/products at runtime.
let PRODUCTS = [];

async function loadProducts(){
  try {
    const r = await fetch('/api/products');
    const j = await r.json();
    PRODUCTS = j.products || [];
  } catch(e){
    console.error('Failed to load products', e);
    PRODUCTS = [];
  }
  return PRODUCTS;
}

function productSVG(p){
  const [c1,c2] = p.palette || ['#bfa987','#7a6a4f'];
  return `
  <svg viewBox="0 0 300 400" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="g-${p.id}" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="${c1}"/>
        <stop offset="100%" stop-color="${c2}"/>
      </linearGradient>
      <radialGradient id="rg-${p.id}" cx="0.3" cy="0.3" r="0.8">
        <stop offset="0%" stop-color="rgba(255,248,232,.4)"/>
        <stop offset="100%" stop-color="rgba(0,0,0,0)"/>
      </radialGradient>
    </defs>
    <rect width="300" height="400" fill="url(#g-${p.id})"/>
    <rect width="300" height="400" fill="url(#rg-${p.id})"/>
    ${shapeFor(p)}
    <text x="20" y="380" font-family="Georgia,serif" font-size="11" fill="rgba(255,250,235,.55)" letter-spacing="2">ACRE · ${(p.cat||'').toUpperCase()}</text>
  </svg>`;
}

function shapeFor(p){
  const c='rgba(30,28,22,.55)', hl='rgba(255,250,235,.18)';
  switch(p.cat){
    case 'Planters':
      return `<path d="M90 200 L210 200 L195 320 L105 320 Z" fill="${c}"/>
              <ellipse cx="150" cy="200" rx="60" ry="10" fill="${hl}"/>
              <path d="M150 200 Q140 130 110 100 M150 200 Q160 140 180 110" stroke="${hl}" stroke-width="3" fill="none"/>`;
    case 'Tools':
      return `<rect x="140" y="120" width="20" height="160" fill="${c}" rx="3"/>
              <path d="M120 110 Q150 80 180 110 L170 130 Q150 110 130 130 Z" fill="${c}"/>
              <circle cx="150" cy="290" r="10" fill="${hl}"/>`;
    case 'Apparel':
      return `<path d="M90 130 L210 130 L220 290 Q150 320 80 290 Z" fill="${c}"/>
              <path d="M120 130 Q150 100 180 130" stroke="${hl}" stroke-width="2" fill="none"/>`;
    case 'Vessels':
      return `<path d="M110 180 Q110 150 130 145 L170 145 Q190 150 190 180 L195 280 Q150 300 105 280 Z" fill="${c}"/>
              <ellipse cx="150" cy="150" rx="22" ry="6" fill="${hl}"/>`;
    case 'Paper':
      return `<rect x="100" y="120" width="100" height="160" fill="${c}"/>
              <line x1="100" y1="120" x2="100" y2="280" stroke="${hl}" stroke-width="3"/>`;
    case 'Home':
      return `<rect x="80" y="180" width="140" height="100" fill="${c}"/>
              <rect x="100" y="200" width="100" height="60" fill="${hl}" opacity=".3"/>`;
    default:
      return `<circle cx="150" cy="220" r="70" fill="${c}"/>`;
  }
}

function productImage(p){
  const svg = productSVG(p);
  if(!p.image) return svg;
  return `<div style="position:absolute;inset:0">${svg}</div>
    <img src="${p.image}" alt="${p.name}" loading="lazy"
      style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;display:block;transition:transform .8s ease"
      onerror="this.style.display='none'"/>`;
}
