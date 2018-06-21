fluid.registerNamespace("myL3");

fluid.defaults("myL3.weatherService", {
    gradeNames: "fluid.component",
    invokers: {
        addDataIntoTable: {
            funcName: "myL3.weatherService.addDataIntoTable",
            args: ["{arguments}.0", "{arguments}.1"]
        }
    }
});

myL3.weatherService.addDataIntoTable = function (weatherData, fields) {
    // Pushing values into values Array using fields array
    for(let i=0; i<fields.length; i++) {
        switch(fields[i]) {
            case "1":
                myL3.values.push(parseFloat((weatherData.main.temp - 273.15)*1.8 + 32).toFixed(2) +' &deg;F');
                break;
            case "2":
                myL3.values.push(weatherData.main.temp - 273.15 + ' &deg;C');
                break;
            case "3":
                myL3.values.push(weatherData.main.pressure + ' hPa');
                break;
            case "4":
                myL3.values.push(weatherData.main.humidity + ' %');
                break;
            case "5":
                myL3.values.push(parseFloat(weatherData.wind.speed * 1.61).toFixed(2) + ' km/h');
                break;
            case "6":
                myL3.values.push(parseFloat(weatherData.wind.speed * 0.44704).toFixed(2) + ' m/s');
                break;
            case "7":
                myL3.values.push(weatherData.wind.deg + '&deg;');
                break;
            case "8":
                myL3.values.push(new Date(weatherData.sys.sunrise).toTimeString());
                break;
            case "9":
                myL3.values.push(new Date(weatherData.sys.sunset).toTimeString());
                break;
            case "10":
                myL3.values.push((weatherData.weather[0].description).toUpperCase());
                break;
            case "11":
                myL3.values.push(weatherData.visibility + ' m');
                break;
        }
    }

    // adding all the data received from weather JSON from API
    // in the values array into the table as a row 
    // having two <tr>. Here values array will contain only
    // the field selected by user in modal.
    for(let i=0; i<myL3.values.length; i++) {
        $('#tabularData> tbody > tr:last').after("<tr><td>" + myL3.TABLE_PARAMS[parseInt(fields[i])-1] + 
        "</td><td>" + myL3.values[i] + "</td></tr>");
    }
    $('#weatherTable').show();
    // source code to retrieve weather icon
    // const src = `https://openweathermap.org/img/w/${weatherData.weather[0].icon}.png`;
    
    // $('#tabularData> tbody > tr:last').after("<tr><td>Weather Icon</td><td><img src="+
    // src + " /></td></tr>");
}