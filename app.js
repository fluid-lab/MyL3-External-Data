$(document).ready(() => {
    (function ($) {

        fluid.registerNamespace("myL3");
        
        myL3.TABLE_PARAMS = [   // Parameters in table.
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
        myL3.values = [];        // Stores all the fields selected by user from modal.
        myL3.oneTimeWeatherData, myL3.oneTimePosition; // to avoid repetitive API calls.
        myL3.isLocationAvailable = false, myL3.mapAvailable = false;  // helps in showing map and weather table quickly

        $('#selectAll').on('click', () => {
            $('#selectAll')[0].checked ? $('#s_all').html('DESELECT ALL') : $('#s_all').html('SELECT ALL');
            const length = $('#weatherFieldsForm')[0].length;
            for(let i=0; i<length; i++) {
                $('#weatherFieldsForm')[0][i].checked = $('#selectAll')[0].checked;
            }
        })

        $("#weatherFieldsForm").on('submit', (e) => {
            $('#city').hide();
            $('#buttons').hide();
            $('#goBack').show();
            if(!myL3.oneTimeWeatherData) {
                $('#spinner').show();
            }
            let fieldsSelectedByLearner = [];
            // prevent form submission
            e.preventDefault();
            const form = document.getElementById('weatherFieldsForm');
            formData = new FormData(form);
            
            for( let ent of formData.entries()) {
                fieldsSelectedByLearner.push(ent[1]);
            }

            if(fieldsSelectedByLearner.length==0) {
                alert('Please select atleast one field');
            } else {
                $('#selectFields').modal("hide");
                $('#importWeather').hide();
                $('#editSelectionBtn').show();
                myL3.commonService.getData(fieldsSelectedByLearner);
            }
        });

        $('#editChoices').on('click', () => {
            $('#map').hide();
            $('#city').hide();
            $('#selectFields').modal('show');
        });

        $('#backBtn').on('click', () => {
            this.location.reload();
        });
    })(jQuery);
});
