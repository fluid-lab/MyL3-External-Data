// uses data stored in localstorage to plot AQI history graph.
import { WeatherHistory } from './weatherHistory.js';

export class AQIHistory {
    static plotAQIHistory() {
        if(localStorage.aqiHistory) {
            let dailyAQIs = [];
            let datesArray = [];
            const aqiData = JSON.parse(localStorage.aqiHistory);
            for(let val in aqiData) {
                datesArray.push(val);
                dailyAQIs.push(aqiData[val]);
            }
            WeatherHistory.createGraph(dailyAQIs, datesArray, "Air Quality Index");
        }
    }
}
