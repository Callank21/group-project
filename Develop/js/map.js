<<<<<<< HEAD
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
=======
var submitButton = document.querySelector("#button");
mapboxgl.accessToken = 'pk.eyJ1IjoiY2FsbGFuazIxIiwiYSI6ImNsMWJiZnA0cjJyMG0zam4xMTF6MHdndmYifQ.lZAx_bYFPQmZDlkT3b8Daw';


function searchQuery(query) {
    query.replace(' ', '%20');
    var location = `https://api.mapbox.com/geocoding/v5/mapbox.places/${query}.json?proximity=ip&types=place%2Cpostcode%2Caddress&access_token=pk.eyJ1IjoiY2FsbGFuazIxIiwiYSI6ImNsMWJiZnA0cjJyMG0zam4xMTF6MHdndmYifQ.lZAx_bYFPQmZDlkT3b8Daw`;
    var lat;
    var lon;
    fetch(location)
    .then(function(response) {
        console.log(response)
        response.json()
        .then(function(response) {
            console.log(response)
            coordinates = response.features[0].geometry.coordinates;
            lat = coordinates[0];
            lon = coordinates[1];
            console.log(lat);
            console.log(lon);
            setUpMap(lat, lon); 
        })
    })
}


function setUpMap(lat, lon) {
            getAirQuality(lon, lat);
            const map = new mapboxgl.Map({
                container: 'map', // container ID
                style: 'mapbox://styles/mapbox/streets-v11', // style URL
                center: [lat,lon], // starting position [lng, lat]
                zoom: 10 // starting zoom  
            }); 
}



submitButton.addEventListener("click", function() {
    console.log("go");
    var query = document.getElementById("query").value;
    if (query) {
        searchQuery(query);
    }
    else {
        searchQuery("los angeles");
    }
});
>>>>>>> 9870150d6f94d0ce76036e5d32d91279f1262bcf
