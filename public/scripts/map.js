mapboxgl.accessToken = mapToken;

const map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/mapbox/streets-v12",
  center: listing.geometry.coordinates, //[lng, lat]
  zoom: 9,
});

// Creating a default Marker and add it to the map.
const marker = new mapboxgl.Marker({ color: "red" })
  .setLngLat(listing.geometry.coordinates) // Listing.geometry.coordinates
  .setPopup(
    new mapboxgl.Popup({ offset: 25 }).setHTML(
      `<h4>${listing.title}</h4><p>Exact Location will be provided after booking!</p>`
    )
  )
  .addTo(map);
//?
