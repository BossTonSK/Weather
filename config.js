// config.js - ปรับค่านี้เพื่อเชื่อม API จริง
window.APP_CONFIG = {
  // GeoJSON ของจังหวัดไทย (ใช้ raw GitHub URL ของชุดข้อมูลขอบเขตจังหวัด)
  GEOJSON_URL: 'https://raw.githubusercontent.com/chingchai/OpenGISData-Thailand/master/provinces.geojson',

  // ถ้า USE_LIVE = false จะใช้ข้อมูล mock ที่สร้างขึ้นอัตโนมัติ
  USE_LIVE: false,

  // ตัวอย่าง template สำหรับ OpenWeatherMap (ถ้าจะใช้ live): replace {lat} {lon} และ ?appid=KEY
  WEATHER_API_TEMPLATE: 'https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&units=metric&appid={KEY}',
  WEATHER_API_KEY: '',

  // ตัวอย่าง template สำหรับ PM2.5 (ต้องใส่ endpointของผู้ให้บริการ/หน่วยงาน)
  PM25_API_TEMPLATE: '',
}
