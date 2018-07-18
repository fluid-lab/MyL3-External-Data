import { weatherService } from './weatherService.js';

export class locationService {
    
    constructor() {};

    static importLocation () {
        if(!navigator.onLine) {
            alert('You are not online.');
        } else {        
            var myL3 = window.myL3 || {};
            $('#weatherTable').hide();
            $('#buttons').hide();
            $('#spinner').show();
            $('#goBack').show();
        
            if(myL3.oneTimePosition) {
                $('#city').html(`Country: ${myL3.countryNames[myL3.oneTimeWeatherData.sys.country]}, City: ${myL3.oneTimeWeatherData.name} <br><br>`);
                $('#city').show(500);
                if(myL3.mapAvailable) {
                    $('#map').show();
                } else {
                    addGoogleMap();
                }
            } else {
                weatherService.getData();
            }
        }
    }
}
