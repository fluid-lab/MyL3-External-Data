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
    * [Google maps key](https://developers.google.com/maps/documentation/javascript/get-api-key)
    * To get fitness API key and client ID, visit same google cloud project which you have set up for Google Map key.
        * Visit APIs and Services > Library
        * search for Fitness API, enable it
        * Go to APIs and Services > Credentials > OAuth 2.0 client IDs
          
          You'll get client ID and API key (client secret) by clicking on web project which you have set up for MyL3


* Clone repo and open project folder in terminal

    ``` git clone https://github.com/jeevan-jp/MyL3-External-Data.git ```

* If you have all API keys

* A local webserver is needed (for error free viewing), http-server is a good option.
Install http-server globally using the following command:

    ``` npm install http-server -g ```

    Mac and Linux users may need to add sudo at the beginning:

    ``` sudo npm install http-server -g ```

    If npm isn't working [download and install node](https://nodejs.org/en/).

* After installation type the following command in terminal:

    ``` http-server -p 3000 ```

* Type ```http://localhost:3000``` in your browser address bar and press enter.
