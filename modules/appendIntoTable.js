export class appendIntoTable {

    static addDataIntoTable (weatherData, fields) {
        let values = [];    // Will contain values of fields selected by learner.
        // Pushing values into values Array using fields array
        for(let i=0; i<fields.length; i++) {
            switch(fields[i]) {
                case "1":
                    values.push(parseFloat((weatherData.main.temp - 273.15)*1.8 + 32).toFixed(2) +' &deg;F');
                    break;
                case "2":
                    values.push(weatherData.main.temp - 273.15 + ' &deg;C');
                    break;
                case "3":
                    values.push(weatherData.main.pressure + ' hPa');
                    break;
                case "4":
                    values.push(weatherData.main.humidity + ' %');
                    break;
                case "5":
                    values.push(parseFloat(weatherData.wind.speed * 1.61).toFixed(2) + ' km/h');
                    break;
                case "6":
                    values.push(parseFloat(weatherData.wind.speed * 0.44704).toFixed(2) + ' m/s');
                    break;
                case "7":
                    values.push(weatherData.wind.deg + '&deg;');
                    break;
                case "8":
                    values.push(new Date(weatherData.sys.sunrise).toTimeString());
                    break;
                case "9":
                    values.push(new Date(weatherData.sys.sunset).toTimeString());
                    break;
                case "10":
                    values.push((weatherData.weather[0].description).toUpperCase());
                    break;
                case "11":
                    values.push(weatherData.visibility + ' m');
                    break;
            }
        }
    
        const weatherTableLabels = [   // Parameters in table.
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
    
        // adding all the data received from weather JSON from API
        // in the values array into the table as a row 
        // having two <tr>. Here values array will contain only
        // the fields selected by user in dialog-box.
        for(let i=0; i<values.length; i++) {
            $('#tabularData > tbody > tr:last').after("<tr><td>" + weatherTableLabels[parseInt(fields[i])-1] + 
            "</td><td>" + values[i] + "</td></tr>");
        }
        $('#weatherTable').show(1000);
        // source code to retrieve weather icon
        // const src = `https://openweathermap.org/img/w/${weatherData.weather[0].icon}.png`;
        
        // $('#tabularData> tbody > tr:last').after("<tr><td>Weather Icon</td><td><img src="+
        // src + " /></td></tr>");
    }
    
}