// This file defines plotWeatherHistory() function to plot weather histories
// After completion, it calls AQIHistory.plotAQIHistory() to plot AQI history

import { AQIHistory } from './aqiHistory.js';

export class WeatherHistory {
    
    constructor() {};

    static plotWeatherHistory() {
        if(localStorage.weatherData) {
            let datesArray = [];
            let temperature = [];
            let windSpeed = [];
            let humidity = [];
            let visibility = [];
            const weatherData = JSON.parse(localStorage.weatherData);
            for(let val in weatherData) {
                datesArray.push(val);
                const data = JSON.parse(weatherData[val]);
                temperature.push(data.main.temp);
                windSpeed.push(data.wind.speed);
                humidity.push(data.main.humidity);
                visibility.push(data.visibility);
            }
            this.createGraph(temperature, datesArray, "Temprature(K)")
                .then(() => {
                    this.createGraph(windSpeed, datesArray, "Wind Speed(m/s)");
                })
                .then(() => {
                    this.createGraph(humidity, datesArray, "humidity(hPa)");
                })
                .then(() => {
                    this.createGraph(visibility, datesArray, "visibility(m)");
                })
                .then(() => {
                    AQIHistory.plotAQIHistory();
                })
        }
    }

    static createGraph(nDayData, dateArray, label) {
        const backgroundColors = [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(75, 192, 192, 0.2)'
        ];
        const borderColors = [
            'rgba(255,99,132,1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(75, 192, 192, 1)'
        ];
        const random = Math.floor(Math.random()*5);
        const chart = jQuery('<canvas/>', {
            class: 'myChart'
        });
        const graph = jQuery('<div/>', {
            class: 'graph shadow'
        });
        chart.appendTo(graph);
        graph.appendTo('.graphContainer');
        var myChart = new Chart(chart, {
            type: $('input[name="graphType"]:checked').val(),
            data: {
                labels: dateArray,
                datasets: [{
                    label: label,
                    data: nDayData,
                    backgroundColor: backgroundColors[random],
                    borderColor: borderColors[random],
                    borderWidth: 2
                }]
            },
            options: {
                scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero:true
                    },
                    scaleLabel: {
                    display: true,
                    labelString: label
                    },
                    scaleFontColor: "#000",
                }]
                },
                responsive: true
            }
        });
        return Promise.resolve();
    }
}
