export class AirQualityService {

    static aqiValue() {
        const options = {
            enableHighAccuracy: true,
            timeout: Infinity,
            maximumAge: 0
        };
        const error = (err) => {
            console.log(err);
        }
        const handleLocationData = (position) => {
            console.log(position);
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            let airVisualKey;
            if(window.myL3.apiKeys.airVisualKey) {
                airVisualKey = window.myL3.apiKeys.airVisualKey
            } else {
                airVisualKey = prompt('Please enter Air Visual API key');
            }
            $.getJSON(`https://api.airvisual.com/v2/nearest_city?lat=${lat}&lon=${lon}&key=${airVisualKey}`, (aqiData) => {
                console.log(aqiData);
                window.aqi = aqiData.data.current.pollution.aqius;
            })
            .fail((err) => {
                console.log('AQI not available for this area.', err);
                window.aqi = 'not found';
            });
        }
        navigator.geolocation.getCurrentPosition(handleLocationData, error, options);
    }
}

/*
$(document).ready(() => {
    $('#importAQ').on('click', () => {
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
        const handleLocationData = (position) => {
            console.log(position);
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            $('.heading_text').hide();
            $('#buttons').hide();
            $('#airQualityData').css('display', 'flex');
            $.getJSON(`https://api.openaq.org/v1/latest?coordinates=${lat},${lon}`, (aqiData) => {
                console.log(aqiData);
                $('.location').html(aqiData.results[0].location);
                $('.city').html(aqiData.results[0].city);
                $('.pm25').html(aqiData.results[0].measurements[0].value);
            })
            .fail((err) => {
                alert('AQI not available for this area.');
                window.location.reload();
            });
        }
        navigator.geolocation.getCurrentPosition(handleLocationData, error, options);
    });
})
*/
