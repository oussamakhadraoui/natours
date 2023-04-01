export const map = (location) => {
  mapboxgl.accessToken =
    'pk.eyJ1IjoiZ2FsaXBvIiwiYSI6ImNsZmlzZGhycjRtenozcm50bnNtaWpwaHYifQ.bLhZPqRlBsYKQRPMFq-00g';
  const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/streets-v12', // style URL
    center: [-74.5, 40], // starting position [lng, lat]
    zoom: 9, // starting zoom
  });
};
