import { weatherService } from './modules/weatherService.js';
import { locationService } from './modules/locationService.js';

$(document).ready(() => {
    var myL3 = myL3 || {};
    myL3.oneTimeWeatherData, myL3.oneTimePosition; // to avoid repetitive API calls.
    myL3.mapAvailable = false;  // helps in showing the map quickly.

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
});