export class weather {
    static fetchWeather(position) {
        console.log('Coordinates: ', position);
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
    
        // Taking API key from user
        const owmKey = prompt("Enter Weather API key:");
        if(owmKey === null || owmKey === '') {
            $('#spinner').hide();
            alert('Please provide API key');
            return;
        }

        return new Promise((resolve, reject) => {
            $.getJSON(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&APPID=${owmKey}`, (weatherData) => {
                resolve(weatherData);
            })
            .fail((err) => {
                reject(err);
            });
        });
    } 
}