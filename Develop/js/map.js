mapboxgl.accessToken = 'pk.eyJ1IjoiY2FsbGFuazIxIiwiYSI6ImNsMWJiZnA0cjJyMG0zam4xMTF6MHdndmYifQ.lZAx_bYFPQmZDlkT3b8Daw';

navigator.geolocation.getCurrentPosition(successLocation, errorLocation,{
    enableHighAccuracy: true
});

function successLocation(position) {
    setupMap([position.coords.longitude, position.coords.latitude]);
}

function errorLocation() {
    setupMap();
}

function setupMap(center) {
    var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11',
    center: center,
    zoom: 10
    });
}
var los = 'https://api.mapbox.com/geocoding/v5/mapbox.places/1512%20onyx%20lan.json?proximity=ip&types=place%2Cpostcode%2Caddress&access_token=pk.eyJ1IjoiY2FsbGFuazIxIiwiYSI6ImNsMWJiZnA0cjJyMG0zam4xMTF6MHdndmYifQ.lZAx_bYFPQmZDlkT3b8Daw';
fetch(los)
    .then(function(response) {
        var la = response.json()
        .then(function(response) {
            var coordinates = response.features[0].geometry.coordinates;
            console.log(coordinates);
            getAirQuality(coordinates[1], coordinates[0]);
        })
    })