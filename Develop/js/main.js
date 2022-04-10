var polCheck = document.getElementById("polCheck"); //button for the index page
var queryMap = document.getElementById("queryMap");//button for the mapping page
var searchHistory = document.getElementById("searchHistory"); //listener for button clicks in the searchHistory div on mapping.html

var previousSearches = []; //index where search results are saved

function searchQuery(query) { // takes in a search query and sends it to the Mapbox API to then get longitude and latitude data; sends it to the map display function and the air quality data function
    previousSearches.splice(0, 0, query); //this calls the history tab whenever a search query is input
    createHistory(previousSearches);
    query.replace(' ', '%20');
    var location = `https://api.mapbox.com/geocoding/v5/mapbox.places/${query}.json?proximity=ip&types=place%2Cpostcode%2Caddress&access_token=pk.eyJ1IjoiY2FsbGFuazIxIiwiYSI6ImNsMWJiZnA0cjJyMG0zam4xMTF6MHdndmYifQ.lZAx_bYFPQmZDlkT3b8Daw`;
    var lat;
    var lon;
    fetch(location)
        .then(function (response) {
            response.json()
                .then(function (response) {
                    coordinates = response.features[0].geometry.coordinates;
                    lat = coordinates[0];
                    lon = coordinates[1];
                    setUpMap(lat, lon);

                    getAirQuality(lon, lat);
                })
        })
}

function createHistory(previousSearches) { //this creates the button and applies the previous search result to the button's textContent whenever a result is generated through searchQuery()
    var searchHistory = document.getElementById("searchHistory");
    deleteHistory();
    localStorage.setItem("generalHistory", JSON.stringify(previousSearches));
    if (previousSearches.length < 6) { //generates more buttons if there is less than 6 in the searchHistory div
        for (var i = 0; i < previousSearches.length || 0; i++) {
            var button = document.createElement("button");
            searchHistory.appendChild(button);
            button.textContent = previousSearches[i];
        }
    }
    else if (previousSearches.length >= 6) { // if there are more than 6, this deletes the last button then generates the new resulting buttons
        previousSearches.length = 5;
        for (var i = 0; i < previousSearches.length || 0; i++) {
            var button = document.createElement("button");
            searchHistory.appendChild(button);
            button.textContent = previousSearches[i];
        }
    }
}

function deleteHistory() { //this deletes the history tab whenever a new result is added
    var searchHistory = document.getElementById("searchHistory");
    for (var i = searchHistory.getElementsByTagName('*').length; i > 0; i--) {
        console.log(searchHistory.getElementsByTagName('*').length);
        searchHistory.removeChild(searchHistory.firstChild);
    }
}

function setUpMap(lat, lon) { //this writes the map object to the page
    mapboxgl.accessToken = 'pk.eyJ1IjoiY2FsbGFuazIxIiwiYSI6ImNsMWJiZnA0cjJyMG0zam4xMTF6MHdndmYifQ.lZAx_bYFPQmZDlkT3b8Daw';
    const map = new mapboxgl.Map({
        container: 'map', // container ID
        style: 'mapbox://styles/mapbox/streets-v11', // style URL
        center: [lat, lon], // starting position [lng, lat]
        zoom: 10 // starting zoom  
    });
}

if (polCheck) { //this listens to the first button on the first page and when it is clicked, saves the result to local storage
    polCheck.addEventListener("click", function (event) {
        event.preventDefault();
        var search = document.getElementById("indexCheck").value;

        localStorage.setItem("firstSearch", JSON.stringify(search));
    });
}

if (queryMap) { //this listens to the search button on the second page, and sends the query to the map set up functions, if they put nothing in it defaults to los angeles
    queryMap.addEventListener("click", function (event) {
        event.preventDefault();
        var query = document.getElementById("setMap").value;

        if (query) {
            searchQuery(query);
        }
        else {
            searchQuery("los angeles");
        }
    });
}


searchHistory.addEventListener("click", function (event) { //this listens to the history div for when it its clicked
    searchQuery(event.target.textContent);
})

var firstSearch = JSON.parse(localStorage.getItem("firstSearch")); //this writes the result from the first page into a variable
var historySearch = JSON.parse(localStorage.getItem("generalHistory")) || []; //this stores the search result from the first page into the search history

if (historySearch.length < 6) { //this generates the history underneath the search bar when the screen loads
    for (var i = 0; i < historySearch.length || 0; i++) {
        searchQuery(historySearch[i]);
    }
}
else if (historySearch.length >= 6) {
    historySearch.length = 5;
    for (var i = 0; i < historySearch.length || 0; i++) {
        searchQuery(historySearch[i]);
    }
}

// Start of Air Pollution API

var aqiDef = ["good", "fair", "moderate", "poor", "very poor"]; //air quality definitions to be displayed above the data set

var dataEl = document.querySelector('#test-data'); //all display data from the result to these specific html sections
var componentsEl = dataEl.querySelector('#component-data');

var qualityEl = document.querySelector('#air-quality');
var aqiColor = document.querySelector("#aqi-color");

var airQuality = {};

function getAirQuality(lat, lon) { //takes latitude longitude data and fetches data on that region from OpenWeather API
    var airPollutionUrl = 'https://api.openweathermap.org/data/2.5/air_pollution?lat=' + lat + '&lon=' + lon + '&appid=4ce1081bbd0cd6d45033a1dc8f18bcdf';

    fetch(airPollutionUrl)
        .then(function (response) {
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

function displayData(data) { //writes the data to the html
    if (data.list.length) {
        for (let i = 0; i < data.list.length; i++) {
            airQuality.quality = (aqiDef[data.list[i].main.aqi - 1]);
            airQuality.components = data.list[i].components;

            switch (airQuality.quality) {
                case "good":
                    aqiColor.style.backgroundColor = "green";
                    break;
                case "fair":
                    aqiColor.style.backgroundColor = "yellow";
                    aqiColor.style.color = "black";
                    break;
                case "moderate":
                    aqiColor.style.backgroundColor = "orange";
                    break;
                case "poor":
                    aqiColor.style.backgroundColor = "red";
                    break;
                case "very poor":
                    aqiColor.style.backgroundColor = "purple";
                    break;
            }

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
}

function displayError(error) {
    return error;
}

searchQuery(firstSearch); //this inputs the search result from the first page when the second page loads