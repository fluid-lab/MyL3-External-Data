// this file is used while fetching current fitness data
// as well as fitness history of learners.

// GoogleAuth (A JavaScript object) is used to take permission 
// from user so that access token can be generated for OAuth.
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
  https://www.googleapis.com/auth/fitness.activity.read';

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
