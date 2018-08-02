// this file fetches and shows fitness history in the
// Quick Notes Playground. We have used localstorage to access chosen
// fitness fields to be fetched(all these field were set into localstorage
// when learner selected fields from modal form present day fitness data)

// Whole process was divided into functions to retrieve data. The flow
// of program is from top to bottom and function by function.

// After completing the task of plotting graphs, 
// WeatherHistory.plotWeatherHistory() is called to plot weather history.
import { WeatherHistory } from "../weatherHistory.js";
window.onload = () => {

    let counter = 0;
    let token;
    let formObject = {};
    const HTMLText = {
      "com.google.height" : "height(cm)",
      "com.google.weight": "weight(Kg)",
      "com.google.distance.delta": "distance(m)",
      "com.google.calories.expended": "calories spent",
      "com.google.step_count.delta": "steps count",
      "com.google.heart_rate.bpm": "pulse rate(bpm)",
      "com.google.cycling.pedaling.cadence": "pedaling speed",
      "com.google.cycling.wheel_revolution.rpm": "wheel speed(rpm)"
    };
    const maxDate = new Date().toISOString().split('T')[0];
    $('input[name="to"]').attr('max', maxDate); // setting maxdate property in end date (HTML file)

    if(!localStorage.selectedFields) {
      localStorage.selectedFields = Object.keys(HTMLText);
    }
    const dataTypes = window.localStorage.getItem('selectedFields').split(',');

    if(localStorage.formObject) {
      formObject = JSON.parse(localStorage.formObject); // this provides two local variables
      // startMilliSeconds and endMilliSeconds so that default graph can be plotted on user's visit.
    } else {
      const dateAndTimeNow = new Date();
      const hrs = dateAndTimeNow.getHours();
      const mins = dateAndTimeNow.getMinutes();
      const seconds = dateAndTimeNow.getSeconds();
      formObject.endMilliSeconds = dateAndTimeNow.getTime();
      formObject.startMilliSeconds = formObject.endMilliSeconds -
        ((hrs*60 + mins)*60 + seconds) * 1000 - (86400000 * 6);
    }

    $('input[name="from"]').attr('value', new Date(formObject.startMilliSeconds + 86400000).toISOString().split('T')[0]);
    $('input[name="to"]').attr('value', new Date(formObject.endMilliSeconds + 86400000).toISOString().split('T')[0]);  
    // it takes few milliseconds after page load to load GoogleAuth. GoogleAuth gives us
    // access token to access fitness history of a user.
    waitUntilGoogleAuthReady();

    // setTimeOut until GoogleAuth is ready
    function waitUntilGoogleAuthReady() {
      setTimeout(() => {
        GoogleAuth ? fetchGoogleFitHistoryData() : waitUntilGoogleAuthReady();
      }, 100);
      // timeout of 100ms give enough time to GoogleAuth to complete set up
      // which is present in fit.js file
    }

    $('#fitHistoryForm').on('submit', (e) => {
        e.preventDefault();
        const form = document.getElementById('fitHistoryForm');
        let formData = new FormData(form);
        for ( let ent of formData.entries()) {
          // Overriding start and end timings
          if(ent[0] === "from") {
            formObject.startMilliSeconds = getMilliSeconds(ent[1]);
          }
          else if(ent[0] === "to") {
            formObject.endMilliSeconds = getMilliSeconds(ent[1]) + 86400000;
          }
        }
        if(formObject.startMilliSeconds >= formObject.endMilliSeconds) {
          alert('End date should be greater than the beginning date.');
          return;
        }

        // setting date values so that default graph can be shown
        localStorage.setItem('formObject', JSON.stringify(formObject));

        if(Object.keys(formObject).length >= 2) {
          counter = 0;
          $('.graphContainer').html('');
          fetchGoogleFitHistoryData();
        } else {
          alert('All the field were not provided');
        }
    });

    function getMilliSeconds(date) {
      const dateString = new Date(date);
      const hrs = dateString.getHours();
      const mins = dateString.getMinutes();
      const seconds = dateString.getSeconds();
      const milliseconds = dateString.getTime() - ((hrs*60 + mins)*60 + seconds) * 1000;
      return milliseconds;
    }

    function fetchGoogleFitHistoryData() {
      if (!navigator.onLine) {
        alert('Please check if you are online');
      }
      else if(!GoogleAuth.isSignedIn.Ab) {
        // signIn() prompts the user to sign in as well as asks for
        // API permissions as well (different from GoogleAuth.Q1())
        GoogleAuth.signIn();
        GoogleAuth.isSignedIn.listen(handleUserSignIn);
      }
      else if(!isAuthorized()) {
        GoogleAuth.Q1()   // Q1 prompts user to give MyL3 the access of fit data.
        .then(() => {
          displayData();
        });
      }
      else {
          displayData();
      }

      function handleUserSignIn() {
        if(GoogleAuth.isSignedIn.get()) {
          console.log('google user signed in');
          displayData();
        } else {
          console.log('google user signed out');
        }
      }
    
      function isAuthorized() {
        const user = GoogleAuth.currentUser.get();
        return user.hasGrantedScopes();
      }
    
      function displayData() {
        const user = GoogleAuth.currentUser.get();
        if(user.Zi.access_token) {
          // "token" is the access_token retrieved from OAuth 2.0
          token = user.Zi.access_token;
          bringData();
        } else {
          GoogleAuth.T8()
          .then((res) => {
            token = res.access_token;
            bringData();
          });
        }
      }
    
      function bringData() {
        const data = {
          "aggregateBy": [{
              "dataTypeName": dataTypes[counter]
          }],
          "bucketByTime": { "durationMillis":  86400000 },
          "startTimeMillis": formObject.startMilliSeconds,
          "endTimeMillis": formObject.endMilliSeconds
        };
        const url = 'https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate';
        $.ajax({
          statusCode: {
            500: function() {
              console.log(HTMLText[dataTypes[counter]] + ' not found');
              bringNextField();
            },
            400: function() {
              console.log(HTMLText[dataTypes[counter]] + ' not found');
              bringNextField();
            }
          },
          method: "POST",
          headers: {
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json'
          },
          url: url,
          data: JSON.stringify(data),
          dataType: 'json'
        })
          .done((res) => {
            handleFetchedData(res.bucket);
          });
      }

      function handleFetchedData(bucket) {
        try {
          const monthNameByNumber = [
            "Jan", "Feb", "Mar", "Apr", "May", "Jun",
            "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
          ];
          // dateArray will contain dates to be plotted on X-Axis
          let dateArray = [];
          const numberOfDays = (formObject.endMilliSeconds - formObject.startMilliSeconds)/86400000;
          for(let i=0; i<numberOfDays; i++) {
            var date = new Date(formObject.startMilliSeconds + i * 86400000)
            const month = date.getMonth();
            const day = date.getDate();
            dateArray.push(monthNameByNumber[month] + " " + day);
          }
          createValuesArray(bucket, dateArray);
          // function will create an array with values to be plotted on Y-axis
        }
        catch(err) {
          console.log(err);
        }
      }

      function createValuesArray(bucket, dateArray) {
        let nDayData = [];
        
        for(let i=0; i<bucket.length; i++) {
          if(bucket[i].dataset[0].point[0]) {
            const value = bucket[i].dataset[0].point[0].value[0];
            if(value.intVal) {
              nDayData.push(value.intVal);
            }
            else if(dataTypes[counter] === "com.google.height") {
              nDayData.push((value.fpVal*100).toFixed());
            }
            else {
              nDayData.push(value.fpVal.toFixed());
            }
          }
          else {
            nDayData.push(0);
          }
        }
        createGraph(nDayData, dateArray);
      }

      function createGraph(nDayData, dateArray) {
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
        // "random" will be used to select random colors
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
                  label: HTMLText[dataTypes[counter]],
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
                    labelString: HTMLText[dataTypes[counter]]
                  },
                  scaleFontColor: "#000",
                }]
              },
              responsive: true
            }
        });
        bringNextField();
      }

      function bringNextField() {
        if(counter<dataTypes.length-1) {
          ++counter;
          bringData();
        } else {
          WeatherHistory.plotWeatherHistory();
        }
      }
    }
};