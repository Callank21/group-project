var submitButton = document.querySelector("#button");

var previousSearches = [];

function searchQuery(query) {
    query.replace(' ', '%20');
    var location = `https://api.mapbox.com/geocoding/v5/mapbox.places/${query}.json?proximity=ip&types=place%2Cpostcode%2Caddress&access_token=pk.eyJ1IjoiY2FsbGFuazIxIiwiYSI6ImNsMWJiZnA0cjJyMG0zam4xMTF6MHdndmYifQ.lZAx_bYFPQmZDlkT3b8Daw`;
    var lat;
    var lon;
    fetch(location)
        .then(function (response) {
            console.log(response)
            response.json()
                .then(function (response) {
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
    mapboxgl.accessToken = 'pk.eyJ1IjoiY2FsbGFuazIxIiwiYSI6ImNsMWJiZnA0cjJyMG0zam4xMTF6MHdndmYifQ.lZAx_bYFPQmZDlkT3b8Daw';
    getAirQuality(lon, lat);
    const map = new mapboxgl.Map({
        container: 'map', // container ID
        style: 'mapbox://styles/mapbox/streets-v11', // style URL
        center: [lat, lon], // starting position [lng, lat]
        zoom: 10 // starting zoom  
    });
}

submitButton.addEventListener("click", function () {
    var query = document.getElementById("input").value;
    if (query) {
        searchQuery(query);
    }
    else {
        searchQuery("los angeles");
    }
});



// Start of Air Pollution API

var aqiDef = ["good", "fair", "moderate", "poor", "very poor"];

var dataEl = document.querySelector('#test-data');
var componentsEl = dataEl.querySelector('#component-data');

var qualityEl = document.querySelector('#air-quality');

var airQuality = {};

function buttonSubmitHandler(event) {
    event.preventDefault();

    var airQualityVar = getAirQuality(lat, lon);
    console.log(airQualityVar);
}
function getAirQuality(lat, lon) {
    var airPollutionUrl = 'http://api.openweathermap.org/data/2.5/air_pollution?lat=' + lat + '&lon=' + lon + '&appid=4ce1081bbd0cd6d45033a1dc8f18bcdf';


    fetch(airPollutionUrl)
        .then(function (response) {
            console.log(response);
            if (response.ok) {
                response.json().then(function (data) {
                    displayData(data);
                    return data;
                })
            } else {
                var error = displayError(response.statusText);
                return error;
            }
        })
}

function displayData(data) {
    for (let i = 0; i < data.list.length; i++) {
        airQuality.quality = (aqiDef[data.list[i].main.aqi - 1]);
        airQuality.components = data.list[i].components;

        qualityEl.textContent = airQuality.quality;

        var componentHtml =
            "<li><span> CO:</span> " + airQuality.components.co + "</li>" +
            "<li><span> NO:</span> " + airQuality.components.no + "</li>" +
            "<li><span> NO<sub>2</sub>:</span> " + airQuality.components.no2 + "</li>" +
            "<li><span> O<sub>3</sub>:</span> " + airQuality.components.o3 + "</li>" +
            "<li><span> SO<sub>2</sub>:</span> " + airQuality.components.so2 + "</li>" +
            "<li><span> PM<sub>2.5</sub>:</span> " + airQuality.components.pm2_5 + "</li>" +
            "<li><span> PM<sub>10</sub>:</span> " + airQuality.components.pm10 + "</li>" +
            "<li><span> NH<sub>3</sub>:</span> " + airQuality.components.nh3 + "</li>";

        componentsEl.innerHTML = componentHtml;
    }
}

function displayError(error) {
    return error;
}
