// shared functions for pages
async function fetchGeoJSON(url){
  const res = await fetch(url);
  if(!res.ok) throw new Error('ไม่สามารถโหลด GeoJSON ได้');
  return res.json();
}

function pickCenter(feature){
  // try to compute centroid or use geometry bbox
  try{
    const coords = feature.geometry.coordinates;
    // handle MultiPolygon and Polygon
    const poly = Array.isArray(coords[0][0][0]) ? coords[0][0] : coords[0];
    const c = poly[Math.floor(poly.length/2)];
    return [c[1], c[0]];
  }catch(e){
    return [13.736717,100.523186];
  }
}

function randInt(min,max){return Math.floor(Math.random()*(max-min+1))+min}

function generateMockWeather(provinces){
  // provinces: array of names or objects {name, center}
  return provinces.map(p=>{
    const temp = randInt(24,38);
    const rain = Math.random()<0.25;
    return {
      name: typeof p === 'string'?p:p.name,
      temp,
      status: rain? 'ฝน' : 'แจ่มใส',
      lat: p.center?.[0]||p.lat||null,
      lon: p.center?.[1]||p.lon||null
    }
  })
}

function generateMockPM25(provinces){
  return provinces.map(p=>({
    name: typeof p === 'string'?p:p.name,
    pm25: Math.round(Math.random()*120),
  }))
}

function qs(name){
  return new URLSearchParams(location.search).get(name)
}

// helper to create DOM
function el(tag,cls,txt){const e=document.createElement(tag);if(cls)e.className=cls;if(txt!==undefined)e.textContent=txt;return e}
