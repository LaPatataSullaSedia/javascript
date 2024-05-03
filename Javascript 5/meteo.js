document.addEventListener('DOMContentLoaded', function() {
    var map = L.map('mapid').setView([45.464211, 9.191383], 13);     
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    var geocoder = L.Control.geocoder({
        defaultMarkGeocode: false
    })
    .on('markgeocode', function(e) {
        var bbox = e.geocode.bbox;
        var poly = L.polygon([
            bbox.getSouthEast(),
            bbox.getNorthEast(),
            bbox.getNorthWest(),
            bbox.getSouthWest(),
        ]);
        map.fitBounds(poly.getBounds());
        
        var name = e.geocode.name;
        fetchWeather(name);
    })
    .addTo(map);
});

function fetchWeather(cityName) {
    const apiKey = 'dfdf96912556daaa648da01aab3ffe24';
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=metric&lang=it`;

    fetch(url)
    .then(response => response.json())
    .then(data => {
        console.log(data)
        if (data.cod === "404") {
            alert("Città non trovata");
            return;
        }
        var label = document.getElementById('miaLabel');
        label.textContent = 'Il meteo di....';
        var tempValue = data['main']['temp'];
        var nameValue = data['name'];
        var descValue = data['weather'][0]['description'];
        var humidityValue = data['main']['humidity'];
        var pressureValue = data['main']['pressure'];
        var windSpeed = data['wind']['speed'];
        var visibilityValue = data['visibility'];
        var sunriseTime = new Date(data['sys']['sunrise'] * 1000);
        var sunsetTime = new Date(data['sys']['sunset'] * 1000);
        var timezoneValue = data['timezone'];

        document.getElementById('name').innerHTML = nameValue;
        document.querySelector('.desc').innerHTML = "Meteo: " + descValue;
        document.querySelector('.temp').innerHTML = "Temperatura percepita: " + tempValue + "°C";
        document.querySelector('.humidity').innerHTML = "Umidità: " + humidityValue + "%";
        document.querySelector('.pressure').innerHTML = "Pressione: " + pressureValue + " hPa";
        document.querySelector('.sunrise').innerHTML = "Alba: " + sunriseTime.toLocaleTimeString();
        document.querySelector('.sunset').innerHTML = "Tramonto: " + sunsetTime.toLocaleTimeString();
        document.querySelector('.wind').innerHTML = "Velocità del vento: " + windSpeed + " m/s";
        document.querySelector('.visibility').innerHTML =  "Visibilità: " + visibilityValue + " metri";
        document.querySelector('.timezone').innerHTML = "Zona oraria: GMT " + (timezoneValue / 3600);

        document.getElementById('weather-image').src = getImageUrl(descValue);
    })
    .catch(err => {
        console.error(err);
        alert("Errore nel caricamento dei dati del meteo");
    });
}

function getImageUrl(weatherDescription) {
    if (weatherDescription.includes("nubi sparse")) {
        return "img/nuvole.png";
    } else if (weatherDescription.includes("pioggia")) {
        return "img/pioggia.png";
    } else if (weatherDescription.includes("soleggiato")) {
        return "img/sole.png";
    } else {
        return "img/meteo.png";
    }
}
