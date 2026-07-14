// index page script
(async function(){
  const cfg = window.APP_CONFIG;
  const geo = await fetchGeoJSON(cfg.GEOJSON_URL).catch(e=>{console.error(e);alert('โหลดแผนที่ไม่สำเร็จ');});

  const map = L.map('map',{minZoom:5}).setView([13.0,100.5],6);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{attribution:''}).addTo(map);

  const provs = [];

  function onEachFeature(feature,layer){
    const name = feature.properties?.name || feature.properties?.NAME || 'ไม่ทราบ';
    const center = pickCenter(feature);
    provs.push({name, center});

    layer.on('click',()=>{
      showPanelFor({name, center});
    });

    // label
    const label = L.tooltip({permanent:true,direction:'center',className:'prov-label'})
      .setContent(name)
      .setLatLng([center[0],center[1]]);
    label.addTo(map);
  }

  const geoLayer = L.geoJSON(geo,{style:{color:'#2b9bd7',weight:1,fillColor:'#e9f6ff',fillOpacity:0.6},onEachFeature}).addTo(map);

  // panel logic
  const panel = document.getElementById('sidepanel');
  const closeBtn = document.getElementById('close-panel');
  closeBtn.onclick = ()=>panel.style.display='none';

  async function showPanelFor(p){
    panel.style.display='block';
    document.getElementById('prov-name').textContent = p.name;

    // get data (mock or live)
    if(cfg.USE_LIVE && cfg.WEATHER_API_KEY && p.center){
      // try call weather API
      try{
        const lat=p.center[0], lon=p.center[1];
        const url = cfg.WEATHER_API_TEMPLATE.replace('{lat}',lat).replace('{lon}',lon).replace('{KEY}',cfg.WEATHER_API_KEY);
        const res = await fetch(url);
        const data = await res.json();
        const status = data.weather?.[0]?.main || 'ไม่ทราบ';
        const temp = data.main?.temp;
        document.getElementById('wea-status').textContent = status;
        document.getElementById('wea-temp').textContent = temp? temp.toFixed(1) + '°C' : '-';
      }catch(e){
        document.getElementById('wea-status').textContent='ไม่สามารถโหลด';
        document.getElementById('wea-temp').textContent='-';
      }
    }else{
      // mock
      const mock = generateMockWeather([p])[0];
      document.getElementById('wea-status').textContent = mock.status;
      document.getElementById('wea-temp').textContent = mock.temp + '°C';
    }

    // PM2.5 (mock or live)
    if(cfg.USE_LIVE && cfg.PM25_API_TEMPLATE){
      // TODO: support a PM2.5 API template per province
      document.getElementById('pm25-val').textContent = 'เชื่อมต่อ API ยังไม่ถูกตั้งค่า';
    }else{
      const mock = generateMockPM25([p])[0];
      document.getElementById('pm25-val').textContent = mock.pm25 + ' µg/m³';
    }

    // links
    document.getElementById('goto-weather').href = '/weather.html?province=' + encodeURIComponent(p.name);
    document.getElementById('goto-pm25').href = '/pm25.html?province=' + encodeURIComponent(p.name);
  }

})();
