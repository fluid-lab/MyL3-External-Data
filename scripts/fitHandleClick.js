import { fitProvider } from '../modules/GoogleFit/fetchFitData.js';

$(document).ready(() => {
    $('#importFit').on('click', () => {
        $('#fitChoices').modal('show');

        $('#fitnessFieldsForm').on('submit', (e) => {
            $('.dataCards > div').hide();
            let fieldsSelectedByLearner = [];
            const fieldsMatchingValues = {
                1: "com.google.height",
                2: "com.google.weight",
                3: "com.google.distance.delta",
                4: "com.google.calories.expended",
                5: "com.google.step_count.delta",
                6: "com.google.heart_rate.bpm",
                7: "com.google.cycling.pedaling.cadence",
                8: "com.google.cycling.wheel_revolution.rpm"
            }
            e.preventDefault();     // prevent default form submissions
            let formData = $('#fitnessFieldsForm').serializeArray();
            
            for( let ent of formData) {
                fieldsSelectedByLearner.push(ent.value);
            }
    
            if(fieldsSelectedByLearner.length==0) {
                alert('Please select atleast one field');
            }

            let links = [];
            for(let i=0; i<fieldsSelectedByLearner.length; i++) {
                links.push(fieldsMatchingValues[fieldsSelectedByLearner[i]]);
            }
            localStorage.setItem('selectedFields', links);
            if (!navigator.onLine) {
                alert('Seems you are offline.');
            } else if(!GoogleAuth) {
                alert('Slow internet please wait....');
                console.log('sadfsa');
                return;
            } else {
                $('#fitChoices').modal("hide");
                $('.heading_text').hide();
                $('#buttons').hide();
                $('#heading_fit_data').show();
                $('#spinner').show();
                fitProvider.fetchGoogleFitData(links);
            }
        });

        $('#allFitnessFields').on('click', () => {
            $('#allFitnessFields')[0].checked ? $('#s_all_fit').html('DESELECT ALL') : $('#s_all_fit').html('SELECT ALL');
            const length = $('#fitnessFieldsForm')[0].length;
            for(let i=0; i<length; i++) {
                $('#fitnessFieldsForm')[0][i].checked = $('#allFitnessFields')[0].checked;
            }
        });
    });

    $('#editChoices-fit').on('click', () => {
        $('#fitChoices').modal('show');
    });
});
