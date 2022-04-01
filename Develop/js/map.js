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