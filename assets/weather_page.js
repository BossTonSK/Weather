// weather page
(async function(){
  const cfg = window.APP_CONFIG;
  const geo = await fetchGeoJSON(cfg.GEOJSON_URL).catch(e=>{console.error(e);alert('โหลดข้อมูลไม่สำเร็จ')});
  const provinces = geo.features.map(f=>({name:f.properties?.name || f.properties?.NAME, center: pickCenter(f)}));
  const weather = generateMockWeather(provinces);

  const listEl = document.getElementById('list');
  const search = document.getElementById('search');

  function render(items){
    listEl.innerHTML='';
    items.forEach(it=>{
      const li = document.createElement('li'); li.className='province-item';
      const left = el('div','left');
      left.appendChild(el('div','prov-name',it.name));
      left.appendChild(el('div','meta',it.status + ' · ' + it.temp + '°C'));
      const right = el('div','right');
      const btn = el('a','btn','ดู'); btn.href = '/index.html?province=' + encodeURIComponent(it.name);
      right.appendChild(btn);
      li.appendChild(left); li.appendChild(right);
      listEl.appendChild(li);
    })
  }

  render(weather);

  search.addEventListener('input',()=>{
    const q = search.value.trim().toLowerCase();
    render(weather.filter(w=>w.name.toLowerCase().includes(q)));
  })
})();
