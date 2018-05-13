$(document).ready((e) => {

    const key = '643a630e1616ba355e88b51064857533';
    // Key should reside on server.

    getData = () => {
        $('#import').hide();
        if (navigator.geolocation) {

            options = {
                enableHighAccuracy: true,
                timeout: 5000,
                maximumAge: 0
            };

            error = (err) => {
                console.log(err);
                $('#err').html(`Cannot retrieve location info, \
                <br>Reason: <strong>${err.message}</strong>`);
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
                    $('#city').html(`Country: ${codesList[weatherData.sys.country]} <br> City: ${weatherData.name} <br><br>`)
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
        else {
            console.log('User\'s browser doesn\'t support geolocation');
        }
    }
});