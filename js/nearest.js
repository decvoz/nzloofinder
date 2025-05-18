function findNearestLoo() {
  if (!navigator.geolocation) {
    alert('Geolocation not supported');
    return;
  }
  navigator.geolocation.getCurrentPosition(pos => {
    const { latitude, longitude } = pos.coords;
    userLocation = [latitude, longitude];

    fetch('geojson/publictoilets_clean.geojson')
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

          if (nearestLine) map.removeLayer(nearestLine);

          nearestLine = L.polyline([userLocation, [lat, lon]], {
            color: '#00573F',
            weight: 3,
            dashArray: '4'
          }).addTo(map);

          const distance = (minDist / 1000).toFixed(2);
          const birdIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width: 20px; height: 20px; vertical-align: middle;"><path d="M16 7h.01"/><path d="M3.4 18H12a8 8 0 0 0 8-8V7a4 4 0 0 0-7.28-2.3L2 20"/><path d="m20 7 2 .5-2 .5"/><path d="M10 18v3"/><path d="M14 17.75V21"/><path d="M7 18a6 6 0 0 0 3.84-10.61"/></svg>`;

          L.popup()
            .setLatLng([lat, lon])
            .setContent(`Nearest toilet found!<br>${distance} km away, as the tern flies ${birdIcon}`)
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
