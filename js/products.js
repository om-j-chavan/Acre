// Acre — product catalog
const PRODUCTS = [
  {
    id:'p01', name:'Terra Planter — Large', price:189, cat:'Planters',
    desc:'Hand-thrown terracotta planter with a soft matte finish. Each piece carries the gentle imperfections of its maker, designed to age beautifully over time.',
    badge:'New',
    options:{Size:['Small','Medium','Large']},
    specs:{Material:'Terracotta',Dimensions:'Ø32cm × H38cm',Weight:'4.2kg',Origin:'Handmade in Portugal'},
    palette:['#b08a6a','#8a674a'],
    image:'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=900&q=80&auto=format&fit=crop'
  },
  {
    id:'p02', name:'Olive Branch Pruners', price:64, cat:'Tools',
    desc:'Forged carbon steel blades with a smooth oiled walnut handle. Balanced, precise, made to last a lifetime of careful work in the garden.',
    options:{},
    specs:{Material:'Carbon steel & walnut',Length:'21cm',Weight:'180g',Origin:'Italy'},
    palette:['#6b614a','#3a3528'],
    image:'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=900&q=80&auto=format&fit=crop'
  },
  {
    id:'p03', name:'Linen Apron — Stone', price:98, cat:'Apparel',
    desc:'Heavyweight stonewashed linen apron with leather neck strap and deep front pockets. Cut for a relaxed, lived-in fit that softens with every wash.',
    badge:'Bestseller',
    options:{Size:['One Size'],Colour:['Stone','Olive','Clay']},
    specs:{Material:'100% European linen',Care:'Machine wash cold',Origin:'Made in Melbourne'},
    palette:['#c9bfa6','#8c8270'],
    image:'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=900&q=80&auto=format&fit=crop'
  },
  {
    id:'p04', name:'Heritage Watering Can', price:128, cat:'Tools',
    desc:'Galvanised steel watering can with a long copper rose. Generous 8-litre capacity and weighted base for a steady, even pour.',
    options:{Capacity:['5L','8L']},
    specs:{Material:'Galvanised steel & copper',Capacity:'8L',Origin:'England'},
    palette:['#9aa191','#5d6253'],
    image:'https://images.unsplash.com/photo-1591857177580-dc82b9ac4e1e?w=900&q=80&auto=format&fit=crop'
  },
  {
    id:'p05', name:'Stoneware Vessel', price:74, cat:'Vessels',
    desc:'Wheel-thrown stoneware vessel finished in a soft ash glaze. A quiet object — equally at home holding cuttings, candles, or nothing at all.',
    options:{Size:['Tall','Short']},
    specs:{Material:'Stoneware',Dimensions:'Ø14cm × H22cm',Origin:'Studio Acre'},
    palette:['#d4cab5','#a89a7c'],
    image:'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=900&q=80&auto=format&fit=crop'
  },
  {
    id:'p06', name:'Field Notes Journal', price:38, cat:'Paper',
    desc:'Cloth-bound journal with hand-stitched binding and unbleached pages. Made for sketching, note-taking, pressing leaves between pages.',
    badge:'New',
    options:{Cover:['Natural','Charcoal','Ochre']},
    specs:{Pages:'192 unlined',Size:'A5',Origin:'Bound in Japan'},
    palette:['#bfa987','#7a6a4f'],
    image:'https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=900&q=80&auto=format&fit=crop'
  },
  {
    id:'p07', name:'Brass Plant Mister', price:54, cat:'Tools',
    desc:'Solid brass mister with a fine atomising nozzle. Develops a warm patina with use — an instrument that becomes lovelier with time.',
    options:{},
    specs:{Material:'Solid brass',Capacity:'250ml',Origin:'France'},
    palette:['#b89a6a','#7a5f37'],
    image:'https://images.unsplash.com/photo-1604762524889-3e2fcc145683?w=900&q=80&auto=format&fit=crop'
  },
  {
    id:'p08', name:'Hand-Loomed Throw', price:248, cat:'Home',
    desc:'Slow-woven on traditional looms in undyed wool. Generously sized to fold over the end of a bed or wrap around the shoulders on cooler evenings.',
    options:{Colour:['Natural','Charcoal','Rust']},
    specs:{Material:'100% wool',Dimensions:'130cm × 180cm',Origin:'Handwoven, Nepal'},
    palette:['#c4b59a','#7d6e54'],
    image:'https://images.unsplash.com/photo-1540574163026-643ea20ade25?w=900&q=80&auto=format&fit=crop'
  },
  {
    id:'p09', name:'Cast Iron Pot — Garden', price:156, cat:'Planters',
    desc:'Robust cast iron pot with drainage and a raw, unsealed finish that will rust gracefully outdoors over the seasons.',
    options:{Size:['25cm','35cm','45cm']},
    specs:{Material:'Cast iron',Drainage:'Yes',Origin:'Cast in Vietnam'},
    palette:['#5e564a','#332e25'],
    image:'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=900&q=80&auto=format&fit=crop'
  },
  {
    id:'p10', name:'Beeswax Taper Set', price:32, cat:'Home',
    desc:'Set of six 100% pure beeswax tapers, hand-dipped by Australian beekeepers. Burn warm and slow with a faint honey scent.',
    options:{Colour:['Natural','Charcoal']},
    specs:{Material:'100% beeswax',BurnTime:'~7hr each',Origin:'Australia'},
    palette:['#e8d39a','#a8884a'],
    image:'https://images.unsplash.com/photo-1602874801007-bd6b4c0d1d3a?w=900&q=80&auto=format&fit=crop'
  },
  {
    id:'p11', name:'Ceramic Bird Feeder', price:88, cat:'Vessels',
    desc:'A quiet companion for the garden. Glazed stoneware bird feeder with a hemp hanging cord, designed to weather softly in the open air.',
    options:{},
    specs:{Material:'Stoneware',Dimensions:'Ø18cm × H12cm',Origin:'Studio Acre'},
    palette:['#cabba0','#8a7a5d'],
    image:'https://images.unsplash.com/photo-1444930694458-01babe71870e?w=900&q=80&auto=format&fit=crop'
  },
  {
    id:'p12', name:'Reclaimed Oak Stool', price:289, cat:'Home',
    desc:'Solid stool turned from reclaimed oak with a hand-rubbed beeswax finish. Each one is one of a kind — knots, grain and history included.',
    badge:'Limited',
    options:{},
    specs:{Material:'Reclaimed oak',Dimensions:'Ø30cm × H45cm',Origin:'Handmade, Tasmania'},
    palette:['#a07a4f','#5e442a'],
    image:'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=900&q=80&auto=format&fit=crop'
  }
];

