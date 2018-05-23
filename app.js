$(document).ready((e) => {

    const key = myL3.apiKeys.openweathermapKey;

    getData = () => {
        $('#import').hide();
        if (navigator.geolocation) {

            options = {
                enableHighAccuracy: true,
                timeout: 30000,
                maximumAge: 0
            };

            error = (err) => {
                console.log(err);
                $('#err').html(`Cannot retrieve location info, \
                <br>Reason: <strong>${err.message}</strong>`);
                if(!navigator.onLine)
                    alert('Internet connection not avaiable');
            }

            getWeatherData = (position) => {
                console.log('Coordinates: ', position);
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                const location = JSON.stringify(position.coords);

                $('#coords').html(`<h3>Location data</h3>Latitude: ${lat} <br> Longitude: ${lon}`);

                $.getJSON(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&APPID=${key}`, (weatherData) => {
                    console.log('Weather JSON', weatherData);
                    const wJSON = JSON.stringify(weatherData);
                    $('#city').html(`Country: ${myL3.countryNames[weatherData.sys.country]} <br> City: ${weatherData.name} <br><br>`)
                    $('#wData').html(`<h3>Weather Data:</h3><p> ${wJSON}</p>`);
                })
                .fail(() => {
                    console.log('Weather data not available for this region.');
                });

                // we can also get weather forecast for next 5 days using following link:
                // http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&APPID=${key}
            }

            navigator.geolocation.getCurrentPosition(getWeatherData, error, options);
        }
        else
            console.log('User\'s browser doesn\'t support geolocation');
    }
});