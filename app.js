import { weatherService } from './modules/weatherService.js';
import { GoogleMap } from './modules/mapService.js'
import { AQI } from './modules/aqiService.js';

$(document).ready(() => {
    var myL3 = window.myL3 || {};
    myL3.oneTimeWeatherData;
    // weather data coming from openweathermap will be stored by getData function into it.
    // oneTimeWeatherData is useful in avoiding repetitive weather API calls
    // the value of this var is set when we make owm(openweathermap) API call
    // this is happening in weatherService.js file
    // we have placed in aap.js because

    $('#selectAll').on('click', () => {
        $('#selectAll')[0].checked ? $('#s_all').html('DESELECT ALL') : $('#s_all').html('SELECT ALL');
        const length = $('#weatherFieldsForm')[0].length;
        for(let i=0; i<length; i++) {
            $('#weatherFieldsForm')[0][i].checked = $('#selectAll')[0].checked;
        }
    });

    $("#weatherFieldsForm").on('submit', (e) => {
        e.preventDefault();     // prevent form submission
        if(!navigator.onLine) {
            alert('Seems you are offline.');
        } else {
            $('.heading_text').hide();
            $('#buttons').hide();
            $('#heading_weather_data').show();
            if(!myL3.oneTimeWeatherData) {
                $('#spinner').show();
            }

            // The following array will contain "values" of html elements from
            // modal's form for e.g. [1,2,3,4,5] (if user selects first five fields)
            let fieldsSelectedByLearner = [];
            
            const formData = $('#weatherFieldsForm').serializeArray();
            for( let ent of formData) {
                fieldsSelectedByLearner.push(ent.value);
            }

            if(fieldsSelectedByLearner.length == 0) {
                alert('Please select atleast one field');
            } else {
                $('#selectFields').modal("hide");
                $('#importWeather').hide();
                $('#mySidenav').show();
                weatherService.getData(fieldsSelectedByLearner);
            }
        }
    });

    $('#edit-weather').on('click', () => {
        $('#selectFields').modal('show');
    });

    $('#edit-fit').on('click', () => {
        $('#fitChoices').modal('show');
    });

    $('#importLocation').on('click', () => {
        $('.heading_text').hide();
        $('#buttons').hide();
        $('#heading_location_data').show();
        $('#spinner').show();
        GoogleMap.showMapAndAddress();
    });

    $('#fitnessHistory').on('click', () => {
        window.location.href = "/views/googleFit.html";
    });

    $('#aqiData').on('click', () => {
        $('#buttons').hide();
        $('.heading_text').hide();
        $('#heading_aqi_data').show();
        $('#spinner').show();
        AQI.getAQI();
    });
});