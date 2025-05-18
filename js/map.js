const map = L.map('map').setView([-41, 173], 6);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

fetch('geojson/publictoilets_clean.geojson')
  .then(res => res.json())
  .then(data => {
    L.geoJSON(data, {
      pointToLayer: (feature, latlng) => {
        const iconHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-toilet-icon" style="background: rgba(0, 77, 153, 0.8); border-radius: 50%; padding: 2px; width: 32px; height: 32px;"><path d="M7 12h13a1 1 0 0 1 1 1 5 5 0 0 1-5 5h-.598a.5.5 0 0 0-.424.765l1.544 2.47a.5.5 0 0 1-.424.765H5.402a.5.5 0 0 1-.424-.765L7 18"/><path d="M8 18a5 5 0 0 1-5-5V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8"/></svg>`;
        const divIcon = L.divIcon({
          className: '',
          html: iconHTML,
          iconSize: [32, 32],
          iconAnchor: [16, 16]
        });
        return L.marker(latlng, { icon: divIcon });
      },
      onEachFeature: (feature, layer) => {
        const { toilet_type, water, toilet_paper } = feature.properties;
        layer.bindPopup(
          `<strong>Toilet</strong><br>Type: ${toilet_type}<br>Water: ${water}<br>Toilet paper: ${toilet_paper}`
        );
      }
    }).addTo(map);
  });
