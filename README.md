# MyL3-External-Data
### GSoC 2018 project

This project aims to import useful data about learners from external sources (By taking their permission). Data sources that will be researched and prototyped include:

* Import Weather data
* Import Map, Location data
* Import Google Fit data
* Import Facebook Status

For more info visit [MyL3 page of the Fluid wiki](https://wiki.fluidproject.org/display/fluid/%28Floe%29+Preference+Exploration+and+Self-Assessment)

Steps to run this project locally:

* How to get API keys:
    * [Openweathermap API key](https://openweathermap.desk.com/customer/portal/articles/1626888-how-to-get-api-key)
    * [Air Visual API key](https://airvisual.com/user/api)
    * Enable "Maps JavaScript API" by creating a new project on Google Cloud Platform. More about how to get [Google maps key](https://developers.google.com/maps/documentation/javascript/get-api-key)

    Don't restrict Goolge Map API key. Under Key restrictions > Application restrictions select "None". Restricting this key causes error sometimes.
    * We have to use "Geocoding API" to provide location information. Enable Geocoding API for Google map as well.
    Remember the API key will be same for both "Maps JavaScript API" and "Geocoding API".
    * To get fitness API key and client ID, visit same google cloud project which you have set up for Google Map key.
        * Visit APIs and Services > Library
        * search for Fitness API, enable it
        * Go to APIs and Services > Credentials > OAuth 2.0 client IDs
          
          You'll get client ID and API key (client secret) by clicking on web project which you have set up for MyL3
        * Goto credentials, now select web client for this project.
          Under Restriction > Authorized JavaScript origins
        
        * Add links to localhost urls where you'll run you project locally (Only specified URLs will be able to access Fitness API through you API credentials) e.g. http://localhost:3000 and https://developers.google.com . You can add more than one websites urls.

        * More about fitness API is explained in [Google Fit API documentation](https://developers.google.com/fit/rest/)


* Clone repo and open project folder in terminal

    ``` git clone https://github.com/jeevan-jp/MyL3-External-Data.git ```

* Once you have all API keys, client id ready, you have to create a new file name apiKeys.js in modules folder. Copy contents from apiKeysTemplate.js into newly created file. add all the keys corresponding to the names. Following variables are there-

    * openweathermapKey: Key from Open weather map API.
    * googleMapKey: Goolgle Map API key form Google Cloud Platfrom
    * OAuthKey: OAuth 2.0 web client secret.
    * clientId: OAuth 2.0 web client ID.
    * airVisualKey: Key for Air Visual API.

* A local webserver is needed (for error free viewing), http-server is a good option.
Install http-server globally using the following command:

    ``` npm install http-server -g ```

    Mac and Linux users may need to add sudo at the beginning:

    ``` sudo npm install http-server -g ```

    If npm isn't working [download and install node](https://nodejs.org/en/).

* After installation type the following command in terminal:

    ``` http-server -p 3000 ```

* Visit ```http://localhost:3000``` in your browser.

### Important libraries used to bring google fit data:

* Google OAuth 2.0 : Name of script file used is api.js and this is the link to it.
        
      <script src="https://apis.google.com/js/api.js"></script>
* Chart.js to show fitness history in the form of line or bar graph. CDN used for chart.js
        
      <script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.7.2/Chart.min.js"></script>

### Type of OAuth 2.0 used: 

* client-side Web Applications :  https://developers.google.com/identity/protocols/OAuth2UserAgent

* For this project you don’t have to read any other documentation except the documentation for javascript applications.

### Using OAuth 2.0 Playground (optional)

GET or POST request to the fitness API can be made simply through Google OAuth 2.0 Playground: https://developers.google.com/oauthplayground/
Using OAuth playground is one of easiest way to visualise the response and make changes to our requests accordingly.

Access of OAuth 2.0 should be given to https://developers.google.com as I explained in fitness key set up part.

### Few Global Variables explained
Upto this point our global Variable "myL3" contains 3 API keys 1 client_id(OAuth), two variable's names myL3.oneTimeWeatherData and myL3.isMapAvailable variables.

myL3.oneTimeWeatherData is used to get store the weather data retrieved so that it can be used in other parts without making the API call again.

### Disconnect users:
To test OAuth prompt which is shown to take api permission more than once: Don’t clear browser history and data. Instead you should use GoogleAuth.signOut() or GoogleAuth.disconnect() in browser console to sign out the user from MyL3. Because GoogleAuth is a global variable.

## About Openweathermap: 
OpenWeatherMap weather service is based on the [VANE Geospatial Data Science](http://owm.io/) platform for collecting, processing, and distributing information about our planet through easy to use tools and APIs.
Ideology is inspired by OpenStreetMap and Wikipedia that make information free and available for everybody. OpenWeatherMap provides wide range of weather data such as map with current weather, week forecast, precipitation, wind, clouds, data from weather Stations and many others. Weather data is received from global Meteorological broadcast services and more than 40,000 weather stations. (courtesy: [Stack overflow](https://stackoverflow.com/questions/26804596/openweathermap-api-vs-wunderground-api))

## Reverse Geocoding
Reverse geocoding is the process of back coding of a point location to a readable address or place name. This permits the identification of nearby street addresses, places, and/or areal subdivisions such as neighbourhoods, county, state, or country.

We have used Geocoding API of Google Maps JavaScript API to implement reverse geocoding. Refer to [Geocoding API documentation](https://developers.google.com/maps/documentation/javascript/examples/geocoding-reverse) for more.
Link to make JSON request:

    https://maps.googleapis.com/maps/api/js?key={{YOUR_API_KEY}}

## Air Pollution API used:

In the beginning we tried to using openaq API because it was free and open source. But it does not provode us current air pollution data and also they have very limited coverage as well. That’s why we used Air Visual.

Airvisual is one of the trusted APIs which provide us free API (with restriction on API calls) and it has more coverage than openaq. You’ll have to register and get free API key to see documentation.

REST API endpoint used:

    https://api.airvisual.com/v2/nearest_city?lat={LATITUDE}&lon={LONGITUDE}&key={YOUR_API_KEY}


### Youtube
It is highly recommended to watch how to deal with Google FIt Rest API:
https://youtu.be/YMRhBPGLgmE
