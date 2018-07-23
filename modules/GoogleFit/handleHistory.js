$(document).ready(() => {
    const maxDate = new Date().toISOString().split('T')[0];
    $('input[name="to"]').attr('max', maxDate);
    let dataToToggleGraph = {};
    let formObject = {};
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
        let dataType;
        for ( let ent of formData.entries()) {
          if(ent[0] === "from") {
            formObject.startMilliSeconds = getMilliSeconds(ent[1]);
          }
          else if(ent[0] === "to") {
            formObject.endMilliSeconds = getMilliSeconds(ent[1]) + 86400000;
          }
          else if(ent[0] === "fitness-field") {
            dataType = linksForValues[ent[1]];
            formObject.dataType = dataType;
          }
        }
        if(formObject.startMilliSeconds >= formObject.endMilliSeconds) {
          alert('End date should be greater than the beginning date.');
          return;
        }

        if(Object.keys(formObject).length === 3) {
          fetchGoogleFitHistoryData(dataType);
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

    function fetchGoogleFitHistoryData(dataType) {

      if (!navigator.onLine) {
        alert('Please check if you are online');
      }
      else if(!GoogleAuth) {
        alert('Loading...Please wait');
      }
      else if(!GoogleAuth.isSignedIn.Ab) {
        // signIn() prompts the user to sign in as well as asks for
        // API permissions as well (different from GoogleAuth.Q1())
        GoogleAuth.signIn();
        GoogleAuth.isSignedIn.listen(handleUserSignIn);
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
          bringData(user.Zi.access_token);
        } else {
          GoogleAuth.T8()
          .then((res) => {
            bringData(res.access_token);
          });
        }
        $('.fitnessDataContainer').show();
      }
    
      function bringData(token) {
        // "token" is the access_token retrieved from OAuth 2.0
        const data = {
          "aggregateBy": [{
            "dataTypeName": dataType
          }],
          "bucketByTime": { "durationMillis":  86400000 },
          "startTimeMillis": formObject.startMilliSeconds,
          "endTimeMillis": formObject.endMilliSeconds
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
          // function will create an array with values for Y-axis
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
        // removing and appending canvas to prevent overlapping of updated chart.
        $('#graph').html('');
        $('#graph').html('<canvas id="myChart"></canvas>');
        $("canvas").css({"backgroundColor": "black", "color": "white"});
        dataToToggleGraph.per_day_data = nDayData;
        dataToToggleGraph.dates = dateArray;
        dataToToggleGraph.current_chart = $('input[name="graphType"]:checked').val();
        const random = Math.floor(Math.random()*5);
        var ctx = document.getElementById("myChart").getContext('2d');
        var myChart = new Chart(ctx, {
            type: $('input[name="graphType"]:checked').val(),
            data: {
              labels: dateArray,
              datasets: [{
                  label: $('#fitness-field').children()[$('#fitness-field')[0].value].innerText,
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