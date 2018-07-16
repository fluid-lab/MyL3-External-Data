import { weatherService } from './modules/weatherService.js';
import { locationService } from './modules/locationService.js';

$(document).ready(() => {
    var myL3 = window.myL3 || {};
    // weather data coming from openweathermap will be stored by getData function into it.
    myL3.oneTimeWeatherData;
    // oneTimeWeatherData is useful in avoiding repetitive weather API calls
    // the value of this var is set when we make owm(openweathermap) API call
    // this is happening in weatherService.js file
    // we have placed in aap.js because 
    myL3.mapAvailable = false;
    // mapAvailable is a boolean that will be set true when google map is fetched once
    // Above two variables are preventing repetitive API calls
    // And will be reset again when user leaves the site or reload.

    $('#selectAll').on('click', () => {
        $('#selectAll')[0].checked ? $('#s_all').html('DESELECT ALL') : $('#s_all').html('SELECT ALL');
        const length = $('#weatherFieldsForm')[0].length;
        for(let i=0; i<length; i++) {
            $('#weatherFieldsForm')[0][i].checked = $('#selectAll')[0].checked;
        }
    });

    $("#weatherFieldsForm").on('submit', (e) => {
        $('#city').hide();
        $('#buttons').hide();
        $('#goBack').show();
        if(!myL3.oneTimeWeatherData) {
            $('#spinner').show();
        }

        // The following array will contain "values" of html elements from
        // modal's form for e.g. [1,2,3,4,5] (if user selects first five fields)
        let fieldsSelectedByLearner = [];
        e.preventDefault();     // prevent form submission
        const form = document.getElementById('weatherFieldsForm');
        let formData = new FormData(form);
        
        for( let ent of formData.entries()) {
            fieldsSelectedByLearner.push(ent[1]);
        }

        if(fieldsSelectedByLearner.length==0) {
            alert('Please select atleast one field');
        } else {
            $('#selectFields').modal("hide");
            $('#importWeather').hide();
            $('#editSelectionBtn').show();
            weatherService.getData(fieldsSelectedByLearner);
        }
    });

    $('#editChoices').on('click', () => {
        $('#map').hide();
        $('#city').hide();
        $('#selectFields').modal('show');
    });

    $('#importLocation').on('click', () => {
        locationService.importLocation();
    });

    $('#backBtn').on('click', () => {
        window.location.reload();
    });

    $('#fitnessHistory').on('click', () => {
        window.location.href = "/views/googleFit.html";
    });
});