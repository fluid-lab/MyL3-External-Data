# MyL3-External-Data
### GSoC 2018 project

This project aims to import useful data about learners from external sources (By taking their permission). Data sources that will be researched and prototyped include:

* Import Weather data
* Import Map/Location data
* Import Google Fit data
* Import FitBit data
* Import Facebook Status

For more info visit [MyL3 page of the Fluid wiki](https://wiki.fluidproject.org/display/fluid/%28Floe%29+Preference+Exploration+and+Self-Assessment)

## Importing location and weather data:

### Configuring API keys
To configure the API keys, copy apiKeysTemplate.js to apiKeys.js and replace the API key placeholders "REPLACE THIS" with the appropriate keys.

Steps to run the project in PC:

* Clone repo and open project folder in terminal

    ``` git clone https://github.com/jeevan-jp/MyL3-External-Data.git ```

* Install http-server globally using the following command

    ``` npm install http-server -g ```

    If npm isn't working [download and install node](https://nodejs.org/en/).

* After installation type the following command in terminal:

    ``` http-server -p 3000 ```

* Type ```localhost: 3000``` in your browser address bar and hit enter.
