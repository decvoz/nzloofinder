// js/nearest.js
function findNearestLoo() {
  if (!navigator.geolocation) {
    alert('Geolocation not supported');
    return;
  }
  navigator.geolocation.getCurrentPosition(pos => {
    const { latitude, longitude } = pos.coords;
    if (latitude < -35 || latitude > -33 || longitude < 166 || longitude > 179) {
      alert("Try again when you're next in Aotearoa.");
      return;
    }

    fetch('geojson/publictoilets.geojson')
      .then(res => res.json())
      .then(data => {
        let minDist = Infinity;
        let nearest = null;
        data.features.forEach(feature => {
          const [lon, lat] = feature.geometry.coordinates;
          const dist = haversineDist(latitude, longitude, lat, lon);
          if (dist < minDist) {
            minDist = dist;
            nearest = feature;
          }
        });

        if (nearest) {
          const [lon, lat] = nearest.geometry.coordinates;
          map.setView([lat, lon], 16);
          L.popup()
            .setLatLng([lat, lon])
            .setContent("Nearest toilet found! Check the marker.")
            .openOn(map);
        }
      });
  });
}

function haversineDist(lat1, lon1, lat2, lon2) {
  function toRad(x) {
    return x * Math.PI / 180;
  }
  const R = 6371e3;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}
