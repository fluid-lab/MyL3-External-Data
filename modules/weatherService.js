import { weather } from './weather.js';
import { appendIntoTable } from './appendIntoTable.js';

var myL3 = myL3 || {};

export class weatherService {

    constructor() {};

    static getData (fields) {  // static functions can be called without creating instance of class

        // Here "fields" array contain the integers which denotes values 
        // of various fields from dialog-box form for e.g. this array will be
        // [1,2,3,4,5] if user clicks on first five checkboxes.
        if($('#tabularData tbody').children().length > 1) {
            $('#weatherTable').hide();
            // Following steps remove elements currently present in the table.
            const children = $('#tabularData tbody').children();
            for(let i=1; i<children.length; i++) {
                $('#tabularData tbody').children()[1].remove();
            }
            appendIntoTable.addDataIntoTable(myL3.oneTimeWeatherData, fields);
            $('#weatherTable').show(1000);
            $('#spinner').hide();
            return;
        }

        this.getLocation()
            .then((position) => {
                // fetchWeather function returns a PROMISE
                weather.fetchWeather(position)
                    .then((weatherData) => {
                        if(weatherData !== 'error') {
                            console.log('Weather JSON', weatherData);
                            myL3.oneTimeWeatherData = weatherData;
                            appendIntoTable.addDataIntoTable(weatherData, fields);
                            $('#spinner').hide();
                            $('#weatherTable').show(1000);
                        }
                    })
                    .catch((err) => {                      
                        $('#spinner').hide();
                        $('#err').html('<strong>Error:</strong> <br>' + JSON.parse(err.responseText).cod +
                            ': ' + JSON.parse(err.responseText).message);
                        console.log(JSON.parse(err.responseText));
                    });
            })
    }

    static getLocation() {
        if(navigator.geolocation) {
    
            const options = {
                enableHighAccuracy: true,
                timeout: Infinity,
                maximumAge: 0
            };
            
            return new Promise((resolve, reject) => {
                navigator.geolocation.getCurrentPosition((position) => {
                    console.log(position);
                    resolve(position);
                }, (err) => {
                    console.log(err);
                    $('#err').html(`Cannot retrieve location info, \
                    <br>Reason: <strong>${err.message}</strong>`);
                    if(!navigator.onLine) {
                        alert('Internet connection not avaiable');
                    }
                    reject(err);
                }, options);
            });
        }
    }
}
