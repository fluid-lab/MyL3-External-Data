$(document).ready((e) => {
    $('#spinner').hide();
    
    const key = myL3.apiKeys.openweathermapKey;

    var tableParams = [
        'Temprature (K)',
        'Pressure (hPa)',
        'Humidity (in %)',
        'Wind Speed (mph)',
        'Wind Direction (degrees)',
        'Sunrise',
        'Sunset',
        'Visibility Range(meter)',
        "Weather Description"
    ];

    let values = [];

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
                if(!navigator.onLine) {
                    alert('Internet connection not avaiable');
                }
            }

            getWeatherData = (position) => {
                console.log('Coordinates: ', position);
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                const location = JSON.stringify(position.coords);

                $('#coords').html(`<h3>Location data</h3>Latitude: ${lat} <br> Longitude: ${lon}`);

                $('#spinner').show();
                $.getJSON(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&APPID=${key}`, (weatherData) => {
                    console.log('Weather JSON', weatherData);
                    $('#spinner').hide();
                    $('#city').html(`Country: ${myL3.countryNames[weatherData.sys.country]} <br> City: ${weatherData.name} <br><br>`);

                    addDataIntoTable(weatherData);
                    $('#tabularData').show();
                })
                .fail(() => {
                    console.log('Weather data not available for this region.');
                });

                // we can also get weather forecast of next 5 days using following link:
                // https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&APPID=${key}
            }

            addDataIntoTable = (weatherData) => {
                // Pushing data into values Array
                values.push(weatherData.main.temp);
                values.push(weatherData.main.pressure);
                values.push(weatherData.main.humidity);
                values.push(weatherData.wind.speed);
                values.push(weatherData.wind.deg);
                values.push(new Date(weatherData.sys.sunrise).toTimeString());
                values.push(new Date(weatherData.sys.sunset).toTimeString());
                values.push(weatherData.visibility);
                values.push(weatherData.weather[0].description);

                for(var i=0; i<values.length; i++) {
                    $('#tabularData> tbody > tr:last').after("<tr><td>" + tableParams[i] + 
                    "</td><td>" + values[i] + "</td></tr>");
                }
                var src = `https://openweathermap.org/img/w/${weatherData.weather[0].icon}.png`;
                
                $('#tabularData> tbody > tr:last').after("<tr><td>Weather Icon</td><td><img src="+
                src + " /></td></tr>");
            }

            navigator.geolocation.getCurrentPosition(getWeatherData, error, options);
        }
        else {
            console.log('User\'s browser doesn\'t support geolocation');
        }
    }
});