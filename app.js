$(document).ready((e) => {
    
    const openweathermapKey = myL3.apiKeys.openweathermapKey;
    const googleMapKey = myL3.apiKeys.googleMapKey;
    const tableParams = [
        'Temprature (F)',
        'Temprature (C)',
        'Atmospheric Pressure',
        'Humidity',
        'Wind Speed (kmph)',
        'Wind Speed (m/s)',
        'Wind Direction',
        'Sunrise',
        'Sunset',
        "Weather Description",
        'Visibility Range'
    ];

    let values = [];
    let oneTimeWeatherData, oneTimePosition; // to avoid repetitive API calls.
    let isLocationAvailable=false, mapAvailable=false;

    $('#editSelectionBtn').hide();

    getData = (fields) => {

        if($('#tabularData tbody').children().length > 1) {
            $('#weatherTable').hide();
            var children = $('#tabularData tbody').children();
            for(var i=1; i<children.length; i++) {
                $('#tabularData tbody').children()[1].remove();
            }
            $('#weatherTable').show();
            values = [];
            addDataIntoTable(oneTimeWeatherData, fields);
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
                oneTimePosition = position;
                console.log('Coordinates: ', position);
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                const location = JSON.stringify(position.coords);

                $('#spinner').show();
                $.getJSON(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&APPID=${openweathermapKey}`, (weatherData) => {
                    console.log('Weather JSON', weatherData);
                    oneTimeWeatherData = weatherData;
                    $('#spinner').hide();

                    if(fields.length) {
                        $('#map').hide();
                        addDataIntoTable(weatherData, fields);
                        $('#tabularData').show();
                    } else {
                        $('#city').html(`Country: ${myL3.countryNames[weatherData.sys.country]}, City: ${weatherData.name} <br><br>`);
                        if(mapAvailable) {
                            $('#map').show();
                        } else {
                            addGoogleMap();
                        }
                    }
                    isLocationAvailable = true;
                })
                .fail(() => {
                    console.log('Weather data not available for this region.');
                });
                
                // we can also get weather forecast of next 5 days using following link:
                // https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&APPID=${openweathermapKey}
            }

            navigator.geolocation.getCurrentPosition(getWeatherData, error, options);
        }
        else {
            console.log('User\'s browser doesn\'t support geolocation');
        }
    }

    $('#selectAll').on('click', () => {
        var length = $('#weatherFieldsForm')[0].length;
        for(var i=0; i<length; i++) {
            $('#weatherFieldsForm')[0][i].checked = $('#selectAll')[0].checked;
        }
    })

    function addDataIntoTable (weatherData, fields) {
        // Pushing indexes into values Array
        for(var i=0; i<fields.length; i++) {
            switch(fields[i]) {
                case "1":
                    values.push(parseFloat((weatherData.main.temp - 273.15)*1.8 + 32).toFixed(2) +' &deg;F');
                    break;
                case "2":
                    values.push(weatherData.main.temp - 273.15 + ' &deg;C');
                    break;
                case "3":
                    values.push(weatherData.main.pressure + ' hPa');
                    break;
                case "4":
                    values.push(weatherData.main.humidity + ' %');
                    break;
                case "5":
                    values.push(parseFloat(weatherData.wind.speed * 1.61).toFixed(2) + ' km/h');
                    break;
                case "6":
                    values.push(parseFloat(weatherData.wind.speed * 0.44704).toFixed(2) + ' m/s');
                    break;
                case "7":
                    values.push(weatherData.wind.deg + '&deg;');
                    break;
                case "8":
                    values.push(new Date(weatherData.sys.sunrise).toTimeString());
                    break;
                case "9":
                    values.push(new Date(weatherData.sys.sunset).toTimeString());
                    break;
                case "10":
                    values.push((weatherData.weather[0].description).toUpperCase());
                    break;
                case "11":
                    values.push(weatherData.visibility + ' m');
                    break;
            }
        }

        for(var i=0; i<values.length; i++) {
            $('#tabularData> tbody > tr:last').after("<tr><td>" + tableParams[parseInt(fields[i])-1] + 
            "</td><td>" + values[i] + "</td></tr>");
        }
        $('#weatherTable').show();
        // source code to retrieve weather icon
        // var src = `https://openweathermap.org/img/w/${weatherData.weather[0].icon}.png`;
        
        // $('#tabularData> tbody > tr:last').after("<tr><td>Weather Icon</td><td><img src="+
        // src + " /></td></tr>");
    }

    $("#weatherFieldsForm").on('submit', (e) => {
        $('#city').hide();
        var fieldsSelectedByLearner = [];
        // prevent form submission
        e.preventDefault();
        var form = document.getElementById('weatherFieldsForm');
        formData = new FormData(form);
        
        for( var ent of formData.entries()) {
            fieldsSelectedByLearner.push(ent[1]);
        }

        if(fieldsSelectedByLearner.length==0) {
            alert('Please select atleast one field');
        } else {
            $('#selectFields').modal("hide");
            $('#importWeather').hide();
            $('#editSelectionBtn').show();
            getData(fieldsSelectedByLearner);
        }
    });

    $('#editChoices').on('click', () => {
        $('#map').hide();
        $('#city').hide();
        $('#selectFields').modal('show');
    });

    locationImport = () => {
        $('#weatherTable').hide();

        if(isLocationAvailable) {
            const lat = oneTimePosition.coords.latitude;
            const lon = oneTimePosition.coords.longitude;
            $('#city').html(`Country: ${myL3.countryNames[oneTimeWeatherData.sys.country]}, City: ${oneTimeWeatherData.name} <br><br>`);
            $('#city').show();
            if(mapAvailable) {
                $('#map').show();
            } else {
                addGoogleMap();
            }
        } else {
            var fakeArray = [];
            getData(fakeArray);
        }
    }

    addGoogleMap = () => {
        
        // callback function used by google maps.
        myMap = () => {
            var myLatLng = { 
                lat: oneTimePosition.coords.latitude,
                lng: oneTimePosition.coords.longitude
            };

            let map = new google.maps.Map(document.getElementById("map"), {
                center: myLatLng,
                zoom: 15,
                mapTypeId: google.maps.MapTypeId.HYBRID
            });

            let marker = new google.maps.Marker({
                map: map,
                position: myLatLng,
                title: 'Location provided by you device'
            });
        }

        // Adding google maps using lat and lon
        let script = document.createElement('script');
        script.async = true;
        script.defer = true;
        script.src = `https://maps.googleapis.com/maps/api/js?key=${googleMapKey}&callback=myMap`;
        $('body').append(script);
        $('#map').show();
        mapAvailable = true;
        // google maps added.
    }
});
