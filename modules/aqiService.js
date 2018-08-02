// getAQI fetches AQI data from air visual

import { weatherService } from '../modules/weatherService.js';

export class AQI {
    constructor() {}

    static getAQI() {
        weatherService.getLocation()
            .then((pos) => {
                const position = pos;
                let airVisualKey;
                if(window.myL3.apiKeys.airVisualKey) {
                    airVisualKey = window.myL3.apiKeys.airVisualKey;
                } else {
                    airVisualKey = prompt('Please enter Air Visual API key');
                }
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                $.getJSON(`https://api.airvisual.com/v2/nearest_city?lat=${lat}&lon=${lon}&key=${airVisualKey}`, (aqiData) => {
                    console.log(aqiData);
                    const aqi = aqiData.data.current.pollution.aqius;
                    const date = new Date().toLocaleDateString();
                    let aqiHistory = {};
                    if(localStorage.aqi) {
                        aqiHistory = JSON.parse(localStorage.aqiHistory);
                    }
                    aqiHistory[date] = aqi;
                    localStorage.aqiHistory = JSON.stringify(aqiHistory);
                    $('#aqiVal').html(aqi);
                    $('#city-aqi').html(`${aqiData.data.city}`);
                    $('#status').html(this.aqiStatus(aqi));
                    $('#spinner').hide();
                    $('.container-aqi').css('display', 'flex');
                });
            })
            .catch((err) => {
                $('#spinner').hide();
            })
    }

    static aqiStatus(aqi) {
        if(aqi<51) {
            $('#aqiVal, #status').css('color', '#009966');
            $('#health-implications').html('Air quality is considered satisfactory, and air pollution poses little or no risk.');
            $('#caution-pm25').html('None.');
            return "Good";
        }
        else if(aqi<101) {
            $('#aqiVal, #status').css('color', '#ffde33');
            $('#health-implications').html('Air quality is acceptable; however, for some pollutants there may be a moderate health concern for a very small number of people who are unusually sensitive to air pollution.');
            $('#caution-pm25').html('Active children and adults, and people with respiratory disease, such as asthma, should limit prolonged outdoor exertion.');
            return "Moderate";
        }
        else if(aqi<151) {
            $('#aqiVal, #status').css('color', '#ff9933');
            $('#health-implications').html('Members of sensitive groups may experience health effects. The general public is not likely to be affected.');
            $('#caution-pm25').html('Active children and adults, and people with respiratory disease, such as asthma, should limit prolonged outdoor exertion.');
            return "Unhealthy for Sensitive Groups";
        }
        else if(aqi<201) {
            $('#aqiVal, #status').css('color', '#cc0033');
            $('#health-implications').html('Everyone may begin to experience health effects; members of sensitive groups may experience more serious health effects.');
            $('#caution-pm25').html('Active children and adults, and people with respiratory disease, such as asthma, should avoid prolonged outdoor exertion. Everyone else, especially children, should limit prolonged outdoor exertion.');
            return "Unhealthy";
        }
        else if(aqi<301) {
            $('#aqiVal, #status').css('color', '#660099');
            $('#health-implications').html('Health warnings of emergency conditions. The entire population is more likely to be affected.');
            $('#caution-pm25').html('Active children and adults, and people with respiratory disease, such as asthma, should avoid all outdoor exertion; everyone else, especially children, should limit outdoor exertion.');
            return "Very Unhealthy";
        }
        else if(aqi>300) {
            $('#aqiVal, #status').css('color', '#7e0023');
            $('#health-implications').html('Health alert, everyone may experience more serious health effects.');
            $('#caution-pm25').html('Everyone should avoid all outdoor exertion.');
            return "Hazardous";
        }
    }
}