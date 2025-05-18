// js/map.js
const map = L.map('map').setView([-41, 173], 6);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

fetch('geojson/publictoilets.geojson')
  .then(res => res.json())
  .then(data => {
    L.geoJSON(data, {
      pointToLayer: (feature, latlng) => {
        return L.marker(latlng, {
          icon: L.icon({
            iconUrl: `https://decvoz.github.io/thecallofnature/icons/toilet.svg`,
            iconSize: [32, 32]
          })
        });
      },
      onEachFeature: (feature, layer) => {
        const { toilet_type, water, toilet_paper } = feature.properties;
        layer.bindPopup(
          `<strong>Toilet</strong><br>Type: ${toilet_type}<br>Water: ${water}<br>Toilet paper: ${toilet_paper}`
        );
      }
    }).addTo(map);
  });
