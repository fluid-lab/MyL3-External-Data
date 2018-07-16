var GoogleAuth;
    
  function handleClientLoad() {
    // Load the API's client and auth2 modules.
    // Call the initClient function after the modules load.
    gapi.load('client:auth2', initClient);
  }

  function initClient() {

    // Initialize the gapi.client object, which app uses to make API requests.
    // Get API key and client ID from API Console.
    // 'scope' field specifies space-delimited list of access scopes.
    
    // SCOPE contans space separated links of APIs 
    // This is only for taking API permission
    var SCOPE = 'https://www.googleapis.com/auth/fitness.body.read\
    https://www.googleapis.com/auth/fitness.activity.read\
    https://www.googleapis.com/auth/fitness.location.read\
    https://www.googleapis.com/auth/fitness.nutrition.read\
    https://www.googleapis.com/auth/fitness.blood_pressure.read\
    https://www.googleapis.com/auth/fitness.blood_glucose.read\
    https://www.googleapis.com/auth/fitness.oxygen_saturation.read\
    https://www.googleapis.com/auth/fitness.body_temperature.read\
    https://www.googleapis.com/auth/fitness.reproductive_health.read';

    let apiKey, clientId;
    if(window.myL3.apiKeys.OAuthKey) {
      apiKey = window.myL3.apiKeys.OAuthKey;
    } else {
      apiKey = prompt("Please give API key for Google Fit");
    }

    if(window.myL3.apiKeys.clientId) {
      clientId = window.myL3.apiKeys.clientId;
    } else {
      clientId = prompt("Please give client id for Google Fit");
    }

    gapi.client.init({
        'apiKey': apiKey,
        'clientId': clientId,
        'scope': SCOPE
    })
      .then(function () {
      GoogleAuth = gapi.auth2.getAuthInstance();
      // How to use GoogleAuth? Detailed documentation is available at
      // https://developers.google.com/identity/protocols/OAuth2UserAgent
    });
  }

/*
  FOR LATER USE

      Listen for sign-in state changes.
      GoogleAuth.isSignedIn.listen(updateSigninStatus);

      Handle initial sign-in state. (Determine if user is already signed in.)
      var user = GoogleAuth.currentUser.get();
      setSigninStatus();

      Call handleAuthClick function when user clicks on
           "Sign In/Authorize" button.


  function setSigninStatus(isSignedIn) {
    var user = GoogleAuth.currentUser.get();
    var isAuthorized = user.hasGrantedScopes(SCOPE);
    if (isAuthorized) {
      $('#sign-in-or-out-button').html('Sign out');
      $('#revoke-access-button').css('display', 'inline-block');
      $('#auth-status').html('You are currently signed in and have granted ' +
          'access to this app.');
    } else {
      $('#sign-in-or-out-button').html('Sign In/Authorize');
      $('#revoke-access-button').css('display', 'none');
      $('#auth-status').html('You have not authorized this app or you are ' +
          'signed out.');
    }
  }

  function updateSigninStatus(isSignedIn) {
    setSigninStatus();
  }

  $('#sign-in-or-out-button').on('click', function() {
    if(GoogleAuth.isSignedIn.get()) {
      GoogleAuth.signOut();
      $('#sign-in-or-out-button').html('Sign In/Authorize');
      $('#revoke-access-button').hide();
    } else {
      // Function to prompt user to give permissions to access data.
      GoogleAuth.Q1()
        .then((data) => {
          console.log(data);
          $('#sign-in-or-out-button').html('Sign Out');
          $('#revoke-access-button').show();
        })
    }
  })

    $('#isAuthorized').on('click', () => {
      const user = GoogleAuth.currentUser.get();
      const isAuthorized = user.hasGrantedScopes();
      console.log(isAuthorized);
      alert(isAuthorized);
    });

    $('#revoke-access-button').on('click', function() {
      GoogleAuth.disconnect();
      $('#sign-in-or-out-button').html('Sign In/Authorize');
      $('#revoke-access-button').hide();
      console.log('disconnected');
    });

    $('#back').click(() => {
      this.location.href="/";
    });

    function handleAuthClick() {
      if (GoogleAuth.isSignedIn.get()) {
        // User is authorized and has clicked 'Sign out' button.
        GoogleAuth.signOut();
      } else {
        // User is not signed in. Start Google auth flow.
        GoogleAuth.signIn();
      }
    }

  https://developers.google.com/fit/rest/v1/data-types

  */