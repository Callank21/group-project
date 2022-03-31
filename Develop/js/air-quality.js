var aqiDef = ["good", "fair", "moderate", "poor", "very poor"];

var dataEl = document.querySelector('#test-data');
var componentsEl = dataEl.querySelector('#component-data');
var submitButton = document.querySelector('#button');

var airQuality = {};

function buttonSubmitHandler(event) {
    event.preventDefault();
    var lat = 33.94974;
    var lon = -116.955765;

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
    var qualityEl = document.createElement('h2');
    var asciiChar = document.createElement("span");
    var componentEl = document.createElement('li');

    for (let i = 0; i < data.list.length; i++) {
        airQuality.quality = (aqiDef[data.list[i].main.aqi - 1]);
        airQuality.components = data.list[i].components;

        qualityEl.textContent = airQuality.quality;

        componentEl.innerHTML =
            "<li><span> CO:</span> " + airQuality.components.co + "</li>" +
            "<li><span> NO:</span> " + airQuality.components.no + "</li>" +
            "<li><span> NO<sub>2</sub>:</span> " + airQuality.components.no2 + "</li>" +
            "<li><span> O<sub>3</sub>:</span> " + airQuality.components.o3 + "</li>" +
            "<li><span> SO<sub>2</sub>:</span> " + airQuality.components.so2 + "</li>" +
            "<li><span> PM<sub>2.5</sub>:</span> " + airQuality.components.pm2_5 + "</li>" +
            "<li><span> PM<sub>10</sub>:</span> " + airQuality.components.pm10 + "</li>" +
            "<li><span> NH<sub>3</sub>:</span> " + airQuality.components.nh3 + "</li>";

        asciiChar.innerHTML = "<p> Units are in " + String.fromCharCode(181) + "g/m<sup>3</sup>";

        dataEl.prepend(asciiChar);
        dataEl.prepend(qualityEl);
        componentsEl.appendChild(componentEl);
    }
}

function displayError(error) {
    return error;
}

submitButton.addEventListener("click", buttonSubmitHandler);