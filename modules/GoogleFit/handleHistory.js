$(document).ready(() => {
    let dataToToggleGraph = {};
    $('#fitHistoryForm').on('submit', (e) => {
        e.preventDefault();
        const form = document.getElementById('fitHistoryForm');
        let formData = new FormData(form);
        
        const linksForValues = {
            1: "com.google.height",
            2: "com.google.weight",
            3: "com.google.distance.delta",
            4: "com.google.calories.expended",
            5: "com.google.step_count.delta",
            6: "com.google.heart_rate.bpm",
            7: "com.google.cycling.pedaling.cadence",
            8: "com.google.cycling.wheel_revolution.rpm"
        }
        let days, dataType;
        let formObject = {};
        for ( let ent of formData.entries()) {
          console.log(ent);
          if(ent[0] === "from") {
            formObject.startMilliSeconds = getMilliSeconds(ent[1]);
          }
          else if(ent[0] === "to") {
            formObject.endMilliSeconds = getMilliSeconds(ent[1]);
          }
          else if(ent[0] === "days") {
            days = ent[1];
          }
          else if(ent[0] === "fitness-field") {
            dataType = linksForValues[ent[1]];
            formObject.dataType = dataType;
          }
        }
        if(Object.keys(formObject).length === 3) {
          fetchGoogleFitData(days, dataType);
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

    function fetchGoogleFitData(days, dataType) {
      console.log(days, dataType);

      if (!navigator.onLine) {
        alert('Please check if you are online');
      }
      else if(!GoogleAuth) {
        alert('Loading...Please wait');
      }
      else if(!GoogleAuth.isSignedIn.Ab) {
          GoogleAuth.signIn();
          return;
      } 
      else if(!isAuthorized()) {
        GoogleAuth.Q1()   // Q1 prompts user to give MyL3 the access of fit data.
        .then((data) => {
          displayData();
        });
      }
      else {
          displayData();
      }
    
      function isAuthorized() {
        const user = GoogleAuth.currentUser.get();
        return user.hasGrantedScopes();
      }
    
      function displayData() {
        const user = GoogleAuth.currentUser.get();
        if(user.Zi.access_token) {
          bringData(user.Zi.access_token);
        } else {
          GoogleAuth.T8()
          .then((res) => {
            bringData(res.access_token);
          });
        }
        $('.fitnessDataContainer').show();
      }

      function startAndEndTime() {
        let bothTimings = {};
        const milliSecondsFromMidnight = (new Date().getHours() * 60 + new Date().getMinutes())*60*1000;
        const currentTime = new Date().getTime();
        // We want previous 5 days data till last midnight
        bothTimings.startTime =  currentTime - milliSecondsFromMidnight - days * 86400000;
        const milliSecsInFiveDays = 432000000;
        bothTimings.endTime = bothTimings.startTime + milliSecsInFiveDays;
        return bothTimings;
      }
    
      function bringData(token) {
        // "token" is the access_token retrieved from OAuth 2.0
        const bothTimings = startAndEndTime();
        const data = {
          "aggregateBy": [{
            "dataTypeName": dataType
          }],
          "bucketByTime": { "durationMillis":  86400000 },
          "startTimeMillis": bothTimings.startTime,
          "endTimeMillis": bothTimings.endTime
        };
        const url = 'https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate';
        $.ajax({
          statusCode: {
            500: function() {
                createGraph([], []);
                alert('Not Found');
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
            handleFetchedData(res.bucket, bothTimings);
          });
      }

      function handleFetchedData(bucket, bothTimings) {
        try {
          const monthNameByNumber = [
            "Jan", "Feb", "Mar", "Apr", "May", "Jun",
            "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
          ]
          let dateArray = [];
          for(let i=0; i<5; i++) {
            var date = new Date(bothTimings.startTime + i * 86400000)
            const month = date.getMonth();
            const day = date.getDate();
            dateArray.push(monthNameByNumber[month] + " " + day);
          }
          createValuesArray(bucket, dateArray);
          // function will create an array with values for Y-axis
        }
        catch(err) {
          console.log(err);
        }
      }

      function createValuesArray(bucket, dateArray) {
        let nDayData = [];
        
        for(let i=0; i<bucket.length; i++) {
          if(bucket[bucket.length - i - 1].dataset[0].point[0]) {
            const value = bucket[bucket.length - i - 1].dataset[0].point[0].value[0];
            if(value.intVal) {
              nDayData.push(value.intVal);
            } else {
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
        // removing and appending canvas to prevent overlapping of updated chart.
        $('#graph').html('');
        $('#graph').html('<canvas id="myChart" height="400"></canvas>');
        dataToToggleGraph.per_day_data = nDayData;
        dataToToggleGraph.dates = dateArray;
        dataToToggleGraph.current_chart = $('input[name="graphType"]:checked').val();
        var ctx = document.getElementById("myChart").getContext('2d');
        var myChart = new Chart(ctx, {
            type: $('input[name="graphType"]:checked').val(),
            data: {
              labels: dateArray,
              datasets: [{
                  label: $('#fitness-field').children()[$('#fitness-field')[0].value].innerText,
                  data: nDayData,
                  backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(75, 192, 192, 0.2)'
                  ],
                  borderColor: [
                    'rgba(255,99,132,1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(75, 192, 192, 1)'
                  ],
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
                    labelString: $('#fitness-field').children()[$('#fitness-field')[0].value].innerText
                  }
                }]
              },
              responsive: true
            }
        });
      }

      // Code to toggle graphs
      $('#line_g').on('click', () => {
        if(dataToToggleGraph.current_chart === 'bar') {
          createGraph(dataToToggleGraph.per_day_data, dataToToggleGraph.dates);
        }
      });

      $('#bar_g').on('click', () => {
        if(dataToToggleGraph.current_chart === 'line') {
          createGraph(dataToToggleGraph.per_day_data, dataToToggleGraph.dates);
        }
      });
    }
});