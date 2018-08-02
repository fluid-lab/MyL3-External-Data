// this file is specific to fetch and show present fitness data
// first function i.e. fetchGoogleFitData() is container for all other functions.
// this function was called from app.js when user clicks on fetch "Fitness Data".
export class fitProvider {

  static fetchGoogleFitData(linksToFetch) {
  
    if(!GoogleAuth.isSignedIn.get()) {
      // signIn() prompts the user to sign in as well as asks for
      // API permissions as well (different from GoogleAuth.Q1())
      GoogleAuth.signIn();
      GoogleAuth.isSignedIn.listen(handleUserSignIn);
    } 
    else if(!isAuthorized()) {
      // Q1 prompts user to give MyL3 the access of fit data.
      // Remember, Q1 doesn't prompt user to sign
      GoogleAuth.Q1()
      .then((data) => {
        console.log(data);
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
        console.log(user.Zi);
        bringData(user.Zi.access_token, 0); // 0 is the value of counter
      } else {
        // this part is refreshing access token, hence T8
        GoogleAuth.T8()
        .then((res) => {
          console.log(res);
          bringData(res.access_token, 0);
        });
      }
      $('#spinner').hide();
      $('.fitnessDataContainer').show();
    }

    function bringData(token, counter) {
      // "token" is the access_token retrieved from OAuth 2.0
      // "counter" makes sure that all the data types are successfully fetched.
      const source = linksToFetch[counter];
      const date = new Date();
      const milliSecondsFromMidnight = ((date.getHours() * 60 + date.getMinutes())*60 + date.getSeconds())*1000;
      const currentTime = date.getTime();
      const data = {
        "aggregateBy": [{
          "dataTypeName": source
        }],
        "bucketByTime": { "durationMillis":  milliSecondsFromMidnight },
        "startTimeMillis": currentTime - milliSecondsFromMidnight,
        // currentTime - milliSecondsFromMidnight is exact midnight timings.
        "endTimeMillis": currentTime
      };
      const url = 'https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate';
      $.ajax({
        statusCode: {
          500: () => {
            if(counter == linksToFetch.length - 1) {
              $('#mySidenav').show();
            }
            if(counter<linksToFetch.length-1) {
              bringData(token, ++counter);
            }
            showResult('error', source);
          },
          400: () => {
            if(counter == linksToFetch.length - 1) {
              $('#mySidenav').show();
            }
            if(counter<linksToFetch.length-1) {
              bringData(token, ++counter);
            }
            showResult('error', source);
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
          console.log(res);
          try {
            const bucket = res.bucket;
            showResult(bucket[bucket.length - 1].dataset[0].point[0].value[0], source);
          }
          catch(err) {
            console.log(err);
            showResult('error', source);
            $('#spinner').hide();
          }
          if(counter<linksToFetch.length-1) {
            bringData(token, ++counter);  // Recursion (using "counter")
          }
          if(counter == linksToFetch.length - 1) {
            $('#mySidenav').show();
          }
        });
    }

    function showResult(value, source) {
      let finalValue;
      if(value !== 'error') {
        value.intVal ? finalValue = value.intVal : finalValue = value.fpVal.toFixed(2);
      }

      // if "source" contians height at the end then proceed
      if(/height$/.test(source)) {
        if(value === 'error') {
          $('#height').html('Your height was not found.');
        } else {
          $('#height').html(`You are ${Math.floor(finalValue * 100)} meters tall`);
        }
        $('#height').show(500);
      }
      else if(/weight$/.test(source)) {
        if(value === 'error') {
          $('#weight').html(`Your weight was not found.`);
        } else {
          $('#weight').html(`Your weight is ${Math.floor(finalValue)} kilograms`);
        }
        $('#weight').show(500);
      }
      else if(/distance.delta$/.test(source)) {
        if(value === 'error') {
          $('#distance').html(`No distance covered yet.`);
        } else {
          $('#distance').html(`Covered a total distance of ${Math.floor(finalValue)} meters today`);
        }
        $('#distance').show(500);
      }
      else if(/calories/.test(source)) {
        if(value === 'error') {
          $('#calories_spent').html('Calories spent data not available.');
        } else {
          $('#calories_spent').html(`Congrats! ${Math.floor(finalValue)} calories were expended today`);
        }
        $('#calories_spent').show(500);
      }
      else if(/step_count/.test(source)) {
        if(value === 'error') {
          $('#steps_count').html('No steps taken.');
        } else {
          $('#steps_count').html(`You took a total of ${finalValue} steps today.`);
        }
        $('#steps_count').show(500);
      }
      else if(/bpm$/.test(source)) {
        if(value === 'error') {
          $('#bpm').html('Pulse rate data not available.');
        } else {
          $('#bpm').html(`Today's recorded pulse rate is ${finalValue} beats per minute(bpm).`);
        }
        $('#bpm').show(500);
      }
      else if(/pedaling/.test(source)) {
        if(value === 'error') {
          $('#cycle_cad').html('Please do cycling to query paddling speed.');
        } else {
          $('#cycle_cad').html(`Bicycle paddling cadence was ${finalValue} revolutions per minute(rpm).`);
        }
          $('#cycle_cad').show(500);
      }
      else if(/rpm$/.test(source)) {
          if(value === 'error') {
            $('#wheel_rpm').html('Cycling wheel speed?? You have not done cycling today.');
          } else {
            $('#wheel_rpm').html(`Average cycling wheel speed ${finalValue} revolutions per minute(rpm).`);
          }
          $('#wheel_rpm').show(500);
      }
    }
  }
}