function productImage(p){
  // SVG sits behind as a guaranteed fallback; img layers on top and hides itself if it fails to load.
  const svg = productSVG(p);
  if(!p.image) return svg;
  return `<div style="position:absolute;inset:0">${svg}</div>
    <img src="${p.image}" alt="${p.name}" loading="lazy"
      style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;display:block;transition:transform .8s ease"
      onerror="this.style.display='none'"/>`;
}

// Build a soft SVG illustration per product (no external assets required)
function productSVG(p){
  const [c1,c2]=p.palette;
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
    <text x="20" y="380" font-family="Georgia,serif" font-size="11" fill="rgba(255,250,235,.55)" letter-spacing="2">ACRE · ${p.cat.toUpperCase()}</text>
  </svg>`;
}

function shapeFor(p){
  // Different abstract object silhouettes per category
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
              <path d="M120 130 Q150 100 180 130" stroke="${hl}" stroke-width="2" fill="none"/>
              <line x1="150" y1="160" x2="150" y2="280" stroke="${hl}" stroke-width="1"/>`;
    case 'Vessels':
      return `<path d="M110 180 Q110 150 130 145 L170 145 Q190 150 190 180 L195 280 Q150 300 105 280 Z" fill="${c}"/>
              <ellipse cx="150" cy="150" rx="22" ry="6" fill="${hl}"/>`;
    case 'Paper':
      return `<rect x="100" y="120" width="100" height="160" fill="${c}"/>
              <line x1="100" y1="120" x2="100" y2="280" stroke="${hl}" stroke-width="3"/>
              <line x1="120" y1="160" x2="180" y2="160" stroke="${hl}" stroke-width="1"/>
              <line x1="120" y1="180" x2="180" y2="180" stroke="${hl}" stroke-width="1"/>
              <line x1="120" y1="200" x2="160" y2="200" stroke="${hl}" stroke-width="1"/>`;
    case 'Home':
      return `<rect x="80" y="180" width="140" height="100" fill="${c}"/>
              <rect x="100" y="200" width="100" height="60" fill="${hl}" opacity=".3"/>
              <line x1="80" y1="280" x2="220" y2="280" stroke="${hl}" stroke-width="2"/>`;
    default:
      return `<circle cx="150" cy="220" r="70" fill="${c}"/>`;
  }
}

if(typeof module!=='undefined') module.exports={PRODUCTS,productSVG};
