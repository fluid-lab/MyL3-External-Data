// This service is doing following tasks-
// 1. Get location permission and position(coordinates) of learner
// 2. Using latitude and longitude of learner it fetches weather data
//    from openweathermap API.
// 3. Set oneTimeWeatherData and one oneTimePosition that will be used to
//    add data into weather table and googleMap.
import { countryNames } from '../js/countryNames.js';
import { locationService } from './locationService.js';

myL3 = myL3 || {};

export class weatherService {

    constructor() {};

    static getData (fields = []) {

        // Here "fields" array contain the integers which denotes values 
        // of various fields from dialog-box form for e.g. this array will be
        // [1,2,3,4,5] if user clicks on first five checkboxes.
        if($('#tabularData tbody').children().length > 1) {
            $('#weatherTable').hide();
            const children = $('#tabularData tbody').children();
            for(let i=1; i<children.length; i++) {
                $('#tabularData tbody').children()[1].remove();
            }
            this.addDataIntoTable(myL3.oneTimeWeatherData, fields);
            return;
        }
    
        if (navigator.geolocation) {
    
            const options = {
                enableHighAccuracy: true,
                timeout: Infinity,
                maximumAge: 0
            };
    
            const error = (err) => {
                console.log(err);
                $('#err').html(`Cannot retrieve location info, \
                <br>Reason: <strong>${err.message}</strong>`);
                if(!navigator.onLine) {
                    alert('Internet connection not avaiable');
                }
            }
    
            const getWeatherData = (position) => {
                myL3.oneTimePosition = position;
                console.log('Coordinates: ', position);
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
    
                const openweathermapKey = prompt("Enter Weather API key:");
                if(openweathermapKey === null || openweathermapKey === '') {
                    $('#spinner').hide();
                    alert('Please provide API key');
                    return;
                }
                $.getJSON(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&APPID=${openweathermapKey}`, (weatherData) => {
                    console.log('Weather JSON', weatherData);
                    myL3.oneTimeWeatherData = weatherData;
                    $('#spinner').hide();
    
                    if(fields.length) {     // this means we need weather data not location data
                        $('#map').hide();
                        this.addDataIntoTable(weatherData, fields);
                        $('#tabularData').show();
                    } else {    // Display country, city and map with marker
                        if(myL3.mapAvailable) {
                            $('#map').show();
                        } else {
                            addGoogleMap();
                        }
                        $('#city').html(`Country: ${countryNames[weatherData.sys.country]}, City: ${weatherData.name} <br><br>`);
                    }
                })
                .fail((err) => {
                    $('#spinner').hide();
                    $('#err').html('<strong>Error:</strong> <br>' + JSON.parse(err.responseText).cod +
                        ': ' + JSON.parse(err.responseText).message);
                    console.log(JSON.parse(err.responseText));
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

    static addDataIntoTable (weatherData, fields) {
        let values = [];    // Will contain values of fields selected by learner.
        // Pushing values into values Array using fields array
        for(let i=0; i<fields.length; i++) {
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
    
        const weatherTableLabels = [   // Parameters in table.
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
    
        // adding all the data received from weather JSON from API
        // in the values array into the table as a row 
        // having two <tr>. Here values array will contain only
        // the fields selected by user in dialog-box.
        for(let i=0; i<values.length; i++) {
            $('#tabularData > tbody > tr:last').after("<tr><td>" + weatherTableLabels[parseInt(fields[i])-1] + 
            "</td><td>" + values[i] + "</td></tr>");
        }
        $('#weatherTable').show();
        // source code to retrieve weather icon
        // const src = `https://openweathermap.org/img/w/${weatherData.weather[0].icon}.png`;
        
        // $('#tabularData> tbody > tr:last').after("<tr><td>Weather Icon</td><td><img src="+
        // src + " /></td></tr>");
    }
}
