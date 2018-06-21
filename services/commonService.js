fluid.registerNamespace("myL3");

fluid.defaults("myL3.commonService", {
    gradeNames: "fluid.component",
    invokers: {
        getData: {
            funcName: "myL3.commonService.getData",
            args: ["{arguments}.0"]
        }
    }
});

myL3.commonService.getData = (fields) => {

        if($('#tabularData tbody').children().length > 1) {
            $('#weatherTable').hide();
            const children = $('#tabularData tbody').children();
            for(let i=1; i<children.length; i++) {
                $('#tabularData tbody').children()[1].remove();
            }
            myL3.values = [];
            myL3.weatherService.addDataIntoTable(myL3.oneTimeWeatherData, fields);
            return;
        }

        if (navigator.geolocation) {

            options = {
                enableHighAccuracy: true,
                timeout: Infinity,
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
                myL3.oneTimePosition = position;
                console.log('Coordinates: ', position);
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;

                $.getJSON(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&APPID=${myL3.apiKeys.openweathermapKey}`, (weatherData) => {
                    console.log('Weather JSON', weatherData);
                    myL3.oneTimeWeatherData = weatherData;
                    $('#spinner').hide();

                    if(fields.length) {
                        $('#map').hide();
                        myL3.weatherService.addDataIntoTable(weatherData, fields);
                        $('#tabularData').show();
                    } else {
                        $('#city').html(`Country: ${myL3.countryNames[weatherData.sys.country]}, City: ${weatherData.name} <br><br>`);
                        if(myL3.mapAvailable) {
                            $('#map').show();
                        } else {
                            myL3.locationService.addGoogleMap();
                        }
                    }
                    myL3.isLocationAvailable = true;
                })
                .fail(() => {
                    console.log('Weather data not available for this region.');
                });
                
                // we can also get weather forecast of next 5 days using following link:
                // https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&APPID=${openweathermapKey}
            }

            navigator.geolocation.getCurrentPosition(getWeatherData, error, options);
            console.log(myL3);
        }
        else {
            console.log('User\'s browser doesn\'t support geolocation');
        }
    }