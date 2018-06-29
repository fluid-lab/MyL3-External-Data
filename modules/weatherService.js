// This service is doing following tasks-
// 1. Get location permission and position(coordinates) of learner
// 2. Using latitude and longitude of learner, it fetches weather data
//    from openweathermap API.
// 3. Set oneTimeWeatherData and one oneTimePosition that will be used to
//    add data into weather table and googleMap.
import { countryNames } from '../js/countryNames.js';
import { weather } from './weather.js';
import { appendIntoTable } from './appendIntoTable.js';

myL3 = myL3 || {};

export class weatherService {

    constructor() {};

    static getData (fields = []) {  // static functions can be called without creating instance of class

        // Here "fields" array contain the integers which denotes values 
        // of various fields from dialog-box form for e.g. this array will be
        // [1,2,3,4,5] if user clicks on first five checkboxes.
        if($('#tabularData tbody').children().length > 1) {
            $('#weatherTable').hide();
            const children = $('#tabularData tbody').children();
            for(let i=1; i<children.length; i++) {
                $('#tabularData tbody').children()[1].remove();
            }
            appendIntoTable.addDataIntoTable(myL3.oneTimeWeatherData, fields);
            $('#spinner').hide();
            return;
        }
    
        if(navigator.geolocation) {
    
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

                // fetchWeather function returns a Promise
                weather.fetchWeather(position)
                    .then((weatherData) => {
                        if(weatherData !== 'error') {
                            console.log('Weather JSON', weatherData);
                            myL3.oneTimeWeatherData = weatherData;
                            $('#spinner').hide();
            
                            if(fields.length) {     // this means we need weather data not location data
                                $('#map').hide();
                                appendIntoTable.addDataIntoTable(weatherData, fields);
                                $('#tabularData').show();
                            } else {    // Display country, city and map with marker
                                if(myL3.mapAvailable) {
                                    $('#map').show();
                                } else {
                                    addGoogleMap();
                                }
                                $('#city').html(`Country: ${countryNames[weatherData.sys.country]},
                                    City: ${weatherData.name} <br><br>`);
                            }
                        }
                    })
                    .catch((err) => {                      
                        $('#spinner').hide();
                        $('#err').html('<strong>Error:</strong> <br>' + JSON.parse(err.responseText).cod +
                            ': ' + JSON.parse(err.responseText).message);
                        console.log(JSON.parse(err.responseText));
                    });
            }
    
            navigator.geolocation.getCurrentPosition(getWeatherData, error, options);
        }
        else {
            console.log('User\'s browser doesn\'t support geolocation');
        }
    }
}
